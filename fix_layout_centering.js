// Fix Layout Centering Issues
console.log('🎯 Fixing layout centering issues...');

// Fix Color Frequency Analysis centering
function fixColorFrequencyCentering() {
    console.log('🔧 Fixing Color Frequency Analysis centering...');
    
    const colorFreqSection = document.getElementById('colorFrequency');
    if (!colorFreqSection) {
        console.log('❌ Color Frequency section not found');
        return;
    }
    
    // Add centering CSS
    const centeringStyle = document.createElement('style');
    centeringStyle.id = 'color-freq-centering-fix';
    centeringStyle.textContent = `
        /* Color Frequency Analysis Centering Fix */
        #colorFrequency {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
        }
        
        #colorFrequency > * {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
        }
        
        #colorFrequency .grid {
            display: grid !important;
            place-items: center !important;
            justify-content: center !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 1000px !important;
        }
        
        #colorFrequency .grid > div {
            margin: 0 auto !important;
            text-align: center !important;
        }
        
        /* Responsive grid centering */
        @media (min-width: 768px) {
            #colorFrequency .md\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 1.5rem !important;
                justify-items: center !important;
            }
            #colorFrequency .md\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 1.5rem !important;
                justify-items: center !important;
            }
            #colorFrequency .md\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                gap: 1.5rem !important;
                justify-items: center !important;
            }
        }
        
        @media (min-width: 1024px) {
            #colorFrequency .lg\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 2rem !important;
                justify-items: center !important;
            }
            #colorFrequency .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 2rem !important;
                justify-items: center !important;
            }
            #colorFrequency .lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                gap: 2rem !important;
                justify-items: center !important;
            }
        }
        
        @media (min-width: 1280px) {
            #colorFrequency .xl\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 2rem !important;
                justify-items: center !important;
            }
            #colorFrequency .xl\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                gap: 2rem !important;
                justify-items: center !important;
            }
            #colorFrequency .xl\\:grid-cols-6 {
                grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                gap: 1.5rem !important;
                justify-items: center !important;
            }
        }
    `;
    
    // Remove existing style if present
    const existingStyle = document.getElementById('color-freq-centering-fix');
    if (existingStyle) existingStyle.remove();
    
    document.head.appendChild(centeringStyle);
    console.log('✅ Color Frequency centering CSS applied');
}

// Fix Regional Distribution positioning and flickering
function fixRegionalDistributionLayout() {
    console.log('🔧 Fixing Regional Distribution layout...');
    
    const regionalSection = document.getElementById('regionalAnalysis');
    if (!regionalSection) {
        console.log('❌ Regional Analysis section not found');
        return;
    }
    
    // Add regional layout fix CSS
    const regionalStyle = document.createElement('style');
    regionalStyle.id = 'regional-layout-fix';
    regionalStyle.textContent = `
        /* Regional Distribution Layout Fix */
        #regionalAnalysis {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
        }
        
        #regionalAnalysis > * {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
        }
        
        #regionalAnalysis .grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem !important;
            place-items: center !important;
            justify-content: center !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 800px !important;
        }
        
        #regionalAnalysis .grid > div {
            width: 100% !important;
            max-width: 200px !important;
            margin: 0 auto !important;
            text-align: center !important;
            /* Fix flickering/hiding issues */
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            position: static !important;
            transform: none !important;
            transition: all 0.3s ease !important;
        }
        
        /* Prevent flickering on hover */
        #regionalAnalysis .grid > div:hover {
            opacity: 1 !important;
            visibility: visible !important;
            transform: scale(1.05) !important;
        }
        
        /* Ensure 3x3 grid layout */
        @media (min-width: 640px) {
            #regionalAnalysis .grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.5rem !important;
                max-width: 900px !important;
            }
        }
        
        @media (min-width: 768px) {
            #regionalAnalysis .grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 2rem !important;
                max-width: 1000px !important;
            }
            
            #regionalAnalysis .grid > div {
                max-width: 250px !important;
            }
        }
        
        /* Fix any absolute positioning issues */
        #regionalAnalysis * {
            position: relative !important;
        }
        
        /* Remove any conflicting transforms */
        #regionalAnalysis .transform {
            transform: none !important;
        }
        
        #regionalAnalysis .transform:hover {
            transform: scale(1.05) !important;
        }
    `;
    
    // Remove existing style if present
    const existingRegionalStyle = document.getElementById('regional-layout-fix');
    if (existingRegionalStyle) existingRegionalStyle.remove();
    
    document.head.appendChild(regionalStyle);
    console.log('✅ Regional Distribution layout CSS applied');
}

// Apply layout fixes immediately
function applyLayoutFixes() {
    console.log('🎯 Applying all layout fixes...');
    
    // Fix Color Frequency centering
    fixColorFrequencyCentering();
    
    // Fix Regional Distribution layout
    fixRegionalDistributionLayout();
    
    // Force re-render
    setTimeout(() => {
        const colorFreqSection = document.getElementById('colorFrequency');
        const regionalSection = document.getElementById('regionalAnalysis');
        
        if (colorFreqSection) {
            colorFreqSection.style.display = 'none';
            colorFreqSection.offsetHeight; // Force reflow
            colorFreqSection.style.display = '';
        }
        
        if (regionalSection) {
            regionalSection.style.display = 'none';
            regionalSection.offsetHeight; // Force reflow
            regionalSection.style.display = '';
        }
        
        console.log('✅ Layout fixes applied and re-rendered');
    }, 100);
    
    // Add success indicator
    showLayoutFixIndicator();
}

// Show success indicator
function showLayoutFixIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #059669, #10B981);
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: system-ui;
        font-size: 14px;
        font-weight: 600;
    `;
    
    indicator.innerHTML = `
        <div>🎯 Layout Fixed!</div>
        <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">
            ✅ Color Frequency centered<br>
            ✅ Regional blocks positioned
        </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Auto-remove after 4 seconds
    setTimeout(() => indicator.remove(), 4000);
}

// Monitor for layout changes and reapply fixes
function monitorLayoutChanges() {
    const observer = new MutationObserver((mutations) => {
        let needsRefix = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.id === 'colorFrequency' || node.id === 'regionalAnalysis') {
                            needsRefix = true;
                        }
                        if (node.querySelector && (node.querySelector('#colorFrequency') || node.querySelector('#regionalAnalysis'))) {
                            needsRefix = true;
                        }
                    }
                });
            }
        });
        
        if (needsRefix) {
            console.log('🔍 Layout changes detected, reapplying fixes...');
            setTimeout(applyLayoutFixes, 200);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Monitoring for layout changes...');
}

// Initialize layout fixes
function initializeLayoutFixes() {
    console.log('🚀 Initializing layout fixes...');
    
    // Apply fixes immediately
    applyLayoutFixes();
    
    // Monitor for changes
    monitorLayoutChanges();
    
    // Periodic reapplication
    setInterval(applyLayoutFixes, 10000);
    
    console.log('✅ Layout fixes initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLayoutFixes);
} else {
    initializeLayoutFixes();
}

console.log('🎯 Layout centering fix loaded');
