// Fix Clear Button - Complete Image and Interface Reset
console.log('🗑️ Clear Button Fix Loading...');

// Enhanced clearImage function
window.clearImage = function() {
    console.log('🗑️ Clearing image and resetting interface...');
    
    try {
        // 1. Clear file input completely
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
            fileInput.files = null; // Force clear files
            console.log('✅ File input cleared');
        }
        
        // 2. Clear any image preview elements
        clearImagePreviews();
        
        // 3. Reset upload section to initial state
        resetUploadSection();
        
        // 4. Hide all result sections
        hideAllResultSections();
        
        // 5. Reset global variables
        resetGlobalVariables();
        
        // 6. Clear any cached data
        clearCachedData();
        
        console.log('✅ Image cleared and interface reset successfully');
        
    } catch (error) {
        console.error('❌ Clear image error:', error);
        // Force reset even if error occurs
        forceReset();
    }
};

function clearImagePreviews() {
    console.log('🖼️ Clearing image previews...');
    
    // Clear any img elements that might show the uploaded image
    const imageElements = document.querySelectorAll('img[src^="blob:"], img[src^="data:"]');
    imageElements.forEach(img => {
        URL.revokeObjectURL(img.src); // Free memory
        img.src = '';
        img.remove();
    });
    
    // Clear any canvas elements
    const canvasElements = document.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
    
    // Clear any background images set via style
    const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');
    elementsWithBgImage.forEach(element => {
        if (element.style.backgroundImage.includes('blob:') || element.style.backgroundImage.includes('data:')) {
            element.style.backgroundImage = '';
        }
    });
    
    console.log('✅ Image previews cleared');
}

function resetUploadSection() {
    console.log('📤 Resetting upload section...');
    
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        // Reset to initial state
        uploadSection.classList.remove('hidden');
        uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50';
        
        // Reset inner content to initial state
        const uploadContent = uploadSection.querySelector('.space-y-4');
        if (uploadContent) {
            uploadContent.innerHTML = `
                <div class="mx-auto w-16 h-16 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-xl font-semibold text-gray-700 mb-2">Drop your image here</p>
                    <p class="text-gray-500">or click to browse</p>
                    <p class="text-sm text-gray-400 mt-2">Supports: JPG, PNG, GIF, WebP</p>
                </div>
            `;
        }
    }
    
    console.log('✅ Upload section reset');
}

function hideAllResultSections() {
    console.log('📊 Hiding all result sections...');
    
    // Hide main result containers
    const sectionsToHide = [
        'actionButtons',
        'loadingSection', 
        'resultsContainer'
    ];
    
    sectionsToHide.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    // Clear result content
    const resultSections = [
        'quickStats',
        'dominantColors',
        'colorFrequency', 
        'regionalAnalysis',
        'colorSpaces',
        'colorCharacteristics',
        'aiInsights'
    ];
    
    resultSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.innerHTML = '';
        }
    });
    
    // Destroy any Chart.js instances
    destroyCharts();
    
    console.log('✅ Result sections hidden and cleared');
}

function destroyCharts() {
    console.log('📈 Destroying chart instances...');
    
    // Destroy Chart.js instances to prevent memory leaks
    const chartCanvases = ['rgbHistogram', 'hsvHistogram'];
    
    chartCanvases.forEach(canvasId => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
                console.log(`✅ Destroyed chart: ${canvasId}`);
            }
        }
    });
}

function resetGlobalVariables() {
    console.log('🔄 Resetting global variables...');
    
    // Reset analysis data
    if (window.analysisData) {
        window.analysisData = null;
    }
    
    // Reset professional analyzer state
    if (window.professionalColorAnalyzer) {
        window.professionalColorAnalyzer.fallbackMode = false;
    }
    
    // Clear any other global state
    window.currentImageFile = null;
    window.currentAnalysisResult = null;
    
    console.log('✅ Global variables reset');
}

function clearCachedData() {
    console.log('🗄️ Clearing cached data...');
    
    // Clear any localStorage related to the app
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('colorlab') || key.includes('analysis'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.warn('⚠️ Could not clear localStorage:', error);
    }
    
    // Clear any sessionStorage
    try {
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && (key.includes('colorlab') || key.includes('analysis'))) {
                sessionKeysToRemove.push(key);
            }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
        console.warn('⚠️ Could not clear sessionStorage:', error);
    }
    
    console.log('✅ Cached data cleared');
}

function forceReset() {
    console.log('🔄 Force resetting interface...');
    
    // Force reload if necessary
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
        }
        
        // Hide other sections
        ['actionButtons', 'loadingSection', 'resultsContainer'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        console.log('✅ Force reset completed');
        
    } catch (error) {
        console.error('❌ Force reset failed:', error);
        // Last resort - reload page
        if (confirm('Interface reset failed. Reload page?')) {
            location.reload();
        }
    }
}

// Enhanced file input change handler to ensure proper state
function setupEnhancedFileInputHandler() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        // Remove existing listeners
        fileInput.removeEventListener('change', handleFileInputChange);
        
        // Add enhanced listener
        fileInput.addEventListener('change', handleFileInputChange);
        console.log('✅ Enhanced file input handler setup');
    }
}

function handleFileInputChange(event) {
    console.log('📁 File input changed');
    
    const file = event.target.files[0];
    if (file) {
        console.log('📁 New file selected:', file.name);
        
        // Show action buttons
        const actionButtons = document.getElementById('actionButtons');
        if (actionButtons) {
            actionButtons.classList.remove('hidden');
        }
        
        // Update upload section to show file selected
        updateUploadSectionWithFile(file);
        
    } else {
        console.log('📁 No file selected');
        
        // Hide action buttons
        const actionButtons = document.getElementById('actionButtons');
        if (actionButtons) {
            actionButtons.classList.add('hidden');
        }
    }
}

function updateUploadSectionWithFile(file) {
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        const uploadContent = uploadSection.querySelector('.space-y-4');
        if (uploadContent) {
            uploadContent.innerHTML = `
                <div class="mx-auto w-16 h-16 text-green-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-xl font-semibold text-green-700 mb-2">File Selected</p>
                    <p class="text-gray-700 font-medium">${file.name}</p>
                    <p class="text-sm text-gray-500 mt-1">Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p class="text-sm text-gray-400 mt-2">Click "Analyze Colors Professionally" to start</p>
                </div>
            `;
        }
        
        // Update styling
        uploadSection.className = 'border-2 border-dashed border-green-400 bg-green-50 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-green-500';
    }
}

// Initialize enhanced clear functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up enhanced clear functionality...');
    
    // Setup enhanced file input handler
    setTimeout(() => {
        setupEnhancedFileInputHandler();
    }, 1000);
    
    // Ensure clear button is properly connected
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        // Remove existing listeners
        const newClearBtn = clearBtn.cloneNode(true);
        clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
        
        // Add enhanced clear functionality
        newClearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🗑️ Clear button clicked');
            clearImage();
        });
        
        console.log('✅ Enhanced clear button setup');
    }
});

console.log('🗑️ Clear Button Fix loaded successfully');
