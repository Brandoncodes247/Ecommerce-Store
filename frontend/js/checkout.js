// checkout.js
import { getCart, setCart, updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import { checkAuthForCheckout } from './components/auth.js';

document.addEventListener('DOMContentLoaded', function () {
  console.log('checkout.js: DOMContentLoaded - Initializing checkout page.');

  if (!checkAuthForCheckout()) {
    showToast('Please log in to continue checkout.', 'error');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

  const cart = getCart();
  console.log('checkout.js: Initial cart content:', cart);

  if (!cart || cart.length === 0) {
    showToast('Your cart is empty. Redirecting to shopping page.', 'info');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

  // Calculate totals
  let subtotal = 0;
  cart.forEach(item => {
    const price = parseFloat(item.price);
    const qty = parseInt(item.qty);
    if (!isNaN(price) && !isNaN(qty)) subtotal += price * qty;
  });

  const shipping = 500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  document.getElementById('subtotal-amount').textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById('shipping-amount').textContent = `KES ${shipping.toLocaleString()}`;
  document.getElementById('tax-amount').textContent = `KES ${tax.toLocaleString()}`;
  document.getElementById('total-amount').textContent = `KES ${total.toLocaleString()}`;

  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = cart
      .map(item => {
        const imageUrl = item.imageUrl || item.image || '';
        return `
          <div class="cart-item">
            <img src="${imageUrl}" alt="${item.name}">
            <div class="cart-item-details">
              <h3>${item.name}</h3>
              <p>KES ${Number(item.price).toLocaleString()} × ${item.qty}</p>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Handle payment method UI toggle
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.payment-details').forEach(div => div.classList.remove('active'));
      document.getElementById(this.value + '-details').classList.add('active');
    });
  });

  // Handle Pay Now button
  document.getElementById('pay-button').addEventListener('click', async function (e) {
    e.preventDefault();

    const shippingForm = document.getElementById('shipping-form');
    const inputs = shippingForm.querySelectorAll('input[required]');
    let allFieldsFilled = true;

    inputs.forEach(input => {
      const parent = input.closest('.payment-details');
      const hidden = parent && !parent.classList.contains('active');

      if (hidden) {
        input.classList.remove('error');
        return;
      }

      if (input.type === 'radio') {
        const group = document.querySelectorAll(`input[name="${input.name}"]`);
        if (![...group].some(r => r.checked)) {
          allFieldsFilled = false;
        }
      } else if (!input.value.trim()) {
        allFieldsFilled = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (!allFieldsFilled) {
      showToast('Please fill in all required details.', 'error');
      return;
    }

    showToast('Processing your order...', 'info');

    const cart = getCart();
    for (const item of cart) {
      const order = {
        product: {
          id: item.id,
          price: item.price
        },
        quantity: item.qty
      };

      try {
        const res = await fetch('http://localhost:3001/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });

        if (res.ok) {
          showToast(`✅ Order placed for ${item.name}`, 'success');
        } else {
          showToast(`❌ Failed to place order for ${item.name}`, 'error');
        }
      } catch (err) {
        console.error(`Error placing order for ${item.name}:`, err);
        showToast('❌ Network error while placing order.', 'error');
      }
    }

    // Finalize checkout
    setCart([]);
    updateCartCount();
    setTimeout(() => {
      window.location.href = 'thankyou.html';
    }, 2000);
  });
});