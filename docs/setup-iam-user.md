# Hướng dẫn tạo IAM User cho Image Analysis Workshop

## Bước 1: Đăng nhập AWS Console
1. Truy cập https://console.aws.amazon.com
2. Đăng nhập với root account

## Bước 2: Tạo IAM User
1. Vào IAM service
2. Chọn "Users" → "Create user"
3. Tên user: `image-analyzer-user`
4. Chọn "Programmatic access"

## Bước 3: Gán quyền cần thiết
Tạo policy với các quyền sau:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "rekognition:*",
                "bedrock:*",
                "lambda:*",
                "iam:PassRole",
                "logs:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## Bước 4: Tạo Access Key
1. Chọn user vừa tạo
2. Tab "Security credentials"
3. "Create access key"
4. Chọn "CLI"
5. Lưu lại Access Key ID và Secret Access Key

## Bước 5: Cấu hình AWS CLI
Chạy lệnh: `aws configure`
- AWS Access Key ID: [nhập key vừa tạo]
- AWS Secret Access Key: [nhập secret key]
- Default region: us-east-1
- Default output format: json
