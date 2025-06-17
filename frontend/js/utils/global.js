// Import all necessary functions
import { addToCart, updateQty, removeFromCart, renderCart } from '../components/cart.js';
import { openProductModal } from '../components/products.js';
import { showToast } from './ui.js';
import { products } from '../config/products.js';
import { setCart } from './storage.js';

// Create a global object to hold all our functions
window.app = {
  addToCart,
  updateQty,
  removeFromCart,
  renderCart,
  openProductModal,
  showToast,
  getProducts: () => products,
  setCart,
}; 