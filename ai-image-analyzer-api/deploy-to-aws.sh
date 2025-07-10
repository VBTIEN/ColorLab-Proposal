#!/bin/bash

# Master deployment script for AI Image Analyzer FastAPI
clear
echo "🚀 AI Image Analyzer FastAPI - AWS Deployment"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "app/main_test.py" ]; then
    echo -e "${RED}❌ Please run this script from the ai-image-analyzer-api directory${NC}"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: app/main_test.py"
    exit 1
fi

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "   Installation guide: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    echo ""
    echo -e "${BLUE}📋 AWS Setup Steps:${NC}"
    echo "1. Create AWS account if you don't have one"
    echo "2. Create IAM user with programmatic access"
    echo "3. Attach necessary policies (Lambda, ECS, ECR, IAM, etc.)"
    echo "4. Run: aws configure"
    echo "5. Enter your Access Key ID and Secret Access Key"
    echo ""
    echo -e "${CYAN}💡 Tip: Check ../setup-aws-credentials.md for detailed instructions${NC}"
    exit 1
fi

# Get AWS account info
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region || echo "us-east-1")

echo -e "${GREEN}✅ AWS credentials configured${NC}"
echo -e "${BLUE}📋 AWS Account Information:${NC}"
echo "   Account ID: $ACCOUNT_ID"
echo "   Region: $REGION"
echo ""

echo -e "${BLUE}📋 Deployment Options:${NC}"
echo ""
echo -e "${CYAN}1. 🚀 AWS Lambda + API Gateway (Serverless)${NC}"
echo "   ✅ Pros: Cost-effective, auto-scaling, no server management"
echo "   ❌ Cons: Cold starts, 15-minute timeout limit"
echo "   💰 Cost: ~\$0-5/month for low traffic"
echo "   🎯 Best for: APIs with sporadic traffic, development/testing"
echo ""
echo -e "${CYAN}2. 🐳 AWS ECS Fargate (Container)${NC}"
echo "   ✅ Pros: Always warm, full control, no cold starts"
echo "   ❌ Cons: Higher cost, more complex setup"
echo "   💰 Cost: ~\$15-20/month for 1 instance running 24/7"
echo "   🎯 Best for: Production APIs with consistent traffic"
echo ""
echo -e "${CYAN}3. 📖 View Documentation${NC}"
echo "   📚 Read detailed deployment guide"
echo ""
echo -e "${CYAN}4. 🧪 Test Local API${NC}"
echo "   🔍 Test your API locally before deployment"
echo ""
echo -e "${CYAN}5. ❌ Exit${NC}"
echo ""

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}🚀 Deploying to AWS Lambda + API Gateway...${NC}"
        echo ""
        echo -e "${YELLOW}📋 What will be created:${NC}"
        echo "   • Lambda function: ai-image-analyzer-fastapi"
        echo "   • IAM role: AIImageAnalyzerFastAPIRole"
        echo "   • API Gateway: ai-image-analyzer-fastapi-api"
        echo "   • CloudWatch logs: /aws/lambda/ai-image-analyzer-fastapi"
        echo ""
        read -p "Continue with Lambda deployment? (y/n): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo ""
            echo -e "${BLUE}🔄 Starting Lambda deployment...${NC}"
            ./deploy-to-lambda.sh
        else
            echo -e "${YELLOW}⏸️  Lambda deployment cancelled${NC}"
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}🐳 Deploying to AWS ECS Fargate...${NC}"
        echo ""
        echo -e "${YELLOW}📋 What will be created:${NC}"
        echo "   • ECR repository: ai-image-analyzer-fastapi"
        echo "   • ECS cluster: ai-image-analyzer-fastapi-cluster"
        echo "   • ECS service: ai-image-analyzer-fastapi-service"
        echo "   • Security group: ai-image-analyzer-fastapi-sg"
        echo "   • CloudWatch logs: /ecs/ai-image-analyzer-fastapi"
        echo ""
        echo -e "${YELLOW}⚠️  Prerequisites:${NC}"
        echo "   • Docker must be running"
        echo "   • Default VPC must exist"
        echo ""
        
        # Check Docker
        if ! docker info > /dev/null 2>&1; then
            echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
            exit 1
        fi
        
        read -p "Continue with ECS deployment? (y/n): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo ""
            echo -e "${BLUE}🔄 Starting ECS deployment...${NC}"
            ./deploy-to-ecs.sh
        else
            echo -e "${YELLOW}⏸️  ECS deployment cancelled${NC}"
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}📖 Opening deployment documentation...${NC}"
        if [ -f "AWS_DEPLOYMENT_GUIDE.md" ]; then
            less AWS_DEPLOYMENT_GUIDE.md
        else
            echo -e "${YELLOW}⚠️  Documentation file not found${NC}"
            echo "   Expected: AWS_DEPLOYMENT_GUIDE.md"
        fi
        ;;
    4)
        echo ""
        echo -e "${BLUE}🧪 Testing local API...${NC}"
        echo ""
        echo -e "${YELLOW}📋 Starting local development server...${NC}"
        echo "   Press Ctrl+C to stop the server"
        echo ""
        
        # Check if virtual environment exists
        if [ ! -d "venv" ]; then
            echo -e "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
            python3 -m venv venv
            source venv/bin/activate
            pip install fastapi uvicorn pydantic pydantic-settings python-dotenv
        else
            source venv/bin/activate
        fi
        
        echo -e "${GREEN}🚀 Starting server at http://localhost:8000${NC}"
        echo -e "${CYAN}📖 API Documentation: http://localhost:8000/api/v1/docs${NC}"
        echo ""
        
        # Start the server
        python run_dev.py
        ;;
    5)
        echo ""
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option. Please choose 1-5.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "   • Test your deployed API endpoints"
echo "   • Monitor CloudWatch logs for any issues"
echo "   • Set up custom domain (optional)"
echo "   • Configure monitoring and alerts"
echo "   • Implement CI/CD pipeline"
echo ""
echo -e "${BLUE}📞 Need Help?${NC}"
echo "   • Check AWS_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "   • Review CloudWatch logs for troubleshooting"
echo "   • Visit AWS Console to manage your resources"
echo ""
echo -e "${CYAN}💡 Pro Tips:${NC}"
echo "   • Use Lambda for development and low-traffic APIs"
echo "   • Use ECS for production and high-traffic APIs"
echo "   • Monitor costs with AWS Cost Explorer"
echo "   • Set up billing alerts to avoid surprises"
echo ""
echo -e "${GREEN}🎯 Happy deploying!${NC}"
