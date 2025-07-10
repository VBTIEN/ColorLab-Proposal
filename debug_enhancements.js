// Debug version - Kiểm tra và sửa lỗi enhancements

// Override displayComprehensiveResults với debug
function displayComprehensiveResults(result) {
    console.log('🔍 DEBUG: displayComprehensiveResults called with:', result);
    
    const analysis = result.analysis;
    
    // Hide loading, show results
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    // Display all sections (gọi functions gốc)
    displayQuickStats(analysis);
    displayDominantColors(analysis.dominant_colors);
    displayColorFrequency(analysis.color_frequency);
    displayHistograms(analysis.histograms);
    displayRegionalAnalysis(analysis.regional_analysis);
    displayColorSpaces(analysis.color_spaces);
    displayColorCharacteristics(analysis.characteristics);
    displayAIInsights(analysis);
    
    // *** DEBUG ENHANCEMENTS ***
    console.log('🔧 Starting enhancements with data:', {
        histograms: analysis.histograms,
        regional_analysis: analysis.regional_analysis,
        color_spaces: analysis.color_spaces,
        characteristics: analysis.characteristics
    });
    
    // Đợi DOM render xong rồi mới enhance
    setTimeout(() => {
        debugEnhanceAllDisplays(analysis);
    }, 1000);
}

function debugEnhanceAllDisplays(analysis) {
    console.log('🔧 DEBUG: Applying web interface enhancements...');
    
    try {
        // 1. HSV Histogram Enhancement
        if (analysis.histograms) {
            console.log('📊 Enhancing histograms with data:', analysis.histograms);
            debugEnhanceHistograms(analysis.histograms);
        } else {
            console.warn('⚠️ No histogram data available');
        }
        
        // 2. Regional Analysis Enhancement
        if (analysis.regional_analysis) {
            console.log('🗺️ Enhancing regional analysis with data:', analysis.regional_analysis);
            debugEnhanceRegionalAnalysis(analysis.regional_analysis);
        } else {
            console.warn('⚠️ No regional analysis data available');
        }
        
        // 3. Color Spaces Enhancement
        if (analysis.color_spaces) {
            console.log('🔬 Enhancing color spaces with data:', analysis.color_spaces);
            debugEnhanceColorSpaces(analysis.color_spaces);
        } else {
            console.warn('⚠️ No color spaces data available');
        }
        
        // 4. Characteristics Enhancement
        if (analysis.characteristics) {
            console.log('🌡️ Enhancing characteristics with data:', analysis.characteristics);
            debugEnhanceCharacteristics(analysis.characteristics);
        } else {
            console.warn('⚠️ No characteristics data available');
        }
        
        console.log('✅ DEBUG: All enhancements completed');
        
    } catch (error) {
        console.error('❌ DEBUG: Enhancement error:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Debug HSV Histogram Enhancement
function debugEnhanceHistograms(histograms) {
    console.log('📊 DEBUG: Enhancing histograms...');
    
    // Tìm vị trí để thêm HSV histogram
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        console.error('❌ Results container not found');
        return;
    }
    
    // Tìm histogram section hiện có
    let histogramSection = document.querySelector('#histograms');
    if (!histogramSection) {
        console.warn('⚠️ Original histogram section not found, creating new one');
        histogramSection = resultsContainer;
    }
    
    // Thêm HSV Histogram section
    if (!document.getElementById('hsvHistogramSection')) {
        console.log('📊 Creating HSV histogram section...');
        
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
        
        // Thêm vào DOM
        if (histogramSection.parentNode) {
            histogramSection.parentNode.insertBefore(hsvSection, histogramSection.nextSibling);
        } else {
            resultsContainer.appendChild(hsvSection);
        }
        
        console.log('📊 HSV section created, rendering charts...');
        
        // Render charts với data thực tế hoặc mock data
        setTimeout(() => {
            debugRenderHSVCharts(histograms.hsv || generateMockHSVData());
        }, 100);
    }
}

// Debug Regional Analysis Enhancement
function debugEnhanceRegionalAnalysis(regional) {
    console.log('🗺️ DEBUG: Enhancing regional analysis...');
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        console.error('❌ Results container not found');
        return;
    }
    
    // Thêm 3x3 Grid section
    if (!document.getElementById('regionalGrid3x3')) {
        console.log('🗺️ Creating 3x3 grid section...');
        
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
        
        console.log('🗺️ Grid section created, rendering grid...');
        
        // Render grid với data thực tế hoặc mock data
        setTimeout(() => {
            debugRenderColorGrid3x3(regional.regions || generateMockRegionalData());
        }, 100);
    }
}

// Debug Color Spaces Enhancement
function debugEnhanceColorSpaces(colorSpaces) {
    console.log('🔬 DEBUG: Enhancing color spaces...');
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        console.error('❌ Results container not found');
        return;
    }
    
    // Thêm LAB Color Space section
    if (!document.getElementById('labColorSpaceSection')) {
        console.log('🔬 Creating LAB color space section...');
        
        const labSection = document.createElement('div');
        labSection.id = 'labColorSpaceSection';
        labSection.className = 'mt-8 bg-yellow-50 p-6 rounded-xl shadow-lg';
        
        const labData = colorSpaces.lab || {
            lightness: { min: 0, max: 100, avg: 50 },
            a_component: { min: -50, max: 50, avg: 0 },
            b_component: { min: -50, max: 50, avg: 0 }
        };
        
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
                    <span><strong>LAB Color Space</strong> is perceptually uniform, meaning equal numerical distances represent equal visual differences. This makes it ideal for accurate color analysis and professional color matching.</span>
                </p>
            </div>
        `;
        
        resultsContainer.appendChild(labSection);
        console.log('🔬 LAB section created successfully');
    }
}

// Debug Characteristics Enhancement
function debugEnhanceCharacteristics(characteristics) {
    console.log('🌡️ DEBUG: Enhancing characteristics...');
    
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        console.error('❌ Results container not found');
        return;
    }
    
    // Thêm Color Temperature section
    if (!document.getElementById('colorTemperatureSection')) {
        console.log('🌡️ Creating color temperature section...');
        
        const tempSection = document.createElement('div');
        tempSection.id = 'colorTemperatureSection';
        tempSection.className = 'mt-8 bg-orange-50 p-6 rounded-xl shadow-lg';
        
        const tempData = characteristics.temperature || {
            classification: 'Neutral',
            temperature_score: 0.5,
            warm_percentage: 50,
            cool_percentage: 50
        };
        
        const brightnessData = characteristics.brightness || {
            level: 'Medium',
            average: 0.5,
            distribution: 'Even'
        };
        
        const saturationData = characteristics.saturation || {
            level: 'Medium',
            average: 0.5,
            vibrancy: 'Moderate'
        };
        
        const harmonyData = characteristics.harmony || {
            type: 'Mixed',
            score: 0.5,
            balance: 'Balanced'
        };
        
        const moodData = characteristics.mood || {
            primary: 'Neutral',
            secondary: 'Balanced',
            emotional_impact: 'Moderate'
        };
        
        const tempColor = debugGetTemperatureColor(tempData.classification);
        const tempIcon = debugGetTemperatureIcon(tempData.classification);
        
        tempSection.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-thermometer-half text-orange-500 mr-3"></i>
                Color Temperature & Advanced Characteristics
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div class="text-4xl mb-3">${tempIcon}</div>
                    <h4 class="font-medium text-gray-700 mb-2">Temperature</h4>
                    <div class="text-2xl font-bold ${tempColor} mb-2">
                        ${tempData.classification}
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                        Score: ${tempData.temperature_score.toFixed(2)}
                    </div>
                    <div class="text-xs text-gray-500">
                        Warm: ${tempData.warm_percentage.toFixed(1)}%<br>
                        Cool: ${tempData.cool_percentage.toFixed(1)}%
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div class="text-4xl mb-3">☀️</div>
                    <h4 class="font-medium text-gray-700 mb-2">Brightness</h4>
                    <div class="text-2xl font-bold text-yellow-600 mb-2">
                        ${brightnessData.level}
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                        ${(brightnessData.average * 100).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500">
                        ${brightnessData.distribution}
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div class="text-4xl mb-3">🎨</div>
                    <h4 class="font-medium text-gray-700 mb-2">Saturation</h4>
                    <div class="text-2xl font-bold text-purple-600 mb-2">
                        ${saturationData.level}
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                        ${(saturationData.average * 100).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500">
                        ${saturationData.vibrancy}
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div class="text-4xl mb-3">🎭</div>
                    <h4 class="font-medium text-gray-700 mb-2">Harmony</h4>
                    <div class="text-2xl font-bold text-green-600 mb-2">
                        ${harmonyData.type}
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                        Score: ${harmonyData.score.toFixed(2)}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${harmonyData.balance}
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-orange-100 via-yellow-100 to-blue-100 p-6 rounded-lg">
                <h4 class="font-medium text-gray-800 mb-3 flex items-center">
                    <i class="fas fa-heart mr-2 text-pink-500"></i>
                    Emotional Impact & Mood Analysis
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div class="text-center">
                        <span class="font-medium text-gray-700 block">Primary Mood</span>
                        <span class="text-lg font-bold text-blue-600">${moodData.primary}</span>
                    </div>
                    <div class="text-center">
                        <span class="font-medium text-gray-700 block">Secondary</span>
                        <span class="text-lg font-bold text-green-600">${moodData.secondary}</span>
                    </div>
                    <div class="text-center">
                        <span class="font-medium text-gray-700 block">Impact</span>
                        <span class="text-lg font-bold text-purple-600">${moodData.emotional_impact}</span>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(tempSection);
        console.log('🌡️ Temperature section created successfully');
    }
}

// Helper functions
function debugGetTemperatureColor(classification) {
    switch(classification?.toLowerCase()) {
        case 'warm': return 'text-red-600';
        case 'cool': return 'text-blue-600';
        case 'neutral': return 'text-gray-600';
        default: return 'text-gray-600';
    }
}

function debugGetTemperatureIcon(classification) {
    switch(classification?.toLowerCase()) {
        case 'warm': return '🔥';
        case 'cool': return '❄️';
        case 'neutral': return '🌡️';
        default: return '🌡️';
    }
}

// Mock data generators
function generateMockHSVData() {
    return {
        hue: [5, 8, 12, 15, 10, 7, 9, 11, 6, 4, 8, 13, 9, 7, 5, 3],
        saturation: [10, 15, 20, 25, 18, 12, 8, 6, 9, 14, 16, 11, 7, 5, 4, 2],
        value: [8, 12, 16, 20, 15, 10, 7, 9, 13, 11, 6, 8, 12, 9, 5, 3]
    };
}

function generateMockRegionalData() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    return [
        'Top-Left', 'Top-Center', 'Top-Right',
        'Middle-Left', 'Center', 'Middle-Right', 
        'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
    ].map((region, index) => ({
        region,
        dominant_color: { hex: colors[index] },
        brightness: 0.3 + (index * 0.08)
    }));
}

// Render functions
function debugRenderHSVCharts(hsvData) {
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
        console.log('📊 Hue chart rendered');
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
        console.log('📊 Saturation chart rendered');
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
        console.log('📊 Value chart rendered');
    }
}

function debugRenderColorGrid3x3(regions) {
    console.log('🗺️ Rendering 3x3 color grid with regions:', regions);
    
    const gridElement = document.getElementById('colorGrid3x3');
    if (!gridElement) {
        console.error('❌ Grid element not found');
        return;
    }
    
    gridElement.innerHTML = '';
    
    regions.forEach((region, index) => {
        const cell = document.createElement('div');
        cell.className = 'aspect-square rounded-lg border-2 border-white shadow-lg relative overflow-hidden cursor-pointer transform hover:scale-110 transition-all duration-200';
        cell.style.backgroundColor = region.dominant_color.hex;
        cell.title = `${region.region}: ${region.dominant_color.hex}\nBrightness: ${(region.brightness * 100).toFixed(1)}%`;
        
        // Thêm label với contrast tốt
        const textColor = region.brightness > 0.5 ? '#000000' : '#FFFFFF';
        const shortName = region.region.split('-').map(word => word[0]).join('');
        
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
    
    console.log('🗺️ 3x3 grid rendered successfully');
}

console.log('🔧 Debug enhancements loaded successfully');
