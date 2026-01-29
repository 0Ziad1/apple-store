// ----------------------
// ----------------------
// SAMPLE PRODUCTS FOR TESTING
// ----------------------
const products = [
    { id: 1, name: 'Sparkle Pack', description: '10 Premium Sparkle Stickers', price: 9.99, emoji: '✨', category: 'cute' },
    { id: 2, name: 'Cat Mug', description: 'Cute Cat Ceramic Mug', price: 14.99, emoji: '🐱', category: 'anime' },
    { id: 3, name: 'Rainbow Notebook', description: 'Colorful Notebook for Notes', price: 7.5, emoji: '🌈', category: 'anime' },
    { id: 4, name: 'Coffee Sticker Set', description: 'Set of 12 Coffee Stickers', price: 5.99, emoji: '☕', category: 'cute' },
    { id: 5, name: 'Dog Mug', description: 'Adorable Dog Ceramic Mug', price: 15.99, emoji: '🐶', category: 'funny' },
    { id: 6, name: 'Galaxy Poster', description: 'A3 Galaxy Poster Print', price: 12.5, emoji: '🌌', category: 'football' },
];

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
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    renderCheckout();
    renderCartOffcanvas();
    renderProducts();
    renderBestSellers(products, 4);
    filterAndSortProducts();

    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            const path = window.location.pathname.includes('/pages/') ? 'checkout.html' : 'pages/checkout.html';
            window.location.href = path;
        };
    }

    citySelect?.addEventListener('change', renderCheckout);
});
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
///////////////////////
const productOptionsModalEl = document.getElementById('productOptionsModal');

const productOptionsModalLabel = document.getElementById('productOptionsModalLabel');
const productOptionsCategory = document.getElementById('productOptionsCategory');
const productOptionsPrice = document.getElementById('productOptionsPrice');

const productOptionsCategoryInput = document.getElementById('productOptionsCategoryInput');

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
        summary.style.display = 'none';
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

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    summary.style.display = 'block';

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
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = 'Free';
        totalEl.textContent = '$0.00';
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
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

// ----------------------
// CART OFFCANVAS RENDER
// ----------------------
function renderCartOffcanvas() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (!cart.length) {
        cartTotalEl.textContent = '$0.00';
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

    cartTotalEl.textContent = `$${total.toFixed(2)}`;

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

    orderMsg.textContent = '✅ Order placed successfully!';
});

// ----------------------
// PRODUCT OPTIONS MODAL ADD TO CART
// ----------------------
const productOptionsForm = document.getElementById('productOptionsForm');
const productOptionsName = document.getElementById('productOptionsName');
const productOptionsBasePrice = document.getElementById('productOptionsBasePrice');
const productOptionsImage = document.getElementById('productOptionsImage');
const productQuantityInput = document.getElementById('productQuantity');
const productSizeSelect = document.getElementById('productSize');
const increaseQtyBtn = document.getElementById('increaseQty');
const decreaseQtyBtn = document.getElementById('decreaseQty');



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
// PRODUCT CARD ADD TO CART BUTTON
// ----------------------
document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const emoji = btn.dataset.emoji || '✨';
        addToCart(name, price, 1, '', emoji);
    });
});

// ----------------------
// DOM CONTENT LOADED
// ----------------------


// ----------------------
// LOGIN FORM RESET
// ----------------------
document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => {
    document.getElementById('loginForm').reset();
});


// ----------------------
// RENDER PRODUCTS DYNAMICALLY
// ----------------------
const productsContainer = document.getElementById('productsContainer');
function renderProducts(productList = products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    productList.forEach(p => {
        const div = document.createElement('div');
        div.className = "col-6 col-md-3 mb-4";
        div.innerHTML = `
            <div class="card h-100 text-center shadow-sm">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.emoji} ${p.name}</h5>
                    <p class="card-text text-muted">${p.description}</p>
                    <strong class="mb-3">$${p.price.toFixed(2)}</strong>
                    <button class="btn btn-primary open-product-options mt-auto"
                            data-id="${p.id}">
                            Choose options
                        </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(div);
        // Small delay for fade effect
        setTimeout(() => div.classList.add('show'), 50);
    });

    // Reattach Add to Cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const emoji = btn.dataset.emoji || '✨';
            addToCart(name, price, 1, '', emoji);
        });
    });
}



function showCartToast(message) {
    const toastEl = document.getElementById('cartToast');
    if (!toastEl) return;

    // Update the message
    toastEl.querySelector('.toast-body').textContent = message;

    // Initialize and show the Bootstrap toast
    const toast = new bootstrap.Toast(toastEl, { delay: 2000, autohide: true });
    toast.show();
}

// Highlight current navbar link
// Highlight current navbar link based on URL


// ----------------------
// PRODUCTS FILTER & SORT
// ----------------------
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

function filterAndSortProducts() {
    let filtered = [...products];

    // Filter by category
    const category = categoryFilter?.value;
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    const sort = sortFilter?.value;
    if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filtered);
}

// Event listeners
categoryFilter?.addEventListener('change', filterAndSortProducts);
sortFilter?.addEventListener('change', filterAndSortProducts);


// ----------------------
// PRODUCTS PAGINATION
// ----------------------
const productsPerPage = 8;
const paginationEl = document.getElementById('pagination');
let currentPage = 1;

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
            if (selectedPage >= 1 && selectedPage <= Math.ceil(products.length / productsPerPage)) {
                currentPage = selectedPage;
                filterAndSortProducts();

                // Smooth scroll to top of products
                document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

}

// Modify filter function to include pagination
function filterAndSortProducts() {
    let filtered = [...products];

    // Filter by category
    const category = categoryFilter?.value;
    if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    const sort = sortFilter?.value;
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderProductsPage(filtered, currentPage);
}


// ----------------------
// RENDER BEST SELLER SECTION WITH NOTIFICATION & IDs
// ----------------------

const productOptionsModal = new bootstrap.Modal(productOptionsModalEl);      // The Bootstrap instance

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.open-product-options');
    if (!btn) return;
    const productId = Number(btn.dataset.id);
    openProductOptionsModal(productId); // This already calls .show()
});



function renderBestSellers(productList = products, maxItems = 4) {
    if (!bestSellerContainer) return;
    bestSellerContainer.innerHTML = '';

    const bestSellers = productList.slice(0, maxItems);

    bestSellers.forEach(p => {
        bestSellerContainer.insertAdjacentHTML('beforeend', `
            <div class="col-md-3 mb-4">
                <div class="card h-100 text-center shadow-sm" data-id="${p.id}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${p.emoji} ${p.name}</h5>
                        <p class="card-text text-muted">${p.description}</p>
                        <strong class="mb-3">$${p.price.toFixed(2)}</strong>
                        <button class="btn btn-primary open-product-options mt-auto"
                            data-id="${p.id}">
                            Choose options
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
}




const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

// Function to dynamically generate URL
function getProductUrl(product) {
    return `pages/category.html?cat=${product.category}`;
} //special page after that

function renderSearchResults(results) {
    searchResults.innerHTML = results.length
        ? results.map(p => `<a href="${getProductUrl(p)}" class="d-block p-2 border-bottom text-decoration-none text-dark">${p.name}</a>`).join('')
        : '<p class="text-muted p-3">No results found</p>';
}

// Click search button
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});

// Press Enter in input
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchButton.click();
});

// Optional: live search as you type
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderSearchResults(filtered);
});









// Function to open modal and populate data
function openProductOptionsModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    productOptionsModalLabel.textContent = product.name;
    productOptionsCategory.textContent = `Category: ${product.category}`;
    productOptionsPrice.textContent = `$${product.price.toFixed(2)}`;

    productOptionsName.value = product.name;
    productOptionsBasePrice.value = product.price;
    productOptionsCategoryInput.value = product.category;

    productQuantityInput.value = 1;
    productSizeSelect.value = '';

    // THIS IS THE KEY:
    productOptionsModal.show();
}





productOptionsForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = productOptionsName.value;
    const category = productOptionsCategoryInput.value;
    const price = parseFloat(productOptionsBasePrice.value);
    const quantity = parseInt(productQuantityInput.value);
    const size = productSizeSelect.value;

    addToCart(name, price, quantity, size, '✨'); // add to cart
    showCartToast(`✅ ${quantity}x ${name} added to cart`);

    productOptionsModal.hide(); // hide modal safely
});



