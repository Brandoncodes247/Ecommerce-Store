import {
  renderProducts,
  setupSearch
} from './components/products.js?v=2';

import { renderCart, updateQty, removeFromCart } from './components/cart.js';

import {
  updateAuthButton,
  handleLogin,
  handleSignup,
  logout,
  checkAuthForCheckout
} from './components/auth.js';

import { setupDarkModeToggle, setupBackToTop } from './components/theme.js';
import { updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import './utils/global.js'; // global utilities

// Expose cart functions globally for cart page button onclick handlers
import * as cart from './components/cart.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛠️ Initializing application...');

  // 👉 Product Page
  const productList = document.getElementById('product-list');
  if (productList) {
    console.log('📦 Setting up product list...');
    renderProducts();       // Fetch and render products
    setupSearch();          // Enable live search
  }

  // 🛒 Cart
  updateCartCount();
  if (document.getElementById('cart-items')) {
    console.log('🛒 Initializing cart...');
    renderCart();
  }

  // 🔐 Auth
  updateAuthButton();

  const loginForm = document.getElementById('login-form')?.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signup-form')?.querySelector('form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // 🌙 Dark Mode + Back to Top
  setupDarkModeToggle();
  setupBackToTop();

  // ❌ Close Product Modal
  const closeModal = document.getElementById('close-modal');
  const modal = document.getElementById('product-modal');
  if (closeModal && modal) {
    closeModal.onclick = () => (modal.style.display = 'none');
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  }

  // ❌ Close Auth Modal
  const closeAuthModal = document.getElementById('close-auth-modal');
  const authModal = document.getElementById('auth-modal');
  if (closeAuthModal && authModal) {
    closeAuthModal.onclick = () => (authModal.style.display = 'none');
    authModal.onclick = e => { if (e.target === authModal) authModal.style.display = 'none'; };
  }

  // 🔄 Auth Tab Switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      document.getElementById('login-form').style.display = 'none';
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById(`${this.dataset.tab}-form`).style.display = 'block';
    });
  });

  // 🔓 Open Auth Modal on Login Btn Click
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      document.getElementById('auth-modal').style.display = 'flex';
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('signup-form').style.display = 'none';
    });
  }

  // ✅ Checkout Page Auth Check
  if (window.location.pathname.includes('checkout.html')) {
    checkAuthForCheckout();
  }

  // Cart page: Add event listeners for clear cart and checkout buttons
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      window.app.setCart([]);
      window.app.renderCart();
      window.app.showToast('Cart cleared!');
    });
  }
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!cart.length) {
        window.app.showToast('Your cart is empty!', 'error');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  console.log('✅ App initialized successfully');
});
