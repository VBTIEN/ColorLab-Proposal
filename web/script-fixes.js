// JavaScript Fixes for Button Click Issues

// Fix 1: Prevent multiple file dialog opens
let isFileDialogOpen = false;

function openFileDialog() {
    if (isFileDialogOpen) {
        console.log('File dialog already open, ignoring click');
        return;
    }
    
    isFileDialogOpen = true;
    const fileInput = document.getElementById('fileInput');
    
    // Reset the input value to allow selecting the same file again
    fileInput.value = '';
    
    // Add event listener for when dialog closes
    const handleFocus = () => {
        setTimeout(() => {
            isFileDialogOpen = false;
            window.removeEventListener('focus', handleFocus);
        }, 300);
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Open file dialog
    fileInput.click();
}

// Fix 2: Improved drag and drop setup
function setupDragAndDropFixed() {
    const uploadArea = document.getElementById('uploadArea');
    let dragCounter = 0;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);
    
    // Handle click to open file dialog
    uploadArea.addEventListener('click', handleUploadAreaClick, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        dragCounter++;
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight(e) {
        dragCounter--;
        if (dragCounter === 0) {
            uploadArea.classList.remove('dragover');
        }
    }
    
    function handleDrop(e) {
        dragCounter = 0;
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }
    
    function handleUploadAreaClick(e) {
        // Only open file dialog if clicking on the upload area itself
        // Not on the choose image button
        if (e.target === uploadArea || e.target.classList.contains('upload-icon') || 
            e.target.classList.contains('upload-text')) {
            openFileDialog();
        }
    }
}

// Fix 3: Improved file input setup
function setupFileInputFixed() {
    const fileInput = document.getElementById('fileInput');
    const chooseButton = document.getElementById('chooseImageBtn');
    
    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
        isFileDialogOpen = false;
    });
    
    // Handle choose button click
    if (chooseButton) {
        chooseButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openFileDialog();
        });
    }
}

// Fix 4: Enhanced file validation
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type.toLowerCase())) {
        showError('Please select a valid image file (JPG, PNG, GIF, BMP, WEBP).');
        return false;
    }
    
    if (file.size > maxSize) {
        showError(`Image size (${formatFileSize(file.size)}) exceeds the 10MB limit.`);
        return false;
    }
    
    if (file.size === 0) {
        showError('The selected file appears to be empty.');
        return false;
    }
    
    return true;
}

// Fix 5: Better file size formatting
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Fix 6: Enhanced error handling
function showErrorFixed(message, duration = 5000) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error');
    existingErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <strong>⚠️ Error:</strong> ${message}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: #c62828; font-size: 1.2em; cursor: pointer; padding: 0 5px;">
                ×
            </button>
        </div>
    `;
    
    const mainContent = document.querySelector('.main-content');
    const uploadSection = document.querySelector('.upload-section');
    mainContent.insertBefore(errorDiv, uploadSection);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, duration);
}

// Fix 7: Enhanced success messages
function showSuccessFixed(message, duration = 3000) {
    // Remove existing success messages
    const existingSuccess = document.querySelectorAll('.success');
    existingSuccess.forEach(success => success.remove());
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <strong>✅ Success:</strong> ${message}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: #2e7d32; font-size: 1.2em; cursor: pointer; padding: 0 5px;">
                ×
            </button>
        </div>
    `;
    
    const mainContent = document.querySelector('.main-content');
    const uploadSection = document.querySelector('.upload-section');
    mainContent.insertBefore(successDiv, uploadSection);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, duration);
}

// Fix 8: Improved loading state management
function showLoadingFixed(show) {
    const loadingSection = document.getElementById('loadingSection');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const uploadArea = document.getElementById('uploadArea');
    
    if (show) {
        loadingSection.style.display = 'block';
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '🔄 Analyzing...';
        }
        if (uploadArea) {
            uploadArea.style.pointerEvents = 'none';
            uploadArea.style.opacity = '0.7';
        }
    } else {
        loadingSection.style.display = 'none';
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '🔍 Analyze Image';
        }
        if (uploadArea) {
            uploadArea.style.pointerEvents = 'auto';
            uploadArea.style.opacity = '1';
        }
    }
}

// Fix 9: Better image preview handling
function showImagePreviewFixed(imageSrc) {
    const previewSection = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (previewImg && previewSection) {
        previewImg.onload = () => {
            previewSection.style.display = 'block';
            // Hide analysis section
            const analysisSection = document.getElementById('analysisSection');
            if (analysisSection) {
                analysisSection.style.display = 'none';
            }
            console.log('🖼️ Image preview displayed successfully');
        };
        
        previewImg.onerror = () => {
            showErrorFixed('Failed to load image preview. Please try a different image.');
        };
        
        previewImg.src = imageSrc;
    }
}

// Fix 10: Initialize all fixes
function initializeFixedApp() {
    console.log('🔧 Initializing fixes...');
    
    // Setup improved drag and drop
    setupDragAndDropFixed();
    
    // Setup improved file input
    setupFileInputFixed();
    
    // Override global functions with fixed versions
    window.showError = showErrorFixed;
    window.showSuccess = showSuccessFixed;
    window.showLoading = showLoadingFixed;
    window.showImagePreview = showImagePreviewFixed;
    
    console.log('✅ All fixes initialized');
}

// Export functions for use in main script
window.initializeFixedApp = initializeFixedApp;
window.validateFile = validateFile;
window.formatFileSize = formatFileSize;
