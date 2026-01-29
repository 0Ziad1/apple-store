document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => link.classList.remove("active-link"));
    const categoryTitle = document.getElementById('categoryTitle');
    // Home
    if (path.includes("index.html") || path === "/") {
        document.querySelector('a[href="../index.html"]')?.classList.add("active-link");
    }

    // Category page
    if (path.includes("category.html")) {
        const cat = params.get("cat");

        if (cat === "sheet") {
            categoryTitle.textContent = "Sheet Masks";
            document
                .querySelector('a[href="category.html?cat=sheet"]')
                ?.classList.add("active-link");
                category
        } else if (cat === "stickers") {
             categoryTitle.textContent = "Stickers";
            document
                .querySelector('a[href="category.html?cat=stickers"]')
                ?.classList.add("active-link");
        }
        else if (cat === "mugs") {
            categoryTitle.textContent = "Mugs";
            document
                .querySelector('a[href="category.html?cat=mugs"]')
                ?.classList.add("active-link");
        }
        else {
            document
                .querySelector('a[href="../pages/category.html"]')
                ?.classList.add("active-link");
        }
    }

    // Stickers dropdown (لو عندك صفحات خاصة بيها)
    if (path.includes("stickers")) {
        document
            .getElementById("stickersDropdown")
            ?.classList.add("active-link");
    }
});