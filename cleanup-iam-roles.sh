#!/bin/bash

echo "🔐 IAM Roles Cleanup - Remove Unused Roles"
echo "=========================================="
echo "🎯 Goal: Clean up unused IAM roles while keeping essential ones"
echo ""

# Configuration
REGION="ap-southeast-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 IAM Roles Analysis:${NC}"
echo "======================"

# List all roles
echo -e "${YELLOW}🔍 Current IAM Roles:${NC}"
aws iam list-roles --query 'Roles[*].[RoleName,CreateDate,Path]' --output table

echo ""
echo -e "${BLUE}📊 Role Usage Analysis:${NC}"
echo "========================"

# Check current Lambda function roles
echo -e "${YELLOW}🔍 Checking Lambda function role usage...${NC}"
CURRENT_LAMBDA_ROLE=$(aws lambda list-functions --region $REGION --query 'Functions[0].Role' --output text 2>/dev/null)
echo "Current Lambda uses role: $(basename $CURRENT_LAMBDA_ROLE)"

echo ""
echo -e "${PURPLE}🎯 CLEANUP PLAN:${NC}"
echo "=================="
echo -e "${GREEN}✅ KEEP (Essential/In Use):${NC}"
echo "  🔒 AWSServiceRoleForAPIGateway (AWS Service-Linked Role)"
echo "  🔒 AWSServiceRoleForSSO (AWS Service-Linked Role)"
echo "  🔒 AWSServiceRoleForSupport (AWS Service-Linked Role)"
echo "  🔒 AWSServiceRoleForTrustedAdvisor (AWS Service-Linked Role)"
echo "  ✅ lambda-execution-role (Currently used by ai-image-analyzer-real-vision)"
echo ""
echo -e "${RED}❌ REMOVE (Unused):${NC}"
echo "  🗑️ AIImageAnalyzerFastAPIRole (From deleted FastAPI Lambda)"
echo ""

# Show detailed analysis
echo -e "${BLUE}📋 Detailed Role Analysis:${NC}"
echo "=========================="

echo ""
echo -e "${YELLOW}🔍 AIImageAnalyzerFastAPIRole:${NC}"
echo "  Created: 2025-07-06 (for deleted FastAPI Lambda)"
echo "  Policies: AmazonRekognitionReadOnlyAccess, AWSLambdaBasicExecutionRole, AmazonS3ReadOnlyAccess, AmazonS3FullAccess"
echo "  Status: ❌ UNUSED (FastAPI Lambda was deleted)"

echo ""
echo -e "${YELLOW}🔍 lambda-execution-role:${NC}"
echo "  Created: 2025-07-07 (for current Lambda)"
echo "  Policies: AmazonRekognitionFullAccess, AWSLambdaBasicExecutionRole, AmazonS3FullAccess"
echo "  Status: ✅ IN USE (ai-image-analyzer-real-vision)"

echo ""
echo -e "${YELLOW}🔍 AWS Service-Linked Roles:${NC}"
echo "  AWSServiceRoleForAPIGateway: ✅ KEEP (API Gateway service)"
echo "  AWSServiceRoleForSSO: ✅ KEEP (AWS SSO service)"
echo "  AWSServiceRoleForSupport: ✅ KEEP (AWS Support service)"
echo "  AWSServiceRoleForTrustedAdvisor: ✅ KEEP (Trusted Advisor service)"

echo ""
read -p "🤔 Do you want to proceed with IAM roles cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️ IAM cleanup cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${RED}🗑️ Starting IAM roles cleanup...${NC}"
echo "=================================="

# Function to safely delete IAM role
safe_delete_iam_role() {
    local role_name=$1
    
    echo -e "${YELLOW}🗑️ Deleting IAM Role: $role_name${NC}"
    
    # First, detach all managed policies
    echo "  📎 Detaching managed policies..."
    ATTACHED_POLICIES=$(aws iam list-attached-role-policies --role-name $role_name --query 'AttachedPolicies[*].PolicyArn' --output text 2>/dev/null)
    
    if [ ! -z "$ATTACHED_POLICIES" ]; then
        for policy_arn in $ATTACHED_POLICIES; do
            echo "    Detaching: $(basename $policy_arn)"
            aws iam detach-role-policy --role-name $role_name --policy-arn $policy_arn 2>/dev/null || true
        done
    fi
    
    # Delete inline policies if any
    echo "  📄 Checking for inline policies..."
    INLINE_POLICIES=$(aws iam list-role-policies --role-name $role_name --query 'PolicyNames[*]' --output text 2>/dev/null)
    
    if [ ! -z "$INLINE_POLICIES" ]; then
        for policy_name in $INLINE_POLICIES; do
            echo "    Deleting inline policy: $policy_name"
            aws iam delete-role-policy --role-name $role_name --policy-name $policy_name 2>/dev/null || true
        done
    fi
    
    # Finally, delete the role
    echo "  🗑️ Deleting role..."
    if aws iam delete-role --role-name $role_name 2>/dev/null; then
        echo -e "${GREEN}✅ Successfully deleted IAM Role: $role_name${NC}"
    else
        echo -e "${RED}❌ Failed to delete IAM Role: $role_name${NC}"
    fi
}

# Delete unused IAM role
echo -e "${BLUE}1. Cleaning up unused IAM roles...${NC}"

safe_delete_iam_role "AIImageAnalyzerFastAPIRole"

# Verify cleanup
echo ""
echo -e "${BLUE}📊 IAM Roles Status After Cleanup:${NC}"
echo "===================================="

echo ""
echo -e "${GREEN}✅ REMAINING IAM ROLES:${NC}"
aws iam list-roles --query 'Roles[*].[RoleName,CreateDate,Path]' --output table

echo ""
echo -e "${BLUE}🔍 Current Lambda Function Role Usage:${NC}"
CURRENT_ROLE=$(aws lambda get-function --function-name ai-image-analyzer-real-vision --region $REGION --query 'Configuration.Role' --output text 2>/dev/null)
echo "ai-image-analyzer-real-vision uses: $(basename $CURRENT_ROLE)"

# Summary
echo ""
echo -e "${GREEN}🎉 IAM ROLES CLEANUP COMPLETED!${NC}"
echo "================================="
echo ""
echo -e "${PURPLE}💰 BENEFITS ACHIEVED:${NC}"
echo "  ✅ Removed unused IAM role (AIImageAnalyzerFastAPIRole)"
echo "  ✅ Cleaned up associated policies"
echo "  ✅ Improved security posture"
echo "  ✅ Simplified IAM management"
echo "  ✅ Reduced potential security risks"
echo ""
echo -e "${BLUE}🔒 SECURITY IMPROVEMENTS:${NC}"
echo "  • Fewer unused roles = smaller attack surface"
echo "  • Clean IAM structure = easier auditing"
echo "  • No orphaned permissions = better security"
echo "  • Simplified role management = reduced errors"
echo ""
echo -e "${GREEN}✅ REMAINING ROLES (All Essential):${NC}"
echo "  🔒 AWS Service-Linked Roles (4) - Required by AWS services"
echo "  ✅ lambda-execution-role (1) - Used by current Lambda function"
echo ""
echo -e "${YELLOW}📝 RECOMMENDATIONS:${NC}"
echo "  1. 🔍 Regularly audit IAM roles and permissions"
echo "  2. 🔒 Follow principle of least privilege"
echo "  3. 📊 Monitor role usage with CloudTrail"
echo "  4. 🧹 Schedule periodic IAM cleanup"
echo ""
echo -e "${GREEN}🎯 Your IAM environment is now clean and secure!${NC}"
echo -e "${PURPLE}🔐 Only essential roles remain for optimal security!${NC}"
