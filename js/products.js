const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, url:'../assets/image.png', type:'sticker', category:'cute' },
    { name:'Football Pack', description:'Football Stickers', price:13.99, url:'../assets/image.png', type:'sticker', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:15.99, url:'../assets/image.png', type:'sticker', category:'anime' },
    { name:'Sticker Sheet A', description:'Large Sticker Sheet', price:7.99, url:'../assets/image.png', type:'sheet', category:'cute' },
    { name:'Coffee Mug', description:'Printed Mug', price:11.99, url:'../assets/image.png', type:'mug', category:'funny' }
];


const bestSellers = [
    allProducts.find(p => p.name === 'Sparkle Pack'),
    allProducts.find(p => p.name === 'Star Bundle'),
    allProducts.find(p => p.name === 'Football Pack'),
    allProducts.find(p => p.name === 'Anime Pack')
];

// ===== Display Best Sellers =====
function displayBestSellers(products) {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return; // <-- IMPORTANT

    container.innerHTML = '';
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="product-image fs-1 text-center mb-3"  style="background-image: url(${product.url});"></div>
                    <h5 class="card-title text-center">${product.name}</h5>
                    <p class="card-text text-center text-muted">${product.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="fw-bold">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary btn-sm"
                            onclick="openProductOptions('${product.name}')">Add</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayBestSellers(bestSellers);
});


// ===== Product Modal =====
function openProductOptions(productName) {
    const product = allProducts.find(p => p.name === productName);
    if (!product) return;

    document.getElementById('productOptionsModalLabel').textContent = product.name;
    document.getElementById('productOptionsDescription').textContent = product.description;
    document.getElementById('productOptionsPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productOptionsBasePrice').value = product.price;
    document.getElementById('productOptionsName').value = product.name;
    document.getElementById('productOptionsImage').innerHTML = `<img src="assets/${product.name.replace(/\s+/g,'-').toLowerCase()}.png" alt="${product.name}" class="img-fluid">`;

    const productModal = new bootstrap.Modal(document.getElementById('productOptionsModal'));
    productModal.show();
}

// ===== Pagination & Category Filtering =====
const productContainer = document.getElementById('productContainer');
const pagination = document.getElementById('pagination');
const categoryFilter = document.getElementById('categoryFilter');
const pageTitle = document.getElementById('pageTitle');

const params = new URLSearchParams(window.location.search);
const selectedType = params.get('type') || 'all';

let currentPage = 1;
const itemsPerPage = 8;
let filteredProducts = [];

pageTitle.textContent =
    selectedType === 'all'
        ? 'All Products'
        : selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + 's';

function applyFilters() {
    const selectedCategory = categoryFilter.value;

    filteredProducts = allProducts.filter(p => {
        const typeMatch = selectedType === 'all' || p.type === selectedType;
        const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
        return typeMatch && categoryMatch;
    });

    currentPage = 1;
    renderProducts();
}

function renderProducts() {
    productContainer.innerHTML = '';

    if (!filteredProducts.length) {
        productContainer.innerHTML = `
            <p class="text-center text-muted">No products found</p>
        `;
        pagination.innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    filteredProducts.slice(start, end).forEach(p => {
        productContainer.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="product-image mb-3"
                             style="background-image:url(${p.url})"></div>
                        <h5 class="text-center">${p.name}</h5>
                        <p class="text-muted text-center">${p.description}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="fw-bold">$${p.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm"
                                onclick="openProductOptions('${p.name}')">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    renderPagination();
}

function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }

    [...pagination.children].forEach((li, index) => {
        li.onclick = e => {
            e.preventDefault();
            currentPage = index + 1;
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    });
}

categoryFilter.addEventListener('change', applyFilters);

document.addEventListener('DOMContentLoaded', applyFilters);
