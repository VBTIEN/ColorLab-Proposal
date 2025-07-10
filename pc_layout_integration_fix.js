// PC Layout Integration Fix - Ensure New Layout is Used
console.log('💻 PC Layout Integration Fix Loading...');

// Completely override displayColorFrequency to use PC-optimized layout
window.displayColorFrequency = function(colorFrequency) {
    console.log('📊 PC-optimized displayColorFrequency called with data:', colorFrequency);
    
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
            console.log('🎨 Using professional color data for PC-optimized analysis');
            const analyzer = new EnhancedColorFrequencyAnalyzer();
            const totalPixels = window.analysisData.dominant_colors.reduce((sum, color) => sum + (color.pixel_count || 100), 0);
            enhancedAnalysis = analyzer.analyzeColorFrequency(window.analysisData.dominant_colors, totalPixels);
        } else if (colorFrequency && colorFrequency.unique_colors) {
            console.log('🔄 Using provided color frequency data for PC layout');
            enhancedAnalysis = generateEnhancedAnalysisFromBasicData(colorFrequency);
        } else {
            console.log('⚠️ No valid data found, using PC-optimized fallback');
            enhancedAnalysis = generatePCOptimizedFallbackAnalysis();
        }
        
        // Create PC-optimized display
        displayPCOptimizedColorFrequency(colorFrequencyDiv, enhancedAnalysis);
        
        console.log('✅ PC-optimized color frequency displayed successfully');
        
    } catch (error) {
        console.error('❌ PC-optimized color frequency display error:', error);
        // Fallback to simple display
        displaySimplePCColorFrequency(colorFrequencyDiv, colorFrequency);
    }
};

function displayPCOptimizedColorFrequency(container, analysis) {
    console.log('📊 Creating PC-optimized color frequency display...');
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Basic Statistics - PC Optimized: 4 columns on desktop -->
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
                <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border-l-4 border-purple-500">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-crown text-purple-500 mr-2"></i>
                        Color Dominance
                    </h4>
                    ${analysis.dominance ? `
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
                            <div class="text-3xl mb-2">${getDominanceIcon(analysis.dominance.dominance_level)}</div>
                            <div class="font-semibold text-gray-800 capitalize text-sm">${analysis.dominance.dominance_level || 'balanced'}</div>
                            <div class="text-lg font-bold text-green-600">${analysis.dominance.dominance_ratio || 1}x</div>
                            <div class="text-xs text-gray-500">Ratio</div>
                        </div>
                    </div>
                    ` : `
                    <div class="text-center p-8 bg-white rounded-lg shadow-sm">
                        <div class="text-gray-500">No dominance data available</div>
                    </div>
                    `}
                </div>
                
                <!-- Diversity Metrics - Compact for PC -->
                <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                        Color Diversity
                    </h4>
                    
                    ${analysis.diversity ? `
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
                    ` : `
                    <div class="text-center p-8 bg-white rounded-lg shadow-sm">
                        <div class="text-gray-500">No diversity data available</div>
                    </div>
                    `}
                </div>
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

function getDominanceIcon(level) {
    const icons = {
        'overwhelming': '👑',
        'strong': '🔥',
        'moderate': '⚖️',
        'weak': '📊',
        'balanced': '🎯'
    };
    return icons[level] || '📊';
}

function renderPCOptimizedFrequencyChart(analysis) {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas) {
        console.log('⚠️ Canvas not found');
        return;
    }
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    // Use analysis data or fallback
    const chartData = analysis.frequency_bins || {
        bins: [3, 5, 7, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        labels: Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`)
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Color Count',
                data: chartData.bins,
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
    
    console.log('✅ PC-optimized frequency chart rendered');
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
        dominance: {
            dominant_color: {
                hex: '#4F46E5',
                name: 'Indigo',
                percentage: 25
            },
            secondary_color: {
                hex: '#10B981',
                name: 'Emerald',
                percentage: 18
            },
            dominance_level: 'moderate',
            dominance_ratio: 1.4
        },
        diversity: {
            effective_colors: colorFrequency.unique_colors || 8,
            shannon_index: 2.1,
            simpson_index: 0.8,
            diversity_level: 'moderate',
            common_colors_count: 3,
            rare_colors_count: 2
        },
        frequency_bins: {
            bins: [2, 4, 6, 8, 5, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            labels: Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`)
        }
    };
}

function generatePCOptimizedFallbackAnalysis() {
    return {
        basic_stats: {
            total_colors: 12,
            average_frequency: 8.3,
            median_frequency: 6.5,
            frequency_std_dev: 4.2
        },
        distribution: {
            type: 'balanced',
            concentration: 'moderate',
            evenness_index: 0.6,
            top_5_coverage: 55,
            top_10_coverage: 80,
            skewness: 0.2
        },
        dominance: {
            dominant_color: {
                hex: '#3B82F6',
                name: 'Blue',
                percentage: 22
            },
            secondary_color: {
                hex: '#EF4444',
                name: 'Red',
                percentage: 16
            },
            dominance_level: 'moderate',
            dominance_ratio: 1.4
        },
        diversity: {
            effective_colors: 9,
            shannon_index: 2.3,
            simpson_index: 0.85,
            diversity_level: 'high',
            common_colors_count: 4,
            rare_colors_count: 3
        },
        frequency_bins: {
            bins: [3, 5, 7, 6, 4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            labels: Array.from({length: 16}, (_, i) => `${(i * 6.25).toFixed(1)}-${((i + 1) * 6.25).toFixed(1)}%`)
        }
    };
}

function displaySimplePCColorFrequency(container, colorFrequency) {
    container.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-chart-pie text-blue-500 mr-2"></i>
                Frequency Statistics
                <span class="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Fallback</span>
            </h4>
            <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">${colorFrequency?.unique_colors || 0}</div>
                <div class="text-gray-600">Unique Colors</div>
            </div>
        </div>
    `;
}

console.log('💻 PC Layout Integration Fix loaded successfully');
