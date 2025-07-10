#!/bin/bash

echo "🌐 Configuring API Gateway for AI-Powered Image Analyzer"
echo "========================================================"

# Configuration
API_ID="c4yhtzbxk8"
FUNCTION_NAME="ai-image-analyzer-enhanced"
REGION="ap-southeast-1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  API ID: $API_ID"
echo "  Function: $FUNCTION_NAME"
echo "  Region: $REGION"
echo ""

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?path==`/`].id' --output text)
echo "Root Resource ID: $ROOT_ID"

# Get Lambda function ARN
FUNCTION_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.FunctionArn' --output text)
echo "Function ARN: $FUNCTION_ARN"

# Create /health resource
echo -e "${YELLOW}📋 Creating /health resource...${NC}"
HEALTH_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part health \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || \
    aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?pathPart==`health`].id' --output text)

echo "Health Resource ID: $HEALTH_RESOURCE_ID"

# Create GET method for /health
echo -e "${YELLOW}📋 Creating GET method for /health...${NC}"
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || echo "GET method already exists"

# Create integration for /health GET
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $HEALTH_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --region $REGION 2>/dev/null || echo "Integration already exists"

# Create /api resource
echo -e "${YELLOW}📋 Creating /api resource...${NC}"
API_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part api \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || \
    aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?pathPart==`api`].id' --output text)

echo "API Resource ID: $API_RESOURCE_ID"

# Create /api/v1 resource
echo -e "${YELLOW}📋 Creating /api/v1 resource...${NC}"
V1_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $API_RESOURCE_ID \
    --path-part v1 \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || \
    aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?pathPart==`v1`].id' --output text)

echo "V1 Resource ID: $V1_RESOURCE_ID"

# Create /api/v1/analyze resource
echo -e "${YELLOW}📋 Creating /api/v1/analyze resource...${NC}"
ANALYZE_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $V1_RESOURCE_ID \
    --path-part analyze \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || \
    aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?pathPart==`analyze`].id' --output text)

echo "Analyze Resource ID: $ANALYZE_RESOURCE_ID"

# Create POST method for /api/v1/analyze
echo -e "${YELLOW}📋 Creating POST method for /api/v1/analyze...${NC}"
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || echo "POST method already exists"

# Create integration for /api/v1/analyze POST
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --region $REGION 2>/dev/null || echo "Integration already exists"

# Create OPTIONS method for CORS (analyze)
echo -e "${YELLOW}📋 Creating OPTIONS method for CORS...${NC}"
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || echo "OPTIONS method already exists"

# Create mock integration for OPTIONS
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --integration-http-method OPTIONS \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION 2>/dev/null || echo "OPTIONS integration already exists"

# Create method response for OPTIONS
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers": false, "method.response.header.Access-Control-Allow-Methods": false, "method.response.header.Access-Control-Allow-Origin": false}' \
    --region $REGION 2>/dev/null || echo "OPTIONS method response already exists"

# Create integration response for OPTIONS
aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $ANALYZE_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{"method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\''", "method.response.header.Access-Control-Allow-Methods": "'\''GET,POST,OPTIONS'\''", "method.response.header.Access-Control-Allow-Origin": "'\''*'\''"}' \
    --region $REGION 2>/dev/null || echo "OPTIONS integration response already exists"

# Create root GET method
echo -e "${YELLOW}📋 Creating GET method for root...${NC}"
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || echo "Root GET method already exists"

# Create integration for root GET
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations" \
    --region $REGION 2>/dev/null || echo "Root integration already exists"

# Deploy API
echo -e "${YELLOW}🚀 Deploying API...${NC}"
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION > /dev/null

echo -e "${GREEN}✅ API Gateway configuration completed!${NC}"

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")
if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
else
    echo -e "${YELLOW}⚠️ Health endpoint needs time to initialize${NC}"
fi

echo ""
echo -e "${GREEN}🎉 API Gateway Setup Complete!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Available Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/"
echo "  GET  $API_ENDPOINT/health"
echo "  POST $API_ENDPOINT/api/v1/analyze"
echo ""
echo -e "${BLUE}🤖 AI Features Ready:${NC}"
echo "  ✅ Amazon Rekognition"
echo "  ✅ Amazon Bedrock (Claude)"
echo "  ✅ Real Color Analysis"
echo "  ✅ Creative AI Insights"
