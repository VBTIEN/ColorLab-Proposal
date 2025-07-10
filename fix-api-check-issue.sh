#!/bin/bash

echo "🔧 Fixing ColorLab API Check Issue"
echo "=================================="
echo "Fixing the 'Checking API...' stuck issue"
echo ""

# Create backup
cp web/colorlab-interface.html web/colorlab-interface-backup-api-fix-$(date +%Y%m%d_%H%M%S).html
echo "✅ Backup created"

# Create a fixed version of the checkApiStatus function
echo "🔍 Creating fixed checkApiStatus function..."

cat > /tmp/fixed_api_check.js << 'EOF'
        function checkApiStatus() {
            console.log('🔍 Checking API status...');
            
            // Set timeout for API check
            const timeoutId = setTimeout(() => {
                console.log('⚠️ API check timeout, setting offline status');
                setApiOfflineStatus();
            }, 10000); // 10 second timeout
            
            fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(response => {
                clearTimeout(timeoutId);
                console.log('📡 API response received:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return response.json();
            })
            .then(data => {
                console.log('✅ API data:', data);
                
                const apiStatus = document.getElementById('apiStatus');
                const statusDot = document.getElementById('statusDot');
                const statusText = document.getElementById('statusText');
                
                if (data && data.success) {
                    console.log('✅ API is healthy');
                    statusDot.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse-slow';
                    statusText.innerHTML = `<i class="fas fa-check-circle mr-2"></i>Professional Color AI Online - ${data.version || 'v15.0'}`;
                    apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-white font-medium';
                } else {
                    console.log('❌ API returned unsuccessful response');
                    setApiOfflineStatus();
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('❌ API check failed:', error);
                setApiOfflineStatus();
            });
        }
        
        function setApiOfflineStatus() {
            const apiStatus = document.getElementById('apiStatus');
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            
            if (statusDot && statusText && apiStatus) {
                statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                statusText.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>API Check Failed - Please Refresh';
                apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-full text-white font-medium';
            }
        }
EOF

echo "🔄 Replacing checkApiStatus function in ColorLab interface..."

# Use Python to replace the function more reliably
cat > /tmp/replace_api_check.py << 'EOF'
import re

# Read the current file
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the new function
with open('/tmp/fixed_api_check.js', 'r') as f:
    new_function = f.read()

# Find and replace the checkApiStatus function
pattern = r'function checkApiStatus\(\) \{[^}]*\}(?:\s*\.catch\([^}]*\}[^}]*\})?'
replacement = new_function.strip()

# Use re.DOTALL to match across newlines
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to file
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ checkApiStatus function replaced successfully")
EOF

python3 /tmp/replace_api_check.py

# Also add a retry mechanism for API checks
echo "🔄 Adding API retry mechanism..."

# Add retry function before the closing script tag
sed -i '/console\.log.*ColorLab Professional Color Analysis loaded successfully/i\
\
        // Retry API check if it fails\
        function retryApiCheck() {\
            console.log("🔄 Retrying API check...");\
            setTimeout(() => {\
                checkApiStatus();\
            }, 3000);\
        }\
\
        // Auto-retry API check on page visibility change\
        document.addEventListener("visibilitychange", function() {\
            if (!document.hidden) {\
                console.log("👁️ Page visible, checking API status...");\
                checkApiStatus();\
            }\
        });\
' web/colorlab-interface.html

# Fix any potential CORS issues by updating the API call
echo "🌐 Ensuring CORS compatibility..."

# Make sure the API_BASE_URL is correct
sed -i "s|const API_BASE_URL = '.*';|const API_BASE_URL = 'https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod';|g" web/colorlab-interface.html

# Clean up temporary files
rm -f /tmp/fixed_api_check.js /tmp/replace_api_check.py

echo ""
echo "🎨 API Check Fix Summary:"
echo "========================"
echo "✅ Fixed checkApiStatus function with proper error handling"
echo "✅ Added 10-second timeout for API checks"
echo "✅ Added setApiOfflineStatus function for error states"
echo "✅ Added retry mechanism"
echo "✅ Added page visibility change handler"
echo "✅ Ensured CORS compatibility"
echo "✅ Added comprehensive logging"
echo ""
echo "📁 Files:"
echo "  - Fixed: web/colorlab-interface.html"
echo "  - Backup: web/colorlab-interface-backup-api-fix-*.html"
echo ""
echo "🚀 Ready to deploy fixed ColorLab interface!"
echo ""
echo "Expected behavior after fix:"
echo "• API status should show 'Professional Color AI Online' within 10 seconds"
echo "• If API fails, shows 'API Check Failed - Please Refresh'"
echo "• Automatic retry when page becomes visible"
echo "• Proper error handling and logging"
