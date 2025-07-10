# Deployment Guide

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Python 3.11+

## Step-by-Step Deployment

### 1. Deploy Lambda Function
```bash
./tools/deployment/deploy_lambda.sh
```

### 2. Setup API Gateway
```bash
./tools/deployment/setup_api.sh
```

### 3. Create Lambda Layer
```bash
./tools/deployment/create_layer.sh
```

### 4. Deploy Web Interface
Upload the web interface to S3 bucket.

For detailed instructions, see the main README.md file.
