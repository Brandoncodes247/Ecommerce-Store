// ✅ checkout.js — Updated to support batch orders + payments
import { getCart, setCart, updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import { checkAuthForCheckout } from './components/auth.js';

document.addEventListener('DOMContentLoaded', function () {
  if (!checkAuthForCheckout()) {
    showToast('Please log in to continue checkout.', 'error');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

  const cart = getCart();
  if (!cart || cart.length === 0) {
    showToast('Your cart is empty. Redirecting...', 'info');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

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
    cartItemsContainer.innerHTML = cart.map(item => {
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
    }).join('');
  }

  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.payment-details').forEach(div => div.classList.remove('active'));
      document.getElementById(this.value + '-details').classList.add('active');
    });
  });

  document.getElementById('pay-button').addEventListener('click', async function (e) {
    e.preventDefault();

    const shippingForm = document.getElementById('shipping-form');
    const inputs = shippingForm.querySelectorAll('input[required]');
    let allFieldsFilled = true;

    inputs.forEach(input => {
      const parent = input.closest('.payment-details');
      const hidden = parent && !parent.classList.contains('active');
      if (hidden) return;
      if (!input.value.trim()) {
        input.classList.add('error');
        allFieldsFilled = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (!allFieldsFilled) {
      showToast('Please fill in all required details.', 'error');
      return;
    }

    showToast('Processing your order...', 'info');

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.qty,
        price: parseFloat(item.price)
      })),
      totalAmount: total
    };

    try {
      const response = await fetch('http://localhost:3001/api/order/Order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const result = await response.json();
        showToast('✅ Order placed successfully!', 'success');
        console.log('Order created:', result);

        setCart([]);
        updateCartCount();

        setTimeout(() => {
          window.location.href = `thankyou.html?orderId=${result.id}`;
        }, 2000);
      } else {
        showToast('❌ Order failed. Try again.', 'error');
      }
    } catch (err) {
      console.error('checkout.js: order placement error:', err);
      showToast('❌ Network error during order.', 'error');
    }
  });
});