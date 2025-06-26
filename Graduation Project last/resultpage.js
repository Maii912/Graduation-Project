document.addEventListener('DOMContentLoaded', () => {
    // DOM elements from resultpage.html
    const queryImageContainer = document.getElementById('query-image-container');
    const queryImageElement = document.getElementById('query-img');
    const productGrid = document.getElementById('product-grid');

    // Check if all necessary elements are on the page
    if (!queryImageContainer || !queryImageElement || !productGrid) {
        console.warn("Essential elements not found on this page.");
        return;
    }

    // 1. Retrieve the image data URL from session storage
    const uploadedImageData = sessionStorage.getItem('visualSearchQueryImage');
    const searchResults = sessionStorage.getItem('visualSearchResults');

    if (uploadedImageData) {
        // 2. If data exists, display the image and make the container visible
        queryImageElement.src = uploadedImageData;
        queryImageContainer.style.display = 'block'; 

        // 3. Clean up the session storage after use.
        sessionStorage.removeItem('visualSearchQueryImage');
    } else {
        console.log("No visual search query found in session storage.");
    }

    // 4. Display search results if available
    if (searchResults) {
        try {
            const products = JSON.parse(searchResults);
            displaySearchResults(products);
            sessionStorage.removeItem('visualSearchResults');
        } catch (error) {
            console.error('Error parsing search results:', error);
        }
    }

    function displaySearchResults(products) {
        // Clear existing products
        productGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<div style="text-align: center; padding: 50px;"><p>No similar items found.</p></div>';
            return;
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
});

