// Fix Only Duplicate Title - Keep All New Data Blocks
console.log('🔧 Fixing ONLY duplicate title, keeping new data blocks...');

// Find and remove duplicate Color Frequency Analysis titles
function removeDuplicateTitles() {
    console.log('🔍 Searching for duplicate titles...');
    
    // Find all h3 elements with "Color Frequency Analysis" text
    const allH3 = document.querySelectorAll('h3');
    const colorFreqTitles = [];
    
    allH3.forEach(h3 => {
        if (h3.textContent.includes('Color Frequency Analysis')) {
            colorFreqTitles.push(h3);
        }
    });
    
    console.log(`📊 Found ${colorFreqTitles.length} Color Frequency Analysis titles`);
    
    // If more than 1 title found, remove duplicates (keep the first one)
    if (colorFreqTitles.length > 1) {
        for (let i = 1; i < colorFreqTitles.length; i++) {
            console.log(`🗑️ Removing duplicate title ${i + 1}`);
            colorFreqTitles[i].remove();
        }
        
        // Add success indicator
        const firstTitle = colorFreqTitles[0];
        if (firstTitle && !firstTitle.querySelector('.fixed-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'fixed-indicator bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2';
            indicator.innerHTML = '✅ Fixed';
            firstTitle.appendChild(indicator);
        }
        
        console.log('✅ Duplicate titles removed successfully');
    } else {
        console.log('✅ No duplicate titles found');
    }
}

// Monitor for new titles being added and remove duplicates
function monitorForDuplicates() {
    const observer = new MutationObserver((mutations) => {
        let titleAdded = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check if new h3 with Color Frequency Analysis was added
                    if (node.tagName === 'H3' && node.textContent.includes('Color Frequency Analysis')) {
                        titleAdded = true;
                    }
                    // Check children
                    const h3Children = node.querySelectorAll && node.querySelectorAll('h3');
                    if (h3Children) {
                        h3Children.forEach(h3 => {
                            if (h3.textContent.includes('Color Frequency Analysis')) {
                                titleAdded = true;
                            }
                        });
                    }
                }
            });
        });
        
        if (titleAdded) {
            console.log('🔍 New title detected, checking for duplicates...');
            setTimeout(removeDuplicateTitles, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Monitoring for duplicate titles...');
}

// Initialize title fix
function initializeTitleFix() {
    // Remove existing duplicates
    removeDuplicateTitles();
    
    // Monitor for new duplicates
    monitorForDuplicates();
    
    // Periodic check every 5 seconds
    setInterval(removeDuplicateTitles, 5000);
    
    console.log('✅ Title fix initialized - keeping all data blocks intact');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTitleFix);
} else {
    initializeTitleFix();
}

console.log('🔧 Title-only fix loaded');
