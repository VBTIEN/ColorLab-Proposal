# 🧪 Test Guide - AI Image Analyzer

## 🎯 Cách test workshop

### 1. Mở Web Interface
```bash
# Từ thư mục project
cd scripts/
./open-web.sh
```

### 2. Copy URL vào browser
```
file:///mnt/d/project/ai-image-analyzer-workshop/web/index.html
```

### 3. Test với ảnh

#### 📸 Ảnh test gợi ý:
- **Portrait**: Ảnh chân dung người (test face detection)
- **Landscape**: Ảnh phong cảnh (test object detection)  
- **Text**: Ảnh có chữ viết (test OCR)
- **Product**: Ảnh sản phẩm (test object recognition)

#### 🔍 Kết quả mong đợi:
1. **Basic Analysis**:
   - Labels: Objects được nhận diện
   - Faces: Tuổi, giới tính, cảm xúc
   - Text: Văn bản trong ảnh

2. **Advanced Analysis**:
   - Phân tích nghệ thuật
   - Composition và style
   - Gợi ý cải thiện

3. **Chat với AI**:
   - Hỏi về màu sắc, phong cách
   - Gợi ý chỉnh sửa
   - Phân tích kỹ thuật

### 4. Demo Scenarios

#### Scenario A: Portrait Photo
1. Upload ảnh chân dung
2. Xem face analysis results
3. Chat: "Phân tích cảm xúc trong ảnh"
4. Chat: "Gợi ý cải thiện lighting"

#### Scenario B: Landscape Photo  
1. Upload ảnh phong cảnh
2. Xem object detection
3. Chat: "Đánh giá composition"
4. Chat: "Thời điểm chụp tốt nhất"

#### Scenario C: Text Image
1. Upload ảnh có text
2. Xem OCR results
3. Chat: "Độ rõ nét của text"
4. Chat: "Cách cải thiện chất lượng"

### 5. Troubleshooting

#### ❌ Web không load:
- Kiểm tra đường dẫn file
- Thử browser khác
- Check console errors

#### ❌ Analyze không hoạt động:
- Đang ở demo mode (bình thường)
- Kết quả sẽ là dữ liệu mẫu
- Để có kết quả thật cần AWS credentials

#### ❌ Chat không phản hồi:
- Demo mode có responses cố định
- Thử các từ khóa: "màu", "cải thiện", "phong cách"

### 6. Next Steps

#### 🚀 Để chạy với AWS thật:
1. Tạo AWS account
2. Setup IAM user (theo docs/setup-iam-user.md)
3. Chạy `aws configure`
4. Chạy `./setup-workshop.sh`
5. Chạy `./deploy-lambda.sh`

#### 📈 Mở rộng:
- Thêm batch processing
- Mobile app integration
- Custom ML models
- Real-time analysis

---

**🎉 Happy Testing!**
