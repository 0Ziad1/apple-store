const productContainer = document.getElementById('productContainer');
const categoryTitle = document.getElementById('categoryTitle');
const pagination = document.getElementById('pagination');

const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('cat') || 'all';

// Filter products by category
let filteredProducts = allProducts;
if (selectedCategory !== 'all') {
    filteredProducts = allProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
}

// Update page title dynamically
categoryTitle.textContent = selectedCategory ? `${capitalize(selectedCategory)} Stickers` : 'All Products';

// Function to capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Display products dynamically
function displayProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
        productContainer.innerHTML = `<p class="text-center text-muted">No products found in this category.</p>`;
        return;
    }

    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
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

// Initialize display
displayProducts(filteredProducts);
