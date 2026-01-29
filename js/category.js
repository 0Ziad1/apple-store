        document.addEventListener("DOMContentLoaded", () => {
            const path = window.location.pathname;
            const params = new URLSearchParams(window.location.search);

            const links = document.querySelectorAll(".nav-link");

            links.forEach(link => link.classList.remove("active-link"));

            // Home
            if (path.includes("index.html") || path === "/") {
                document.querySelector('a[href="../index.html"]')?.classList.add("active-link");
            }

            // Category page
            if (path.includes("category.html")) {
                const cat = params.get("cat");

                if (cat === "sheet") {
                    document
                        .querySelector('a[href="category.html?cat=sheet"]')
                        ?.classList.add("active-link");
                } else if (cat === "stickers") {
                    document
                        .querySelector('a[href="category.html?cat=stickers"]')
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