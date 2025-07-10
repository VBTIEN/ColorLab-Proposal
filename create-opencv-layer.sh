#!/bin/bash

echo "🔧 Creating OpenCV + K-Means Lambda Layer"
echo "========================================"

# Configuration
LAYER_NAME="ai-color-analyzer-opencv"
REGION="ap-southeast-1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Layer Name: $LAYER_NAME"
echo "  Region: $REGION"
echo "  Libraries: OpenCV, scikit-learn, numpy"
echo ""

# Create layer directory
LAYER_DIR="lambda-layer-opencv"
echo -e "${YELLOW}📁 Creating layer directory...${NC}"
rm -rf $LAYER_DIR
mkdir -p $LAYER_DIR/python

# Copy requirements
echo -e "${YELLOW}📝 Setting up requirements...${NC}"
cp ai-image-analyzer-api/requirements-opencv.txt $LAYER_DIR/requirements.txt

# Install packages
echo -e "${YELLOW}📦 Installing OpenCV and ML packages...${NC}"
cd $LAYER_DIR

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages to python directory
echo -e "${BLUE}Installing boto3...${NC}"
pip install boto3>=1.34.0 -t python/

echo -e "${BLUE}Installing numpy...${NC}"
pip install numpy>=1.24.0 -t python/

echo -e "${BLUE}Installing scikit-learn...${NC}"
pip install scikit-learn>=1.3.0 -t python/

echo -e "${BLUE}Installing OpenCV (headless)...${NC}"
pip install opencv-python-headless>=4.8.0 -t python/

# Clean up unnecessary files
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
cd python
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "test" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true
find . -name "*.so.*" -delete 2>/dev/null || true

# Remove large unnecessary files
rm -rf */tests/ 2>/dev/null || true
rm -rf */test/ 2>/dev/null || true
rm -rf */__pycache__/ 2>/dev/null || true

cd ..

# Create ZIP file
echo -e "${YELLOW}🗜️ Creating layer ZIP...${NC}"
zip -r ../opencv-layer.zip python/ > /dev/null

cd ..

# Get layer size
LAYER_SIZE=$(du -h opencv-layer.zip | cut -f1)
echo -e "${GREEN}✅ Layer created: opencv-layer.zip ($LAYER_SIZE)${NC}"

# Check if layer is too large
LAYER_SIZE_BYTES=$(stat -f%z opencv-layer.zip 2>/dev/null || stat -c%s opencv-layer.zip 2>/dev/null)
MAX_SIZE=$((250 * 1024 * 1024))  # 250MB limit

if [ $LAYER_SIZE_BYTES -gt $MAX_SIZE ]; then
    echo -e "${RED}⚠️ Warning: Layer size ($LAYER_SIZE) exceeds AWS Lambda limit (250MB)${NC}"
    echo -e "${YELLOW}Attempting to reduce size...${NC}"
    
    # Try to reduce size by removing more files
    cd $LAYER_DIR/python
    
    # Remove documentation and examples
    find . -name "*.md" -delete 2>/dev/null || true
    find . -name "*.rst" -delete 2>/dev/null || true
    find . -name "*.txt" -delete 2>/dev/null || true
    find . -name "examples" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true
    
    cd ../..
    
    # Recreate ZIP
    cd $LAYER_DIR
    zip -r ../opencv-layer-optimized.zip python/ > /dev/null
    cd ..
    
    mv opencv-layer-optimized.zip opencv-layer.zip
    LAYER_SIZE=$(du -h opencv-layer.zip | cut -f1)
    echo -e "${GREEN}✅ Optimized layer: opencv-layer.zip ($LAYER_SIZE)${NC}"
fi

# Upload layer to AWS
echo -e "${YELLOW}☁️ Uploading layer to AWS...${NC}"
LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --zip-file fileb://opencv-layer.zip \
    --compatible-runtimes python3.9 python3.10 python3.11 \
    --region $REGION \
    --query 'LayerVersionArn' --output text 2>/dev/null)

if [ $? -eq 0 ] && [ ! -z "$LAYER_ARN" ]; then
    echo -e "${GREEN}✅ OpenCV layer uploaded successfully!${NC}"
    echo "Layer ARN: $LAYER_ARN"
    
    # Save ARN to file
    echo $LAYER_ARN > opencv-layer-arn.txt
    
    echo ""
    echo -e "${BLUE}📋 OpenCV Layer Details:${NC}"
    echo "  Name: $LAYER_NAME"
    echo "  ARN: $LAYER_ARN"
    echo "  Size: $LAYER_SIZE"
    echo "  Libraries: OpenCV, scikit-learn, numpy, boto3"
    echo "  Runtimes: python3.9, python3.10, python3.11"
    echo ""
    echo -e "${GREEN}🎉 OpenCV Layer ready for advanced color analysis!${NC}"
else
    echo -e "${RED}❌ Layer upload failed${NC}"
    echo -e "${YELLOW}This might be due to layer size limits or AWS permissions${NC}"
    echo -e "${YELLOW}Consider using a smaller layer or deploying to ECS/EC2${NC}"
    exit 1
fi

# Cleanup
rm -rf $LAYER_DIR
rm opencv-layer.zip

echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Deploy Lambda function with OpenCV layer"
echo "  2. Layer ARN saved to: opencv-layer-arn.txt"
echo "  3. Function will have real OpenCV + K-Means analysis"
