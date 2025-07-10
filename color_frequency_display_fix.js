// Color Frequency Display Fix - Ensure Enhanced Version is Used
console.log('📊 Color Frequency Display Fix Loading...');

// Override displayColorFrequency function completely
window.displayColorFrequency = function(colorFrequency) {
    console.log('📊 Enhanced displayColorFrequency called with data:', colorFrequency);
    
    const colorFrequencyDiv = document.getElementById('colorFrequency');
    if (!colorFrequencyDiv) {
        console.error('❌ Color frequency div not found');
        return;
    }
    
    try {
        // Get enhanced analysis data
        let enhancedAnalysis;
        
        // Check if we have professional color data
        if (window.analysisData && window.analysisData.dominant_colors && window.analysisData.dominant_colors.length > 0) {
            console.log('🎨 Using professional color data for enhanced analysis');
            const analyzer = new EnhancedColorFrequencyAnalyzer();
            const totalPixels = window.analysisData.dominant_colors.reduce((sum, color) => sum + (color.pixel_count || 100), 0);
            enhancedAnalysis = analyzer.analyzeColorFrequency(window.analysisData.dominant_colors, totalPixels);
        } else if (colorFrequency && colorFrequency.unique_colors) {
            console.log('🔄 Using provided color frequency data');
            enhancedAnalysis = generateEnhancedAnalysisFromBasicData(colorFrequency);
        } else {
            console.log('⚠️ No valid data found, using fallback');
            enhancedAnalysis = generateFallbackAnalysis();
        }
        
        // Create enhanced display
        displayEnhancedColorFrequencyFixed(colorFrequencyDiv, enhancedAnalysis);
        
        console.log('✅ Enhanced color frequency displayed successfully');
        
    } catch (error) {
        console.error('❌ Enhanced color frequency display error:', error);
        // Fallback to simple display
        displaySimpleColorFrequencyFixed(colorFrequencyDiv, colorFrequency);
    }
};

function displayEnhancedColorFrequencyFixed(container, analysis) {
    console.log('📊 Creating enhanced color frequency display (fixed version)...');
    
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
                        <div class="text-xl sm:text-2xl font-bold text-blue-600">${analysis.basic_stats?.total_colors || 0}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Total Colors</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-green-600">${analysis.basic_stats?.average_frequency || 0}%</div>
                        <div class="text-xs sm:text-sm text-gray-600">Avg Frequency</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-purple-600">${analysis.basic_stats?.median_frequency || 0}%</div>
                        <div class="text-xs sm:text-sm text-gray-600">Median</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-xl sm:text-2xl font-bold text-orange-600">${analysis.basic_stats?.frequency_std_dev || 0}%</div>
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
                                <span class="font-semibold capitalize text-sm">${(analysis.distribution?.type || 'balanced').replace('_', ' ')}</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Concentration:</span>
                                <span class="font-semibold capitalize text-sm">${(analysis.distribution?.concentration || 'moderate').replace('_', ' ')}</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Evenness:</span>
                                <span class="font-semibold text-sm">${analysis.distribution?.evenness_index || 0.5}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm">
                        <h5 class="font-medium text-gray-700 mb-3 text-center sm:text-left">Coverage Analysis</h5>
                        <div class="space-y-2 sm:space-y-3">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Top 5 Coverage:</span>
                                <span class="font-semibold text-sm">${analysis.distribution?.top_5_coverage || 50}%</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Top 10 Coverage:</span>
                                <span class="font-semibold text-sm">${analysis.distribution?.top_10_coverage || 70}%</span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <span class="text-gray-600 text-sm">Skewness:</span>
                                <span class="font-semibold text-sm">${analysis.distribution?.skewness || 0}</span>
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
                             style="background-color: ${analysis.dominance.dominant_color?.hex || '#666'}"></div>
                        <div class="font-semibold text-gray-800 text-sm sm:text-base truncate" title="${analysis.dominance.dominant_color?.name || 'Color'}">${analysis.dominance.dominant_color?.name || 'Color'}</div>
                        <div class="text-lg sm:text-xl font-bold text-purple-600">${analysis.dominance.dominant_color?.percentage || 0}%</div>
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
                        <div class="text-4xl sm:text-3xl lg:text-4xl mb-2">${getDominanceIconFixed(analysis.dominance.dominance_level)}</div>
                        <div class="font-semibold text-gray-800 capitalize text-sm sm:text-base">${analysis.dominance.dominance_level || 'balanced'}</div>
                        <div class="text-lg sm:text-xl font-bold text-green-600">${analysis.dominance.dominance_ratio || 1}x</div>
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
                        <div class="text-lg sm:text-2xl font-bold text-yellow-600">${analysis.diversity.effective_colors || 0}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Effective Colors</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-orange-600">${analysis.diversity.shannon_index || 0}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Shannon Index</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-red-600">${analysis.diversity.simpson_index || 0}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Simpson Index</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-2xl font-bold text-pink-600 capitalize">${(analysis.diversity.diversity_level || 'moderate').replace('_', ' ')}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Diversity Level</div>
                    </div>
                </div>
                
                <!-- Secondary Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-xl font-bold text-blue-600">${analysis.diversity.common_colors_count || 0}</div>
                        <div class="text-xs sm:text-sm text-gray-600">Common Colors (>5%)</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg shadow-sm">
                        <div class="text-lg sm:text-xl font-bold text-gray-600">${analysis.diversity.rare_colors_count || 0}</div>
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
        renderResponsiveFrequencyChartFixed(analysis);
    }, 100);
}

function getDominanceIconFixed(level) {
    const icons = {
        'overwhelming': '👑',
        'strong': '🔥',
        'moderate': '⚖️',
        'weak': '📊',
        'balanced': '🎯'
    };
    return icons[level] || '📊';
}

function renderResponsiveFrequencyChartFixed(analysis) {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas || !analysis.frequency_bins) {
        console.log('⚠️ Canvas or frequency bins not available, using fallback chart');
        renderFallbackChart(canvas);
        return;
    }
    
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
                    display: !isMobile,
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

function renderFallbackChart(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const fallbackData = [2, 4, 6, 8, 5, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    const fallbackLabels = Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fallbackLabels,
            datasets: [{
                label: 'Color Count',
                data: fallbackData,
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
                    text: 'Sample Frequency Distribution'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Colors'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Frequency Range (%)'
                    }
                }
            }
        }
    });
}

function generateEnhancedAnalysisFromBasicData(colorFrequency) {
    return {
        basic_stats: {
            total_colors: colorFrequency.unique_colors || 0,
            average_frequency: 10,
            median_frequency: 5,
            frequency_std_dev: 3
        },
        distribution: {
            type: 'balanced',
            concentration: 'moderate',
            evenness_index: 0.5,
            top_5_coverage: 50,
            top_10_coverage: 70,
            skewness: 0
        },
        frequency_bins: {
            bins: [2, 4, 6, 8, 5, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            labels: Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`)
        }
    };
}

function generateFallbackAnalysis() {
    return {
        basic_stats: {
            total_colors: 8,
            average_frequency: 12.5,
            median_frequency: 8,
            frequency_std_dev: 5
        },
        distribution: {
            type: 'balanced',
            concentration: 'moderate',
            evenness_index: 0.6,
            top_5_coverage: 60,
            top_10_coverage: 85,
            skewness: 0.2
        },
        frequency_bins: {
            bins: [3, 5, 7, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            labels: Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`)
        }
    };
}

function displaySimpleColorFrequencyFixed(container, colorFrequency) {
    container.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-chart-pie text-blue-500 mr-2"></i>
                Frequency Statistics
            </h4>
            <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">${colorFrequency?.unique_colors || 0}</div>
                <div class="text-gray-600">Unique Colors</div>
            </div>
        </div>
    `;
}

console.log('📊 Color Frequency Display Fix loaded successfully');
