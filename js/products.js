const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, url:'../assets/image.png', category:'cute' },
    { name:'Star Bundle', description:'20 Star Stickers', price:12.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Animal Pack', description:'10 Animal Stickers', price:10.99, url:'../assets/image.png', category:'cute' },
    { name:'Art Collection', description:'15 Artistic Stickers', price:14.99, url:'../assets/image.png', category:'art' },
    { name:'Nature Pack', description:'12 Nature Stickers', price:11.99, url:'../assets/image.png', category:'art' },
    { name:'Professional Pack', description:'Business Stickers', price:11.99, url:'../assets/image.png', category:'business' },
    { name:'Office Pack', description:'Business Essentials', price:9.99, url:'../assets/image.png', category:'business' },
    { name:'Football Pack', description:'Football Stickers', price:13.99, url:'../assets/image.png', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:15.99, url:'../assets/image.png', category:'anime' },
    { name:'Cute Mini Pack', description:'5 Cute Stickers', price:6.99, url:'../assets/image.png', category:'cute' },
    { name:'Funny Pack', description:'10 Funny Stickers', price:8.99, url:'../assets/image.png', category:'funny' }
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
const paginationContainer = document.getElementById('pagination');
const categoryTitle = document.getElementById('categoryTitle');
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('cat') || 'all';

let filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

categoryTitle.textContent = selectedCategory === 'all'
    ? 'All Products'
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Stickers`;

let currentPage = 1;
const itemsPerPage = 8;
const maxPagesToShow = 4;

function renderProductsPage() {
    productContainer.innerHTML = '';
    if (!filteredProducts.length) {
        productContainer.innerHTML = `<p class="text-center text-muted">No products found in this category.</p>`;
        paginationContainer.innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    filteredProducts.slice(start, end).forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div class="product-emoji fs-1 text-center mb-3">${product.emoji}</div>
                    <h5 class="card-title text-center">${product.name}</h5>
                    <p class="card-text text-center text-muted">${product.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="fw-bold">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary btn-sm" onclick="openProductOptions('${product.name}')">Add</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.appendChild(col);
    });

    renderPagination();
}

function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) return;

    const createPageItem = (num, text = null) => {
        const li = document.createElement('li');
        li.className = 'page-item' + (num === currentPage ? ' active' : '');
        li.innerHTML = `<a class="page-link" href="#">${text || num}</a>`;
        li.onclick = (e) => {
            e.preventDefault();
            if (text === 'Prev') currentPage = Math.max(1, currentPage - 1);
            else if (text === 'Next') currentPage = Math.min(totalPages, currentPage + 1);
            else currentPage = num;
            renderProductsPage();
            window.scrollTo({ top: productContainer.offsetTop - 100, behavior: 'smooth' });
        };
        paginationContainer.appendChild(li);
    };

    createPageItem(null, 'Prev');

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) createPageItem(i);
    createPageItem(null, 'Next');
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    displayBestSellers(bestSellers);
    
    renderProductsPage();
});
