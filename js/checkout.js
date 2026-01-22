// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elements
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const cartCountEl = document.querySelector('.cart-count');
const cartModalContainer = document.getElementById('cartItemsContainer');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutButton');

// ----------------------
// Update navbar cart badge
function updateCartCount() {
    if (!cartCountEl) return;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
    cartCountEl.style.display = totalQty ? 'inline-block' : 'none';
}

// ----------------------
// Render checkout items (main checkout page)
function renderCheckout() {
    if (!checkoutItems) return;
    checkoutItems.innerHTML = '';

    if (!cart.length) {
        checkoutItems.innerHTML = `<p class="text-center text-muted py-5">Your cart is empty.</p>`;
        checkoutTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        checkoutItems.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between mb-2">
                <div>${item.emoji} ${item.name} (${item.size || 'N/A'}) x${item.quantity}</div>
                <strong>$${itemTotal.toFixed(2)}</strong>
            </div>
        `);
    });

    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// ----------------------
// Render cart modal
function renderCartModal() {
    if (!cartModalContainer) return;
    cartModalContainer.innerHTML = '';

    if (!cart.length) {
        cartModalContainer.innerHTML = `<div class="text-center py-5 text-muted">
            <i class="bi bi-cart-x" style="font-size: 4rem; color: #ccc;"></i>
            <p class="mt-3">Your cart is empty</p>
        </div>`;
        if (cartTotalEl) cartTotalEl.textContent = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartModalContainer.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between align-items-center mb-3" data-id="${item.id}">
                <div>${item.emoji} ${item.name} (${item.size}) x${item.quantity}</div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary decreaseQty">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary increaseQty">+</button>
                    <strong class="ms-2">$${itemTotal.toFixed(2)}</strong>
                    <button class="btn btn-sm btn-danger ms-2 removeItem">&times;</button>
                </div>
            </div>
        `);
    });

    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for increase/decrease/remove
    cartModalContainer.querySelectorAll('.removeItem').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = Number(e.target.closest('[data-id]').dataset.id);
            removeCartItem(id);
        });
    });

    cartModalContainer.querySelectorAll('.increaseQty').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = Number(e.target.closest('[data-id]').dataset.id);
            changeQuantity(id, 1);
        });
    });

    cartModalContainer.querySelectorAll('.decreaseQty').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = Number(e.target.closest('[data-id]').dataset.id);
            changeQuantity(id, -1);
        });
    });
}

// ----------------------
// Remove item from cart
function removeCartItem(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCheckout();
    renderCartModal();
}

// ----------------------
// Change quantity
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeCartItem(id);
        return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCheckout();
    renderCartModal();
}

// ----------------------
// Init
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCheckout();
    renderCartModal();

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});
