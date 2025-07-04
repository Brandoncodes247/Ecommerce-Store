import { renderProducts, setupSearch } from './components/products.js';
import { renderCart, updateQty, removeFromCart } from './components/cart.js';
import authInstance from './components/auth.js'; // Import the instance directly
import { setupDarkModeToggle, setupBackToTop } from './components/theme.js';
import { updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';

// No need to create new instance - use the imported one directly
const auth = authInstance;

// Expose necessary functions globally for HTML onclick handlers
window.app = {
  updateQty,
  removeFromCart,
  showToast,
  setCart: (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    updateCartCount();
  },
  renderCart: () => {
    if (document.getElementById('cart-items')) {
      renderCart();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛠️ Initializing application...');

  // Product Page
  const productList = document.getElementById('product-list');
  if (productList) {
    console.log('📦 Setting up product list...');
    renderProducts();
    setupSearch();
  }

  // Cart
  updateCartCount();
  if (document.getElementById('cart-items')) {
    console.log('🛒 Initializing cart...');
    renderCart();
  }

  // Dark Mode + Back to Top
  setupDarkModeToggle();
  setupBackToTop();

  //  Close Product Modal
  const closeModal = document.getElementById('close-modal');
  const modal = document.getElementById('product-modal');
  if (closeModal && modal) {
    closeModal.onclick = () => (modal.style.display = 'none');
    modal.onclick = e => { 
      if (e.target === modal) modal.style.display = 'none'; 
    };
  }

  //  Close Auth Modal
  const closeAuthModal = document.getElementById('close-auth-modal');
  const authModal = document.getElementById('auth-modal');
  if (closeAuthModal && authModal) {
    closeAuthModal.onclick = () => (authModal.style.display = 'none');
    authModal.onclick = e => { 
      if (e.target === authModal) authModal.style.display = 'none'; 
    };
  }

  // 🔄 Auth Tab Switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const forms = ['login', 'signup'];
      forms.forEach(form => {
        const el = document.getElementById(`${form}-form`);
        if (el) el.style.display = 'none';
      });
      
      const activeForm = document.getElementById(`${this.dataset.tab}-form`);
      if (activeForm) activeForm.style.display = 'block';
    });
  });

  // Cart page: Add event listeners for clear cart and checkout buttons
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      window.app.setCart([]);
      window.app.renderCart();
      showToast('Cart cleared!');
    });
  }

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
      }
      
      
      window.location.href = 'checkout.html';
    });
  }

  console.log('✅ App initialized successfully');
});
