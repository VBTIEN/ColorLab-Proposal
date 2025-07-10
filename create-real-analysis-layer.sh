#!/bin/bash

echo "🔧 Creating Real Image Analysis Lambda Layer with PIL and numpy"
echo "=============================================================="

LAYER_DIR="/mnt/d/project/ai-image-analyzer-workshop/real-analysis-layer"
PYTHON_DIR="$LAYER_DIR/python"

# Clean up previous builds
rm -rf $LAYER_DIR
mkdir -p $PYTHON_DIR

echo ""
echo "📦 Installing PIL (Pillow) and numpy..."
echo "--------------------------------------"

# Install packages to layer directory
pip install --target $PYTHON_DIR Pillow numpy

echo ""
echo "📋 Checking installed packages..."
echo "---------------------------------"
ls -la $PYTHON_DIR/

echo ""
echo "🗜️  Creating layer ZIP file..."
echo "------------------------------"
cd $LAYER_DIR
zip -r real-analysis-layer.zip python/

echo ""
echo "📊 Layer ZIP file info:"
echo "----------------------"
ls -lh real-analysis-layer.zip

echo ""
echo "☁️  Uploading layer to AWS Lambda..."
echo "-----------------------------------"
aws lambda publish-layer-version \
  --layer-name real-image-analysis-layer \
  --description "PIL and numpy for real image processing" \
  --zip-file fileb://real-analysis-layer.zip \
  --compatible-runtimes python3.11 \
  --region ap-southeast-1

echo ""
echo "✅ Real Analysis Layer created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Note the LayerVersionArn from above output"
echo "2. Update Lambda function to use this layer"
echo "3. Deploy the new real analysis function"
