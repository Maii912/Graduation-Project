document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & CONSTANTS ---
    const PROCESSING_FEE = 80.00;
    const PROMO_THRESHOLDS = { 1: 1000, 2: 2000, 3: 3000 };
    const MAX_PROMO_VALUE = 3000;
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- DOM ELEMENTS ---
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const subtotalValueEl = document.getElementById('subtotalValue');
    const processingFeeEl = document.getElementById('processingFee');
    const totalValueEl = document.getElementById('totalValue');
    const grandTotalValueEl = document.getElementById('grandTotalValue');
    const progressBar = document.getElementById('progressBar');
    
    // --- FUNCTIONS ---
    const saveCart = () => {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    };
    
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; 
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 2rem; color: #8a8a8a;">Your cart is empty. <a href="All.html" style="color: coral;">Go shopping!</a></p>';
            return;
        }

        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const itemTotal = price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            const displaySize = item.size || 'N/A';
            // FIX: Add a fallback for the image source to prevent broken images.
            const imageUrl = item.imgSrc || 'Images/placeholder.png';

            itemEl.innerHTML = `
                <div class="item-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='Images/placeholder.png';">
                </div>
                <div class="item-info">
                    <p>${item.name}</p>
                    <span>Size: ${displaySize}</span>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" data-id="${item.id}" data-size="${displaySize}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-size="${displaySize}" data-action="increase">+</button>
                </div>
                <strong class="item-price">${itemTotal.toFixed(2)}LE</strong>
                <button class="remove-btn" data-id="${item.id}" data-size="${displaySize}">×</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    };
    
    const updateSummary = () => {
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const totalInPounds = subtotal + PROCESSING_FEE; 
        
        subtotalValueEl.textContent = `${subtotal.toFixed(2)}LE`;
        processingFeeEl.textContent = `${PROCESSING_FEE.toFixed(2)}LE`;
        totalValueEl.textContent = `${totalInPounds.toFixed(2)}LE`;
        grandTotalValueEl.textContent = `${totalInPounds.toFixed(2)}LE`;
        
        updateProgressBar(subtotal);
        updatePromos(subtotal);
    };

    const updateProgressBar = (subtotal) => {
        const progressPercentage = Math.min((subtotal / MAX_PROMO_VALUE) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
    };

    const updatePromos = (subtotal) => {
        for (const [id, threshold] of Object.entries(PROMO_THRESHOLDS)) {
            const promoEl = document.getElementById(`promo-${id}`);
            if (subtotal >= threshold) {
                promoEl.classList.add('active');
            } else {
                promoEl.classList.remove('active');
            }
        }
    };
    
    // FIX: Rewrote the cart update logic to be more robust and clear.
    const handleCartUpdate = (e) => {
        const target = e.target;
        const isQtyBtn = target.classList.contains('qty-btn');
        const isRemoveBtn = target.classList.contains('remove-btn');

        if (!isQtyBtn && !isRemoveBtn) {
            return; // Exit if the click is not on a relevant button.
        }

        const itemId = target.dataset.id;
        const itemSize = target.dataset.size;

        // Find the index of the item in the cart. Compare IDs as strings to avoid type issues.
        const itemIndex = cart.findIndex(i => {
            const cartItemSize = i.size || 'N/A';
            return String(i.id) === String(itemId) && cartItemSize === itemSize;
        });

        if (itemIndex === -1) {
            return; // Item not found.
        }

        // Handle quantity changes or removal.
        if (isQtyBtn) {
            const action = target.dataset.action;
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1); // Remove item if quantity is 1.
                }
            }
        } else if (isRemoveBtn) {
            cart.splice(itemIndex, 1); // Remove item on delete button click.
        }
        
        renderAndCalculate();
    };
    
    const renderAndCalculate = () => {
        saveCart(); 
        renderCartItems();
        updateSummary();
        // This function is not in the provided files, but we keep the call assuming it exists elsewhere.
        if (window.updateCartIcon) {
            window.updateCartIcon();
        }
    };

    cartItemsContainer.addEventListener('click', handleCartUpdate);
    renderAndCalculate();
});