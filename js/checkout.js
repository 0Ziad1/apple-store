const cart = JSON.parse(localStorage.getItem('cart')) || [];

const itemsContainer = document.getElementById('checkoutItems');
const totalEl = document.getElementById('checkoutTotal');

let total = 0;

if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="text-center text-muted">Your cart is empty</p>`;
} else {
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        itemsContainer.insertAdjacentHTML('beforeend', `
            <div class="card mb-3 p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">${item.emoji} ${item.name}</h5>
                        <small class="text-muted">Quantity: ${item.quantity}</small>
                    </div>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `);
    });
}

totalEl.textContent = `$${total.toFixed(2)}`;
