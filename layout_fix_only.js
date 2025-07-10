// Layout Fix Only - Remove 2-column split and arrange blocks properly
console.log('🔧 Layout Fix Only Loading...');

// Override only the layout part of displayPCOptimizedColorFrequency
function displayPCOptimizedColorFrequency(container, analysis) {
    console.log('📊 Creating layout-fixed color frequency display...');
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Basic Statistics - Full width, 4 columns on desktop -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
                        <span>Frequency Statistics</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">PC Enhanced</span>
                </h4>
                <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-blue-600">${analysis.basic_stats?.total_colors || 0}</div>
                        <div class="text-sm text-gray-600">Total Colors</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-green-600">${analysis.basic_stats?.average_frequency || 0}%</div>
                        <div class="text-sm text-gray-600">Avg Frequency</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-purple-600">${analysis.basic_stats?.median_frequency || 0}%</div>
                        <div class="text-sm text-gray-600">Median</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-orange-600">${analysis.basic_stats?.frequency_std_dev || 0}%</div>
                        <div class="text-sm text-gray-600">Std Dev</div>
                    </div>
                </div>
            </div>
            
            <!-- Distribution Analysis - Full width, 2 columns side by side -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-line text-green-500 mr-2"></i>
                    Distribution Pattern
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <h5 class="font-medium text-gray-700 mb-3">Pattern Analysis</h5>
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
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <h5 class="font-medium text-gray-700 mb-3">Coverage Analysis</h5>
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
            
            <!-- Color Dominance - Full width section -->
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-crown text-purple-500 mr-2"></i>
                    Color Dominance
                </h4>
                ${analysis.dominance ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Dominant Color -->
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.dominant_color?.hex || '#666'}"></div>
                        <div class="font-semibold text-gray-800 text-sm truncate" title="${analysis.dominance.dominant_color?.name || 'Color'}">${analysis.dominance.dominant_color?.name || 'Color'}</div>
                        <div class="text-xl font-bold text-purple-600">${analysis.dominance.dominant_color?.percentage || 0}%</div>
                        <div class="text-xs text-gray-500">Dominant</div>
                    </div>
                    
                    <!-- Secondary Color -->
                    ${analysis.dominance.secondary_color ? `
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                        <div class="font-semibold text-gray-800 text-sm truncate" title="${analysis.dominance.secondary_color.name}">${analysis.dominance.secondary_color.name}</div>
                        <div class="text-xl font-bold text-blue-600">${analysis.dominance.secondary_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Secondary</div>
                    </div>
                    ` : ''}
                    
                    <!-- Dominance Level -->
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm ${!analysis.dominance.secondary_color ? 'sm:col-span-2 lg:col-span-2' : ''}">
                        <div class="text-4xl mb-3">${getDominanceIcon(analysis.dominance.dominance_level)}</div>
                        <div class="font-semibold text-gray-800 capitalize">${analysis.dominance.dominance_level || 'balanced'}</div>
                        <div class="text-xl font-bold text-green-600">${analysis.dominance.dominance_ratio || 1}x</div>
                        <div class="text-xs text-gray-500">Ratio</div>
                    </div>
                </div>
                ` : `
                <div class="text-center p-8 bg-white rounded-lg shadow-sm">
                    <div class="text-gray-500">No dominance data available</div>
                </div>
                `}
            </div>
            
            <!-- Color Diversity - Full width section -->
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                    Color Diversity
                </h4>
                
                ${analysis.diversity ? `
                <!-- Main Metrics - 4 columns on desktop, 2 on mobile -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-yellow-600">${analysis.diversity.effective_colors || 0}</div>
                        <div class="text-sm text-gray-600">Effective Colors</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-orange-600">${analysis.diversity.shannon_index || 0}</div>
                        <div class="text-sm text-gray-600">Shannon Index</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-red-600">${analysis.diversity.simpson_index || 0}</div>
                        <div class="text-sm text-gray-600">Simpson Index</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-2xl font-bold text-pink-600 capitalize">${(analysis.diversity.diversity_level || 'moderate').replace('_', ' ')}</div>
                        <div class="text-sm text-gray-600">Diversity Level</div>
                    </div>
                </div>
                
                <!-- Secondary Metrics - 2 columns -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-xl font-bold text-blue-600">${analysis.diversity.common_colors_count || 0}</div>
                        <div class="text-sm text-gray-600">Common Colors (>5%)</div>
                    </div>
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-xl font-bold text-gray-600">${analysis.diversity.rare_colors_count || 0}</div>
                        <div class="text-sm text-gray-600">Rare Colors (<1%)</div>
                    </div>
                </div>
                ` : `
                <div class="text-center p-8 bg-white rounded-lg shadow-sm">
                    <div class="text-gray-500">No diversity data available</div>
                </div>
                `}
            </div>
            
            <!-- Frequency Visualization - Full width -->
            <div class="bg-white p-6 rounded-xl shadow-lg border">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-area text-indigo-500 mr-2"></i>
                    Frequency Distribution
                </h4>
                <div class="h-80">
                    <canvas id="frequencyChart" class="w-full h-full"></canvas>
                </div>
                <div class="mt-2 text-xs text-gray-500 text-center">
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

// Add CSS to ensure proper full-width layout
function addLayoutFixStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Layout Fix - Ensure full width sections */
        #colorFrequency {
            width: 100% !important;
            max-width: none !important;
        }
        
        #colorFrequency .space-y-6 {
            width: 100% !important;
        }
        
        #colorFrequency .space-y-6 > div {
            width: 100% !important;
            max-width: none !important;
        }
        
        /* Prevent any unwanted column layouts */
        #colorFrequency .grid {
            width: 100% !important;
        }
        
        /* Ensure proper spacing */
        @media (min-width: 1024px) {
            #colorFrequency .lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            
            #colorFrequency .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            
            #colorFrequency .lg\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        
        @media (min-width: 1280px) {
            #colorFrequency .xl\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize layout fix
document.addEventListener('DOMContentLoaded', function() {
    addLayoutFixStyles();
    console.log('✅ Layout fix styles applied');
});

console.log('🔧 Layout Fix Only loaded successfully');
