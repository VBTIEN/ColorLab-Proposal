#!/bin/bash

# Deploy only application code (after layer is already attached)
# This is much faster since we only deploy ~60KB instead of 19.5MB

set -e

echo "🚀 Deploying Application Code Only..."

# Configuration
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"

# Create code-only deployment package
echo "📦 Creating code-only deployment package..."

TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Copy only your application code (no dependencies)
echo "📁 Copying application code..."
cp -r ai-image-analyzer-api/app/ $TEMP_DIR/
cp ai-image-analyzer-api/lambda_function.py $TEMP_DIR/

# Create ZIP package
echo "🗜️ Creating ZIP package..."
cd $TEMP_DIR
zip -r ../code-only.zip . -q
cd - > /dev/null

# Move package to current directory
mv $TEMP_DIR/../code-only.zip .

# Clean up temporary directory
rm -rf $TEMP_DIR

echo "✅ Code package created: code-only.zip"
echo "📊 Package size: $(du -h code-only.zip | cut -f1)"

# Wait for function to be ready
echo "⏳ Checking function status..."
while true; do
    STATUS=$(aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.LastUpdateStatus' \
        --output text)
    
    if [ "$STATUS" = "Successful" ]; then
        echo "✅ Function is ready for update"
        break
    elif [ "$STATUS" = "Failed" ]; then
        echo "❌ Function is in failed state"
        exit 1
    else
        echo "⏳ Function status: $STATUS, waiting..."
        sleep 5
    fi
done

# Deploy code
echo "🚀 Deploying code to Lambda..."

aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://code-only.zip \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Code deployment successful!"
    
    # Get updated function info
    echo "📋 Updated function information:"
    aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.[FunctionName,Runtime,LastModified,CodeSize,Layers[0].Arn]' \
        --output table
    
    echo ""
    echo "🎯 Optimization Results:"
    echo "  Function Code: $(du -h code-only.zip | cut -f1) (your application)"
    echo "  Layer: 16MB (dependencies - shared across functions)"
    echo "  Total: ~16MB (but faster deployments!)"
    echo ""
    echo "✅ Benefits Achieved:"
    echo "  🚀 Faster deployments (60KB vs 19.5MB)"
    echo "  🔄 Layer reusability across functions"
    echo "  📦 Cleaner separation of code vs dependencies"
    echo "  ⚡ Better cold start performance"
    
    echo ""
    echo "🌐 API Endpoint:"
    echo "https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
    
else
    echo "❌ Code deployment failed!"
    exit 1
fi

# Clean up
echo "🧹 Cleaning up..."
rm -f code-only.zip

echo "🎉 Optimized deployment completed!"
