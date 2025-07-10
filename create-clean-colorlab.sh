#!/bin/bash

echo "🔧 Creating Clean ColorLab Interface"
echo "==================================="
echo "Creating a completely new, clean version to fix API check issue"
echo ""

# Create backup
cp web/colorlab-interface.html web/colorlab-interface-backup-clean-$(date +%Y%m%d_%H%M%S).html
echo "✅ Backup created"

# Create a completely clean API check section
echo "🧹 Creating clean API check JavaScript..."

cat > /tmp/clean_api_check.js << 'EOF'
        // Clean and simple API check
        function checkApiStatus() {
            console.log('🔍 ColorLab: Starting API check...');
            
            // Get elements
            const statusText = document.getElementById('statusText');
            const statusDot = document.getElementById('statusDot');
            const apiStatus = document.getElementById('apiStatus');
            
            if (!statusText || !statusDot || !apiStatus) {
                console.error('❌ ColorLab: Status elements not found');
                setTimeout(checkApiStatus, 1000); // Retry in 1 second
                return;
            }
            
            // Set checking state
            statusText.textContent = 'Checking API...';
            statusDot.className = 'w-3 h-3 rounded-full bg-yellow-500 animate-pulse-slow';
            console.log('🟡 ColorLab: Set checking state');
            
            // Set timeout
            const timeout = setTimeout(() => {
                console.log('⏰ ColorLab: API check timeout');
                statusText.innerHTML = '⚠️ API Timeout - Click to retry';
                statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                apiStatus.style.cursor = 'pointer';
                apiStatus.onclick = () => {
                    apiStatus.style.cursor = 'default';
                    apiStatus.onclick = null;
                    checkApiStatus();
                };
            }, 10000);
            
            // Make API call
            console.log('📡 ColorLab: Making API call...');
            fetch('https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/health')
                .then(response => {
                    clearTimeout(timeout);
                    console.log('📡 ColorLab: Got response:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('✅ ColorLab: API data:', data);
                    if (data && data.success) {
                        statusText.innerHTML = '✅ ColorLab API Online';
                        statusDot.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse-slow';
                        apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-white font-medium';
                        console.log('🟢 ColorLab: API check successful');
                    } else {
                        throw new Error('API returned unsuccessful response');
                    }
                })
                .catch(error => {
                    clearTimeout(timeout);
                    console.error('❌ ColorLab: API check failed:', error);
                    statusText.innerHTML = '❌ API Error - Click to retry';
                    statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                    apiStatus.style.cursor = 'pointer';
                    apiStatus.onclick = () => {
                        apiStatus.style.cursor = 'default';
                        apiStatus.onclick = null;
                        checkApiStatus();
                    };
                });
        }
        
        // Clean initialization
        function initColorLab() {
            console.log('🎨 ColorLab: Initializing...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                console.log('⏳ ColorLab: Waiting for DOM...');
                setTimeout(initColorLab, 100);
                return;
            }
            
            console.log('✅ ColorLab: DOM ready, starting API check');
            checkApiStatus();
            setupEventListeners();
        }
        
        // Multiple initialization triggers
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initColorLab);
        } else {
            initColorLab();
        }
        
        // Backup initialization
        window.addEventListener('load', () => {
            setTimeout(() => {
                const statusText = document.getElementById('statusText');
                if (statusText && statusText.textContent === 'Checking API...') {
                    console.log('🔄 ColorLab: Backup initialization triggered');
                    checkApiStatus();
                }
            }, 2000);
        });
EOF

echo "🔄 Replacing API check code in ColorLab interface..."

# Use Python to clean up and replace the API check code
cat > /tmp/clean_colorlab.py << 'EOF'
import re

# Read the current file
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the clean API check code
with open('/tmp/clean_api_check.js', 'r') as f:
    clean_code = f.read()

# Remove all existing API check related code
patterns_to_remove = [
    r'function checkApiStatus\(\) \{.*?\n        \}',
    r'function setApiOfflineStatus\(\) \{.*?\n        \}',
    r'function retryApiCheck\(\) \{.*?\n        \}',
    r'function initColorLab\(\) \{.*?\n        \}',
    r'document\.addEventListener\("visibilitychange".*?\}\);',
]

for pattern in patterns_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

# Remove duplicate initialization code
content = re.sub(r'document\.addEventListener.*DOMContentLoaded.*initializeApp.*\}\);', '', content, flags=re.DOTALL)
content = re.sub(r'function initializeApp\(\) \{.*?\n        \}', '', content, flags=re.DOTALL)

# Insert the clean code before the closing script tag
insert_position = content.rfind('console.log(\'🎨 ColorLab Professional Color Analysis loaded successfully\');')
if insert_position != -1:
    content = content[:insert_position] + clean_code + '\n        ' + content[insert_position:]
else:
    # Fallback: insert before </script>
    content = content.replace('</script>', clean_code + '\n    </script>')

# Write back to file
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ Clean API check code inserted")
EOF

python3 /tmp/clean_colorlab.py

# Clean up temporary files
rm -f /tmp/clean_api_check.js /tmp/clean_colorlab.py

echo ""
echo "🎨 Clean ColorLab Creation Summary:"
echo "=================================="
echo "✅ Removed all duplicate/conflicting API check code"
echo "✅ Created clean, simple API check function"
echo "✅ Added robust initialization with multiple triggers"
echo "✅ Added comprehensive logging for debugging"
echo "✅ Added 10-second timeout with retry functionality"
echo "✅ Added click-to-retry on error states"
echo ""
echo "📁 Files:"
echo "  - Clean: web/colorlab-interface.html"
echo "  - Backup: web/colorlab-interface-backup-clean-*.html"
echo ""
echo "🚀 This clean version should definitely work!"
echo ""
echo "Expected console logs:"
echo "• 🎨 ColorLab: Initializing..."
echo "• ✅ ColorLab: DOM ready, starting API check"
echo "• 🔍 ColorLab: Starting API check..."
echo "• 🟡 ColorLab: Set checking state"
echo "• 📡 ColorLab: Making API call..."
echo "• 📡 ColorLab: Got response: 200"
echo "• ✅ ColorLab: API data: {...}"
echo "• 🟢 ColorLab: API check successful"
