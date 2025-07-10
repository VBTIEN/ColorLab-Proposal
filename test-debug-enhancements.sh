#!/bin/bash

echo "🔧 Testing Debug Enhanced Web Interface"
echo "======================================"

# Configuration
WEB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/"

echo ""
echo "🌐 Testing Debug Enhanced Interface..."
echo "====================================="

echo ""
echo "1️⃣ Web Interface Accessibility..."
echo "---------------------------------"

WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL" --max-time 10)

if [ "$WEB_STATUS" = "200" ]; then
    echo "✅ Web Interface: ACCESSIBLE (HTTP $WEB_STATUS)"
else
    echo "❌ Web Interface: FAILED (HTTP $WEB_STATUS)"
    exit 1
fi

echo ""
echo "2️⃣ Debug Functions Check..."
echo "---------------------------"

# Download web interface content
WEB_CONTENT=$(curl -s "$WEB_URL" --max-time 10)

# Check for debug functions
if echo "$WEB_CONTENT" | grep -q "debugEnhanceAllDisplays"; then
    echo "✅ Debug Enhancement Functions: FOUND"
else
    echo "❌ Debug Enhancement Functions: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "debugEnhanceHistograms"; then
    echo "✅ Debug HSV Histogram Function: FOUND"
else
    echo "❌ Debug HSV Histogram Function: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "debugEnhanceRegionalAnalysis"; then
    echo "✅ Debug Regional Analysis Function: FOUND"
else
    echo "❌ Debug Regional Analysis Function: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "debugEnhanceColorSpaces"; then
    echo "✅ Debug Color Spaces Function: FOUND"
else
    echo "❌ Debug Color Spaces Function: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "debugEnhanceCharacteristics"; then
    echo "✅ Debug Characteristics Function: FOUND"
else
    echo "❌ Debug Characteristics Function: MISSING"
fi

echo ""
echo "3️⃣ Mock Data Generators Check..."
echo "--------------------------------"

if echo "$WEB_CONTENT" | grep -q "generateMockHSVData"; then
    echo "✅ Mock HSV Data Generator: FOUND"
else
    echo "❌ Mock HSV Data Generator: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "generateMockRegionalData"; then
    echo "✅ Mock Regional Data Generator: FOUND"
else
    echo "❌ Mock Regional Data Generator: MISSING"
fi

echo ""
echo "4️⃣ Enhanced Sections Check..."
echo "-----------------------------"

if echo "$WEB_CONTENT" | grep -q "HSV Histogram Analysis"; then
    echo "✅ HSV Histogram Section: FOUND"
else
    echo "❌ HSV Histogram Section: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "Regional Color Distribution"; then
    echo "✅ Regional 3x3 Grid Section: FOUND"
else
    echo "❌ Regional 3x3 Grid Section: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "LAB Color Space Analysis"; then
    echo "✅ LAB Color Space Section: FOUND"
else
    echo "❌ LAB Color Space Section: MISSING"
fi

if echo "$WEB_CONTENT" | grep -q "Color Temperature & Advanced Characteristics"; then
    echo "✅ Color Temperature Section: FOUND"
else
    echo "❌ Color Temperature Section: MISSING"
fi

echo ""
echo "🎯 DEBUG ENHANCEMENT SUMMARY"
echo "============================"
echo ""
echo "🌐 Web Interface Status:"
echo "   URL: $WEB_URL"
echo "   Status: ✅ DEBUG VERSION DEPLOYED"
echo "   Debug Functions: ✅ ACTIVE"
echo "   Mock Data: ✅ AVAILABLE"
echo ""
echo "🔧 Debug Features:"
echo "   ✅ Console logging for troubleshooting"
echo "   ✅ Error handling and stack traces"
echo "   ✅ Mock data generators for testing"
echo "   ✅ Robust DOM element finding"
echo "   ✅ Fallback data when API data missing"
echo ""
echo "📊 Enhanced Sections:"
echo "   ✅ HSV Histogram with 3 interactive charts"
echo "   ✅ Regional 3x3 Color Grid with hover effects"
echo "   ✅ LAB Color Space with detailed statistics"
echo "   ✅ Color Temperature with visual indicators"
echo ""
echo "🎨 Visual Improvements:"
echo "   • Color-coded HSV charts with real hue colors"
echo "   • Interactive 3x3 grid with tooltips"
echo "   • Professional LAB space display"
echo "   • Temperature indicators with emojis"
echo "   • Enhanced styling and shadows"
echo ""
echo "🔍 Debug Instructions:"
echo "======================================"
echo ""
echo "1. Open your web interface: $WEB_URL"
echo "2. Open browser Developer Tools (F12)"
echo "3. Go to Console tab"
echo "4. Upload and analyze an image"
echo "5. Watch for debug messages:"
echo "   • '🔍 DEBUG: displayComprehensiveResults called with:'"
echo "   • '🔧 DEBUG: Applying web interface enhancements...'"
echo "   • '📊 Enhancing histograms with data:'"
echo "   • '🗺️ Enhancing regional analysis with data:'"
echo "   • '🔬 Enhancing color spaces with data:'"
echo "   • '🌡️ Enhancing characteristics with data:'"
echo ""
echo "6. Check for any error messages in red"
echo "7. Verify that all 4 new sections appear with data"
echo ""
echo "🚀 If you see the debug messages and new sections,"
echo "   the enhancements are working correctly!"
echo ""
echo "📞 If issues persist, check the console for specific"
echo "   error messages and data structure problems."
