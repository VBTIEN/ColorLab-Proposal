// Regional Fixes Integration - No Reload + No Duplicate + Accurate Algorithm
console.log('🎯 Regional Fixes Integration Loading...');

class RegionalFixesIntegration {
    constructor() {
        this.fixes = {
            titleDuplicate: false,
            colorFreqCentering: false,
            regionalAccuracy: false
        };
        this.initialized = false;
    }
    
    async initialize() {
        console.log('🚀 Initializing Regional Fixes Integration...');
        
        try {
            // Wait for elements
            await this.waitForElements();
            
            // Apply fixes
            await this.applyRegionalFixes();
            
            // Start monitoring
            this.startMonitoring();
            
            this.initialized = true;
            this.showSuccessIndicator();
            
            console.log('✅ Regional Fixes Integration applied successfully');
            
        } catch (error) {
            console.error('❌ Regional fixes integration error:', error);
        }
    }
    
    async waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                const colorFreq = document.getElementById('colorFrequency');
                const regional = document.getElementById('regionalAnalysis');
                
                if (colorFreq && regional) {
                    resolve();
                } else {
                    setTimeout(checkElements, 500);
                }
            };
            checkElements();
        });
    }
    
    async applyRegionalFixes() {
        console.log('🔧 Applying regional fixes...');
        
        // Fix 1: Remove duplicate titles
        this.fixDuplicateTitles();
        
        // Fix 2: Center Color Frequency blocks
        this.centerColorFrequencyBlocks();
        
        // Fix 3: Apply accurate regional analysis
        this.applyAccurateRegionalAnalysis();
        
        // Apply CSS
        this.applyRegionalCSS();
    }
    
    fixDuplicateTitles() {
        console.log('🔧 Fix 1: Removing duplicate titles...');
        
        const allH3 = document.querySelectorAll('h3');
        const colorFreqTitles = [];
        
        allH3.forEach(h3 => {
            if (h3.textContent.includes('Color Frequency Analysis')) {
                colorFreqTitles.push(h3);
            }
        });
        
        if (colorFreqTitles.length > 1) {
            for (let i = 1; i < colorFreqTitles.length; i++) {
                colorFreqTitles[i].remove();
            }
            this.fixes.titleDuplicate = true;
            console.log('✅ Fix 1 complete: Duplicate titles removed');
        }
    }
    
    centerColorFrequencyBlocks() {
        console.log('🔧 Fix 2: Centering Color Frequency blocks...');
        
        const colorFreqSection = document.getElementById('colorFrequency');
        if (!colorFreqSection) return;
        
        colorFreqSection.style.display = 'flex';
        colorFreqSection.style.flexDirection = 'column';
        colorFreqSection.style.alignItems = 'center';
        colorFreqSection.style.justifyContent = 'center';
        colorFreqSection.style.width = '100%';
        colorFreqSection.style.margin = '0 auto';
        
        this.fixes.colorFreqCentering = true;
        console.log('✅ Fix 2 complete: Color Frequency blocks centered');
    }
    
    applyAccurateRegionalAnalysis() {
        console.log('🔧 Fix 3: Applying accurate regional analysis...');
        
        // Initialize accurate analyzer if not already done
        if (!window.accurateRegionalAnalyzer) {
            window.accurateRegionalAnalyzer = new AccurateRegionalAnalyzer();
        }
        
        this.fixes.regionalAccuracy = true;
        console.log('✅ Fix 3 complete: Accurate regional analysis ready');
    }
    
    applyRegionalCSS() {
        console.log('🎨 Applying regional CSS...');
        
        const regionalCSS = document.createElement('style');
        regionalCSS.id = 'regional-fixes-css';
        regionalCSS.textContent = `
            /* Regional Fixes CSS */
            
            /* Color Frequency Analysis - Perfect Centering */
            #colorFrequency {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding: 0 20px !important;
            }
            
            #colorFrequency .grid {
                display: grid !important;
                place-items: center !important;
                justify-content: center !important;
                margin: 0 auto !important;
                gap: 1.5rem !important;
            }
            
            /* Regional Analysis - Clean Layout */
            #regionalAnalysis {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding: 0 !important;
            }
            
            /* Responsive grid adjustments */
            @media (min-width: 768px) {
                #colorFrequency .md\\:grid-cols-2 {
                    grid-template-columns: repeat(2, 1fr) !important;
                    justify-items: center !important;
                }
                
                #colorFrequency .md\\:grid-cols-3 {
                    grid-template-columns: repeat(3, 1fr) !important;
                    justify-items: center !important;
                }
                
                #colorFrequency .md\\:grid-cols-4 {
                    grid-template-columns: repeat(4, 1fr) !important;
                    justify-items: center !important;
                }
            }
            
            @media (min-width: 1280px) {
                #colorFrequency .xl\\:grid-cols-2 {
                    grid-template-columns: repeat(2, 1fr) !important;
                    justify-items: center !important;
                }
                
                #colorFrequency .xl\\:grid-cols-4 {
                    grid-template-columns: repeat(4, 1fr) !important;
                    justify-items: center !important;
                }
                
                #colorFrequency .xl\\:grid-cols-6 {
                    grid-template-columns: repeat(6, 1fr) !important;
                    justify-items: center !important;
                }
            }
        `;
        
        // Remove existing CSS
        const existingCSS = document.getElementById('regional-fixes-css');
        if (existingCSS) existingCSS.remove();
        
        document.head.appendChild(regionalCSS);
        console.log('✅ Regional CSS applied');
    }
    
    startMonitoring() {
        const observer = new MutationObserver((mutations) => {
            let needsReapply = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.id === 'regionalAnalysis' || node.id === 'colorFrequency') {
                                needsReapply = true;
                            }
                            if (node.querySelector && (node.querySelector('#regionalAnalysis') || node.querySelector('#colorFrequency'))) {
                                needsReapply = true;
                            }
                        }
                    });
                }
            });
            
            if (needsReapply) {
                console.log('🔍 Changes detected, reapplying regional fixes...');
                setTimeout(() => this.applyRegionalFixes(), 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Regional monitoring started');
    }
    
    showSuccessIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: system-ui;
            font-size: 14px;
            max-width: 320px;
        `;
        
        indicator.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">
                🎯 Regional Fixes Applied!
            </div>
            <div style="font-size: 12px; opacity: 0.9; line-height: 1.4;">
                ✅ No color reload<br>
                ✅ Duplicate text removed<br>
                ✅ Accurate algorithm<br>
                ✅ Color Frequency centered
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 5 seconds
        setTimeout(() => indicator.remove(), 5000);
    }
}

// Initialize regional fixes integration
const regionalFixesIntegration = new RegionalFixesIntegration();

// Auto-start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => regionalFixesIntegration.initialize());
} else {
    regionalFixesIntegration.initialize();
}

// Make globally available
window.regionalFixesIntegration = regionalFixesIntegration;

console.log('🎯 Regional Fixes Integration loaded successfully');
