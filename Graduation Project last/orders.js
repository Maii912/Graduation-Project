document.addEventListener('DOMContentLoaded', () => {
    // --- DATA HELPERS ---
    const getOrdersDB = () => JSON.parse(localStorage.getItem('ordersDB')) || {};
    const getCurrentUserEmail = () => localStorage.getItem('currentUserEmail');
    const saveOrdersDB = (db) => localStorage.setItem('ordersDB', JSON.stringify(db));

    // --- DOM ELEMENTS ---
    const orderListContainer = document.getElementById('order-list-container');
    const emptyView = document.getElementById('empty-orders-view');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearHistoryContainer = document.getElementById('clear-history-container');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Modal DOM Elements
    const confirmClearModal = document.getElementById('confirmClearModal');
    const confirmClearBtn = document.getElementById('confirm-clear-btn');
    const cancelClearBtn = document.getElementById('cancel-clear-btn');
    const historyClearedModal = document.getElementById('historyClearedModal');
    const closeHistoryClearedModalBtn = document.getElementById('closeHistoryClearedModalBtn');

    // --- RENDER FUNCTIONS ---
    const renderOrderItems = (items) => {
        return items.map(item => `
            <a href="sproduct.html?id=${encodeURIComponent(item.id)}&name=${encodeURIComponent(item.name)}&price=${item.price}&desc=${encodeURIComponent(item.description || '')}&img=${encodeURIComponent(item.imgSrc)}" class="order-item">
                <img src="${item.imgSrc || 'Images/placeholder.png'}" alt="${item.name}" onerror="this.src='Images/placeholder.png'">
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}    Price: ${(item.price * item.quantity).toFixed(2)} LE</p>
                </div>
            </a>
        `).join('');
    };

    const renderOrders = (ordersToDisplay, isFilterAction = false) => {
        const currentUser = getCurrentUserEmail();
        const allUserOrders = (getOrdersDB()[currentUser] || []);

        // Hide/show main empty view and buttons based on if there are *any* orders at all
        if (allUserOrders.length === 0) {
            orderListContainer.innerHTML = '';
            emptyView.style.display = 'block';
            if (clearHistoryContainer) clearHistoryContainer.style.display = 'none';
            if (document.querySelector('.order-filters')) document.querySelector('.order-filters').style.display = 'none';
            return;
        }

        emptyView.style.display = 'none';
        if (clearHistoryContainer) clearHistoryContainer.style.display = 'block';
        if (document.querySelector('.order-filters')) document.querySelector('.order-filters').style.display = 'flex';
        
        // Handle the display for the current filter
        if (ordersToDisplay.length === 0) {
            if(isFilterAction) {
                orderListContainer.innerHTML = `<p style="text-align:center; padding: 2rem; color: #6c757d;">You have no orders with this status.</p>`;
            }
        } else {
            // **FIXED: This is the full, correct HTML template for rendering orders**
            orderListContainer.innerHTML = ordersToDisplay.map(order => `
                <div class="order-card" data-order-status="${order.status}">
                    <div class="order-card-header">
                        <div class="order-info">
                            <strong>Order ID:</strong> <span class="order-id">#${order.id}</span><br>
                            <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}
                        </div>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                    <div class="order-items-list">
                        ${renderOrderItems(order.items)}
                    </div>
                    <div class="order-card-footer">
                        <button class="details-btn">Track Order</button>
                        <div class="total-amount">
                            <span>Total:</span> ${order.total.toFixed(2)} LE
                        </div>
                    </div>
                </div>
            `).join('');
        }
    };
    
    // --- MAIN LOGIC & EVENT LISTENERS ---
    const initializeOrdersPage = () => {
        const currentUser = getCurrentUserEmail();
        if (!currentUser) {
            orderListContainer.innerHTML = `<h3 class="text-center p-5">Please log in to view your orders.</h3>`;
            emptyView.style.display = 'none';
            if (clearHistoryContainer) clearHistoryContainer.style.display = 'none';
            document.querySelector('.order-filters').style.display = 'none';
            return;
        }

        const allUserOrders = getOrdersDB()[currentUser] || [];
        
        renderOrders(allUserOrders, false); // Initial render with all orders

        // **FIXED: Re-renders the list on filter click, which correctly handles empty states**
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const status = button.getAttribute('data-status');
                
                let filteredOrders;
                if (status === 'all') {
                    filteredOrders = allUserOrders;
                } else {
                    filteredOrders = allUserOrders.filter(order => order.status === status);
                }
                
                renderOrders(filteredOrders, true);
            });
        });
        
        // --- Modal-based clear history logic ---
        if(clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirmClearModal) confirmClearModal.style.display = 'flex';
            });
        }
        
        if(cancelClearBtn) {
            cancelClearBtn.addEventListener('click', () => {
                if (confirmClearModal) confirmClearModal.style.display = 'none';
            });
        }
        
        if(confirmClearBtn) {
            confirmClearBtn.addEventListener('click', () => {
                let ordersDB = getOrdersDB();
                ordersDB[currentUser] = [];
                saveOrdersDB(ordersDB);
                
                renderOrders([], false);
                
                if (confirmClearModal) confirmClearModal.style.display = 'none';
                if (historyClearedModal) historyClearedModal.style.display = 'flex';
            });
        }
        
        if(closeHistoryClearedModalBtn) {
            closeHistoryClearedModalBtn.addEventListener('click', () => {
                if (historyClearedModal) historyClearedModal.style.display = 'none';
            });
        }
    };

    // --- INITIALIZE ---
    initializeOrdersPage();
});