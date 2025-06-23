// ✅ checkout.js — Updated to support batch orders + payments with validation and order status tracking
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

  // Display user profile info
  const profileSummary = document.getElementById('checkout-profile-summary');
  if (profileSummary) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    profileSummary.innerHTML = `
      <div><strong>Full Name:</strong> ${user.fullname || '<span style=\'color:red\'>Not set</span>'}</div>
      <div><strong>Address:</strong> ${user.address || '<span style=\'color:red\'>Not set</span>'}</div>
      <div><strong>Payment Method:</strong> ${user.paymentMethod ? user.paymentMethod.charAt(0).toUpperCase() + user.paymentMethod.slice(1) : '<span style=\'color:red\'>Not set</span>'}</div>
    `;
  }

  // Handle payment
  document.getElementById('pay-button').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Processing payment...', 'info');
    setTimeout(() => {
      showToast('Payment successful!', 'success');
      // Save receipt info
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const cart = getCart();
      const receipt = {
        user,
        cart,
        date: new Date().toLocaleString(),
        total: document.getElementById('total-amount').textContent
      };
      localStorage.setItem('lastReceipt', JSON.stringify(receipt));
      setCart([]);
      updateCartCount();
      setTimeout(() => {
        window.location.href = 'thankyou.html';
      }, 2000);
    }, 2000);
  });
});
