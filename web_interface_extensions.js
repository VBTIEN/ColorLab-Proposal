// Web Interface Extensions - Thêm các phần hiển thị còn thiếu
// Không thay đổi giao diện, chỉ mở rộng functionality

// Mở rộng function displayHistograms để hiển thị HSV Histogram
function displayEnhancedHistograms(histograms) {
    // Gọi function gốc trước
    if (typeof displayHistograms === 'function') {
        displayHistograms(histograms);
    }
    
    // Thêm HSV Histogram nếu chưa có
    if (histograms.hsv && !document.getElementById('hsvHistogramContainer')) {
        const histogramSection = document.querySelector('#histograms').parentElement;
        
        // Tạo HSV Histogram container
        const hsvContainer = document.createElement('div');
        hsvContainer.id = 'hsvHistogramContainer';
        hsvContainer.className = 'mt-6 bg-purple-50 p-6 rounded-xl';
        hsvContainer.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-chart-area text-purple-500 mr-2"></i>
                HSV Histogram
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Hue Distribution</h5>
                    <canvas id="hueHistogram" width="300" height="200"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Saturation Distribution</h5>
                    <canvas id="saturationHistogram" width="300" height="200"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Value Distribution</h5>
                    <canvas id="valueHistogram" width="300" height="200"></canvas>
                </div>
            </div>
        `;
        
        histogramSection.appendChild(hsvContainer);
        
        // Render HSV charts
        renderHSVCharts(histograms.hsv);
    }
}

// Function để render HSV charts
function renderHSVCharts(hsvData) {
    // Hue Chart
    const hueCtx = document.getElementById('hueHistogram')?.getContext('2d');
    if (hueCtx) {
        new Chart(hueCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 16}, (_, i) => `${i * 22.5}°`),
                datasets: [{
                    label: 'Hue',
                    data: hsvData.hue || [],
                    backgroundColor: 'rgba(147, 51, 234, 0.6)',
                    borderColor: 'rgba(147, 51, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Saturation Chart
    const satCtx = document.getElementById('saturationHistogram')?.getContext('2d');
    if (satCtx) {
        new Chart(satCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 16}, (_, i) => `${(i/15*100).toFixed(0)}%`),
                datasets: [{
                    label: 'Saturation',
                    data: hsvData.saturation || [],
                    backgroundColor: 'rgba(236, 72, 153, 0.6)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Value Chart
    const valCtx = document.getElementById('valueHistogram')?.getContext('2d');
    if (valCtx) {
        new Chart(valCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 16}, (_, i) => `${(i/15*100).toFixed(0)}%`),
                datasets: [{
                    label: 'Value',
                    data: hsvData.value || [],
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Mở rộng Regional Analysis để hiển thị 3x3 Grid
function displayEnhancedRegionalAnalysis(regional) {
    // Gọi function gốc trước
    if (typeof displayRegionalAnalysis === 'function') {
        displayRegionalAnalysis(regional);
    }
    
    // Thêm 3x3 Grid visualization nếu chưa có
    if (regional.regions && !document.getElementById('regionalGrid')) {
        const regionalSection = document.querySelector('#regionalAnalysis').parentElement;
        
        // Tạo 3x3 Grid container
        const gridContainer = document.createElement('div');
        gridContainer.id = 'regionalGridContainer';
        gridContainer.className = 'mt-6 bg-green-50 p-6 rounded-xl';
        gridContainer.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-th text-green-500 mr-2"></i>
                Regional Color Distribution (3x3 Grid)
            </h4>
            <div id="regionalGrid" class="grid grid-cols-3 gap-2 max-w-md mx-auto">
                <!-- Grid cells will be populated by JavaScript -->
            </div>
            <div class="mt-4 text-sm text-gray-600 text-center">
                Each cell represents the dominant color in that region of the image
            </div>
        `;
        
        regionalSection.appendChild(gridContainer);
        
        // Render 3x3 Grid
        renderRegionalGrid(regional.regions);
    }
}

// Function để render 3x3 Grid
function renderRegionalGrid(regions) {
    const gridElement = document.getElementById('regionalGrid');
    if (!gridElement) return;
    
    // Tạo 9 cells cho 3x3 grid
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
        cell.className = 'aspect-square rounded-lg border-2 border-white shadow-md relative overflow-hidden cursor-pointer transform hover:scale-105 transition-transform';
        cell.style.backgroundColor = region.dominant_color.hex;
        cell.title = `${regionName}: ${region.dominant_color.hex}`;
        
        // Thêm text overlay với contrast tốt
        const textColor = region.brightness > 0.5 ? '#000000' : '#FFFFFF';
        cell.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-medium" style="color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ${regionName.split('-')[0][0]}${regionName.split('-')[1] ? regionName.split('-')[1][0] : ''}
                </span>
            </div>
        `;
        
        gridElement.appendChild(cell);
    });
}

// Mở rộng Color Spaces để hiển thị LAB
function displayEnhancedColorSpaces(colorSpaces) {
    // Gọi function gốc trước
    if (typeof displayColorSpaces === 'function') {
        displayColorSpaces(colorSpaces);
    }
    
    // Thêm LAB Color Space nếu chưa có
    if (colorSpaces.lab && !document.getElementById('labColorSpace')) {
        const colorSpacesSection = document.querySelector('#colorSpaces').parentElement;
        
        // Tạo LAB Color Space container
        const labContainer = document.createElement('div');
        labContainer.id = 'labColorSpaceContainer';
        labContainer.className = 'mt-6 bg-yellow-50 p-6 rounded-xl';
        labContainer.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-flask text-yellow-500 mr-2"></i>
                LAB Color Space (Perceptually Uniform)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">L* (Lightness)</h5>
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
                            <span class="text-gray-600">Avg:</span>
                            <span class="font-medium">${colorSpaces.lab.lightness?.avg || 50}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">a* (Green-Red)</h5>
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
                            <span class="text-gray-600">Avg:</span>
                            <span class="font-medium">${colorSpaces.lab.a_component?.avg || 0}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">b* (Blue-Yellow)</h5>
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
                            <span class="text-gray-600">Avg:</span>
                            <span class="font-medium">${colorSpaces.lab.b_component?.avg || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 p-3 bg-blue-100 rounded-lg">
                <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-1"></i>
                    LAB color space is perceptually uniform, meaning equal distances represent equal visual differences.
                </p>
            </div>
        `;
        
        colorSpacesSection.appendChild(labContainer);
    }
}

// Mở rộng Characteristics để hiển thị Color Temperature
function displayEnhancedCharacteristics(characteristics) {
    // Gọi function gốc trước
    if (typeof displayColorCharacteristics === 'function') {
        displayColorCharacteristics(characteristics);
    }
    
    // Thêm Color Temperature section nếu chưa có
    if (characteristics.temperature && !document.getElementById('colorTemperature')) {
        const characteristicsSection = document.querySelector('#characteristics').parentElement;
        
        // Tạo Color Temperature container
        const tempContainer = document.createElement('div');
        tempContainer.id = 'colorTemperatureContainer';
        tempContainer.className = 'mt-6 bg-orange-50 p-6 rounded-xl';
        tempContainer.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-thermometer-half text-orange-500 mr-2"></i>
                Color Temperature & Characteristics
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Temperature</h5>
                    <div class="text-2xl font-bold ${getTemperatureColor(characteristics.temperature.classification)} mb-1">
                        ${characteristics.temperature.classification || 'Neutral'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Score: ${characteristics.temperature.temperature_score || 0.5}
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Warm: ${characteristics.temperature.warm_percentage || 50}% | 
                        Cool: ${characteristics.temperature.cool_percentage || 50}%
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Brightness</h5>
                    <div class="text-2xl font-bold text-yellow-600 mb-1">
                        ${characteristics.brightness?.level || 'Medium'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Average: ${(characteristics.brightness?.average * 100 || 50).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.brightness?.distribution || 'Even'}
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Saturation</h5>
                    <div class="text-2xl font-bold text-purple-600 mb-1">
                        ${characteristics.saturation?.level || 'Medium'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Average: ${(characteristics.saturation?.average * 100 || 50).toFixed(1)}%
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.saturation?.vibrancy || 'Moderate'}
                    </div>
                </div>
                <div class="bg-white p-4 rounded-lg">
                    <h5 class="font-medium text-gray-700 mb-2">Harmony</h5>
                    <div class="text-2xl font-bold text-green-600 mb-1">
                        ${characteristics.harmony?.type || 'Mixed'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Score: ${characteristics.harmony?.score || 0.5}
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${characteristics.harmony?.balance || 'Balanced'}
                    </div>
                </div>
            </div>
            <div class="mt-4 p-3 bg-gradient-to-r from-orange-100 to-blue-100 rounded-lg">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-palette mr-1"></i>
                    <strong>Mood:</strong> ${characteristics.mood?.primary || 'Neutral'} • 
                    <strong>Secondary:</strong> ${characteristics.mood?.secondary || 'Balanced'} • 
                    <strong>Impact:</strong> ${characteristics.mood?.emotional_impact || 'Moderate'}
                </p>
            </div>
        `;
        
        characteristicsSection.appendChild(tempContainer);
    }
}

// Helper function để lấy màu cho temperature
function getTemperatureColor(classification) {
    switch(classification?.toLowerCase()) {
        case 'warm': return 'text-red-600';
        case 'cool': return 'text-blue-600';
        case 'neutral': return 'text-gray-600';
        default: return 'text-gray-600';
    }
}

// Function chính để mở rộng tất cả displays
function enhanceAllDisplays(analysisData) {
    console.log('🔧 Enhancing web interface displays...');
    
    // Mở rộng Histograms với HSV
    if (analysisData.histograms) {
        displayEnhancedHistograms(analysisData.histograms);
    }
    
    // Mở rộng Regional Analysis với 3x3 Grid
    if (analysisData.regional_analysis) {
        displayEnhancedRegionalAnalysis(analysisData.regional_analysis);
    }
    
    // Mở rộng Color Spaces với LAB
    if (analysisData.color_spaces) {
        displayEnhancedColorSpaces(analysisData.color_spaces);
    }
    
    // Mở rộng Characteristics với Color Temperature
    if (analysisData.characteristics) {
        displayEnhancedCharacteristics(analysisData.characteristics);
    }
    
    console.log('✅ Web interface enhancements completed');
}

// Export functions để có thể sử dụng từ main script
if (typeof window !== 'undefined') {
    window.enhanceAllDisplays = enhanceAllDisplays;
    window.displayEnhancedHistograms = displayEnhancedHistograms;
    window.displayEnhancedRegionalAnalysis = displayEnhancedRegionalAnalysis;
    window.displayEnhancedColorSpaces = displayEnhancedColorSpaces;
    window.displayEnhancedCharacteristics = displayEnhancedCharacteristics;
}
