// ======= allProducts (test data) =======
const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:'$9.99', emoji:'✨', category:'cute', badge:'Hot', badgeClass:'bg-danger' },
    { name:'Art Collection', description:'15 Artistic Design Stickers', price:'$14.99', emoji:'🎨', category:'art', badge:'Popular', badgeClass:'bg-success' },
    { name:'Star Bundle', description:'20 Star-Themed Stickers', price:'$12.99', emoji:'🌟', category:'cute', badge:'New' },
    { name:'Professional Pack', description:'12 Business Stickers', price:'$11.99', emoji:'💼', category:'business', badge:'Trending', badgeClass:'bg-warning' },
    { name:'Football Pack', description:'Football Stickers', price:'$13.99', emoji:'⚽', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:'$15.99', emoji:'🧑‍🎤', category:'anime' }
];

// ======= General render function (from main JS) =======
function renderProductCards(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        container.insertAdjacentHTML('beforeend', `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="product-card">
                    <div class="product-image">
                        ${product.badge ? `<div class="product-badge ${product.badgeClass || ''}">${product.badge}</div>` : ''}
                        ${product.emoji ? `<div class="sticker-display">${product.emoji}</div>` : `<img src="${product.image || ''}" alt="${product.name}">`}
                    </div>
                    <div class="product-info">
                        <h5>${product.name}</h5>
                        ${product.description ? `<p class="text-muted">${product.description}</p>` : ''}
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
    });
}

// ======= Category page specific =======
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const activeCategory = params.get('cat');

    // Filter products by category if ?cat exists
    const productsToShow = activeCategory
        ? allProducts.filter(p => p.category === activeCategory)
        : allProducts;

    // Update page title
    const title = document.getElementById('categoryTitle');
    if (title) {
        title.textContent = activeCategory
            ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) + ' Stickers'
            : 'All Stickers';
    }

    // Render product cards
    renderProductCards(productsToShow, 'productContainer');

    // Initialize product options buttons
    document.addEventListener('click', e => {
        const btn = e.target.closest('.choose-options-btn');
        if (!btn) return;

        openProductOptionsModal(btn);
    });

    // Handle product options form submission
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
});
