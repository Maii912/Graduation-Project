document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const addToCartBtn = document.getElementById('addToCartBtn');
    const productDetailsContainer = document.getElementById('productDetails');
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const productSizeEl = document.getElementById('productSize');
    const productQuantityEl = document.getElementById('productQuantity');
    const mainImgEl = document.getElementById('MainImg');
    const cartCountEl = document.getElementById('cart-count');

    // --- FUNCTIONS ---
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
             cartCountEl.textContent = totalItems;
        }
    };

    const handleAddToCart = () => {
        // --- Get Product Info from the DOM ---
        const productId = productDetailsContainer.dataset.id;
        const productName = productNameEl.textContent.trim();
        // Extract number from price string (e.g., "200 LE" -> 200)
        const productPrice = parseFloat(productPriceEl.textContent); 
        const productSize = productSizeEl.value;
        const productQuantity = parseInt(productQuantityEl.value, 10);
        const productImgSrc = mainImgEl.getAttribute('src');

        // --- Validation ---
        if (productSize === 'Select Size') {
            alert('Please select a size before adding to cart.');
            return;
        }
        if (isNaN(productQuantity) || productQuantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }
        
        // --- Update Cart ---
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        // Check if an item with the same ID and size already exists
        let existingItem = cart.find(item => item.id === productId && item.size === productSize);

        if (existingItem) {
            existingItem.quantity += productQuantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: productQuantity,
                imgSrc: productImgSrc,
                size: productSize
            });
        }

        // --- Save to localStorage and Update UI ---
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();

        // --- Provide User Feedback on the Button ---
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = `Added <i class="fas fa-check"></i>`;
        addToCartBtn.disabled = true;
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.disabled = false;
        }, 2000);
    };

    // --- EVENT LISTENERS ---
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }

    // --- INITIALIZATION ---
    // The cart count is already updated by men-page-script.js, but
    // we call it here to ensure it works even if that script were removed.
    updateCartCount(); 
});