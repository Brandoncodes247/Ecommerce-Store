console.log('✅ products.js loaded');

import { updateCartCount } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';

let products = [];

function fixImageUrl(url) {
  if (!url) return '';
  return url.replace('http://localhost:3000', 'http://localhost:3002');
}

export async function renderProducts() {
  const container = document.getElementById('product-list');
  container.innerHTML = '<p>Loading products...</p>';

  try {
    const res = await fetch('http://localhost:3001/api/product');
    products = await res.json();
    window.products = products;
    container.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      const imageUrl = fixImageUrl(product.imageUrl || product.image || '');
      const price = Number(product.price || 0).toLocaleString();

      card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-img" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>KES ${price}</strong></p>
        <div class="qty-control">
          <input type="number" id="qty-${product.id}" value="1" min="1" />
          <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Bind "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const qty = parseInt(document.getElementById(`qty-${id}`).value || '1');
        addToCart(id, qty);
      });
    });

  } catch (error) {
    console.error('❌ Failed to load products:', error);
    container.innerHTML = '<p style="color:red;">Failed to load products.</p>';
  }
}

function addToCart(productId, qty = 1) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(item => item.id === productId);

  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({
        ...product,
        imageUrl: fixImageUrl(product.imageUrl || product.image || ''),
        qty
      });
    } else {
      console.error('Product not found:', productId);
      return;
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast('🛒 Product added to cart!');
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
    const imageUrl = fixImageUrl(product.imageUrl || product.image || '');
    const price = Number(product.price || 0).toLocaleString();

    card.innerHTML = `
      <img src="${imageUrl}" alt="${product.name}" class="product-img" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>KES ${price}</strong></p>
      <div class="qty-control">
        <input type="number" id="qty-${product.id}" value="1" min="1" />
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Rebind "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const qty = parseInt(document.getElementById(`qty-${id}`).value || '1');
      addToCart(id, qty);
    });
  });
}
