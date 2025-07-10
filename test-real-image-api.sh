#!/bin/bash

echo "🧪 Testing API with Real Image: image_test.jpg"
echo "=============================================="

API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/analyze"
IMAGE_FILE="/mnt/d/project/ai-image-analyzer-workshop/image_test.jpg"
BASE64_FILE="/mnt/d/project/ai-image-analyzer-workshop/image_test_base64_real.txt"

echo ""
echo "📸 Image Info:"
echo "  File: $(basename $IMAGE_FILE)"
echo "  Size: $(du -h $IMAGE_FILE | cut -f1)"
echo "  Dimensions: $(file $IMAGE_FILE | grep -o '[0-9]*x[0-9]*')"
echo "  Base64 size: $(wc -c < $BASE64_FILE) characters"

echo ""
echo "🔍 Testing API with real image data..."

# Create JSON payload file
cat > /tmp/api_payload.json << EOF
{
  "image_data": "$(cat $BASE64_FILE)",
  "analysis_type": "color_analysis"
}
EOF

echo "📤 Sending request to API..."
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d @/tmp/api_payload.json \
  --max-time 60)

echo ""
echo "📡 API Response Status: $?"

if echo "$RESPONSE" | jq . >/dev/null 2>&1; then
    echo "✅ Valid JSON response received"
    
    # Check if successful
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
    if [ "$SUCCESS" = "true" ]; then
        echo "✅ Analysis successful"
        
        echo ""
        echo "🎨 Top 5 Dominant Colors:"
        echo "$RESPONSE" | jq -r '.analysis.dominant_colors[0:5][] | "  \(.rank). \(.hex) - \(.name) (\(.percentage)%)"'
        
        echo ""
        echo "📊 Color Statistics:"
        echo "  Total Colors: $(echo "$RESPONSE" | jq -r '.analysis.color_frequency.unique_colors')"
        echo "  Diversity: $(echo "$RESPONSE" | jq -r '.analysis.color_frequency.diversity_index')"
        echo "  Temperature: $(echo "$RESPONSE" | jq -r '.analysis.characteristics.temperature.classification')"
        
        echo ""
        echo "🔬 Analysis Metadata:"
        echo "  Version: $(echo "$RESPONSE" | jq -r '.version')"
        echo "  Processing Time: $(echo "$RESPONSE" | jq -r '.analysis.metadata.processing_time')"
        echo "  Timestamp: $(echo "$RESPONSE" | jq -r '.timestamp')"
        
        # Save full response for detailed analysis
        echo "$RESPONSE" > /mnt/d/project/ai-image-analyzer-workshop/real_image_analysis_result.json
        echo ""
        echo "💾 Full response saved to: real_image_analysis_result.json"
        
    else
        echo "❌ Analysis failed"
        echo "Error: $(echo "$RESPONSE" | jq -r '.error // "Unknown error"')"
    fi
else
    echo "❌ Invalid JSON response or API error"
    echo "Response: $RESPONSE"
fi

# Cleanup
rm -f /tmp/api_payload.json

echo ""
echo "✨ Test completed!"
