#!/bin/bash

# Create Lambda Layer for Dependencies
# This separates heavy dependencies from your application code

set -e

echo "🚀 Creating Lambda Layer for Dependencies..."

# Configuration
LAYER_NAME="ai-image-analyzer-dependencies"
REGION="ap-southeast-1"
PYTHON_VERSION="python3.11"

# Create layer directory structure
LAYER_DIR="lambda-layer"
PYTHON_DIR="$LAYER_DIR/python"

echo "📁 Creating layer directory structure..."
rm -rf $LAYER_DIR
mkdir -p $PYTHON_DIR

# Install dependencies to layer directory
echo "📚 Installing dependencies to layer..."
pip install -r ai-image-analyzer-api/requirements.txt -t $PYTHON_DIR --quiet

echo "📊 Layer contents:"
du -sh $PYTHON_DIR/*

# Remove unnecessary files to reduce size
echo "🧹 Cleaning up unnecessary files..."
find $PYTHON_DIR -name "*.pyc" -delete
find $PYTHON_DIR -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "test" -type d -exec rm -rf {} + 2>/dev/null || true
find $PYTHON_DIR -name "*.dist-info" -type d -exec rm -rf {} + 2>/dev/null || true

# Create layer ZIP
echo "🗜️ Creating layer ZIP package..."
cd $LAYER_DIR
zip -r ../dependencies-layer.zip . -q
cd ..

echo "✅ Layer package created: dependencies-layer.zip"
echo "📊 Layer package size: $(du -h dependencies-layer.zip | cut -f1)"

# Publish layer to AWS
echo "🚀 Publishing layer to AWS Lambda..."

LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --description "Dependencies for AI Image Analyzer API" \
    --zip-file fileb://dependencies-layer.zip \
    --compatible-runtimes $PYTHON_VERSION \
    --region $REGION \
    --query 'LayerVersionArn' \
    --output text)

if [ $? -eq 0 ]; then
    echo "✅ Layer published successfully!"
    echo "📋 Layer ARN: $LAYER_ARN"
    
    # Save layer ARN for later use
    echo $LAYER_ARN > layer-arn.txt
    
    echo ""
    echo "🎯 Next steps:"
    echo "1. Update Lambda function to use this layer"
    echo "2. Remove dependencies from function package"
    echo "3. Deploy optimized function code"
    
else
    echo "❌ Layer publication failed!"
    exit 1
fi

# Clean up
echo "🧹 Cleaning up temporary files..."
rm -rf $LAYER_DIR dependencies-layer.zip

echo "🎉 Lambda Layer creation completed!"
