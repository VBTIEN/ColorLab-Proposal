# 🚀 AI Image Analyzer FastAPI - AWS Deployment

## 📋 Tổng quan

Project **AI Image Analyzer FastAPI** có thể được deploy lên AWS bằng nhiều cách khác nhau. Chúng tôi cung cấp scripts tự động để deploy với 2 phương pháp chính:

1. **AWS Lambda + API Gateway** (Serverless - Recommended cho development)
2. **AWS ECS Fargate** (Container - Recommended cho production)

---

## 🎯 Quick Start - Deploy trong 5 phút

### Bước 1: Chuẩn bị AWS
```bash
# Cài đặt AWS CLI (nếu chưa có)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Cấu hình AWS credentials
aws configure
# Nhập: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### Bước 2: Deploy tự động
```bash
cd /mnt/d/project/ai-image-analyzer-workshop/ai-image-analyzer-api

# Chạy script deployment tổng hợp
./deploy-to-aws.sh

# Chọn option 1 (Lambda) hoặc 2 (ECS)
# Script sẽ tự động tạo tất cả resources cần thiết
```

### Bước 3: Test API
```bash
# API sẽ có endpoint như:
# Lambda: https://xxx.execute-api.us-east-1.amazonaws.com/prod
# ECS: http://public-ip:8000

# Test endpoints
curl https://your-api-endpoint/
curl https://your-api-endpoint/health
curl https://your-api-endpoint/api/v1/docs
```

---

## 🎯 Phương pháp 1: AWS Lambda (Serverless)

### ✅ Ưu điểm:
- **Chi phí thấp**: Chỉ trả tiền khi có request
- **Auto-scaling**: Tự động scale theo traffic
- **Không cần quản lý server**: AWS lo tất cả
- **Setup nhanh**: Deploy trong vài phút

### ❌ Nhược điểm:
- **Cold start**: Độ trễ khi function chưa warm
- **Timeout limit**: Tối đa 15 phút per request
- **Memory limit**: Tối đa 10GB RAM

### 💰 Chi phí ước tính:
- **Free tier**: 1M requests/tháng miễn phí
- **Sau đó**: $0.20 per 1M requests
- **Ví dụ**: 10K requests/tháng = ~$0.02

### 🚀 Deploy Lambda:
```bash
# Deploy tự động
./deploy-to-lambda.sh

# Hoặc manual
cd lambda-deployment
pip install mangum -t .
zip -r ../lambda-deployment.zip .
aws lambda create-function --function-name ai-image-analyzer-fastapi ...
```

---

## 🎯 Phương pháp 2: AWS ECS Fargate (Container)

### ✅ Ưu điểm:
- **Always warm**: Không có cold start
- **Full control**: Kiểm soát hoàn toàn environment
- **Scalable**: Dễ dàng scale horizontal
- **Production-ready**: Phù hợp cho production

### ❌ Nhược điểm:
- **Chi phí cao hơn**: Chạy 24/7
- **Setup phức tạp hơn**: Cần Docker, VPC, etc.
- **Quản lý nhiều hơn**: Monitoring, logging, etc.

### 💰 Chi phí ước tính:
- **vCPU**: $0.04048 per vCPU per hour
- **Memory**: $0.004445 per GB per hour
- **Ví dụ**: 0.25 vCPU + 0.5GB = ~$15/tháng

### 🚀 Deploy ECS:
```bash
# Cần Docker running
docker --version

# Deploy tự động
./deploy-to-ecs.sh

# Script sẽ tự động:
# - Build Docker image
# - Push to ECR
# - Create ECS cluster
# - Deploy service
```

---

## 📋 So sánh chi tiết

| Tiêu chí | Lambda | ECS Fargate |
|----------|--------|-------------|
| **Chi phí** | $0-5/tháng | $15-20/tháng |
| **Cold start** | Có (1-3s) | Không |
| **Timeout** | 15 phút | Không giới hạn |
| **Memory** | Tối đa 10GB | Tối đa 30GB |
| **Setup time** | 2-3 phút | 5-10 phút |
| **Maintenance** | Ít | Trung bình |
| **Scaling** | Tự động | Tự động |
| **Use case** | Dev/Test/Low traffic | Production/High traffic |

---

## 🔧 Cấu hình AWS Resources

### Lambda Resources:
```
✅ Lambda Function: ai-image-analyzer-fastapi
✅ IAM Role: AIImageAnalyzerFastAPIRole
✅ API Gateway: ai-image-analyzer-fastapi-api
✅ CloudWatch Logs: /aws/lambda/ai-image-analyzer-fastapi
```

### ECS Resources:
```
✅ ECR Repository: ai-image-analyzer-fastapi
✅ ECS Cluster: ai-image-analyzer-fastapi-cluster
✅ ECS Service: ai-image-analyzer-fastapi-service
✅ Task Definition: ai-image-analyzer-fastapi-task
✅ Security Group: ai-image-analyzer-fastapi-sg
✅ CloudWatch Logs: /ecs/ai-image-analyzer-fastapi
```

---

## 🧪 Testing Deployment

### Automated Testing:
```bash
# Test script có sẵn trong deployment
API_ENDPOINT="your-api-endpoint"

# Basic tests
curl $API_ENDPOINT/
curl $API_ENDPOINT/health
curl $API_ENDPOINT/api/v1/health

# API documentation
open $API_ENDPOINT/api/v1/docs
```

### Manual Testing:
1. **Root endpoint**: Kiểm tra API info
2. **Health check**: Kiểm tra service status
3. **API v1 endpoints**: Test các endpoints chính
4. **Documentation**: Xem Swagger UI
5. **Error handling**: Test với invalid requests

---

## 📊 Monitoring & Logging

### CloudWatch Logs:
```bash
# Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/ai-image-analyzer"

# ECS logs
aws logs describe-log-groups --log-group-name-prefix "/ecs/ai-image-analyzer"

# Tail logs real-time
aws logs tail /aws/lambda/ai-image-analyzer-fastapi --follow
```

### Metrics:
- **Lambda**: Duration, Errors, Throttles, Concurrent executions
- **ECS**: CPU utilization, Memory utilization, Task count
- **API Gateway**: Request count, Latency, Error rate

### Alerts:
```bash
# Setup CloudWatch alarms
aws cloudwatch put-metric-alarm \
    --alarm-name "API-High-Error-Rate" \
    --alarm-description "Alert when API error rate > 5%" \
    --metric-name "4XXError" \
    --namespace "AWS/ApiGateway" \
    --statistic "Sum" \
    --period 300 \
    --threshold 5 \
    --comparison-operator "GreaterThanThreshold"
```

---

## 🔒 Security Best Practices

### IAM Roles:
- ✅ Sử dụng least privilege principle
- ✅ Không hardcode credentials
- ✅ Regular review permissions

### Network Security:
- ✅ VPC với private subnets (ECS)
- ✅ Security groups restrict access
- ✅ WAF cho API Gateway (optional)

### Data Security:
- ✅ HTTPS/TLS encryption
- ✅ Secrets Manager cho sensitive data
- ✅ CloudTrail logging enabled

---

## 💰 Cost Optimization

### Lambda:
```bash
# Monitor costs
aws ce get-cost-and-usage \
    --time-period Start=2024-01-01,End=2024-01-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE

# Optimize memory allocation
aws lambda update-function-configuration \
    --function-name ai-image-analyzer-fastapi \
    --memory-size 256  # Start low, increase if needed
```

### ECS:
```bash
# Use Spot instances (up to 70% savings)
aws ecs put-cluster-capacity-providers \
    --cluster ai-image-analyzer-fastapi-cluster \
    --capacity-providers FARGATE_SPOT

# Right-size containers
# Monitor CloudWatch metrics and adjust CPU/Memory
```

### General:
- ✅ Set up billing alerts
- ✅ Use AWS Cost Explorer
- ✅ Regular cost reviews
- ✅ Delete unused resources

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example:
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Lambda
        run: ./deploy-to-lambda.sh
```

---

## 🛠️ Troubleshooting

### Common Issues:

#### Lambda Issues:
```bash
# Cold start timeout
# Solution: Increase timeout, use provisioned concurrency

# Import errors
# Solution: Check dependencies in deployment package

# Memory errors
# Solution: Increase memory allocation
```

#### ECS Issues:
```bash
# Task fails to start
# Solution: Check CloudWatch logs, security groups

# Health check failures
# Solution: Verify health endpoint, adjust health check settings

# Service not accessible
# Solution: Check security groups, public IP assignment
```

#### General AWS Issues:
```bash
# Permission denied
# Solution: Check IAM roles and policies

# Resource limits
# Solution: Request limit increases via AWS Support

# Region issues
# Solution: Ensure all resources in same region
```

---

## 📚 Additional Resources

### Documentation:
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Amazon ECS Developer Guide](https://docs.aws.amazon.com/ecs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Mangum Documentation](https://mangum.io/)

### Tools:
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM](https://aws.amazon.com/serverless/sam/)
- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/) (for IaC)

### Community:
- [AWS Community](https://aws.amazon.com/developer/community/)
- [FastAPI Community](https://github.com/tiangolo/fastapi)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aws-lambda+fastapi)

---

## 🎯 Kết luận

### Recommendations:

**🚀 Cho Development/Testing:**
- Sử dụng **AWS Lambda** với script `./deploy-to-lambda.sh`
- Chi phí thấp, setup nhanh
- Phù hợp cho prototype và testing

**🏭 Cho Production:**
- Sử dụng **AWS ECS Fargate** với script `./deploy-to-ecs.sh`
- Performance ổn định, không cold start
- Dễ scale và monitor

**💡 Pro Tips:**
- Bắt đầu với Lambda để test
- Chuyển sang ECS khi traffic tăng
- Monitor costs thường xuyên
- Setup CI/CD pipeline sớm
- Implement proper logging và monitoring

---

**🎉 Chúc bạn deploy thành công!**

Nếu gặp vấn đề, hãy check:
1. CloudWatch logs
2. AWS Console
3. Script output messages
4. AWS_DEPLOYMENT_GUIDE.md cho chi tiết

**Happy deploying! 🚀**
