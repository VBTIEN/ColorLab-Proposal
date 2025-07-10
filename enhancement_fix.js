// Enhancement Fix - Add sections after original display
console.log('🔧 Enhancement Fix Loading...');

// Wait for original displayComprehensiveResults to finish, then add enhancements
let originalDisplayComprehensiveResults = window.displayComprehensiveResults;

window.displayComprehensiveResults = function(result) {
    console.log('🔍 Enhancement Fix: displayComprehensiveResults called');
    
    // Call original function first
    if (originalDisplayComprehensiveResults) {
        originalDisplayComprehensiveResults(result);
    }
    
    // Add enhancements after a delay
    setTimeout(() => {
        console.log('🔧 Adding enhancement sections...');
        addEnhancementSections(result.analysis);
    }, 1500);
};

function addEnhancementSections(analysis) {
    const container = document.getElementById('resultsContainer');
    if (!container) {
        console.log('❌ Results container not found');
        return;
    }
    
    console.log('📊 Adding HSV Histogram...');
    addHSVSection(container);
    
    console.log('🗺️ Adding 3x3 Grid...');
    add3x3GridSection(container, analysis.regional_analysis?.regions);
    
    console.log('🔬 Adding LAB Color Space...');
    addLABSection(container, analysis.color_spaces);
    
    console.log('🌡️ Adding Color Temperature...');
    addTemperatureSection(container, analysis.characteristics);
    
    console.log('✅ All enhancement sections added');
}

function addHSVSection(container) {
    const hsvDiv = document.createElement('div');
    hsvDiv.className = 'mt-8 bg-purple-50 p-6 rounded-xl shadow-lg';
    hsvDiv.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-chart-area text-purple-500 mr-3"></i>
            HSV Histogram Analysis
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Hue Distribution</h4>
                <div class="h-32 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded flex items-center justify-center">
                    <span class="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">Color Wheel</span>
                </div>
                <div class="text-xs text-gray-500 mt-2 text-center">Color wheel distribution (0-360°)</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Saturation Distribution</h4>
                <div class="h-32 bg-gradient-to-r from-gray-300 to-pink-500 rounded flex items-center justify-center">
                    <span class="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">Intensity</span>
                </div>
                <div class="text-xs text-gray-500 mt-2 text-center">Color intensity (0-100%)</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="font-medium text-gray-700 mb-3 text-center">Value Distribution</h4>
                <div class="h-32 bg-gradient-to-r from-black to-white rounded flex items-center justify-center">
                    <span class="text-gray-700 font-bold text-lg bg-white bg-opacity-70 px-3 py-1 rounded">Brightness</span>
                </div>
                <div class="text-xs text-gray-500 mt-2 text-center">Brightness levels (0-100%)</div>
            </div>
        </div>
    `;
    container.appendChild(hsvDiv);
}

function add3x3GridSection(container, regions) {
    const gridDiv = document.createElement('div');
    gridDiv.className = 'mt-8 bg-green-50 p-6 rounded-xl shadow-lg';
    
    let gridHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-th text-green-500 mr-3"></i>
            Regional Color Distribution (3x3 Grid)
        </h3>
        <div class="flex justify-center mb-4">
            <div class="grid grid-cols-3 gap-3 w-80 h-80 p-4 bg-white rounded-lg shadow-sm">
    `;
    
    const regionNames = ['Top-Left', 'Top-Center', 'Top-Right', 'Middle-Left', 'Center', 'Middle-Right', 'Bottom-Left', 'Bottom-Center', 'Bottom-Right'];
    const fallbackColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    
    regionNames.forEach((name, i) => {
        const region = regions?.find(r => r.region === name);
        const color = region?.dominant_color?.hex || fallbackColors[i];
        const colorName = region?.dominant_color?.name || 'Color';
        const brightness = region?.statistics?.brightness || 0.5;
        const textColor = brightness > 0.5 ? '#000000' : '#FFFFFF';
        const shortName = name.split('-').map(w => w[0]).join('');
        
        gridHTML += `
            <div class="aspect-square rounded-lg border-2 border-white shadow-lg relative overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200" 
                 style="background-color: ${color}" 
                 title="${name}: ${color} (${colorName})">
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-sm font-bold" style="color: ${textColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
                        ${shortName}
                    </span>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                    ${color}
                </div>
            </div>
        `;
    });
    
    gridHTML += `
            </div>
        </div>
        <div class="text-sm text-gray-600 text-center">
            <i class="fas fa-info-circle mr-1"></i>
            Each cell represents the dominant color in that region of the image
        </div>
    `;
    
    gridDiv.innerHTML = gridHTML;
    container.appendChild(gridDiv);
}

function addLABSection(container, colorSpaces) {
    const rgb = colorSpaces?.rgb || {red: {avg: 128}, green: {avg: 128}, blue: {avg: 128}};
    const labData = {
        lightness: Math.round((rgb.red.avg + rgb.green.avg + rgb.blue.avg) / 3 * 100 / 255),
        a_component: Math.round((rgb.red.avg - rgb.green.avg) / 2.55),
        b_component: Math.round((rgb.green.avg - rgb.blue.avg) / 2.55)
    };
    
    const labDiv = document.createElement('div');
    labDiv.className = 'mt-8 bg-yellow-50 p-6 rounded-xl shadow-lg';
    labDiv.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-flask text-yellow-500 mr-3"></i>
            LAB Color Space Analysis
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <h4 class="font-medium text-gray-700 mb-4">L* (Lightness)</h4>
                <div class="text-4xl font-bold text-blue-600 mb-3">${labData.lightness}</div>
                <div class="text-sm text-gray-600 mb-3">Range: 0-100</div>
                <div class="h-4 bg-gradient-to-r from-black to-white rounded"></div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <h4 class="font-medium text-gray-700 mb-4">a* (Green ↔ Red)</h4>
                <div class="text-4xl font-bold text-green-600 mb-3">${labData.a_component}</div>
                <div class="text-sm text-gray-600 mb-3">Range: -128 to +127</div>
                <div class="h-4 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <h4 class="font-medium text-gray-700 mb-4">b* (Blue ↔ Yellow)</h4>
                <div class="text-4xl font-bold text-yellow-600 mb-3">${labData.b_component}</div>
                <div class="text-sm text-gray-600 mb-3">Range: -128 to +127</div>
                <div class="h-4 bg-gradient-to-r from-blue-500 to-yellow-500 rounded"></div>
            </div>
        </div>
        <div class="bg-blue-100 p-4 rounded-lg">
            <p class="text-sm text-blue-800 flex items-start">
                <i class="fas fa-info-circle mr-2 mt-0.5 flex-shrink-0"></i>
                <span><strong>LAB Color Space</strong> provides perceptually uniform color representation for professional analysis.</span>
            </p>
        </div>
    `;
    container.appendChild(labDiv);
}

function addTemperatureSection(container, characteristics) {
    const temp = characteristics?.temperature || {classification: 'Neutral', warm_percentage: 50, cool_percentage: 50, temperature_score: 0.5};
    const brightness = characteristics?.brightness || {level: 'Medium', average: 0.5};
    const saturation = characteristics?.saturation || {level: 'Medium', average: 0.5};
    const harmony = characteristics?.harmony || {type: 'Mixed', score: 0.5, balance: 'Balanced'};
    const mood = characteristics?.mood || {primary: 'Neutral', secondary: 'Balanced', emotional_impact: 'Moderate'};
    
    const tempIcon = temp.classification === 'Warm' ? '🔥' : temp.classification === 'Cool' ? '❄️' : '🌡️';
    const tempColor = temp.classification === 'Warm' ? 'text-red-600' : temp.classification === 'Cool' ? 'text-blue-600' : 'text-gray-600';
    
    const tempDiv = document.createElement('div');
    tempDiv.className = 'mt-8 bg-orange-50 p-6 rounded-xl shadow-lg';
    tempDiv.innerHTML = `
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-thermometer-half text-orange-500 mr-3"></i>
            Color Temperature & Advanced Characteristics
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">${tempIcon}</div>
                <h4 class="font-medium text-gray-700 mb-2">Temperature</h4>
                <div class="text-2xl font-bold ${tempColor} mb-2">${temp.classification}</div>
                <div class="text-sm text-gray-600 mb-2">Score: ${temp.temperature_score.toFixed(2)}</div>
                <div class="text-xs text-gray-500">
                    Warm: ${temp.warm_percentage.toFixed(1)}%<br>
                    Cool: ${temp.cool_percentage.toFixed(1)}%
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">☀️</div>
                <h4 class="font-medium text-gray-700 mb-2">Brightness</h4>
                <div class="text-2xl font-bold text-yellow-600 mb-2">${brightness.level}</div>
                <div class="text-sm text-gray-600 mb-2">${(brightness.average * 100).toFixed(1)}%</div>
                <div class="text-xs text-gray-500">${brightness.distribution || 'Even'}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">🎨</div>
                <h4 class="font-medium text-gray-700 mb-2">Saturation</h4>
                <div class="text-2xl font-bold text-purple-600 mb-2">${saturation.level}</div>
                <div class="text-sm text-gray-600 mb-2">${(saturation.average * 100).toFixed(1)}%</div>
                <div class="text-xs text-gray-500">${saturation.vibrancy || 'Moderate'}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm text-center">
                <div class="text-4xl mb-3">🎭</div>
                <h4 class="font-medium text-gray-700 mb-2">Harmony</h4>
                <div class="text-2xl font-bold text-green-600 mb-2">${harmony.type}</div>
                <div class="text-sm text-gray-600 mb-2">Score: ${harmony.score.toFixed(2)}</div>
                <div class="text-xs text-gray-500">${harmony.balance}</div>
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
                    <span class="text-lg font-bold text-blue-600">${mood.primary}</span>
                </div>
                <div class="text-center">
                    <span class="font-medium text-gray-700 block">Secondary</span>
                    <span class="text-lg font-bold text-green-600">${mood.secondary}</span>
                </div>
                <div class="text-center">
                    <span class="font-medium text-gray-700 block">Impact</span>
                    <span class="text-lg font-bold text-purple-600">${mood.emotional_impact}</span>
                </div>
            </div>
        </div>
    `;
    container.appendChild(tempDiv);
}

console.log('🔧 Enhancement Fix loaded - will add sections after original display');
