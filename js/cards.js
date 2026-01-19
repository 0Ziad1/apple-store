// Example products for any category
const products = [
    { name: 'Sparkle Pack', description: '10 Premium Stickers', price: '$9.99', emoji: '✨' },
    { name: 'Football Pack', description: '10 Football Stickers', price: '$12.99', emoji: '⚽' },
    { name: 'Anime Pack', description: '15 Anime Stickers', price: '$14.99', emoji: '🧑‍🎤' },
    { name: 'Star Pack', description: '20 Star Stickers', price: '$11.99', emoji: '🌟' },
    { name: 'Funny Pack', description: '10 Funny Stickers', price: '$10.99', emoji: '😂' },
    { name: 'Business Pack', description: '12 Business Stickers', price: '$11.99', emoji: '💼' },
    { name: 'Art Pack', description: '15 Artistic Stickers', price: '$13.99', emoji: '🎨' },
];
const container = document.getElementById('productContainer');

function renderCards(products) {
    container.innerHTML = products.map(product => `
        <div class="col-6 col-md-4 col-lg-3">
            <div class="product-card">
                <div class="product-image">
                    ${product.emoji ? `<div class="sticker-display">${product.emoji}</div>` : `<img src="${product.image || ''}" alt="${product.name}">`}
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    ${product.description ? `<p>${product.description}</p>` : ''}
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">${product.price}</span>
                        <button class="btn btn-primary btn-sm">Choose options</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render on page load
renderCards(products);
