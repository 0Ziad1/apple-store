const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Art Collection', description:'15 Artistic Stickers', price:14.99, emoji:'🎨', category:'art' },
    { name:'Star Bundle', description:'20 Star Stickers', price:12.99, emoji:'🌟', category:'cute' },
    { name:'Professional Pack', description:'Business Stickers', price:11.99, emoji:'💼', category:'business' },
    { name:'Football Pack', description:'Football Stickers', price:13.99, emoji:'⚽', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:15.99, emoji:'🧑‍🎤', category:'anime' }
];
const uniqueBestSellers = [];
['Sparkle Pack', 'Star Bundle', 'Football Pack'].forEach(name => {
    const prod = allProducts.find(p => p.name === name);
    if (prod) uniqueBestSellers.push(prod);
});

document.addEventListener('DOMContentLoaded', () => {
    displayBestSellers(uniqueBestSellers);
    displayProducts(filteredProducts);
});

const productContainer = document.getElementById('productContainer');
const categoryTitle = document.getElementById('categoryTitle');
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('cat') || 'all';

let filteredProducts = allProducts;
if (selectedCategory !== 'all') {
    filteredProducts = allProducts.filter(
        p => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
}

if (selectedCategory.toLowerCase() === 'all') {
    categoryTitle.textContent = 'All Products';
} else {
    categoryTitle.textContent = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Stickers`;
}
function openProductOptions(productName) {
    const product = allProducts.find(p => p.name === productName);
    if (!product) return;
    
    document.getElementById('productOptionsModalLabel').textContent = product.name;
    document.getElementById('productOptionsDescription').textContent = product.description;
    document.getElementById('productOptionsPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productOptionsBasePrice').value = product.price;
    document.getElementById('productOptionsName').value = product.name;

    const imgContainer = document.getElementById('productOptionsImage');
    imgContainer.innerHTML = `<img src="assets/${product.name.replace(/\s+/g,'-').toLowerCase()}.png" alt="${product.name}" class="img-fluid">`;

    const productModal = new bootstrap.Modal(document.getElementById('productOptionsModal'));
    productModal.show();
}

function displayProducts(products) {
    productContainer.innerHTML = '';
    if (!products.length) {
        productContainer.innerHTML = `<p class="text-center text-muted">No products found in this category.</p>`;
        return;
    }

    products.forEach(product => {
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
                        <button class="btn btn-primary btn-sm" onclick="openProductOptions('${product.name}')">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        productContainer.appendChild(col);
    });
}
function displayBestSellers(products) {
    const container = document.getElementById('bestSellerContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!products.length) {
        container.innerHTML = `<p class="text-center text-muted">No best sellers available.</p>`;
        return;
    }

    products.forEach(product => {
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
                        <button class="btn btn-primary btn-sm" onclick="openProductOptions('${product.name}')">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Initialize best sellers
displayBestSellers(bestSellers);


// Initialize
displayProducts(filteredProducts);
