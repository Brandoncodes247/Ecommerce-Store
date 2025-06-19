export function getCart() {
  const cartString = localStorage.getItem('cart');
  console.log('storage.js - getCart: Raw cart string from localStorage:', cartString);
  const cart = cartString ? JSON.parse(cartString) : [];
  console.log('storage.js - getCart: Parsed cart object:', cart);
  return cart;
}

export function setCart(cart) {
  const safeCart = cart.map(item => ({
    ...item,
    qty: Number(item.qty || 1),
    price: Number(item.price || 0),
  }));
  localStorage.setItem('cart', JSON.stringify(safeCart));
  updateCartCount();
  console.log('storage.js - setCart: Cart saved to localStorage:', safeCart);
}

export function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  }
}
