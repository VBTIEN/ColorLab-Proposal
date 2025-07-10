#!/bin/bash

echo "🎨 ColorLab Professional Color Analysis Demo"
echo "==========================================="
echo ""

# URLs
COLORLAB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/colorlab-interface.html"
API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

echo "🌟 Welcome to ColorLab - Professional Color Analysis Tool!"
echo ""
echo "📊 Features:"
echo "  ✅ 9 Professional Analysis Tabs"
echo "  ✅ AI-Powered Color Recognition"
echo "  ✅ Real-time Processing"
echo "  ✅ Modern Responsive Interface"
echo "  ✅ Advanced Color Science"
echo ""

echo "🔍 Quick System Check..."
echo "------------------------"

# Check API health
echo "Checking API status..."
api_status=$(curl -s "$API_URL/health" | grep -o '"success": true' || echo "failed")
if [ "$api_status" = '"success": true' ]; then
    echo "✅ API is healthy and ready"
else
    echo "❌ API check failed"
fi

# Check interface accessibility
echo "Checking interface accessibility..."
interface_status=$(curl -s -o /dev/null -w "%{http_code}" "$COLORLAB_URL")
if [ "$interface_status" = "200" ]; then
    echo "✅ ColorLab interface is accessible"
else
    echo "❌ Interface check failed"
fi

echo ""
echo "🚀 Ready to Launch ColorLab!"
echo "=============================="
echo ""
echo "🌐 ColorLab Interface URL:"
echo "$COLORLAB_URL"
echo ""
echo "📋 How to Use:"
echo "1. Click the URL above or copy-paste into your browser"
echo "2. Upload an image (JPG, PNG, GIF supported)"
echo "3. Click 'Analyze Image' button"
echo "4. Explore all 9 analysis tabs:"
echo "   • Overview - General color analysis"
echo "   • Frequency - Color frequency distribution"
echo "   • K-Means - Color clustering analysis"
echo "   • Regional - Regional color analysis"
echo "   • Histograms - Color histograms"
echo "   • Color Spaces - RGB, HSV, LAB analysis"
echo "   • Characteristics - Color characteristics"
echo "   • AI Training - AI training data"
echo "   • CNN Analysis - Deep learning analysis"
echo ""
echo "⚡ Advanced Features:"
echo "• Automatic retry mechanism for reliability"
echo "• Real-time API status monitoring"
echo "• Professional color science algorithms"
echo "• Responsive design for all devices"
echo "• Glass effect modern UI"
echo ""
echo "🎯 Sample Test Images:"
echo "• Landscape photos (for natural color analysis)"
echo "• Product photos (for commercial color analysis)"
echo "• Artwork (for artistic color analysis)"
echo "• Screenshots (for digital color analysis)"
echo ""

# Option to open browser automatically
echo "🌐 Would you like to open ColorLab in your default browser? (y/n)"
read -r open_browser

if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
    echo "Opening ColorLab interface..."
    
    # Try different browser opening methods
    if command -v xdg-open > /dev/null; then
        xdg-open "$COLORLAB_URL"
    elif command -v open > /dev/null; then
        open "$COLORLAB_URL"
    elif command -v start > /dev/null; then
        start "$COLORLAB_URL"
    else
        echo "Please manually open this URL in your browser:"
        echo "$COLORLAB_URL"
    fi
else
    echo "Manual access: Copy and paste this URL into your browser:"
    echo "$COLORLAB_URL"
fi

echo ""
echo "🎨 Enjoy ColorLab Professional Color Analysis!"
echo "=============================================="
echo ""
echo "💡 Tips for Best Results:"
echo "• Use high-quality images (min 500x500 pixels)"
echo "• Ensure good lighting in photos"
echo "• Try different image types for varied analysis"
echo "• Explore all tabs for comprehensive insights"
echo ""
echo "🔧 Technical Support:"
echo "• API Version: 14.0.0-complete-100-percent"
echo "• Analysis Engine: complete_professional_color_science_with_ai"
echo "• Accuracy Level: Maximum"
echo "• AI Models: CNN Color Classifier, K-Means Clustering, LAB Color Analysis"
echo ""
echo "📞 Need Help?"
echo "Check the interface for real-time status and error messages."
echo "All analysis results are generated in real-time with professional accuracy."
