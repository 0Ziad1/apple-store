let cart = JSON.parse(localStorage.getItem('cart')) || [];
const shippingByGovernorate = {
    Cairo:5,Giza:6,Alexandria:7,Qalyubia:6,Sharqia:7,Dakahlia:7,Beheira:7,Monufia:6,Gharbia:6,
    "Kafr El Sheikh":7,Damietta:7,"Port Said":8,Ismailia:8,Suez:8,"North Sinai":10,"South Sinai":10,
    "Red Sea":10,Faiyum:7,"Beni Suef":8,Minya:8,Assiut:9,Sohag:9,Qena:9,Luxor:9,Aswan:10,
    "New Valley":10,Matrouh:10
};

const citySelect = document.getElementById('city');
const checkoutItems = document.getElementById('checkoutItems');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const placeOrderBtn = document.getElementById('placeOrder');
const orderMsg = document.getElementById('orderMsg');
const visaRadio = document.getElementById('pmVisa');
const codRadio = document.getElementById('pmCod');
const visaFields = document.getElementById('visaFields');
const codNote = document.getElementById('codNote');


function getSubtotal() {
    return cart.reduce((s,i) => s + i.price*i.quantity, 0);
}

function getShipping() {
    const city = citySelect?.value;
    const base = shippingByGovernorate[city] || 0;
    const codExtra = codRadio.checked ? 2 : 0;
    return base + codExtra;
}

function renderCheckout() {
    if (!checkoutItems) return;
    checkoutItems.innerHTML = '';

    if (!cart.length) {
        checkoutItems.innerHTML = `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
        subtotalEl.textContent = '$0.00';
        shippingEl.textContent = 'Free';
        totalEl.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        checkoutItems.insertAdjacentHTML('beforeend', `
            <div class="d-flex justify-content-between">
                <div>${item.emoji} ${item.name} (${item.size || 'N/A'}) × ${item.quantity}</div>
                <strong>$${(item.price*item.quantity).toFixed(2)}</strong>
            </div>
        `);
    });

    const subtotal = getSubtotal();
    const shipping = getShipping();
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping ? `$${shipping.toFixed(2)}` : 'Free';
    totalEl.textContent = `$${(subtotal+shipping).toFixed(2)}`;
}

// Handle payment method toggles
visaRadio.onchange = codRadio.onchange = () => {
    visaFields.classList.toggle('d-none', !visaRadio.checked);
    codNote.classList.toggle('d-none', !codRadio.checked);
    renderCheckout();
};

// Place order
placeOrderBtn?.addEventListener('click', () => {
    if (!cart.length) return;
    localStorage.removeItem('cart');
    cart = [];
    renderCheckout();
    orderMsg.textContent = '✅ Order placed successfully!';
});

// Update checkout on city change
citySelect?.addEventListener('change', renderCheckout);

document.addEventListener('DOMContentLoaded', () => renderCheckout());
