document.addEventListener('DOMContentLoaded', () => {
    // --- PART 1: POPULATE MAIN PRODUCT DATA FROM URL ---
    const params = new URLSearchParams(window.location.search);

    // Read all parameters from the URL, using decodeURIComponent to fix formatting.
    // Provide default fallback values to prevent errors if a parameter is missing.
    const id = decodeURIComponent(params.get('id') || '');
    const name = decodeURIComponent(params.get('name') || 'Product Not Found');
    const price = decodeURIComponent(params.get('price') || '0');
    const desc = decodeURIComponent(params.get('desc') || 'No description available.');
    const imgSrc = decodeURIComponent(params.get('img') || 'Images/placeholder.png');

    const productDetailsContainer = document.getElementById('productDetails');
    
    // Only populate the page if a valid product ID was passed in the URL
    if (productDetailsContainer && id) {
        // Set the product details on the page
        document.getElementById('MainImg').src = imgSrc;
        document.getElementById('MainImg').alt = name;
        document.getElementById('product-name').textContent = name;
        document.getElementById('product-price').textContent = `${price} LE`;
        document.getElementById('product-description').textContent = desc;
        document.getElementById('breadcrumb').textContent = `Home / All / ${name}`;
        
        // This is CRUCIAL: It allows the "Add To Cart" button to know the product's ID
        productDetailsContainer.dataset.id = id; 

        document.title = `${name} - FashioNear`; // Update the browser tab title
    } else {
        // This block runs if the `id` is missing in the URL, gracefully handling the error
        console.error("Product data not found in URL.");
        document.getElementById('product-name').textContent = "Product Not Found";
        // Hide elements that don't make sense without a product
        document.getElementById('product-price').style.display = 'none';
        document.getElementById('addToCartBtn').style.display = 'none';
        document.getElementById('productSize').style.display = 'none';
        document.getElementById('productQuantity').style.display = 'none';
    }

    // --- PART 2: FETCH AND DISPLAY RELATED PRODUCTS ---
    async function loadRelatedProducts() {
        if (typeof displayProducts !== 'function' || typeof fetchProducts !== 'function') {
            console.error("API functions (fetchProducts/displayProducts) not found.");
            return;
        }

        const allProducts = await fetchProducts();
        
        // Filter out the currently viewed product and show the first 4 others
        const relatedProducts = allProducts.filter(p => String(p.id) !== String(id)).slice(0, 4);
        
        const relatedProductGrid = document.getElementById('related-product-grid');
        if (relatedProductGrid) {
            relatedProductGrid.innerHTML = ''; // Clear any placeholders
            displayProducts(relatedProducts, 'related-product-grid');
        }
    }

    // Only try to load related products if a valid product is being viewed
    if (id) {
        loadRelatedProducts();
    }
});