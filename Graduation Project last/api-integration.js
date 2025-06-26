async function fetchProducts(category = '') {
    let url = `https://tpf.runasp.net/api/Products?numberOfProduct=100`;
    if (category) {
        url += `&categoryName=${category}`;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // The API might return an array directly or wrapped in an object
        const products = Array.isArray(data) ? data : (data.products || data.data || []);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

function displayProducts(products, containerId) {
    const productGrid = document.getElementById(containerId);
    if (!productGrid) {
        console.error(`Product grid container with ID ${containerId} not found.`);
        return;
    }
    productGrid.innerHTML = ''; // Clear existing products

    if (!Array.isArray(products) || products.length === 0) {
        productGrid.innerHTML = '<div style="text-align: center; padding: 50px;"><p>No products available at the moment.</p></div>';
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
            <div class="pro-img-container">
                <img src="${productImage}" alt="${productName}" onerror="this.src='Images/placeholder.png'">
            </div>
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