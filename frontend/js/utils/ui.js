export function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

export function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full) + (half ? '½' : '');
  stars = stars.padEnd(5, '☆');
  return `<span class="product-rating">${stars}</span>`;
}

export function showLoadingSpinner() {
  const list = document.getElementById('product-list');
  if (list) list.innerHTML = '<div class="loading-spinner"></div>';
} 