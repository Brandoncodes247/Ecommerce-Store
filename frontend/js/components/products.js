console.log('✅ products.js loaded');

import { updateCartCount } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';

let products = [];
let allCategories = [];

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

    // Extract unique categories
    allCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
      categoryFilter.onchange = function() {
        const selected = this.value;
        if (!selected) {
          renderFilteredProducts(products);
        } else {
          renderFilteredProducts(products.filter(p => p.category === selected));
        }
      };
    }

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
          <button class="qty-btn minus" aria-label="Decrease quantity" data-id="${product.id}">-</button>
          <span id="qty-${product.id}" class="qty-value">1</span>
          <button class="qty-btn plus" aria-label="Increase quantity" data-id="${product.id}">+</button>
          <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Bind plus/minus and Add to Cart buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const qtySpan = document.getElementById(`qty-${id}`);
        let qty = parseInt(qtySpan.textContent);
        if (btn.classList.contains('plus')) {
          qty++;
        } else if (btn.classList.contains('minus')) {
          qty = Math.max(1, qty - 1);
        }
        qtySpan.textContent = qty;
      });
    });
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const qty = parseInt(document.getElementById(`qty-${id}`).textContent || '1');
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
        <button class="qty-btn minus" aria-label="Decrease quantity" data-id="${product.id}">-</button>
        <span id="qty-${product.id}" class="qty-value">1</span>
        <button class="qty-btn plus" aria-label="Increase quantity" data-id="${product.id}">+</button>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Rebind plus/minus and Add to Cart buttons
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const qtySpan = document.getElementById(`qty-${id}`);
      let qty = parseInt(qtySpan.textContent);
      if (btn.classList.contains('plus')) {
        qty++;
      } else if (btn.classList.contains('minus')) {
        qty = Math.max(1, qty - 1);
      }
      qtySpan.textContent = qty;
    });
  });
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const qty = parseInt(document.getElementById(`qty-${id}`).textContent || '1');
      addToCart(id, qty);
    });
  });
}
