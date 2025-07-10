#!/bin/bash
set -e

echo "🚀 AI Image Analyzer FastAPI - AWS Lambda Deployment (Singapore)"
echo "================================================================"

# Variables - CORRECT REGION
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"  # Singapore region
PYTHON_VERSION="python3.11"
MEMORY_SIZE=512
TIMEOUT=30
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="AIImageAnalyzerFastAPIRole"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo "📋 Configuration:"
echo "   Function: $FUNCTION_NAME"
echo "   Region: $REGION (Singapore)"
echo "   Account: $ACCOUNT_ID"
echo "   Role: $ROLE_ARN"
echo ""

# Activate virtual environment
source venv/bin/activate

# Install mangum if not present
pip show mangum > /dev/null 2>&1 || pip install mangum

echo "📦 Building deployment package..."

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

echo "✅ Deployment package created!"

# Create IAM role if not exists
echo "🔐 Setting up IAM role..."
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
echo "☁️ Deploying to AWS Lambda (Singapore region)..."

if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION > /dev/null 2>&1; then
    echo "   Updating existing function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://lambda-deployment.zip \
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
        --environment Variables="{PYTHONPATH=/var/task:/var/task/app}" \
        --region $REGION
fi

echo "✅ Lambda function deployed successfully!"

# Create API Gateway
echo "🌐 Setting up API Gateway (Singapore region)..."

API_NAME="ai-image-analyzer-fastapi-api"

# Check if API exists
API_ID=$(aws apigateway get-rest-apis --region $REGION --query "items[?name=='$API_NAME'].id" --output text)

if [ "$API_ID" = "" ] || [ "$API_ID" = "None" ]; then
    echo "   Creating new API Gateway..."
    API_ID=$(aws apigateway create-rest-api \
        --name $API_NAME \
        --description "API Gateway for AI Image Analyzer FastAPI" \
        --endpoint-configuration types=REGIONAL \
        --region $REGION \
        --query 'id' --output text)
    
    echo "   API ID: $API_ID"
    
    # Get root resource ID
    ROOT_ID=$(aws apigateway get-resources \
        --rest-api-id $API_ID \
        --region $REGION \
        --query 'items[0].id' --output text)
    
    # Create {proxy+} resource
    RESOURCE_ID=$(aws apigateway create-resource \
        --rest-api-id $API_ID \
        --parent-id $ROOT_ID \
        --path-part '{proxy+}' \
        --region $REGION \
        --query 'id' --output text)
    
    # Create ANY method for root
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $ROOT_ID \
        --http-method ANY \
        --authorization-type NONE \
        --region $REGION
    
    # Create ANY method for proxy
    aws apigateway put-method \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method ANY \
        --authorization-type NONE \
        --region $REGION
    
    # Setup integration for root
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $ROOT_ID \
        --http-method ANY \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" \
        --region $REGION
    
    # Setup integration for proxy
    aws apigateway put-integration \
        --rest-api-id $API_ID \
        --resource-id $RESOURCE_ID \
        --http-method ANY \
        --type AWS_PROXY \
        --integration-http-method POST \
        --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${FUNCTION_NAME}/invocations" \
        --region $REGION
    
    # Add Lambda permissions
    aws lambda add-permission \
        --function-name $FUNCTION_NAME \
        --statement-id apigateway-invoke \
        --action lambda:InvokeFunction \
        --principal apigateway.amazonaws.com \
        --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" \
        --region $REGION
    
    # Deploy API
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name prod \
        --description "Production deployment" \
        --region $REGION
    
else
    echo "   API Gateway already exists: $API_ID"
    
    # Redeploy
    aws apigateway create-deployment \
        --rest-api-id $API_ID \
        --stage-name prod \
        --description "Updated deployment $(date)" \
        --region $REGION
fi

# Get API endpoint
API_ENDPOINT="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

echo "✅ API Gateway configured successfully!"

# Cleanup
echo "🧹 Cleaning up..."
rm -rf lambda-deployment
rm -f lambda-deployment.zip

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Function Name: $FUNCTION_NAME"
echo "   API Gateway ID: $API_ID"
echo "   Region: $REGION (Singapore)"
echo ""
echo "🔗 API Endpoints:"
echo "   Root: $API_ENDPOINT/"
echo "   Health: $API_ENDPOINT/health"
echo "   API v1 Health: $API_ENDPOINT/api/v1/health"
echo "   Documentation: $API_ENDPOINT/api/v1/docs"
echo ""
echo "🧪 Test Commands:"
echo "   curl $API_ENDPOINT/"
echo "   curl $API_ENDPOINT/health"
echo "   curl $API_ENDPOINT/api/v1/health"
echo ""
echo "📊 Monitoring:"
echo "   CloudWatch Logs: /aws/lambda/$FUNCTION_NAME"
echo "   AWS Console: https://console.aws.amazon.com/lambda/home?region=${REGION}#/functions/${FUNCTION_NAME}"
echo ""

# Test the deployment
echo "🧪 Testing deployment..."
echo "   Waiting for API to be ready..."
sleep 10

echo "   Testing root endpoint..."
curl -s "$API_ENDPOINT/" | head -3 || echo "   (API might need more time to warm up)"

echo ""
echo "✅ Your FastAPI is now live on AWS Lambda in Singapore region!"
echo "🌏 Region: ap-southeast-1 (Singapore)"
