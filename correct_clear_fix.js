// Correct Clear Button Fix - Restore to Original HTML Structure
console.log('🗑️ Correct Clear Fix Loading...');

// Enhanced clearImage function with correct HTML structure
window.clearImage = function() {
    console.log('🗑️ Clearing image with correct HTML structure...');
    
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
        
        // 3. Reset upload section to original state
        resetUploadSectionCorrectly();
        
        // 4. Hide action buttons and results
        hideResultSections();
        
        // 5. Reset global variables
        resetGlobalState();
        
        console.log('✅ Image cleared successfully with correct structure');
        
    } catch (error) {
        console.error('❌ Clear error:', error);
        // Simple fallback
        simpleReset();
    }
};

function resetUploadSectionCorrectly() {
    console.log('📤 Resetting upload section to original structure...');
    
    const uploadSection = document.getElementById('uploadSection');
    if (!uploadSection) {
        console.error('❌ Upload section not found');
        return;
    }
    
    // Reset to original classes
    uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50';
    
    // Find the content container (should be .space-y-4)
    let contentContainer = uploadSection.querySelector('.space-y-4');
    
    if (!contentContainer) {
        // If not found, find any div that contains the content
        contentContainer = uploadSection.querySelector('div');
    }
    
    if (contentContainer) {
        // Restore original HTML structure
        contentContainer.innerHTML = `
            <div class="relative">
                <div class="mx-auto w-20 h-20 text-gray-400 mb-4 relative">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
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
            </div>
        `;
        console.log('✅ Upload section content restored to original');
    } else {
        console.error('❌ Could not find content container');
    }
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

function simpleReset() {
    console.log('🔄 Simple reset fallback...');
    
    try {
        // Clear file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Show upload section
        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) {
            uploadSection.classList.remove('hidden');
            uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50';
        }
        
        // Hide other sections
        ['actionButtons', 'loadingSection', 'resultsContainer', 'imagePreview'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        console.log('✅ Simple reset completed');
        
    } catch (error) {
        console.error('❌ Simple reset failed:', error);
    }
}

// Override the problematic clearImage function from other scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up correct clear functionality...');
    
    // Wait for other scripts to load
    setTimeout(() => {
        setupCorrectClearButton();
    }, 2000);
});

function setupCorrectClearButton() {
    const clearBtn = document.getElementById('clearBtn');
    if (!clearBtn) {
        console.error('❌ Clear button not found');
        return;
    }
    
    console.log('✅ Found clear button, setting up correct handler');
    
    // Remove all existing event listeners by cloning
    const newClearBtn = clearBtn.cloneNode(true);
    clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
    
    // Add correct event listener
    newClearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🗑️ Correct clear button clicked');
        clearImage();
    });
    
    console.log('✅ Correct clear button setup completed');
}

// Backup clear function
window.correctClearImage = function() {
    console.log('🗑️ Backup clear function called');
    clearImage();
};

console.log('🗑️ Correct Clear Fix loaded successfully');
