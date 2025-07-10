// Fix Text - Remove AI References
console.log('📝 Text Fix Loading...');

// Override loading text to remove AI references
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Setting up text fixes...');
    
    setTimeout(() => {
        fixLoadingText();
        fixAllAIReferences();
    }, 1000);
});

function fixLoadingText() {
    console.log('📝 Fixing loading text...');
    
    // Find and update loading section
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) {
        // Update the loading content
        const loadingContent = loadingSection.innerHTML;
        
        // Replace AI references with professional terms
        const updatedContent = loadingContent
            .replace(/Analyzing colors with AI\.\.\./g, 'Analyzing colors professionally...')
            .replace(/AI-powered/g, 'Professional')
            .replace(/with AI/g, 'professionally')
            .replace(/AI analysis/g, 'Professional analysis')
            .replace(/AI Color/g, 'Professional Color')
            .replace(/machine learning/g, 'advanced algorithms');
        
        loadingSection.innerHTML = updatedContent;
        console.log('✅ Loading text updated');
    }
}

function fixAllAIReferences() {
    console.log('📝 Fixing all AI references...');
    
    // Fix any remaining AI references in the document
    const textNodes = getTextNodes(document.body);
    
    textNodes.forEach(node => {
        if (node.textContent) {
            let text = node.textContent;
            
            // Replace AI references
            text = text.replace(/Analyzing colors with AI\.\.\./g, 'Analyzing colors professionally...');
            text = text.replace(/AI-powered comprehensive/g, 'Professional comprehensive');
            text = text.replace(/Advanced insights powered by machine learning/g, 'Advanced professional color insights');
            text = text.replace(/AI Color Intelligence/g, 'Professional Color Intelligence');
            text = text.replace(/with AI technology/g, 'with professional algorithms');
            
            if (text !== node.textContent) {
                node.textContent = text;
                console.log('✅ Updated text:', text.substring(0, 50) + '...');
            }
        }
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
            textNodes.push(node);
        }
    }
    
    return textNodes;
}

// Override any functions that might set AI text
const originalPerformProfessionalAnalysis = window.performProfessionalAnalysis;
if (originalPerformProfessionalAnalysis) {
    window.performProfessionalAnalysis = function(selectedFile) {
        console.log('🎨 Starting professional color analysis...');
        
        // Update loading text before calling original function
        setTimeout(() => {
            fixLoadingText();
        }, 100);
        
        return originalPerformProfessionalAnalysis(selectedFile);
    };
}

console.log('📝 Text Fix loaded successfully');
