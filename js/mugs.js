document.addEventListener("DOMContentLoaded", () => {

    /* ===================== DATA ===================== */
    const mugs = [
        { id: 1, name: "Naruto Ceramic Mug", category: "anime", price: 89, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",  reviews: 24, badge: "New" },
        { id: 2, name: "Liverpool FC Mug", category: "football", price: 79, oldPrice: 99, image: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=400", reviews: 18, badge: "Sale" },
        { id: 3, name: "Kawaii Cat Mug", category: "cute", price: 75, image: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400",  reviews: 32 },
        { id: 4, name: "Boss Mode Mug", category: "motivational", price: 85, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",  reviews: 45, badge: "Hot" },
        { id: 5, name: "Attack on Titan Mug", category: "anime", price: 95, image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400", reviews: 19 },
        { id: 6, name: "Real Madrid Mug", category: "football", price: 85, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",  reviews: 52, badge: "New" },
        { id: 7, name: "Monday Mood Mug", category: "funny", price: 69, oldPrice: 89, image: "https://images.unsplash.com/photo-1532102235608-dc8fc689acb2?w=400", reviews: 38, badge: "Sale" },
        { id: 8, name: "Pastel Dreams Mug", category: "cute", price: 82, image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400", reviews: 27 }
    ];

    /* ===================== ELEMENTS ===================== */
    const mugsContainer = document.getElementById("mugsContainer");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    /* ===================== CART ===================== */
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    updateCartCount();

    /* ===================== RENDER ===================== */
    function renderMugs(list) {
        mugsContainer.innerHTML = "";

        list.forEach(mug => {
            mugsContainer.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="mug-card"
                    data-id="${mug.id}"
                    data-category="${mug.category}"
                    data-price="${mug.price}">

                    <div class="mug-image" data-bs-toggle="modal" data-bs-target="#quickViewModal">
                        ${mug.badge ? `<span class="mug-badge ${mug.badge.toLowerCase()}">${mug.badge}</span>` : ""}
                        <img src="${mug.image}">
                    </div>

                    <div class="mug-info">
                        <span class="mug-category">${mug.category}</span>
                        <h5 class="mug-title">${mug.name}</h5>

                        <div class="mug-price">
                            ${mug.oldPrice ? `<span class="old-price">${mug.oldPrice} EGP</span>` : ""}
                            <span class="current-price">${mug.price} EGP</span>
                        </div>

                        <button class="btn btn-dark btn-sm w-100 mt-2 btn-add-cart">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>`;
        });
    }

    /* ===================== FILTER & SORT ===================== */
    function filterProducts() {
        let filtered = [...mugs];

        if (categoryFilter.value !== "all") {
            filtered = filtered.filter(m => m.category === categoryFilter.value);
        }

        if (sortFilter.value === "price-low") filtered.sort((a, b) => a.price - b.price);
        if (sortFilter.value === "price-high") filtered.sort((a, b) => b.price - a.price);
        if (sortFilter.value === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

        renderMugs(filtered);
    }

    categoryFilter.addEventListener("change", filterProducts);
    sortFilter.addEventListener("change", filterProducts);

    /* ===================== ADD TO CART ===================== */
    mugsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn-add-cart")) {
            const card = e.target.closest(".mug-card");

            const item = {
                id: card.dataset.id,
                title: card.querySelector(".mug-title").textContent,
                price: card.querySelector(".current-price").textContent,
                image: card.querySelector("img").src,
                quantity: 1
            };

            const existing = cartItems.find(i => i.id === item.id);
            if (existing) existing.quantity++;
            else cartItems.push(item);

            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCartCount();
            showToast();
        }
    });

    function updateCartCount() {
        const total = cartItems.reduce((s, i) => s + i.quantity, 0);
        document.querySelectorAll(".cart-count").forEach(el => el.textContent = total);
    }

    function showToast() {
        new bootstrap.Toast(document.getElementById("cartToast"), { delay: 3000 }).show();
    }

    /* ===================== INIT ===================== */
    renderMugs(mugs);
});


    // ===================== Quick View Modal =====================
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.mug-card');
            const image = card.querySelector('.mug-image img').src;
            const title = card.querySelector('.mug-title').textContent;
            const category = card.querySelector('.mug-category').textContent;
            const price = card.querySelector('.current-price').textContent;
            
            document.getElementById('quickViewImage').src = image;
            document.getElementById('quickViewTitle').textContent = title;
            document.querySelector('#quickViewModal .mug-category').textContent = category;
            document.querySelector('.quick-view-price .current-price').textContent = price;
        });
    });

    // ===================== Quantity Controls =====================
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const qtyInput = document.querySelector('.qty-input');

    if (decreaseBtn && increaseBtn && qtyInput) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value);
            if (value > 1) {
                qtyInput.value = value - 1;
            }
        });

        increaseBtn.addEventListener('click', function() {
            let value = parseInt(qtyInput.value);
            if (value < 99) {
                qtyInput.value = value + 1;
            }
        });
    }

    // ===================== Size Selection =====================
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===================== Add to Cart =====================
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const modalAddToCart = document.querySelector('.btn-add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.mug-card');
            addProductToCart(card);
        });
    });

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            const title = document.getElementById('quickViewTitle').textContent;
            const price = document.querySelector('.quick-view-price .current-price').textContent;
            const image = document.getElementById('quickViewImage').src;
            const quantity = parseInt(document.querySelector('.qty-input').value);
            const size = document.querySelector('.size-btn.active').textContent;

            const item = {
                id: Date.now(),
                title: title,
                price: price,
                image: image,
                quantity: quantity,
                size: size
            };

            cartItems.push(item);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            showToast();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            if (modal) modal.hide();
        });
    }

    function addProductToCart(card) {
        const title = card.querySelector('.mug-title').textContent;
        const price = card.querySelector('.current-price').textContent;
        const image = card.querySelector('.mug-image img').src;

        const item = {
            id: Date.now(),
            title: title,
            price: price,
            image: image,
            quantity: 1,
            size: 'Standard (300ml)'
        };

        cartItems.push(item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        showToast();
    }

    function updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        countElements.forEach(el => {
            el.textContent = totalItems;
        });
    }

    function showToast() {
        const toastEl = document.getElementById('cartToast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
            toast.show();
        }
    }

    // ===================== Pagination =====================
    const pageLinks = document.querySelectorAll('.pagination .page-link');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.pagination .page-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            if (this.parentElement.classList.contains('page-item')) {
                this.parentElement.classList.add('active');
            }

            // Smooth scroll to top of products
            document.getElementById('mugs-grid').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===================== Smooth Scroll for Anchor Links =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target !== '#' && document.querySelector(target)) {
                e.preventDefault();
                document.querySelector(target).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================== Mobile Navbar Toggle =====================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });

        // Close navbar when clicking a link
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }

    // ===================== Search Functionality =====================
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const allProducts = document.querySelectorAll('.mug-card');
            let results = [];

            allProducts.forEach(card => {
                const title = card.querySelector('.mug-title').textContent.toLowerCase();
                const category = card.querySelector('.mug-category').textContent.toLowerCase();
                
                if (title.includes(query) || category.includes(query)) {
                    results.push({
                        title: card.querySelector('.mug-title').textContent,
                        category: card.querySelector('.mug-category').textContent,
                        price: card.querySelector('.current-price').textContent,
                        image: card.querySelector('.mug-image img').src
                    });
                }
            });

            displaySearchResults(results);
        });
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-muted text-center">No products found</p>';
            return;
        }

        let html = '<div class="list-group">';
        results.forEach(item => {
            html += `
                <a href="#mugs-grid" class="list-group-item list-group-item-action d-flex align-items-center gap-3" data-bs-dismiss="modal">
                    <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">${item.category} • ${item.price}</small>
                    </div>
                </a>
            `;
        });
        html += '</div>';
        searchResults.innerHTML = html;
    }



function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="bi ${i <= rate ? "bi-star-fill" : "bi-star"}"></i>`;
    }
    return stars;
}