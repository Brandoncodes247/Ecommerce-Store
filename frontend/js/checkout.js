import { getCart, setCart, updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import { checkAuthForCheckout } from './components/auth.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('checkout.js: DOMContentLoaded - Initializing checkout page.');
  // Ensure the user is logged in before proceeding with checkout
  if (!checkAuthForCheckout()) {
    console.log('checkout.js: User not authenticated, redirecting to index.html.');
    // checkAuthForCheckout will display toast and auth modal
    // We'll also redirect after a short delay to allow the toast/modal to show
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Get cart data
  const cart = getCart();
  console.log('checkout.js: Initial cart content:', cart);

  if (!cart || cart.length === 0) {
    showToast('Your cart is empty. Redirecting to shopping page.', 'info');
    console.log('checkout.js: Cart is empty, redirecting to index.html.');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Calculate total
  let subtotal = 0;
  cart.forEach(item => {
    const price = parseFloat(item.price);
    const qty = parseInt(item.qty);
    
    if (!isNaN(price) && !isNaN(qty)) {
      subtotal += price * qty;
    } else {
      console.warn(`checkout.js: Skipping item ${item.name} due to invalid price or quantity.`);
    }
  });

  // Add shipping and tax
  const shipping = 500; // Fixed shipping cost
  const tax = Math.round(subtotal * 0.16); // 16% tax
  const total = subtotal + shipping + tax;

  // Display summary amounts
  document.getElementById('subtotal-amount').textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById('shipping-amount').textContent = `KES ${shipping.toLocaleString()}`;
  document.getElementById('tax-amount').textContent = `KES ${tax.toLocaleString()}`;
  document.getElementById('total-amount').textContent = `KES ${total.toLocaleString()}`;
  console.log('checkout.js: Final calculated total:', total);

  // Display cart items
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
    console.log('checkout.js: Rendered cart items.');
  } else {
    console.error('checkout.js: Cart items container not found.');
  }

  // Handle payment method selection
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function() {
      console.log('checkout.js: Payment method changed to:', this.value);
      document.querySelectorAll('.payment-details').forEach(detailDiv => {
        detailDiv.classList.remove('active');
      });
      document.getElementById(this.value + '-details').classList.add('active');
    });
  });

  // Handle payment
  document.getElementById('pay-button').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('checkout.js: Pay Now button clicked.');
    
    // Basic validation for shipping form
    const shippingForm = document.getElementById('shipping-form');
    const inputs = shippingForm.querySelectorAll('input[required]');
    let allFieldsFilled = true;
    inputs.forEach(input => {
      // Check if the input is visible or part of a hidden payment details section
      const parentPaymentDetails = input.closest('.payment-details');
      const isPaymentDetailHidden = parentPaymentDetails && !parentPaymentDetails.classList.contains('active');

      console.log(`Validating input: ${input.id || input.name}, Type: ${input.type}, Is Hidden Payment Detail: ${isPaymentDetailHidden}, Current Value: '${input.value}'`); // More detailed log

      if (isPaymentDetailHidden) {
        // Skip validation for hidden payment details
        input.classList.remove('error'); // Ensure no error styling remains from previous attempts
        console.log(`Skipping hidden payment detail: ${input.id || input.name}`); // Log skipped fields
        return;
      }

      if (input.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
        if (!Array.from(radioGroup).some(radio => radio.checked)) {
          allFieldsFilled = false;
          console.log(`Validation error: Radio group ${input.name} has no selection.`); // Log radio error
        }
      } else if (!input.value.trim()) {
        allFieldsFilled = false;
        input.classList.add('error');
        console.log(`Validation error: Visible field ${input.id || input.name} is empty.`); // Log empty visible field
      } else {
        input.classList.remove('error');
        console.log(`Validation success: ${input.id || input.name} is filled.`); // Log successful validation
      }
    });

    if (!allFieldsFilled) {
      showToast('Please fill in all required details.', 'error');
      console.log('Validation failed: allFieldsFilled is false.'); // Log final validation status
      return;
    }

    showToast('Processing payment...', 'info');
    setTimeout(() => {
      showToast('Payment successful!', 'success');
      setCart([]);
      updateCartCount();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }, 2000);
  });
}); 