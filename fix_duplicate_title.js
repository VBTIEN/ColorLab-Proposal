// Fix Duplicate Color Frequency Analysis Title
console.log('🔧 Fixing duplicate title issue...');

// Override the displayColorFrequency to prevent duplicate titles
window.displayColorFrequency = function(colorFrequency) {
    console.log('🎨 Fixed displayColorFrequency called');
    
    const colorFrequencyDiv = document.getElementById('colorFrequency');
    if (!colorFrequencyDiv) {
        console.error('❌ Color frequency div not found');
        return;
    }
    
    // Clear any existing content first to prevent duplicates
    colorFrequencyDiv.innerHTML = '';
    
    try {
        // Generate analysis data
        const enhancedAnalysis = generateUltimateAnalysis(colorFrequency);
        
        // Create layout WITHOUT duplicate header (parent already has title)
        createFixedColorFrequencyLayout(colorFrequencyDiv, enhancedAnalysis);
        
        console.log('✅ Fixed layout created without duplicate title');
        
    } catch (error) {
        console.error('❌ Fixed layout error:', error);
        createSimpleFallback(colorFrequencyDiv, colorFrequency);
    }
};

// New layout function WITHOUT header duplication
function createFixedColorFrequencyLayout(container, analysis) {
    console.log('🎨 Creating fixed layout without duplicate title...');
    
    container.innerHTML = `
        <div class="w-full max-w-7xl mx-auto px-4 space-y-8">
            
            <!-- Status Indicators Only (No duplicate title) -->
            <div class="flex justify-center items-center gap-3 flex-wrap mb-6">
                <span class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                    ✅ Fixed Layout
                </span>
                <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                    ⚡ No Duplicates
                </span>
                <span class="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                    🎯 Optimized
                </span>
            </div>
            
            <!-- Core Statistics -->
            <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-100">
                <h4 class="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                    <i class="fas fa-calculator text-blue-600"></i>
                    Frequency Statistics
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
                        <div class="text-4xl font-bold text-blue-600 mb-3">${analysis.basic_stats.total_colors}</div>
                        <div class="text-gray-700 font-semibold">Total Colors</div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
                        <div class="text-4xl font-bold text-green-600 mb-3">${analysis.basic_stats.average_frequency}%</div>
                        <div class="text-gray-700 font-semibold">Average Freq</div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
                        <div class="text-4xl font-bold text-purple-600 mb-3">${analysis.basic_stats.total_pixels.toLocaleString()}</div>
                        <div class="text-gray-700 font-semibold">Total Pixels</div>
                    </div>
                    <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
                        <div class="text-4xl font-bold text-orange-600 mb-3">${analysis.basic_stats.color_density}</div>
                        <div class="text-gray-700 font-semibold">Color Density</div>
                    </div>
                </div>
            </div>
            
            <!-- Distribution & Dominance -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl">
                    <h4 class="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                        <i class="fas fa-chart-line text-green-600"></i>
                        Distribution Pattern
                    </h4>
                    <div class="space-y-4">
                        <div class="bg-white rounded-xl p-5 flex justify-between items-center shadow-md">
                            <span class="text-gray-700 font-semibold">Type:</span>
                            <span class="font-bold text-green-600 capitalize">${analysis.distribution.type}</span>
                        </div>
                        <div class="bg-white rounded-xl p-5 flex justify-between items-center shadow-md">
                            <span class="text-gray-700 font-semibold">Concentration:</span>
                            <span class="font-bold text-green-600 capitalize">${analysis.distribution.concentration}</span>
                        </div>
                        <div class="bg-white rounded-xl p-5 flex justify-between items-center shadow-md">
                            <span class="text-gray-700 font-semibold">Top 5 Coverage:</span>
                            <span class="font-bold text-green-600">${analysis.distribution.top_5_coverage}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-8 shadow-xl">
                    <h4 class="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                        <i class="fas fa-crown text-purple-600"></i>
                        Color Dominance
                    </h4>
                    <div class="space-y-4">
                        <div class="bg-white rounded-xl p-5 flex items-center justify-between shadow-md">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg" 
                                     style="background-color: ${analysis.dominance.dominant_color.hex}"></div>
                                <span class="font-semibold">${analysis.dominance.dominant_color.name}</span>
                            </div>
                            <span class="font-bold text-purple-600 text-xl">${analysis.dominance.dominant_color.percentage}%</span>
                        </div>
                        <div class="bg-white rounded-xl p-5 flex items-center justify-between shadow-md">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full border-3 border-white shadow-lg" 
                                     style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                                <span class="font-semibold">${analysis.dominance.secondary_color.name}</span>
                            </div>
                            <span class="font-bold text-blue-600 text-xl">${analysis.dominance.secondary_color.percentage}%</span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

function createSimpleFallback(container, colorFrequency) {
    container.innerHTML = `
        <div class="w-full max-w-4xl mx-auto px-4">
            <div class="bg-gray-50 rounded-2xl p-8 text-center">
                <div class="text-4xl font-bold text-blue-600 mb-2">${colorFrequency?.unique_colors || 0}</div>
                <div class="text-gray-700">Unique Colors Detected</div>
                <div class="mt-4">
                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✅ Fixed</span>
                </div>
            </div>
        </div>
    `;
}

console.log('🔧 Duplicate title fix loaded');
