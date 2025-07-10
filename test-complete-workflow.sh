#!/bin/bash

echo "🧪 Testing Complete ColorLab Workflow"
echo "======================================"

API_BASE_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"
WEB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com"

echo ""
echo "1. 🔍 Testing API Health..."
echo "----------------------------"
HEALTH_RESPONSE=$(curl -s "$API_BASE_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q '"success": true'; then
    echo "✅ API Health: OK"
    echo "   Version: $(echo "$HEALTH_RESPONSE" | grep -o '"version": "[^"]*"' | cut -d'"' -f4)"
    echo "   Status: $(echo "$HEALTH_RESPONSE" | grep -o '"status": "[^"]*"' | cut -d'"' -f4)"
else
    echo "❌ API Health: FAILED"
    echo "   Response: $HEALTH_RESPONSE"
    exit 1
fi

echo ""
echo "2. 🌐 Testing Website Accessibility..."
echo "--------------------------------------"
WEB_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL")
if [ "$WEB_RESPONSE" = "200" ]; then
    echo "✅ Website: Accessible (HTTP $WEB_RESPONSE)"
else
    echo "❌ Website: Not accessible (HTTP $WEB_RESPONSE)"
fi

echo ""
echo "3. 🖼️  Testing Image Analysis API..."
echo "------------------------------------"
# Create a simple test image (1x1 pixel red)
TEST_IMAGE_B64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

ANALYSIS_RESPONSE=$(curl -s -X POST "$API_BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"image_data\": \"$TEST_IMAGE_B64\", \"analysis_type\": \"color_analysis\"}")

if echo "$ANALYSIS_RESPONSE" | grep -q '"success": true'; then
    echo "✅ Image Analysis: OK"
    COLORS_COUNT=$(echo "$ANALYSIS_RESPONSE" | grep -o '"dominant_colors":\s*\[' | wc -l)
    if [ "$COLORS_COUNT" -gt 0 ]; then
        echo "   Colors detected: $(echo "$ANALYSIS_RESPONSE" | grep -o '"hex": "[^"]*"' | wc -l)"
        echo "   Processing time: $(echo "$ANALYSIS_RESPONSE" | grep -o '"processing_time": "[^"]*"' | cut -d'"' -f4)"
    fi
else
    echo "❌ Image Analysis: FAILED"
    echo "   Response: $(echo "$ANALYSIS_RESPONSE" | head -c 200)..."
fi

echo ""
echo "4. 🔧 Testing CORS Headers..."
echo "-----------------------------"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$API_BASE_URL/analyze" \
  -H "Origin: $WEB_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type")

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS: Configured"
    echo "   Allow-Origin: $(echo "$CORS_RESPONSE" | grep "Access-Control-Allow-Origin" | cut -d' ' -f2- | tr -d '\r')"
    echo "   Allow-Methods: $(echo "$CORS_RESPONSE" | grep "Access-Control-Allow-Methods" | cut -d' ' -f2- | tr -d '\r')"
else
    echo "❌ CORS: Not properly configured"
fi

echo ""
echo "5. 📊 Testing Website Content..."
echo "--------------------------------"
WEB_CONTENT=$(curl -s "$WEB_URL")
if echo "$WEB_CONTENT" | grep -q "ColorLab"; then
    echo "✅ Website Content: ColorLab interface loaded"
    
    # Check for key elements
    if echo "$WEB_CONTENT" | grep -q "fileInput"; then
        echo "   ✅ File input element: Present"
    else
        echo "   ❌ File input element: Missing"
    fi
    
    if echo "$WEB_CONTENT" | grep -q "analyzeBtn"; then
        echo "   ✅ Analyze button: Present"
    else
        echo "   ❌ Analyze button: Missing"
    fi
    
    if echo "$WEB_CONTENT" | grep -q "$API_BASE_URL"; then
        echo "   ✅ API endpoint: Correctly configured"
    else
        echo "   ❌ API endpoint: Not found or incorrect"
    fi
    
else
    echo "❌ Website Content: ColorLab interface not found"
fi

echo ""
echo "6. 🚀 Testing Debug Page..."
echo "---------------------------"
DEBUG_URL="$WEB_URL/debug.html"
DEBUG_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEBUG_URL")
if [ "$DEBUG_RESPONSE" = "200" ]; then
    echo "✅ Debug Page: Available at $DEBUG_URL"
else
    echo "❌ Debug Page: Not accessible (HTTP $DEBUG_RESPONSE)"
fi

echo ""
echo "📋 Summary"
echo "=========="
echo "🌐 Main Website: $WEB_URL"
echo "🔧 Debug Page: $DEBUG_URL"
echo "🔗 API Endpoint: $API_BASE_URL"
echo ""
echo "🎯 Next Steps:"
echo "1. Open $WEB_URL in your browser"
echo "2. Try uploading an image"
echo "3. Click 'Analyze Colors with AI'"
echo "4. If issues persist, check $DEBUG_URL for detailed logs"
echo ""
echo "✨ Test completed!"
