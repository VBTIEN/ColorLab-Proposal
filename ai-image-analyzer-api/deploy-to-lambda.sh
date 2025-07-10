#!/bin/bash
set -e

echo "🚀 AI Image Analyzer FastAPI - AWS Lambda Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="us-east-1"
PYTHON_VERSION="python3.11"
MEMORY_SIZE=512
TIMEOUT=30

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")

if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "   Function Name: $FUNCTION_NAME"
echo "   Region: $REGION"
echo "   Account ID: $ACCOUNT_ID"
echo "   Python Version: $PYTHON_VERSION"
echo "   Memory: ${MEMORY_SIZE}MB"
echo "   Timeout: ${TIMEOUT}s"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
    source venv/bin/activate
    pip install fastapi uvicorn pydantic pydantic-settings mangum
else
    source venv/bin/activate
fi

# Install mangum if not present
pip show mangum > /dev/null 2>&1 || pip install mangum

echo -e "${BLUE}📦 Building deployment package...${NC}"

# Clean up previous deployment
rm -rf lambda-deployment
rm -f lambda-deployment.zip

# Create deployment directory
mkdir lambda-deployment
cd lambda-deployment

# Copy application code
echo "   Copying application code..."
cp -r ../app ./
cp ../.env ./

# Create Lambda handler
echo "   Creating Lambda handler..."
cat > lambda_function.py << 'EOF'
"""
AWS Lambda handler for AI Image Analyzer FastAPI
"""
import json
import sys
import os
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))
sys.path.insert(0, str(current_dir / "app"))

try:
    from mangum import Mangum
    from app.main_test import app
    
    # Create Mangum handler
    handler = Mangum(app, lifespan="off")
    
    def lambda_handler(event, context):
        """AWS Lambda entry point"""
        try:
            # Log the event for debugging
            print(f"Event: {json.dumps(event, default=str)}")
            
            # Handle the request
            response = handler(event, context)
            
            # Log the response for debugging
            print(f"Response: {json.dumps(response, default=str)}")
            
            return response
            
        except Exception as e:
            print(f"Error in lambda_handler: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                "body": json.dumps({
                    "success": False,
                    "error": {
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": str(e)
                    }
                })
            }

except ImportError as e:
    print(f"Import error: {e}")
    
    def lambda_handler(event, context):
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": {
                    "code": "IMPORT_ERROR",
                    "message": f"Failed to import dependencies: {str(e)}"
                }
            })
        }
EOF

# Install dependencies locally
echo "   Installing dependencies..."
pip install \
    fastapi==0.115.14 \
    uvicorn==0.35.0 \
    pydantic==2.11.7 \
    pydantic-settings==2.10.1 \
    python-dotenv==1.1.1 \
    mangum==0.18.0 \
    -t .

# Create deployment package
echo "   Creating deployment package..."
zip -r ../lambda-deployment.zip . -x "*.pyc" "__pycache__/*" "*.git*" "tests/*" "*.md"

cd ..

echo -e "${GREEN}✅ Deployment package created: lambda-deployment.zip${NC}"

# Check if IAM role exists
ROLE_NAME="AIImageAnalyzerFastAPIRole"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo -e "${BLUE}🔐 Checking IAM role...${NC}"
if ! aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
    echo "   Creating IAM role..."
    
    # Create trust policy
    cat > trust-policy.json << 'EOF'
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
        --assume-role-policy-document file://trust-policy.json \
        --description "Role for AI Image Analyzer FastAPI Lambda function"

    # Attach basic execution policy
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

    # Attach additional policies if needed
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

    rm trust-policy.json
    
    echo "   Waiting for role to be ready..."
    sleep 10
else
    echo "   IAM role already exists"
fi

# Deploy Lambda function
echo -e "${BLUE}☁️  Deploying to AWS Lambda...${NC}"

if aws lambda get-function --function-name $FUNCTION_NAME > /dev/null 2>&1; then
    echo "   Updating existing function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://lambda-deployment.zip \
        --region $REGION

    # Update configuration
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --environment Variables='{
            "PYTHONPATH": "/var/task:/var/task/app",
            "AWS_LAMBDA_EXEC_WRAPPER": "/opt/bootstrap"
        }' \
        --region $REGION
else
    echo "   Creating new function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $PYTHON_VERSION \
        --role $ROLE_ARN \
        --handler lambda_function.lambda_handler \
        --zip-file fileb://lambda-deployment.zip \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --environment Variables='{
            "PYTHONPATH": "/var/task:/var/task/app",
            "AWS_LAMBDA_EXEC_WRAPPER": "/opt/bootstrap"
        }' \
        --region $REGION
fi

echo -e "${GREEN}✅ Lambda function deployed successfully!${NC}"

# Create or update API Gateway
echo -e "${BLUE}🌐 Setting up API Gateway...${NC}"

API_NAME="ai-image-analyzer-fastapi-api"

# Check if API exists
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='$API_NAME'].id" --output text)

if [ "$API_ID" = "" ] || [ "$API_ID" = "None" ]; then
    echo "   Creating new API Gateway..."
    API_ID=$(aws apigateway create-rest-api \
        --name $API_NAME \
        --description "API Gateway for AI Image Analyzer FastAPI" \
        --endpoint-configuration types=REGIONAL \
        --query 'id' --output text)
    
    echo "   API ID: $API_ID"
    
    # Get root resource ID
    ROOT_ID=$(aws apigateway get-resources \
        --rest-api-id $API_ID \
        --query 'items[0].id' --output text)
    
    # Create {proxy+} resource
    RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ROOT_ID \
        --path-part '{proxy+}' \
        --query 'id' --output text)
    
    # Create ANY method for root
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $ROOT_ID \
        --http-method ANY \
        --authorization-type NONE
    
    # Create ANY method for proxy
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method ANY \
        --authorization-type NONE
    
    # Setup integration for root
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $ROOT_ID \
        --http-method ANY \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations"
    
    # Setup integration for proxy
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method ANY \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations"
    
    # Add Lambda permissions
    aws lambda add-permission \
        --function-name $FUNCTION_NAME \
        --statement-id apigateway-invoke-root \
        --action lambda:InvokeFunction \
        --principal apigateway.amazonaws.com \
        --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" \
        --region $REGION
    
    # Deploy API
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name prod \
        --description "Production deployment"
    
else
    echo "   API Gateway already exists: $API_ID"
    
    # Redeploy
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name prod \
        --description "Updated deployment $(date)"
fi

# Get API endpoint
API_ENDPOINT="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

echo -e "${GREEN}✅ API Gateway configured successfully!${NC}"

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"

echo "   Testing root endpoint..."
if curl -s -f "$API_ENDPOINT/" > /dev/null; then
    echo -e "${GREEN}   ✅ Root endpoint working${NC}"
else
    echo -e "${YELLOW}   ⚠️  Root endpoint test failed (might need a moment to warm up)${NC}"
fi

echo "   Testing health endpoint..."
if curl -s -f "$API_ENDPOINT/health" > /dev/null; then
    echo -e "${GREEN}   ✅ Health endpoint working${NC}"
else
    echo -e "${YELLOW}   ⚠️  Health endpoint test failed (might need a moment to warm up)${NC}"
fi

# Cleanup
echo -e "${BLUE}🧹 Cleaning up...${NC}"
rm -rf lambda-deployment
rm -f lambda-deployment.zip

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "   Function Name: $FUNCTION_NAME"
echo "   API Gateway ID: $API_ID"
echo "   Region: $REGION"
echo ""
echo -e "${BLUE}🔗 API Endpoints:${NC}"
echo "   Root: $API_ENDPOINT/"
echo "   Health: $API_ENDPOINT/health"
echo "   API v1 Health: $API_ENDPOINT/api/v1/health"
echo "   Documentation: $API_ENDPOINT/api/v1/docs"
echo ""
echo -e "${BLUE}🧪 Test Commands:${NC}"
echo "   curl $API_ENDPOINT/"
echo "   curl $API_ENDPOINT/health"
echo "   curl $API_ENDPOINT/api/v1/health"
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo "   CloudWatch Logs: /aws/lambda/$FUNCTION_NAME"
echo "   AWS Console: https://console.aws.amazon.com/lambda/home?region=${REGION}#/functions/${FUNCTION_NAME}"
echo ""
echo -e "${GREEN}🎯 Your FastAPI is now live on AWS Lambda!${NC}"
