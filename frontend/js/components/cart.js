import { getCart, setCart } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';

export function addToCart(productId, qty = 1) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    const products = app.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, qty: Number(qty) }); 
      console.log('addToCart: Product added (new item):', { ...product, qty: Number(qty) });
    } else {
      console.error('addToCart: Product not found for ID:', productId);
    }
  }
  setCart(cart);
  showToast('Added to cart!');
  console.log('addToCart: Current cart after adding/updating:', cart);
}

export function updateQty(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id);
  
  if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) {
      cart.splice(idx, 1);
    }
    setCart(cart);
    renderCart();
    showToast('Cart updated');
  }
}

export function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  setCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

export function clearCart() {
  setCart([]);
  renderCart();
  showToast('Cart cleared successfully', 'success');
}

export function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  
  if (!cartItems || !cartTotal) return;

  const cart = getCart();
  console.log('cart.js - renderCart: Current cart content:', cart);
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="index.html" class="continue-shopping-btn">Continue Shopping</a>
      </div>
    `;
    cartTotal.textContent = '0.00';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (clearCartBtn) clearCartBtn.style.display = 'none';
    console.log('cart.js - renderCart: Cart is empty, hiding buttons.');
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
  if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
  
  cartItems.innerHTML = `
    <div class="cart-header">
      <h2>Your Cart Items</h2>
      <button id="clear-cart-btn" class="secondary-btn" onclick="app.clearCart()">Clear Cart</button>
    </div>
    ${cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h2>${item.name}</h2>
          <p class="cart-item-price">KES ${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-qty">
          <button onclick="app.updateQty(${item.id}, -1)" class="qty-btn">-</button>
          <span>${item.qty}</span>
          <button onclick="app.updateQty(${item.id}, 1)" class="qty-btn">+</button>
        </div>
        <button onclick="app.removeFromCart(${item.id})" class="remove-btn">Remove</button>
      </div>
    `).join('')}
  `;
  console.log('cart.js - renderCart: Rendered cart items.');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = total.toLocaleString();
  console.log('cart.js - renderCart: Calculated total:', total);
} 