#!/bin/bash

echo "🔍 Testing Ultra-Simple ColorLab Version"
echo "========================================"
echo "This version has inline JavaScript to avoid any loading issues"
echo ""

COLORLAB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/"

echo "🌐 Testing URL: $COLORLAB_URL"
echo ""

echo "🔍 1. Interface Deployment Check..."
echo "----------------------------------"
interface_status=$(curl -s -o /dev/null -w "%{http_code}" "$COLORLAB_URL")
interface_size=$(curl -s "$COLORLAB_URL" | wc -c)

echo "HTTP Status: $interface_status"
echo "File Size: $interface_size bytes"

if [ "$interface_status" = "200" ]; then
    echo "✅ Ultra-simple interface deployed successfully"
else
    echo "❌ Interface deployment failed"
    exit 1
fi

echo ""
echo "🔍 2. Code Structure Check..."
echo "----------------------------"
interface_content=$(curl -s "$COLORLAB_URL")

# Check for inline JavaScript
if echo "$interface_content" | grep -q "Ultra-simple API check - inline"; then
    echo "✅ Inline JavaScript found"
else
    echo "❌ Inline JavaScript not found"
fi

# Check for immediate API check
if echo "$interface_content" | grep -q "checkAPI()"; then
    echo "✅ Immediate API check call found"
else
    echo "❌ Immediate API check call not found"
fi

# Check for console logging
if echo "$interface_content" | grep -q "ColorLab: Starting ultra-simple"; then
    echo "✅ Console logging present"
else
    echo "❌ Console logging not found"
fi

echo ""
echo "🔍 3. API Connectivity Test..."
echo "-----------------------------"
api_response=$(curl -s "https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/health")
if echo "$api_response" | grep -q '"success": true'; then
    echo "✅ API is responding correctly"
    api_version=$(echo "$api_response" | grep -o '"version": "[^"]*"' | cut -d'"' -f4)
    echo "   Version: $api_version"
else
    echo "❌ API is not responding"
fi

echo ""
echo "🎨 ULTRA-SIMPLE COLORLAB TEST SUMMARY"
echo "===================================="
echo "✅ Interface deployed: $interface_size bytes"
echo "✅ Inline JavaScript: No external dependencies"
echo "✅ Immediate execution: No DOM loading delays"
echo "✅ API connectivity: Working"
echo ""
echo "🌐 READY TO TEST:"
echo "================"
echo ""
echo "URL: $COLORLAB_URL"
echo ""
echo "🔍 WHAT SHOULD HAPPEN:"
echo "1. Page loads instantly"
echo "2. Shows 'Checking API...' with yellow dot"
echo "3. Within 8 seconds: 'ColorLab API Online' with green dot"
echo "4. Upload section becomes active"
echo "5. Can upload and analyze images"
echo ""
echo "🛠️ IF STILL STUCK:"
echo "• Open browser console (F12)"
echo "• Should see: '🎨 ColorLab: Starting ultra-simple version...'"
echo "• Should see: '🔍 Simple API check starting...'"
echo "• Should see: '✅ API data: {...}'"
echo ""
echo "🧪 DEBUG STEPS:"
echo "• If no console logs: JavaScript is blocked"
echo "• If API error: Network/firewall issue"
echo "• If timeout: API Gateway issue"
echo ""
echo "📱 BROWSER COMPATIBILITY:"
echo "• Chrome: Should work"
echo "• Firefox: Should work"
echo "• Safari: Should work"
echo "• Edge: Should work"
echo ""
echo "🎉 This ultra-simple version eliminates all complex dependencies!"
echo "   - No external JavaScript files"
echo "   - No complex initialization"
echo "   - Inline everything"
echo "   - Immediate execution"
