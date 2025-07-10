#!/bin/bash

# Deploy Real Color Analysis Version
# This deploys the enhanced Lambda function with real color extraction

set -e

echo "🎨 Deploying Real Color Analysis Version..."

# Configuration
FUNCTION_NAME="ai-image-analyzer-fastapi"
REGION="ap-southeast-1"
LAYER_NAME="ai-image-analyzer-dependencies-real"

# Create new layer with Pillow for image processing
echo "📦 Creating real color dependencies layer..."

LAYER_DIR="lambda-layer-real"
PYTHON_DIR="$LAYER_DIR/python"

# Clean up previous layer
rm -rf $LAYER_DIR

# Create layer directory structure
mkdir -p $PYTHON_DIR

# Install dependencies
echo "📚 Installing real color dependencies..."
pip install -r ai-image-analyzer-api/requirements-simple.txt -t $PYTHON_DIR --quiet

echo "📊 Real color layer contents:"
du -sh $PYTHON_DIR/*

# Clean up unnecessary files
echo "🧹 Cleaning up unnecessary files..."
find $PYTHON_DIR -name "*.pyc" -delete
find $PYTHON_DIR -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "test" -type d -exec rm -rf {} + 2>/dev/null || true

# Create layer ZIP
echo "🗜️ Creating real color layer ZIP package..."
cd $LAYER_DIR
zip -r ../dependencies-layer-real.zip . -q
cd ..

echo "✅ Real color layer package created: dependencies-layer-real.zip"
echo "📊 Real color layer package size: $(du -h dependencies-layer-real.zip | cut -f1)"

# Publish layer to AWS
echo "🚀 Publishing real color layer to AWS Lambda..."

LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --description "Real color dependencies for AI Image Analyzer API with Pillow" \
    --zip-file fileb://dependencies-layer-real.zip \
    --compatible-runtimes python3.11 \
    --region $REGION \
    --query 'LayerVersionArn' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Real color layer published successfully!"
    echo "📋 Layer ARN: $LAYER_ARN"
    
    # Save layer ARN
    echo $LAYER_ARN > layer-real-arn.txt
    
else
    echo "❌ Real color layer publication failed!"
    exit 1
fi

# Update Lambda function to use real color layer
echo "🔧 Updating Lambda function with real color layer..."

aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --layers $LAYER_ARN \
    --region $REGION \
    --timeout 30 \
    --memory-size 512

if [ $? -eq 0 ]; then
    echo "✅ Function configuration updated with real color layer!"
else
    echo "❌ Failed to update function configuration!"
    exit 1
fi

# Wait for function to be ready
echo "⏳ Waiting for function to be ready..."
sleep 10

# Deploy real color function code
echo "🚀 Deploying real color function code..."

# Create deployment package with real color code
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Copy real color lambda function
cp ai-image-analyzer-api/lambda_function_simple_advanced.py $TEMP_DIR/lambda_function.py

# Create ZIP package
cd $TEMP_DIR
zip -r ../real-color-function.zip . -q
cd - > /dev/null

# Move package to current directory
mv $TEMP_DIR/../real-color-function.zip .

# Clean up temporary directory
rm -rf $TEMP_DIR

echo "✅ Real color function package created: real-color-function.zip"
echo "📊 Package size: $(du -h real-color-function.zip | cut -f1)"

# Deploy to Lambda
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://real-color-function.zip \
    --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Real color analysis deployment successful!"
    
    # Get function info
    echo "📋 Updated function information:"
    aws lambda get-function \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query 'Configuration.[FunctionName,Runtime,LastModified,CodeSize,Layers[0].Arn]' \
        --output table
    
    echo ""
    echo "🎨 Real Color Analysis Features:"
    echo "  ✅ Real color extraction from uploaded images"
    echo "  ✅ Color quantization for accurate analysis"
    echo "  ✅ Pixel sampling for comprehensive coverage"
    echo "  ✅ Descriptive color names"
    echo "  ✅ Color temperature analysis (warm/cool/neutral)"
    echo "  ✅ HSV color space breakdown"
    echo "  ✅ Brightness classification"
    echo "  ✅ True color percentages from actual pixels"
    
    echo ""
    echo "🌐 API Endpoint (unchanged):"
    echo "https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod"
    
    echo ""
    echo "🧪 Test the real color analysis:"
    echo "curl https://ej0h55nm0k.execute-api.ap-southeast-1.amazonaws.com/prod/health"
    
else
    echo "❌ Real color deployment failed!"
    exit 1
fi

# Clean up deployment packages
echo "🧹 Cleaning up deployment packages..."
rm -rf $LAYER_DIR dependencies-layer-real.zip real-color-function.zip

echo "🎉 Real Color Analysis deployment completed successfully!"
echo ""
echo "🎨 Your AI Image Analyzer now features:"
echo "  • Real color extraction directly from your images"
echo "  • Accurate dominant color identification"
echo "  • True color percentages based on actual pixels"
echo "  • Enhanced color information (temperature, brightness, HSV)"
echo "  • Descriptive color names"
echo ""
echo "Ready to analyze the real colors in your images! 🌈"
