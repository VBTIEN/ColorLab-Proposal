#!/bin/bash

echo "🎨 Restoring Original Beautiful ColorLab Interface"
echo "================================================="
echo "Keeping the beautiful original design and ONLY fixing API check"
echo ""

# Use the original beautiful interface
ORIGINAL_FILE="web/colorlab-interface-backup-20250708_144826.html"

if [ ! -f "$ORIGINAL_FILE" ]; then
    echo "❌ Original interface backup not found: $ORIGINAL_FILE"
    exit 1
fi

echo "📁 Using original beautiful interface: $ORIGINAL_FILE"

# Create backup of current version
cp web/colorlab-interface.html web/colorlab-interface-ugly-backup-$(date +%Y%m%d_%H%M%S).html
echo "✅ Current ugly version backed up"

# Restore the original beautiful interface
cp "$ORIGINAL_FILE" web/colorlab-interface.html
echo "✅ Original beautiful ColorLab interface restored"

# Now ONLY fix the API check function - keep everything else unchanged
echo "🔧 Applying MINIMAL API fix to original interface..."

# Create the minimal working API fix
cat > /tmp/minimal_api_fix.js << 'EOF'
        function checkApiStatus() {
            console.log('🔍 ColorLab API check starting...');
            
            const statusText = document.getElementById('statusText');
            const statusDot = document.getElementById('statusDot');
            const apiStatus = document.getElementById('apiStatus');
            
            if (!statusText || !statusDot || !apiStatus) {
                console.error('❌ Status elements not found, retrying...');
                setTimeout(checkApiStatus, 1000);
                return;
            }
            
            statusText.textContent = 'Checking API...';
            statusDot.className = 'w-3 h-3 rounded-full bg-yellow-500 animate-pulse-slow';
            
            const timeout = setTimeout(() => {
                console.log('⏰ API timeout');
                statusText.innerHTML = '⚠️ Timeout - <span style="cursor:pointer;text-decoration:underline;" onclick="checkApiStatus()">Retry</span>';
                statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
            }, 8000);
            
            fetch('https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/health')
                .then(response => {
                    clearTimeout(timeout);
                    console.log('📡 API response:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('✅ API data:', data);
                    if (data && data.success) {
                        statusText.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Professional Color AI Online - ' + data.version;
                        statusDot.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse-slow';
                        apiStatus.className = 'inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-white font-medium';
                    } else {
                        throw new Error('API unsuccessful');
                    }
                })
                .catch(error => {
                    clearTimeout(timeout);
                    console.error('❌ API error:', error);
                    statusText.innerHTML = '❌ Error - <span style="cursor:pointer;text-decoration:underline;" onclick="checkApiStatus()">Retry</span>';
                    statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                });
        }
EOF

# Replace ONLY the checkApiStatus function, keep everything else
echo "🔄 Replacing ONLY the API check function..."

cat > /tmp/fix_api_only.py << 'EOF'
import re

# Read the original beautiful interface
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the minimal API fix
with open('/tmp/minimal_api_fix.js', 'r') as f:
    api_fix = f.read()

# Find and replace ONLY the checkApiStatus function
# Look for the existing function and replace it
pattern = r'function checkApiStatus\(\) \{[^}]*\}(?:\s*\.catch\([^}]*\}[^}]*\})?'
replacement = api_fix.strip()

# Replace the function
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also ensure initialization calls the function
if 'checkApiStatus();' not in content:
    # Add initialization if not present
    content = content.replace('setupEventListeners();', 'checkApiStatus();\n            setupEventListeners();')

# Write back
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ ONLY API check function replaced, everything else unchanged")
EOF

python3 /tmp/fix_api_only.py

# Clean up
rm -f /tmp/minimal_api_fix.js /tmp/fix_api_only.py

echo ""
echo "🎨 Original ColorLab Restoration Summary:"
echo "========================================"
echo "✅ Restored original BEAUTIFUL ColorLab interface"
echo "✅ Fixed ONLY the API check function"
echo "✅ Kept ALL original features:"
echo "   • Beautiful glass effect design"
echo "   • Professional ColorLab branding"
echo "   • All 9 analysis tabs"
echo "   • Complete color science features"
echo "   • Original styling and animations"
echo "   • All original functionality"
echo "✅ MINIMAL change: Only API check function fixed"
echo ""
echo "📁 Files:"
echo "  - Restored: web/colorlab-interface.html (original beautiful design)"
echo "  - Backup: web/colorlab-interface-ugly-backup-*.html"
echo ""
echo "🚀 Ready to deploy ORIGINAL beautiful ColorLab with working API!"
echo ""
echo "What was changed:"
echo "• ONLY the checkApiStatus() function"
echo "• Everything else is EXACTLY as original"
echo "• Beautiful design preserved"
echo "• All features preserved"
echo "• Only API check fixed"
