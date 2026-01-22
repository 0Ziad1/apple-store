let cart = JSON.parse(localStorage.getItem('cart')) || [];

const checkoutItems = document.getElementById('checkoutItems');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');

const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');

const placeOrderBtn = document.getElementById('placeOrder');
const orderMsg = document.getElementById('orderMsg');

const visaRadio = document.getElementById('pmVisa');
const codRadio = document.getElementById('pmCod');
const visaFields = document.getElementById('visaFields');
const codNote = document.getElementById('codNote');

// ----------------------
function getSubtotal() {
    return cart.reduce((s, i) => s + i.price * i.quantity, 0);
}

// ----------------------
function getShipping() {
    return codRadio.checked ? 8 : 0;
}

// ----------------------
function renderCheckout() {
    if (!checkoutItems) return;

    checkoutItems.innerHTML = '';

    if (!cart.length) {
        checkoutItems.innerHTML =
            `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = 'Free';
        totalEl.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        checkoutItems.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between">
                <div>${item.emoji} ${item.name} (${item.size || 'N/A'}) × ${item.quantity}</div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `);
    });

    const subtotal = getSubtotal();
    const shipping = getShipping();

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
}

// ----------------------
function renderCartOffcanvas() {
    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = '';
    let total = 0;

    if (!cart.length) {
        cartItemsEl.innerHTML =
            `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
        cartTotalEl.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItemsEl.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between align-items-center" data-id="${item.id}">
                <div>${item.emoji} ${item.name} × ${item.quantity}</div>
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn btn-sm btn-outline-secondary decrease">-</button>
                    <button class="btn btn-sm btn-outline-secondary increase">+</button>
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <button class="btn btn-sm btn-danger remove">&times;</button>
                </div>
            </div>
        `);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;

    cartItemsEl.querySelectorAll('.remove').forEach(b =>
        b.onclick = e => updateQty(e, 0, true)
    );
    cartItemsEl.querySelectorAll('.increase').forEach(b =>
        b.onclick = e => updateQty(e, 1)
    );
    cartItemsEl.querySelectorAll('.decrease').forEach(b =>
        b.onclick = e => updateQty(e, -1)
    );
}

// ----------------------
function updateQty(e, delta, remove = false) {
    const id = Number(e.target.closest('[data-id]').dataset.id);
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (remove) {
        cart = cart.filter(i => i.id !== id);
    } else {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckout();
    renderCartOffcanvas();
}

// ----------------------
visaRadio.onchange = codRadio.onchange = () => {
    visaFields.classList.toggle('d-none', !visaRadio.checked);
    codNote.classList.toggle('d-none', !codRadio.checked);
    renderCheckout();
};

// ----------------------
placeOrderBtn?.addEventListener('click', () => {
    if (!cart.length) return;

    localStorage.removeItem('cart');
    cart = [];
    renderCheckout();
    renderCartOffcanvas();

    orderMsg.textContent = '✅ Order placed successfully!';
});

// ----------------------
document.addEventListener('DOMContentLoaded', () => {
    renderCheckout();
    renderCartOffcanvas();
});
