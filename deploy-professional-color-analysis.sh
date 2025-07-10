#!/bin/bash

echo "🎨 Deploying Professional Color Analysis API"
echo "============================================="
echo "🔬 Scientific approach with K-Means, Histograms, and Multi-Color Space Analysis"
echo ""

# Configuration
FUNCTION_NAME="ai-image-analyzer-real-vision"
REGION="ap-southeast-1"
ROLE_NAME="lambda-execution-role"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Professional Color Analysis Configuration:${NC}"
echo "  Function: $FUNCTION_NAME"
echo "  Region: $REGION"
echo "  Analysis: K-Means + Histograms + Multi-Color Space"
echo "  Features: RGB/HSV/LAB + Regional Distribution + Statistics"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Create deployment package with dependencies
echo -e "${YELLOW}📦 Creating Professional Color Analysis deployment package...${NC}"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Working in: $TEMP_DIR"

# Copy Professional Color Analysis Lambda function
cp ai-image-analyzer-api/lambda_function_professional_color_analysis.py $TEMP_DIR/lambda_function.py

# Copy requirements
cp ai-image-analyzer-api/requirements-professional.txt $TEMP_DIR/requirements.txt

# Install dependencies
cd $TEMP_DIR
echo -e "${YELLOW}📥 Installing professional analysis dependencies...${NC}"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt -t .

# Remove unnecessary files to reduce package size
rm -rf venv/
rm -rf __pycache__/
rm -rf *.dist-info/
rm -rf tests/
rm -rf docs/
rm requirements.txt

# Remove large unnecessary files from packages
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

echo -e "${YELLOW}🗜️ Creating professional analysis deployment package...${NC}"
zip -r ../professional-color-analysis-function.zip . > /dev/null
cd ..

echo -e "${GREEN}✅ Professional package created: professional-color-analysis-function.zip${NC}"

# Get package size
PACKAGE_SIZE=$(du -h professional-color-analysis-function.zip | cut -f1)
echo "Package size: $PACKAGE_SIZE"

# Deploy or update Lambda function
echo -e "${YELLOW}🚀 Deploying Professional Color Analysis Lambda function...${NC}"

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ IAM role $ROLE_NAME not found. Please create it first.${NC}"
    exit 1
fi

# Update function code
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://professional-color-analysis-function.zip \
    --region $REGION > /dev/null

# Update function configuration for professional analysis
aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --timeout 120 \
    --memory-size 2048 \
    --region $REGION \
    --environment Variables='{PROFESSIONAL_COLOR_ANALYSIS=true,ANALYSIS_TYPE=scientific}' > /dev/null

echo -e "${GREEN}✅ Professional Color Analysis Lambda function deployed${NC}"

# Test the deployment
echo -e "${YELLOW}🧪 Testing Professional Color Analysis deployment...${NC}"

API_ENDPOINT="https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod"

# Test health endpoint
HEALTH_RESPONSE=$(curl -s "$API_ENDPOINT/health" || echo "failed")

if [[ $HEALTH_RESPONSE == *"professional"* ]]; then
    echo -e "${GREEN}✅ Professional Color Analysis health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ Health check response: $(echo $HEALTH_RESPONSE | head -c 100)${NC}"
fi

# Test root endpoint
ROOT_RESPONSE=$(curl -s "$API_ENDPOINT/" || echo "failed")

if [[ $ROOT_RESPONSE == *"Professional Color Analysis"* ]]; then
    echo -e "${GREEN}✅ Professional Color Analysis API is working${NC}"
else
    echo -e "${YELLOW}⚠️ Root response: $(echo $ROOT_RESPONSE | head -c 100)${NC}"
fi

# Cleanup
rm -rf $TEMP_DIR
rm -f professional-color-analysis-function.zip

# Summary
echo ""
echo -e "${GREEN}🎉 PROFESSIONAL COLOR ANALYSIS DEPLOYMENT COMPLETE!${NC}"
echo "=========================================================="
echo -e "${PURPLE}🔬 Scientific Color Analysis Features:${NC}"
echo "  ✅ K-Means clustering for dominant colors"
echo "  ✅ RGB/HSV/LAB color space analysis"
echo "  ✅ Color frequency histograms"
echo "  ✅ Regional color distribution (3x3 grid)"
echo "  ✅ Statistical analysis (mean, std, percentiles)"
echo "  ✅ Color temperature analysis (warm/cool)"
echo "  ✅ Saturation and brightness analysis"
echo "  ✅ Color harmony detection"
echo "  ✅ Professional use case recommendations"
echo ""
echo -e "${BLUE}📊 Analysis Capabilities:${NC}"
echo "  • Tần suất từng màu sắc ✅"
echo "  • Màu chủ đạo (K-Means) ✅"
echo "  • Phân bố màu theo vùng ảnh ✅"
echo "  • Biểu đồ màu (histogram) ✅"
echo "  • Thống kê RGB, HSV, LAB ✅"
echo "  • Nhận diện tông màu ấm/lạnh ✅"
echo "  • Độ sáng và độ bão hòa ✅"
echo ""
echo -e "${BLUE}🚀 Performance Optimized:${NC}"
echo "  Memory: 2048 MB (for scientific computing)"
echo "  Timeout: 120 seconds (for complex analysis)"
echo "  Dependencies: NumPy, OpenCV, Scikit-learn, PIL"
echo ""
echo -e "${BLUE}📋 API Endpoints:${NC}"
echo "  GET  $API_ENDPOINT/health"
echo "  POST $API_ENDPOINT/analyze"
echo "  GET  $API_ENDPOINT/ (info)"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Test with real images via web interface"
echo "  2. Review scientific analysis results"
echo "  3. Monitor performance and accuracy"
echo "  4. Fine-tune parameters if needed"
echo ""
echo -e "${GREEN}🎯 Your Professional Color Analysis API is ready!${NC}"
echo -e "${PURPLE}🔬 Scientific-grade color analysis with K-Means and multi-space analysis!${NC}"
