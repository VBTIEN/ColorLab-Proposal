#!/bin/bash

echo "🔧 Fixing Real AI Vision API Gateway Configuration"
echo "=================================================="

API_ID="spsvd9ec7i"
FUNCTION_NAME="ai-image-analyzer-real-vision"
REGION="ap-southeast-1"

echo "API ID: $API_ID"
echo "Function: $FUNCTION_NAME"
echo "Region: $REGION"
echo ""

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id' --output text)

echo "Root Resource ID: $ROOT_ID"

# Create proxy resource {proxy+}
echo "Creating proxy resource..."
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part '{proxy+}' \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || echo "exists")

if [ "$PROXY_RESOURCE_ID" != "exists" ]; then
    echo "Proxy Resource ID: $PROXY_RESOURCE_ID"
    
    # Add ANY method to proxy resource
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $PROXY_RESOURCE_ID \
        --http-method ANY \
        --authorization-type NONE \
        --region $REGION 2>/dev/null || true

    # Set up integration for proxy resource
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $PROXY_RESOURCE_ID \
        --http-method ANY \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME/invocations" \
        --region $REGION 2>/dev/null || true
fi

# Update root resource integration
echo "Updating root resource integration..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME/invocations" \
    --region $REGION 2>/dev/null || true

# Add CORS support
echo "Adding CORS support..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || true

# Set up CORS integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-http-method OPTIONS \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION 2>/dev/null || true

# Set up CORS response
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers": false, "method.response.header.Access-Control-Allow-Methods": false, "method.response.header.Access-Control-Allow-Origin": false}' \
    --region $REGION 2>/dev/null || true

aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "\"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token\"", "method.response.header.Access-Control-Allow-Methods": "\"GET,POST,OPTIONS\"", "method.response.header.Access-Control-Allow-Origin": "\"*\""}' \
    --region $REGION 2>/dev/null || true

# Update Lambda permissions
echo "Updating Lambda permissions..."
aws lambda remove-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api-gateway-invoke-real-vision \
    --region $REGION 2>/dev/null || true

aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api-gateway-invoke-real-vision \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*" \
    --region $REGION 2>/dev/null || true

# Deploy API
echo "Deploying API..."
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION \
    --query 'id' --output text)

echo "Deployment ID: $DEPLOYMENT_ID"

# Test the API
echo ""
echo "🧪 Testing fixed API..."
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo "Testing root endpoint..."
curl -s "$API_ENDPOINT/" | head -c 200
echo ""

echo "Testing health endpoint..."
curl -s "$API_ENDPOINT/health" | head -c 200
echo ""

echo ""
echo "✅ API Gateway configuration updated!"
echo "API Endpoint: $API_ENDPOINT"
