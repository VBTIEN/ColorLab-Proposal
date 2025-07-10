#!/bin/bash

# AI Image Analyzer API Deployment Script
# This script packages and deploys the FastAPI application to AWS Lambda

set -e

echo "🚀 Starting AI Image Analyzer API Deployment..."

# Configuration
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"
DEPLOYMENT_PACKAGE="deployment-package.zip"

# Clean up previous deployment package
echo "🧹 Cleaning up previous deployment package..."
rm -f $DEPLOYMENT_PACKAGE

# Create deployment package
echo "📦 Creating deployment package..."

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Copy application files
echo "📁 Copying application files..."
cp -r app/ $TEMP_DIR/
cp lambda_function.py $TEMP_DIR/
cp requirements.txt $TEMP_DIR/

# Install dependencies (if needed)
if [ -f requirements.txt ]; then
    echo "📚 Installing dependencies..."
    pip install -r requirements.txt -t $TEMP_DIR/ --quiet
fi

# Create ZIP package
echo "🗜️ Creating ZIP package..."
cd $TEMP_DIR
zip -r ../$DEPLOYMENT_PACKAGE . -q
cd - > /dev/null

# Move package to current directory
mv $TEMP_DIR/../$DEPLOYMENT_PACKAGE .

# Clean up temporary directory
rm -rf $TEMP_DIR

echo "✅ Deployment package created: $DEPLOYMENT_PACKAGE"
echo "📊 Package size: $(du -h $DEPLOYMENT_PACKAGE | cut -f1)"

# Deploy to Lambda
echo "🚀 Deploying to AWS Lambda..."

aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://$DEPLOYMENT_PACKAGE \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    # Get function info
    echo "📋 Function information:"
    aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.[FunctionName,Runtime,LastModified,CodeSize]' \
        --output table
    
    echo ""
    echo "🌐 API Endpoint:"
    echo "https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
    
    echo ""
    echo "🧪 Test endpoints:"
    echo "curl https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod/health"
    echo "curl https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod/api/v1/docs"
    
else
    echo "❌ Deployment failed!"
    exit 1
fi

# Clean up deployment package
echo "🧹 Cleaning up deployment package..."
rm -f $DEPLOYMENT_PACKAGE

echo "🎉 Deployment completed successfully!"
