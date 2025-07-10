#!/bin/bash

echo "🌐 Testing Web Interface API Call Simulation"
echo "==========================================="
echo "Simulating exactly how the web interface calls the API"
echo ""

API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"
IMAGE_FILE="image_test.jpg"

echo "📸 Image Information:"
echo "File: $IMAGE_FILE"
echo "Size: $(wc -c < $IMAGE_FILE) bytes"
echo ""

# Create the exact payload that web interface sends
echo "🔄 Creating web interface payload..."

# Read base64 data
if [ ! -f "image_test_web_base64.txt" ]; then
    echo "Creating base64..."
    base64 -w 0 "$IMAGE_FILE" > image_test_web_base64.txt
fi

base64_data=$(cat image_test_web_base64.txt)
base64_length=${#base64_data}

echo "Base64 length: $base64_length characters"

# Create payload exactly like web interface
cat > /tmp/web_interface_payload.json << EOF
{
    "image_data": "data:image/jpeg;base64,$base64_data",
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

payload_size=$(wc -c < /tmp/web_interface_payload.json)
echo "Payload size: $payload_size bytes"
echo ""

echo "🚀 Sending request to API (exactly like web interface)..."
echo "URL: $API_URL/analyze"
echo "Method: POST"
echo "Content-Type: application/json"
echo ""

start_time=$(date +%s)

# Make the API call with verbose output to see any errors
response=$(curl -v -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Origin: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com" \
    -d @/tmp/web_interface_payload.json 2>&1)

end_time=$(date +%s)
processing_time=$((end_time - start_time))

echo "⏱️ Processing time: ${processing_time} seconds"
echo ""

# Extract HTTP status and response body
http_status=$(echo "$response" | grep "< HTTP" | tail -1 | awk '{print $3}')
response_body=$(echo "$response" | sed -n '/^{/,$p' | tail -1)

echo "📊 Response Analysis:"
echo "HTTP Status: $http_status"
echo "Response length: ${#response_body} characters"
echo ""

# Save full response for analysis
echo "$response" > /tmp/web_interface_full_response.txt
echo "$response_body" > /tmp/web_interface_response_body.json

echo "🔍 Checking for errors..."

# Check for HTTP errors
if [[ "$http_status" != "200" ]]; then
    echo "❌ HTTP Error: $http_status"
    echo "Full response:"
    echo "$response"
    exit 1
fi

# Check for JSON parsing
if echo "$response_body" | jq . > /dev/null 2>&1; then
    echo "✅ Valid JSON response"
else
    echo "❌ Invalid JSON response"
    echo "Response body:"
    echo "$response_body"
    exit 1
fi

# Check for API success
if echo "$response_body" | jq -r '.success' | grep -q "true"; then
    echo "✅ API success: true"
else
    echo "❌ API success: false"
    error_msg=$(echo "$response_body" | jq -r '.error // "Unknown error"')
    echo "Error: $error_msg"
fi

# Check for analysis errors
if echo "$response_body" | jq -r '.analysis.error' | grep -q "null"; then
    echo "✅ No analysis errors"
else
    analysis_error=$(echo "$response_body" | jq -r '.analysis.error // "No error"')
    if [ "$analysis_error" != "No error" ] && [ "$analysis_error" != "null" ]; then
        echo "❌ Analysis error: $analysis_error"
    else
        echo "✅ No analysis errors"
    fi
fi

# Check dominant colors format
echo ""
echo "🎨 Checking dominant colors format..."
dominant_colors=$(echo "$response_body" | jq -r '.analysis.dominant_colors // []')

if [ "$dominant_colors" = "[]" ] || [ "$dominant_colors" = "null" ]; then
    echo "❌ No dominant colors found"
else
    color_count=$(echo "$response_body" | jq -r '.analysis.dominant_colors | length')
    echo "✅ Found $color_count dominant colors"
    
    # Check first color format
    first_color_rgb=$(echo "$response_body" | jq -r '.analysis.dominant_colors[0].rgb // null')
    if [ "$first_color_rgb" = "null" ]; then
        echo "❌ No RGB data in first color"
    else
        echo "✅ RGB data present: $first_color_rgb"
        
        # Check if RGB is object format
        if echo "$first_color_rgb" | jq -r '.r' > /dev/null 2>&1; then
            echo "✅ RGB in object format {r, g, b}"
        else
            echo "❌ RGB not in object format"
        fi
    fi
fi

# Check for specific web interface compatibility issues
echo ""
echo "🌐 Checking web interface compatibility..."

# Check if response has all required sections
sections=("dominant_colors" "color_frequency" "kmeans_analysis" "regional_analysis" "histograms" "color_spaces" "characteristics" "ai_training_data" "cnn_analysis")

missing_sections=()
for section in "${sections[@]}"; do
    if echo "$response_body" | jq -e ".analysis.$section" > /dev/null 2>&1; then
        echo "✅ $section: Present"
    else
        echo "❌ $section: Missing"
        missing_sections+=("$section")
    fi
done

if [ ${#missing_sections[@]} -eq 0 ]; then
    echo "✅ All sections present for web interface"
else
    echo "❌ Missing sections: ${missing_sections[*]}"
fi

# Test the specific data that web interface uses
echo ""
echo "🧪 Testing specific web interface data usage..."

# Test dominant colors array processing
echo "Testing dominant colors array..."
if echo "$response_body" | jq -r '.analysis.dominant_colors[]?' > /dev/null 2>&1; then
    echo "✅ Dominant colors array can be iterated"
    
    # Test RGB object access
    first_rgb_r=$(echo "$response_body" | jq -r '.analysis.dominant_colors[0].rgb.r // null')
    if [ "$first_rgb_r" != "null" ]; then
        echo "✅ RGB.r accessible: $first_rgb_r"
    else
        echo "❌ RGB.r not accessible"
    fi
else
    echo "❌ Dominant colors array cannot be iterated"
fi

# Clean up
rm -f /tmp/web_interface_payload.json

echo ""
echo "📋 Test Summary:"
echo "==============="
echo "Image: $IMAGE_FILE ($(wc -c < $IMAGE_FILE) bytes)"
echo "Processing time: ${processing_time} seconds"
echo "HTTP Status: $http_status"
echo "Response size: ${#response_body} characters"
echo "Dominant colors: $(echo "$response_body" | jq -r '.analysis.dominant_colors | length // 0')"
echo ""

if [[ "$http_status" == "200" ]] && echo "$response_body" | jq -r '.success' | grep -q "true"; then
    echo "✅ Web interface API call simulation: SUCCESS"
else
    echo "❌ Web interface API call simulation: FAILED"
    echo ""
    echo "🔍 Full error details:"
    echo "Response body:"
    echo "$response_body" | jq . 2>/dev/null || echo "$response_body"
fi

echo ""
echo "📁 Response files saved:"
echo "  - Full response: /tmp/web_interface_full_response.txt"
echo "  - Response body: /tmp/web_interface_response_body.json"
