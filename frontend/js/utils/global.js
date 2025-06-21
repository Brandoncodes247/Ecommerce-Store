// Import all necessary functions
import { addToCart, updateQty, removeFromCart, renderCart } from '../components/cart.js';
import { showToast } from './ui.js';
import {renderProducts} from '../components/products.js';
import { setCart } from './storage.js';


// Create a global object to hold all our functions
window.app = {
  addToCart,
  updateQty,
  removeFromCart,
  renderCart,
  showToast,
  renderProducts,
  setCart,
  // Add any other global functions needed
}; 