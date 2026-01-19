// Apple-Store JavaScript

let cart = [];
let cartCount = 0;
let cartItemIdCounter = 0;

const params = new URLSearchParams(window.location.search);
const activeCategory = params.get('cat');

const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:'$9.99', emoji:'✨', category:'cute', badge:'Hot', badgeClass:'bg-danger' },
    { name:'Art Collection', description:'15 Artistic Design Stickers', price:'$14.99', emoji:'🎨', category:'art', badge:'Popular', badgeClass:'bg-success' },
    { name:'Star Bundle', description:'20 Star-Themed Stickers', price:'$12.99', emoji:'🌟', category:'cute', badge:'New' },
    { name:'Professional Pack', description:'12 Business Stickers', price:'$11.99', emoji:'💼', category:'business', badge:'Trending', badgeClass:'bg-warning' },
    { name:'Football Pack', description:'Football Stickers', price:'$13.99', emoji:'⚽', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:'$15.99', emoji:'🧑‍🎤', category:'anime' }
];

function addProductToBestSeller(product) {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return;

    const productId = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    container.insertAdjacentHTML('beforeend', `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="product-card">
                <div class="product-image">
                    ${product.badge ? `<div class="product-badge ${product.badgeClass || ''}">${product.badge}</div>` : ''}
                    <div class="sticker-display" style="font-size:2rem;height:100px;display:flex;align-items:center;justify-content:center">
                        ${product.emoji}
                    </div>
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p class="text-muted">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">${product.price}</span>
                        <button class="btn btn-primary btn-sm choose-options-btn"
                            data-product-name="${product.name}"
                            data-product-price="${product.price}"
                            data-product-description="${product.description}"
                            data-product-emoji="${product.emoji}">
                            Choose options
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);
}


// Init products (NAVBAR HANDLED HERE)
function initBestSellerProducts() {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return;
    container.innerHTML = '';

    const productsToRender = activeCategory
        ? allProducts.filter(p => p.category === activeCategory)
        : allProducts;

    productsToRender.forEach(addProductToBestSeller);
}

// Cart
function addToCart(productName, price, quantity = 1, size = '', emoji = '✨') {
    cart.push({
        id: cartItemIdCounter++,
        name: productName,
        price: parseFloat(price),
        quantity,
        size,
        emoji
    });
    cartCount += quantity;
    updateCartCount();
    showNotification(`${quantity}x ${productName} added to cart!`);
}

function updateCartCount() {
    const el = document.querySelector('.cart-count');
    if (!el) return;
    el.textContent = cartCount;
    el.style.display = cartCount ? 'inline-block' : 'none';
}

function showNotification(message) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.style.cssText = `
        position:fixed;top:20px;right:20px;
        background:#28a745;color:#fff;
        padding:1rem 1.5rem;border-radius:10px;
        z-index:9999;
    `;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// Product modal
function initProductOptions() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.choose-options-btn');
        if (!btn) return;
        openProductOptionsModal(btn);
    });

    const form = document.getElementById('productOptionsForm');
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const name = productOptionsName.value;
        const price = productOptionsBasePrice.value;
        const size = productSize.value;
        const qty = parseInt(productQuantity.value) || 1;
        if (!size) return showNotification('Select size');
        addToCart(`${name} (${size})`, price, qty);
        bootstrap.Modal.getInstance(productOptionsModal).hide();
        form.reset();
    });
}

function openProductOptionsModal(btn) {
    productOptionsModalLabel.textContent = btn.dataset.productName;
    productOptionsDescription.textContent = btn.dataset.productDescription;
    productOptionsPrice.textContent = btn.dataset.productPrice;
    productOptionsName.value = btn.dataset.productName;
    productOptionsBasePrice.value = btn.dataset.productPrice.replace('$','');
    productOptionsImage.innerHTML = `<div style="font-size:4rem">${btn.dataset.productEmoji}</div>`;
    new bootstrap.Modal(productOptionsModal).show();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initBestSellerProducts();
    initProductOptions();

    const title = document.getElementById('categoryTitle');
    if (title && activeCategory) {
        title.textContent = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) + ' Stickers';
    }
});
