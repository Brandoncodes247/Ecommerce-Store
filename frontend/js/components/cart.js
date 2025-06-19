import { getCart, setCart, updateCartCount } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';

export function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartItems || !cartTotal) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartItems.innerHTML = `<p>Your cart is empty</p>`;
    cartTotal.textContent = '0.00';
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const imageUrl = item.imageUrl || item.image || '';
    const price = Number(item.price || 0).toLocaleString();
    return `
      <div class="cart-item">
        <img src="${imageUrl}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>KES ${price}</p>
          <div class="qty-controls">
            <button onclick="app.updateQty(${item.id}, -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="app.updateQty(${item.id}, 1)">+</button>
          </div>
          <button onclick="app.removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
  cartTotal.textContent = total.toLocaleString();
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    const product = window.products?.find(p => p.id === productId);
    if (product) {
      const image = product.imageUrl || product.image || '';
      cart.push({ ...product, image, qty });
    }
  }
  setCart(cart);
  updateCartCount();
  showToast('🛒 Added to cart!');
}


export function updateQty(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    setCart(cart);
    renderCart();
    updateCartCount();
    showToast('Cart updated');
  }
}

export function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  setCart(cart);
  renderCart();
  updateCartCount();
  showToast('Removed from cart');
}
