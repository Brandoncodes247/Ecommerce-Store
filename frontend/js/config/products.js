console.log('✅ products.js loaded (latest version)');

let products = [];

function fixImageUrl(url) {
  if (!url) return '';
  return url.replace('http://localhost:3000', 'http://localhost:3002');
}

export async function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '<p>Loading products...</p>';

  try {
    const res = await fetch('http://localhost:3001/product');
    products = await res.json();
    container.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${fixImageUrl(product.imageUrl)}" alt="${product.name}" class="product-img" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>KES ${product.price}</strong></p>
      `;

      container.appendChild(card);
    });

    renderCategoryFilter();
  } catch (error) {
    console.error('Failed to load products:', error);
    container.innerHTML = '<p style="color:red;">Failed to load products.</p>';
  }
}

export function renderCategoryFilter() {
  const select = document.getElementById('category-filter');
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  select.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selected = select.value;
    const filtered = selected
      ? products.filter(p => p.category === selected)
      : products;
    renderFilteredProducts(filtered);
  });
}

export function setupSearch() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
    renderFilteredProducts(filtered);
  });
}

function renderFilteredProducts(filteredList) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  if (filteredList.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  filteredList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${fixImageUrl(product.imageUrl)}" alt="${product.name}" class="product-img" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>KES ${product.price}</strong></p>
    `;

    container.appendChild(card);
  });
}

