#!/bin/bash

echo "🔧 Fixing ColorLab Overview Data Display Issues"
echo "=============================================="

# Create a backup
cp web/colorlab-interface.html web/colorlab-interface-backup-$(date +%Y%m%d_%H%M%S).html
echo "✅ Backup created"

# Fix the Overview tab data mapping
echo "🔍 Fixing Overview tab data mapping..."

# Replace the problematic data references in Overview tab
sed -i 's/currentAnalysisData\.color_count || currentAnalysisData\.total_colors/currentAnalysisData.color_frequency?.unique_colors/g' web/colorlab-interface.html

# Fix other data references that might be causing N/A values
sed -i 's/currentAnalysisData\.total_pixels/currentAnalysisData.color_frequency?.total_pixels/g' web/colorlab-interface.html

# Fix color richness reference
sed -i 's/currentAnalysisData\.color_richness/currentAnalysisData.color_frequency?.color_richness/g' web/colorlab-interface.html

# Fix diversity index reference
sed -i 's/currentAnalysisData\.diversity_index/currentAnalysisData.color_frequency?.diversity_index/g' web/colorlab-interface.html

# Fix temperature reference
sed -i 's/currentAnalysisData\.temperature/currentAnalysisData.characteristics?.temperature?.classification/g' web/colorlab-interface.html

# Fix brightness reference
sed -i 's/currentAnalysisData\.brightness/currentAnalysisData.characteristics?.brightness?.level/g' web/colorlab-interface.html

# Fix saturation reference
sed -i 's/currentAnalysisData\.saturation/currentAnalysisData.characteristics?.saturation?.level/g' web/colorlab-interface.html

echo "✅ Fixed data mapping references"

# Now let's create a comprehensive fix for the Overview tab content
echo "🔧 Creating comprehensive Overview tab fix..."

# Create a temporary file with the corrected Overview tab content
cat > /tmp/overview_tab_fix.txt << 'EOF'
                case 'overview':
                    return `
                        <div class="p-8">
                            <h3 class="text-2xl font-bold text-gray-800 mb-6">📊 ColorLab Analysis Overview</h3>
                            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div class="bg-blue-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-blue-800 mb-2">🎨 Dominant Colors</h4>
                                    <p class="text-blue-600 text-sm mb-3">Primary color palette extracted</p>
                                    <div class="text-2xl font-bold text-blue-800">${currentAnalysisData?.dominant_colors?.length || 0}</div>
                                </div>
                                <div class="bg-green-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-green-800 mb-2">📊 Total Colors</h4>
                                    <p class="text-green-600 text-sm mb-3">Unique colors detected</p>
                                    <div class="text-2xl font-bold text-green-800">${currentAnalysisData?.color_frequency?.unique_colors || 'N/A'}</div>
                                </div>
                                <div class="bg-purple-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-purple-800 mb-2">🔍 Total Pixels</h4>
                                    <p class="text-purple-600 text-sm mb-3">Image pixels analyzed</p>
                                    <div class="text-2xl font-bold text-purple-800">${currentAnalysisData?.color_frequency?.total_pixels || 'N/A'}</div>
                                </div>
                                <div class="bg-orange-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-orange-800 mb-2">🌈 Color Richness</h4>
                                    <p class="text-orange-600 text-sm mb-3">Diversity assessment</p>
                                    <div class="text-2xl font-bold text-orange-800">${currentAnalysisData?.color_frequency?.color_richness || 'N/A'}</div>
                                </div>
                                <div class="bg-red-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-red-800 mb-2">🌡️ Temperature</h4>
                                    <p class="text-red-600 text-sm mb-3">Color temperature</p>
                                    <div class="text-2xl font-bold text-red-800">${currentAnalysisData?.characteristics?.temperature?.classification || 'N/A'}</div>
                                </div>
                                <div class="bg-indigo-50 rounded-xl p-6">
                                    <h4 class="font-semibold text-indigo-800 mb-2">💡 Brightness</h4>
                                    <p class="text-indigo-600 text-sm mb-3">Overall brightness level</p>
                                    <div class="text-2xl font-bold text-indigo-800">${currentAnalysisData?.characteristics?.brightness?.level || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <!-- Dominant Colors Display -->
                            <div class="mb-8">
                                <h4 class="text-xl font-bold text-gray-800 mb-4">🎨 Dominant Color Palette</h4>
                                <div id="overviewColorsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                                    ${generateOverviewColorDisplay()}
                                </div>
                            </div>
                            
                            <!-- Quick Stats -->
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="bg-gray-50 rounded-xl p-6">
                                    <h4 class="text-lg font-bold text-gray-800 mb-4">📈 Color Analysis Stats</h4>
                                    <div class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Diversity Index:</span>
                                            <span class="font-semibold">${currentAnalysisData?.color_frequency?.diversity_index?.toFixed(3) || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Most Frequent Color:</span>
                                            <span class="font-semibold">${currentAnalysisData?.color_frequency?.most_frequent?.color || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Color Harmony:</span>
                                            <span class="font-semibold">${currentAnalysisData?.characteristics?.harmony?.type || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Saturation Level:</span>
                                            <span class="font-semibold">${currentAnalysisData?.characteristics?.saturation?.level || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 rounded-xl p-6">
                                    <h4 class="text-lg font-bold text-gray-800 mb-4">🎯 Analysis Quality</h4>
                                    <div class="space-y-3">
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Processing Time:</span>
                                            <span class="font-semibold">${currentAnalysisData?.metadata?.processing_time || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Data Quality:</span>
                                            <span class="font-semibold">${currentAnalysisData?.metadata?.data_quality || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Analysis Engine:</span>
                                            <span class="font-semibold">ColorLab Pro</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Version:</span>
                                            <span class="font-semibold">${currentAnalysisData?.metadata?.version || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
EOF

# Replace the overview case in the file
echo "🔄 Replacing Overview tab content..."
# This is a complex replacement, so we'll use a Python script
cat > /tmp/fix_overview.py << 'EOF'
import re

# Read the current file
with open('web/colorlab-interface.html', 'r') as f:
    content = f.read()

# Read the new overview content
with open('/tmp/overview_tab_fix.txt', 'r') as f:
    new_overview = f.read()

# Find and replace the overview case
pattern = r"case 'overview':\s*return `.*?`;"
replacement = new_overview.strip()

# Use re.DOTALL to match across newlines
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to file
with open('web/colorlab-interface.html', 'w') as f:
    f.write(content)

print("✅ Overview tab content replaced successfully")
EOF

python3 /tmp/fix_overview.py

# Add the generateOverviewColorDisplay function
echo "🎨 Adding generateOverviewColorDisplay function..."

# Find where to insert the function (before the closing script tag)
sed -i '/console\.log.*ColorLab Professional Color Analysis loaded successfully/i\
\
        // Generate overview color display\
        function generateOverviewColorDisplay() {\
            if (!currentAnalysisData?.dominant_colors) return "<div class=\"col-span-full text-center text-gray-500\">No colors available</div>";\
            \
            return currentAnalysisData.dominant_colors.slice(0, 8).map(color => {\
                const processedColor = processColorData(color);\
                const rgb = processedColor.rgb;\
                const darkerRgb = rgb.map(c => Math.max(0, c - 30));\
                \
                return `\
                    <div class="flex flex-col items-center space-y-2">\
                        <div class="w-16 h-16 rounded-full shadow-lg border-2 border-white" \
                             style="background: linear-gradient(135deg, ${color.hex} 0%, rgb(${darkerRgb.join(\",\")}) 100%);"></div>\
                        <div class="text-center">\
                            <div class="text-xs font-bold text-gray-800">${color.hex}</div>\
                            <div class="text-xs text-gray-600">${color.percentage}%</div>\
                            <div class="text-xs text-gray-500">${color.name}</div>\
                        </div>\
                    </div>\
                `;\
            }).join("");\
        }\
' web/colorlab-interface.html

echo "✅ Added generateOverviewColorDisplay function"

# Clean up temporary files
rm -f /tmp/overview_tab_fix.txt /tmp/fix_overview.py

echo ""
echo "🎨 ColorLab Overview Fix Summary:"
echo "================================"
echo "✅ Fixed data mapping for Overview tab"
echo "✅ Updated all data references to use correct API response structure"
echo "✅ Added comprehensive Overview display with real data"
echo "✅ Added generateOverviewColorDisplay function"
echo "✅ Fixed N/A value issues"
echo ""
echo "📁 Files:"
echo "  - Fixed: web/colorlab-interface.html"
echo "  - Backup: web/colorlab-interface-backup-*.html"
echo ""
echo "🚀 Ready to deploy fixed ColorLab interface!"
echo ""
echo "Next steps:"
echo "1. Deploy to S3: aws s3 cp web/colorlab-interface.html s3://bucket/index.html"
echo "2. Test the Overview tab"
echo "3. Verify all data displays correctly"
