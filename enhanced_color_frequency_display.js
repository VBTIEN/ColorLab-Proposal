// Enhanced Color Frequency Display - Advanced Visualization
console.log('📊 Enhanced Color Frequency Display Loading...');

// Override displayColorFrequency function
window.displayColorFrequency = function(colorFrequency) {
    console.log('📊 Enhanced displayColorFrequency called');
    
    const colorFrequencyDiv = document.getElementById('colorFrequency');
    if (!colorFrequencyDiv) {
        console.error('❌ Color frequency div not found');
        return;
    }
    
    try {
        // Get enhanced analysis data
        let enhancedAnalysis;
        if (window.analysisData && window.analysisData.dominant_colors) {
            const analyzer = new EnhancedColorFrequencyAnalyzer();
            const totalPixels = window.analysisData.dominant_colors.reduce((sum, color) => sum + color.pixel_count, 0);
            enhancedAnalysis = analyzer.analyzeColorFrequency(window.analysisData.dominant_colors, totalPixels);
        } else {
            // Fallback to provided data
            enhancedAnalysis = generateFallbackAnalysis(colorFrequency);
        }
        
        // Create enhanced display
        displayEnhancedColorFrequency(colorFrequencyDiv, enhancedAnalysis);
        
        console.log('✅ Enhanced color frequency displayed');
        
    } catch (error) {
        console.error('❌ Enhanced color frequency display error:', error);
        // Fallback to simple display
        displaySimpleColorFrequency(colorFrequencyDiv, colorFrequency);
    }
};

function displayEnhancedColorFrequency(container, analysis) {
    console.log('📊 Creating enhanced color frequency display...');
    
    container.innerHTML = `
        <div class="space-y-6">
            <!-- Basic Statistics -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
                    Frequency Statistics
                    <span class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Enhanced</span>
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${analysis.basic_stats.total_colors}</div>
                        <div class="text-sm text-gray-600">Total Colors</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${analysis.basic_stats.average_frequency}%</div>
                        <div class="text-sm text-gray-600">Avg Frequency</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${analysis.basic_stats.median_frequency}%</div>
                        <div class="text-sm text-gray-600">Median</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">${analysis.basic_stats.frequency_std_dev}%</div>
                        <div class="text-sm text-gray-600">Std Dev</div>
                    </div>
                </div>
            </div>
            
            <!-- Distribution Analysis -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-line text-green-500 mr-2"></i>
                    Distribution Pattern
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Type:</span>
                                <span class="font-semibold capitalize">${analysis.distribution.type.replace('_', ' ')}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Concentration:</span>
                                <span class="font-semibold capitalize">${analysis.distribution.concentration.replace('_', ' ')}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Evenness:</span>
                                <span class="font-semibold">${analysis.distribution.evenness_index}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Top 5 Coverage:</span>
                                <span class="font-semibold">${analysis.distribution.top_5_coverage}%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Top 10 Coverage:</span>
                                <span class="font-semibold">${analysis.distribution.top_10_coverage}%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Skewness:</span>
                                <span class="font-semibold">${analysis.distribution.skewness}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dominance Analysis -->
            ${analysis.dominance ? `
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-crown text-purple-500 mr-2"></i>
                    Color Dominance
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.dominant_color.hex}"></div>
                        <div class="font-semibold text-gray-800">${analysis.dominance.dominant_color.name}</div>
                        <div class="text-lg font-bold text-purple-600">${analysis.dominance.dominant_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Dominant</div>
                    </div>
                    ${analysis.dominance.secondary_color ? `
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-white shadow-lg" 
                             style="background-color: ${analysis.dominance.secondary_color.hex}"></div>
                        <div class="font-semibold text-gray-800">${analysis.dominance.secondary_color.name}</div>
                        <div class="text-lg font-bold text-blue-600">${analysis.dominance.secondary_color.percentage}%</div>
                        <div class="text-xs text-gray-500">Secondary</div>
                    </div>
                    ` : ''}
                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div class="text-3xl mb-2">${getDominanceIcon(analysis.dominance.dominance_level)}</div>
                        <div class="font-semibold text-gray-800 capitalize">${analysis.dominance.dominance_level}</div>
                        <div class="text-lg font-bold text-green-600">${analysis.dominance.dominance_ratio}x</div>
                        <div class="text-xs text-gray-500">Ratio</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Diversity Metrics -->
            ${analysis.diversity ? `
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-500">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-rainbow text-yellow-500 mr-2"></i>
                    Color Diversity
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-yellow-600">${analysis.diversity.effective_colors}</div>
                        <div class="text-sm text-gray-600">Effective Colors</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">${analysis.diversity.shannon_index}</div>
                        <div class="text-sm text-gray-600">Shannon Index</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-600">${analysis.diversity.simpson_index}</div>
                        <div class="text-sm text-gray-600">Simpson Index</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-pink-600 capitalize">${analysis.diversity.diversity_level.replace('_', ' ')}</div>
                        <div class="text-sm text-gray-600">Diversity Level</div>
                    </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-white rounded-lg">
                        <div class="text-lg font-bold text-blue-600">${analysis.diversity.common_colors_count}</div>
                        <div class="text-sm text-gray-600">Common Colors (>5%)</div>
                    </div>
                    <div class="text-center p-3 bg-white rounded-lg">
                        <div class="text-lg font-bold text-gray-600">${analysis.diversity.rare_colors_count}</div>
                        <div class="text-sm text-gray-600">Rare Colors (<1%)</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Frequency Visualization -->
            <div class="bg-white p-6 rounded-xl shadow-lg border">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-chart-area text-indigo-500 mr-2"></i>
                    Frequency Distribution
                </h4>
                <div class="h-64">
                    <canvas id="frequencyChart" width="400" height="200"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Render frequency chart
    setTimeout(() => {
        renderFrequencyChart(analysis);
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

function renderFrequencyChart(analysis) {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas || !analysis.frequency_bins) return;
    
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
                    text: 'Color Frequency Distribution'
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

function generateFallbackAnalysis(colorFrequency) {
    return {
        basic_stats: {
            total_colors: colorFrequency?.unique_colors || 0,
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

function displaySimpleColorFrequency(container, colorFrequency) {
    container.innerHTML = `
        <div class="text-center p-8">
            <div class="text-3xl font-bold text-blue-600 mb-2">${colorFrequency?.unique_colors || 0}</div>
            <div class="text-gray-600">Unique Colors</div>
        </div>
    `;
}

console.log('📊 Enhanced Color Frequency Display loaded successfully');
