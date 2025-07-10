// Clean Web Interface - No additional sections, original tabs only

// Override displayComprehensiveResults để chỉ hiển thị original tabs
function displayComprehensiveResults(result) {
    console.log('🔍 DEBUG: displayComprehensiveResults called with:', result);
    
    const analysis = result.analysis;
    
    // Hide loading, show results
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    // Display ONLY original sections - no enhancements
    try {
        displayQuickStats(analysis);
        displayDominantColors(analysis.dominant_colors);
        displayColorFrequency(analysis.color_frequency);
        
        // Original histogram display (RGB only)
        if (analysis.histograms) {
            displayHistograms(analysis.histograms);
        }
        
        displayRegionalAnalysis(analysis.regional_analysis);
        displayColorSpaces(analysis.color_spaces);
        displayColorCharacteristics(analysis.characteristics);
        displayAIInsights(analysis);
        
        // NO ENHANCEMENTS - keep original interface clean
        console.log('✅ Original tabs displayed - no additional sections added');
        
    } catch (error) {
        console.error('❌ Display error:', error);
    }
}

console.log('🔧 Clean web interface loaded - original tabs only, no enhancements');
