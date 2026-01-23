document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount();

    // ===================== Filter Functionality =====================
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const mugsContainer = document.getElementById('mugsContainer');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }

    function filterProducts() {
        const category = categoryFilter.value;
        const sortBy = sortFilter.value;
        const products = Array.from(mugsContainer.querySelectorAll('[data-category]'));
        
        // Filter by category
        products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        // Sort products
        const visibleProducts = products.filter(p => p.style.display !== 'none');
        
        visibleProducts.sort((a, b) => {
            const priceA = parseInt(a.dataset.price);
            const priceB = parseInt(b.dataset.price);
            const nameA = a.querySelector('.mug-title').textContent;
            const nameB = b.querySelector('.mug-title').textContent;
            
            switch(sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });

        // Re-append sorted products
        visibleProducts.forEach(product => {
            mugsContainer.appendChild(product);
        });
    }

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
});