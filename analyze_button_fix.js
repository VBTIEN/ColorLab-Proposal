// Fix for Analyze Button - Ensure button works properly
console.log('🔧 Analyze Button Fix Loading...');

// Ensure analyze button is properly connected
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up analyze button fix...');
    
    // Wait a bit for all scripts to load
    setTimeout(() => {
        setupAnalyzeButtonFix();
    }, 2000);
});

function setupAnalyzeButtonFix() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const fileInput = document.getElementById('imageInput');
    
    if (!analyzeBtn) {
        console.error('❌ Analyze button not found');
        return;
    }
    
    if (!fileInput) {
        console.error('❌ File input not found');
        return;
    }
    
    console.log('✅ Found analyze button and file input');
    
    // Remove any existing event listeners
    const newAnalyzeBtn = analyzeBtn.cloneNode(true);
    analyzeBtn.parentNode.replaceChild(newAnalyzeBtn, analyzeBtn);
    
    // Add fresh event listener
    newAnalyzeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🎨 Analyze button clicked!');
        
        const selectedFile = fileInput.files[0];
        
        if (!selectedFile) {
            alert('Please select an image file first.');
            return;
        }
        
        console.log('📁 File selected:', selectedFile.name);
        
        // Call the professional analysis
        performAnalysis(selectedFile);
    });
    
    console.log('✅ Analyze button fix applied');
}

async function performAnalysis(selectedFile) {
    console.log('🎨 Starting analysis with file:', selectedFile.name);
    
    try {
        // Show loading
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('actionButtons').classList.add('hidden');
        document.getElementById('resultsContainer').classList.add('hidden');
        document.getElementById('loadingSection').classList.remove('hidden');
        
        console.log('🔄 Loading section shown');
        
        // Check if professional analyzer is available
        if (window.professionalColorAnalyzer && !window.professionalColorAnalyzer.fallbackMode) {
            console.log('🌟 Using Professional Color Analyzer...');
            const result = await window.professionalColorAnalyzer.analyzeProfessional(selectedFile);
            console.log('✅ Professional analysis completed');
            
            // Store result globally
            window.analysisData = result.analysis;
            
            // Display results
            displayComprehensiveResults(result);
            
        } else {
            console.log('🔄 Using standard analysis...');
            await performStandardAnalysis(selectedFile);
        }
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        
        // Show error message
        document.getElementById('loadingSection').innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                <h3 class="text-2xl font-bold text-red-600 mb-2">Analysis Failed</h3>
                <p class="text-gray-600 mb-4">${error.message}</p>
                <button onclick="location.reload()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Try Again
                </button>
            </div>
        `;
    }
}

async function performStandardAnalysis(selectedFile) {
    console.log('📡 Performing standard API analysis...');
    
    // Convert file to base64
    const base64 = await fileToBase64(selectedFile);
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
    
    // Display results
    displayComprehensiveResults(result);
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Backup analyze function
window.backupAnalyzeImage = async function() {
    console.log('🔄 Backup analyze function called');
    
    const fileInput = document.getElementById('imageInput');
    const selectedFile = fileInput.files[0];
    
    if (!selectedFile) {
        alert('Please select an image file first.');
        return;
    }
    
    await performAnalysis(selectedFile);
};

console.log('🔧 Analyze Button Fix loaded successfully');
