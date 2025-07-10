// Patch để mở rộng web interface - thêm vào cuối file JavaScript hiện tại

// Override displayComprehensiveResults để thêm enhancements
const originalDisplayComprehensiveResults = window.displayComprehensiveResults || function() {};

function displayComprehensiveResults(result) {
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
    
    // *** THÊM CÁC ENHANCEMENTS MỚI ***
    enhanceAllDisplays(analysis);
}

// Mở rộng function displayHistograms để hiển thị HSV Histogram
function enhanceHistograms(histograms) {
    if (!histograms.hsv) return;
    
    // Tìm histogram section
    const histogramSection = document.querySelector('[id*="histogram"]')?.closest('.bg-white, .bg-gray-50, .p-6');
    if (!histogramSection) return;
    
    // Thêm HSV Histogram nếu chưa có
    if (!document.getElementById('hsvHistogramSection')) {
        const hsvSection = document.createElement('div');
        hsvSection.id = 'hsvHistogramSection';
        hsvSection.className = 'mt-6 bg-purple-50 p-6 rounded-xl';
        hsvSection.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-chart-area text-purple-500 mr-2"></i>
                HSV Histogram
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">Hue Distribution</h5>
                    <canvas id="hueHistogram" width="300" height="200"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">Saturation Distribution</h5>
                    <canvas id="saturationHistogram" width="300" height="200"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">Value Distribution</h5>
                    <canvas id="valueHistogram" width="300" height="200"></canvas>
                </div>
            </div>
        `;
        
        histogramSection.parentNode.insertBefore(hsvSection, histogramSection.nextSibling);
        
        // Render HSV charts
        setTimeout(() => renderHSVCharts(histograms.hsv), 100);
    }
}

// Function để render HSV charts
function renderHSVCharts(hsvData) {
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
                    borderWidth: 1,
                    borderColor: 'rgba(147, 51, 234, 0.3)'
                }]
            },
            options: chartOptions
        });
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
    }
}

// Mở rộng Regional Analysis với 3x3 Grid
function enhanceRegionalAnalysis(regional) {
    if (!regional.regions) return;
    
    // Tìm regional section
    const regionalSection = document.querySelector('[id*="regional"]')?.closest('.bg-white, .bg-gray-50, .p-6');
    if (!regionalSection) return;
    
    // Thêm 3x3 Grid nếu chưa có
    if (!document.getElementById('regionalGrid3x3')) {
        const gridSection = document.createElement('div');
        gridSection.id = 'regionalGrid3x3';
        gridSection.className = 'mt-6 bg-green-50 p-6 rounded-xl';
        gridSection.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-th text-green-500 mr-2"></i>
                Regional Color Distribution (3x3 Grid)
            </h4>
            <div class="flex justify-center">
                <div id="colorGrid3x3" class="grid grid-cols-3 gap-2 w-64 h-64">
                    <!-- Grid cells will be populated -->
                </div>
            </div>
            <div class="mt-4 text-sm text-gray-600 text-center">
                Visual representation of dominant colors across image regions
            </div>
        `;
        
        regionalSection.parentNode.insertBefore(gridSection, regionalSection.nextSibling);
        
        // Render 3x3 Grid
        renderColorGrid3x3(regional.regions);
    }
}

// Function để render 3x3 Color Grid
function renderColorGrid3x3(regions) {
    const gridElement = document.getElementById('colorGrid3x3');
    if (!gridElement) return;
    
    const regionNames = [
        'Top-Left', 'Top-Center', 'Top-Right',
        'Middle-Left', 'Center', 'Middle-Right', 
        'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
    ];
    
    gridElement.innerHTML = '';
    
    regionNames.forEach((regionName, index) => {
        const region = regions.find(r => r.region === regionName) || {
            dominant_color: { hex: '#808080', rgb: { r: 128, g: 128, b: 128 } },
            brightness: 0.5
        };
        
        const cell = document.createElement('div');
        cell.className = 'aspect-square rounded-lg border-2 border-white shadow-lg relative overflow-hidden cursor-pointer transform hover:scale-110 transition-all duration-200';
        cell.style.backgroundColor = region.dominant_color.hex;
        cell.title = `${regionName}: ${region.dominant_color.hex}\nBrightness: ${(region.brightness * 100).toFixed(1)}%`;
        
        // Thêm label với contrast tốt
        const textColor = region.brightness > 0.5 ? '#000000' : '#FFFFFF';
        const shortName = regionName.split('-').map(word => word[0]).join('');
        
        cell.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold" style="color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
                    ${shortName}
                </span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                ${region.dominant_color.hex}
            </div>
        `;
        
        gridElement.appendChild(cell);
    });
}

// Mở rộng Color Spaces với LAB
function enhanceColorSpaces(colorSpaces) {
    if (!colorSpaces.lab) return;
    
    // Tìm color spaces section
    const colorSpacesSection = document.querySelector('[id*="colorSpaces"]')?.closest('.bg-white, .bg-gray-50, .p-6');
    if (!colorSpacesSection) return;
    
    // Thêm LAB Color Space nếu chưa có
    if (!document.getElementById('labColorSpaceSection')) {
        const labSection = document.createElement('div');
        labSection.id = 'labColorSpaceSection';
        labSection.className = 'mt-6 bg-yellow-50 p-6 rounded-xl';
        labSection.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-flask text-yellow-500 mr-2"></i>
                LAB Color Space Analysis
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">L* (Lightness)</h5>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Min:</span>
                            <span class="font-medium">${colorSpaces.lab.lightness?.min || 0}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Max:</span>
                            <span class="font-medium">${colorSpaces.lab.lightness?.max || 100}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Average:</span>
                            <span class="font-medium">${colorSpaces.lab.lightness?.avg || 50}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">a* (Green ↔ Red)</h5>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Min:</span>
                            <span class="font-medium">${colorSpaces.lab.a_component?.min || -50}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Max:</span>
                            <span class="font-medium">${colorSpaces.lab.a_component?.max || 50}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Average:</span>
                            <span class="font-medium">${colorSpaces.lab.a_component?.avg || 0}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-700 mb-3 text-center">b* (Blue ↔ Yellow)</h5>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Min:</span>
                            <span class="font-medium">${colorSpaces.lab.b_component?.min || -50}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Max:</span>
                            <span class="font-medium">${colorSpaces.lab.b_component?.max || 50}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Average:</span>
                            <span class="font-medium">${colorSpaces.lab.b_component?.avg || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-blue-100 p-4 rounded-lg">
                <p class="text-sm text-blue-800 flex items-start">
                    <i class="fas fa-info-circle mr-2 mt-0.5 flex-shrink-0"></i>
                    <span>LAB color space is perceptually uniform, meaning equal numerical distances represent equal visual differences. This makes it ideal for accurate color analysis and comparison.</span>
                </p>
            </div>
        `;
        
        colorSpacesSection.parentNode.insertBefore(labSection, colorSpacesSection.nextSibling);
    }
}

// Mở rộng Characteristics với Color Temperature
function enhanceCharacteristics(characteristics) {
    if (!characteristics.temperature) return;
    
    // Tìm characteristics section
    const characteristicsSection = document.querySelector('[id*="characteristics"]')?.closest('.bg-white, .bg-gray-50, .p-6');
    if (!characteristicsSection) return;
    
    // Thêm Color Temperature section nếu chưa có
    if (!document.getElementById('colorTemperatureSection')) {
        const tempSection = document.createElement('div');
        tempSection.id = 'colorTemperatureSection';
        tempSection.className = 'mt-6 bg-orange-50 p-6 rounded-xl';
        
        const tempColor = getTemperatureColor(characteristics.temperature.classification);
        const tempIcon = getTemperatureIcon(characteristics.temperature.classification);
        
        tempSection.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-thermometer-half text-orange-500 mr-2"></i>
                Color Temperature & Advanced Characteristics
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div class="text-3xl mb-2">${tempIcon}</div>
                    <h5 class="font-medium text-gray-700 mb-2">Temperature</h5>
                    <div class="text-xl font-bold ${tempColor} mb-1">
                        ${characteristics.temperature.classification || 'Neutral'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Score: ${(characteristics.temperature.temperature_score || 0.5).toFixed(2)}
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Warm: ${(characteristics.temperature.warm_percentage || 50).toFixed(1)}%<br>
                        Cool: ${(characteristics.temperature.cool_percentage || 50).toFixed(1)}%
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div class="text-3xl mb-2">☀️</div>
                    <h5 class="font-medium text-gray-700 mb-2">Brightness</h5>
                    <div class="text-xl font-bold text-yellow-600 mb-1">
                        ${characteristics.brightness?.level || 'Medium'}
                    </div>
                    <div class="text-sm text-gray-600">
                        ${((characteristics.brightness?.average || 0.5) * 100).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.brightness?.distribution || 'Even'}
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div class="text-3xl mb-2">🎨</div>
                    <h5 class="font-medium text-gray-700 mb-2">Saturation</h5>
                    <div class="text-xl font-bold text-purple-600 mb-1">
                        ${characteristics.saturation?.level || 'Medium'}
                    </div>
                    <div class="text-sm text-gray-600">
                        ${((characteristics.saturation?.average || 0.5) * 100).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.saturation?.vibrancy || 'Moderate'}
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm text-center">
                    <div class="text-3xl mb-2">🎭</div>
                    <h5 class="font-medium text-gray-700 mb-2">Harmony</h5>
                    <div class="text-xl font-bold text-green-600 mb-1">
                        ${characteristics.harmony?.type || 'Mixed'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Score: ${(characteristics.harmony?.score || 0.5).toFixed(2)}
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.harmony?.balance || 'Balanced'}
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-orange-100 via-yellow-100 to-blue-100 p-4 rounded-lg">
                <h5 class="font-medium text-gray-800 mb-2 flex items-center">
                    <i class="fas fa-heart mr-2 text-pink-500"></i>
                    Emotional Impact & Mood
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="font-medium text-gray-700">Primary Mood:</span>
                        <span class="ml-2 text-gray-600">${characteristics.mood?.primary || 'Neutral'}</span>
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Secondary:</span>
                        <span class="ml-2 text-gray-600">${characteristics.mood?.secondary || 'Balanced'}</span>
                    </div>
                    <div>
                        <span class="font-medium text-gray-700">Impact:</span>
                        <span class="ml-2 text-gray-600">${characteristics.mood?.emotional_impact || 'Moderate'}</span>
                    </div>
                </div>
            </div>
        `;
        
        characteristicsSection.parentNode.insertBefore(tempSection, characteristicsSection.nextSibling);
    }
}

// Helper functions
function getTemperatureColor(classification) {
    switch(classification?.toLowerCase()) {
        case 'warm': return 'text-red-600';
        case 'cool': return 'text-blue-600';
        case 'neutral': return 'text-gray-600';
        default: return 'text-gray-600';
    }
}

function getTemperatureIcon(classification) {
    switch(classification?.toLowerCase()) {
        case 'warm': return '🔥';
        case 'cool': return '❄️';
        case 'neutral': return '🌡️';
        default: return '🌡️';
    }
}

// Function chính để áp dụng tất cả enhancements
function enhanceAllDisplays(analysis) {
    console.log('🔧 Applying web interface enhancements...');
    
    // Đợi một chút để DOM được render
    setTimeout(() => {
        try {
            if (analysis.histograms) {
                enhanceHistograms(analysis.histograms);
            }
            
            if (analysis.regional_analysis) {
                enhanceRegionalAnalysis(analysis.regional_analysis);
            }
            
            if (analysis.color_spaces) {
                enhanceColorSpaces(analysis.color_spaces);
            }
            
            if (analysis.characteristics) {
                enhanceCharacteristics(analysis.characteristics);
            }
            
            console.log('✅ Web interface enhancements completed successfully');
        } catch (error) {
            console.error('❌ Enhancement error:', error);
        }
    }, 500);
}
