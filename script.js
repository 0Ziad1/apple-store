// Apple-Store JavaScript

let cart = [];
let cartCount = 0;
let cartItemIdCounter = 0;

// Add product to Best Seller
function addProductToBestSeller(product) {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return;

    const productId = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    const productHTML = `
        <div class="col-md-6 col-lg-3">
            <div class="product-card border p-2 mb-3">
                <div class="product-image mb-2">
                    ${product.badge ? `<div class="product-badge ${product.badgeClass || ''}">${product.badge}</div>` : ''}
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="img-fluid">` : `<div class="sticker-display" style="font-size:2rem;height:100px;display:flex;align-items:center;justify-content:center">${product.emoji || '✨'}</div>`}
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
    const item = { id: cartItemIdCounter++, name: productName, price: parseFloat(price.toString().replace('$','')), quantity, size, emoji };
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
    const price = parseFloat(btn.dataset.productPrice.replace('$',''));
    const desc = btn.dataset.productDescription;
    const emoji = btn.dataset.productEmoji;
    const image = btn.dataset.productImage;

    const modalLabel = document.getElementById('productOptionsModalLabel');
    const modalDesc = document.getElementById('productOptionsDescription');
    const modalPrice = document.getElementById('productOptionsPrice');
    const modalName = document.getElementById('productOptionsName');
    const modalBasePrice = document.getElementById('productOptionsBasePrice');
    const modalImage = document.getElementById('productOptionsImage');

    if (modalLabel) modalLabel.textContent = name;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPrice) modalPrice.textContent = btn.dataset.productPrice;
    if (modalName) modalName.value = name;
    if (modalBasePrice) modalBasePrice.value = price;

    if (modalImage) modalImage.innerHTML = image ? `<img src="${image}" alt="${name}" class="img-fluid rounded">` : `<div class="sticker-display-large" style="font-size:4rem;height:150px;display:flex;align-items:center;justify-content:center">${emoji}</div>`;

    const sizeInput = document.getElementById('productSize');
    if (sizeInput) sizeInput.value = '';

    const qtyInput = document.getElementById('productQuantity');
    if (qtyInput) qtyInput.value = 1;

    new bootstrap.Modal(document.getElementById('productOptionsModal')).show();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initSmoothScroll();
    initBestSellerProducts(); // products must be initialized first
    initProductOptions();     // then modal listener
});

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummary');
    if (!container) return; // <-- prevent empty modal error

    if (!cart.length) {
        container.innerHTML = `<div class="empty-cart text-center py-5">
            <i class="bi bi-cart-x" style="font-size:4rem;color:#ccc;"></i>
            <p class="text-muted mt-3">Your cart is empty</p>
            <a href="#shop" class="btn btn-primary mt-2" data-bs-dismiss="modal">Continue Shopping</a>
        </div>`;
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
