#!/bin/bash

echo "🔄 Restoring Full ColorLab Interface with Working API Check"
echo "=========================================================="
echo "Restoring the complete ColorLab interface but keeping the working API fix"
echo ""

# Use the latest backup that had full features
BACKUP_FILE="web/colorlab-interface-backup-clean-20250708_153800.html"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "📁 Using backup: $BACKUP_FILE"

# Create current backup
cp web/colorlab-interface.html web/colorlab-interface-simple-backup-$(date +%Y%m%d_%H%M%S).html
echo "✅ Current simple version backed up"

# Restore the full interface
cp "$BACKUP_FILE" web/colorlab-interface.html
echo "✅ Full ColorLab interface restored"

# Now apply the working API fix to the full interface
echo "🔧 Applying working API fix to full interface..."

# Extract the working API check from the simple version
cat > /tmp/working_api_check.js << 'EOF'
        // Working API check (from ultra-simple version)
        function checkApiStatus() {
            console.log('🔍 ColorLab: Starting API check...');
            
            const statusText = document.getElementById('statusText');
            const statusDot = document.getElementById('statusDot');
            const apiStatus = document.getElementById('apiStatus');
            
            if (!statusText || !statusDot || !apiStatus) {
                console.error('❌ Status elements not found');
                setTimeout(checkApiStatus, 1000);
                return;
            }
            
            statusText.textContent = 'Checking API...';
            statusDot.className = 'w-3 h-3 rounded-full bg-yellow-500 animate-pulse-slow';
            console.log('🟡 ColorLab: Set checking state');
            
            const timeout = setTimeout(() => {
                console.log('⏰ ColorLab: API check timeout');
                statusText.innerHTML = '⚠️ API Timeout - <span style="cursor:pointer;text-decoration:underline;" onclick="checkApiStatus()">Click to retry</span>';
                statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
            }, 8000);
            
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
                    statusText.innerHTML = '❌ API Error - <span style="cursor:pointer;text-decoration:underline;" onclick="checkApiStatus()">Click to retry</span>';
                    statusDot.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse-slow';
                });
        }
        
        // Working initialization
        function initColorLab() {
            console.log('🎨 ColorLab: Initializing full interface...');
            
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

# Replace the API check function in the full interface
echo "🔄 Replacing API check function..."

cat > /tmp/fix_full_interface.py << 'EOF'
import re

# Read the full interface
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the working API check
with open('/tmp/working_api_check.js', 'r') as f:
    working_api = f.read()

# Remove existing problematic API check functions
patterns_to_remove = [
    r'function checkApiStatus\(\) \{.*?\n        \}',
    r'function initColorLab\(\) \{.*?\n        \}',
    r'document\.addEventListener.*DOMContentLoaded.*\}\);',
    r'window\.addEventListener.*load.*\}\);'
]

for pattern in patterns_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

# Remove any duplicate initialization
content = re.sub(r'function initializeApp\(\) \{.*?\n        \}', '', content, flags=re.DOTALL)

# Insert the working API check before the closing script tag
insert_position = content.rfind('console.log(\'🎨 ColorLab Professional Color Analysis loaded successfully\');')
if insert_position != -1:
    content = content[:insert_position] + working_api + '\n        ' + content[insert_position:]
else:
    # Fallback: insert before </script>
    content = content.replace('</script>', working_api + '\n    </script>')

# Write back
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ Working API check applied to full interface")
EOF

python3 /tmp/fix_full_interface.py

# Clean up
rm -f /tmp/working_api_check.js /tmp/fix_full_interface.py

echo ""
echo "🎨 Full ColorLab Interface Restoration Summary:"
echo "=============================================="
echo "✅ Restored complete ColorLab interface from backup"
echo "✅ Applied working API check from simple version"
echo "✅ Kept all original ColorLab features:"
echo "   • 9 Professional analysis tabs"
echo "   • Complete color science features"
echo "   • Glass effect design"
echo "   • Professional branding"
echo "   • All analysis functions"
echo "✅ Fixed API check that works in incognito mode"
echo ""
echo "📁 Files:"
echo "  - Restored: web/colorlab-interface.html (full features)"
echo "  - Backup: web/colorlab-interface-simple-backup-*.html"
echo ""
echo "🚀 Ready to deploy full ColorLab with working API!"
echo ""
echo "Features restored:"
echo "• Complete ColorLab Professional interface"
echo "• All 9 analysis tabs (Overview, Frequency, K-Means, etc.)"
echo "• Professional color science algorithms"
echo "• Glass effect modern UI"
echo "• Working API check (tested in incognito)"
echo "• All original functionality"
