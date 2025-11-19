// Modal variables - ONLY run if elements exist
const openModal = document.getElementById("openModal");
const modal = document.getElementById("infoModal");
const closeModal = document.getElementById("closeModal");

// Only add event listeners if modal elements exist
if (openModal && modal && closeModal) {
    // Open modal when button clicked
    openModal.addEventListener("click", () => {
        modal.style.display = "flex";
        modal.classList.add("show");
    });

    // Close modal when X clicked
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        modal.classList.remove("show");
    });

    // Close modal when clicking outside the modal box
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.classList.remove("show");
        }
    });
}

// Interactive Map Functionality
function initMap() {
    // Center on Limpopo, South Africa
    const map = L.map('map').setView([-23.6542, 27.7969], 10);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker
    L.marker([-23.6542, 27.7969])
        .addTo(map)
        .bindPopup('Fruitful Fields Main Farm<br>Limpopo, South Africa')
        .openPopup();
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map')) {
        initMap();
    }
});
// ===== PRODUCTS PAGE DYNAMIC FUNCTIONALITY =====

// Product data
const products = [
    {
        id: 1,
        name: "Strawberries",
        price: 50,
        image: "images/G03.jpg",
        category: "berries"
    },
    {
        id: 2,
        name: "Apples",
        price: 30,
        image: "images/aplles.jpg",
        category: "fruits"
    },
    {
        id: 3,
        name: "Mangoes",
        price: 45,
        image: "images/mangoes2.jpg",
        category: "fruits"
    },
    {
        id: 4,
        name: "Litchis",
        price: 45,
        image: "images/lychee-fruit-close-up.jpg",
        category: "fruits"
    },
    {
        id: 5,
        name: "Oranges",
        price: 45,
        image: "images/oranges.jpg",
        category: "fruits"
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('fruitfulFieldsCart')) || [];

// Initialize products page
// Initialize products page
function initProductsPage() {
    if (!document.getElementById('productsContainer')) return;
    
    renderProducts(products);
    setupEventListeners();
    updateCartDisplay();
    initLightbox(); // ← ADD THIS LINE
    
    // Setup lightbox after a short delay to ensure images are rendered
    setTimeout(() => {
        setupLightboxForProducts(); // ← ADD THIS LINE
    }, 100);
}

// Render products dynamically
function renderProducts(productsToRender) {
    const container = document.getElementById('productsContainer');
    
    if (productsToRender.length === 0) {
        container.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card fade-in-up">
            <img src="${product.image}" alt="${product.name}" class="pulse-hover">
            <h2>${product.name}</h2>
            <div class="product-price">R${product.price}/kg</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                <span class="quantity-display" id="quantity-${product.id}">1</span>
                <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Event listeners for products page
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortedProducts = [...products];
            switch(e.target.value) {
                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                default:
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            }
            renderProducts(sortedProducts);
        });
    }
    
    // Cart toggle
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
}

// Quantity controls
function increaseQuantity(productId) {
    const display = document.getElementById(`quantity-${productId}`);
    if (display) {
        let quantity = parseInt(display.textContent) || 1;
        display.textContent = quantity + 1;
    }
}

function decreaseQuantity(productId) {
    const display = document.getElementById(`quantity-${productId}`);
    if (display) {
        let quantity = parseInt(display.textContent) || 1;
        if (quantity > 1) {
            display.textContent = quantity - 1;
        }
    }
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantityDisplay = document.getElementById(`quantity-${productId}`);
    const quantity = quantityDisplay ? parseInt(quantityDisplay.textContent) : 1;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Reset quantity display
    if (quantityDisplay) {
        quantityDisplay.textContent = '1';
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${quantity} ${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('fruitfulFieldsCart', JSON.stringify(cart));
}

function updateCartDisplay() {
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Update cart items
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartItemsElement && cartTotalElement) {
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotalElement.textContent = '0';
        } else {
            cartItemsElement.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R${item.price} × ${item.quantity}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                </div>
            `).join('');
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = total;
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize products page when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
    
    // Also initialize map if on contact page
    if (document.getElementById('map')) {
        initMap();
    }
});
// ===== LIGHTBOX GALLERY FUNCTIONALITY =====

let currentImageIndex = 0;
let lightboxImages = [];

// Initialize lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    
    // Navigation
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Open lightbox with specific image
function openLightbox(imageIndex) {
    currentImageIndex = imageIndex;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxPrice = document.getElementById('lightbox-price');
    
    const product = lightboxImages[imageIndex];
    
    lightboxImage.src = product.image;
    lightboxImage.alt = product.name;
    lightboxTitle.textContent = product.name;
    lightboxPrice.textContent = `R${product.price}/kg`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Navigation functions
function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length;
    openLightbox(currentImageIndex);
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % lightboxImages.length;
    openLightbox(currentImageIndex);
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

// Setup lightbox for product images
function setupLightboxForProducts() {
    // Get all product images
    const productImages = document.querySelectorAll('.product-card img');
    
    // Populate lightbox images array
    lightboxImages = products;
    
    // Add click event to each product image
    productImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Also make product images accessible via keyboard
    productImages.forEach((img, index) => {
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}