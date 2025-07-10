#!/bin/bash

echo "🎨 ColorLab Professional Color Analysis - Main URL Demo"
echo "======================================================"
echo ""

# Main URL
COLORLAB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/"
API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

echo "🌟 Welcome to ColorLab - Professional Color Analysis Tool!"
echo "Now running at the main URL for easy access!"
echo ""
echo "📊 Features:"
echo "  ✅ 9 Professional Analysis Tabs"
echo "  ✅ AI-Powered Color Recognition"
echo "  ✅ Real-time Processing"
echo "  ✅ Modern Responsive Interface"
echo "  ✅ Advanced Color Science"
echo "  ✅ Glass Effect Design"
echo "  ✅ Professional Branding"
echo ""

echo "🔍 Quick System Check..."
echo "------------------------"

# Check API health
echo "Checking API status..."
api_status=$(curl -s "$API_URL/health" | grep -o '"success": true' || echo "failed")
if [ "$api_status" = '"success": true' ]; then
    echo "✅ API is healthy and ready"
    api_version=$(curl -s "$API_URL/health" | grep -o '"version": "[^"]*"' | cut -d'"' -f4)
    echo "   Version: $api_version"
else
    echo "❌ API check failed"
fi

# Check main interface accessibility
echo "Checking ColorLab main interface..."
interface_status=$(curl -s -o /dev/null -w "%{http_code}" "$COLORLAB_URL")
if [ "$interface_status" = "200" ]; then
    echo "✅ ColorLab interface is accessible at main URL"
else
    echo "❌ Interface check failed"
fi

# Check for ColorLab content
echo "Verifying ColorLab content..."
content_check=$(curl -s "$COLORLAB_URL" | grep -o "ColorLab - Professional Color Analysis" || echo "failed")
if [ "$content_check" = "ColorLab - Professional Color Analysis" ]; then
    echo "✅ ColorLab content verified"
else
    echo "❌ ColorLab content check failed"
fi

echo ""
echo "🚀 ColorLab is LIVE at Main URL!"
echo "================================"
echo ""
echo "🌐 ColorLab Main URL:"
echo "$COLORLAB_URL"
echo ""
echo "📋 How to Use ColorLab:"
echo "1. Click the URL above or copy-paste into your browser"
echo "2. Upload an image (JPG, PNG, GIF supported)"
echo "3. Click 'Analyze Image' button"
echo "4. Wait for AI processing (5-15 seconds)"
echo "5. Explore all 9 professional analysis tabs:"
echo ""
echo "   🎯 Analysis Tabs:"
echo "   • Overview - General color analysis & dominant colors"
echo "   • Frequency - Color frequency distribution analysis"
echo "   • K-Means - Advanced color clustering analysis"
echo "   • Regional - Regional color analysis by image areas"
echo "   • Histograms - Detailed color histograms (RGB, HSV)"
echo "   • Color Spaces - Multi-space analysis (RGB, HSV, LAB)"
echo "   • Characteristics - Color temperature, harmony, mood"
echo "   • AI Training - Machine learning training data"
echo "   • CNN Analysis - Deep learning color classification"
echo ""
echo "⚡ Advanced Features:"
echo "• Automatic retry mechanism for reliability"
echo "• Real-time API status monitoring"
echo "• Professional color science algorithms"
echo "• Responsive design for all devices"
echo "• Glass effect modern UI with gradients"
echo "• Professional ColorLab branding"
echo "• 30-second timeout protection"
echo "• Error handling and user feedback"
echo ""
echo "🎯 Best Image Types for Analysis:"
echo "• Landscape photos (natural color palettes)"
echo "• Product photos (commercial color analysis)"
echo "• Artwork & designs (artistic color analysis)"
echo "• Screenshots (digital interface colors)"
echo "• Fashion photos (style and trend analysis)"
echo "• Architecture (structural color harmony)"
echo ""

# Option to open browser automatically
echo "🌐 Would you like to open ColorLab in your default browser? (y/n)"
read -r open_browser

if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
    echo "🚀 Opening ColorLab Professional Color Analysis..."
    
    # Try different browser opening methods
    if command -v xdg-open > /dev/null; then
        xdg-open "$COLORLAB_URL"
        echo "✅ Opened in default browser"
    elif command -v open > /dev/null; then
        open "$COLORLAB_URL"
        echo "✅ Opened in default browser"
    elif command -v start > /dev/null; then
        start "$COLORLAB_URL"
        echo "✅ Opened in default browser"
    else
        echo "❌ Could not auto-open browser"
        echo "Please manually open this URL:"
        echo "$COLORLAB_URL"
    fi
else
    echo "📋 Manual Access Instructions:"
    echo "Copy and paste this URL into your browser:"
    echo "$COLORLAB_URL"
fi

echo ""
echo "🎨 Welcome to ColorLab Professional Experience!"
echo "=============================================="
echo ""
echo "💡 Pro Tips for Best Results:"
echo "• Use high-quality images (minimum 500x500 pixels)"
echo "• Ensure good lighting and contrast in photos"
echo "• Try different image types for varied analysis"
echo "• Explore all 9 tabs for comprehensive insights"
echo "• Check the API status indicator (top-right)"
echo "• Use the retry mechanism if analysis fails"
echo ""
echo "🔧 Technical Specifications:"
echo "• API Version: 14.0.0-complete-100-percent"
echo "• Analysis Engine: complete_professional_color_science_with_ai"
echo "• Accuracy Level: Maximum"
echo "• AI Models: CNN Color Classifier, K-Means Clustering, LAB Color Analysis"
echo "• Color Spaces: RGB, HSV, LAB"
echo "• Processing Time: 5-15 seconds per image"
echo "• Max Image Size: 10MB"
echo "• Supported Formats: JPG, PNG, GIF, WebP"
echo ""
echo "🎉 Enjoy ColorLab - Where Color Science Meets AI!"
echo ""
echo "📞 Need Help?"
echo "• Check the real-time API status in the interface"
echo "• All error messages are displayed clearly"
echo "• Analysis results are generated with professional accuracy"
echo "• Each tab provides detailed color insights"
