// PC Layout Fix for Color Frequency Analysis - Desktop Optimization
console.log('💻 PC Layout Fix Loading...');

// Override displayEnhancedColorFrequencyFixed with better PC layout
function displayEnhancedColorFrequencyFixed(container, analysis) {
    console.log('📊 Creating PC-optimized color frequency display...');
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Basic Statistics - PC Optimized: Always 4 columns on desktop -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
                        <span>Frequency Statistics</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Enhanced</span>
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
            
            <!-- Distribution Analysis - PC: Side by side layout -->
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
            
            <!-- Combined Row: Dominance + Diversity for PC -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <!-- Dominance Analysis - Compact for PC -->
                ${analysis.dominance ? `
                <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border-l-4 border-purple-500">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-crown text-purple-500 mr-2"></i>
                        Color Dominance
                    </h4>
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <!-- Dominant Color -->
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-white shadow-lg" 
                                 style="background-color: ${analysis.dominance.dominant_color?.hex || '#666'}"></div>
                            <div class="font-semibold text-gray-800 text-sm truncate" title="${analysis.dominance.dominant_color?.name || 'Color'}">${analysis.dominance.dominant_color?.name || 'Color'}</div>
                            <div class="text-lg font-bold text-purple-600">${analysis.dominance.dominant_color?.percentage || 0}%</div>
                            <div class="text-xs text-gray-500">Dominant</div>
                        </div>
                        
                        <!-- Secondary Color -->
                        ${analysis.dominance.secondary_color ? `
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-white shadow-lg" 
                                 style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                            <div class="font-semibold text-gray-800 text-sm truncate" title="${analysis.dominance.secondary_color.name}">${analysis.dominance.secondary_color.name}</div>
                            <div class="text-lg font-bold text-blue-600">${analysis.dominance.secondary_color.percentage}%</div>
                            <div class="text-xs text-gray-500">Secondary</div>
                        </div>
                        ` : ''}
                        
                        <!-- Dominance Level -->
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm ${!analysis.dominance.secondary_color ? 'lg:col-span-2' : ''}">
                            <div class="text-3xl mb-2">${getDominanceIconFixed(analysis.dominance.dominance_level)}</div>
                            <div class="font-semibold text-gray-800 capitalize text-sm">${analysis.dominance.dominance_level || 'balanced'}</div>
                            <div class="text-lg font-bold text-green-600">${analysis.dominance.dominance_ratio || 1}x</div>
                            <div class="text-xs text-gray-500">Ratio</div>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- Diversity Metrics - Compact for PC -->
                ${analysis.diversity ? `
                <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                        Color Diversity
                    </h4>
                    
                    <!-- Main Metrics - 2x2 grid for PC -->
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-xl font-bold text-yellow-600">${analysis.diversity.effective_colors || 0}</div>
                            <div class="text-xs text-gray-600">Effective Colors</div>
                        </div>
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-xl font-bold text-orange-600">${analysis.diversity.shannon_index || 0}</div>
                            <div class="text-xs text-gray-600">Shannon Index</div>
                        </div>
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-xl font-bold text-red-600">${analysis.diversity.simpson_index || 0}</div>
                            <div class="text-xs text-gray-600">Simpson Index</div>
                        </div>
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-xl font-bold text-pink-600 capitalize">${(analysis.diversity.diversity_level || 'moderate').replace('_', ' ')}</div>
                            <div class="text-xs text-gray-600">Diversity Level</div>
                        </div>
                    </div>
                    
                    <!-- Secondary Metrics - 1x2 grid -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-lg font-bold text-blue-600">${analysis.diversity.common_colors_count || 0}</div>
                            <div class="text-xs text-gray-600">Common Colors (>5%)</div>
                        </div>
                        <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                            <div class="text-lg font-bold text-gray-600">${analysis.diversity.rare_colors_count || 0}</div>
                            <div class="text-xs text-gray-600">Rare Colors (<1%)</div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Frequency Visualization - Full width for PC -->
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
    
    // Render frequency chart with PC optimization
    setTimeout(() => {
        renderPCOptimizedFrequencyChart(analysis);
    }, 100);
}

function renderPCOptimizedFrequencyChart(analysis) {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas || !analysis.frequency_bins) {
        console.log('⚠️ Canvas or frequency bins not available, using fallback chart');
        renderFallbackChart(canvas);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: analysis.frequency_bins.labels,
            datasets: [{
                label: 'Color Count',
                data: analysis.frequency_bins.bins,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Color Frequency Distribution',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Colors',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Frequency Range (%)',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Add PC-specific CSS optimizations
function addPCLayoutStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* PC Layout Optimizations for Color Frequency */
        @media (min-width: 1280px) {
            .color-frequency-section .xl\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            
            .color-frequency-section .xl\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            /* Ensure proper spacing on large screens */
            .color-frequency-section .space-y-6 > * + * {
                margin-top: 1.5rem;
            }
            
            /* Optimize card heights for PC */
            .color-frequency-section .bg-white.rounded-lg {
                min-height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
        
        @media (min-width: 1024px) {
            /* Ensure side-by-side layouts work properly */
            .color-frequency-section .lg\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .color-frequency-section .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        
        /* Remove excessive vertical spacing on PC */
        @media (min-width: 768px) {
            .color-frequency-section .space-y-6 {
                gap: 1.5rem;
                display: flex;
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize PC layout optimizations
document.addEventListener('DOMContentLoaded', function() {
    addPCLayoutStyles();
    
    // Add PC-optimized class to color frequency section
    setTimeout(() => {
        const colorFrequencyDiv = document.getElementById('colorFrequency');
        if (colorFrequencyDiv) {
            colorFrequencyDiv.classList.add('color-frequency-section');
        }
    }, 1000);
});

console.log('💻 PC Layout Fix loaded successfully');
