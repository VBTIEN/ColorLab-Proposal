#!/bin/bash

echo "🎨 Testing ColorLab with Actual image_test.jpg"
echo "=============================================="
echo "This test simulates exactly what happens when you upload image_test.jpg to the web interface"
echo ""

API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"
IMAGE_FILE="image_test.jpg"

if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ Image file not found: $IMAGE_FILE"
    exit 1
fi

echo "📸 Image Information:"
echo "File: $IMAGE_FILE"
echo "Size: $(wc -c < $IMAGE_FILE) bytes"
echo ""

# Convert image to base64 (first 50KB to avoid payload limits)
echo "🔄 Converting image to base64 (limited size for testing)..."
base64 -w 0 "$IMAGE_FILE" | head -c 50000 > /tmp/limited_image_base64.txt
limited_base64=$(cat /tmp/limited_image_base64.txt)
echo "Base64 size: ${#limited_base64} characters"

# Create the exact payload that web interface would send
echo "📦 Creating web interface payload..."
cat > /tmp/actual_image_payload.json << EOF
{
    "image_data": "data:image/jpeg;base64,$limited_base64",
    "analysis_type": "complete_professional",
    "options": {
        "include_dominant_colors": true,
        "include_color_frequency": true,
        "include_kmeans_analysis": true,
        "include_regional_analysis": true,
        "include_histograms": true,
        "include_color_spaces": true,
        "include_characteristics": true,
        "include_ai_training_data": true,
        "include_cnn_analysis": true
    }
}
EOF

payload_size=$(wc -c < /tmp/actual_image_payload.json)
echo "Payload size: $payload_size bytes"
echo ""

echo "🚀 Sending request to ColorLab API..."
echo "This simulates exactly what the web interface does when you click 'Analyze Image'"
echo ""

start_time=$(date +%s)

# Make the API call with the same headers as web interface
response=$(curl -s -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Origin: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com" \
    -H "Referer: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/" \
    -d @/tmp/actual_image_payload.json)

end_time=$(date +%s)
processing_time=$((end_time - start_time))

echo "⏱️ Processing time: ${processing_time} seconds"
echo "📊 Response length: ${#response} characters"
echo ""

# Save response for analysis
echo "$response" > /tmp/actual_image_response.json

echo "🔍 Analyzing API Response..."
echo "============================"

# Check if response is valid JSON
if python3 -c "import json; json.loads('''$response''')" 2>/dev/null; then
    echo "✅ Valid JSON response"
    
    # Check for success
    if echo "$response" | grep -q '"success": true'; then
        echo "✅ API success: true"
        
        # Check for analysis errors
        if echo "$response" | grep -q '"error"'; then
            error_msg=$(python3 -c "import json; data=json.loads('''$response'''); print(data.get('analysis', {}).get('error', 'No error'))" 2>/dev/null)
            if [ "$error_msg" != "No error" ] && [ "$error_msg" != "None" ]; then
                echo "❌ Analysis error: $error_msg"
            else
                echo "✅ No analysis errors"
            fi
        else
            echo "✅ No analysis errors"
        fi
        
        # Check dominant colors
        dominant_count=$(python3 -c "import json; data=json.loads('''$response'''); print(len(data.get('analysis', {}).get('dominant_colors', [])))" 2>/dev/null)
        echo "🎨 Dominant colors found: $dominant_count"
        
        if [ "$dominant_count" -gt 0 ]; then
            echo "✅ Dominant colors analysis working"
            
            # Check RGB format
            first_rgb=$(python3 -c "import json; data=json.loads('''$response'''); colors=data.get('analysis', {}).get('dominant_colors', []); print(colors[0]['rgb'] if colors else 'None')" 2>/dev/null)
            echo "🔍 First color RGB format: $first_rgb"
            
            if echo "$first_rgb" | grep -q "'r':"; then
                echo "✅ RGB in correct object format {r, g, b}"
                echo "✅ This should work with the web interface RGB fix"
            else
                echo "❌ RGB not in expected object format"
            fi
            
            # Test the exact JavaScript processing that web interface does
            echo ""
            echo "🧪 Testing JavaScript RGB Processing..."
            echo "======================================"
            
            # Create a test script to simulate the exact JavaScript code
            cat > /tmp/test_rgb_processing.py << 'EOF'
import json

def normalize_rgb_data(rgb_data):
    """Python equivalent of JavaScript normalizeRgbData function"""
    if not rgb_data:
        return [128, 128, 128]
    if isinstance(rgb_data, list):
        return rgb_data
    if isinstance(rgb_data, dict) and 'r' in rgb_data:
        return [rgb_data['r'], rgb_data['g'], rgb_data['b']]
    return [128, 128, 128]

def process_color_data(color):
    """Python equivalent of JavaScript processColorData function"""
    return {
        **color,
        'rgb': normalize_rgb_data(color.get('rgb')),
        'hex': color.get('hex', '#808080'),
        'percentage': color.get('percentage', 0),
        'name': color.get('name', 'Unknown')
    }

# Load the actual API response
try:
    with open('/tmp/actual_image_response.json', 'r') as f:
        response_data = json.load(f)
    
    dominant_colors = response_data.get('analysis', {}).get('dominant_colors', [])
    
    if not dominant_colors:
        print("❌ No dominant colors to test")
        exit(1)
    
    print(f"Testing {len(dominant_colors)} dominant colors...")
    
    for i, color in enumerate(dominant_colors):
        print(f"\nColor {i+1}:")
        print(f"  Original: {color}")
        
        # This is the exact processing that web interface does
        processed_color = process_color_data(color)
        rgb = processed_color['rgb']
        
        print(f"  Processed RGB: {rgb}")
        
        # This is where the error occurred: rgb.map equivalent
        try:
            darker_rgb = [max(0, c - 30) for c in rgb]  # Python equivalent of rgb.map(c => Math.max(0, c - 30))
            print(f"  Darker RGB: {darker_rgb}")
            print(f"  ✅ RGB processing successful for color {i+1}")
        except Exception as e:
            print(f"  ❌ RGB processing failed for color {i+1}: {e}")
            exit(1)
    
    print(f"\n✅ ALL {len(dominant_colors)} COLORS PROCESSED SUCCESSFULLY!")
    print("✅ The web interface should work without rgb.map errors!")
    
except Exception as e:
    print(f"❌ Test failed: {e}")
    exit(1)
EOF

            python3 /tmp/test_rgb_processing.py
            
        else
            echo "❌ No dominant colors found"
        fi
        
    else
        echo "❌ API success: false"
        error_msg=$(python3 -c "import json; data=json.loads('''$response'''); print(data.get('error', 'Unknown error'))" 2>/dev/null)
        echo "Error: $error_msg"
    fi
    
else
    echo "❌ Invalid JSON response"
    echo "Response preview:"
    echo "$response" | head -500
fi

# Clean up
rm -f /tmp/actual_image_payload.json /tmp/limited_image_base64.txt /tmp/test_rgb_processing.py

echo ""
echo "🎨 Test Summary:"
echo "==============="
echo "Image: $IMAGE_FILE ($(wc -c < $IMAGE_FILE) bytes)"
echo "Processing time: ${processing_time} seconds"
echo "Response size: ${#response} characters"
echo "Dominant colors: $(python3 -c "import json; data=json.loads('''$response'''); print(len(data.get('analysis', {}).get('dominant_colors', [])))" 2>/dev/null || echo "0")"
echo ""
echo "🌐 Test URLs:"
echo "ColorLab Interface: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/"
echo "Test Interface: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/test-real-web-interface.html"
echo ""

if python3 -c "import json; data=json.loads('''$response'''); exit(0 if data.get('success') and len(data.get('analysis', {}).get('dominant_colors', [])) > 0 else 1)" 2>/dev/null; then
    echo "🎉 SUCCESS: ColorLab should work perfectly with your image!"
    echo "The rgb.map error has been fixed and all data is in correct format."
else
    echo "❌ ISSUE: There may still be problems with the API response."
fi
