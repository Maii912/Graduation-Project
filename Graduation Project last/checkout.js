document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & CONSTANTS ---
    const PROCESSING_FEE = 80.00;
    const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- DOM ELEMENTS ---
    const subtotalEl = document.getElementById('subtotalValue');
    const processingFeeEl = document.getElementById('processingFee');
    const totalEl = document.getElementById('totalValue');
    const grandTotalEl = document.getElementById('grandTotalValue');
    const confirmPaymentAmountEl = document.getElementById('confirmPaymentAmount');
    
    // Payment elements
    const paymentOptions = document.querySelectorAll('.radio-option');
    const creditCardForm = document.querySelector('.payment-information');
    
    // Form, Buttons and MODALS
    const shippingAddressInput = document.getElementById('shippingAddress');
    const cardNumberInput = document.getElementById('cardNumber');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const authModal = document.getElementById('authModal');
    const orderSuccessModal = document.getElementById('orderSuccessModal');
    const cartEmptyModal = document.getElementById('cartEmptyModal');

    // Auth helpers
    const isLoggedIn = () => !!localStorage.getItem('currentUserEmail');

    // --- FUNCTIONS ---
    function updateCheckoutSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const total = subtotal + PROCESSING_FEE;
        const formatPrice = (price) => `${price.toFixed(2)} LE`;
        
        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
        if (processingFeeEl) processingFeeEl.textContent = formatPrice(PROCESSING_FEE);
        if (totalEl) totalEl.textContent = formatPrice(total);
        if (grandTotalEl) grandTotalEl.textContent = formatPrice(total);
        if (confirmPaymentAmountEl) confirmPaymentAmountEl.textContent = formatPrice(total);
    }

    function setupPaymentSelection() {
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.add('inactive'));
                option.classList.remove('inactive');
                
                if (creditCardForm) {
                    const isCardSelected = option.hasAttribute('data-card-option');
                    creditCardForm.style.display = isCardSelected ? 'block' : 'none';
                }
            });
        });
    }

    function loadUserData() {
        if (isLoggedIn()) {
            const users = JSON.parse(localStorage.getItem('usersDB')) || {};
            const currentUserEmail = localStorage.getItem('currentUserEmail');
            const currentUser = users[currentUserEmail];
            if (currentUser) {
                if (shippingAddressInput) shippingAddressInput.value = currentUser.location || '';
                if (cardNumberInput) cardNumberInput.value = currentUser.cardnumber || '';
            }
        }
    }

    // UPDATED: processOrder function to save the order
    function processOrder() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        
        // 1. Get cart items to form the order
        const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if(cartItems.length === 0) {
            alert('Your cart is empty. Cannot place order.');
            return;
        }

        // 2. Calculate final total for the order record
        const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const total = subtotal + PROCESSING_FEE;
        
        // 3. Create a new order object
        const newOrder = {
            id: `FN${Math.floor(10000 + Math.random() * 90000)}`, // Random 5-digit order ID
            date: new Date().toISOString(), // Full timestamp
            status: 'Processing', // Default status for a new order
            total: total,
            items: cartItems, // Add all cart items to the order
        };
        
        // 4. Get the orders DB and add the new order
        let ordersDB = JSON.parse(localStorage.getItem('ordersDB')) || {};
        if (!ordersDB[currentUserEmail]) {
            ordersDB[currentUserEmail] = []; // Initialize order history if it's the first order
        }
        ordersDB[currentUserEmail].unshift(newOrder); // Add to the beginning of the list
        
        localStorage.setItem('ordersDB', JSON.stringify(ordersDB));

        // 5. Clear the shopping cart
        localStorage.removeItem('shoppingCart');

        // 6. Update cart icon in navbar
        if(window.updateCartIcon) {
            window.updateCartIcon();
        }

        // 7. Show the success modal
        if (orderSuccessModal) {
            orderSuccessModal.style.display = 'flex';
        }
    }

    function initialChecks() {
        if (cart.length === 0) {
            if (cartEmptyModal) cartEmptyModal.style.display = 'flex';
            if (confirmPaymentBtn) {
                confirmPaymentBtn.disabled = true;
                confirmPaymentBtn.style.backgroundColor = '#ccc';
                confirmPaymentBtn.style.cursor = 'not-allowed';
            }
        } else {
            loadUserData();
        }
    }

    // --- EVENT LISTENERS ---
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            if (isLoggedIn()) {
                processOrder();
            } else {
                if (authModal) authModal.style.display = 'flex';
            }
        });
    }

    // --- INITIALIZATION ---
    updateCheckoutSummary();
    setupPaymentSelection();
    initialChecks();
});