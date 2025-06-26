document.addEventListener('DOMContentLoaded', () => {

    const productGrid = document.getElementById('product-grid');
    const cartCountEl = document.getElementById('cart-count');

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
             cartCountEl.textContent = totalItems;
        }
    };

    updateCartCount();

    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.add-to-cart-btn');
            if (!button) {
                return;
            }
            
            e.preventDefault(); 
            const productDiv = button.closest('.pro');

            const productId = parseInt(productDiv.dataset.id);
            const productName = productDiv.dataset.name;
            const productPrice = parseFloat(productDiv.dataset.price); 
            const productDescription = productDiv.dataset.desc;
            // Gets the product image source from the img tag
            const productImgSrc = productDiv.querySelector('.pro-img-container img').getAttribute('src');

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            let existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    description: productDescription,
                    // Stores the image source in the cart object
                    imgSrc: productImgSrc 
                });
            }

            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();

            const originalIconHTML = button.innerHTML;
            button.innerHTML = `<i class="fas fa-check cartt" style="color: green;"></i>`;
            button.disabled = true; 
            
            setTimeout(() => {
                button.innerHTML = originalIconHTML;
                button.disabled = false;
            }, 1500);
        });
        
    }
});