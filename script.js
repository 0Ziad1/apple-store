// Apple-Store JavaScript

// Cart functionality
let cart = [];
let cartCount = 0;
let cartItemIdCounter = 0;

// Add product to Best Seller section dynamically
function addProductToBestSeller(product) {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return;

    const productId = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const productHTML = `
        <div class="col-md-6 col-lg-3">
            <div class="product-card">
                <div class="product-image">
                    ${product.badge ? `<div class="product-badge ${product.badgeClass || ''}">${product.badge}</div>` : ''}
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="img-fluid">` : `<div class="sticker-display">${product.emoji || '✨'}</div>`}
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    ${product.description ? `<p class="text-muted">${product.description}</p>` : ''}
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">${product.price}</span>
                        <button class="btn btn-primary btn-sm choose-options-btn" 
                            data-product-name="${product.name}"
                            data-product-price="${product.price}"
                            data-product-description="${product.description || ''}"
                            data-product-emoji="${product.emoji || '✨'}"
                            data-product-image="${product.image || ''}"
                            data-product-id="${productId}">
                            Choose options
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', productHTML);
}

// Initialize Best Seller products
function initBestSellerProducts() {
    const bestSellerProducts = [
        { name: 'Sparkle Pack', description: '10 Premium Sparkle Stickers', price: '$9.99', emoji: '✨', badge: 'Hot', badgeClass: 'bg-danger' },
        { name: 'Art Collection', description: '15 Artistic Design Stickers', price: '$14.99', emoji: '🎨', badge: 'Popular', badgeClass: 'bg-success' },
        { name: 'Star Bundle', description: '20 Star-Themed Stickers', price: '$12.99', emoji: '🌟', badge: 'New', badgeClass: '' },
        { name: 'Professional Pack', description: '12 Business Stickers', price: '$11.99', emoji: '💼', badge: 'Trending', badgeClass: 'bg-warning' }
    ];
    bestSellerProducts.forEach(product => addProductToBestSeller(product));
}

// Add item to cart
function addToCart(productName, price, quantity = 1, size = '', emoji = '✨') {
    const item = { id: cartItemIdCounter++, name: productName, price: parseFloat(price.replace('$', '')), quantity, size, emoji };
    cart.push(item);
    cartCount += quantity;
    updateCartCount();
    showNotification(`${quantity}x ${productName} added to cart!`);
    const cartBtn = document.querySelector('.cart-count')?.parentElement;
    if (cartBtn) {
        cartBtn.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => cartBtn.classList.remove('animate__animated', 'animate__bounce'), 1000);
    }
}

// Update cart count badge
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'inline-block' : 'none';
    }
}

// Show notification popup
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
        padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999; animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
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
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse?.classList.contains('show')) new bootstrap.Collapse(navbarCollapse).hide();
                }
            }
        });
    });
}

// Scroll to top button


// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

// Animate on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.product-card, .card').forEach(el => observer.observe(el));
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const products = [
        { name: 'Sparkle Pack', category: 'Artistic', price: 9.99 },
        { name: 'Art Collection', category: 'Artistic', price: 14.99 },
        { name: 'Star Bundle', category: 'Artistic', price: 12.99 },
        { name: 'Professional Pack', category: 'Business', price: 11.99 },
        { name: 'Gaming Set', category: 'Gaming', price: 13.99 },
        { name: 'Funny Faces', category: 'Funny', price: 10.99 }
    ];

    function performSearch(query) {
        if (!query.trim()) { searchResults.innerHTML = ''; return; }
        const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()));
        searchResults.innerHTML = filtered.length
            ? filtered.map(p => `<div class="search-result-item" onclick="window.location.href='#shop'"><div class="d-flex justify-content-between align-items-center"><div><h6 class="mb-1">${p.name}</h6><small class="text-muted">${p.category}</small></div><span class="text-primary fw-bold">$${p.price}</span></div></div>`).join('')
            : `<div class="text-center text-muted py-4"><i class="bi bi-search fs-1 mb-2"></i><p>No products found matching "${query}"</p></div>`;
    }

    searchInput?.addEventListener('input', e => performSearch(e.target.value));
    searchButton?.addEventListener('click', () => performSearch(searchInput.value));
    searchInput?.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); performSearch(searchInput.value); } });
}

// Product options modal
function initProductOptions() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.choose-options-btn');
        if (!btn) return;
        openProductOptionsModal(btn);
    });

    const form = document.getElementById('productOptionsForm');
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('productOptionsName').value;
        const basePrice = parseFloat(document.getElementById('productOptionsBasePrice').value);
        const size = document.getElementById('productSize').value;
        const quantity = parseInt(document.getElementById('productQuantity').value) || 1;
        if (!size) return showNotification('Please select a size.');
        addToCart(`${name} (${size})`, basePrice, quantity);
        bootstrap.Modal.getInstance(document.getElementById('productOptionsModal'))?.hide();
        form.reset();
        document.getElementById('productQuantity').value = 1;
    });
}

function openProductOptionsModal(btn) {
    const name = btn.dataset.productName;
    const price = parseFloat(btn.dataset.productPrice.replace('$', ''));
    const desc = btn.dataset.productDescription;
    const emoji = btn.dataset.productEmoji;
    const image = btn.dataset.productImage;

    document.getElementById('productOptionsModalLabel').textContent = name;
    document.getElementById('productOptionsDescription').textContent = desc;
    document.getElementById('productOptionsPrice').textContent = btn.dataset.productPrice;
    document.getElementById('productOptionsName').value = name;
    document.getElementById('productOptionsBasePrice').value = price;

    const imgContainer = document.getElementById('productOptionsImage');
    imgContainer.innerHTML = image ? `<img src="${image}" alt="${name}" class="img-fluid rounded">` : `<div class="sticker-display-large">${emoji}</div>`;
    document.getElementById('productSize').value = '';
    document.getElementById('productQuantity').value = 1;

    new bootstrap.Modal(document.getElementById('productOptionsModal')).show();
}

// Cart modal
function initCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal?.addEventListener('shown.bs.modal', () => { renderCartItems(); updateCartSummary(); });
    document.getElementById('checkoutButton')?.addEventListener('click', () => { if (cart.length > 0) showNotification('Proceeding to checkout...'); });
}

// Render cart items
function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    if (!cart.length) {
        container.innerHTML = `<div class="empty-cart text-center py-5"><i class="bi bi-cart-x" style="font-size:4rem;color:#ccc;"></i><p class="text-muted mt-3">Your cart is empty</p><a href="#shop" class="btn btn-primary mt-2" data-bs-dismiss="modal">Continue Shopping</a></div>`;
        if (summary) summary.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item mb-3 pb-3 border-bottom" data-item-id="${item.id}">
            <div class="row align-items-center">
                <div class="col-md-6 d-flex align-items-center">
                    <div class="cart-item-image me-3"><div class="cart-sticker-display">${item.emoji}</div></div>
                    <div><h6 class="mb-1">${item.name}</h6>${item.size ? `<small class="text-muted">Size: ${item.size}</small>` : ''}</div>
                </div>
                <div class="col-md-3">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id},-1)">-</button>
                        <input type="number" class="form-control text-center cart-item-quantity" value="${item.quantity}" min="1" max="99" onchange="updateCartItemQuantityFromInput(${item.id},this.value)">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id},1)">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-end"><span class="fw-bold">$${(item.price*item.quantity).toFixed(2)}</span></div>
                <div class="col-md-1 text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${item.id})" title="Remove"><i class="bi bi-trash"></i></button></div>
            </div>
        </div>
    `).join('');
    if (summary) summary.style.display = 'block';
}

// Cart update functions
function updateCartItemQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty < 1) { removeCartItem(id); return; }
    if (newQty > 99) return;
    cartCount += change;
    item.quantity = newQty;
    updateCartCount(); renderCartItems(); updateCartSummary();
}

function updateCartItemQuantityFromInput(id, value) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = parseInt(value) || 1;
    if (newQty < 1 || newQty > 99) { renderCartItems(); return; }
    cartCount += newQty - item.quantity;
    item.quantity = newQty;
    updateCartCount(); renderCartItems(); updateCartSummary();
}

function removeCartItem(id) {
    const index = cart.findIndex(i => i.id === id);
    if (index === -1) return;
    cartCount -= cart[index].quantity;
    cart.splice(index, 1);
    updateCartCount(); renderCartItems(); updateCartSummary(); showNotification('Item removed from cart');
}

function updateCartSummary() {
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (!subtotalEl || !totalEl) return;
    const subtotal = cart.reduce((sum,i)=>sum+i.price*i.quantity,0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes slideOut {from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}
`;
document.head.appendChild(style);

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initSmoothScroll();
    animateOnScroll();
    initSearchFunctionality();
    initBestSellerProducts();
    initProductOptions();
    initCartModal();
});
