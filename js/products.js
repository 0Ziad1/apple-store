// ===================== products Page JavaScript =====================

// Global cartItems so all functions can access it
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const productsData = [
    {
        id: 1,
        title: "Naruto Ceramic product",
        category: "anime",
        price: 89,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400"
    },
    {
        id: 2,
        title: "One Piece product",
        category: "anime",
        price: 95,
        image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400"
    }
];

document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    updateCartCount();
    renderproducts(productsData);
    renderCartItems();

    // ===================== Filter Functionality =====================
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const productsContainer = document.getElementById('productsContainer');

    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (sortFilter) sortFilter.addEventListener('change', filterProducts);

    function filterProducts() {
        const category = categoryFilter.value;
        const sortBy = sortFilter.value;
        const products = Array.from(productsContainer.querySelectorAll('[data-category]'));

        // Filter by category
        products.forEach(product => {
            const productCategory = product.dataset.category;
            product.style.display = (category === 'all' || productCategory === category) ? 'block' : 'none';
        });

        // Sort products
        const visibleProducts = products.filter(p => p.style.display !== 'none');
        visibleProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.querySelector('.product-title').textContent;
            const nameB = b.querySelector('.product-title').textContent;

            switch (sortBy) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'name': return nameA.localeCompare(nameB);
                default: return 0;
            }
        });

        // Re-append sorted products
        visibleProducts.forEach(product => productsContainer.appendChild(product));
    }

    function renderproducts(products) {
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';

        products.forEach(product => {
            container.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3" 
                     data-category="${product.category}" 
                     data-price="${product.price}">
                    <div class="product-card" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#quickViewModal">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product-info">
                            <span class="product-category">${product.category}</span>
                            <h5 class="product-title">${product.title}</h5>
                            <div class="product-price">
                                <span class="current-price">${product.price} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ===================== Quick View Modal =====================
    let selectedCard = null;

    document.addEventListener('click', function (e) {
        const card = e.target.closest('.product-card');
        if (!card) return;

        selectedCard = card;

        const image = card.querySelector('.product-image img').src;
        const title = card.querySelector('.product-title').textContent;
        const category = card.querySelector('.product-category').textContent;
        const price = card.querySelector('.current-price').textContent;

        document.getElementById('quickViewImage').src = image;
        document.getElementById('quickViewTitle').textContent = title;
        document.querySelector('#quickViewModal .product-category').textContent = category;
        document.querySelector('.quick-view-price .current-price').textContent = price;

        // reset quantity & size
        document.querySelector('.qty-input').value = 1;
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.size-btn').classList.add('active');
    });

    // ===================== Quantity Controls =====================
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const qtyInput = document.querySelector('.qty-input');

    if (decreaseBtn && increaseBtn && qtyInput) {
        decreaseBtn.addEventListener('click', function () {
            let value = parseInt(qtyInput.value);
            if (value > 1) qtyInput.value = value - 1;
        });

        increaseBtn.addEventListener('click', function () {
            let value = parseInt(qtyInput.value);
            if (value < 99) qtyInput.value = value + 1;
        });
    }

    // ===================== Size Selection =====================
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function () {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===================== Add to Cart =====================
    const modalAddToCart = document.querySelector('.btn-add-to-cart');

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function () {
            const title = document.getElementById('quickViewTitle').textContent;
            const price = document.querySelector('.quick-view-price .current-price').textContent;
            const image = document.getElementById('quickViewImage').src;
            const quantity = parseInt(document.querySelector('.qty-input').value);
            const size = document.querySelector('.size-btn.active').textContent;

            const existingItem = cartItems.find(item => item.title === title && item.size === size);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cartItems.push({ id: Date.now(), title, price, image, quantity, size });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            renderCartItems();
            showToast();

            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            if (modal) modal.hide();
        });
    }

    // ===================== Pagination =====================
    const pageLinks = document.querySelectorAll('.pagination .page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.pagination .page-item').forEach(item => item.classList.remove('active'));
            if (this.parentElement.classList.contains('page-item')) this.parentElement.classList.add('active');
            document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===================== Smooth Scroll for Anchor Links =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target !== '#' && document.querySelector(target)) {
                e.preventDefault();
                document.querySelector(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===================== Mobile Navbar Toggle =====================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => navbarCollapse.classList.toggle('show'));
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navbarCollapse.classList.remove('show'));
        });
    }

    // ===================== Search Functionality =====================
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            if (query.length < 2) { searchResults.innerHTML = ''; return; }

            const allProducts = document.querySelectorAll('.product-card');
            let results = [];

            allProducts.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const category = card.querySelector('.product-category').textContent.toLowerCase();
                if (title.includes(query) || category.includes(query)) {
                    results.push({
                        title: card.querySelector('.product-title').textContent,
                        category: card.querySelector('.product-category').textContent,
                        price: card.querySelector('.current-price').textContent,
                        image: card.querySelector('.product-image img').src
                    });
                }
            });

            displaySearchResults(results);
        });
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-muted text-center">No products found</p>';
            return;
        }

        let html = '<div class="list-group">';
        results.forEach(item => {
            html += `
                <a href="#products-grid" class="list-group-item list-group-item-action d-flex align-items-center gap-3" data-bs-dismiss="modal">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">${item.category} • ${item.price}</small>
                    </div>
                </a>
            `;
        });
        html += '</div>';
        searchResults.innerHTML = html;
    }
});

// ===================== Cart Functions =====================
function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items-container');
    const emptyCart = document.querySelector('.empty-cart');

    if (!cartContainer || !emptyCart) return;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '';
        emptyCart.style.display = 'block';
        return;
    }

    emptyCart.style.display = 'none';

    let html = '';
    cartItems.forEach(item => {
        html += `
            <div class="cart-item d-flex align-items-center gap-3 mb-3">
                <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <small>${item.size}</small>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <span>${item.price}</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger remove-cart-item">×</button>
            </div>
        `;
    });

    cartContainer.innerHTML = html;

    document.querySelectorAll('.remove-cart-item').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            renderCartItems();
        });
    });
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => el.textContent = totalItems);
}

function showToast() {
    const toastEl = document.getElementById('cartToast');
    if (toastEl) {
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }
}
