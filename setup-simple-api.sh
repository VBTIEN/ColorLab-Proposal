#!/bin/bash

echo "🌐 Setting up Simple API Gateway (Non-Proxy)"
echo "============================================"

# Configuration
FUNCTION_NAME="ai-image-analyzer-enhanced"
REGION="ap-southeast-1"
API_NAME="ai-image-analyzer-simple"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get Lambda function ARN
FUNCTION_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)
echo "Function ARN: $FUNCTION_ARN"

# Create new API
echo -e "${YELLOW}🆕 Creating simple API Gateway...${NC}"
API_ID=$(aws apigateway create-rest-api \
    --name $API_NAME \
    --description "Simple AI Image Analyzer API" \
    --region $REGION \
    --query 'id' --output text)

echo "API ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[0].id' --output text)
echo "Root Resource ID: $ROOT_ID"

# Add Lambda permission
echo -e "${YELLOW}🔐 Adding Lambda permissions...${NC}"
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id "simple-api-$API_ID" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --region $REGION 2>/dev/null || echo "Permission exists"

# Create /health resource
echo -e "${YELLOW}📋 Creating /health resource...${NC}"
HEALTH_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part health \
    --region $REGION \
    --query 'id' --output text)

echo "Health Resource ID: $HEALTH_RESOURCE_ID"

# Create GET method for /health
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --region $REGION

# Create integration for /health
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --request-templates '{"application/json": "{\"httpMethod\": \"GET\", \"path\": \"/health\"}"}' \
    --region $REGION

# Create method response for /health
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": false}' \
    --region $REGION

# Create integration response for /health
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'\''*'\''"}' \
    --response-templates '{"application/json": "$input.body"}' \
    --region $REGION

# Create GET method for root
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --authorization-type NONE \
    --region $REGION

# Create integration for root
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --type AWS \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --request-templates '{"application/json": "{\"httpMethod\": \"GET\", \"path\": \"/\"}"}' \
    --region $REGION

# Create method response for root
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": false}' \
    --region $REGION

# Create integration response for root
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Origin": "'\''*'\''"}' \
    --response-templates '{"application/json": "$input.body"}' \
    --region $REGION

# Deploy API
echo -e "${YELLOW}🚀 Deploying API...${NC}"
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION > /dev/null

# Get API endpoint
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo -e "${GREEN}✅ Simple API Gateway setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 API Details:${NC}"
echo "  API ID: $API_ID"
echo "  Endpoint: $API_ENDPOINT"
echo ""

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

sleep 2

echo "Testing root endpoint..."
ROOT_RESPONSE=$(curl -s "$API_ENDPOINT/" || echo "failed")
if [[ $ROOT_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Root endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Root: $ROOT_RESPONSE${NC}"
fi

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")
if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Health: $HEALTH_RESPONSE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Simple API Setup Complete!${NC}"
echo "============================="
echo -e "${BLUE}📋 Working Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/"
echo "  GET  $API_ENDPOINT/health"
echo ""
echo -e "${YELLOW}📝 Update your web app to use:${NC}"
echo "  $API_ENDPOINT"
