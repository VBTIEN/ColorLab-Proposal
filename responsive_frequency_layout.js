// Responsive Layout Fix for Color Frequency Analysis
console.log('📱 Responsive Frequency Layout Loading...');

// Override displayEnhancedColorFrequency with responsive design
function displayEnhancedColorFrequency(container, analysis) {
    console.log('📊 Creating responsive color frequency display...');
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Basic Statistics - Responsive Grid -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div class="flex items-center">
                        <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
                        <span>Frequency Statistics</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded self-start sm:self-auto">Enhanced</span>
                </h4>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-blue-600">${analysis.basic_stats.total_colors}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Total Colors</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-green-600">${analysis.basic_stats.average_frequency}%</div>
                        <div class="text-xs sm:text-sm text-gray-600">Avg Frequency</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-purple-600">${analysis.basic_stats.median_frequency}%</div>
                        <div class="text-xs sm:text-sm text-gray-600">Median</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-orange-600">${analysis.basic_stats.frequency_std_dev}%</div>
                        <div class="text-xs sm:text-sm text-gray-600">Std Dev</div>
                    </div>
                </div>
            </div>
            
            <!-- Distribution Analysis - Mobile Optimized -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border-l-4 border-green-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-line text-green-500 mr-2"></i>
                    Distribution Pattern
                </h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <h5 class="font-medium text-gray-700 mb-3 text-center sm:text-left">Pattern Analysis</h5>
                        <div class="space-y-2 sm:space-y-3">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Type:</span>
                                <span class="font-semibold capitalize text-sm">${analysis.distribution.type.replace('_', ' ')}</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Concentration:</span>
                                <span class="font-semibold capitalize text-sm">${analysis.distribution.concentration.replace('_', ' ')}</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Evenness:</span>
                                <span class="font-semibold text-sm">${analysis.distribution.evenness_index}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <h5 class="font-medium text-gray-700 mb-3 text-center sm:text-left">Coverage Analysis</h5>
                        <div class="space-y-2 sm:space-y-3">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Top 5 Coverage:</span>
                                <span class="font-semibold text-sm">${analysis.distribution.top_5_coverage}%</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Top 10 Coverage:</span>
                                <span class="font-semibold text-sm">${analysis.distribution.top_10_coverage}%</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Skewness:</span>
                                <span class="font-semibold text-sm">${analysis.distribution.skewness}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dominance Analysis - Mobile First Design -->
            ${analysis.dominance ? `
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-4 sm:p-6 rounded-xl border-l-4 border-purple-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-crown text-purple-500 mr-2"></i>
                    Color Dominance
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Dominant Color -->
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm order-1">
                        <div class="w-16 h-16 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.dominant_color.hex}"></div>
                        <div class="font-semibold text-gray-800 text-sm sm:text-base truncate" title="${analysis.dominance.dominant_color.name}">${analysis.dominance.dominant_color.name}</div>
                        <div class="text-lg sm:text-xl font-bold text-purple-600">${analysis.dominance.dominant_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Dominant</div>
                    </div>
                    
                    <!-- Secondary Color -->
                    ${analysis.dominance.secondary_color ? `
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm order-2">
                        <div class="w-16 h-16 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                        <div class="font-semibold text-gray-800 text-sm sm:text-base truncate" title="${analysis.dominance.secondary_color.name}">${analysis.dominance.secondary_color.name}</div>
                        <div class="text-lg sm:text-xl font-bold text-blue-600">${analysis.dominance.secondary_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Secondary</div>
                    </div>
                    ` : ''}
                    
                    <!-- Dominance Level -->
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm order-3 ${!analysis.dominance.secondary_color ? 'sm:col-span-2 lg:col-span-1' : ''}">
                        <div class="text-4xl sm:text-3xl lg:text-4xl mb-2">${getDominanceIcon(analysis.dominance.dominance_level)}</div>
                        <div class="font-semibold text-gray-800 capitalize text-sm sm:text-base">${analysis.dominance.dominance_level}</div>
                        <div class="text-lg sm:text-xl font-bold text-green-600">${analysis.dominance.dominance_ratio}x</div>
                        <div class="text-xs text-gray-500">Ratio</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Diversity Metrics - Responsive Cards -->
            ${analysis.diversity ? `
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 sm:p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                    Color Diversity
                </h4>
                
                <!-- Main Metrics -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-yellow-600">${analysis.diversity.effective_colors}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Effective Colors</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-orange-600">${analysis.diversity.shannon_index}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Shannon Index</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-red-600">${analysis.diversity.simpson_index}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Simpson Index</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-pink-600 capitalize">${analysis.diversity.diversity_level.replace('_', ' ')}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Diversity Level</div>
                    </div>
                </div>
                
                <!-- Secondary Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-xl font-bold text-blue-600">${analysis.diversity.common_colors_count}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Common Colors (>5%)</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-xl font-bold text-gray-600">${analysis.diversity.rare_colors_count}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Rare Colors (<1%)</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Frequency Visualization - Mobile Optimized -->
            <div class="bg-white p-4 sm:p-6 rounded-xl shadow-lg border">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-area text-indigo-500 mr-2"></i>
                    Frequency Distribution
                </h4>
                <div class="h-48 sm:h-64 lg:h-80">
                    <canvas id="frequencyChart" class="w-full h-full"></canvas>
                </div>
                <div class="mt-2 text-xs text-gray-500 text-center">
                    Interactive chart - Touch/click to explore data points
                </div>
            </div>
        </div>
    `;
    
    // Render frequency chart with responsive options
    setTimeout(() => {
        renderResponsiveFrequencyChart(analysis);
    }, 100);
}

function renderResponsiveFrequencyChart(analysis) {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas || !analysis.frequency_bins) return;
    
    const ctx = canvas.getContext('2d');
    
    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    
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
                    display: !isMobile, // Hide title on mobile to save space
                    text: 'Color Frequency Distribution',
                    font: {
                        size: isMobile ? 12 : 14
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: {
                        size: isMobile ? 11 : 12
                    },
                    bodyFont: {
                        size: isMobile ? 10 : 11
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: !isMobile,
                        text: 'Number of Colors',
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 9 : 11
                        }
                    }
                },
                x: {
                    title: {
                        display: !isMobile,
                        text: 'Frequency Range (%)',
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    },
                    ticks: {
                        font: {
                            size: isMobile ? 8 : 10
                        },
                        maxRotation: isMobile ? 45 : 0,
                        minRotation: isMobile ? 45 : 0
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

// Add responsive utilities
function addResponsiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile-first responsive adjustments for Color Frequency */
        @media (max-width: 640px) {
            .color-frequency-section .grid {
                gap: 0.75rem;
            }
            
            .color-frequency-section .text-center {
                padding: 0.75rem;
            }
            
            .color-frequency-section .truncate {
                max-width: 100px;
            }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
            .color-frequency-section .grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        
        @media (min-width: 1025px) {
            .color-frequency-section .lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            
            .color-frequency-section .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        
        /* Ensure proper spacing on all devices */
        .color-frequency-section {
            padding: 0.5rem;
        }
        
        @media (min-width: 640px) {
            .color-frequency-section {
                padding: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize responsive layout
document.addEventListener('DOMContentLoaded', function() {
    addResponsiveStyles();
    
    // Add responsive class to color frequency section
    setTimeout(() => {
        const colorFrequencyDiv = document.getElementById('colorFrequency');
        if (colorFrequencyDiv) {
            colorFrequencyDiv.classList.add('color-frequency-section');
        }
    }, 1000);
});

// Handle window resize for chart responsiveness
window.addEventListener('resize', function() {
    setTimeout(() => {
        const chart = Chart.getChart('frequencyChart');
        if (chart) {
            chart.resize();
        }
    }, 100);
});

console.log('📱 Responsive Frequency Layout loaded successfully');
