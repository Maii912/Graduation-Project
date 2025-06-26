document.addEventListener('DOMContentLoaded', () => {
                const productGrid = document.getElementById('product-grid');

                if (productGrid) {
                    productGrid.addEventListener('click', (e) => {
                        // Traverse up to find the .pro container
                        const productElement = e.target.closest('.pro');

                        // Proceed only if a product was clicked and it wasn't the cart button
                        if (productElement && !e.target.closest('.add-to-cart-btn')) {
                            const id = productElement.dataset.id;
                            const name = productElement.dataset.name;
                            const price = productElement.dataset.price;
                            const desc = productElement.dataset.desc;
                            const imgSrc = productElement.querySelector('img').getAttribute('src');

                            // URL-encode all parameters to handle special characters
                            const url = `sproduct.html?id=${id}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&desc=${encodeURIComponent(desc)}&img=${encodeURIComponent(imgSrc)}`;

                            // Redirect to the single product page
                            window.location.href = url;
                        }
                    });
                }
            });