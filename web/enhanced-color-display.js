// Enhanced Color Display Functions for Web Interface

function displayColorsEnhanced(colors) {
    const container = document.getElementById('colorResults');
    
    if (!colors || colors.length === 0) {
        container.innerHTML = '<div class="result-card"><p>No colors detected.</p></div>';
        return;
    }
    
    const html = `
        <div class="result-card">
            <h3>🎨 Enhanced Color Analysis</h3>
            <div class="color-analysis-summary">
                <p><strong>Total Colors Detected:</strong> ${colors.length}</p>
                <p><strong>Analysis Method:</strong> Enhanced Smart Algorithm</p>
            </div>
            ${colors.map((color, index) => `
                <div class="enhanced-color-item" data-color-index="${index}">
                    <div class="color-main-info">
                        <div class="color-swatch-enhanced" style="background-color: ${color.hex}"></div>
                        <div class="color-primary-details">
                            <div class="color-name-enhanced">
                                <strong>${color.color}</strong>
                                <span class="color-percentage">${color.percentage}%</span>
                            </div>
                            <div class="color-hex-rgb">
                                <span class="hex-code">${color.hex}</span>
                                <span class="rgb-values">RGB(${color.rgb.join(', ')})</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="color-detailed-info">
                        <div class="color-properties">
                            <div class="color-property">
                                <span class="property-label">Temperature:</span>
                                <span class="property-value temperature-${color.temperature}">
                                    ${getTemperatureIcon(color.temperature)} ${color.temperature.charAt(0).toUpperCase() + color.temperature.slice(1)}
                                </span>
                            </div>
                            
                            <div class="color-property">
                                <span class="property-label">Brightness:</span>
                                <span class="property-value brightness-${color.brightness}">
                                    ${getBrightnessIcon(color.brightness)} ${color.brightness.charAt(0).toUpperCase() + color.brightness.slice(1)}
                                </span>
                            </div>
                            
                            ${color.hsv ? `
                                <div class="color-property hsv-info">
                                    <span class="property-label">HSV:</span>
                                    <div class="hsv-values">
                                        <span class="hsv-component">H: ${color.hsv.hue}°</span>
                                        <span class="hsv-component">S: ${color.hsv.saturation}%</span>
                                        <span class="hsv-component">V: ${color.hsv.value}%</span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="color-usage-suggestions">
                            <div class="usage-title">💡 Usage Suggestions:</div>
                            <div class="usage-tags">
                                ${generateUsageTags(color)}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <div class="color-palette-summary">
                <h4>🎨 Color Palette Overview</h4>
                <div class="palette-bar">
                    ${colors.map(color => `
                        <div class="palette-segment" 
                             style="background-color: ${color.hex}; width: ${color.percentage}%"
                             title="${color.color} - ${color.percentage}%">
                        </div>
                    `).join('')}
                </div>
                <div class="palette-analysis">
                    ${generatePaletteAnalysis(colors)}
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add click handlers for color items
    addColorInteractionHandlers();
}

function getTemperatureIcon(temperature) {
    switch(temperature) {
        case 'warm': return '🔥';
        case 'cool': return '❄️';
        case 'neutral': return '⚪';
        default: return '🎨';
    }
}

function getBrightnessIcon(brightness) {
    switch(brightness) {
        case 'light': return '☀️';
        case 'medium': return '🌤️';
        case 'dark': return '🌙';
        default: return '💡';
    }
}

function generateUsageTags(color) {
    const tags = [];
    
    // Temperature-based suggestions
    if (color.temperature === 'warm') {
        tags.push('Cozy Interiors', 'Food & Dining', 'Energy & Action');
    } else if (color.temperature === 'cool') {
        tags.push('Professional', 'Technology', 'Calm & Relaxing');
    } else {
        tags.push('Versatile', 'Background', 'Neutral Base');
    }
    
    // Brightness-based suggestions
    if (color.brightness === 'light') {
        tags.push('Backgrounds', 'Minimalist');
    } else if (color.brightness === 'dark') {
        tags.push('Text', 'Accents', 'Contrast');
    }
    
    // Color-specific suggestions
    const colorName = color.color.toLowerCase();
    if (colorName.includes('blue')) {
        tags.push('Trust', 'Corporate', 'Sky & Water');
    } else if (colorName.includes('red')) {
        tags.push('Attention', 'Passion', 'Warning');
    } else if (colorName.includes('green')) {
        tags.push('Nature', 'Growth', 'Health');
    } else if (colorName.includes('yellow')) {
        tags.push('Happiness', 'Energy', 'Caution');
    }
    
    return tags.slice(0, 4).map(tag => 
        `<span class="usage-tag">${tag}</span>`
    ).join('');
}

function generatePaletteAnalysis(colors) {
    const totalWarm = colors.filter(c => c.temperature === 'warm').length;
    const totalCool = colors.filter(c => c.temperature === 'cool').length;
    const totalNeutral = colors.filter(c => c.temperature === 'neutral').length;
    
    const dominantTemp = totalWarm > totalCool ? 
        (totalWarm > totalNeutral ? 'warm' : 'neutral') :
        (totalCool > totalNeutral ? 'cool' : 'neutral');
    
    let analysis = `<strong>Palette Character:</strong> `;
    
    if (dominantTemp === 'warm') {
        analysis += `🔥 Warm & Energetic - Great for creating cozy, inviting atmospheres`;
    } else if (dominantTemp === 'cool') {
        analysis += `❄️ Cool & Professional - Perfect for modern, calming designs`;
    } else {
        analysis += `⚪ Balanced & Versatile - Suitable for various design applications`;
    }
    
    return analysis;
}

function addColorInteractionHandlers() {
    const colorItems = document.querySelectorAll('.enhanced-color-item');
    
    colorItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Toggle detailed view
            const detailedInfo = item.querySelector('.color-detailed-info');
            const isExpanded = detailedInfo.style.display === 'block';
            
            // Collapse all other items
            colorItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.color-detailed-info').style.display = 'none';
                    otherItem.classList.remove('expanded');
                }
            });
            
            // Toggle current item
            detailedInfo.style.display = isExpanded ? 'none' : 'block';
            item.classList.toggle('expanded', !isExpanded);
        });
        
        // Copy color code on double click
        item.addEventListener('dblclick', (e) => {
            e.preventDefault();
            const hexCode = item.querySelector('.hex-code').textContent;
            copyToClipboard(hexCode);
            showColorCopiedMessage(hexCode);
        });
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showColorCopiedMessage(hexCode) {
    const message = document.createElement('div');
    message.className = 'color-copied-message';
    message.innerHTML = `✅ Copied ${hexCode} to clipboard!`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Enhanced CSS for color display
const enhancedColorCSS = `
<style>
.enhanced-color-item {
    margin-bottom: 15px;
    padding: 15px;
    background: white;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: all 0.3s ease;
}

.enhanced-color-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.enhanced-color-item.expanded {
    border-color: #3498db;
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.2);
}

.color-main-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.color-swatch-enhanced {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #ddd;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    flex-shrink: 0;
}

.color-primary-details {
    flex: 1;
}

.color-name-enhanced {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.color-percentage {
    background: #3498db;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: 600;
}

.color-hex-rgb {
    display: flex;
    gap: 15px;
    font-family: monospace;
    font-size: 0.9em;
    color: #666;
}

.hex-code {
    font-weight: 600;
    color: #2c3e50;
}

.color-detailed-info {
    display: none;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.color-properties {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.color-property {
    display: flex;
    align-items: center;
    gap: 8px;
}

.property-label {
    font-weight: 600;
    color: #555;
    min-width: 80px;
}

.property-value {
    padding: 4px 8px;
    border-radius: 15px;
    font-size: 0.9em;
    font-weight: 500;
}

.temperature-warm { background: #ffe6e6; color: #d63031; }
.temperature-cool { background: #e6f3ff; color: #0984e3; }
.temperature-neutral { background: #f0f0f0; color: #636e72; }

.brightness-light { background: #fff9e6; color: #f39c12; }
.brightness-medium { background: #f0f8ff; color: #3498db; }
.brightness-dark { background: #e6e6e6; color: #2c3e50; }

.hsv-values {
    display: flex;
    gap: 10px;
}

.hsv-component {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8em;
    font-family: monospace;
}

.color-usage-suggestions {
    margin-top: 10px;
}

.usage-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #2c3e50;
}

.usage-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.usage-tag {
    background: #ecf0f1;
    color: #2c3e50;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 500;
}

.color-analysis-summary {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 0.9em;
}

.color-palette-summary {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 2px solid #eee;
}

.palette-bar {
    display: flex;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.palette-segment {
    transition: all 0.3s ease;
}

.palette-segment:hover {
    filter: brightness(1.1);
}

.palette-analysis {
    background: #f0f8ff;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    font-size: 0.9em;
    line-height: 1.4;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
    .color-main-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .color-properties {
        grid-template-columns: 1fr;
    }
    
    .hsv-values {
        flex-direction: column;
        gap: 4px;
    }
}
</style>
`;

// Inject enhanced CSS
if (!document.getElementById('enhanced-color-css')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'enhanced-color-css';
    styleElement.innerHTML = enhancedColorCSS;
    document.head.appendChild(styleElement);
}

// Override the original displayColors function
window.displayColors = displayColorsEnhanced;
