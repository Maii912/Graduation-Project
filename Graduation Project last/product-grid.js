document.addEventListener('DOMContentLoaded', () => {
    // This global function updates the cart count in the navbar.
    if (!window.updateCartIcon) {
        window.updateCartIcon = () => {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = totalQuantity;
            }
        };
    }
    // Always run on page load to keep the cart count accurate.
    window.updateCartIcon();

    // Select ALL possible product grid containers on any page
    const productGrids = document.querySelectorAll('#product-grid, #related-product-grid');

    if (productGrids.length > 0) {
        productGrids.forEach(grid => {
            // Use one listener on the grid for better performance (event delegation)
            grid.addEventListener('click', (e) => {
                const productCard = e.target.closest('.pro');
                if (!productCard) return; // Exit if the click was not inside a product card

                const addToCartBtn = e.target.closest('.add-to-cart-btn');

                if (addToCartBtn) {
                    // --- A) HANDLE "ADD TO CART" CLICK ---
                    e.preventDefault(); // Stop any other actions

                    const product = {
                        id: productCard.dataset.id,
                        name: productCard.dataset.name,
                        price: parseFloat(productCard.dataset.price),
                        imgSrc: productCard.querySelector('img')?.src,
                        size: 'M', // Default size when adding from a grid
                        quantity: 1
                    };

                    if (!product.id || !product.name) {
                        console.error("Product data missing from card.", productCard.dataset);
                        return;
                    }
                    
                    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
                    let existingItem = cart.find(item => item.id === product.id && item.size === product.size);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push(product);
                    }
                    
                    localStorage.setItem('shoppingCart', JSON.stringify(cart));
                    window.updateCartIcon(); // Update the navbar icon

                    // Provide visual feedback
                    addToCartBtn.innerHTML = `<i class="fas fa-check"></i>`;
                    addToCartBtn.disabled = true;

                    setTimeout(() => {
                        addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart cartt"></i>`;
                        addToCartBtn.disabled = false;
                    }, 1500);

                } else {
                    // --- B) HANDLE CLICKING THE CARD TO VIEW DETAILS ---
                    const id = productCard.dataset.id;
                    const name = productCard.dataset.name;
                    const price = productCard.dataset.price;
                    const desc = productCard.dataset.desc;
                    const imgSrc = productCard.querySelector('img')?.src;
                    
                    // Essential check to ensure the card has data to send
                    if (!id || !name) {
                         console.error("Cannot navigate, essential product data is missing from the card.", productCard.dataset);
                         return;
                    }

                    // Build a URL with the product data as search parameters.
                    // encodeURIComponent is crucial to handle spaces and special characters.
                    const url = `sproduct.html?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&desc=${encodeURIComponent(desc)}&img=${encodeURIComponent(imgSrc)}`;
                    
                    // Redirect the user to the single product page
                    window.location.href = url;
                }
            });
        });
    }
});