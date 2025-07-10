#!/bin/bash

# API Connection Test Script
# Tests the ImageAnalyzer API endpoint

API_ENDPOINT="https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/analyze"
BUCKET_NAME="image-analyzer-workshop-1751722329"

echo "🔍 Testing API Connection..."
echo "📡 API Endpoint: $API_ENDPOINT"
echo "🪣 Bucket: $BUCKET_NAME"
echo ""

# Test 1: OPTIONS request (CORS preflight)
echo "📋 Test 1: OPTIONS Request (CORS Preflight)"
echo "----------------------------------------"
curl -X OPTIONS "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Origin: http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s -o /dev/null

echo ""
echo "📋 Test 2: POST Request with Invalid Data (Should return error but prove API works)"
echo "---------------------------------------------------------------------------------"
curl -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"bucket":"'$BUCKET_NAME'","image_data":"invalid_test_data"}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  -s

echo ""
echo "📋 Test 3: Lambda Function Status"
echo "--------------------------------"
aws lambda get-function --function-name ImageAnalyzer --region ap-southeast-1 --query 'Configuration.{FunctionName:FunctionName,State:State,LastUpdateStatus:LastUpdateStatus,Description:Description}' --output table

echo ""
echo "📋 Test 4: API Gateway Status"
echo "----------------------------"
aws apigateway get-rest-api --rest-api-id cuwg234q8g --region ap-southeast-1 --query '{Name:name,Id:id,CreatedDate:createdDate}' --output table

echo ""
echo "✅ API Connection Test Complete!"
echo "If you see HTTP Status 200 for OPTIONS and 200/400/500 for POST, the API is working."
echo "The website should now show 'API Online' status."
