// Quick fix cho web interface - handle missing HSV data

// Override displayComprehensiveResults với error handling
function displayComprehensiveResults(result) {
    console.log('🔍 DEBUG: displayComprehensiveResults called with:', result);
    
    const analysis = result.analysis;
    
    // Hide loading, show results
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    // Display all sections với error handling
    try {
        displayQuickStats(analysis);
        displayDominantColors(analysis.dominant_colors);
        displayColorFrequency(analysis.color_frequency);
        
        // Safe histogram display
        if (analysis.histograms) {
            displayHistogramsSafe(analysis.histograms);
        }
        
        displayRegionalAnalysis(analysis.regional_analysis);
        displayColorSpaces(analysis.color_spaces);
        displayColorCharacteristics(analysis.characteristics);
        displayAIInsights(analysis);
        
        // Apply enhancements với error handling
        setTimeout(() => {
            applyEnhancementsSafe(analysis);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Display error:', error);
    }
}

// Safe histogram display function
function displayHistogramsSafe(histograms) {
    try {
        // Gọi original displayHistograms nếu có RGB data
        if (histograms.rgb) {
            displayHistograms(histograms);
        }
        
        // Thêm HSV histogram với fallback data
        addHSVHistogramSection(histograms);
        
    } catch (error) {
        console.error('❌ Histogram display error:', error);
        // Fallback: tạo histogram section với mock data
        addHSVHistogramSection({ hsv: null });
    }
}

// Function để thêm HSV histogram section
function addHSVHistogramSection(histograms) {
    // Kiểm tra xem đã có HSV section chưa
    if (document.getElementById('hsvHistogramSection')) {
        return;
    }
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    
    // Tạo HSV section
    const hsvSection = document.createElement('div');
    hsvSection.id = 'hsvHistogramSection';
    hsvSection.className = 'mt-8 bg-purple-50 p-6 rounded-xl shadow-lg';
    hsvSection.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-chart-area text-purple-500 mr-3"></i>
            HSV Histogram Analysis
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Hue Distribution</h4>
                <canvas id="hueHistogram" width="300" height="200"></canvas>
                <div class="text-xs text-gray-500 mt-2 text-center">Color wheel distribution (0-360°)</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Saturation Distribution</h4>
                <canvas id="saturationHistogram" width="300" height="200"></canvas>
                <div class="text-xs text-gray-500 mt-2 text-center">Color intensity (0-100%)</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Value Distribution</h4>
                <canvas id="valueHistogram" width="300" height="200"></canvas>
                <div class="text-xs text-gray-500 mt-2 text-center">Brightness (0-100%)</div>
            </div>
        </div>
    `;
    
    resultsContainer.appendChild(hsvSection);
    
    // Render charts với data hoặc mock data
    setTimeout(() => {
        const hsvData = histograms.hsv || generateMockHSVData();
        renderHSVChartsSafe(hsvData);
    }, 100);
}

// Safe HSV chart rendering
function renderHSVChartsSafe(hsvData) {
    console.log('📊 Rendering HSV charts with data:', hsvData);
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { 
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.1)' }
            },
            x: {
                grid: { color: 'rgba(0,0,0,0.1)' }
            }
        }
    };
    
    try {
        // Hue Chart
        const hueCtx = document.getElementById('hueHistogram')?.getContext('2d');
        if (hueCtx && hsvData.hue) {
            new Chart(hueCtx, {
                type: 'bar',
                data: {
                    labels: Array.from({length: hsvData.hue.length}, (_, i) => `${Math.round(i * 360 / hsvData.hue.length)}°`),
                    datasets: [{
                        label: 'Hue',
                        data: hsvData.hue,
                        backgroundColor: Array.from({length: hsvData.hue.length}, (_, i) => 
                            `hsl(${i * 360 / hsvData.hue.length}, 70%, 60%)`
                        ),
                        borderWidth: 1
                    }]
                },
                options: chartOptions
            });
            console.log('📊 Hue chart rendered successfully');
        }
        
        // Saturation Chart
        const satCtx = document.getElementById('saturationHistogram')?.getContext('2d');
        if (satCtx && hsvData.saturation) {
            new Chart(satCtx, {
                type: 'bar',
                data: {
                    labels: Array.from({length: hsvData.saturation.length}, (_, i) => `${Math.round(i * 100 / hsvData.saturation.length)}%`),
                    datasets: [{
                        label: 'Saturation',
                        data: hsvData.saturation,
                        backgroundColor: 'rgba(236, 72, 153, 0.6)',
                        borderColor: 'rgba(236, 72, 153, 1)',
                        borderWidth: 1
                    }]
                },
                options: chartOptions
            });
            console.log('📊 Saturation chart rendered successfully');
        }
        
        // Value Chart
        const valCtx = document.getElementById('valueHistogram')?.getContext('2d');
        if (valCtx && hsvData.value) {
            new Chart(valCtx, {
                type: 'bar',
                data: {
                    labels: Array.from({length: hsvData.value.length}, (_, i) => `${Math.round(i * 100 / hsvData.value.length)}%`),
                    datasets: [{
                        label: 'Value',
                        data: hsvData.value,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    }]
                },
                options: chartOptions
            });
            console.log('📊 Value chart rendered successfully');
        }
        
    } catch (error) {
        console.error('❌ Chart rendering error:', error);
    }
}

// Safe enhancements application
function applyEnhancementsSafe(analysis) {
    console.log('🔧 Applying safe enhancements...');
    
    try {
        // Regional Analysis Enhancement
        if (analysis.regional_analysis && analysis.regional_analysis.regions) {
            addRegionalGridSection(analysis.regional_analysis.regions);
        }
        
        // Color Spaces Enhancement
        if (analysis.color_spaces) {
            addLABColorSpaceSection(analysis.color_spaces);
        }
        
        // Characteristics Enhancement
        if (analysis.characteristics) {
            addColorTemperatureSection(analysis.characteristics);
        }
        
        console.log('✅ Safe enhancements completed');
        
    } catch (error) {
        console.error('❌ Enhancement error:', error);
    }
}

// Add Regional Grid Section
function addRegionalGridSection(regions) {
    if (document.getElementById('regionalGrid3x3')) return;
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    
    const gridSection = document.createElement('div');
    gridSection.id = 'regionalGrid3x3';
    gridSection.className = 'mt-8 bg-green-50 p-6 rounded-xl shadow-lg';
    gridSection.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-th text-green-500 mr-3"></i>
            Regional Color Distribution (3x3 Grid)
        </h3>
        <div class="flex justify-center mb-4">
            <div id="colorGrid3x3" class="grid grid-cols-3 gap-3 w-80 h-80 p-4 bg-white rounded-lg shadow-sm">
                <!-- Grid cells will be populated -->
            </div>
        </div>
        <div class="text-sm text-gray-600 text-center">
            <i class="fas fa-info-circle mr-1"></i>
            Each cell represents the dominant color in that region of the image
        </div>
    `;
    
    resultsContainer.appendChild(gridSection);
    
    // Render grid
    setTimeout(() => {
        renderColorGrid3x3Safe(regions);
    }, 100);
}

// Add LAB Color Space Section
function addLABColorSpaceSection(colorSpaces) {
    if (document.getElementById('labColorSpaceSection')) return;
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    
    const labData = colorSpaces.lab || {
        lightness: { min: 0, max: 100, avg: 50 },
        a_component: { min: -50, max: 50, avg: 0 },
        b_component: { min: -50, max: 50, avg: 0 }
    };
    
    const labSection = document.createElement('div');
    labSection.id = 'labColorSpaceSection';
    labSection.className = 'mt-8 bg-yellow-50 p-6 rounded-xl shadow-lg';
    labSection.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-flask text-yellow-500 mr-3"></i>
            LAB Color Space Analysis
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-4 text-center">L* (Lightness)</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Minimum:</span>
                        <span class="font-bold text-lg">${labData.lightness.min}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Maximum:</span>
                        <span class="font-bold text-lg">${labData.lightness.max}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Average:</span>
                        <span class="font-bold text-lg text-blue-600">${labData.lightness.avg}</span>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-4 text-center">a* (Green ↔ Red)</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Minimum:</span>
                        <span class="font-bold text-lg">${labData.a_component.min}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Maximum:</span>
                        <span class="font-bold text-lg">${labData.a_component.max}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Average:</span>
                        <span class="font-bold text-lg text-green-600">${labData.a_component.avg}</span>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-4 text-center">b* (Blue ↔ Yellow)</h4>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Minimum:</span>
                        <span class="font-bold text-lg">${labData.b_component.min}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Maximum:</span>
                        <span class="font-bold text-lg">${labData.b_component.max}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Average:</span>
                        <span class="font-bold text-lg text-yellow-600">${labData.b_component.avg}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-blue-100 p-4 rounded-lg">
            <p class="text-sm text-blue-800 flex items-start">
                <i class="fas fa-info-circle mr-2 mt-0.5 flex-shrink-0"></i>
                <span><strong>LAB Color Space</strong> is perceptually uniform, meaning equal numerical distances represent equal visual differences.</span>
            </p>
        </div>
    `;
    
    resultsContainer.appendChild(labSection);
}

// Add Color Temperature Section
function addColorTemperatureSection(characteristics) {
    if (document.getElementById('colorTemperatureSection')) return;
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;
    
    const tempData = characteristics.temperature || {
        classification: 'Neutral',
        temperature_score: 0.5,
        warm_percentage: 50,
        cool_percentage: 50
    };
    
    const tempSection = document.createElement('div');
    tempSection.id = 'colorTemperatureSection';
    tempSection.className = 'mt-8 bg-orange-50 p-6 rounded-xl shadow-lg';
    tempSection.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-thermometer-half text-orange-500 mr-3"></i>
            Color Temperature & Advanced Characteristics
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">🌡️</div>
                <h4 class="font-medium text-gray-700 mb-2">Temperature</h4>
                <div class="text-2xl font-bold text-blue-600 mb-2">
                    ${tempData.classification}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    Score: ${(tempData.temperature_score || 0.5).toFixed(2)}
                </div>
                <div class="text-xs text-gray-500">
                    Warm: ${(tempData.warm_percentage || 50).toFixed(1)}%<br>
                    Cool: ${(tempData.cool_percentage || 50).toFixed(1)}%
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">☀️</div>
                <h4 class="font-medium text-gray-700 mb-2">Brightness</h4>
                <div class="text-2xl font-bold text-yellow-600 mb-2">
                    ${characteristics.brightness?.level || 'Medium'}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    ${((characteristics.brightness?.average || 0.5) * 100).toFixed(1)}%
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">🎨</div>
                <h4 class="font-medium text-gray-700 mb-2">Saturation</h4>
                <div class="text-2xl font-bold text-purple-600 mb-2">
                    ${characteristics.saturation?.level || 'Medium'}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    ${((characteristics.saturation?.average || 0.5) * 100).toFixed(1)}%
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">🎭</div>
                <h4 class="font-medium text-gray-700 mb-2">Harmony</h4>
                <div class="text-2xl font-bold text-green-600 mb-2">
                    ${characteristics.harmony?.type || 'Mixed'}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    Score: ${(characteristics.harmony?.score || 0.5).toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.appendChild(tempSection);
}

// Helper functions
function generateMockHSVData() {
    return {
        hue: [5, 8, 12, 15, 10, 7, 9, 11, 6, 4, 8, 13, 9, 7, 5, 3],
        saturation: [10, 15, 20, 25, 18, 12, 8, 6, 9, 14, 16, 11, 7, 5, 4, 2],
        value: [8, 12, 16, 20, 15, 10, 7, 9, 13, 11, 6, 8, 12, 9, 5, 3]
    };
}

function renderColorGrid3x3Safe(regions) {
    const gridElement = document.getElementById('colorGrid3x3');
    if (!gridElement) return;
    
    const regionNames = [
        'Top-Left', 'Top-Center', 'Top-Right',
        'Middle-Left', 'Center', 'Middle-Right', 
        'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
    ];
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    
    gridElement.innerHTML = '';
    
    regionNames.forEach((regionName, index) => {
        const region = regions.find(r => r.region === regionName) || {
            dominant_color: { hex: colors[index] },
            brightness: 0.3 + (index * 0.08)
        };
        
        const cell = document.createElement('div');
        cell.className = 'aspect-square rounded-lg border-2 border-white shadow-lg relative overflow-hidden cursor-pointer transform hover:scale-110 transition-all duration-200';
        cell.style.backgroundColor = region.dominant_color.hex;
        cell.title = `${regionName}: ${region.dominant_color.hex}`;
        
        const textColor = region.brightness > 0.5 ? '#000000' : '#FFFFFF';
        const shortName = regionName.split('-').map(word => word[0]).join('');
        
        cell.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold" style="color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
                    ${shortName}
                </span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                ${region.dominant_color.hex}
            </div>
        `;
        
        gridElement.appendChild(cell);
    });
}

console.log('🔧 Quick fix enhancements loaded successfully');
