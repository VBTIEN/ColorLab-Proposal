# 🚀 Quick Start Guide

## Bắt đầu nhanh trong 5 phút

### 1. Chuẩn bị AWS Credentials
```bash
# Cấu hình AWS CLI
aws configure
```

### 2. Chạy Setup Script
```bash
cd scripts/
chmod +x setup-workshop.sh
./setup-workshop.sh
```

### 3. Deploy Lambda Function
```bash
chmod +x deploy-lambda.sh
./deploy-lambda.sh
```

### 4. Test Web Interface
```bash
# Mở web/index.html trong browser
open ../web/index.html
```

## 🎯 Test với ảnh mẫu

1. Tải ảnh test từ internet hoặc sử dụng ảnh có sẵn
2. Upload vào web interface
3. Xem kết quả phân tích
4. Chat với AI về ảnh

## 🔧 Troubleshooting nhanh

- **Lỗi AWS credentials**: Chạy `aws configure list`
- **Lambda timeout**: Tăng timeout trong AWS Console
- **CORS error**: Kiểm tra API Gateway settings

## 📞 Cần hỗ trợ?
- Xem file README.md chi tiết
- Check docs/ folder
- Tạo issue trên GitHub
