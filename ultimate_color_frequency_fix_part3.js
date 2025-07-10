// Ultimate Color Frequency Fix - Part 3: CSS Styles + Integration
console.log('🎨 Ultimate Fix Part 3 Loading...');

// Add comprehensive CSS styles
function addUltimateStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Ultimate Color Frequency Layout Styles */
        #colorFrequency {
            width: 100% !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            display: block !important;
        }
        
        /* Ensure perfect centering */
        #colorFrequency .mx-auto {
            margin-left: auto !important;
            margin-right: auto !important;
        }
        
        #colorFrequency .text-center {
            text-align: center !important;
        }
        
        #colorFrequency .justify-center {
            justify-content: center !important;
        }
        
        #colorFrequency .items-center {
            align-items: center !important;
        }
        
        /* Grid system fixes */
        #colorFrequency .grid {
            display: grid !important;
            place-items: center !important;
            gap: 1.5rem !important;
        }
        
        /* Responsive grid columns */
        @media (min-width: 768px) {
            #colorFrequency .md\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            #colorFrequency .md\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }
        }
        
        @media (min-width: 1280px) {
            #colorFrequency .xl\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            #colorFrequency .xl\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }
            #colorFrequency .xl\\:grid-cols-6 {
                grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
            }
        }
        
        /* Card hover effects */
        #colorFrequency .transform:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        
        /* Smooth transitions */
        #colorFrequency .transition-all {
            transition: all 0.3s ease !important;
        }
        
        /* Gradient backgrounds */
        #colorFrequency .bg-gradient-to-br {
            background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important;
        }
        
        /* Shadow enhancements */
        #colorFrequency .shadow-xl {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        
        /* Border radius consistency */
        #colorFrequency .rounded-3xl {
            border-radius: 1.5rem !important;
        }
        
        #colorFrequency .rounded-2xl {
            border-radius: 1rem !important;
        }
        
        #colorFrequency .rounded-xl {
            border-radius: 0.75rem !important;
        }
        
        /* Color swatches */
        #colorFrequency .w-10.h-10 {
            width: 2.5rem !important;
            height: 2.5rem !important;
            border: 3px solid white !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Typography improvements */
        #colorFrequency .font-bold {
            font-weight: 700 !important;
        }
        
        #colorFrequency .font-semibold {
            font-weight: 600 !important;
        }
        
        /* Spacing consistency */
        #colorFrequency .space-y-8 > * + * {
            margin-top: 2rem !important;
        }
        
        #colorFrequency .space-y-4 > * + * {
            margin-top: 1rem !important;
        }
        
        #colorFrequency .gap-8 {
            gap: 2rem !important;
        }
        
        #colorFrequency .gap-6 {
            gap: 1.5rem !important;
        }
        
        #colorFrequency .gap-4 {
            gap: 1rem !important;
        }
        
        #colorFrequency .gap-3 {
            gap: 0.75rem !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 767px) {
            #colorFrequency .px-4 {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }
            
            #colorFrequency .text-3xl {
                font-size: 1.875rem !important;
            }
            
            #colorFrequency .text-2xl {
                font-size: 1.5rem !important;
            }
            
            #colorFrequency .p-8 {
                padding: 1.5rem !important;
            }
        }
        
        /* Loading states */
        #colorFrequency .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: .5;
            }
        }
        
        /* Fix any layout conflicts */
        #colorFrequency * {
            box-sizing: border-box !important;
        }
        
        /* Ensure no overflow issues */
        #colorFrequency {
            overflow: visible !important;
        }
        
        /* Badge styles */
        #colorFrequency .bg-green-50 {
            background-color: #f0fdf4 !important;
        }
        
        #colorFrequency .bg-blue-50 {
            background-color: #eff6ff !important;
        }
        
        #colorFrequency .bg-purple-50 {
            background-color: #faf5ff !important;
        }
        
        /* Icon spacing */
        #colorFrequency .fas {
            margin-right: 0.5rem !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Ultimate styles added');
}

// Complete integration function
function integrateUltimateLayout() {
    console.log('🔧 Integrating ultimate layout...');
    
    // Override any existing displayColorFrequency functions
    const originalDisplay = window.displayColorFrequency;
    
    window.displayColorFrequency = function(colorFrequency) {
        console.log('🎯 Ultimate displayColorFrequency executing...');
        
        const colorFrequencyDiv = document.getElementById('colorFrequency');
        if (!colorFrequencyDiv) {
            console.error('❌ Color frequency div not found');
            return;
        }
        
        try {
            // Generate analysis data
            const enhancedAnalysis = generateUltimateAnalysis(colorFrequency);
            
            // Create main layout
            createUltimateColorFrequencyLayout(colorFrequencyDiv, enhancedAnalysis);
            
            // Add diversity section
            setTimeout(() => {
                addDiversityAndClusteringSection(colorFrequencyDiv, enhancedAnalysis);
            }, 100);
            
            console.log('✅ Ultimate layout integration complete');
            
        } catch (error) {
            console.error('❌ Ultimate layout error:', error);
            createUltimateFallback(colorFrequencyDiv, colorFrequency);
        }
    };
    
    // Backup the original function
    window.displayColorFrequency.original = originalDisplay;
    
    console.log('🔧 Ultimate integration complete');
}

// Initialize everything
function initializeUltimateFix() {
    console.log('🚀 Initializing Ultimate Color Frequency Fix...');
    
    // Add styles first
    addUltimateStyles();
    
    // Setup integration
    integrateUltimateLayout();
    
    // Optimize API performance
    if (typeof optimizeAPIPerformance === 'function') {
        optimizeAPIPerformance();
    }
    
    console.log('✅ Ultimate Color Frequency Fix fully initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUltimateFix);
} else {
    initializeUltimateFix();
}

console.log('🎨 Ultimate Color Frequency Fix Part 3 loaded');
