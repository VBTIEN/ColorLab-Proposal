# 🔑 Setup AWS Credentials - Chi tiết từng bước

## Bước 1: Đăng nhập AWS Console

1. Truy cập: https://console.aws.amazon.com
2. Đăng nhập với AWS account
3. Chọn region: **US East (N. Virginia) us-east-1**

## Bước 2: Tạo IAM User

### 2.1 Vào IAM Service
- Tìm "IAM" trong search box
- Click vào "IAM" service

### 2.2 Tạo User mới
- Click "Users" ở sidebar trái
- Click "Create user"
- User name: `image-analyzer-workshop-user`
- Click "Next"

### 2.3 Gán quyền
- Chọn "Attach policies directly"
- Tìm và check các policies sau:
  - ✅ `AmazonS3FullAccess`
  - ✅ `AmazonRekognitionFullAccess` 
  - ✅ `AmazonBedrockFullAccess`
  - ✅ `AWSLambdaFullAccess`
  - ✅ `IAMFullAccess`
  - ✅ `AmazonAPIGatewayAdministrator`
  - ✅ `CloudWatchFullAccess`

- Click "Next" → "Create user"

## Bước 3: Tạo Access Key

### 3.1 Vào User vừa tạo
- Click vào user `image-analyzer-workshop-user`
- Chọn tab "Security credentials"

### 3.2 Tạo Access Key
- Click "Create access key"
- Chọn "Command Line Interface (CLI)"
- Check "I understand..." 
- Click "Next"
- Description: "Image Analyzer Workshop"
- Click "Create access key"

### 3.3 Lưu thông tin
**⚠️ QUAN TRỌNG**: Copy và lưu lại:
- **Access Key ID**: AKIA...
- **Secret Access Key**: ...

## Bước 4: Cấu hình AWS CLI

Sau khi có Access Key, chạy lệnh:

```bash
aws configure
```

Nhập thông tin:
- AWS Access Key ID: [paste Access Key ID]
- AWS Secret Access Key: [paste Secret Access Key]  
- Default region name: us-east-1
- Default output format: json

## Bước 5: Kiểm tra

```bash
aws sts get-caller-identity
```

Nếu thành công, bạn sẽ thấy thông tin account.

---

**📞 Cần hỗ trợ?**
- Nếu chưa có AWS account: https://aws.amazon.com/free/
- Nếu gặp lỗi permissions: Kiểm tra lại policies đã gán
- Nếu không tìm thấy services: Đảm bảo đang ở region us-east-1
