// Fix for Upload Section Disappearing Issue
console.log('🔧 Upload Section Fix Loading...');

// Override the analysis functions to preserve upload section
let originalPerformProfessionalAnalysis = window.performProfessionalAnalysis;

window.performProfessionalAnalysis = async function(selectedFile) {
    console.log('🎨 Starting professional analysis with upload section preservation...');
    
    try {
        // Show loading but DON'T hide upload section
        document.getElementById('actionButtons').classList.add('hidden');
        document.getElementById('resultsContainer').classList.add('hidden');
        document.getElementById('loadingSection').classList.remove('hidden');
        
        // Keep upload section visible
        document.getElementById('uploadSection').classList.remove('hidden');
        
        console.log('🔄 Loading section shown, upload section preserved');
        
        // Check if professional analyzer is available
        if (window.professionalColorAnalyzer && !window.professionalColorAnalyzer.fallbackMode) {
            console.log('🌟 Using Professional Color Analyzer...');
            const result = await window.professionalColorAnalyzer.analyzeProfessional(selectedFile);
            console.log('✅ Professional analysis completed');
            
            // Store result globally
            window.analysisData = result.analysis;
            
            // Display results and restore upload section
            displayComprehensiveResultsWithUpload(result);
            
        } else {
            console.log('🔄 Using standard analysis...');
            await performStandardAPIAnalysisWithUpload(selectedFile);
        }
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        
        // Show error message but keep upload section
        document.getElementById('loadingSection').innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                <h3 class="text-2xl font-bold text-red-600 mb-2">Analysis Failed</h3>
                <p class="text-gray-600 mb-4">${error.message}</p>
                <button onclick="restoreInterface()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Try Again
                </button>
            </div>
        `;
        
        // Keep upload section visible
        document.getElementById('uploadSection').classList.remove('hidden');
    }
};

async function performStandardAPIAnalysisWithUpload(selectedFile) {
    console.log('📡 Performing standard API analysis with upload preservation...');
    
    // Convert file to base64
    const base64 = await convertFileToBase64(selectedFile);
    console.log('🔄 File converted to base64');
    
    // Call API
    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_data: base64,
            analysis_type: 'color_analysis'
        })
    });
    
    console.log('📡 API response received:', response.status);
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Standard analysis completed');
    
    // Store result globally
    window.analysisData = result.analysis;
    
    // Display results with upload section
    displayComprehensiveResultsWithUpload(result);
}

function displayComprehensiveResultsWithUpload(result) {
    console.log('🎨 Displaying results with upload section preserved...');
    
    const analysis = result.analysis;
    
    // Hide loading, show results, KEEP upload section
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    document.getElementById('uploadSection').classList.remove('hidden'); // Keep visible
    document.getElementById('actionButtons').classList.remove('hidden'); // Show action buttons
    
    try {
        // Display all sections with professional data
        displayQuickStats(analysis);
        displayDominantColors(analysis.dominant_colors);
        displayColorFrequency(analysis.color_frequency);
        displayHistograms(analysis.histograms);
        displayRegionalAnalysis(analysis.regional_analysis);
        displayColorSpaces(analysis.color_spaces);
        displayColorCharacteristics(analysis.characteristics);
        displayAIInsights(analysis);
        
        // Add professional enhancements after delay
        setTimeout(() => {
            addProfessionalEnhancements(analysis);
        }, 1000);
        
        console.log('✅ Professional display completed with upload section preserved');
        
    } catch (error) {
        console.error('❌ Professional display error:', error);
        
        // Fallback to original display but keep upload section
        if (window.originalDisplayComprehensiveResults) {
            window.originalDisplayComprehensiveResults(result);
        }
        
        // Ensure upload section stays visible
        document.getElementById('uploadSection').classList.remove('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
    }
}

// Override the main displayComprehensiveResults to preserve upload section
let originalDisplayComprehensiveResults = window.displayComprehensiveResults;

window.displayComprehensiveResults = function(result) {
    console.log('🎨 Enhanced displayComprehensiveResults with upload preservation...');
    
    // Use the upload-preserving version
    displayComprehensiveResultsWithUpload(result);
};

// Function to restore interface after error
window.restoreInterface = function() {
    console.log('🔄 Restoring interface...');
    
    // Show all main sections
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('actionButtons').classList.remove('hidden');
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    
    // Reset loading section content
    document.getElementById('loadingSection').innerHTML = `
        <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Analyzing colors...</h3>
            <p class="text-gray-600">Processing: Frequency • Dominant Colors • Regional Analysis • Histograms • Color Spaces</p>
        </div>
    `;
    
    console.log('✅ Interface restored');
};

// Override clearImage function to ensure proper state
window.clearImage = function() {
    console.log('🗑️ Clearing image with proper state management...');
    
    // Clear file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Reset interface state
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('actionButtons').classList.add('hidden');
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    
    // Reset upload section to initial state
    const uploadSection = document.getElementById('uploadSection');
    uploadSection.className = 'border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50';
    
    console.log('✅ Image cleared and interface reset');
};

// Ensure upload section is always visible after analysis
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up upload section preservation...');
    
    // Monitor for any attempts to hide upload section
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const uploadSection = document.getElementById('uploadSection');
                if (uploadSection && uploadSection.classList.contains('hidden')) {
                    // If results are showing, keep upload section visible
                    const resultsContainer = document.getElementById('resultsContainer');
                    if (resultsContainer && !resultsContainer.classList.contains('hidden')) {
                        console.log('🔄 Restoring upload section visibility...');
                        uploadSection.classList.remove('hidden');
                    }
                }
            }
        });
    });
    
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        observer.observe(uploadSection, { attributes: true });
        console.log('✅ Upload section preservation monitor active');
    }
});

console.log('🔧 Upload Section Fix loaded successfully');
