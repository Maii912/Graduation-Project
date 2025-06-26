document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // === SECTION 1: MOBILE SEARCH BAR ANIMATION ===
    // ===============================================

    const searchContainer = document.getElementById('search-container');
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    
    // Add click listener to the mobile search icon
    if (searchToggleBtn && searchContainer) {
        searchToggleBtn.addEventListener('click', (event) => {
            // Stop the click from bubbling up to the document
            event.stopPropagation();
            searchContainer.classList.toggle('active');
        });
    }

    // Add a global click listener to close the mobile search if clicking outside of it
    document.addEventListener('click', (event) => {
        if (searchContainer && searchContainer.classList.contains('active')) {
            // Check if the click was outside the search container
            if (!searchContainer.contains(event.target)) {
                searchContainer.classList.remove('active');
            }
        }
    });


    // ==================================================
    // === SECTION 2: VISUAL SEARCH MODAL FILE LOGIC ===
    // ==================================================

    const visualSearchModal = document.getElementById('visualSearchModal');
    const dropZone = document.querySelector(".visual-search-drop-zone");
    const fileInput = document.getElementById("visualSearchFileInput");
    const uploadBtn = document.querySelector(".visual-search-upload-btn");
    const errorMsg = document.getElementById("visualSearchError");
    const previewArea = document.getElementById("visualSearchPreview");
  
    // If these elements don't exist on the page, don't run the visual search code
    if (!visualSearchModal || !dropZone || !fileInput || !uploadBtn || !errorMsg || !previewArea) {
      return; 
    }
  
    /**
     * Resets the visual search modal to its default state.
     */
    function clearPreviewAndError() {
      errorMsg.textContent = "";
      previewArea.innerHTML = "";
      fileInput.value = null; // Important for allowing re-selection of the same file
    }

    /**
     * Handles the file once it's selected or dropped.
     * @param {File} file - The image file to process.
     */
    function handleFile(file) {
      clearPreviewAndError();
  
      if (!file) {
        errorMsg.textContent = "No file was selected.";
        return;
      }
  
      // --- File Validation ---
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!acceptedTypes.includes(file.type)) {
        errorMsg.textContent = `Unsupported file. Please upload JPEG, PNG, or WebP.`;
        return;
      }
  
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        errorMsg.textContent = `File is too large. Maximum size is ${maxSizeInMB}MB.`;
        return;
      }
  
      // --- File Reading and Preview ---
      const reader = new FileReader();
      reader.onload = function (e) {
        // Create an image element for the preview
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Image preview";
        previewArea.appendChild(img);

        // --- Navigation to Results Page ---
        // This is where the magic happens!
        errorMsg.textContent = "Analyzing image and finding similar items...";
        
        setTimeout(() => {
            // Navigate to the new results page.
            window.location.href = "resultpage.html";

            // Optional future enhancement: You could pass the image data or a
            // server-generated ID to the results page to show the specific query.
            // Example: window.location.href = `resultpage.html?searchId=12345`;

        }, 1500); // 1.5 second delay to show preview before redirecting

      };

      reader.onerror = function () {
        errorMsg.textContent = "Could not read the selected file.";
      };

      // Read the file to trigger the onload event
      reader.readAsDataURL(file);
    }
  
    // --- Attaching Event Listeners ---
    
    // Manual upload via button click
    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });
  
    // Upload when a file is chosen through the input
    fileInput.addEventListener("change", (event) => {
        handleFile(event.target.files[0]);
    });
  
    // Drag and Drop listeners for a modern UX
    dropZone.addEventListener("dragenter", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
    dropZone.addEventListener("dragover",  (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    dropZone.addEventListener("dragleave", (e) => dropZone.classList.remove("drag-over"));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        handleFile(e.dataTransfer.files[0]);
    });
  
});