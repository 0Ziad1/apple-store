    // ----------------------
    // CART SETUP
    // ----------------------
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    let cartItemIdCounter = cart.length;

    const shippingByGovernorate = {
        Cairo: 5, Giza: 6, Alexandria: 7, Qalyubia: 6, Sharqia: 7, Dakahlia: 7,
        Beheira: 7, Monufia: 6, Gharbia: 6, "Kafr El Sheikh": 7, Damietta: 7, "Port Said": 8,
        Ismailia: 8, Suez: 8, "North Sinai": 10, "South Sinai": 10, "Red Sea": 10,
        Faiyum: 7, "Beni Suef": 8, Minya: 8, Assiut: 9, Sohag: 9, Qena: 9, Luxor: 9,
        Aswan: 10, "New Valley": 10, Matrouh: 10
    };

    const citySelect = document.getElementById('city');
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
    // ADD TO CART
    // ----------------------
    function addToCart(name, price, quantity = 1, size = '', emoji = '✨') {
        cart.push({ id: cartItemIdCounter++, name, price: Number(price), quantity, size, emoji });
        cartCount += quantity;
        saveAndRenderCart();
        showNotification(`${quantity}x ${name} added`);
    }

    // ----------------------
    // SAVE & RENDER
    // ----------------------
    function saveAndRenderCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        renderCheckout();
    }

    // ----------------------
    // UPDATE NAVBAR CART COUNT
    // ----------------------
    function updateCartCount() {
        const el = document.querySelector('.cart-count');
        if (!el) return;
        el.textContent = cartCount;
        el.style.display = cartCount ? 'inline-block' : 'none';
    }

    // ----------------------
    // RENDER CART MODAL / OFFCANVAS
    // ----------------------
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

        container.querySelectorAll('.removeItem').forEach(btn =>
            btn.onclick = e => removeCartItem(Number(e.target.closest('[data-id]').dataset.id))
        );
        container.querySelectorAll('.increaseQty').forEach(btn =>
            btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), 1)
        );
        container.querySelectorAll('.decreaseQty').forEach(btn =>
            btn.onclick = e => changeQuantity(Number(e.target.closest('[data-id]').dataset.id), -1)
        );
    }

    // ----------------------
    // REMOVE ITEM
    // ----------------------
    function removeCartItem(id) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        cartCount -= item.quantity;
        cart = cart.filter(i => i.id !== id);
        saveAndRenderCart();
    }

    // ----------------------
    // CHANGE QUANTITY
    // ----------------------
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

    // ----------------------
    // NOTIFICATION
    // ----------------------
    function showNotification(msg) {
        console.log(msg);
    }

    // ----------------------
    // PRODUCT MODAL QUANTITY CONTROL
    // ----------------------
    const productModal = document.getElementById('productOptionsModal');
    if (productModal) {
        productModal.addEventListener('shown.bs.modal', () => {
            const qtyInput = productModal.querySelector('#productQuantity');
            const increaseBtn = productModal.querySelector('#increaseQty');
            const decreaseBtn = productModal.querySelector('#decreaseQty');
            if (!qtyInput || !increaseBtn || !decreaseBtn) return;

            qtyInput.value = 1;

            increaseBtn.replaceWith(increaseBtn.cloneNode(true));
            decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));

            const newIncreaseBtn = productModal.querySelector('#increaseQty');
            const newDecreaseBtn = productModal.querySelector('#decreaseQty');

            newIncreaseBtn.onclick = () => qtyInput.value = Math.min(Number(qtyInput.value) + 1, 99);
            newDecreaseBtn.onclick = () => qtyInput.value = Math.max(Number(qtyInput.value) - 1, 1);
        });
    }

    // ----------------------
    // ADD TO CART FROM MODAL
    // ----------------------
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

    // ----------------------
    // CHECKOUT FUNCTIONS
    // ----------------------
    function getSubtotal() {
        return cart.reduce((s, i) => s + i.price * i.quantity, 0);
    }

    function getShipping() {
        const city = citySelect?.value;
        const baseShipping = shippingByGovernorate[city] || 0;
        const codExtra = codRadio?.checked ? 2 : 0;
        return baseShipping + codExtra;
    }

    function renderCheckout() {
        if (!checkoutItems) return;
        checkoutItems.innerHTML = '';

        if (!cart.length) {
            subtotalEl.textContent = '$0.00';
            shippingEl.textContent = 'Free';
            totalEl.textContent = '$0.00';
            checkoutItems.innerHTML = `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
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

    function renderCartOffcanvas() {
        if (!cartItemsEl) return;
        cartItemsEl.innerHTML = '';
        let total = 0;

        if (!cart.length) {
            cartTotalEl.textContent = '$0.00';
            cartItemsEl.innerHTML = `<p class="text-center text-muted py-4">Your cart is empty.</p>`;
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

        cartItemsEl.querySelectorAll('.remove').forEach(b => b.onclick = e => updateQty(e, 0, true));
        cartItemsEl.querySelectorAll('.increase').forEach(b => b.onclick = e => updateQty(e, 1));
        cartItemsEl.querySelectorAll('.decrease').forEach(b => b.onclick = e => updateQty(e, -1));
    }

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

        cartCount = cart.reduce((s, i) => s + i.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCheckout();
        renderCartOffcanvas();
        updateCartCount();
    }

    // ----------------------
    // PAYMENT OPTION SWITCH
    // ----------------------
    if (visaRadio && codRadio && visaFields && codNote) {
        visaRadio.onchange = codRadio.onchange = () => {
            visaFields.classList.toggle('d-none', !visaRadio.checked);
            codNote.classList.toggle('d-none', !codRadio.checked);
            renderCheckout();
        };
    }

    // ----------------------
    // PLACE ORDER
    // ----------------------
    placeOrderBtn?.addEventListener('click', () => {
        if (!cart.length) return;

        localStorage.removeItem('cart');
        cart = [];
        cartCount = 0;
        renderCheckout();
        renderCartOffcanvas();
        updateCartCount();

        orderMsg.textContent = '✅ Order placed successfully!';
    });

    // ----------------------
    // CHECKOUT BUTTON NAVIGATION
    // ----------------------
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        renderCart();
        renderCheckout();
        renderCartOffcanvas();

        const checkoutBtn = document.getElementById('checkoutButton');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                const path = window.location.pathname.includes('/pages/') ? 'checkout.html' : 'pages/checkout.html';
                window.location.href = path;
            };
        }

        citySelect?.addEventListener('change', renderCheckout);
    });


document.getElementById('loginModal')
    .addEventListener('hidden.bs.modal', () => {
        document.getElementById('loginForm').reset();
    });

