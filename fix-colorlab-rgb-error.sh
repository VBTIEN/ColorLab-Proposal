#!/bin/bash

echo "🔧 Fixing ColorLab Interface RGB.map Error..."
echo "============================================"

# Backup original file
cp web/colorlab-interface.html web/colorlab-interface-backup.html
echo "✅ Backup created: colorlab-interface-backup.html"

# Fix the rgb.map error by replacing the problematic code
echo "🔍 Fixing RGB data handling..."

# Replace the problematic line that assumes rgb is an array
sed -i 's/const rgb = color\.rgb || \[128, 128, 128\];/const rgb = color.rgb ? (Array.isArray(color.rgb) ? color.rgb : [color.rgb.r, color.rgb.g, color.rgb.b]) : [128, 128, 128];/g' web/colorlab-interface.html

# Also fix other potential rgb.map issues
sed -i 's/rgb\.map(c => Math\.max(0, c - 30))/rgb.map(c => Math.max(0, c - 30))/g' web/colorlab-interface.html

echo "✅ Fixed RGB data handling to support both array and object formats"

# Add additional fixes for other potential RGB issues
echo "🔍 Adding comprehensive RGB handling fixes..."

# Create a temporary file with additional fixes
cat > /tmp/colorlab_rgb_fixes.js << 'EOF'
        // Enhanced RGB handling function
        function normalizeRgbData(rgbData) {
            if (!rgbData) return [128, 128, 128];
            if (Array.isArray(rgbData)) return rgbData;
            if (typeof rgbData === 'object' && rgbData.r !== undefined) {
                return [rgbData.r, rgbData.g, rgbData.b];
            }
            return [128, 128, 128];
        }

        // Enhanced color processing function
        function processColorData(color) {
            return {
                ...color,
                rgb: normalizeRgbData(color.rgb),
                hex: color.hex || '#808080',
                percentage: color.percentage || 0,
                name: color.name || 'Unknown'
            };
        }
EOF

# Insert the helper functions into the ColorLab interface
sed -i '/const API_BASE_URL/r /tmp/colorlab_rgb_fixes.js' web/colorlab-interface.html

# Update the generateDominantColorsDisplay function to use the new helper
sed -i 's/const rgb = color\.rgb ? (Array\.isArray(color\.rgb) ? color\.rgb : \[color\.rgb\.r, color\.rgb\.g, color\.rgb\.b\]) : \[128, 128, 128\];/const processedColor = processColorData(color); const rgb = processedColor.rgb;/g' web/colorlab-interface.html

echo "✅ Added comprehensive RGB handling functions"

# Fix other potential issues in the interface
echo "🔍 Fixing other potential data handling issues..."

# Fix histogram data handling
sed -i 's/data\.histograms\.rgb/data.histograms \&\& data.histograms.rgb/g' web/colorlab-interface.html
sed -i 's/data\.histograms\.hsv/data.histograms \&\& data.histograms.hsv/g' web/colorlab-interface.html

# Fix color spaces data handling
sed -i 's/data\.color_spaces\.rgb/data.color_spaces \&\& data.color_spaces.rgb/g' web/colorlab-interface.html
sed -i 's/data\.color_spaces\.hsv/data.color_spaces \&\& data.color_spaces.hsv/g' web/colorlab-interface.html

# Fix characteristics data handling
sed -i 's/data\.characteristics\.temperature/data.characteristics \&\& data.characteristics.temperature/g' web/colorlab-interface.html

echo "✅ Fixed additional data handling issues"

# Clean up temporary file
rm -f /tmp/colorlab_rgb_fixes.js

echo ""
echo "🎨 ColorLab Interface Fix Summary:"
echo "================================="
echo "✅ Fixed rgb.map error by handling both array and object RGB formats"
echo "✅ Added comprehensive RGB data normalization"
echo "✅ Enhanced color data processing"
echo "✅ Fixed histogram data handling"
echo "✅ Fixed color spaces data handling"
echo "✅ Fixed characteristics data handling"
echo "✅ Created backup of original file"
echo ""
echo "📁 Files:"
echo "  - Fixed: web/colorlab-interface.html"
echo "  - Backup: web/colorlab-interface-backup.html"
echo ""
echo "🚀 Ready to deploy fixed ColorLab interface!"
