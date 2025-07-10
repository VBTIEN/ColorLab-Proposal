#!/bin/bash

echo "🔧 Creating Complete AI Lambda Layer with PIL and NumPy"
echo "====================================================="

# Configuration
LAYER_NAME="ai-image-analyzer-complete"
REGION="ap-southeast-1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Layer Name: $LAYER_NAME"
echo "  Region: $REGION"
echo ""

# Create layer directory
LAYER_DIR="lambda-layer-complete"
echo -e "${YELLOW}📁 Creating layer directory...${NC}"
rm -rf $LAYER_DIR
mkdir -p $LAYER_DIR/python

# Create requirements file
echo -e "${YELLOW}📝 Creating requirements...${NC}"
cat > $LAYER_DIR/requirements.txt << EOF
boto3>=1.34.0
botocore>=1.34.0
Pillow>=10.0.0
numpy>=1.24.0
EOF

# Install packages
echo -e "${YELLOW}📦 Installing packages...${NC}"
cd $LAYER_DIR

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages to python directory
pip install -r requirements.txt -t python/

# Clean up unnecessary files
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
cd python
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true

cd ..

# Create ZIP file
echo -e "${YELLOW}🗜️ Creating layer ZIP...${NC}"
zip -r ../complete-layer.zip python/ > /dev/null

cd ..

# Get layer size
LAYER_SIZE=$(du -h complete-layer.zip | cut -f1)
echo -e "${GREEN}✅ Layer created: complete-layer.zip ($LAYER_SIZE)${NC}"

# Upload layer to AWS
echo -e "${YELLOW}☁️ Uploading layer to AWS...${NC}"
LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name $LAYER_NAME \
    --zip-file fileb://complete-layer.zip \
    --compatible-runtimes python3.9 python3.10 python3.11 \
    --region $REGION \
    --query 'LayerVersionArn' --output text)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Layer uploaded successfully!${NC}"
    echo "Layer ARN: $LAYER_ARN"
    
    # Save ARN to file
    echo $LAYER_ARN > complete-layer-arn.txt
    
    echo ""
    echo -e "${BLUE}📋 Layer Details:${NC}"
    echo "  Name: $LAYER_NAME"
    echo "  ARN: $LAYER_ARN"
    echo "  Size: $LAYER_SIZE"
    echo "  Runtimes: python3.9, python3.10, python3.11"
    echo ""
    echo -e "${GREEN}🎉 Complete AI Layer ready for deployment!${NC}"
else
    echo -e "${RED}❌ Layer upload failed${NC}"
    exit 1
fi

# Cleanup
rm -rf $LAYER_DIR
rm complete-layer.zip

echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Deploy Lambda function with this layer"
echo "  2. Layer ARN saved to: complete-layer-arn.txt"
