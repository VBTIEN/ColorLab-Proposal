#!/bin/bash
set -e

echo "🚀 AI Image Analyzer FastAPI - AWS Lambda Deployment (Fixed)"
echo "============================================================"

# Variables
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="us-east-1"
PYTHON_VERSION="python3.11"
MEMORY_SIZE=512
TIMEOUT=30
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_NAME="AIImageAnalyzerFastAPIRole"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

echo "📋 Configuration:"
echo "   Function: $FUNCTION_NAME"
echo "   Region: $REGION"
echo "   Account: $ACCOUNT_ID"
echo "   Role: $ROLE_ARN"
echo ""

# Deploy Lambda function (role already exists)
echo "☁️ Deploying to AWS Lambda..."

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

echo "✅ Lambda function created successfully!"

# Create API Gateway
echo "🌐 Setting up API Gateway..."

API_NAME="ai-image-analyzer-fastapi-api"
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
    --statement-id apigateway-invoke \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*" \
    --region $REGION

# Deploy API
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod \
    --description "Production deployment"

# Get API endpoint
API_ENDPOINT="https://${API_ID}.execute-api.${REGION}.amazonaws.com/prod"

echo "✅ API Gateway configured successfully!"
echo ""
echo "🎉 Deployment completed!"
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
echo ""

# Test the deployment
echo "🧪 Testing deployment..."
sleep 5

echo "   Testing root endpoint..."
curl -s "$API_ENDPOINT/" | head -3

echo ""
echo "   Testing health endpoint..."
curl -s "$API_ENDPOINT/health" | head -3

echo ""
echo "✅ Your FastAPI is now live on AWS Lambda!"
echo "📊 Monitor at: https://console.aws.amazon.com/lambda/home?region=${REGION}#/functions/${FUNCTION_NAME}"
