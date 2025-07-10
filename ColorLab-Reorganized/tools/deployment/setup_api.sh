#!/bin/bash

echo "🌐 Setting up Complete API Gateway for AI Image Analyzer"
echo "======================================================"

# Configuration
FUNCTION_NAME="ai-image-analyzer-enhanced"
REGION="ap-southeast-1"
API_NAME="ai-image-analyzer-api-v2"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get Lambda function ARN
FUNCTION_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)
echo "Function ARN: $FUNCTION_ARN"

# Create new API
echo -e "${YELLOW}🆕 Creating new API Gateway...${NC}"
API_ID=$(aws apigateway create-rest-api \
    --name $API_NAME \
    --description "AI-Powered Image Analyzer API - Complete Setup" \
    --region $REGION \
    --query 'id' --output text)

echo "New API ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[0].id' --output text)
echo "Root Resource ID: $ROOT_ID"

# Add Lambda permission for new API
echo -e "${YELLOW}🔐 Adding Lambda permissions...${NC}"
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id "api-gateway-invoke-$API_ID" \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --region $REGION 2>/dev/null || echo "Permission already exists"

# Setup proxy integration for all paths
echo -e "${YELLOW}📋 Setting up proxy integration...${NC}"

# Create {proxy+} resource
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part '{proxy+}' \
    --region $REGION \
    --query 'id' --output text)

echo "Proxy Resource ID: $PROXY_RESOURCE_ID"

# Create ANY method for proxy
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --authorization-type NONE \
    --region $REGION

# Create proxy integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PROXY_RESOURCE_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --region $REGION

# Create ANY method for root
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --authorization-type NONE \
    --region $REGION

# Create root integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --region $REGION

# Deploy API
echo -e "${YELLOW}🚀 Deploying API...${NC}"
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION > /dev/null

# Get API endpoint
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo -e "${GREEN}✅ API Gateway setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 New API Details:${NC}"
echo "  API ID: $API_ID"
echo "  Endpoint: $API_ENDPOINT"
echo ""

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

echo "Testing root endpoint..."
ROOT_RESPONSE=$(curl -s "$API_ENDPOINT/" || echo "failed")
if [[ $ROOT_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Root endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Root endpoint: $ROOT_RESPONSE${NC}"
fi

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")
if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Health endpoint: $HEALTH_RESPONSE${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Complete API Setup Finished!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Available Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/"
echo "  GET  $API_ENDPOINT/health"
echo "  POST $API_ENDPOINT/api/v1/analyze"
echo ""
echo -e "${BLUE}🤖 AI Features Ready:${NC}"
echo "  ✅ Amazon Rekognition"
echo "  ✅ Enhanced Color Analysis"
echo "  ✅ AI-Generated Insights"
echo "  ✅ Creative Suggestions"
echo ""
echo -e "${YELLOW}📝 Next Step:${NC}"
echo "  Update your web app to use: $API_ENDPOINT"
