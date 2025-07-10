// Spacing Fix - Prevent blocks from overlapping
console.log('📏 Spacing Fix Loading...');

// Override displayPCOptimizedColorFrequency with proper spacing
function displayPCOptimizedColorFrequency(container, analysis) {
    console.log('📊 Creating properly spaced color frequency display...');
    
    container.innerHTML = `
        <div class="w-full space-y-8 px-4">
            <!-- Basic Statistics - Proper spacing -->
            <div class="w-full bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
                        <span>Frequency Statistics</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Spaced</span>
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-blue-600 mb-2">${analysis.basic_stats?.total_colors || 0}</div>
                        <div class="text-sm text-gray-600">Total Colors</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-green-600 mb-2">${analysis.basic_stats?.average_frequency || 0}%</div>
                        <div class="text-sm text-gray-600">Avg Frequency</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-purple-600 mb-2">${analysis.basic_stats?.median_frequency || 0}%</div>
                        <div class="text-sm text-gray-600">Median</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-orange-600 mb-2">${analysis.basic_stats?.frequency_std_dev || 0}%</div>
                        <div class="text-sm text-gray-600">Std Dev</div>
                    </div>
                </div>
            </div>
            
            <!-- Distribution Analysis - Proper spacing -->
            <div class="w-full bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <i class="fas fa-chart-line text-green-500 mr-2"></i>
                    Distribution Pattern
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm min-h-[180px]">
                        <h5 class="font-medium text-gray-700 mb-4 text-center">Pattern Analysis</h5>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Type:</span>
                                <span class="font-semibold capitalize">${(analysis.distribution?.type || 'balanced').replace('_', ' ')}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Concentration:</span>
                                <span class="font-semibold capitalize">${(analysis.distribution?.concentration || 'moderate').replace('_', ' ')}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Evenness:</span>
                                <span class="font-semibold">${analysis.distribution?.evenness_index || 0.5}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm min-h-[180px]">
                        <h5 class="font-medium text-gray-700 mb-4 text-center">Coverage Analysis</h5>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Top 5 Coverage:</span>
                                <span class="font-semibold">${analysis.distribution?.top_5_coverage || 50}%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Top 10 Coverage:</span>
                                <span class="font-semibold">${analysis.distribution?.top_10_coverage || 70}%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Skewness:</span>
                                <span class="font-semibold">${analysis.distribution?.skewness || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Color Dominance - Proper spacing -->
            <div class="w-full bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
                    <i class="fas fa-crown text-purple-500 mr-2"></i>
                    Color Dominance
                </h4>
                ${analysis.dominance ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <!-- Dominant Color -->
                    <div class="text-center p-6 bg-white rounded-lg shadow-sm min-h-[200px] flex flex-col justify-center">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.dominant_color?.hex || '#666'}"></div>
                        <div class="font-semibold text-gray-800 mb-2 truncate" title="${analysis.dominance.dominant_color?.name || 'Color'}">${analysis.dominance.dominant_color?.name || 'Color'}</div>
                        <div class="text-xl font-bold text-purple-600 mb-1">${analysis.dominance.dominant_color?.percentage || 0}%</div>
                        <div class="text-xs text-gray-500">Dominant</div>
                    </div>
                    
                    <!-- Secondary Color -->
                    ${analysis.dominance.secondary_color ? `
                    <div class="text-center p-6 bg-white rounded-lg shadow-sm min-h-[200px] flex flex-col justify-center">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                        <div class="font-semibold text-gray-800 mb-2 truncate" title="${analysis.dominance.secondary_color.name}">${analysis.dominance.secondary_color.name}</div>
                        <div class="text-xl font-bold text-blue-600 mb-1">${analysis.dominance.secondary_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Secondary</div>
                    </div>
                    ` : ''}
                    
                    <!-- Dominance Level -->
                    <div class="text-center p-6 bg-white rounded-lg shadow-sm min-h-[200px] flex flex-col justify-center ${!analysis.dominance.secondary_color ? 'sm:col-span-2 lg:col-span-1' : ''}">
                        <div class="text-4xl mb-4">${getDominanceIcon(analysis.dominance.dominance_level)}</div>
                        <div class="font-semibold text-gray-800 capitalize mb-2">${analysis.dominance.dominance_level || 'balanced'}</div>
                        <div class="text-xl font-bold text-green-600 mb-1">${analysis.dominance.dominance_ratio || 1}x</div>
                        <div class="text-xs text-gray-500">Ratio</div>
                    </div>
                </div>
                ` : `
                <div class="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto">
                    <div class="text-gray-500">No dominance data available</div>
                </div>
                `}
            </div>
            
            <!-- Color Diversity - Proper spacing -->
            <div class="w-full bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
                    <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                    Color Diversity
                </h4>
                
                ${analysis.diversity ? `
                <!-- Main Metrics - Proper spacing -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-yellow-600 mb-2">${analysis.diversity.effective_colors || 0}</div>
                        <div class="text-sm text-gray-600">Effective Colors</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-orange-600 mb-2">${analysis.diversity.shannon_index || 0}</div>
                        <div class="text-sm text-gray-600">Shannon Index</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-red-600 mb-2">${analysis.diversity.simpson_index || 0}</div>
                        <div class="text-sm text-gray-600">Simpson Index</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-2xl font-bold text-pink-600 capitalize mb-2">${(analysis.diversity.diversity_level || 'moderate').replace('_', ' ')}</div>
                        <div class="text-sm text-gray-600">Diversity Level</div>
                    </div>
                </div>
                
                <!-- Secondary Metrics - Proper spacing -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div class="text-center p-6 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-xl font-bold text-blue-600 mb-2">${analysis.diversity.common_colors_count || 0}</div>
                        <div class="text-sm text-gray-600">Common Colors (>5%)</div>
                    </div>
                    <div class="text-center p-6 bg-white rounded-lg shadow-sm min-h-[120px] flex flex-col justify-center">
                        <div class="text-xl font-bold text-gray-600 mb-2">${analysis.diversity.rare_colors_count || 0}</div>
                        <div class="text-sm text-gray-600">Rare Colors (<1%)</div>
                    </div>
                </div>
                ` : `
                <div class="text-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto">
                    <div class="text-gray-500">No diversity data available</div>
                </div>
                `}
            </div>
            
            <!-- Frequency Visualization - Proper spacing -->
            <div class="w-full bg-white p-6 rounded-xl shadow-lg border">
                <h4 class="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
                    <i class="fas fa-chart-area text-indigo-500 mr-2"></i>
                    Frequency Distribution
                </h4>
                <div class="w-full h-80 max-w-6xl mx-auto">
                    <canvas id="frequencyChart" class="w-full h-full"></canvas>
                </div>
                <div class="mt-4 text-xs text-gray-500 text-center">
                    Interactive chart - Click to explore data points
                </div>
            </div>
        </div>
    `;
    
    // Render frequency chart
    setTimeout(() => {
        renderPCOptimizedFrequencyChart(analysis);
    }, 100);
}

// Add spacing fix CSS
function addSpacingFixStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Spacing Fix - Prevent overlapping */
        #colorFrequency {
            width: 100% !important;
            overflow: visible !important;
        }
        
        #colorFrequency .space-y-8 > * + * {
            margin-top: 2rem !important;
        }
        
        /* Ensure minimum heights */
        #colorFrequency .min-h-\\[120px\\] {
            min-height: 120px !important;
        }
        
        #colorFrequency .min-h-\\[180px\\] {
            min-height: 180px !important;
        }
        
        #colorFrequency .min-h-\\[200px\\] {
            min-height: 200px !important;
        }
        
        /* Grid spacing */
        #colorFrequency .gap-6 {
            gap: 1.5rem !important;
        }
        
        #colorFrequency .gap-8 {
            gap: 2rem !important;
        }
        
        /* Prevent grid collapse */
        #colorFrequency .grid {
            display: grid !important;
            width: 100% !important;
        }
        
        /* Card spacing */
        #colorFrequency .bg-white {
            margin-bottom: 0 !important;
            position: relative !important;
            z-index: 1 !important;
        }
        
        /* Responsive adjustments */
        @media (min-width: 1024px) {
            #colorFrequency .lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }
            
            #colorFrequency .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }
            
            #colorFrequency .lg\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
        }
        
        @media (min-width: 640px) {
            #colorFrequency .sm\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
        }
        
        /* Ensure proper container width */
        #colorFrequency .max-w-5xl {
            max-width: 64rem !important;
        }
        
        #colorFrequency .max-w-3xl {
            max-width: 48rem !important;
        }
        
        #colorFrequency .max-w-6xl {
            max-width: 72rem !important;
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize spacing fix
document.addEventListener('DOMContentLoaded', function() {
    addSpacingFixStyles();
    console.log('✅ Spacing fix styles applied');
});

console.log('📏 Spacing Fix loaded successfully');
