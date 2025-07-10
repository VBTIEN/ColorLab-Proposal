#!/bin/bash

echo "🔍 Web Interface Error Debug Test"
echo "================================"
echo "Testing to identify the exact issue with web interface"
echo ""

API_URL="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

echo "1. Testing API Gateway limits..."
echo "------------------------------"

# Test 1: Small payload (should work)
echo "Test 1: Small payload"
small_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -d '{
        "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "analysis_type": "complete_professional"
    }')

small_body=$(echo "$small_response" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
small_status=$(echo "$small_response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

echo "  Status: $small_status"
echo "  Response size: ${#small_body} characters"

if [ "$small_status" = "200" ]; then
    echo "  ✅ Small payload works"
else
    echo "  ❌ Small payload failed"
fi

# Test 2: Medium payload
echo ""
echo "Test 2: Medium payload (10KB base64)"
medium_base64=$(printf 'A%.0s' {1..10000})  # 10KB of 'A's
medium_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -d "{
        \"image_data\": \"data:image/png;base64,$medium_base64\",
        \"analysis_type\": \"complete_professional\"
    }")

medium_body=$(echo "$medium_response" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
medium_status=$(echo "$medium_response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

echo "  Status: $medium_status"
echo "  Response size: ${#medium_body} characters"

if [ "$medium_status" = "200" ]; then
    echo "  ✅ Medium payload works"
else
    echo "  ❌ Medium payload failed"
    echo "  Error: $(echo "$medium_body" | head -200)"
fi

# Test 3: Large payload (like real image)
echo ""
echo "Test 3: Large payload (real image)"
if [ -f "image_test_web_base64.txt" ]; then
    large_base64=$(head -c 50000 image_test_web_base64.txt)  # First 50KB only
    large_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/analyze" \
        -H "Content-Type: application/json" \
        -d "{
            \"image_data\": \"data:image/jpeg;base64,$large_base64\",
            \"analysis_type\": \"complete_professional\"
        }")

    large_body=$(echo "$large_response" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
    large_status=$(echo "$large_response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

    echo "  Status: $large_status"
    echo "  Response size: ${#large_body} characters"

    if [ "$large_status" = "200" ]; then
        echo "  ✅ Large payload works"
    else
        echo "  ❌ Large payload failed"
        echo "  Error: $(echo "$large_body" | head -200)"
    fi
else
    echo "  ❌ Base64 file not found"
fi

echo ""
echo "2. Testing Lambda timeout..."
echo "--------------------------"

# Test with timeout monitoring
echo "Testing with 30-second timeout..."
timeout_response=$(timeout 30s curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -d '{
        "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "analysis_type": "complete_professional"
    }')

if [ $? -eq 124 ]; then
    echo "  ❌ Request timed out after 30 seconds"
else
    timeout_status=$(echo "$timeout_response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
    echo "  ✅ Request completed in < 30 seconds"
    echo "  Status: $timeout_status"
fi

echo ""
echo "3. Testing web interface specific headers..."
echo "------------------------------------------"

# Test with web interface headers
web_response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL/analyze" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Origin: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com" \
    -H "Referer: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com/" \
    -H "User-Agent: Mozilla/5.0 (compatible; ColorLab-Test)" \
    -d '{
        "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        "analysis_type": "complete_professional"
    }')

web_body=$(echo "$web_response" | sed -E 's/HTTPSTATUS:[0-9]{3}$//')
web_status=$(echo "$web_response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')

echo "  Status: $web_status"
echo "  Response size: ${#web_body} characters"

if [ "$web_status" = "200" ]; then
    echo "  ✅ Web interface headers work"
    
    # Check if response is valid JSON
    if python3 -c "import json; json.loads('''$web_body''')" 2>/dev/null; then
        echo "  ✅ Valid JSON response"
        
        # Check for success
        if echo "$web_body" | grep -q '"success": true'; then
            echo "  ✅ API success: true"
        else
            echo "  ❌ API success: false"
        fi
        
        # Check for dominant colors
        if echo "$web_body" | grep -q '"dominant_colors"'; then
            echo "  ✅ Dominant colors present"
        else
            echo "  ❌ Dominant colors missing"
        fi
        
    else
        echo "  ❌ Invalid JSON response"
        echo "  Response preview: $(echo "$web_body" | head -200)"
    fi
else
    echo "  ❌ Web interface headers failed"
    echo "  Error: $(echo "$web_body" | head -200)"
fi

echo ""
echo "4. Testing actual web interface JavaScript simulation..."
echo "-----------------------------------------------------"

# Create a JavaScript-like test
cat > /tmp/web_test.py << 'EOF'
import json
import requests
import base64

def test_web_interface_call():
    api_url = "https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod/analyze"
    
    # Small test image (1x1 pixel PNG)
    small_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    
    payload = {
        "image_data": f"data:image/png;base64,{small_image_b64}",
        "analysis_type": "complete_professional",
        "options": {
            "include_dominant_colors": True,
            "include_color_frequency": True,
            "include_kmeans_analysis": True,
            "include_regional_analysis": True,
            "include_histograms": True,
            "include_color_spaces": True,
            "include_characteristics": True,
            "include_ai_training_data": True,
            "include_cnn_analysis": True
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com",
        "User-Agent": "Mozilla/5.0 (compatible; ColorLab-WebTest)"
    }
    
    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response Size: {len(response.text)} characters")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print("✅ Valid JSON response")
                
                if data.get("success"):
                    print("✅ API success: true")
                    
                    if "dominant_colors" in data.get("analysis", {}):
                        colors = data["analysis"]["dominant_colors"]
                        print(f"✅ Found {len(colors)} dominant colors")
                        
                        if colors:
                            first_color = colors[0]
                            print(f"✅ First color: {first_color}")
                            
                            # Test RGB format
                            rgb = first_color.get("rgb")
                            if isinstance(rgb, dict) and "r" in rgb:
                                print("✅ RGB in object format {r, g, b}")
                            elif isinstance(rgb, list):
                                print("❌ RGB in array format [r, g, b] - will cause rgb.map error")
                            else:
                                print(f"❌ RGB in unknown format: {type(rgb)}")
                    else:
                        print("❌ No dominant colors found")
                else:
                    print(f"❌ API success: false - {data.get('error', 'Unknown error')}")
                    
            except json.JSONDecodeError as e:
                print(f"❌ JSON decode error: {e}")
                print(f"Response preview: {response.text[:500]}")
        else:
            print(f"❌ HTTP error: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_web_interface_call()
EOF

echo "Running Python web interface simulation..."
python3 /tmp/web_test.py

echo ""
echo "🔍 Debug Summary:"
echo "================"
echo "This test helps identify:"
echo "1. API Gateway payload size limits"
echo "2. Lambda timeout issues"
echo "3. CORS header problems"
echo "4. JSON response format issues"
echo "5. RGB data format compatibility"
echo ""
echo "If all tests pass but web interface still fails,"
echo "the issue is likely in the JavaScript RGB processing."

# Clean up
rm -f /tmp/web_test.py
