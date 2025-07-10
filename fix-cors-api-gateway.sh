#!/bin/bash

echo "🔧 Fixing CORS Configuration for API Gateway"
echo "============================================="

API_ID="spsvd9ec7i"
REGION="ap-southeast-1"
STAGE="prod"

echo ""
echo "1. 🔍 Current API Gateway Configuration..."
echo "-------------------------------------------"
aws apigateway get-rest-api --rest-api-id $API_ID --region $REGION

echo ""
echo "2. 📋 Getting Resources..."
echo "--------------------------"
RESOURCES=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION)
echo "$RESOURCES"

ROOT_RESOURCE_ID=$(echo "$RESOURCES" | jq -r '.items[] | select(.path == "/") | .id')
PROXY_RESOURCE_ID=$(echo "$RESOURCES" | jq -r '.items[] | select(.path == "/{proxy+}") | .id')

echo ""
echo "🔗 Root Resource ID: $ROOT_RESOURCE_ID"
echo "🔗 Proxy Resource ID: $PROXY_RESOURCE_ID"

echo ""
echo "3. 🛠️  Updating OPTIONS method for root resource..."
echo "---------------------------------------------------"
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method OPTIONS \
  --authorization-type NONE \
  --region $REGION

aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false \
  --region $REGION

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method OPTIONS \
  --type MOCK \
  --integration-http-method OPTIONS \
  --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
  --region $REGION

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' \
  --region $REGION

echo ""
echo "4. 🛠️  Updating OPTIONS method for proxy resource..."
echo "----------------------------------------------------"
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method OPTIONS \
  --authorization-type NONE \
  --region $REGION

aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false \
  --region $REGION

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method OPTIONS \
  --type MOCK \
  --integration-http-method OPTIONS \
  --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
  --region $REGION

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'","method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"}' \
  --region $REGION

echo ""
echo "5. 🚀 Deploying API changes..."
echo "------------------------------"
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name $STAGE \
  --description "CORS fix deployment $(date)" \
  --region $REGION

echo ""
echo "6. ⏳ Waiting for deployment to complete..."
echo "-------------------------------------------"
sleep 10

echo ""
echo "7. 🧪 Testing CORS configuration..."
echo "-----------------------------------"
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE"
WEB_URL="http://ai-image-analyzer-web-1751723364.s3-website-ap-southeast-1.amazonaws.com"

echo "Testing OPTIONS request..."
curl -v -X OPTIONS "$API_URL/health" \
  -H "Origin: $WEB_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1 | grep -i "access-control"

echo ""
echo "Testing actual API call with CORS headers..."
curl -v -X GET "$API_URL/health" \
  -H "Origin: $WEB_URL" 2>&1 | grep -i "access-control"

echo ""
echo "✅ CORS configuration completed!"
echo "🌐 API URL: $API_URL"
echo "🔗 Test the website now: $WEB_URL"
