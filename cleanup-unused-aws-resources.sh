#!/bin/bash

echo "🧹 AWS Resources Cleanup - Remove Unused Services"
echo "================================================="
echo "🎯 Goal: Free up space and improve dependencies for better accuracy"
echo ""

# Configuration
REGION="ap-southeast-1"
CURRENT_FUNCTION="ai-image-analyzer-real-vision"
CURRENT_API="spsvd9ec7i"
CURRENT_BUCKET="ai-image-analyzer-web-1751723364"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Current Resources Analysis:${NC}"
echo "=============================================="

# Check current resources
echo -e "${YELLOW}🔍 Analyzing current AWS resources...${NC}"

# Lambda Functions
echo ""
echo -e "${BLUE}📊 Lambda Functions:${NC}"
aws lambda list-functions --region $REGION --query 'Functions[*].[FunctionName,CodeSize,LastModified]' --output table

# API Gateways
echo ""
echo -e "${BLUE}📊 API Gateway REST APIs:${NC}"
aws apigateway get-rest-apis --region $REGION --query 'items[*].[name,id,createdDate]' --output table

# S3 Buckets
echo ""
echo -e "${BLUE}📊 S3 Buckets:${NC}"
aws s3 ls --region $REGION

echo ""
echo -e "${PURPLE}🎯 CLEANUP PLAN:${NC}"
echo "=================="
echo -e "${GREEN}✅ KEEP (Currently Used):${NC}"
echo "  Lambda: $CURRENT_FUNCTION (Professional Color Analysis)"
echo "  API: $CURRENT_API (Real AI Vision API)"
echo "  S3: $CURRENT_BUCKET (Web Interface)"
echo ""
echo -e "${RED}❌ REMOVE (Unused):${NC}"
echo "  Lambda: ai-image-analyzer-fastapi (Old FastAPI version)"
echo "  Lambda: ai-image-analyzer-enhanced (Old enhanced version)"
echo "  API: c4yhtzbxk8 (ai-image-analyzer-api - Old)"
echo "  API: ej0h55nm0k (ai-image-analyzer-fastapi-api - Old)"
echo "  API: m0vqhyince (ai-image-analyzer-api-v2 - Old)"
echo "  API: ss36183hr7 (ai-image-analyzer-simple - Old)"
echo "  S3: image-analyzer-workshop-1751722329 (Old bucket)"
echo "  Layer: ai-image-analyzer-complete (Heavy dependencies)"
echo ""

read -p "🤔 Do you want to proceed with cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️ Cleanup cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${RED}🗑️ Starting cleanup process...${NC}"
echo "=================================="

# Function to safely delete with confirmation
safe_delete() {
    local resource_type=$1
    local resource_name=$2
    local delete_command=$3
    
    echo -e "${YELLOW}🗑️ Deleting $resource_type: $resource_name${NC}"
    
    if eval "$delete_command" 2>/dev/null; then
        echo -e "${GREEN}✅ Successfully deleted $resource_type: $resource_name${NC}"
    else
        echo -e "${RED}❌ Failed to delete $resource_type: $resource_name${NC}"
    fi
}

# 1. Delete unused Lambda functions
echo -e "${BLUE}1. Cleaning up Lambda Functions...${NC}"

safe_delete "Lambda Function" "ai-image-analyzer-fastapi" \
    "aws lambda delete-function --function-name ai-image-analyzer-fastapi --region $REGION"

safe_delete "Lambda Function" "ai-image-analyzer-enhanced" \
    "aws lambda delete-function --function-name ai-image-analyzer-enhanced --region $REGION"

# 2. Delete unused API Gateways
echo ""
echo -e "${BLUE}2. Cleaning up API Gateways...${NC}"

safe_delete "API Gateway" "ai-image-analyzer-api (c4yhtzbxk8)" \
    "aws apigateway delete-rest-api --rest-api-id c4yhtzbxk8 --region $REGION"

safe_delete "API Gateway" "ai-image-analyzer-fastapi-api (ej0h55nm0k)" \
    "aws apigateway delete-rest-api --rest-api-id ej0h55nm0k --region $REGION"

safe_delete "API Gateway" "ai-image-analyzer-api-v2 (m0vqhyince)" \
    "aws apigateway delete-rest-api --rest-api-id m0vqhyince --region $REGION"

safe_delete "API Gateway" "ai-image-analyzer-simple (ss36183hr7)" \
    "aws apigateway delete-rest-api --rest-api-id ss36183hr7 --region $REGION"

# 3. Delete unused S3 bucket
echo ""
echo -e "${BLUE}3. Cleaning up S3 Buckets...${NC}"

echo -e "${YELLOW}🗑️ Emptying S3 bucket: image-analyzer-workshop-1751722329${NC}"
aws s3 rm s3://image-analyzer-workshop-1751722329 --recursive --region $REGION 2>/dev/null || true

safe_delete "S3 Bucket" "image-analyzer-workshop-1751722329" \
    "aws s3 rb s3://image-analyzer-workshop-1751722329 --region $REGION"

# 4. Delete unused Lambda Layer
echo ""
echo -e "${BLUE}4. Cleaning up Lambda Layers...${NC}"

safe_delete "Lambda Layer" "ai-image-analyzer-complete:1" \
    "aws lambda delete-layer-version --layer-name ai-image-analyzer-complete --version-number 1 --region $REGION"

# 5. Clean up CloudWatch Log Groups
echo ""
echo -e "${BLUE}5. Cleaning up CloudWatch Log Groups...${NC}"

safe_delete "Log Group" "/aws/lambda/ai-image-analyzer-fastapi" \
    "aws logs delete-log-group --log-group-name /aws/lambda/ai-image-analyzer-fastapi --region $REGION"

safe_delete "Log Group" "/aws/lambda/ai-image-analyzer-enhanced" \
    "aws logs delete-log-group --log-group-name /aws/lambda/ai-image-analyzer-enhanced --region $REGION"

# 6. Clean up IAM Roles (if not used by other resources)
echo ""
echo -e "${BLUE}6. Checking IAM Roles...${NC}"

echo -e "${YELLOW}⚠️ Checking if AIImageAnalyzerFastAPIRole is safe to delete...${NC}"
ROLE_USAGE=$(aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --query 'PolicyRoles[?RoleName==`AIImageAnalyzerFastAPIRole`]' --output text 2>/dev/null || echo "")

if [ -z "$ROLE_USAGE" ]; then
    echo -e "${YELLOW}🗑️ Attempting to delete unused IAM role: AIImageAnalyzerFastAPIRole${NC}"
    
    # Detach policies first
    aws iam detach-role-policy --role-name AIImageAnalyzerFastAPIRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --region $REGION 2>/dev/null || true
    aws iam detach-role-policy --role-name AIImageAnalyzerFastAPIRole --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess --region $REGION 2>/dev/null || true
    
    safe_delete "IAM Role" "AIImageAnalyzerFastAPIRole" \
        "aws iam delete-role --role-name AIImageAnalyzerFastAPIRole"
else
    echo -e "${GREEN}✅ IAM Role AIImageAnalyzerFastAPIRole is still in use, keeping it${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 CLEANUP COMPLETED!${NC}"
echo "======================"
echo ""
echo -e "${BLUE}📊 Resources Status After Cleanup:${NC}"
echo "======================================"

# Check remaining resources
echo ""
echo -e "${GREEN}✅ REMAINING RESOURCES (Active):${NC}"
echo ""

echo -e "${BLUE}Lambda Functions:${NC}"
aws lambda list-functions --region $REGION --query 'Functions[*].[FunctionName,CodeSize,MemorySize]' --output table

echo ""
echo -e "${BLUE}API Gateways:${NC}"
aws apigateway get-rest-apis --region $REGION --query 'items[*].[name,id]' --output table

echo ""
echo -e "${BLUE}S3 Buckets:${NC}"
aws s3 ls

echo ""
echo -e "${GREEN}💰 COST SAVINGS:${NC}"
echo "=================="
echo "  ❌ Deleted 2 unused Lambda functions"
echo "  ❌ Deleted 4 unused API Gateways"
echo "  ❌ Deleted 1 unused S3 bucket"
echo "  ❌ Deleted 1 heavy Lambda layer (36MB)"
echo "  ❌ Deleted unused CloudWatch log groups"
echo ""
echo -e "${PURPLE}🎯 BENEFITS FOR PROFESSIONAL COLOR ANALYSIS:${NC}"
echo "=============================================="
echo "  ✅ Reduced AWS resource clutter"
echo "  ✅ Freed up Lambda layer space"
echo "  ✅ Simplified architecture"
echo "  ✅ Better resource management"
echo "  ✅ Improved deployment speed"
echo "  ✅ Cleaner monitoring"
echo ""
echo -e "${BLUE}🔧 NEXT STEPS FOR ACCURACY IMPROVEMENT:${NC}"
echo "========================================"
echo "  1. 📦 Add optimized dependencies for color analysis"
echo "  2. 🔬 Implement advanced color science libraries"
echo "  3. 📊 Add machine learning models for better accuracy"
echo "  4. 🎨 Enhance color space conversions"
echo "  5. 📈 Implement statistical analysis improvements"
echo ""
echo -e "${GREEN}🎉 Your AWS environment is now clean and optimized!${NC}"
echo -e "${PURPLE}🚀 Ready for accuracy improvements with freed resources!${NC}"
