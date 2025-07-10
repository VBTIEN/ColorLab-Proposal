// Web Interface without HSV Histogram - Only existing tabs enhancement

// Override displayComprehensiveResults để chỉ enhance existing tabs
function displayComprehensiveResults(result) {
    console.log('🔍 DEBUG: displayComprehensiveResults called with:', result);
    
    const analysis = result.analysis;
    
    // Hide loading, show results
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    // Display all original sections
    try {
        displayQuickStats(analysis);
        displayDominantColors(analysis.dominant_colors);
        displayColorFrequency(analysis.color_frequency);
        
        // Original histogram display (RGB only)
        if (analysis.histograms) {
            displayHistograms(analysis.histograms);
        }
        
        displayRegionalAnalysis(analysis.regional_analysis);
        displayColorSpaces(analysis.color_spaces);
        displayColorCharacteristics(analysis.characteristics);
        displayAIInsights(analysis);
        
        // Apply enhancements for existing tabs only
        setTimeout(() => {
            enhanceExistingTabsOnly(analysis);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Display error:', error);
    }
}

// Function để enhance chỉ existing tabs (không có HSV)
function enhanceExistingTabsOnly(analysis) {
    console.log('🔧 Enhancing existing tabs only (no HSV)...');
    
    try {
        // 1. Regional Analysis Enhancement (3x3 Grid)
        if (analysis.regional_analysis && analysis.regional_analysis.regions) {
            addRegionalGridSection(analysis.regional_analysis.regions);
        }
        
        // 2. Color Spaces Enhancement (LAB)
        if (analysis.color_spaces) {
            addLABColorSpaceSection(analysis.color_spaces);
        }
        
        // 3. Characteristics Enhancement (Color Temperature)
        if (analysis.characteristics) {
            addColorTemperatureSection(analysis.characteristics);
        }
        
        console.log('✅ Existing tabs enhancements completed (HSV skipped)');
        
    } catch (error) {
        console.error('❌ Enhancement error:', error);
    }
}

// Add Regional Grid Section (existing tab enhancement)
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

// Add LAB Color Space Section (existing tab enhancement)
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

// Add Color Temperature Section (existing tab enhancement)
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
                    ${brightnessData.level}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    ${((brightnessData.average || 0.5) * 100).toFixed(1)}%
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
                    ${((saturationData.average || 0.5) * 100).toFixed(1)}%
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
                    Score: ${(harmonyData.score || 0.5).toFixed(2)}
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
                    <span class="text-lg font-bold text-blue-600">${characteristics.mood?.primary || 'Neutral'}</span>
                </div>
                <div class="text-center">
                    <span class="font-medium text-gray-700 block">Secondary</span>
                    <span class="text-lg font-bold text-green-600">${characteristics.mood?.secondary || 'Balanced'}</span>
                </div>
                <div class="text-center">
                    <span class="font-medium text-gray-700 block">Impact</span>
                    <span class="text-lg font-bold text-purple-600">${characteristics.mood?.emotional_impact || 'Moderate'}</span>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.appendChild(tempSection);
}

// Helper function để render 3x3 grid
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

console.log('🔧 Web interface enhancements loaded (no HSV) - existing tabs only');
