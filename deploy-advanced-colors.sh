#!/bin/bash

# Deploy Advanced Color Analysis Version
# This deploys the enhanced Lambda function with real color extraction

set -e

echo "🎨 Deploying Advanced Color Analysis Version..."

# Configuration
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"
LAYER_NAME="ai-image-analyzer-dependencies-advanced"

# Create new layer with advanced dependencies
echo "📦 Creating advanced dependencies layer..."

LAYER_DIR="lambda-layer-advanced"
PYTHON_DIR="$LAYER_DIR/python"

# Clean up previous layer
rm -rf $LAYER_DIR

# Create layer directory structure
mkdir -p $PYTHON_DIR

# Install advanced dependencies
echo "📚 Installing advanced dependencies..."
pip install -r ai-image-analyzer-api/requirements-advanced.txt -t $PYTHON_DIR --quiet

echo "📊 Advanced layer contents:"
du -sh $PYTHON_DIR/*

# Clean up unnecessary files
echo "🧹 Cleaning up unnecessary files..."
find $PYTHON_DIR -name "*.pyc" -delete
find $PYTHON_DIR -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "test" -type d -exec rm -rf {} + 2>/dev/null || true

# Create layer ZIP
echo "🗜️ Creating advanced layer ZIP package..."
cd $LAYER_DIR
zip -r ../dependencies-layer-advanced.zip . -q
cd ..

echo "✅ Advanced layer package created: dependencies-layer-advanced.zip"
echo "📊 Advanced layer package size: $(du -h dependencies-layer-advanced.zip | cut -f1)"

# Publish advanced layer to AWS
echo "🚀 Publishing advanced layer to AWS Lambda..."

LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --description "Advanced dependencies for AI Image Analyzer API with color analysis" \
    --zip-file fileb://dependencies-layer-advanced.zip \
    --compatible-runtimes python3.11 \
    --region $REGION \
    --query 'LayerVersionArn' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Advanced layer published successfully!"
    echo "📋 Layer ARN: $LAYER_ARN"
    
    # Save layer ARN
    echo $LAYER_ARN > layer-advanced-arn.txt
    
else
    echo "❌ Advanced layer publication failed!"
    exit 1
fi

# Update Lambda function to use advanced layer
echo "🔧 Updating Lambda function with advanced layer..."

aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --layers $LAYER_ARN \
    --region $REGION \
    --timeout 30 \
    --memory-size 512

if [ $? -eq 0 ]; then
    echo "✅ Function configuration updated with advanced layer!"
else
    echo "❌ Failed to update function configuration!"
    exit 1
fi

# Wait for function to be ready
echo "⏳ Waiting for function to be ready..."
sleep 10

# Deploy advanced function code
echo "🚀 Deploying advanced function code..."

# Create deployment package with advanced code
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Copy advanced lambda function
cp ai-image-analyzer-api/lambda_function_advanced_colors.py $TEMP_DIR/lambda_function.py

# Create ZIP package
cd $TEMP_DIR
zip -r ../advanced-function.zip . -q
cd - > /dev/null

# Move package to current directory
mv $TEMP_DIR/../advanced-function.zip .

# Clean up temporary directory
rm -rf $TEMP_DIR

echo "✅ Advanced function package created: advanced-function.zip"
echo "📊 Package size: $(du -h advanced-function.zip | cut -f1)"

# Deploy to Lambda
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://advanced-function.zip \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Advanced color analysis deployment successful!"
    
    # Get function info
    echo "📋 Updated function information:"
    aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.[FunctionName,Runtime,LastModified,CodeSize,Layers[0].Arn]' \
        --output table
    
    echo ""
    echo "🎨 Advanced Color Analysis Features:"
    echo "  ✅ K-means clustering for accurate color extraction"
    echo "  ✅ Color quantization for comprehensive analysis"
    echo "  ✅ Real color names and hex codes"
    echo "  ✅ Color temperature analysis (warm/cool/neutral)"
    echo "  ✅ HSV color space breakdown"
    echo "  ✅ Brightness classification"
    echo "  ✅ Accurate color percentages from actual image"
    
    echo ""
    echo "🌐 API Endpoint (unchanged):"
    echo "https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
    
    echo ""
    echo "🧪 Test the advanced color analysis:"
    echo "curl https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod/health"
    
else
    echo "❌ Advanced deployment failed!"
    exit 1
fi

# Clean up deployment packages
echo "🧹 Cleaning up deployment packages..."
rm -rf $LAYER_DIR dependencies-layer-advanced.zip advanced-function.zip

echo "🎉 Advanced Color Analysis deployment completed successfully!"
echo ""
echo "🎨 Your AI Image Analyzer now features:"
echo "  • Real color extraction from uploaded images"
echo "  • Accurate dominant color identification"
echo "  • Professional color analysis with K-means clustering"
echo "  • Enhanced color information (temperature, brightness, HSV)"
echo ""
echo "Ready to analyze real colors from your images! 🌈"
