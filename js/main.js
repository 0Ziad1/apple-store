// ----------------------
// SAMPLE PRODUCTS FOR TESTING
// ----------------------
const products = [
    { id: 1, name: 'Sparkle sticker',image: '../assets/logo.jpg', description: '10 Premium Sparkle Stickers', price: 9.99, emoji: '✨', category: 'stickers', type: "cute" },
    { id: 2, name: 'phone sticker',image: '../assets/logo.jpg', description: '10 Premium Sparkle Stickers', price: 90, emoji: '✨', category: 'stickers' ,type: "cute"},
    { id: 3, name: 'fifa sticker',image: '../assets/logo.jpg', description: '10 Premium Sparkle Stickers', price: 129, emoji: '✨', category: 'stickers',type: "funny" },
    { id: 4, name: 'fruit sticker',image: '../assets/logo.jpg', description: '10 Premium Sparkle Stickers', price: 239, emoji: '✨', category: 'stickers',type: "football"},
    { id: 5, name: 'door sticker',image: '../assets/logo.jpg', description: '10 Premium Sparkle Stickers', price: 9339, emoji: '✨', category: 'stickers',type: "cute" },
    { id: 6, name: 'car sticker', image: '../assets/logo.jpg',description: '10 Premium Sparkle Stickers', price: 99, emoji: '✨', category: 'stickers',type: "cute" },
    { id: 7, name: 'Cat Mug', image: '../assets/logo.jpg',description: 'Cute Cat Ceramic Mug', price: 14.99, emoji: '🐱', category: 'mugs' },
    { id: 8, name: 'Rainbow Notebook',image: '../assets/logo.jpg', description: 'Colorful Notebook for Notes', price: 7.5, emoji: '🌈', category: 'sheet' },
    { id: 9, name: 'Coffee Sticker sheet', image: '../assets/logo.jpg',description: 'Set of 12 Coffee Stickers', price: 5.99, emoji: '☕', category: 'sheet' },
    { id: 10, name: 'Dog Mug',image: '../assets/logo.jpg', description: 'Adorable Dog Ceramic Mug', price: 15.99, emoji: '🐶', category: 'mugs' },
    { id: 11, name: 'Galaxy Medal', image: '../assets/logo.jpg',description: 'A3 Galaxy Poster Print', price: 12.5, emoji: '🌌', category: 'medals' },
];

// ----------------------
// CART SETUP
// ----------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((s, i) => s + i.quantity, 0);
let cartItemIdCounter = cart.length;

const shippingByGovernorate = {
    Cairo: 5, Giza: 6, Alexandria: 7, Qalyubia: 6, Sharqia: 7, Dakahlia: 7,
    Beheira: 7, Monufia: 6, Gharbia: 6, "Kafr El Sheikh": 7, Damietta: 7, "Port Said": 8,
    Ismailia: 8, Suez: 8, "North Sinai": 10, "South Sinai": 10, "Red Sea": 10,
    Faiyum: 7, "Beni Suef": 8, Minya: 8, Assiut: 9, Sohag: 9, Qena: 9, Luxor: 9,
    Aswan: 10, "New Valley": 10, Matrouh: 10
};

let productOptionsModal = null;

// ----------------------
// DOM ELEMENTS
// ----------------------
const citySelect = document.getElementById('city');
const checkoutItems = document.getElementById('checkoutItems');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const placeOrderBtn = document.getElementById('placeOrder');
const orderMsg = document.getElementById('orderMsg');
const visaRadio = document.getElementById('pmVisa');
const codRadio = document.getElementById('pmCod');
const visaFields = document.getElementById('visaFields');
const codNote = document.getElementById('codNote');
const bestSellerContainer = document.getElementById('bestSellerContainer');
const productOptionsModalEl = document.getElementById('productOptionsModal');
const productOptionsModalLabel = document.getElementById('productOptionsModalLabel');
const productOptionsCategory = document.getElementById('productOptionsCategory');
const productOptionsPrice = document.getElementById('productOptionsPrice');
const productOptionsCategoryInput = document.getElementById('productOptionsCategoryInput');
const productsContainer = document.getElementById('productsContainer');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const paginationEl = document.getElementById('pagination');
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const productOptionsForm = document.getElementById('productOptionsForm');
const productOptionsName = document.getElementById('productOptionsName');
const productOptionsBasePrice = document.getElementById('productOptionsBasePrice');
const productOptionsImage = document.getElementById('productOptionsImage');
const productQuantityInput = document.getElementById('productQuantity');
const productSizeSelect = document.getElementById('productSize');
const increaseQtyBtn = document.getElementById('increaseQty');
const decreaseQtyBtn = document.getElementById('decreaseQty');

// ----------------------
// PAGINATION CONFIG
// ----------------------
const productsPerPage = 8;
let currentPage = 1;

// ----------------------
// DOM CONTENT LOADED
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    renderCheckout();
    renderCartOffcanvas();

    // Sync dropdown with URL category (if any)
    syncCategoryDropdownWithUrl();

    // Single unified filter call
    filterAndSortProducts();

    renderBestSellers(products, 4);

    if (productOptionsModalEl && window.bootstrap) {
        productOptionsModal = new bootstrap.Modal(productOptionsModalEl);
    }

    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            window.location.href = '../pages/checkout.html';
        };
    }

    citySelect?.addEventListener('change', renderCheckout);
});

// ----------------------
// GET CATEGORY FROM URL
// ----------------------
function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cat');
}

// ----------------------
// SYNC DROPDOWN WITH URL
// ----------------------
function syncCategoryDropdownWithUrl() {
    const urlCategory = getCategoryFromUrl();
    if (urlCategory && categoryFilter) {
        categoryFilter.value = urlCategory;
    }
}

// ----------------------
// UNIFIED FILTER & SORT PRODUCTS (with pagination)
// ----------------------
function filterAndSortProducts() {
    let filtered = [...products];

    const urlCategory = getCategoryFromUrl();
    const dropdownCategory = categoryFilter?.value;
    
    // Treat 'default' or 'all' or null as the same thing
    const activeCategory = urlCategory || dropdownCategory;

    // Fix: Only filter if it's NOT 'all' AND NOT 'default'
    if (activeCategory && activeCategory !== 'all' && activeCategory !== 'default') {
        filtered = filtered.filter(p =>
            p.category === activeCategory || p.type === activeCategory
        );
    }

    // Sort Logic
    const sort = sortFilter?.value;
    if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProductsPage(filtered, currentPage);
}

// Event listeners for filter/sort
categoryFilter?.addEventListener('change', () => {
    // Clear URL param so dropdown takes priority
    const url = new URL(window.location);
    url.searchParams.delete('cat');
    window.history.pushState({}, '', url);

    currentPage = 1; 
    filterAndSortProducts();
});
sortFilter?.addEventListener('change', filterAndSortProducts);

// ----------------------
// RENDER PRODUCTS DYNAMICALLY
function renderProducts(productList = products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    productList.forEach(p => {
        const div = document.createElement('div');
        div.className = "col-6 col-md-3 mb-4";
div.innerHTML = `
    <div class="card h-100 border-0 shadow-sm product-card-hover">
        <div class="position-relative overflow-hidden rounded-top">
            <div class="img-wrapper">
                <img src="${p.image}" class="card-img-top p-3" alt="${p.name}" loading="lazy">
            </div>
        </div>
        
        <div class="card-body d-flex flex-column pt-0 text-center">
            <h6 class="card-title fw-bold text-dark mb-1 mt-2">${p.emoji} ${p.name}</h6>
            <div class="mt-auto">
                <div class="mb-2">
                    <span class="text-muted small d-block mb-0" style="font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase;">
                        Starts from
                    </span>
                    <span class="fs-5 fw-bold text-success price-green">$${p.price.toFixed(2)}</span>
                </div>
                
                ${p.category === 'stickers'
                    ? `<button class="btn btn-outline-success btn-sm w-100 rounded-pill open-product-options" data-id="${p.id}">
                        Choose options
                       </button>`
                    : `<button class="btn btn-success btn-sm w-100 rounded-pill btn-add-to-cart" 
                        data-id="${p.id}" 
                        data-name="${p.name}" 
                        data-price="${p.price}" 
                        data-emoji="${p.emoji}">
                        Add to Cart
                       </button>`
                }
            </div>
        </div>
    </div>
`;

        productsContainer.appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
    });

    // Event Listeners
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        if (!btn.closest('#productOptionsModal')) {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const emoji = btn.dataset.emoji || '✨';
                addToCart(name, price, 1, '', emoji);
            });
        }
    });
}

// ----------------------
// PRODUCTS PAGINATION
// ----------------------
function renderProductsPage(productList = products, page = 1) {
    if (!productsContainer) return;

    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = productList.slice(start, end);

    renderProducts(paginatedProducts);
    renderPagination(productList, page);
}

function renderPagination(productList, page) {
    if (!paginationEl) return;

    const totalPages = Math.ceil(productList.length / productsPerPage);
    let html = '';

    // Previous button
    html += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page - 1}"><i class="bi bi-chevron-left"></i></a>
    </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${page === i ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }

    // Next button
    html += `<li class="page-item ${page === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page + 1}"><i class="bi bi-chevron-right"></i></a>
    </li>`;

    paginationEl.innerHTML = html;

    // Add click events
    paginationEl.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const selectedPage = Number(link.dataset.page);
            const totalPages = Math.ceil(productList.length / productsPerPage);
            if (selectedPage >= 1 && selectedPage <= totalPages) {
                currentPage = selectedPage;
                filterAndSortProducts();
                document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ----------------------
// ADD TO CART FUNCTION
// ----------------------
function addToCart(name, price, quantity = 1, size = '', emoji = '✨') {
    cart.push({ id: cartItemIdCounter++, name, price: Number(price), quantity, size, emoji });
    cartCount += quantity;
    saveAndRenderCart();
    showCartToast(`${emoji} ${quantity}x ${name} added to cart`);
}

// ----------------------
// SAVE & RENDER CART
// ----------------------
function saveAndRenderCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    renderCheckout();
    renderCartOffcanvas();
}

// ----------------------
// UPDATE NAVBAR CART COUNT
// ----------------------
function updateCartCount() {
    const el = document.querySelector('.cart-count');
    if (!el) return;
    el.textContent = cartCount;
    el.style.display = cartCount ? 'inline-block' : 'none';
}

// ----------------------
// RENDER CART MODAL
// ----------------------
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const summary = document.getElementById('cartSummary');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;
    container.innerHTML = '';

    if (!cart.length) {
        if (summary) summary.style.display = 'none';
        container.innerHTML = `<div class="text-center py-5 text-muted">
            <i class="bi bi-cart-x" style="font-size: 4rem; color: #ccc;"></i>
            <p class="mt-3">Your cart is empty</p>
        </div>`;
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;

        container.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between align-items-center mb-3" data-id="${item.id}">
                <div>${item.emoji} ${item.name} (${item.size || 'N/A'}) x${item.quantity}</div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary decreaseQty">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary increaseQty">+</button>
                    <strong class="ms-2">$${total.toFixed(2)}</strong>
                    <button class="btn btn-sm btn-danger ms-2 removeItem">&times;</button>
                </div>
            </div>
        `);
    });

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (summary) summary.style.display = 'block';

    container.querySelectorAll('.removeItem').forEach(btn =>
        btn.onclick = e => removeCartItem(Number(e.target.closest('[data-id]').dataset.id))
    );
    container.querySelectorAll('.increaseQty').forEach(btn =>
        btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), 1)
    );
    container.querySelectorAll('.decreaseQty').forEach(btn =>
        btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), -1)
    );
}

// ----------------------
// REMOVE ITEM
// ----------------------
function removeCartItem(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    cartCount -= item.quantity;
    cart = cart.filter(i => i.id !== id);
    saveAndRenderCart();
}

// ----------------------
// CHANGE QUANTITY
// ----------------------
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeCartItem(id);
        return;
    }

    cartCount += delta;
    saveAndRenderCart();
}

// ----------------------
// NOTIFICATION
// ----------------------
function showNotification(msg) {
    console.log(msg);
}

// ----------------------
// CHECKOUT FUNCTIONS
// ----------------------
function getSubtotal() {
    return cart.reduce((s, i) => s + i.price * i.quantity, 0);
}

function getShipping() {
    const city = citySelect?.value;
    const baseShipping = shippingByGovernorate[city] || 0;
    const codExtra = codRadio?.checked ? 2 : 0;
    return baseShipping + codExtra;
}

function renderCheckout() {
    if (!checkoutItems) return;
    checkoutItems.innerHTML = '';

    if (!cart.length) {
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (shippingEl) shippingEl.textContent = 'Free';
        if (totalEl) totalEl.textContent = '$0.00';
        checkoutItems.innerHTML = `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
        return;
    }

    cart.forEach(item => {
        checkoutItems.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between">
                <div>${item.emoji} ${item.name} (${item.size || 'N/A'}) × ${item.quantity}</div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `);
    });

    const subtotal = getSubtotal();
    const shipping = getShipping();
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    if (totalEl) totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

// ----------------------
// CART OFFCANVAS RENDER
// ----------------------
function renderCartOffcanvas() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (!cart.length) {
        if (cartTotalEl) cartTotalEl.textContent = '$0.00';
        cartItemsEl.innerHTML = `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItemsEl.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between align-items-center" data-id="${item.id}">
                <div>${item.emoji} ${item.name} × ${item.quantity}</div>
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn btn-sm btn-outline-secondary decrease">-</button>
                    <button class="btn btn-sm btn-outline-secondary increase">+</button>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <button class="btn btn-sm btn-danger remove">&times;</button>
                </div>
            </div>
        `);
    });

    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

    cartItemsEl.querySelectorAll('.remove').forEach(b => b.onclick = e => updateQty(e, 0, true));
    cartItemsEl.querySelectorAll('.increase').forEach(b => b.onclick = e => updateQty(e, 1));
    cartItemsEl.querySelectorAll('.decrease').forEach(b => b.onclick = e => updateQty(e, -1));
}

function updateQty(e, delta, remove = false) {
    const id = Number(e.target.closest('[data-id]').dataset.id);
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (remove) {
        cart = cart.filter(i => i.id !== id);
    } else {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    }

    cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckout();
    renderCartOffcanvas();
    updateCartCount();
}

// ----------------------
// PAYMENT OPTION SWITCH
// ----------------------
if (visaRadio && codRadio && visaFields && codNote) {
    visaRadio.onchange = codRadio.onchange = () => {
        visaFields.classList.toggle('d-none', !visaRadio.checked);
        codNote.classList.toggle('d-none', !codRadio.checked);
        renderCheckout();
    };
}

// ----------------------
// PLACE ORDER
// ----------------------
placeOrderBtn?.addEventListener('click', () => {
    if (!cart.length) return;

    localStorage.removeItem('cart');
    cart = [];
    cartCount = 0;
    renderCheckout();
    renderCartOffcanvas();
    updateCartCount();

    if (orderMsg) orderMsg.textContent = '✅ Order placed successfully!';
});

// ----------------------
// PRODUCT OPTIONS MODAL QUANTITY BUTTONS
// ----------------------
if (increaseQtyBtn && decreaseQtyBtn && productQuantityInput) {
    increaseQtyBtn.onclick = () => {
        let val = parseInt(productQuantityInput.value);
        if (val < 99) productQuantityInput.value = val + 1;
    };
    decreaseQtyBtn.onclick = () => {
        let val = parseInt(productQuantityInput.value);
        if (val > 1) productQuantityInput.value = val - 1;
    };
}


// ----------------------
// LOGIN FORM RESET
// ----------------------
document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => {
    document.getElementById('loginForm')?.reset();
});

// ----------------------
// SHOW CART TOAST
// ----------------------
function showCartToast(message) {
    const toastEl = document.getElementById('cartToast');
    if (!toastEl) return;

    toastEl.querySelector('.toast-body').textContent = message;
    const toast = new bootstrap.Toast(toastEl, { delay: 2000, autohide: true });
    toast.show();
}

// ----------------------
// RENDER BEST SELLERS
function renderBestSellers(productList = products, maxItems = 4) {
    if (!bestSellerContainer) return;
    bestSellerContainer.innerHTML = '';

    const bestSellers = productList.slice(0, maxItems);

    bestSellers.forEach(p => {
        bestSellerContainer.insertAdjacentHTML('beforeend', `
            <div class="col-6 col-md-3 mb-4">
                <div class="card h-100 border-0 shadow-sm product-card-hover">
                    <div class="position-relative overflow-hidden rounded-top">
                        <div class="img-wrapper">
                            <img src="${p.image}" class="card-img-top p-3" alt="${p.name}" loading="lazy">
                        </div>
                    </div>
                    
                    <div class="card-body d-flex flex-column pt-0 text-center">
                        <h6 class="card-title fw-bold text-dark mb-1 mt-2">${p.emoji} ${p.name}</h6>
                        
                        <div class="mt-auto">
                            <div class="mb-2">
                                <span class="text-muted small d-block mb-0" style="font-size: 0.75rem; letter-spacing: 0.5px; text-transform: uppercase;">
                                    Starts from
                                </span>
                                <span class="fs-5 fw-bold text-success price-green">$${p.price.toFixed(2)}</span>
                            </div>
                            
                            ${p.category === 'stickers'
                                ? `<button class="btn btn-outline-success btn-sm w-100 rounded-pill open-product-options" data-id="${p.id}">
                                    Choose options
                                   </button>`
                                : `<button class="btn btn-success btn-sm w-100 rounded-pill btn-add-to-cart" 
                                    data-id="${p.id}" 
                                    data-name="${p.name}" 
                                    data-price="${p.price}" 
                                    data-emoji="${p.emoji}">
                                    Add to Cart
                                   </button>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    bestSellerContainer.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const emoji = btn.dataset.emoji || '✨';
            addToCart(name, price, 1, '', emoji);
        });
    });
}


// ----------------------
// OPEN PRODUCT OPTIONS MODAL (delegated click)
// ----------------------
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.open-product-options');
    if (!btn) return;
    const productId = Number(btn.dataset.id);
    openProductOptionsModal(productId);
});
let currentProduct = null;

function openProductOptionsModal(productId) {
    if (!productOptionsModal) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product; // store current product globally

    if (productOptionsModalLabel) productOptionsModalLabel.textContent = product.name;
    if (productOptionsCategory) productOptionsCategory.textContent = `Category: ${product.category}`;
    if (productOptionsPrice) productOptionsPrice.textContent = `$${product.price.toFixed(2)}`;

    if (productOptionsName) productOptionsName.value = product.name;
    if (productOptionsBasePrice) productOptionsBasePrice.value = product.price;
    if (productOptionsCategoryInput) productOptionsCategoryInput.value = product.category;

    if (productQuantityInput) productQuantityInput.value = 1;

    // Only show size selector for stickers
    if (productSizeSelect) {
        if (product.category === 'stickers') {
            productSizeSelect.parentElement.style.display = 'block';
            productSizeSelect.value = 'small';
        } else {
            productSizeSelect.parentElement.style.display = 'none';
            productSizeSelect.value = '';
        }
    }

    updateModalPrice();
    productOptionsModal.show();
}



// ----------------------
// SEARCH FUNCTIONALITY
// ----------------------
function getProductUrl(product) {
    return `pages/category.html?cat=${product.category}`;
}

function renderSearchResults(results) {
    if (!searchResults) return;
    searchResults.innerHTML = results.length
        ? results.map(p => `<a href="${getProductUrl(p)}" class="d-block p-2 border-bottom text-decoration-none text-dark">${p.name}</a>`).join('')
        : '<p class="text-muted p-3">No results found</p>';
}

searchButton?.addEventListener("click", () => {
    const query = searchInput?.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});

searchInput?.addEventListener("keypress", e => {
    if (e.key === "Enter") searchButton?.click();
});

searchInput?.addEventListener("input", () => {
    const query = searchInput?.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});


// Get modal elements
const productSize = document.getElementById('productSize');

//update price due to size
function updateModalPrice() {
    if (!currentProduct) return;

    let totalPrice = currentProduct.price;

    if (currentProduct.category === 'stickers') {
        const size = productSizeSelect?.value;
        if (size === 'medium') totalPrice += 15;
        if (size === 'large') totalPrice += 35;
    }   

    if (productOptionsPrice) productOptionsPrice.textContent = `$${totalPrice.toFixed(2)}`;
}


productSize.addEventListener('change', updateModalPrice);

// Example: Open modal with product
function openProductModal(product) {
    document.getElementById('productOptionsModalLabel').textContent = product.name;
    document.getElementById('productOptionsCategory').textContent = product.category;
    productOptionsBasePrice.value = product.price;
    productSize.value = 'small'; // default
    updateModalPrice();
}

// ----------------------
// PRODUCT OPTIONS FORM SUBMIT
// ----------------------
productOptionsForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentProduct) return;

    const name = productOptionsName?.value;
    const category = productOptionsCategoryInput?.value;
    const quantity = parseInt(productQuantityInput?.value) || 1;
    const size = productSizeSelect?.value;

    let finalPrice = currentProduct.price;

    if (currentProduct.category === 'stickers') {
        if (size === 'medium') finalPrice += 15;
        if (size === 'large') finalPrice += 35;
    }

    addToCart(name, finalPrice, quantity, size || '', currentProduct.emoji || '✨');
    showCartToast(`✅ ${quantity}x ${name} (${size || 'N/A'}) added to cart`);

    productOptionsModal?.hide();
});


document.getElementById('shopNowBtn').addEventListener('click', function(e) {
    e.preventDefault(); // prevent default jump
    const categorySection = document.getElementById('shopByCategory');
    categorySection.scrollIntoView({ behavior: 'smooth' });
});

