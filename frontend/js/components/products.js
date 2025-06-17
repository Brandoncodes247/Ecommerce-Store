import { getStars, showLoadingSpinner } from '../utils/ui.js';

export function renderCategoryFilter() {
  const products = app.getProducts();
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const container = document.querySelector('.category-filter-container');
  if (!container) return;
  const selectElement = document.createElement('select');
  selectElement.id = 'category-filter';
  selectElement.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  container.innerHTML = ''; // Clear existing content
  container.appendChild(selectElement); // Append the new select element

  selectElement.addEventListener('change', e => {
    renderProducts(document.getElementById('search-input')?.value || '', e.target.value);
  });
}

export function renderProducts(filter = '', category = 'All') {
  showLoadingSpinner();
  setTimeout(() => {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = '';
    const products = app.getProducts();
    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) &&
      (category === 'All' || p.category === category)
    );
    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-illustration">No products found.</div>';
      return;
    }
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        ${getStars(product.rating)}
        <h2>${product.name}</h2>
        <p><strong>KES ${product.price.toLocaleString()}</strong></p>
        <div class="product-info">
          <div class="stock-status in-stock">In Stock</div>
          <div class="dispatch-info">Free delivery by tomorrow</div>
        </div>
        <button onclick="app.addToCart(${product.id}, 1)" class="add-to-cart-btn">Add to Cart</button>
      `;
      list.appendChild(card);
    });
  }, 1000);
}

export function openProductModal(productId) {
  const modal = document.getElementById('product-modal');
  const details = document.getElementById('modal-details');
  const products = app.getProducts();
  const product = products.find(p => p.id === productId);
  if (!modal || !details || !product) return;

  details.innerHTML = `
    <img src="${product.image}" alt="${product.name}" style="width:140px;height:140px;object-fit:contain;display:block;margin:0 auto 1rem auto;">
    <h2>${product.name}</h2>
    ${getStars(product.rating)}
    <p style="margin:0.5rem 0 1rem 0;">${product.desc}</p>
    <p><strong>Price:</strong> KES ${product.price.toLocaleString()}</p>
    <div class="product-info" style="margin: 1rem 0;">
      <div class="stock-status in-stock">In Stock</div>
      <div class="dispatch-info">Free delivery by tomorrow</div>
    </div>
    <button onclick="app.addToCart(${product.id}, 1)">Add to Cart</button>
  `;
  modal.style.display = 'flex';
}

export function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', e => {
    const category = document.getElementById('category-filter')?.value || 'All';
    renderProducts(e.target.value, category);
  });
} 