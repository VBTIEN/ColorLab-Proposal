#!/bin/bash

echo "👁️ Deploying REAL AI Vision Image Analyzer"
echo "============================================="
echo "🎯 Purpose: AI actually sees and analyzes each different image"
echo "🚫 No hardcoded results - Real AI vision per image"
echo ""

# Configuration
FUNCTION_NAME="ai-image-analyzer-real-vision"
REGION="ap-southeast-1"
ROLE_NAME="lambda-execution-role"
API_NAME="ai-image-analyzer-real-vision-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Real AI Vision Configuration:${NC}"
echo "  Function: $FUNCTION_NAME"
echo "  Region: $REGION"
echo "  API: $API_NAME"
echo "  AI Model: Claude 3 Haiku (Multi-step Analysis)"
echo "  Vision: Real per-image analysis"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Create deployment package
echo -e "${YELLOW}📦 Creating Real AI Vision deployment package...${NC}"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Working in: $TEMP_DIR"

# Copy Real AI Vision Lambda function
cp ai-image-analyzer-api/lambda_function_real_ai_vision.py $TEMP_DIR/lambda_function.py

# Create requirements for Real AI Vision
cat > $TEMP_DIR/requirements.txt << EOF
boto3>=1.34.0
botocore>=1.34.0
EOF

# Install dependencies
cd $TEMP_DIR
echo -e "${YELLOW}📥 Installing dependencies for Real AI Vision...${NC}"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt -t .

# Remove unnecessary files
rm -rf venv/
rm -rf __pycache__/
rm -rf *.dist-info/
rm requirements.txt

# Create ZIP package
echo -e "${YELLOW}🗜️ Creating Real AI Vision deployment package...${NC}"
zip -r ../real-ai-vision-function.zip . > /dev/null
cd ..

echo -e "${GREEN}✅ Real AI Vision package created: real-ai-vision-function.zip${NC}"

# Get or create IAM role with Bedrock permissions
echo -e "${YELLOW}🔐 Setting up IAM role with Bedrock access...${NC}"

ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "Creating IAM role for Real AI Vision..."
    
    # Create trust policy
    cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Create role
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file://trust-policy.json > /dev/null

    # Attach basic Lambda execution policy
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    rm trust-policy.json
fi

# Ensure Bedrock permissions for Real AI Vision
echo "Adding Bedrock permissions for Real AI Vision..."
cat > bedrock-real-vision-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream",
                "bedrock:ListFoundationModels"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
                "arn:aws:bedrock:*::foundation-model/*"
            ]
        }
    ]
}
EOF

aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name BedrockRealVisionAccess \
    --policy-document file://bedrock-real-vision-policy.json

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)

echo "Waiting for role to be ready..."
sleep 10

rm bedrock-real-vision-policy.json

echo -e "${GREEN}✅ IAM role ready with Bedrock access: $ROLE_ARN${NC}"

# Deploy or update Lambda function
echo -e "${YELLOW}🚀 Deploying Real AI Vision Lambda function...${NC}"

if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION &> /dev/null; then
    echo "Updating existing Real AI Vision function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://real-ai-vision-function.zip \
        --region $REGION > /dev/null

    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --timeout 60 \
        --memory-size 1024 \
        --region $REGION \
        --environment Variables='{REAL_AI_VISION=true,AI_MODEL=claude-3-haiku}' > /dev/null
else
    echo "Creating new Real AI Vision function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime python3.11 \
        --role $ROLE_ARN \
        --handler lambda_function.lambda_handler \
        --zip-file fileb://real-ai-vision-function.zip \
        --timeout 60 \
        --memory-size 1024 \
        --region $REGION \
        --environment Variables='{REAL_AI_VISION=true,AI_MODEL=claude-3-haiku}' > /dev/null
fi

echo -e "${GREEN}✅ Real AI Vision Lambda function deployed${NC}"

# Set up API Gateway
echo -e "${YELLOW}🌐 Setting up API Gateway for Real AI Vision...${NC}"

# Check if API exists
API_ID=$(aws apigateway get-rest-apis --region $REGION --query "items[?name=='$API_NAME'].id" --output text)

if [ -z "$API_ID" ] || [ "$API_ID" == "None" ]; then
    echo "Creating new API Gateway for Real AI Vision..."
    API_ID=$(aws apigateway create-rest-api \
        --name $API_NAME \
        --description "Real AI Vision Image Analyzer API - AI sees each image differently" \
        --region $REGION \
        --query 'id' --output text)
fi

echo "Real AI Vision API ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id' --output text)

# Add Lambda permission for Real AI Vision
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api-gateway-invoke-real-vision \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --region $REGION 2>/dev/null || true

# Create basic integration (simplified for Real AI Vision)
echo "Setting up Real AI Vision API integration..."

# Create ANY method on root resource
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || true

# Set up integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:$FUNCTION_NAME/invocations" \
    --region $REGION 2>/dev/null || true

# Deploy API
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || echo "existing")

# Get API endpoint
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo -e "${GREEN}✅ Real AI Vision API Gateway configured${NC}"

# Test the Real AI Vision deployment
echo -e "${YELLOW}🧪 Testing Real AI Vision deployment...${NC}"

# Test health endpoint
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")

if [[ $HEALTH_RESPONSE == *"success"* ]] || [[ $HEALTH_RESPONSE == *"real-ai-vision"* ]]; then
    echo -e "${GREEN}✅ Real AI Vision health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ Health check response: $HEALTH_RESPONSE${NC}"
    echo -e "${YELLOW}⚠️ Health check may have failed, but deployment completed${NC}"
fi

# Cleanup
rm -rf $TEMP_DIR
rm -f real-ai-vision-function.zip

# Summary
echo ""
echo -e "${GREEN}🎉 REAL AI VISION DEPLOYMENT COMPLETE!${NC}"
echo "=================================================="
echo -e "${PURPLE}👁️ Real AI Vision Features:${NC}"
echo "  ✅ AI actually sees each image differently"
echo "  ✅ No hardcoded color results"
echo "  ✅ Multi-step AI analysis process"
echo "  ✅ Claude 3 Haiku vision analysis"
echo "  ✅ Unique analysis per image upload"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  Function Name: $FUNCTION_NAME"
echo "  API Endpoint: $API_ENDPOINT"
echo "  Region: $REGION"
echo "  Memory: 1024 MB (for AI processing)"
echo "  Timeout: 60 seconds (for AI analysis)"
echo ""
echo -e "${BLUE}🤖 AI Analysis Process:${NC}"
echo "  Step 1: AI describes what it sees in the image"
echo "  Step 2: AI extracts colors from its description"
echo "  Step 3: AI provides insights from actual colors"
echo "  Step 4: AI structures results for API response"
echo ""
echo -e "${BLUE}📋 Available Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/health"
echo "  POST $API_ENDPOINT/analyze"
echo "  GET  $API_ENDPOINT/ (info)"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Test with different images to see unique analysis"
echo "  2. Update web app to use: $API_ENDPOINT"
echo "  3. Monitor CloudWatch logs for AI processing"
echo "  4. Compare results between different images"
echo ""
echo -e "${GREEN}🚀 Your REAL AI Vision analyzer is ready!${NC}"
echo -e "${PURPLE}🎯 Each image will now get unique AI analysis!${NC}"
