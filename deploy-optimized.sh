#!/bin/bash

# Optimized Lambda Deployment with Layers
# This deploys only your application code, using layers for dependencies

set -e

echo "🚀 Starting Optimized Lambda Deployment..."

# Configuration
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"
LAYER_ARN=$(cat layer-arn.txt 2>/dev/null || echo "")

if [ -z "$LAYER_ARN" ]; then
    echo "❌ Layer ARN not found. Please run create-lambda-layer.sh first."
    exit 1
fi

echo "📋 Using Layer ARN: $LAYER_ARN"

# Create optimized deployment package (code only)
echo "📦 Creating optimized deployment package..."

TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Copy only your application code (no dependencies)
echo "📁 Copying application code only..."
cp -r ai-image-analyzer-api/app/ $TEMP_DIR/
cp ai-image-analyzer-api/lambda_function.py $TEMP_DIR/

# Create ZIP package (much smaller now)
echo "🗜️ Creating optimized ZIP package..."
cd $TEMP_DIR
zip -r ../optimized-function.zip . -q
cd - > /dev/null

# Move package to current directory
mv $TEMP_DIR/../optimized-function.zip .

# Clean up temporary directory
rm -rf $TEMP_DIR

echo "✅ Optimized package created: optimized-function.zip"
echo "📊 Package size: $(du -h optimized-function.zip | cut -f1)"

# Update Lambda function configuration to use layer
echo "🔧 Updating Lambda function configuration..."

aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --layers $LAYER_ARN \
    --region $REGION \
    --timeout 30 \
    --memory-size 512

if [ $? -eq 0 ]; then
    echo "✅ Function configuration updated with layer!"
else
    echo "❌ Failed to update function configuration!"
    exit 1
fi

# Deploy optimized code
echo "🚀 Deploying optimized function code..."

aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://optimized-function.zip \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Optimized deployment successful!"
    
    # Get function info
    echo "📋 Updated function information:"
    aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.[FunctionName,Runtime,LastModified,CodeSize,Layers[0].Arn]' \
        --output table
    
    echo ""
    echo "🎯 Optimization Results:"
    echo "  Before: 19.5MB (function + dependencies)"
    echo "  After:  $(du -h optimized-function.zip | cut -f1) (function only) + 16MB (layer)"
    echo "  Benefits:"
    echo "    ✅ Faster deployments (only deploy your code changes)"
    echo "    ✅ Smaller function packages"
    echo "    ✅ Layer can be reused across multiple functions"
    echo "    ✅ Better cold start performance"
    
    echo ""
    echo "🌐 API Endpoint (unchanged):"
    echo "https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
    
    echo ""
    echo "🧪 Test the optimized function:"
    echo "curl https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod/health"
    
else
    echo "❌ Optimized deployment failed!"
    exit 1
fi

# Clean up deployment package
echo "🧹 Cleaning up deployment package..."
rm -f optimized-function.zip

echo "🎉 Optimized deployment completed successfully!"
