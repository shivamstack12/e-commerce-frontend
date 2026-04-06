/**
 * ShopHub E-Commerce Frontend
 * Main Application Script - Vanilla JavaScript
 */

// ============================================
// State Management
// ============================================

const APP = {
  cart: [],
  currentProducts: [],
  filteredProducts: [],
  theme: 'light',
  filters: {
    search: '',
    category: 'all',
    maxPrice: 1000,
    sort: 'default'
  }
};

// ============================================
// DOM Elements (Lazy Loading)
// ============================================

const DOM = {
  get navbar() { return document.querySelector('.navbar'); },
  get searchInput() { return document.getElementById('searchInput'); },
  get themeToggle() { return document.getElementById('themeToggle'); },
  get cartBtn() { return document.getElementById('cartBtn'); },
  get cartCount() { return document.getElementById('cartCount'); },
  get productsGrid() { return document.getElementById('productsGrid'); },
  get noResults() { return document.getElementById('noResults'); },
  get categoryFilter() { return document.getElementById('categoryFilter'); },
  get priceRange() { return document.getElementById('priceRange'); },
  get maxPriceDisplay() { return document.getElementById('maxPrice'); },
  get resetFilters() { return document.getElementById('resetFilters'); },
  get sortSelect() { return document.getElementById('sortSelect'); },
  get cartSidebar() { return document.getElementById('cartSidebar'); },
  get cartOverlay() { return document.getElementById('cartOverlay'); },
  get closeCart() { return document.getElementById('closeCart'); },
  get cartItems() { return document.getElementById('cartItems'); },
  get cartEmpty() { return document.getElementById('cartEmpty'); },
  get cartTotal() { return document.getElementById('cartTotal'); },
  get subtotal() { return document.getElementById('subtotal'); },
  get taxAmount() { return document.getElementById('taxAmount'); },
  get checkoutBtn() { return document.getElementById('checkoutBtn'); },
  get continueShopping() { return document.getElementById('continueShopping'); },
  get toastContainer() { return document.getElementById('toastContainer'); }
};

// ============================================
// Initialization
// ============================================

/**
 * Initialize the application
 */
function init() {
  // Load theme and cart from localStorage
  loadTheme();
  loadCart();

  // Initialize products
  APP.currentProducts = getAllProducts();
  APP.filteredProducts = [...APP.currentProducts];

  // Render initial content
  renderCategories();
  renderProducts();

  // Attach event listeners
  attachEventListeners();

  // Update cart UI
  updateCartUI();
}

// ============================================
// Event Listeners
// ============================================

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Search
  DOM.searchInput.addEventListener('input', handleSearch);

  // Theme toggle
  DOM.themeToggle.addEventListener('click', toggleTheme);

  // Cart
  DOM.cartBtn.addEventListener('click', openCart);
  DOM.closeCart.addEventListener('click', closeCart);
  DOM.cartOverlay.addEventListener('click', closeCart);
  DOM.continueShopping.addEventListener('click', closeCart);

  // Filters
  DOM.categoryFilter.addEventListener('change', handleCategoryFilter);
  DOM.priceRange.addEventListener('input', handlePriceFilter);
  DOM.resetFilters.addEventListener('click', resetAllFilters);

  // Sort
  DOM.sortSelect.addEventListener('change', handleSort);

  // CTA Button
  document.querySelector('.cta-btn').addEventListener('click', () => {
    DOM.searchInput.focus();
  });

  // Event delegation for product cards
  DOM.productsGrid.addEventListener('click', handleProductCardClick);

  // Checkout
  DOM.checkoutBtn.addEventListener('click', handleCheckout);
}

// ============================================
// Product Rendering
// ============================================

/**
 * Render product categories as filter options
 */
function renderCategories() {
  const categories = getCategories();
  const categoryFilter = DOM.categoryFilter;

  // Clear existing options except "All Products"
  categoryFilter.innerHTML = `
    <label class="filter-label">
      <input type="radio" name="category" value="all" checked>
      All Products
    </label>
  `;

  // Add category options
  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-label';
    label.innerHTML = `
      <input type="radio" name="category" value="${category}">
      ${category}
    `;
    categoryFilter.appendChild(label);
  });
}

/**
 * Render products to the grid
 */
function renderProducts() {
  const productsGrid = DOM.productsGrid;
  const products = APP.filteredProducts;

  // Clear grid
  productsGrid.innerHTML = '';

  // Show/hide no results message
  if (products.length === 0) {
    DOM.noResults.style.display = 'block';
    return;
  }
  DOM.noResults.style.display = 'none';

  // Render each product
  products.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });
}

/**
 * Create a product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;

  const starsHTML = getStarRating(product.rating);

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-rating">
        <span class="stars">${starsHTML}</span>
        <span class="rating-value">(${product.rating})</span>
      </div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-actions">
        <button class="btn-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
        <button class="btn-wishlist" aria-label="Add to wishlist">❤️</button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Get star rating HTML
 */
function getStarRating(rating) {
  const stars = Math.round(rating);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// ============================================
// Search & Filter Functions
// ============================================

/**
 * Handle search input
 */
function handleSearch(e) {
  APP.filters.search = e.target.value;
  applyFilters();
}

/**
 * Handle category filter
 */
function handleCategoryFilter(e) {
  APP.filters.category = e.target.value;
  applyFilters();
}

/**
 * Handle price filter
 */
function handlePriceFilter(e) {
  APP.filters.maxPrice = parseInt(e.target.value);
  DOM.maxPriceDisplay.textContent = `$${APP.filters.maxPrice}`;
  applyFilters();
}

/**
 * Handle sort option
 */
function handleSort(e) {
  APP.filters.sort = e.target.value;
  applyFilters();
}

/**
 * Apply all filters and sorting
 */
function applyFilters() {
  let products = [...APP.currentProducts];

  // Search filter
  if (APP.filters.search) {
    products = searchProducts(APP.filters.search);
  }

  // Category filter
  if (APP.filters.category !== 'all') {
    products = products.filter(p => p.category === APP.filters.category);
  }

  // Price filter
  products = products.filter(p => p.price <= APP.filters.maxPrice);

  // Sorting
  products = sortProducts(products, APP.filters.sort);

  APP.filteredProducts = products;
  renderProducts();
}

/**
 * Sort products
 */
function sortProducts(products, sortType) {
  const sorted = [...products];

  switch (sortType) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Reset all filters
 */
function resetAllFilters() {
  APP.filters = {
    search: '',
    category: 'all',
    maxPrice: 1000,
    sort: 'default'
  };

  // Update UI
  DOM.searchInput.value = '';
  DOM.priceRange.value = 1000;
  DOM.maxPriceDisplay.textContent = '$1000';
  DOM.sortSelect.value = 'default';

  // Reset category radio buttons
  document.querySelector('input[name="category"][value="all"]').checked = true;

  // Re-render
  applyFilters();
  showToast('Filters reset successfully', 'info');
}

// ============================================
// Product Card Click Handler (Event Delegation)
// ============================================

/**
 * Handle product card interactions
 */
function handleProductCardClick(e) {
  const addToCartBtn = e.target.closest('.btn-add-to-cart');
  const wishlistBtn = e.target.closest('.btn-wishlist');

  if (addToCartBtn) {
    const productId = parseInt(addToCartBtn.dataset.productId);
    addToCart(productId);
  } else if (wishlistBtn) {
    handleWishlist(wishlistBtn);
  }
}

/**
 * Handle wishlist button
 */
function handleWishlist(btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = '❤️';
    showToast('Added to wishlist', 'info');
  } else {
    btn.textContent = '🤍';
    showToast('Removed from wishlist', 'info');
  }
}

// ============================================
// Cart Management
// ============================================

/**
 * Add product to cart
 */
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  // Check if product already in cart
  const existingItem = APP.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
    showToast(`Increased quantity of ${product.name}`, 'info');
  } else {
    APP.cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    showToast(`${product.name} added to cart!`, 'success');
  }

  saveCart();
  updateCartUI();
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
  APP.cart = APP.cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  showToast('Item removed from cart', 'info');
}

/**
 * Update item quantity
 */
function updateQuantity(productId, quantity) {
  const item = APP.cart.find(item => item.id === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = quantity;
    saveCart();
    updateCartUI();
  }
}

/**
 * Calculate cart totals
 */
function calculateCartTotals() {
  const subtotal = APP.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

/**
 * Update cart UI
 */
function updateCartUI() {
  // Update cart count
  const totalItems = APP.cart.reduce((sum, item) => sum + item.quantity, 0);
  DOM.cartCount.textContent = totalItems;

  // Update cart items display
  if (APP.cart.length === 0) {
    DOM.cartEmpty.style.display = 'block';
    DOM.cartItems.innerHTML = '';
  } else {
    DOM.cartEmpty.style.display = 'none';
    renderCartItems();
  }

  // Update totals
  const { subtotal, tax, total } = calculateCartTotals();
  DOM.subtotal.textContent = `$${subtotal.toFixed(2)}`;
  DOM.taxAmount.textContent = `$${tax.toFixed(2)}`;
  DOM.cartTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Render cart items
 */
function renderCartItems() {
  DOM.cartItems.innerHTML = '';

  APP.cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.productId = item.id;

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease" data-product-id="${item.id}">−</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn increase" data-product-id="${item.id}">+</button>
          <button class="btn-remove-item" data-product-id="${item.id}">🗑️</button>
        </div>
      </div>
    `;

    // Attach event listeners to quantity buttons
    cartItem.querySelector('.decrease').addEventListener('click', () => {
      updateQuantity(item.id, item.quantity - 1);
    });

    cartItem.querySelector('.increase').addEventListener('click', () => {
      updateQuantity(item.id, item.quantity + 1);
    });

    cartItem.querySelector('.btn-remove-item').addEventListener('click', () => {
      removeFromCart(item.id);
    });

    DOM.cartItems.appendChild(cartItem);
  });
}

/**
 * Open cart sidebar
 */
function openCart() {
  DOM.cartSidebar.classList.add('active');
  DOM.cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close cart sidebar
 */
function closeCart() {
  DOM.cartSidebar.classList.remove('active');
  DOM.cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

/**
 * Handle checkout
 */
function handleCheckout() {
  if (APP.cart.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }

  const { total } = calculateCartTotals();
  showToast(
    `Thank you for your purchase! Total: $${total.toFixed(2)}. 
     This is a demo - no actual payment processed.`,
    'success'
  );

  // Clear cart after checkout
  APP.cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

// ============================================
// LocalStorage Management
// ============================================

/**
 * Save cart to localStorage
 */
function saveCart() {
  localStorage.setItem('shophub_cart', JSON.stringify(APP.cart));
}

/**
 * Load cart from localStorage
 */
function loadCart() {
  const saved = localStorage.getItem('shophub_cart');
  APP.cart = saved ? JSON.parse(saved) : [];
}

// ============================================
// Theme Management
// ============================================

/**
 * Toggle dark/light theme
 */
function toggleTheme() {
  APP.theme = APP.theme === 'light' ? 'dark' : 'light';
  applyTheme();
  saveTheme();
}

/**
 * Apply theme to document
 */
function applyTheme() {
  if (APP.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    DOM.themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    DOM.themeToggle.textContent = '🌙';
  }
}

/**
 * Save theme preference
 */
function saveTheme() {
  localStorage.setItem('shophub_theme', APP.theme);
}

/**
 * Load theme preference
 */
function loadTheme() {
  const saved = localStorage.getItem('shophub_theme');
  if (saved) {
    APP.theme = saved;
    applyTheme();
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      APP.theme = 'dark';
      applyTheme();
    }
  }
}

// ============================================
// Toast Notifications
// ============================================

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close notification">✕</button>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto remove after 5 seconds
  const timeout = setTimeout(() => {
    toast.remove();
  }, 5000);

  // Manual close button
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timeout);
    toast.remove();
  });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Format currency
 */
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Debounce function for performance
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ============================================
// Start Application
// ============================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
