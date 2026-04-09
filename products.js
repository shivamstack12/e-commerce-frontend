

const PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    category: "Electronics",
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Wireless+Headphones",
    description: "High-quality sound with noise cancellation"
  },
  {
    id: 2,
    name: "Classic Analog Watch",
    price: 89.99,
    category: "Accessories",
    rating: 4.8,
    image: "https://via.placeholder.com/300x300?text=Analog+Watch",
    description: "Elegant timepiece with leather strap"
  },
  {
    id: 3,
    name: "Smart Fitness Tracker",
    price: 199.99,
    category: "Electronics",
    rating: 4.3,
    image: "https://via.placeholder.com/300x300?text=Fitness+Tracker",
    description: "Track your daily activities and health metrics"
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    price: 159.99,
    category: "Accessories",
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Sunglasses",
    description: "UV protection with premium lens quality"
  },
  {
    id: 5,
    name: "Professional Camera",
    price: 799.99,
    category: "Electronics",
    rating: 4.9,
    image: "https://via.placeholder.com/300x300?text=Professional+Camera",
    description: "High-resolution digital camera for professionals"
  },
  {
    id: 6,
    name: "Leather Messenger Bag",
    price: 149.99,
    category: "Accessories",
    rating: 4.4,
    image: "https://via.placeholder.com/300x300?text=Messenger+Bag",
    description: "Genuine leather bag with multiple compartments"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 79.99,
    category: "Electronics",
    rating: 4.2,
    image: "https://via.placeholder.com/300x300?text=Bluetooth+Speaker",
    description: "Portable speaker with 360-degree sound"
  },
  {
    id: 8,
    name: "Premium Running Shoes",
    price: 129.99,
    category: "Fashion",
    rating: 4.7,
    image: "https://via.placeholder.com/300x300?text=Running+Shoes",
    description: "Comfortable athletic shoes with gel cushioning"
  },
  {
    id: 9,
    name: "Portable Power Bank",
    price: 49.99,
    category: "Electronics",
    rating: 4.5,
    image: "https://via.placeholder.com/300x300?text=Power+Bank",
    description: "Fast charging 20000mAh capacity power bank"
  },
  {
    id: 10,
    name: "Silk Scarf",
    price: 69.99,
    category: "Fashion",
    rating: 4.3,
    image: "https://via.placeholder.com/300x300?text=Silk+Scarf",
    description: "Premium quality silk scarf in various colors"
  },
  {
    id: 11,
    name: "Smart Watch",
    price: 299.99,
    category: "Electronics",
    rating: 4.6,
    image: "https://via.placeholder.com/300x300?text=Smart+Watch",
    description: "Android and iOS compatible smartwatch"
  },
  {
    id: 12,
    name: "Vintage Wallet",
    price: 59.99,
    category: "Accessories",
    rating: 4.4,
    image: "https://via.placeholder.com/300x300?text=Vintage+Wallet",
    description: "Compact wallet with RFID protection"
  }
];

/**
 * Get all products
 */
function getAllProducts() {

function getCategories() {
  return [...new Set(PRODUCTS.map(p => p.category))].sort();
}

/**
 * Get product by ID
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}


function filterByCategory(category) {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}


function filterByPrice(minPrice, maxPrice) {
  return PRODUCTS.filter(p => p.price >= minPrice && p.price <= maxPrice);
}


function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );
}
