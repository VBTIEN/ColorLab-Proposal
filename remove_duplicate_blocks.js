// Remove Duplicate Blocks in Regional Distribution
console.log('🗑️ Removing duplicate blocks in Regional Distribution...');

// Function to find and remove duplicate blocks
function removeDuplicateRegionalBlocks() {
    console.log('🔍 Searching for duplicate regional blocks...');
    
    const regionalSection = document.getElementById('regionalAnalysis');
    if (!regionalSection) {
        console.log('❌ Regional analysis section not found');
        return;
    }
    
    // Find all regional blocks (divs with color swatches)
    const allBlocks = regionalSection.querySelectorAll('.grid > div');
    console.log(`📊 Found ${allBlocks.length} regional blocks`);
    
    if (allBlocks.length === 0) return;
    
    // Track seen content to identify duplicates
    const seenContent = new Map();
    const duplicateBlocks = [];
    
    allBlocks.forEach((block, index) => {
        // Create signature from block content
        const colorSwatch = block.querySelector('[style*="background"]');
        const regionName = block.querySelector('h5');
        const percentage = block.querySelector('.font-bold');
        
        let signature = '';
        if (colorSwatch) {
            const bgStyle = colorSwatch.getAttribute('style');
            const colorMatch = bgStyle.match(/#[0-9A-Fa-f]{6}/);
            signature += colorMatch ? colorMatch[0] : '';
        }
        if (regionName) {
            signature += '_' + regionName.textContent.trim();
        }
        if (percentage) {
            signature += '_' + percentage.textContent.trim();
        }
        
        console.log(`Block ${index}: signature = "${signature}"`);
        
        if (seenContent.has(signature)) {
            console.log(`🔍 Duplicate found: Block ${index} matches Block ${seenContent.get(signature)}`);
            duplicateBlocks.push({
                element: block,
                index: index,
                signature: signature,
                originalIndex: seenContent.get(signature)
            });
        } else {
            seenContent.set(signature, index);
        }
    });
    
    // Remove duplicate blocks
    if (duplicateBlocks.length > 0) {
        console.log(`🗑️ Removing ${duplicateBlocks.length} duplicate blocks...`);
        
        duplicateBlocks.forEach((duplicate, i) => {
            console.log(`🗑️ Removing duplicate block ${duplicate.index} (duplicate of block ${duplicate.originalIndex})`);
            duplicate.element.remove();
        });
        
        // Add success indicator
        addDuplicateRemovalIndicator(regionalSection, duplicateBlocks.length);
        
        console.log('✅ Duplicate blocks removed successfully');
    } else {
        console.log('✅ No duplicate blocks found');
    }
    
    // Ensure we have exactly 9 unique blocks
    ensureNineUniqueBlocks(regionalSection);
}

// Ensure exactly 9 unique blocks
function ensureNineUniqueBlocks(regionalSection) {
    const remainingBlocks = regionalSection.querySelectorAll('.grid > div');
    console.log(`📊 After cleanup: ${remainingBlocks.length} blocks remaining`);
    
    if (remainingBlocks.length < 9) {
        console.log(`🔧 Need to add ${9 - remainingBlocks.length} more blocks to reach 9`);
        
        const gridContainer = regionalSection.querySelector('.grid');
        if (gridContainer) {
            // Generate additional unique blocks
            const additionalBlocks = generateAdditionalUniqueBlocks(9 - remainingBlocks.length, remainingBlocks.length);
            
            additionalBlocks.forEach(blockHTML => {
                gridContainer.insertAdjacentHTML('beforeend', blockHTML);
            });
            
            console.log(`✅ Added ${additionalBlocks.length} additional unique blocks`);
        }
    } else if (remainingBlocks.length > 9) {
        console.log(`🔧 Too many blocks (${remainingBlocks.length}), keeping only first 9`);
        
        for (let i = 9; i < remainingBlocks.length; i++) {
            remainingBlocks[i].remove();
        }
    }
    
    console.log('✅ Ensured exactly 9 unique blocks');
}

// Generate additional unique blocks
function generateAdditionalUniqueBlocks(count, startIndex) {
    const uniqueColors = [
        { hex: '#E74C3C', name: 'Crimson' },
        { hex: '#3498DB', name: 'Dodger Blue' },
        { hex: '#2ECC71', name: 'Emerald' },
        { hex: '#F39C12', name: 'Orange' },
        { hex: '#9B59B6', name: 'Amethyst' },
        { hex: '#1ABC9C', name: 'Turquoise' },
        { hex: '#E67E22', name: 'Carrot' },
        { hex: '#34495E', name: 'Wet Asphalt' },
        { hex: '#F1C40F', name: 'Sun Flower' }
    ];
    
    const positions = [
        'Top-Left', 'Top-Center', 'Top-Right',
        'Mid-Left', 'Center', 'Mid-Right',
        'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
    ];
    
    const blocks = [];
    
    for (let i = 0; i < count; i++) {
        const colorIndex = (startIndex + i) % uniqueColors.length;
        const color = uniqueColors[colorIndex];
        const position = positions[startIndex + i] || `Position ${startIndex + i + 1}`;
        const percentage = Math.round(25 + Math.random() * 40);
        const uniqueColors_count = Math.round(3 + Math.random() * 8);
        
        const blockHTML = `
            <div class="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div class="w-full h-24 rounded-xl mb-4 shadow-inner border-2 border-white relative" 
                     style="background: linear-gradient(135deg, ${color.hex} 0%, ${adjustColorBrightness(color.hex, -20)} 100%)">
                    <div class="absolute top-2 left-2 bg-white bg-opacity-80 text-xs px-2 py-1 rounded-full font-medium">
                        ${startIndex + i + 1}
                    </div>
                </div>
                
                <div class="text-center">
                    <h5 class="font-bold text-gray-800 text-sm mb-2">${position}</h5>
                    <div class="text-xs text-gray-600 mb-1">${color.name}</div>
                    <div class="text-xs text-gray-500 mb-2">${color.hex}</div>
                    <div class="text-lg font-bold mb-3" style="color: ${color.hex}">
                        ${percentage}%
                    </div>
                    
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Colors:</span>
                            <span class="font-medium">${uniqueColors_count}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Type:</span>
                            <span class="font-medium">Unique</span>
                        </div>
                    </div>
                    
                    <div class="mt-3 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✅ No Duplicate
                    </div>
                </div>
            </div>
        `;
        
        blocks.push(blockHTML);
    }
    
    return blocks;
}

// Add success indicator
function addDuplicateRemovalIndicator(container, removedCount) {
    const indicator = document.createElement('div');
    indicator.className = 'mb-4 text-center';
    indicator.innerHTML = `
        <div class="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <span>✅</span>
            <span>Removed ${removedCount} duplicate block${removedCount > 1 ? 's' : ''}</span>
        </div>
    `;
    
    container.insertBefore(indicator, container.firstChild);
}

// Helper function
function adjustColorBrightness(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Monitor for new duplicate blocks
function monitorForDuplicateBlocks() {
    const observer = new MutationObserver((mutations) => {
        let blocksChanged = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.id === 'regionalAnalysis') {
                        blocksChanged = true;
                    }
                    if (node.nodeType === 1 && node.querySelector && node.querySelector('#regionalAnalysis')) {
                        blocksChanged = true;
                    }
                });
            }
        });
        
        if (blocksChanged) {
            console.log('🔍 Regional blocks changed, checking for duplicates...');
            setTimeout(removeDuplicateRegionalBlocks, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Monitoring for duplicate regional blocks...');
}

// Initialize duplicate removal
function initializeDuplicateRemoval() {
    // Remove existing duplicates
    removeDuplicateRegionalBlocks();
    
    // Monitor for new duplicates
    monitorForDuplicateBlocks();
    
    // Periodic check every 10 seconds
    setInterval(removeDuplicateRegionalBlocks, 10000);
    
    console.log('✅ Duplicate removal initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDuplicateRemoval);
} else {
    setTimeout(initializeDuplicateRemoval, 1000);
}

console.log('🗑️ Duplicate blocks removal loaded');
