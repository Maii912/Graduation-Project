// Text Search Integration
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    
    // Backend API base URL
    const API_BASE_URL = 'http://localhost:5000/api/ai';

    if (!searchInput) {
        console.warn("Search input not found on this page.");
        return;
    }

    // Function to perform text search
    async function performTextSearch(query) {
        try {
            if (!query.trim()) {
                return;
            }

            // Show loading state
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
                productGrid.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Searching...</p></div>';
            }

            const response = await fetch(`${API_BASE_URL}/search-by-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            // Display results
            displayTextSearchResults(result.products, query);
            
        } catch (error) {
            console.error('Text search error:', error);
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
                productGrid.innerHTML = `<div style="text-align: center; padding: 50px;"><p>Error searching: ${error.message}</p></div>`;
            }
        }
    }

    function displayTextSearchResults(products, query) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        // Clear existing products
        productGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productGrid.innerHTML = `<div style="text-align: center; padding: 50px;"><p>No products found for "${query}".</p></div>`;
            return;
        }

        // Update page title if available
        const pageTitle = document.querySelector('h3, h2');
        if (pageTitle) {
            pageTitle.textContent = `Search Results for "${query}"`;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('pro');
            productElement.setAttribute('data-id', product.id || '');
            productElement.setAttribute('data-name', product.name || 'Unknown Product');
            productElement.setAttribute('data-price', product.price || '0');
            productElement.setAttribute('data-desc', product.description || '');

            // Use fallback values for missing properties
            const productName = product.name || 'Unknown Product';
            const productPrice = product.price || '0';
            const productBrand = product.brand || product.categoryName || 'FashioNear';
            const productImage = product.imageUrl || product.image || 'Images/placeholder.png';

            productElement.innerHTML = `
                <img src="${productImage}" alt="${productName}" onerror="this.src='Images/placeholder.png'">
                <div class="des">
                    <span>${productBrand}</span>
                    <h5>${productName}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>${productPrice}LE</h4>
                </div>
                <button class="add-to-cart-btn"><i class="fas fa-shopping-cart cartt"></i></button>
            `;
            productGrid.appendChild(productElement);
        });
    }

    // Event listeners for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performTextSearch(query);
            }
        }
    });

    // Optional: Add click listener to search button if it exists
    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                performTextSearch(query);
            }
        });
    }
});

