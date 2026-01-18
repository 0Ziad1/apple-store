// Apple-Store JavaScript

// Cart functionality
let cart = [];
let cartCount = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initSmoothScroll();
    initScrollTop();
    initFormValidation();
    animateOnScroll();
    initSearchFunctionality();
    initLoginFunctionality();
});

// Add to cart function
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });
    cartCount++;
    updateCartCount();
    showNotification(`${productName} added to cart!`);
    
    // Animate cart button
    const cartBtn = document.querySelector('.cart-count').parentElement;
    cartBtn.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        cartBtn.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        if (cartCount > 0) {
            cartCountElement.style.display = 'inline-block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cart') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

// Scroll to top button
function initScrollTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
}

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

// Form validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && subject && message) {
                showNotification('Thank you! Your message has been sent.');
                contactForm.reset();
            } else {
                showNotification('Please fill in all fields.');
            }
        });
    }
}

// Newsletter subscription
document.querySelectorAll('.btn[type="button"]').forEach(btn => {
    if (btn.textContent.trim() === 'Subscribe') {
        btn.addEventListener('click', function() {
            const emailInput = this.previousElementSibling;
            if (emailInput.value) {
                showNotification('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                showNotification('Please enter your email address.');
            }
        });
    }
});

// Animate on scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.product-card, .category-card, .card').forEach(el => {
        observer.observe(el);
    });
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchModal = document.getElementById('searchModal');
    
    // Sample products for search (you can expand this)
    const products = [
        { name: 'Sparkle Pack', category: 'Artistic', price: 9.99 },
        { name: 'Art Collection', category: 'Artistic', price: 14.99 },
        { name: 'Star Bundle', category: 'Artistic', price: 12.99 },
        { name: 'Professional Pack', category: 'Business', price: 11.99 },
        { name: 'Gaming Set', category: 'Gaming', price: 13.99 },
        { name: 'Funny Faces', category: 'Funny', price: 10.99 }
    ];
    
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.innerHTML = '';
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredProducts.length === 0) {
            searchResults.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-search fs-1 mb-2"></i>
                    <p>No products found matching "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = filteredProducts.map(product => `
                <div class="search-result-item" onclick="window.location.href='#shop'">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${product.name}</h6>
                            <small class="text-muted">${product.category}</small>
                        </div>
                        <span class="text-primary fw-bold">$${product.price}</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Search on input
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });
        
        // Search on button click
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }
    
    // Clear results when modal closes
    if (searchModal) {
        searchModal.addEventListener('hidden.bs.modal', function() {
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        });
    }
}

// Login functionality
function initLoginFunctionality() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simulate login (in a real app, this would make an API call)
            if (email && password) {
                showNotification('Login successful! Welcome back.');
                
                // Close modal after short delay
                setTimeout(() => {
                    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    if (loginModal) {
                        loginModal.hide();
                    }
                    loginForm.reset();
                }, 1500);
            } else {
                showNotification('Please fill in all fields.');
            }
        });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
