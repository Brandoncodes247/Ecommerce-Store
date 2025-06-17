import { renderProducts, renderCategoryFilter, setupSearch, openProductModal } from './components/products.js';
import { renderCart, addToCart, updateQty, removeFromCart } from './components/cart.js';
import { updateAuthButton, handleLogin, handleSignup, logout, checkAuthForCheckout } from './components/auth.js';
import { setupDarkModeToggle, setupBackToTop } from './components/theme.js';
import { updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import './utils/global.js'; // Import global utilities
import { products } from './config/products.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing application...');

  // Setup product-related functionality
  if (document.getElementById('product-list')) {
    console.log('Setting up product list...');
    renderCategoryFilter();
    renderProducts();
    setupSearch();
  }

  // Setup cart-related functionality
  updateCartCount();
  if (document.getElementById('cart-items')) {
    console.log('Setting up cart...');
    renderCart();
  }

  // Setup auth-related functionality
  updateAuthButton();
  const loginForm = document.getElementById('login-form')?.querySelector('form');
  const signupForm = document.getElementById('signup-form')?.querySelector('form');
  if (loginForm) {
    console.log('Setting up login form...');
    loginForm.addEventListener('submit', handleLogin);
  }
  if (signupForm) {
    console.log('Setting up signup form...');
    signupForm.addEventListener('submit', handleSignup);
  }

  // Setup theme-related functionality
  setupDarkModeToggle();
  setupBackToTop();

  // Setup modal close buttons
  const closeModal = document.getElementById('close-modal');
  const modal = document.getElementById('product-modal');
  if (closeModal && modal) {
    closeModal.onclick = () => (modal.style.display = 'none');
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  }

  const closeAuthModal = document.getElementById('close-auth-modal');
  const authModal = document.getElementById('auth-modal');
  if (closeAuthModal && authModal) {
    closeAuthModal.onclick = () => (authModal.style.display = 'none');
    authModal.onclick = e => { if (e.target === authModal) authModal.style.display = 'none'; };
  }

  // Setup authentication tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById(this.dataset.tab + '-form').style.display = 'block';
    });
  });

  // Handle login/signup button clicks
  document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('auth-modal').style.display = 'flex';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
    document.querySelector('.auth-tab[data-tab="signup"]').classList.remove('active');
  });

  // Setup clear cart button
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      console.log('Clear Cart button clicked.');
      app.setCart([]);
      app.renderCart();
      app.showToast('Cart cleared');
    });
  }

  // Setup checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      console.log('Proceed to Checkout button clicked.');
      window.location.href = 'checkout.html';
    });
  }

  // For checkout page, ensure user is logged in
  if (window.location.pathname.includes('checkout.html')) {
    checkAuthForCheckout();
  }

  console.log('Application initialized successfully!');
}); 