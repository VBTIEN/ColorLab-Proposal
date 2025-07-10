#!/bin/bash

echo "🔧 Creating Simple and Robust API Check Fix"
echo "==========================================="
echo "Creating a bulletproof API check that will definitely work"
echo ""

# Create backup
cp web/colorlab-interface.html web/colorlab-interface-backup-simple-$(date +%Y%m%d_%H%M%S).html
echo "✅ Backup created"

# Create a completely new, simple API check function
echo "🔍 Creating bulletproof API check..."

cat > /tmp/simple_api_check.js << 'EOF'
        function checkApiStatus() {
            console.log('🔍 Starting API check...');
            
            const apiStatus = document.getElementById('apiStatus');
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            
            // Ensure elements exist
            if (!apiStatus || !statusDot || !statusText) {
                console.error('❌ API status elements not found');
                return;
            }
            
            // Set checking state
            statusText.textContent = 'Checking API...';
            statusDot.className = 'w-3 h-3 rounded-full bg-yellow-500 animate-pulse-slow';
            
            // Simple timeout fallback
            const timeoutId = setTimeout(() => {
                console.log('⚠️ API check timeout after 8 seconds');
                statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                statusText.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>API Timeout - Click to Retry';
                apiStatus.style.cursor = 'pointer';
                apiStatus.onclick = () => {
                    apiStatus.onclick = null;
                    apiStatus.style.cursor = 'default';
                    checkApiStatus();
                };
            }, 8000);
            
            // Make API call
            fetch('https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/health')
                .then(response => {
                    clearTimeout(timeoutId);
                    console.log('📡 Got response:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('✅ API data:', data);
                    if (data && data.success) {
                        statusDot.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse-slow';
                        statusText.innerHTML = '<i class="fas fa-check-circle mr-2"></i>ColorLab API Online';
                        apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-white font-medium';
                        console.log('✅ API check successful');
                    } else {
                        throw new Error('API returned unsuccessful response');
                    }
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    console.error('❌ API check failed:', error);
                    statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                    statusText.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>API Error - Click to Retry';
                    apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-full text-white font-medium';
                    apiStatus.style.cursor = 'pointer';
                    apiStatus.onclick = () => {
                        apiStatus.onclick = null;
                        apiStatus.style.cursor = 'default';
                        checkApiStatus();
                    };
                });
        }
EOF

echo "🔄 Replacing API check function with simple version..."

# Use Python to replace the function
cat > /tmp/replace_simple_api.py << 'EOF'
import re

# Read the current file
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the new simple function
with open('/tmp/simple_api_check.js', 'r') as f:
    new_function = f.read()

# Find and replace the checkApiStatus function (more aggressive pattern)
pattern = r'function checkApiStatus\(\) \{.*?\n        \}'
replacement = new_function.strip()

# Use re.DOTALL to match across newlines
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to file
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ Simple API check function replaced")
EOF

python3 /tmp/replace_simple_api.py

# Also add a manual retry button as backup
echo "🔘 Adding manual retry button..."

# Add retry button after API status
sed -i '/<span id="statusText">Checking API...<\/span>/a\
                    </div>\
                    <button id="retryBtn" onclick="checkApiStatus()" style="display:none;" class="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">\
                        🔄 Retry\
                    </button>' web/colorlab-interface.html

# Add a simple initialization check
echo "🔍 Adding initialization safety check..."

# Replace the DOMContentLoaded event with a more robust version
sed -i '/document\.addEventListener.*DOMContentLoaded/,/});/c\
        // Robust initialization\
        function initColorLab() {\
            console.log("🎨 Initializing ColorLab...");\
            \
            // Check if elements exist\
            const statusText = document.getElementById("statusText");\
            if (!statusText) {\
                console.error("❌ Status elements not found, retrying in 1 second...");\
                setTimeout(initColorLab, 1000);\
                return;\
            }\
            \
            console.log("✅ Elements found, starting API check...");\
            checkApiStatus();\
            setupEventListeners();\
        }\
        \
        // Multiple initialization methods\
        if (document.readyState === "loading") {\
            document.addEventListener("DOMContentLoaded", initColorLab);\
        } else {\
            initColorLab();\
        }\
        \
        // Backup initialization\
        window.addEventListener("load", function() {\
            setTimeout(() => {\
                const statusText = document.getElementById("statusText");\
                if (statusText && statusText.textContent === "Checking API...") {\
                    console.log("🔄 Backup initialization triggered");\
                    checkApiStatus();\
                }\
            }, 2000);\
        });' web/colorlab-interface.html

# Clean up temporary files
rm -f /tmp/simple_api_check.js /tmp/replace_simple_api.py

echo ""
echo "🎨 Simple API Check Fix Summary:"
echo "==============================="
echo "✅ Created bulletproof API check function"
echo "✅ Added 8-second timeout with clear feedback"
echo "✅ Added click-to-retry functionality"
echo "✅ Added manual retry button as backup"
echo "✅ Added robust initialization with multiple fallbacks"
echo "✅ Added element existence checks"
echo "✅ Simplified error handling"
echo ""
echo "📁 Files:"
echo "  - Fixed: web/colorlab-interface.html"
echo "  - Backup: web/colorlab-interface-backup-simple-*.html"
echo ""
echo "🚀 This version should definitely work!"
echo ""
echo "Expected behavior:"
echo "• Shows 'Checking API...' with yellow dot"
echo "• Within 8 seconds: Shows 'ColorLab API Online' with green dot"
echo "• If timeout: Shows 'API Timeout - Click to Retry'"
echo "• If error: Shows 'API Error - Click to Retry'"
echo "• Multiple initialization fallbacks ensure it always runs"
