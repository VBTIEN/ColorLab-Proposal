// Icon Correct Clear Fix - Restore Original FontAwesome Icon
console.log('🗑️ Icon Correct Clear Fix Loading...');

// Enhanced clearImage function with correct original icon
window.clearImage = function() {
    console.log('🗑️ Clearing image with correct original icon...');
    
    try {
        // 1. Clear file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
            console.log('✅ File input cleared');
        }
        
        // 2. Hide image preview if exists
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.classList.add('hidden');
        }
        
        // 3. Reset upload section to original state with correct icon
        resetUploadSectionWithOriginalIcon();
        
        // 4. Hide action buttons and results
        hideResultSections();
        
        // 5. Reset global variables
        resetGlobalState();
        
        console.log('✅ Image cleared successfully with original icon');
        
    } catch (error) {
        console.error('❌ Clear error:', error);
        // Simple fallback
        simpleResetWithOriginalIcon();
    }
};

function resetUploadSectionWithOriginalIcon() {
    console.log('📤 Resetting upload section with original FontAwesome icon...');
    
    const uploadSection = document.getElementById('uploadSection');
    if (!uploadSection) {
        console.error('❌ Upload section not found');
        return;
    }
    
    // Reset to original classes
    uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer group';
    
    // Find the upload area container
    let uploadArea = uploadSection.querySelector('#uploadArea');
    
    if (!uploadArea) {
        // If not found, find the .space-y-4 container
        uploadArea = uploadSection.querySelector('.space-y-4');
    }
    
    if (!uploadArea) {
        // Create the upload area if it doesn't exist
        uploadArea = document.createElement('div');
        uploadArea.id = 'uploadArea';
        uploadArea.className = 'space-y-4';
        uploadSection.insertBefore(uploadArea, uploadSection.firstChild);
    }
    
    // Restore original HTML structure with correct FontAwesome icon
    uploadArea.innerHTML = `
        <div class="relative inline-block">
            <i class="fas fa-cloud-upload-alt text-7xl text-blue-500 group-hover:animate-bounce-gentle transition-transform duration-300 icon-glow"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping"></div>
        </div>
        <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <i class="fas fa-images text-purple-500"></i>
                Drop your image here or click to select
            </h3>
            <p class="text-gray-600 flex items-center justify-center gap-2">
                <i class="fas fa-info-circle text-blue-500"></i>
                Supports JPG, PNG, GIF, BMP, WEBP • Max 10MB
            </p>
        </div>
    `;
    
    console.log('✅ Upload section restored with original FontAwesome icon');
}

function hideResultSections() {
    console.log('📊 Hiding result sections...');
    
    // Hide action buttons
    const actionButtons = document.getElementById('actionButtons');
    if (actionButtons) {
        actionButtons.classList.add('hidden');
    }
    
    // Hide loading section
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) {
        loadingSection.classList.add('hidden');
    }
    
    // Hide results container
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
    
    // Hide image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.classList.add('hidden');
    }
    
    console.log('✅ Result sections hidden');
}

function resetGlobalState() {
    console.log('🔄 Resetting global state...');
    
    // Reset analysis data
    if (window.analysisData) {
        window.analysisData = null;
    }
    
    // Reset selected file
    window.selectedFile = null;
    
    // Reset professional analyzer if exists
    if (window.professionalColorAnalyzer) {
        window.professionalColorAnalyzer.fallbackMode = false;
    }
    
    console.log('✅ Global state reset');
}

function simpleResetWithOriginalIcon() {
    console.log('🔄 Simple reset with original icon fallback...');
    
    try {
        // Clear file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Show upload section with original styling
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            uploadSection.classList.remove('hidden');
            uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer group';
            
            // Try to restore original content
            const uploadArea = uploadSection.querySelector('#uploadArea') || uploadSection.querySelector('.space-y-4');
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <div class="relative inline-block">
                        <i class="fas fa-cloud-upload-alt text-7xl text-blue-500 group-hover:animate-bounce-gentle transition-transform duration-300 icon-glow"></i>
                        <div class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping"></div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                            <i class="fas fa-images text-purple-500"></i>
                            Drop your image here or click to select
                        </h3>
                        <p class="text-gray-600 flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle text-blue-500"></i>
                            Supports JPG, PNG, GIF, BMP, WEBP • Max 10MB
                        </p>
                    </div>
                `;
            }
        }
        
        // Hide other sections
        ['actionButtons', 'loadingSection', 'resultsContainer', 'imagePreview'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        console.log('✅ Simple reset with original icon completed');
        
    } catch (error) {
        console.error('❌ Simple reset failed:', error);
    }
}

// Override the problematic clearImage function from other scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up icon correct clear functionality...');
    
    // Wait for other scripts to load
    setTimeout(() => {
        setupIconCorrectClearButton();
    }, 2000);
});

function setupIconCorrectClearButton() {
    const clearBtn = document.getElementById('clearBtn');
    if (!clearBtn) {
        console.error('❌ Clear button not found');
        return;
    }
    
    console.log('✅ Found clear button, setting up icon correct handler');
    
    // Remove all existing event listeners by cloning
    const newClearBtn = clearBtn.cloneNode(true);
    clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
    
    // Add correct event listener
    newClearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🗑️ Icon correct clear button clicked');
        clearImage();
    });
    
    console.log('✅ Icon correct clear button setup completed');
}

// Backup clear function
window.iconCorrectClearImage = function() {
    console.log('🗑️ Backup icon correct clear function called');
    clearImage();
};

console.log('🗑️ Icon Correct Clear Fix loaded successfully');
