let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((s, i) => s + i.quantity, 0);
let cartItemIdCounter = cart.length;

// Add item to cart
function addToCart(name, price, quantity = 1, size = '', emoji = '✨') {
    cart.push({
        id: cartItemIdCounter++,
        name,
        price: Number(price),
        quantity,
        size,
        emoji
    });

    cartCount += quantity;
    saveAndRenderCart();
    showNotification(`${quantity}x ${name} added`);
}

// Save cart and update UI
function saveAndRenderCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Update navbar cart count
function updateCartCount() {
    const el = document.querySelector('.cart-count');
    if (!el) return;
    el.textContent = cartCount;
    el.style.display = cartCount ? 'inline-block' : 'none';
}

// Render cart modal
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
                <div>${item.emoji} ${item.name} (${item.size}) x${item.quantity}</div>
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

    // Attach events dynamically
    container.querySelectorAll('.removeItem').forEach(btn => {
        btn.onclick = e => removeCartItem(Number(e.target.closest('[data-id]').dataset.id));
    });

    container.querySelectorAll('.increaseQty').forEach(btn => {
        btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), 1);
    });

    container.querySelectorAll('.decreaseQty').forEach(btn => {
        btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), -1);
    });
}

// Remove cart item
function removeCartItem(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    cartCount -= item.quantity;
    cart = cart.filter(i => i.id !== id);
    saveAndRenderCart();
}

// Change quantity
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

// Notification
function showNotification(msg) {
    console.log(msg);
}

// Handle product modal quantity + / -
// Product modal quantity + / - buttons
// Product modal quantity + / - buttons
const productModal = document.getElementById('productOptionsModal');

if (productModal) {
    productModal.addEventListener('shown.bs.modal', (event) => {
        // Get elements inside THIS modal instance
        const qtyInput = productModal.querySelector('#productQuantity');
        const increaseBtn = productModal.querySelector('#increaseQty');
        const decreaseBtn = productModal.querySelector('#decreaseQty');

        if (!qtyInput || !increaseBtn || !decreaseBtn) return;

        // Reset quantity to 1
        qtyInput.value = 1;

        // Remove previous handlers to avoid duplicates
        increaseBtn.replaceWith(increaseBtn.cloneNode(true));
        decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));

        // Re-select buttons after cloning
        const newIncreaseBtn = productModal.querySelector('#increaseQty');
        const newDecreaseBtn = productModal.querySelector('#decreaseQty');

        // Attach + / - events
        newIncreaseBtn.onclick = () => {
            qtyInput.value = Math.min(Number(qtyInput.value) + 1, 99);
        };
        newDecreaseBtn.onclick = () => {
            qtyInput.value = Math.max(Number(qtyInput.value) - 1, 1);
        };
    });
}



// Add to cart from product modal
const productForm = document.getElementById('productOptionsForm');
if (productForm) {
    productForm.onsubmit = e => {
        e.preventDefault();
        const name = document.getElementById('productOptionsName').value || document.getElementById('productOptionsModalLabel').textContent;
        const price = Number(document.getElementById('productOptionsBasePrice').value || document.getElementById('productOptionsPrice').textContent.replace('$',''));
        const size = document.getElementById('productSize').value;
        const quantity = Number(document.getElementById('productQuantity').value);
        addToCart(name, price, quantity, size, '✨');

        const modal = bootstrap.Modal.getInstance(document.getElementById('productOptionsModal'));
        modal.hide();
    };
}

// Checkout button works from any page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();

    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            const path = window.location.pathname.includes('/pages/') ? 'checkout.html' : 'pages/checkout.html';
            window.location.href = path;
        };
    }
});
