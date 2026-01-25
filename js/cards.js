// // ===================== Products Data =====================
// export const productsData = [
//     {
//         id: 1,
//         title: "Naruto Ceramic product",
//         category: "anime",
//         price: 89,
//         image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400"
//     },
//     {
//         id: 2,
//         title: "One Piece product",
//         category: "anime",
//         price: 95,
//         image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400"
//     }
// ];



// // card.js
// import {renderProducts, initProductsPage } from './products.js';

// document.addEventListener('DOMContentLoaded', () => {
//     initProductsPage();

//     // Example: render products in a different container
//     renderProducts(productsData, 'bestSellerContainer');

// });

// // // ===================== Display Products =====================
// // function displayProducts(products) {
// //     const productContainer = document.getElementById('bestSellerContainer');
// //     if (!productContainer) return;

// //     productContainer.innerHTML = '';

// //     if (products.length === 0) {
// //         productContainer.innerHTML =
// //             `<p class="text-center text-muted">No products found.</p>`;
// //         return;
// //     }

// //     products.forEach(product => {
// //         const col = document.createElement('div');
// //         col.className = 'col-6 col-md-4 col-lg-3';

// //         col.innerHTML = `
// //     <div class="card h-100 shadow-sm">
// //         <div class="card-body d-flex flex-column ">

// //             <!-- Category badge -->
// //           <div class="category-title">${product.category}</div>

// //             <div class="fs-1 text-center mb-3">${product.emoji}</div>
// //             <h5 class="card-title text-center">${product.name}</h5>
// //             <p class="card-text text-center text-muted">${product.description}</p>

// //             <div class="mt-auto d-flex justify-content-between align-items-center">
// //                 <span class="fw-bold">$${product.price.toFixed(2)}</span>
// //                 <button class="btn btn-primary btn-sm"
// //                     onclick="openProductOptions('${product.name}')">
// //                     Add
// //                 </button>
// //             </div>

// //         </div>
// //     </div>
// // `;


// //         productContainer.appendChild(col);
// //     });
// // }

// // // ===================== Init =====================
// // document.addEventListener('DOMContentLoaded', () => {
// //     displayProducts(products);
// // });

// // // ===================== Placeholder Function =====================
// // // Prevents console error if button is clicked
// // function openProductOptions(productName) {
// //     console.log('Add clicked for:', productName);
// // }
