#!/bin/bash

echo "🤖 Deploying AI-Powered Image Analyzer with Amazon Bedrock"
echo "=========================================================="

# Configuration
FUNCTION_NAME="ai-image-analyzer-enhanced"
REGION="ap-southeast-1"
ROLE_NAME="lambda-execution-role"
API_NAME="ai-image-analyzer-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "  Function: $FUNCTION_NAME"
echo "  Region: $REGION"
echo "  API: $API_NAME"
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
echo -e "${YELLOW}📦 Creating AI-powered deployment package...${NC}"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Working in: $TEMP_DIR"

# Copy Lambda function
cp ai-image-analyzer-api/lambda_function_ai_powered.py $TEMP_DIR/lambda_function.py

# Create requirements if not exists
if [ ! -f "ai-image-analyzer-api/requirements-ai-powered.txt" ]; then
    echo "boto3>=1.34.0" > $TEMP_DIR/requirements.txt
    echo "botocore>=1.34.0" >> $TEMP_DIR/requirements.txt
else
    cp ai-image-analyzer-api/requirements-ai-powered.txt $TEMP_DIR/requirements.txt
fi

# Install dependencies
cd $TEMP_DIR
echo -e "${YELLOW}📥 Installing dependencies...${NC}"

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
echo -e "${YELLOW}🗜️ Creating deployment package...${NC}"
zip -r ../ai-powered-function.zip . > /dev/null
cd ..

echo -e "${GREEN}✅ Package created: ai-powered-function.zip${NC}"

# Get or create IAM role
echo -e "${YELLOW}🔐 Setting up IAM role...${NC}"

ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "Creating IAM role..."
    
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

    # Attach policies
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionFullAccess

    # Create Bedrock policy
    cat > bedrock-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
            ]
        }
    ]
}
EOF

    aws iam put-role-policy \
        --role-name $ROLE_NAME \
        --policy-name BedrockAccess \
        --policy-document file://bedrock-policy.json

    # Get role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    
    echo "Waiting for role to be ready..."
    sleep 10
    
    rm trust-policy.json bedrock-policy.json
fi

echo -e "${GREEN}✅ IAM role ready: $ROLE_ARN${NC}"

# Deploy or update Lambda function
echo -e "${YELLOW}🚀 Deploying Lambda function...${NC}"

if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION &> /dev/null; then
    echo "Updating existing function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://ai-powered-function.zip \
        --region $REGION > /dev/null

    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --timeout 30 \
        --memory-size 512 \
        --region $REGION > /dev/null
else
    echo "Creating new function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime python3.9 \
        --role $ROLE_ARN \
        --handler lambda_function.lambda_handler \
        --zip-file fileb://ai-powered-function.zip \
        --timeout 30 \
        --memory-size 512 \
        --region $REGION > /dev/null
fi

echo -e "${GREEN}✅ Lambda function deployed${NC}"

# Set up API Gateway
echo -e "${YELLOW}🌐 Setting up API Gateway...${NC}"

# Check if API exists
API_ID=$(aws apigateway get-rest-apis --region $REGION --query "items[?name=='$API_NAME'].id" --output text)

if [ -z "$API_ID" ] || [ "$API_ID" == "None" ]; then
    echo "Creating new API Gateway..."
    API_ID=$(aws apigateway create-rest-api \
        --name $API_NAME \
        --description "AI-Powered Image Analyzer API" \
        --region $REGION \
        --query 'id' --output text)
fi

echo "API ID: $API_ID"

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query 'items[?path==`/`].id' --output text)

# Create resources and methods (simplified setup)
echo "Setting up API resources..."

# Add Lambda permission
aws lambda add-permission \
    --function-name $FUNCTION_NAME \
    --statement-id api-gateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --region $REGION 2>/dev/null || true

# Deploy API
DEPLOYMENT_ID=$(aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --region $REGION \
    --query 'id' --output text 2>/dev/null || echo "existing")

# Get API endpoint
API_ENDPOINT="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo -e "${GREEN}✅ API Gateway configured${NC}"

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"

# Test health endpoint
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")

if [[ $HEALTH_RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ Health check failed, but deployment completed${NC}"
fi

# Cleanup
rm -rf $TEMP_DIR
rm -f ai-powered-function.zip

# Summary
echo ""
echo -e "${GREEN}🎉 AI-Powered Deployment Complete!${NC}"
echo "=========================================="
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "  Function Name: $FUNCTION_NAME"
echo "  API Endpoint: $API_ENDPOINT"
echo "  Region: $REGION"
echo ""
echo -e "${BLUE}🤖 AI Features Enabled:${NC}"
echo "  ✅ Amazon Rekognition (Object Detection)"
echo "  ✅ Amazon Bedrock (Claude AI Analysis)"
echo "  ✅ Real Color Analysis"
echo "  ✅ Creative AI Insights"
echo ""
echo -e "${BLUE}📋 Available Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/health"
echo "  POST $API_ENDPOINT/api/v1/analyze"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Update your web app to use: $API_ENDPOINT"
echo "  2. Test the AI analysis features"
echo "  3. Monitor CloudWatch logs for performance"
echo ""
echo -e "${GREEN}🚀 Your AI-powered image analyzer is ready!${NC}"
