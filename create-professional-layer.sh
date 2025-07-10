#!/bin/bash

echo "📦 Creating Professional Color Analysis Lambda Layer"
echo "=================================================="
echo "🎯 Building layer with NumPy, OpenCV, Scikit-learn, PIL"
echo ""

LAYER_NAME="professional-color-analysis-layer"
REGION="ap-southeast-1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Layer Configuration:${NC}"
echo "  Layer Name: $LAYER_NAME"
echo "  Region: $REGION"
echo "  Dependencies: numpy, opencv-python-headless, scikit-learn, Pillow"
echo ""

# Create layer directory structure
LAYER_DIR="lambda-layer-professional"
mkdir -p $LAYER_DIR/python

echo -e "${YELLOW}📥 Installing dependencies in layer...${NC}"

# Install dependencies in layer directory
pip install numpy opencv-python-headless scikit-learn Pillow -t $LAYER_DIR/python/

# Remove unnecessary files to reduce size
cd $LAYER_DIR/python
echo -e "${YELLOW}🗑️ Cleaning up unnecessary files...${NC}"

# Remove test files and docs
find . -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "test" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "examples" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove specific large files that aren't needed
rm -rf opencv_python.libs/libQt* 2>/dev/null || true
rm -rf opencv_python.libs/libicu* 2>/dev/null || true

cd ../..

# Create layer zip
echo -e "${YELLOW}🗜️ Creating layer package...${NC}"
cd $LAYER_DIR
zip -r ../professional-layer.zip . > /dev/null
cd ..

# Check size
LAYER_SIZE=$(du -h professional-layer.zip | cut -f1)
echo "Layer size: $LAYER_SIZE"

if [[ ${LAYER_SIZE%M*} -gt 250 ]]; then
    echo -e "${YELLOW}⚠️ Layer size is large (${LAYER_SIZE}). This might take time to upload.${NC}"
fi

# Upload layer to AWS
echo -e "${YELLOW}☁️ Uploading layer to AWS...${NC}"

LAYER_VERSION=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --zip-file fileb://professional-layer.zip \
    --compatible-runtimes python3.11 python3.10 python3.9 \
    --region $REGION \
    --query 'Version' --output text)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Layer uploaded successfully!${NC}"
    echo "Layer Version: $LAYER_VERSION"
    
    # Get layer ARN
    LAYER_ARN=$(aws lambda get-layer-version \
        --layer-name $LAYER_NAME \
        --version-number $LAYER_VERSION \
        --region $REGION \
        --query 'LayerVersionArn' --output text)
    
    echo "Layer ARN: $LAYER_ARN"
    
    # Save ARN to file for later use
    echo $LAYER_ARN > professional-layer-arn.txt
    
    echo ""
    echo -e "${GREEN}🎉 Professional Layer Created Successfully!${NC}"
    echo "=========================================="
    echo "Layer Name: $LAYER_NAME"
    echo "Version: $LAYER_VERSION"
    echo "ARN: $LAYER_ARN"
    echo "Size: $LAYER_SIZE"
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "1. Use this layer ARN in Lambda function"
    echo "2. Deploy lightweight function code"
    echo "3. Test professional color analysis"
    
else
    echo -e "${RED}❌ Layer upload failed${NC}"
    exit 1
fi

# Cleanup
rm -rf $LAYER_DIR
rm -f professional-layer.zip

echo ""
echo -e "${GREEN}✅ Layer creation completed!${NC}"
