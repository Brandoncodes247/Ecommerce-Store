// js/checkout.js
import { getCart, setCart, updateCartCount } from './utils/storage.js';
import { showToast } from './utils/ui.js';
import { checkAuth } from './components/auth.js';

class AddressAutocomplete {
  constructor(inputElement, suggestionsContainer) {
    this.input = inputElement;
    this.suggestions = suggestionsContainer;
    this.debounceTimer = null;
    this.init();
  }

  init() {
    this.input.addEventListener('input', () => this.handleInput());
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
        this.clearSuggestions();
      }
    });
  }

  handleInput() {
    clearTimeout(this.debounceTimer);
    const query = this.input.value.trim();
    
    if (query.length < 3) {
      this.clearSuggestions();
      return;
    }

    this.debounceTimer = setTimeout(() => this.fetchSuggestions(query), 400);
  }

  async fetchSuggestions(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      this.displaySuggestions(data);
    } catch (error) {
      console.error('Address suggestion error:', error);
    }
  }

  displaySuggestions(data) {
    this.clearSuggestions();
    data.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.display_name;
      div.onclick = () => {
        this.input.value = item.display_name;
        this.clearSuggestions();
      };
      this.suggestions.appendChild(div);
    });
  }

  clearSuggestions() {
    this.suggestions.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize auth check - show modal if not logged in
  const isAuthenticated = checkAuth(true);
  if (!isAuthenticated) {
    showToast('Please login or sign up to checkout', 'info');
  }

  // 2. Initialize address autocomplete
  const addressInput = document.getElementById('address');
  const suggestionsBox = document.getElementById('address-suggestions');
  if (addressInput && suggestionsBox) {
    new AddressAutocomplete(addressInput, suggestionsBox);
  }

  // 3. Get and validate cart
  const cart = getCart();
  console.log('Cart contents:', cart);

  if (!cart || !Array.isArray(cart)) {
    console.error('Invalid cart data:', cart);
    showToast('Your cart data is invalid. Redirecting...', 'error');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

  if (cart.length === 0) {
    showToast('Your cart is empty. Redirecting...', 'info');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
    return;
  }

  // 4. Calculate order totals with validation
  let subtotal = 0;
  cart.forEach(item => {
    try {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 1;
      subtotal += price * qty;
    } catch (e) {
      console.error('Error processing cart item:', item, e);
    }
  });

  const shipping = 500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  // 5. Update UI with calculated amounts
  const formatCurrency = (amount) => {
    return `KES ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  document.getElementById('subtotal-amount').textContent = formatCurrency(subtotal);
  document.getElementById('shipping-amount').textContent = formatCurrency(shipping);
  document.getElementById('tax-amount').textContent = formatCurrency(tax);
  document.getElementById('total-amount').textContent = formatCurrency(total);

  // 6. Render cart items
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = cart.map(item => {
      const imageUrl = item.imageUrl || item.image || './images/placeholder-product.png';
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.qty) || 1;
      
      return `
        <div class="cart-item">
          <img src="${imageUrl}" alt="${item.name || 'Product'}" 
               onerror="this.src='./images/placeholder-product.png'">
          <div class="cart-item-details">
            <h3>${item.name || 'Unnamed Product'}</h3>
            <p>${formatCurrency(price)} × ${qty}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // 7. Payment method toggle
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', function () {
      document.querySelectorAll('.payment-details').forEach(div => div.classList.remove('active'));
      const detailsId = this.value + '-details';
      const detailsElement = document.getElementById(detailsId);
      if (detailsElement) {
        detailsElement.classList.add('active');
      }
    });
  });

  // 8. Payment submission
  document.getElementById('pay-button').addEventListener('click', async function (e) {
    e.preventDefault();

    // Check auth again before payment
    if (!checkAuth(true)) {
      showToast('Please complete login/signup to proceed', 'error');
      return;
    }

    const shippingForm = document.getElementById('shipping-form');
    if (!shippingForm) {
      showToast('Shipping form not found', 'error');
      return;
    }

    // Validate required fields
    let allFieldsFilled = true;
    const inputs = shippingForm.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
      const parent = input.closest('.payment-details');
      const hidden = parent && !parent.classList.contains('active');
      
      if (!hidden && !input.value.trim()) {
        input.classList.add('error');
        allFieldsFilled = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (!allFieldsFilled) {
      showToast('Please fill in all required details.', 'error');
      return;
    }

    showToast('Processing your order...', 'info');

    // Prepare order payload
    const validItems = cart.map(item => ({
      productId: parseInt(item.id) || 0,
      quantity: parseInt(item.qty) || 1,
      price: parseFloat(item.price) || 0,
      name: item.name || 'Unnamed Product'
    })).filter(item => item.productId > 0 && item.price > 0);

    if (validItems.length === 0) {
      showToast('No valid items in your cart', 'error');
      return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'unknown';
    
    const orderPayload = {
      items: validItems,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      paymentMethod: paymentMethod,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:3001/api/order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const result = await response.json();
        showToast('✅ Order placed successfully!', 'success');
        localStorage.setItem('lastOrderId', result.id);
        localStorage.setItem('lastOrderTotal', total); // save total
        setCart([]);
        updateCartCount();
        setTimeout(() => {
          window.location.href = 'thankyou.html';
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(`❌ Order failed: ${errorData.message || 'Please try again'}`, 'error');
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast('❌ Network error during order processing', 'error');
    }
  });
});
