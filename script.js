// Modern FunNest Toys Store - JavaScript
// Enhanced with modern ES6+ features and improved functionality

class ToyStore {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Educational Puzzle Set",
                price: 29.99,
                category: "educational",
                age: "3-5",
                emoji: "🧩",
                badge: "Popular",
                image: null,
                description: "Interactive puzzle set that enhances problem-solving skills"
            },
            {
                id: 2,
                name: "Soccer Ball Pro",
                price: 24.99,
                category: "outdoor",
                age: "6-8",
                emoji: "⚽",
                badge: "New",
                image: null,
                description: "Professional-grade soccer ball for outdoor fun"
            },
            {
                id: 3,
                name: "Art & Craft Kit",
                price: 34.99,
                category: "creative",
                age: "3-5",
                emoji: "🎨",
                badge: "Sale",
                image: null,
                description: "Complete art kit to unleash creativity"
            },
            {
                id: 4,
                name: "Robot Building Kit",
                price: 89.99,
                category: "electronic",
                age: "9-12",
                emoji: "🤖",
                badge: "Premium",
                image: null,
                description: "Build and program your own robot"
            },
            {
                id: 5,
                name: "Math Learning Blocks",
                price: 19.99,
                category: "educational",
                age: "3-5",
                emoji: "🔢",
                badge: "Bestseller",
                image: null,
                description: "Fun way to learn numbers and basic math"
            },
            {
                id: 6,
                name: "Basketball Hoop Set",
                price: 49.99,
                category: "outdoor",
                age: "6-8",
                emoji: "🏀",
                badge: "New",
                image: null,
                description: "Adjustable basketball hoop for all ages"
            },
            {
                id: 7,
                name: "Musical Keyboard",
                price: 39.99,
                category: "creative",
                age: "3-5",
                emoji: "🎹",
                badge: "Popular",
                image: null,
                description: "Learn music with this beginner-friendly keyboard"
            },
            {
                id: 8,
                name: "Coding Game Tablet",
                price: 129.99,
                category: "electronic",
                age: "9-12",
                emoji: "📱",
                badge: "Premium",
                image: null,
                description: "Learn coding through fun interactive games"
            },
            {
                id: 9,
                name: "Science Experiment Kit",
                price: 44.99,
                category: "educational",
                age: "6-8",
                emoji: "🔬",
                badge: "Educational",
                image: null,
                description: "Hands-on science experiments for young explorers"
            },
            {
                id: 10,
                name: "Trampoline Mini",
                price: 79.99,
                category: "outdoor",
                age: "3-5",
                emoji: "🤸",
                badge: "Active",
                image: null,
                description: "Safe indoor/outdoor trampoline for toddlers"
            },
            {
                id: 11,
                name: "Clay Modeling Set",
                price: 16.99,
                category: "creative",
                age: "3-5",
                emoji: "🏺",
                badge: "Creative",
                image: null,
                description: "Non-toxic clay set for sculpting and modeling"
            },
            {
                id: 12,
                name: "Smart Watch for Kids",
                price: 99.99,
                category: "electronic",
                age: "6-8",
                emoji: "⌚",
                badge: "Tech",
                image: null,
                description: "Kid-friendly smartwatch with games and learning apps"
            }
        ];

        this.cart = this.loadCartFromStorage();
        this.filteredProducts = [...this.products];
        this.uploadedImages = [];
        this.currentFilters = {
            age: '',
            price: '',
            sort: 'name',
            search: ''
        };

        this.init();
    }

    // Initialize the application
    init() {
        this.bindEvents();
        this.loadProducts();
        this.updateCartCount();
        this.initializeAnimations();
        this.handleScroll();
    }

    // Bind all event listeners
    bindEvents() {
        // Mobile menu toggle
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', this.toggleMobileMenu);

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchProducts();
            });
            searchInput.addEventListener('input', this.debounce(this.searchProducts.bind(this), 300));
        }

        // Filter changes
        ['ageFilter', 'priceFilter', 'sortFilter'].forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });

        // Image upload
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Scroll events
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));

        // Cart modal close on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('cartModal');
            if (e.target === modal) this.toggleCart();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu && toggle) {
            navMenu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        }
    }

    // Handle scroll effects
    handleScroll() {
        const header = document.querySelector('.header');
        const scrolled = window.pageYOffset;
        
        if (header) {
            if (scrolled > 100) {
                header.style.background = 'linear-gradient(135deg, rgba(51, 150, 211, 0.95), rgba(235, 203, 144, 0.95))';
                header.style.backdropFilter = 'blur(15px)';
                header.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            } else {
                header.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'var(--shadow-lg)';
            }
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }

    // Debounce utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Close cart with Escape
        if (e.key === 'Escape') {
            const modal = document.getElementById('cartModal');
            if (modal && modal.style.display === 'block') {
                this.toggleCart();
            }
        }

        // Focus search with Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }

        // Quick add to cart with Enter when product is focused
        if (e.key === 'Enter' && e.target.classList.contains('add-to-cart')) {
            e.target.click();
        }
    }

    // Setup Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll('.category-card, .product-card, .feature-item');
        animateElements.forEach(el => observer.observe(el));
    }

    // Handle image upload with enhanced features
    async handleImageUpload(event) {
        const files = Array.from(event.target.files);
        this.uploadedImages = [];
        
        if (files.length === 0) return;

        // Show loading state
        this.showNotification('Uploading images...', 'info');
        
        try {
            const imagePromises = files.map((file, index) => this.processImage(file, index));
            const processedImages = await Promise.all(imagePromises);
            
            this.uploadedImages = processedImages.filter(img => img !== null);
            this.assignImagesToProducts();
            this.loadProducts();
            
            this.showNotification(`Successfully uploaded ${this.uploadedImages.length} images!`, 'success');
        } catch (error) {
            this.showNotification('Error uploading images. Please try again.', 'error');
            console.error('Image upload error:', error);
        }
    }

    // Process individual image with validation and optimization
    processImage(file, index) {
        return new Promise((resolve) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showNotification(`File ${file.name} is not a valid image`, 'warning');
                resolve(null);
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification(`File ${file.name} is too large (max 5MB)`, 'warning');
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for image optimization
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate dimensions (max 800x600)
                    const maxWidth = 800;
                    const maxHeight = 600;
                    let { width, height } = img;
                    
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and optimize image
                    ctx.drawImage(img, 0, 0, width, height);
                    const optimizedImage = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(optimizedImage);
                };
                img.src = e.target.result;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
    }

    // Assign uploaded images to products
    assignImagesToProducts() {
        this.products.forEach((product, index) => {
            if (this.uploadedImages[index]) {
                product.image = this.uploadedImages[index];
            }
        });
    }

    // Reset images to default
    resetImages() {
        this.products.forEach(product => {
            product.image = null;
        });
        this.uploadedImages = [];
        
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) imageUpload.value = '';
        
        this.loadProducts();
        this.showNotification('Images reset to default', 'info');
    }

    // Enhanced product loading with animations
    async loadProducts() {
        const grid = document.getElementById('productsGrid');
        const loading = document.getElementById('loading');
        
        if (!grid || !loading) return;

        // Show loading animation
        loading.style.display = 'block';
        grid.innerHTML = '';
        
        // Simulate loading delay for better UX
        await this.delay(800);
        
        loading.style.display = 'none';
        
        // Create product cards with staggered animation
        this.filteredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(productCard);
        });

        // Show "no products" message if empty
        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
        }
    }

    // Create enhanced product card element
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.dataset.category = product.category;
        card.dataset.age = product.age;
        card.dataset.price = product.price;
        
        const imageContent = product.image 
            ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
            : `<i class="fas fa-${this.getIconForCategory(product.category)}" style="font-size: 3rem;"></i>`;
        
        card.innerHTML = `
            <div class="product-image">
                ${imageContent}
                <div class="product-badge">${product.badge}</div>
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="toyStore.showProductModal(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">${product.price.toFixed(2)}</div>
                <div class="product-age">Ages ${product.age}</div>
                <button class="add-to-cart" onclick="toyStore.addToCart(${product.id})" 
                        aria-label="Add ${product.name} to cart">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        `;
        
        return card;
    }

    // Get appropriate icon for category
    getIconForCategory(category) {
        const icons = {
            educational: 'puzzle-piece',
            outdoor: 'football-ball',
            creative: 'palette',
            electronic: 'robot'
        };
        return icons[category] || 'toy-brick';
    }

    // Filter products by category
    filterByCategory(category) {
        this.currentFilters.category = category;
        this.filteredProducts = this.products.filter(product => product.category === category);
        this.loadProducts();
        
        // Smooth scroll to products section
        document.getElementById('products')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Apply all filters
    applyFilters() {
        const ageFilter = document.getElementById('ageFilter')?.value || '';
        const priceFilter = document.getElementById('priceFilter')?.value || '';
        const sortFilter = document.getElementById('sortFilter')?.value || 'name';
        
        this.currentFilters = { ...this.currentFilters, age: ageFilter, price: priceFilter, sort: sortFilter };
        
        // Start with all products
        this.filteredProducts = [...this.products];
        
        // Apply search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            this.filteredProducts = this.filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply age filter
        if (ageFilter) {
            this.filteredProducts = this.filteredProducts.filter(product => product.age === ageFilter);
        }
        
        // Apply price filter
        if (priceFilter) {
            this.filteredProducts = this.filteredProducts.filter(product => {
                if (priceFilter === '100+') return product.price >= 100;
                const [min, max] = priceFilter.split('-').map(Number);
                return product.price >= min && product.price <= max;
            });
        }
        
        // Apply sorting
        this.sortProducts(sortFilter);
        
        this.loadProducts();
    }

    // Sort products
    sortProducts(sortType) {
        const sortFunctions = {
            'name': (a, b) => a.name.localeCompare(b.name),
            'price-low': (a, b) => a.price - b.price,
            'price-high': (a, b) => b.price - a.price,
            'newest': (a, b) => b.id - a.id
        };
        
        this.filteredProducts.sort(sortFunctions[sortType] || sortFunctions.name);
    }

    // Search products with enhanced functionality
    searchProducts() {
        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';
        this.currentFilters.search = searchTerm;
        this.applyFilters();
    }

    // Add product to cart with enhanced feedback
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.updateCartCount();
        this.updateCartDisplay();
        this.saveCartToStorage();
        
        // Enhanced feedback animation
        const button = event.target.closest('.add-to-cart');
        if (button) {
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.background = 'var(--color-success)';
            button.style.color = 'var(--color-white)';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
                button.style.color = '';
                button.disabled = false;
            }, 1500);
        }
        
        this.showNotification(`${product.name} added to cart!`, 'success');
        this.animateCartIcon();
    }

    // Animate cart icon when item is added
    animateCartIcon() {
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.classList.add('cart-bounce');
            setTimeout(() => cartContainer.classList.remove('cart-bounce'), 600);
        }
    }

    // Update cart count display
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Toggle cart modal with enhanced animations
    toggleCart() {
        const modal = document.getElementById('cartModal');
        if (!modal) return;
        
        const isVisible = modal.style.display === 'block';
        
        if (isVisible) {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('fade-out');
            }, 300);
        } else {
            modal.style.display = 'block';
            modal.classList.add('fade-in');
            this.updateCartDisplay();
            setTimeout(() => modal.classList.remove('fade-in'), 300);
        }
    }

    // Update cart display with enhanced UI
    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!cartItems || !cartTotal || !checkoutBtn) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button onclick="toyStore.toggleCart()" class="continue-shopping-btn">
                        Continue Shopping
                    </button>
                </div>
            `;
            cartTotal.style.display = 'none';
            checkoutBtn.style.display = 'none';
            return;
        }
        
        let itemsHTML = '';
        let total = 0;
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        ${item.image ? 
                            `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` :
                            `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">${item.emoji}</div>`
                        }
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toFixed(2)} × ${item.quantity}</p>
                        <p class="item-subtotal">Subtotal: ${itemTotal.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" onclick="toyStore.updateQuantity(${item.id}, -1)" 
                                aria-label="Decrease quantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase" onclick="toyStore.updateQuantity(${item.id}, 1)" 
                                aria-label="Increase quantity">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="toyStore.removeFromCart(${item.id})" 
                                aria-label="Remove ${item.name} from cart">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.innerHTML = `
            <div class="cart-summary">
                <div class="cart-subtotal">Subtotal: ${total.toFixed(2)}</div>
                <div class="cart-tax">Tax (8%): ${(total * 0.08).toFixed(2)}</div>
                <div class="cart-total-amount">Total: ${(total * 1.08).toFixed(2)}</div>
            </div>
        `;
        cartTotal.style.display = 'block';
        checkoutBtn.style.display = 'block';
    }

    // Update item quantity in cart
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartCount();
            this.updateCartDisplay();
            this.saveCartToStorage();
        }
    }

    // Remove item from cart with confirmation
    removeFromCart(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        // Add removal animation
        const cartItemEl = document.querySelector(`[data-product-id="${productId}"]`);
        if (cartItemEl) {
            cartItemEl.classList.add('removing');
            setTimeout(() => {
                this.cart = this.cart.filter(item => item.id !== productId);
                this.updateCartCount();
                this.updateCartDisplay();
                this.saveCartToStorage();
                this.showNotification(`${item.name} removed from cart`, 'info');
            }, 300);
        }
    }

    // Enhanced checkout process
    async checkout() {
        if (this.cart.length === 0) return;
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * 0.08;
        const finalTotal = total + tax;
        
        // Show checkout confirmation
        const confirmed = await this.showConfirmDialog(
            'Confirm Order',
            `
            <div class="checkout-summary">
                <h4>Order Summary:</h4>
                ${this.cart.map(item => 
                    `<div class="checkout-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>`
                ).join('')}
                <hr>
                <div class="checkout-totals">
                    <div>Subtotal: ${total.toFixed(2)}</div>
                    <div>Tax: ${tax.toFixed(2)}</div>
                    <div><strong>Total: ${finalTotal.toFixed(2)}</strong></div>
                </div>
            </div>
            `
        );
        
        if (confirmed) {
            // Simulate order processing
            this.showNotification('Processing your order...', 'info');
            
            await this.delay(2000);
            
            // Clear cart and show success
            this.cart = [];
            this.updateCartCount();
            this.updateCartDisplay();
            this.saveCartToStorage();
            this.toggleCart();
            
            this.showNotification('Order placed successfully! 🎉', 'success');
        }
    }

    // Show product modal for quick view
    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="product-modal-content">
                <button class="close-modal" onclick="this.closest('.product-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-modal-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}">` :
                        `<div class="emoji-placeholder">${product.emoji}</div>`
                    }
                </div>
                <div class="product-modal-info">
                    <h2>${product.name}</h2>
                    <p class="product-modal-description">${product.description}</p>
                    <div class="product-modal-price">${product.price.toFixed(2)}</div>
                    <div class="product-modal-age">Recommended for ages ${product.age}</div>
                    <div class="product-modal-category">Category: ${product.category}</div>
                    <button class="add-to-cart modal-add-btn" onclick="toyStore.addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Show notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Show confirmation dialog
    showConfirmDialog(title, content) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-dialog-content">
                    <h3>${title}</h3>
                    <div class="confirm-dialog-body">${content}</div>
                    <div class="confirm-dialog-actions">
                        <button class="btn btn-secondary cancel-btn">Cancel</button>
                        <button class="btn btn-primary confirm-btn">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            dialog.querySelector('.cancel-btn').onclick = () => {
                dialog.remove();
                resolve(false);
            };
            
            dialog.querySelector('.confirm-btn').onclick = () => {
                dialog.remove();
                resolve(true);
            };
            
            // Close on outside click
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    dialog.remove();
                    resolve(false);
                }
            });
        });
    }

    // Initialize animations
    initializeAnimations() {
        // Add CSS animations to head if not already present
        if (!document.querySelector('#custom-animations')) {
            const style = document.createElement('style');
            style.id = 'custom-animations';
            style.textContent = `
                .fade-in-up {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .cart-bounce {
                    animation: cartBounce 0.6s ease-out;
                }
                
                .removing {
                    animation: slideOutRight 0.3s ease-out forwards;
                }
                
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes cartBounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-10px); }
                    70% { transform: translateY(-5px); }
                }
                
                @keyframes slideOutRight {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }
                
                .notification-success { border-left: 4px solid var(--color-success); }
                .notification-error { border-left: 4px solid var(--color-error); }
                .notification-warning { border-left: 4px solid var(--color-warning); }
                .notification-info { border-left: 4px solid var(--color-primary); }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.5;
                    margin-left: auto;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Local storage functions
    saveCartToStorage() {
        try {
            localStorage.setItem('toystore-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.warn('Could not save cart to localStorage:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('toystore-cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Could not load cart from localStorage:', error);
            return [];
        }
    }
}

// Global functions for onclick handlers
let toyStore;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    toyStore = new ToyStore();
    
    // Global functions for backward compatibility
    window.filterByCategory = (category) => toyStore.filterByCategory(category);
    window.applyFilters = () => toyStore.applyFilters();
    window.searchProducts = () => toyStore.searchProducts();
    window.handleImageUpload = (event) => toyStore.handleImageUpload(event);
    window.resetImages = () => toyStore.resetImages();
    window.addToCart = (id) => toyStore.addToCart(id);
    window.toggleCart = () => toyStore.toggleCart();
    window.updateQuantity = (id, change) => toyStore.updateQuantity(id, change);
    window.removeFromCart = (id) => toyStore.removeFromCart(id);
    window.checkout = () => toyStore.checkout();
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const toggle = document.getElementById('mobile-menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = toggle?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
});

// Enhanced performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCaching();
    }
    
    setupLazyLoading() {
        // Lazy load images when they come into viewport
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    setupImageOptimization() {
        // Preload critical images
        const criticalImages = [
            'images/hero-background.jpg',
            'images/about-us.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    setupCaching() {
        // Cache frequently accessed elements
        this.cache = new Map();
        
        // Service worker registration for advanced caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Advanced search functionality
class SearchEngine {
    constructor(products) {
        this.products = products;
        this.searchIndex = this.buildSearchIndex();
    }
    
    buildSearchIndex() {
        const index = new Map();
        
        this.products.forEach(product => {
            const searchText = [
                product.name,
                product.category,
                product.description,
                product.age
            ].join(' ').toLowerCase();
            
            const words = searchText.split(/\s+/);
            words.forEach(word => {
                if (!index.has(word)) {
                    index.set(word, new Set());
                }
                index.get(word).add(product.id);
            });
        });
        
        return index;
    }
    
    search(query) {
        if (!query) return this.products;
        
        const words = query.toLowerCase().split(/\s+/);
        let results = new Set();
        let isFirst = true;
        
        words.forEach(word => {
            const matches = new Set();
            
            // Exact matches
            if (this.searchIndex.has(word)) {
                this.searchIndex.get(word).forEach(id => matches.add(id));
            }
            
            // Fuzzy matches (contains)
            for (let [indexWord, productIds] of this.searchIndex) {
                if (indexWord.includes(word)) {
                    productIds.forEach(id => matches.add(id));
                }
            }
            
            if (isFirst) {
                results = matches;
                isFirst = false;
            } else {
                results = new Set([...results].filter(id => matches.has(id)));
            }
        });
        
        return this.products.filter(product => results.has(product.id));
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToyStore, SearchEngine, PerformanceOptimizer };
}