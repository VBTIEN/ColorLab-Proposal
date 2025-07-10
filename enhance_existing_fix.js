// Fix: Enhance existing sections instead of creating new ones
console.log('🔧 Enhance Existing Fix Loading...');

// Override enhancement fix to enhance existing sections only
let originalDisplayComprehensiveResults = window.displayComprehensiveResults;

window.displayComprehensiveResults = function(result) {
    console.log('🔍 Enhance Existing Fix: displayComprehensiveResults called');
    
    // Call original function first
    if (originalDisplayComprehensiveResults) {
        originalDisplayComprehensiveResults(result);
    }
    
    // Enhance existing sections instead of creating new ones
    setTimeout(() => {
        console.log('🔧 Enhancing existing sections (not creating new ones)...');
        enhanceExistingSections(result.analysis);
    }, 1500);
};

function enhanceExistingSections(analysis) {
    console.log('🎨 Enhancing existing sections with better data...');
    
    // 1. Enhance existing Histograms section (add HSV info)
    enhanceHistogramsSection(analysis.histograms);
    
    // 2. Enhance existing Color Spaces section (add LAB info)  
    enhanceColorSpacesSection(analysis.color_spaces);
    
    // 3. Enhance existing Regional Analysis section (add 3x3 grid)
    enhanceRegionalSection(analysis.regional_analysis);
    
    // 4. Enhance existing Characteristics section (add temperature details)
    enhanceCharacteristicsSection(analysis.characteristics);
    
    console.log('✅ Existing sections enhanced successfully');
}

function enhanceHistogramsSection(histograms) {
    const histogramSection = document.querySelector('h3:contains("Histograms")') || 
                           document.querySelector('[id*="histogram"]') ||
                           document.querySelector('canvas[id*="histogram"]')?.closest('.bg-white');
    
    if (histogramSection) {
        // Add HSV info to existing histogram section
        const hsvInfo = document.createElement('div');
        hsvInfo.className = 'mt-4 p-4 bg-purple-50 rounded-lg';
        hsvInfo.innerHTML = `
            <h5 class="font-medium text-purple-700 mb-2">HSV Analysis</h5>
            <div class="grid grid-cols-3 gap-2 text-sm">
                <div class="text-center">
                    <div class="h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 rounded mb-1"></div>
                    <span class="text-xs text-gray-600">Hue Spectrum</span>
                </div>
                <div class="text-center">
                    <div class="h-8 bg-gradient-to-r from-gray-300 to-pink-500 rounded mb-1"></div>
                    <span class="text-xs text-gray-600">Saturation</span>
                </div>
                <div class="text-center">
                    <div class="h-8 bg-gradient-to-r from-black to-white rounded mb-1"></div>
                    <span class="text-xs text-gray-600">Brightness</span>
                </div>
            </div>
        `;
        histogramSection.appendChild(hsvInfo);
        console.log('📊 Enhanced histograms section with HSV info');
    }
}

function enhanceColorSpacesSection(colorSpaces) {
    const colorSpacesSection = document.getElementById('colorSpaces');
    
    if (colorSpacesSection && colorSpaces?.rgb) {
        // Add LAB info to existing color spaces section
        const labInfo = document.createElement('div');
        labInfo.className = 'bg-yellow-50 p-6 rounded-xl mt-4';
        
        const labData = {
            lightness: Math.round((colorSpaces.rgb.red.avg + colorSpaces.rgb.green.avg + colorSpaces.rgb.blue.avg) / 3 * 100 / 255),
            a_component: Math.round((colorSpaces.rgb.red.avg - colorSpaces.rgb.green.avg) / 2.55),
            b_component: Math.round((colorSpaces.rgb.green.avg - colorSpaces.rgb.blue.avg) / 2.55)
        };
        
        labInfo.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
                <i class="fas fa-triangle text-yellow-500 mr-2"></i>
                LAB Color Space (Enhanced)
            </h4>
            <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">${labData.lightness}</div>
                    <div class="text-sm text-gray-600">L* (Lightness)</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${labData.a_component}</div>
                    <div class="text-sm text-gray-600">a* (Green↔Red)</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-yellow-600">${labData.b_component}</div>
                    <div class="text-sm text-gray-600">b* (Blue↔Yellow)</div>
                </div>
            </div>
        `;
        colorSpacesSection.appendChild(labInfo);
        console.log('🔬 Enhanced color spaces section with LAB info');
    }
}

function enhanceRegionalSection(regionalAnalysis) {
    const regionalSection = document.getElementById('regionalAnalysis');
    
    if (regionalSection && regionalAnalysis?.regions) {
        // Add 3x3 grid to existing regional section
        const gridInfo = document.createElement('div');
        gridInfo.className = 'mt-6 p-4 bg-green-50 rounded-lg';
        
        let gridHTML = `
            <h5 class="font-medium text-green-700 mb-3 text-center">3x3 Color Grid</h5>
            <div class="flex justify-center">
                <div class="grid grid-cols-3 gap-2 w-48 h-48">
        `;
        
        const regionNames = ['Top-Left', 'Top-Center', 'Top-Right', 'Middle-Left', 'Center', 'Middle-Right', 'Bottom-Left', 'Bottom-Center', 'Bottom-Right'];
        const fallbackColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
        
        regionNames.forEach((name, i) => {
            const region = regionalAnalysis.regions.find(r => r.region === name);
            const color = region?.dominant_color?.hex || fallbackColors[i];
            const shortName = name.split('-').map(w => w[0]).join('');
            
            gridHTML += `
                <div class="rounded border-2 border-white shadow-sm" 
                     style="background-color: ${color}" 
                     title="${name}: ${color}">
                    <div class="h-full flex items-center justify-center text-white text-xs font-bold" 
                         style="text-shadow: 1px 1px 2px rgba(0,0,0,0.7)">
                        ${shortName}
                    </div>
                </div>
            `;
        });
        
        gridHTML += `
                </div>
            </div>
        `;
        
        gridInfo.innerHTML = gridHTML;
        regionalSection.appendChild(gridInfo);
        console.log('🗺️ Enhanced regional section with 3x3 grid');
    }
}

function enhanceCharacteristicsSection(characteristics) {
    const characteristicsSection = document.getElementById('colorCharacteristics');
    
    if (characteristicsSection && characteristics?.temperature) {
        // Add temperature details to existing characteristics section
        const tempInfo = document.createElement('div');
        tempInfo.className = 'mt-4 p-4 bg-orange-50 rounded-lg';
        
        const temp = characteristics.temperature;
        const tempIcon = temp.classification === 'Warm' ? '🔥' : temp.classification === 'Cool' ? '❄️' : '🌡️';
        
        tempInfo.innerHTML = `
            <h5 class="font-medium text-orange-700 mb-3 text-center">Enhanced Temperature Analysis</h5>
            <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div class="text-3xl mb-2">${tempIcon}</div>
                    <div class="text-lg font-bold ${temp.classification === 'Warm' ? 'text-red-600' : 'text-blue-600'}">${temp.classification}</div>
                    <div class="text-sm text-gray-600">Classification</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-700 mb-2">${temp.temperature_score.toFixed(2)}</div>
                    <div class="text-sm text-gray-600">Temperature Score</div>
                    <div class="text-xs text-gray-500 mt-1">
                        Warm: ${temp.warm_percentage.toFixed(1)}%<br>
                        Cool: ${temp.cool_percentage.toFixed(1)}%
                    </div>
                </div>
            </div>
        `;
        characteristicsSection.appendChild(tempInfo);
        console.log('🌡️ Enhanced characteristics section with temperature details');
    }
}

console.log('🔧 Enhance Existing Fix loaded - will enhance existing sections only');
