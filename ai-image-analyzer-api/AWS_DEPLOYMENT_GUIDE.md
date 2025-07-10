# 🚀 AWS Deployment Guide - AI Image Analyzer FastAPI

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn deploy **AI Image Analyzer FastAPI** lên AWS với 2 phương pháp:

1. **AWS Lambda + API Gateway** (Serverless - Recommended)
2. **AWS ECS/Fargate** (Container-based)
3. **AWS EC2** (Traditional server)

---

## 🎯 Phương pháp 1: AWS Lambda + API Gateway (Serverless)

### ✅ Ưu điểm:
- Chi phí thấp (pay-per-request)
- Auto-scaling
- Không cần quản lý server
- Tích hợp tốt với AWS services

### 📋 Yêu cầu:
- AWS Account với quyền admin
- AWS CLI configured
- Docker (để build Lambda layer)

### 🔧 Bước 1: Chuẩn bị Lambda Package

```bash
cd /mnt/d/project/ai-image-analyzer-workshop/ai-image-analyzer-api

# Tạo thư mục deployment
mkdir lambda-deployment
cd lambda-deployment

# Copy source code
cp -r ../app ./
cp ../requirements.txt ./

# Tạo Lambda handler
cat > lambda_function.py << 'EOF'
import json
import sys
import os

# Add app directory to Python path
sys.path.append('/var/task/app')
sys.path.append('/var/task')

from mangum import Mangum
from app.main_test import app

# Create Lambda handler
handler = Mangum(app, lifespan="off")

def lambda_handler(event, context):
    """AWS Lambda handler"""
    return handler(event, context)
EOF

# Tạo requirements cho Lambda
cat > requirements_lambda.txt << 'EOF'
fastapi==0.115.14
uvicorn==0.35.0
pydantic==2.11.7
pydantic-settings==2.10.1
python-dotenv==1.1.1
mangum==0.18.0
boto3==1.34.0
pillow==10.1.0
EOF
```

### 🔧 Bước 2: Build Lambda Layer

```bash
# Tạo layer cho dependencies
mkdir python
pip install -r requirements_lambda.txt -t python/
zip -r lambda-layer.zip python/

# Tạo function package (chỉ code)
zip -r lambda-function.zip app/ lambda_function.py
```

### 🔧 Bước 3: Deploy với AWS CLI

```bash
# Tạo IAM role cho Lambda
aws iam create-role \
    --role-name AIImageAnalyzerLambdaRole \
    --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }'

# Attach policies
aws iam attach-role-policy \
    --role-name AIImageAnalyzerLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
    --role-name AIImageAnalyzerLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
    --role-name AIImageAnalyzerLambdaRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonRekognitionFullAccess

# Tạo Lambda layer
LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name ai-image-analyzer-dependencies \
    --zip-file fileb://lambda-layer.zip \
    --compatible-runtimes python3.9 python3.10 python3.11 \
    --query 'LayerVersionArn' --output text)

# Tạo Lambda function
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/AIImageAnalyzerLambdaRole"

aws lambda create-function \
    --function-name ai-image-analyzer-api \
    --runtime python3.11 \
    --role $ROLE_ARN \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://lambda-function.zip \
    --timeout 30 \
    --memory-size 512 \
    --layers $LAYER_ARN \
    --environment Variables='{
        "PYTHONPATH": "/var/task:/var/task/app:/opt/python"
    }'
```

### 🔧 Bước 4: Tạo API Gateway

```bash
# Tạo REST API
API_ID=$(aws apigateway create-rest-api \
    --name ai-image-analyzer-api \
    --description "AI Image Analyzer FastAPI" \
    --query 'id' --output text)

# Get root resource
ROOT_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[0].id' --output text)

# Tạo proxy resource
RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_ID \
    --path-part '{proxy+}' \
    --query 'id' --output text)

# Tạo ANY method cho root
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --authorization-type NONE

# Tạo ANY method cho proxy
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method ANY \
    --authorization-type NONE

# Setup integration cho root
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $ROOT_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${ACCOUNT_ID}:function:ai-image-analyzer-api/invocations"

# Setup integration cho proxy
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method ANY \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:${ACCOUNT_ID}:function:ai-image-analyzer-api/invocations"

# Add permissions
aws lambda add-permission \
    --function-name ai-image-analyzer-api \
    --statement-id apigateway-root \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:us-east-1:${ACCOUNT_ID}:${API_ID}/*/*"

# Deploy API
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod

echo "✅ API deployed successfully!"
echo "🔗 API URL: https://${API_ID}.execute-api.us-east-1.amazonaws.com/prod"
```

---

## 🎯 Phương pháp 2: AWS ECS/Fargate (Container)

### 🔧 Bước 1: Tạo Dockerfile

```bash
cd /mnt/d/project/ai-image-analyzer-workshop/ai-image-analyzer-api

cat > Dockerfile << 'EOF'
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY run_server.py .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["python", "run_server.py"]
EOF

# Tạo production server runner
cat > run_server.py << 'EOF'
#!/usr/bin/env python3
"""
Production server runner for AI Image Analyzer API
"""

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
EOF
```

### 🔧 Bước 2: Build và Push Docker Image

```bash
# Build image
docker build -t ai-image-analyzer-api .

# Tạo ECR repository
aws ecr create-repository --repository-name ai-image-analyzer-api

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Tag và push image
docker tag ai-image-analyzer-api:latest ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ai-image-analyzer-api:latest
docker push ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ai-image-analyzer-api:latest
```

### 🔧 Bước 3: Deploy với ECS Fargate

```bash
# Tạo ECS cluster
aws ecs create-cluster --cluster-name ai-image-analyzer-cluster

# Tạo task definition
cat > task-definition.json << EOF
{
    "family": "ai-image-analyzer-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "256",
    "memory": "512",
    "executionRoleArn": "arn:aws:iam::${ACCOUNT_ID}:role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "ai-image-analyzer-api",
            "image": "${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ai-image-analyzer-api:latest",
            "portMappings": [
                {
                    "containerPort": 8000,
                    "protocol": "tcp"
                }
            ],
            "essential": true,
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/ai-image-analyzer",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ]
}
EOF

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Tạo service
aws ecs create-service \
    --cluster ai-image-analyzer-cluster \
    --service-name ai-image-analyzer-service \
    --task-definition ai-image-analyzer-task \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## 🎯 Phương pháp 3: AWS EC2 (Traditional)

### 🔧 Bước 1: Launch EC2 Instance

```bash
# Launch Ubuntu instance
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --instance-type t3.micro \
    --key-name your-key-pair \
    --security-group-ids sg-xxx \
    --subnet-id subnet-xxx \
    --user-data file://user-data.sh
```

### 🔧 Bước 2: User Data Script

```bash
cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y python3 python3-pip git

# Clone repository
cd /home/ec2-user
git clone https://github.com/your-repo/ai-image-analyzer-workshop.git
cd ai-image-analyzer-workshop/ai-image-analyzer-api

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install additional packages
pip install fastapi uvicorn pydantic pydantic-settings

# Create systemd service
cat > /etc/systemd/system/ai-image-analyzer.service << 'SERVICE'
[Unit]
Description=AI Image Analyzer API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/ai-image-analyzer-workshop/ai-image-analyzer-api
Environment=PATH=/home/ec2-user/ai-image-analyzer-workshop/ai-image-analyzer-api/venv/bin
Environment=PYTHONPATH=/home/ec2-user/ai-image-analyzer-workshop/ai-image-analyzer-api
ExecStart=/home/ec2-user/ai-image-analyzer-workshop/ai-image-analyzer-api/venv/bin/python run_server.py
Restart=always

[Install]
WantedBy=multi-user.target
SERVICE

# Start service
systemctl daemon-reload
systemctl enable ai-image-analyzer
systemctl start ai-image-analyzer
EOF
```

---

## 🔧 Deployment Scripts

### Script tự động cho Lambda

```bash
cat > deploy-lambda.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying AI Image Analyzer API to AWS Lambda..."

# Variables
FUNCTION_NAME="ai-image-analyzer-api"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Build deployment package
echo "📦 Building deployment package..."
rm -rf lambda-deployment
mkdir lambda-deployment
cd lambda-deployment

# Copy source code
cp -r ../app ./
cp ../requirements.txt ./

# Create Lambda handler
cat > lambda_function.py << 'HANDLER'
import sys
import os
sys.path.append('/var/task/app')
sys.path.append('/var/task')

from mangum import Mangum
from app.main_test import app

handler = Mangum(app, lifespan="off")

def lambda_handler(event, context):
    return handler(event, context)
HANDLER

# Install dependencies
pip install mangum -t .
pip install -r requirements.txt -t .

# Create deployment package
zip -r ../lambda-deployment.zip . -x "*.pyc" "__pycache__/*"
cd ..

# Deploy to Lambda
echo "☁️ Deploying to AWS Lambda..."
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://lambda-deployment.zip \
    --region $REGION

echo "✅ Deployment completed successfully!"
echo "🔗 Test your API at: https://your-api-id.execute-api.${REGION}.amazonaws.com/prod"

# Cleanup
rm -rf lambda-deployment lambda-deployment.zip
EOF

chmod +x deploy-lambda.sh
```

### Script tự động cho ECS

```bash
cat > deploy-ecs.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying AI Image Analyzer API to AWS ECS..."

# Variables
CLUSTER_NAME="ai-image-analyzer-cluster"
SERVICE_NAME="ai-image-analyzer-service"
TASK_FAMILY="ai-image-analyzer-task"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Build and push Docker image
echo "🐳 Building Docker image..."
docker build -t ai-image-analyzer-api .

echo "📤 Pushing to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

docker tag ai-image-analyzer-api:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/ai-image-analyzer-api:latest
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/ai-image-analyzer-api:latest

# Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --force-new-deployment \
    --region $REGION

echo "✅ Deployment completed successfully!"
echo "🔗 Your API will be available at the ECS service endpoint"
EOF

chmod +x deploy-ecs.sh
```

---

## 🔍 Testing Deployment

### Test Lambda deployment:

```bash
# Test health endpoint
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/health

# Test API v1 health
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/v1/health

# Test root endpoint
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/
```

### Test ECS deployment:

```bash
# Get service endpoint
aws ecs describe-services --cluster ai-image-analyzer-cluster --services ai-image-analyzer-service

# Test endpoints
curl http://your-load-balancer-dns/health
curl http://your-load-balancer-dns/api/v1/health
```

---

## 💰 Cost Optimization

### Lambda:
- Sử dụng ARM-based processors (Graviton2)
- Optimize memory allocation
- Enable provisioned concurrency cho production

### ECS:
- Sử dụng Spot instances
- Right-size containers
- Enable auto-scaling

### General:
- Setup CloudWatch alarms
- Use AWS Cost Explorer
- Enable detailed billing

---

## 🔒 Security Best Practices

1. **IAM Roles**: Sử dụng roles thay vì hardcode credentials
2. **VPC**: Deploy trong private subnets
3. **Security Groups**: Restrict inbound traffic
4. **WAF**: Enable AWS WAF cho API Gateway
5. **Secrets Manager**: Store sensitive configuration
6. **CloudTrail**: Enable logging
7. **Encryption**: Enable encryption at rest và in transit

---

## 📊 Monitoring & Logging

### CloudWatch Metrics:
- Lambda duration và errors
- API Gateway latency
- ECS CPU/Memory utilization

### Logging:
- CloudWatch Logs cho Lambda
- ECS logs với awslogs driver
- API Gateway access logs

### Alerting:
- Setup CloudWatch alarms
- SNS notifications
- Slack/email integration

---

## 🎯 Kết luận

**Recommended approach**: AWS Lambda + API Gateway cho:
- ✅ Cost-effective
- ✅ Auto-scaling
- ✅ Serverless
- ✅ Easy maintenance

**Use ECS/Fargate khi**:
- Cần long-running processes
- Complex networking requirements
- Custom runtime environments

**Use EC2 khi**:
- Full control over infrastructure
- Legacy applications
- Specific compliance requirements

Chọn phương pháp phù hợp với requirements và budget của bạn! 🚀
