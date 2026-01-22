const allProducts = [
    { name:'Sparkle Pack', description:'10 Premium Sparkle Stickers', price:9.99, emoji:'✨', category:'cute' },
    { name:'Art Collection', description:'15 Artistic Stickers', price:14.99, emoji:'🎨', category:'art' },
    { name:'Star Bundle', description:'20 Star Stickers', price:12.99, emoji:'🌟', category:'cute' },
    { name:'Professional Pack', description:'Business Stickers', price:11.99, emoji:'💼', category:'business' },
    { name:'Football Pack', description:'Football Stickers', price:13.99, emoji:'⚽', category:'football' },
    { name:'Anime Pack', description:'Anime Stickers', price:15.99, emoji:'🧑‍🎤', category:'anime' }
];

const bestSellerContainer = document.getElementById('bestSellerContainer');

function displayBestSellers(products) {
    bestSellerContainer.innerHTML = ''; // Clear container

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
        bestSellerContainer.appendChild(col);
    });
}

// Example function for modal (you can adjust it later)
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

// Initialize
displayBestSellers(allProducts);
