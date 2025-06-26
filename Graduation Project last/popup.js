// --- START: Visual Search Modal Logic ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Visual Search Modal elements
    const visualSearchModal = document.getElementById("visualSearchModal");
    const openModalButtons = document.querySelectorAll("#visualSearchBtn, #navVisualSearchBtn");
    const closeVisualSearchBtn = document.querySelector(".visual-search-close-btn");
    
    // --- File handling elements
    const dropZone = document.querySelector(".visual-search-drop-zone");
    const fileInput = document.getElementById("visualSearchFileInput");
    const uploadBtn = document.querySelector(".visual-search-upload-btn");
    const errorMsg = document.getElementById("visualSearchError");
    const previewArea = document.getElementById("visualSearchPreview");
  
    // --- Action elements
    const actionsContainer = document.getElementById("visualSearchActions");
    const findSimilarBtn = document.getElementById("findSimilarBtn");
    const predictPriceBtn = document.getElementById("predictPriceBtn");

    // --- Price Prediction Modal elements
    const pricePredictionModal = document.getElementById("pricePredictionModal");
    const closePricePredictionBtn = document.getElementById("closePricePredictionBtn");
    const predictedPriceText = document.getElementById("predicted-price-text");

    // A variable to hold the image data (base64)
    let uploadedImageData = null;

    // Backend API base URL - change this to your deployed backend URL
    const API_BASE_URL = 'http://localhost:5000/api/ai';

    if (!visualSearchModal || !pricePredictionModal || !findSimilarBtn || !predictPriceBtn) {
      console.error("Essential modal elements missing from the page. Aborting full setup.");
      return;
    }
  
    function openVisualSearchModal() {
      visualSearchModal.style.display = "flex";
      clearVisualSearchState();
    }
  
    function closeVisualSearchModal() {
      visualSearchModal.style.display = "none";
      clearVisualSearchState();
    }

    function closePricePredictionModal() {
      pricePredictionModal.style.display = "none";
    }
  
    // Resets the visual search modal to its initial state
    function clearVisualSearchState() {
      errorMsg.textContent = "";
      previewArea.innerHTML = "";
      actionsContainer.style.display = "none";
      dropZone.style.display = "block";
      dropZone.classList.remove("drag-over");
      fileInput.value = null;
      uploadedImageData = null;
    }
  
    function handleFile(file) {
      errorMsg.textContent = "";
      previewArea.innerHTML = "";
      actionsContainer.style.display = "none";
      dropZone.style.display = "block";
  
      if (!file) {
        errorMsg.textContent = "No file selected or dropped.";
        return;
      }
  
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!acceptedTypes.includes(file.type)) {
        errorMsg.textContent = `Unsupported file type. Please upload JPEG, PNG, or WebP.`;
        return;
      }
  
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errorMsg.textContent = `File is too large. Max size is 5MB.`;
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImageData = e.target.result;
        const img = document.createElement('img');
        img.src = uploadedImageData;
        img.alt = "Image preview";
        previewArea.appendChild(img);
        dropZone.style.display = "none";
        actionsContainer.style.display = "flex";
      };
      reader.onerror = function () {
        errorMsg.textContent = "Could not read the selected file.";
      };
      reader.readAsDataURL(file);
    }

    // Function to call the price prediction API
    async function predictPriceFromAPI(imageData) {
        try {
            predictedPriceText.textContent = "Analyzing image...";
            pricePredictionModal.style.display = 'flex';

            const response = await fetch(`${API_BASE_URL}/predict-price`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            predictedPriceText.textContent = `The estimated price for this item is ${result.predicted_price} ${result.currency}`;
            
        } catch (error) {
            console.error('Price prediction error:', error);
            predictedPriceText.textContent = `Error predicting price: ${error.message}`;
        }
    }

    // Function to call the visual search API
    async function searchSimilarFromAPI(imageData) {
        try {
            // Store the image for the results page
            sessionStorage.setItem('visualSearchQueryImage', imageData);
            
            // Call the API to get similar products
            const response = await fetch(`${API_BASE_URL}/search-by-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            // Store the search results for the results page
            sessionStorage.setItem('visualSearchResults', JSON.stringify(result.similar_products));
            
            // Navigate to results page
            window.location.href = 'resultpage.html';
            
        } catch (error) {
            console.error('Visual search error:', error);
            errorMsg.textContent = `Error searching for similar items: ${error.message}`;
            actionsContainer.style.display = "none";
            dropZone.style.display = "block";
        }
    }
  
    // --- EVENT LISTENERS ---
  
    openModalButtons.forEach(btn => btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); openVisualSearchModal(); }));
  
    // --- Listeners for closing modals
    closeVisualSearchBtn.addEventListener("click", closeVisualSearchModal);
    visualSearchModal.addEventListener("click", (e) => e.target === visualSearchModal && closeVisualSearchModal());
    closePricePredictionBtn.addEventListener("click", closePricePredictionModal);
    pricePredictionModal.addEventListener("click", (e) => e.target === pricePredictionModal && closePricePredictionModal());
  
    // --- Listeners for file handling
    uploadBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));
    dropZone.addEventListener("dragenter", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
    dropZone.addEventListener("dragover",  (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        handleFile(e.dataTransfer.files[0]);
    });
  
    // --- Listeners for the Visual Search action buttons
    findSimilarBtn.addEventListener('click', () => {
        if (uploadedImageData) {
            searchSimilarFromAPI(uploadedImageData);
        } else {
            errorMsg.textContent = "An error occurred. Please upload the image again.";
            actionsContainer.style.display = "none";
            dropZone.style.display = "block";
        }
    });

    predictPriceBtn.addEventListener('click', () => {
        if (uploadedImageData) {
            predictPriceFromAPI(uploadedImageData);
        } else {
            errorMsg.textContent = "An error occurred. Please upload the image again.";
            actionsContainer.style.display = "none";
            dropZone.style.display = "block";
        }
    });
});

