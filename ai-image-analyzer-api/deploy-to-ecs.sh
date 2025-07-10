#!/bin/bash
set -e

echo "🚀 AI Image Analyzer FastAPI - AWS ECS Fargate Deployment"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
APP_NAME="ai-image-analyzer-fastapi"
CLUSTER_NAME="${APP_NAME}-cluster"
SERVICE_NAME="${APP_NAME}-service"
TASK_FAMILY="${APP_NAME}-task"
REGION="us-east-1"
CPU="256"
MEMORY="512"
PORT="8000"

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")

if [ -z "$ACCOUNT_ID" ]; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

ECR_REPOSITORY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${APP_NAME}"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "   App Name: $APP_NAME"
echo "   Cluster: $CLUSTER_NAME"
echo "   Service: $SERVICE_NAME"
echo "   Task Family: $TASK_FAMILY"
echo "   Region: $REGION"
echo "   Account ID: $ACCOUNT_ID"
echo "   ECR Repository: $ECR_REPOSITORY"
echo "   CPU: $CPU"
echo "   Memory: $MEMORY"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Create Dockerfile if it doesn't exist
if [ ! -f "Dockerfile" ]; then
    echo -e "${BLUE}📝 Creating Dockerfile...${NC}"
    cat > Dockerfile << 'EOF'
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir fastapi uvicorn pydantic pydantic-settings python-dotenv

# Copy application code
COPY app/ ./app/
COPY .env* ./

# Create production server runner
RUN cat > run_server.py << 'RUNNER'
#!/usr/bin/env python3
import os
import sys
import uvicorn

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"🚀 Starting AI Image Analyzer API Production Server...")
    print(f"📡 Host: {host}:{port}")
    
    uvicorn.run(
        "app.main_test:app",
        host=host,
        port=port,
        workers=1,
        log_level="info",
        access_log=True
    )
RUNNER

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["python", "run_server.py"]
EOF
    echo -e "${GREEN}✅ Dockerfile created${NC}"
fi

# Create ECR repository if it doesn't exist
echo -e "${BLUE}📦 Setting up ECR repository...${NC}"
if ! aws ecr describe-repositories --repository-names $APP_NAME --region $REGION > /dev/null 2>&1; then
    echo "   Creating ECR repository..."
    aws ecr create-repository \
        --repository-name $APP_NAME \
        --region $REGION \
        --image-scanning-configuration scanOnPush=true
    echo -e "${GREEN}   ✅ ECR repository created${NC}"
else
    echo "   ECR repository already exists"
fi

# Build Docker image
echo -e "${BLUE}🐳 Building Docker image...${NC}"
docker build -t $APP_NAME:latest .

# Tag image for ECR
docker tag $APP_NAME:latest $ECR_REPOSITORY:latest

# Login to ECR
echo -e "${BLUE}🔐 Logging in to ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY

# Push image to ECR
echo -e "${BLUE}📤 Pushing image to ECR...${NC}"
docker push $ECR_REPOSITORY:latest

echo -e "${GREEN}✅ Docker image pushed successfully!${NC}"

# Create ECS cluster if it doesn't exist
echo -e "${BLUE}🏗️  Setting up ECS cluster...${NC}"
if ! aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION > /dev/null 2>&1; then
    echo "   Creating ECS cluster..."
    aws ecs create-cluster \
        --cluster-name $CLUSTER_NAME \
        --capacity-providers FARGATE \
        --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
        --region $REGION
    echo -e "${GREEN}   ✅ ECS cluster created${NC}"
else
    echo "   ECS cluster already exists"
fi

# Create CloudWatch log group
echo -e "${BLUE}📊 Setting up CloudWatch logs...${NC}"
LOG_GROUP="/ecs/${APP_NAME}"
if ! aws logs describe-log-groups --log-group-name-prefix $LOG_GROUP --region $REGION | grep -q $LOG_GROUP; then
    echo "   Creating CloudWatch log group..."
    aws logs create-log-group \
        --log-group-name $LOG_GROUP \
        --region $REGION
    echo -e "${GREEN}   ✅ CloudWatch log group created${NC}"
else
    echo "   CloudWatch log group already exists"
fi

# Create task execution role if it doesn't exist
EXECUTION_ROLE_NAME="ecsTaskExecutionRole"
EXECUTION_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${EXECUTION_ROLE_NAME}"

echo -e "${BLUE}🔐 Checking ECS task execution role...${NC}"
if ! aws iam get-role --role-name $EXECUTION_ROLE_NAME > /dev/null 2>&1; then
    echo "   Creating ECS task execution role..."
    
    cat > trust-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

    aws iam create-role \
        --role-name $EXECUTION_ROLE_NAME \
        --assume-role-policy-document file://trust-policy.json

    aws iam attach-role-policy \
        --role-name $EXECUTION_ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

    rm trust-policy.json
    echo -e "${GREEN}   ✅ ECS task execution role created${NC}"
else
    echo "   ECS task execution role already exists"
fi

# Get default VPC and subnets
echo -e "${BLUE}🌐 Getting VPC information...${NC}"
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region $REGION)
SUBNET_ARRAY=(${SUBNET_IDS})

echo "   VPC ID: $VPC_ID"
echo "   Subnets: ${SUBNET_ARRAY[@]}"

# Create security group
SECURITY_GROUP_NAME="${APP_NAME}-sg"
echo -e "${BLUE}🔒 Setting up security group...${NC}"

# Check if security group exists
SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=$SECURITY_GROUP_NAME" "Name=vpc-id,Values=$VPC_ID" \
    --query 'SecurityGroups[0].GroupId' --output text --region $REGION 2>/dev/null || echo "None")

if [ "$SG_ID" = "None" ] || [ -z "$SG_ID" ]; then
    echo "   Creating security group..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name $SECURITY_GROUP_NAME \
        --description "Security group for $APP_NAME" \
        --vpc-id $VPC_ID \
        --query 'GroupId' --output text --region $REGION)
    
    # Add inbound rule for HTTP
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port $PORT \
        --cidr 0.0.0.0/0 \
        --region $REGION
    
    echo -e "${GREEN}   ✅ Security group created: $SG_ID${NC}"
else
    echo "   Security group already exists: $SG_ID"
fi

# Create task definition
echo -e "${BLUE}📋 Creating task definition...${NC}"
cat > task-definition.json << EOF
{
    "family": "$TASK_FAMILY",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "$CPU",
    "memory": "$MEMORY",
    "executionRoleArn": "$EXECUTION_ROLE_ARN",
    "containerDefinitions": [
        {
            "name": "$APP_NAME",
            "image": "$ECR_REPOSITORY:latest",
            "portMappings": [
                {
                    "containerPort": $PORT,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "PORT",
                    "value": "$PORT"
                },
                {
                    "name": "HOST",
                    "value": "0.0.0.0"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "$LOG_GROUP",
                    "awslogs-region": "$REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            },
            "healthCheck": {
                "command": [
                    "CMD-SHELL",
                    "curl -f http://localhost:$PORT/health || exit 1"
                ],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }
    ]
}
EOF

# Register task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://task-definition.json \
    --region $REGION \
    --query 'taskDefinition.taskDefinitionArn' --output text)

echo -e "${GREEN}✅ Task definition registered: $TASK_DEFINITION_ARN${NC}"

# Create or update ECS service
echo -e "${BLUE}🚀 Deploying ECS service...${NC}"

# Prepare subnet list for CLI
SUBNET_LIST=""
for subnet in "${SUBNET_ARRAY[@]}"; do
    if [ -z "$SUBNET_LIST" ]; then
        SUBNET_LIST="$subnet"
    else
        SUBNET_LIST="$SUBNET_LIST,$subnet"
    fi
done

if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $REGION > /dev/null 2>&1; then
    echo "   Updating existing service..."
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $SERVICE_NAME \
        --task-definition $TASK_FAMILY \
        --desired-count 1 \
        --region $REGION
else
    echo "   Creating new service..."
    aws ecs create-service \
        --cluster $CLUSTER_NAME \
        --service-name $SERVICE_NAME \
        --task-definition $TASK_FAMILY \
        --desired-count 1 \
        --launch-type FARGATE \
        --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_LIST],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
        --region $REGION
fi

echo -e "${GREEN}✅ ECS service deployed successfully!${NC}"

# Wait for service to be stable
echo -e "${BLUE}⏳ Waiting for service to be stable...${NC}"
aws ecs wait services-stable \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region $REGION

# Get service information
echo -e "${BLUE}📊 Getting service information...${NC}"
TASK_ARN=$(aws ecs list-tasks \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --region $REGION \
    --query 'taskArns[0]' --output text)

if [ "$TASK_ARN" != "None" ] && [ ! -z "$TASK_ARN" ]; then
    # Get task details
    TASK_DETAILS=$(aws ecs describe-tasks \
        --cluster $CLUSTER_NAME \
        --tasks $TASK_ARN \
        --region $REGION)
    
    # Extract public IP
    PUBLIC_IP=$(echo $TASK_DETAILS | jq -r '.tasks[0].attachments[0].details[] | select(.name=="networkInterfaceId") | .value' | xargs -I {} aws ec2 describe-network-interfaces --network-interface-ids {} --region $REGION --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
    
    if [ "$PUBLIC_IP" != "None" ] && [ ! -z "$PUBLIC_IP" ]; then
        API_ENDPOINT="http://${PUBLIC_IP}:${PORT}"
        
        echo -e "${BLUE}🧪 Testing deployment...${NC}"
        
        # Wait a bit for the service to be ready
        echo "   Waiting for service to be ready..."
        sleep 30
        
        echo "   Testing health endpoint..."
        if curl -s -f "${API_ENDPOINT}/health" > /dev/null; then
            echo -e "${GREEN}   ✅ Health endpoint working${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Health endpoint test failed (service might still be starting)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Could not retrieve public IP${NC}"
        API_ENDPOINT="Check ECS console for service endpoint"
    fi
else
    echo -e "${YELLOW}⚠️  No running tasks found${NC}"
    API_ENDPOINT="Check ECS console for service status"
fi

# Cleanup
rm -f task-definition.json

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "   Cluster: $CLUSTER_NAME"
echo "   Service: $SERVICE_NAME"
echo "   Task Family: $TASK_FAMILY"
echo "   Region: $REGION"
echo "   Security Group: $SG_ID"
echo ""
if [ "$PUBLIC_IP" != "None" ] && [ ! -z "$PUBLIC_IP" ]; then
    echo -e "${BLUE}🔗 API Endpoints:${NC}"
    echo "   Root: $API_ENDPOINT/"
    echo "   Health: $API_ENDPOINT/health"
    echo "   API v1 Health: $API_ENDPOINT/api/v1/health"
    echo "   Documentation: $API_ENDPOINT/api/v1/docs"
    echo ""
    echo -e "${BLUE}🧪 Test Commands:${NC}"
    echo "   curl $API_ENDPOINT/"
    echo "   curl $API_ENDPOINT/health"
    echo "   curl $API_ENDPOINT/api/v1/health"
fi
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo "   CloudWatch Logs: $LOG_GROUP"
echo "   ECS Console: https://console.aws.amazon.com/ecs/home?region=${REGION}#/clusters/${CLUSTER_NAME}/services"
echo ""
echo -e "${BLUE}💰 Cost Information:${NC}"
echo "   Fargate vCPU: \$0.04048 per vCPU per hour"
echo "   Fargate Memory: \$0.004445 per GB per hour"
echo "   Estimated monthly cost: ~\$15-20 for 1 task running 24/7"
echo ""
echo -e "${GREEN}🎯 Your FastAPI is now running on AWS ECS Fargate!${NC}"
