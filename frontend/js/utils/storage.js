export function getCart() {
  const cartString = localStorage.getItem('cart');
  console.log('storage.js - getCart: Raw cart string from localStorage:', cartString);
  const cart = cartString ? JSON.parse(cartString) : [];
  console.log('storage.js - getCart: Parsed cart object:', cart);
  return cart;
}

export function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  console.log('storage.js - setCart: Cart saved to localStorage:', cart);
}

export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  }
} 