const products = [
  { id: 1, name: 'USB Flash Drive', price: 1200, image: './product images/USB Flash Drive.png', rating: 4.3, desc: '16GB USB 3.0 flash drive for quick file transfers.', category: 'Accessories' },
  { id: 2, name: 'Wireless Mouse', price: 1500, image: './product images/Wireless Mouse.png', rating: 4.2, desc: 'Comfortable wireless mouse with long battery life.', category: 'Input' },
  { id: 3, name: 'Wired Keyboard', price: 1800, image: './product images/Wired Keyboard.png', rating: 4.1, desc: 'Full-size keyboard with quiet keys.', category: 'Input' },
  { id: 4, name: 'HDMI Cable', price: 600, image: './product images/HDMI Cable.png', rating: 4.4, desc: '1.5m HDMI cable for monitors and TVs.', category: 'Cables' },
  { id: 5, name: 'Laptop Stand', price: 2500, image: './product images/Laptop Stand.png', rating: 4.5, desc: 'Adjustable stand for laptops up to 17 inches.', category: 'Accessories' },
  { id: 6, name: 'Bluetooth Speaker', price: 3200, image: './product images/Bluetooth Speaker.png', rating: 4.3, desc: 'Portable speaker with clear sound and bass.', category: 'Audio' },
  { id: 7, name: 'Webcam', price: 2800, image: './product images/Webcam.png', rating: 4.0, desc: 'HD webcam for video calls and streaming.', category: 'Accessories' },
  { id: 8, name: 'Power Bank', price: 1700, image: './product images/Power Bank.png', rating: 4.4, desc: '5000mAh portable charger for phones and tablets.', category: 'Power' },
  { id: 9, name: 'Wireless Earbuds', price: 2200, image: './product images/Wireless Earbuds.png', rating: 4.2, desc: 'Compact earbuds with charging case.', category: 'Audio' },
  { id: 10, name: 'Monitor', price: 14500, image: './product images/Monitor.png', rating: 4.5, desc: '21.5-inch Full HD monitor for work and play.', category: 'Display' },
  { id: 11, name: 'USB-C Charger', price: 900, image: './product images/USB-C Charger.png', rating: 4.3, desc: 'Fast charging USB-C wall adapter.', category: 'Power' },
  { id: 12, name: 'Ethernet Cable', price: 500, image: './product images/Ethernet Cable.png', rating: 4.1, desc: '2m Cat6 ethernet cable for fast internet.', category: 'Cables' },
  { id: 13, name: 'Mouse Pad', price: 400, image: './product images/Mouse Pad.png', rating: 4.2, desc: 'Smooth surface mouse pad for precise control.', category: 'Accessories' },
  { id: 14, name: 'SD Card', price: 1100, image: './product images/SD Card.png', rating: 4.4, desc: '32GB SD card for cameras and devices.', category: 'Accessories' },
  { id: 15, name: 'Smart Plug', price: 1600, image: './product images/Smart Plug.png', rating: 4.3, desc: 'WiFi smart plug for remote control of devices.', category: 'Power' },
  { id: 16, name: 'LED Desk Lamp', price: 2000, image: './product images/LED Desk Lamp.png', rating: 4.5, desc: 'Adjustable LED lamp with touch controls.', category: 'Accessories' },
];

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full) + (half ? '½' : '');
  stars = stars.padEnd(5, '☆');
  return `<span class="product-rating">${stars}</span>`;
}

function renderCategoryFilter() {
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const container = document.querySelector('.category-filter-container');
  if (!container) return;
  container.innerHTML = `<select id="category-filter">
    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
  </select>`;
  document.getElementById('category-filter').addEventListener('change', e => {
    renderProducts(document.getElementById('search-input')?.value || '', e.target.value);
  });
}

function showLoadingSpinner() {
  const list = document.getElementById('product-list');
  if (list) list.innerHTML = '<div class="loading-spinner"></div>';
}

function renderProducts(filter = '', category = 'All') {
  showLoadingSpinner();
  setTimeout(() => {
    const list = document.getElementById('product-list');
    if (!list) return;
    list.innerHTML = '';
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
        <button onclick="addToCart(${product.id}, 1)" class="add-to-cart-btn">Add to Cart</button>
      `;
      list.appendChild(card);
    });
  }, 1000);
}

function addToCart(productId, qty = 1) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty });
  }
  setCart(cart);
  showToast('Added to cart!');
}

function openProductModal(productId) {
  const modal = document.getElementById('product-modal');
  const details = document.getElementById('modal-details');
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
    <button onclick="addToCart(${product.id}, 1)">Add to Cart</button>
  `;
  modal.style.display = 'flex';
}
document.addEventListener('DOMContentLoaded', () => {
  const closeModal = document.getElementById('close-modal');
  const modal = document.getElementById('product-modal');
  if (closeModal && modal) {
    closeModal.onclick = () => (modal.style.display = 'none');
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };
  }
});

function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', e => {
    const category = document.getElementById('category-filter')?.value || 'All';
    renderProducts(e.target.value, category);
  });
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (!cartItems || !cartTotal) return;

  const cart = getCart();
  
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
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h2>${item.name}</h2>
        <p class="cart-item-price">KES ${item.price.toLocaleString()}</p>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateQty(${item.id}, -1)" class="qty-btn">-</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${item.id}, 1)" class="qty-btn">+</button>
      </div>
      <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = total.toLocaleString();
}

function updateQty(id, delta) {
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

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  setCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

// Add event listener for clear cart button
document.addEventListener('DOMContentLoaded', function() {
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      setCart([]);
      renderCart();
      showToast('Cart cleared');
    });
  }
});

// Checkout Page
function renderCheckoutSummary() {
  const section = document.getElementById('checkout-summary');
  if (!section) return;
  let cart = getCart();
  if (cart.length === 0) {
    section.innerHTML = '<div class="empty-illustration">🛒<br>Your cart is empty.</div>';
    document.getElementById('checkout-form').style.display = 'none';
    return;
  }
  let html = '<h2>Order Summary</h2><ul>';
  cart.forEach(item => {
    html += `<li>${item.name} x ${item.qty} - KES ${(item.price * item.qty).toLocaleString()}</li>`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  html += `</ul><strong>Total: KES ${total.toLocaleString()}</strong>`;
  section.innerHTML = html;
}

// Checkout Form Submission with validation
function handleCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Add error message elements
  if (!document.getElementById('form-errors')) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'form-errors';
    errorDiv.style.color = '#e11d48';
    errorDiv.style.marginBottom = '1rem';
    errorDiv.style.fontWeight = '600';
    form.insertBefore(errorDiv, form.firstChild);
  }

  form.onsubmit = function(e) {
    e.preventDefault();
    // Validate fields
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const address = form.elements['address'].value.trim();
    let errors = [];
    if (!name) errors.push('Name is required.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required.');
    if (!address) errors.push('Address is required.');
    const errorDiv = document.getElementById('form-errors');
    if (errors.length > 0) {
      errorDiv.innerHTML = errors.join('<br>');
      return;
    } else {
      errorDiv.innerHTML = '';
    }
   
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    localStorage.setItem('lastOrder', JSON.stringify({ items: cart, total }));
    localStorage.removeItem('cart');
    document.getElementById('payment-success').style.display = 'block';
    form.style.display = 'none';
    updateCartCount();
    showOrderSummary();
    showToast('Payment successful!');
  };
}

function showOrderSummary() {
  const summaryDiv = document.getElementById('order-summary');
  if (!summaryDiv) return;
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
  if (!lastOrder.items || lastOrder.items.length === 0) {
    summaryDiv.innerHTML = '<p>No order details found.</p>';
    return;
  }
  let html = '<h3 style="margin-bottom:0.7rem;">Order Summary</h3><ul style="padding-left:1.2rem;">';
  lastOrder.items.forEach(item => {
    html += `<li>${item.name} x ${item.qty} - KES ${(item.price * item.qty).toLocaleString()}</li>`;
  });
  html += `</ul><strong style="display:block;margin-top:0.7rem;">Total: KES ${lastOrder.total.toLocaleString()}</strong>`;
  summaryDiv.innerHTML = html;
}
function setupDarkModeToggle() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }
  btn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  };
}

function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  btn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// Auth Modal Functionality
const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginBtn.addEventListener('click', () => {
  authModal.style.display = 'flex';
});

closeAuthModal.addEventListener('click', () => {
  authModal.style.display = 'none';
});

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    authTabs.forEach(t => t.classList.remove('active'));
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Show corresponding form
    if (tab.dataset.tab === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    }
  });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.style.display = 'none';
  }
});

// Handle form submissions
document.querySelectorAll('.auth-form form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just show a success message
    showToast('Form submitted successfully!', 'success');
    authModal.style.display = 'none';
  });
});

// Function to create product cards with stock and dispatch info
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Generate random stock status for demo
  const stockStatuses = ['in-stock', 'low-stock', 'out-of-stock'];
  const stockStatus = stockStatuses[Math.floor(Math.random() * stockStatuses.length)];
  const stockText = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock - Only 3 left',
    'out-of-stock': 'Out of Stock'
  }[stockStatus];
  
  // Generate random dispatch info for demo
  const dispatchOptions = [
    'Free delivery by tomorrow',
    'Express delivery available',
    'Local pickup available'
  ];
  const dispatchInfo = dispatchOptions[Math.floor(Math.random() * dispatchOptions.length)];
  
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <div class="product-info">
      <div class="stock-status ${stockStatus}">${stockText}</div>
      <div class="dispatch-info">${dispatchInfo}</div>
    </div>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  
  return card;
}

window.onload = function() {
  updateCartCount();
  if (document.querySelector('.category-filter-container')) renderCategoryFilter();
  if (document.getElementById('product-list')) renderProducts();
  if (document.getElementById('cart-items')) renderCart();
  if (document.getElementById('checkout-summary')) renderCheckoutSummary();
  if (document.getElementById('checkout-form')) handleCheckoutForm();
  if (document.getElementById('payment-success')) showOrderSummary();
  setupSearch();
  setupDarkModeToggle();
  setupBackToTop();
}; 