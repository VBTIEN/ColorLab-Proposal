# 🌐 RESTful API v12.0 - DOCUMENTATION

## 🚀 **AI IMAGE ANALYZER RESTful API**

### 📅 **Version:** v12.0 - Professional RESTful Architecture
### 🌐 **Base URL:** https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod
### 📋 **Content-Type:** application/json

---

## 🎯 **API OVERVIEW**

### **RESTful Design Principles:**
- **Resource-based URLs** - Clear resource identification
- **HTTP Methods** - Proper use of GET, POST, PUT, DELETE
- **Status Codes** - Meaningful HTTP status codes
- **Stateless** - Each request contains all necessary information
- **HATEOAS** - Hypermedia links for resource navigation
- **Consistent Response Format** - Standardized JSON responses

### **Key Features:**
- ✅ **Professional RESTful Architecture**
- ✅ **Resource-based Endpoints**
- ✅ **CRUD Operations** for images and analysis
- ✅ **Pagination Support**
- ✅ **Error Handling** with proper status codes
- ✅ **CORS Support** for web applications
- ✅ **Backward Compatibility** with legacy endpoints

---

## 📋 **API ENDPOINTS**

### **🏥 Health Check**

#### `GET /`
**Description:** API health check and endpoint discovery
```bash
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/
```

**Response:**
```json
{
  "success": true,
  "service": "AI Image Analyzer RESTful API",
  "version": "v12.0",
  "status": "healthy",
  "timestamp": "2025-07-06T12:30:00.000Z",
  "endpoints": {
    "POST /images": "Create new image analysis",
    "GET /images": "List all images",
    "GET /images/{id}": "Get specific image",
    "GET /images/{id}/colors": "Get image color analysis"
  }
}
```

#### `GET /health`
**Description:** Detailed health information
```bash
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/health
```

---

### **🖼️ Images Collection**

#### `POST /images`
**Description:** Upload image and create comprehensive analysis

**Request Body:**
```json
{
  "image_data": "base64_encoded_image_data",
  "bucket": "optional-bucket-name",
  "options": {
    "analysis_type": "comprehensive",
    "include_recommendations": true
  }
}
```

**Example:**
```bash
curl -X POST https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images \
  -H "Content-Type: application/json" \
  -d '{
    "image_data": "/9j/4AAQSkZJRgABAQEAYABgAAD...",
    "options": {
      "analysis_type": "comprehensive"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://bucket.s3.amazonaws.com/images/2025/07/06/550e8400-e29b-41d4-a716-446655440000.jpg",
    "upload_time": "2025-07-06T12:30:00.000Z",
    "size_bytes": 245760
  },
  "analysis": {
    "dominant_colors": [...],
    "color_harmony": {...},
    "color_temperature": {...},
    "mood_analysis": {...},
    "recommendations": [...]
  },
  "links": {
    "self": "/images/550e8400-e29b-41d4-a716-446655440000",
    "colors": "/images/550e8400-e29b-41d4-a716-446655440000/colors",
    "harmony": "/images/550e8400-e29b-41d4-a716-446655440000/harmony",
    "temperature": "/images/550e8400-e29b-41d4-a716-446655440000/temperature",
    "mood": "/images/550e8400-e29b-41d4-a716-446655440000/mood",
    "recommendations": "/images/550e8400-e29b-41d4-a716-446655440000/recommendations"
  }
}
```

#### `GET /images`
**Description:** List images with pagination and filtering

**Query Parameters:**
- `limit` (integer, default: 10) - Number of images to return
- `offset` (integer, default: 0) - Number of images to skip
- `date` (string, YYYY-MM-DD) - Filter by upload date

**Example:**
```bash
curl -X GET "https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images?limit=5&offset=0&date=2025-07-06"
```

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://bucket.s3.amazonaws.com/images/2025/07/06/550e8400-e29b-41d4-a716-446655440000.jpg",
      "upload_time": "2025-07-06T12:30:00.000Z",
      "size_bytes": 245760,
      "links": {
        "self": "/images/550e8400-e29b-41d4-a716-446655440000",
        "analysis": "/images/550e8400-e29b-41d4-a716-446655440000/colors"
      }
    }
  ],
  "pagination": {
    "limit": 5,
    "offset": 0,
    "total": 25,
    "has_more": true
  },
  "filters": {
    "date": "2025-07-06"
  }
}
```

---

### **🖼️ Individual Image Resource**

#### `GET /images/{id}`
**Description:** Get specific image details and analysis

**Example:**
```bash
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://bucket.s3.amazonaws.com/images/2025/07/06/550e8400-e29b-41d4-a716-446655440000.jpg",
    "upload_time": "2025-07-06T12:30:00.000Z",
    "size_bytes": 245760,
    "content_type": "image/jpeg"
  },
  "analysis": {
    "dominant_colors": [...],
    "color_harmony": {...},
    "color_temperature": {...},
    "mood_analysis": {...},
    "recommendations": [...]
  },
  "links": {
    "colors": "/images/550e8400-e29b-41d4-a716-446655440000/colors",
    "harmony": "/images/550e8400-e29b-41d4-a716-446655440000/harmony",
    "temperature": "/images/550e8400-e29b-41d4-a716-446655440000/temperature",
    "mood": "/images/550e8400-e29b-41d4-a716-446655440000/mood",
    "recommendations": "/images/550e8400-e29b-41d4-a716-446655440000/recommendations"
  }
}
```

#### `PUT /images/{id}`
**Description:** Update image analysis with new options

**Request Body:**
```json
{
  "options": {
    "analysis_type": "detailed",
    "include_recommendations": true,
    "color_depth": "advanced"
  }
}
```

#### `DELETE /images/{id}`
**Description:** Delete image and its analysis

**Example:**
```bash
curl -X DELETE https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/550e8400-e29b-41d4-a716-446655440000
```

---

### **🎨 Image Analysis Sub-resources**

#### `GET /images/{id}/colors`
**Description:** Get color analysis for specific image

**Example:**
```bash
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/550e8400-e29b-41d4-a716-446655440000/colors
```

**Response:**
```json
{
  "success": true,
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "colors": [
    {
      "mau": "Xanh dương",
      "ma_hex": "#0066CC",
      "ty_le_phan_tram": 35.0,
      "rgb": [0, 102, 204],
      "temperature": "cool",
      "confidence": 85.2
    },
    {
      "mau": "Trắng",
      "ma_hex": "#FFFFFF",
      "ty_le_phan_tram": 30.0,
      "rgb": [255, 255, 255],
      "temperature": "neutral",
      "confidence": 92.1
    }
  ],
  "analysis_method": "AWS Rekognition + Advanced Color Theory",
  "timestamp": "2025-07-06T12:30:00.000Z"
}
```

#### `GET /images/{id}/harmony`
**Description:** Get color harmony analysis

**Response:**
```json
{
  "success": true,
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "harmony": {
    "primary_harmony": {
      "type": "Complementary",
      "description": "Bổ sung - màu sắc đối lập tạo tương phản mạnh"
    },
    "harmony_score": 82,
    "secondary_harmony": ["Split-Complementary"],
    "color_relationships": [
      "Xanh dương và Cam: Bổ sung"
    ],
    "balance_analysis": {
      "balance_type": "Moderate",
      "description": "Cân bằng vừa phải"
    },
    "contrast_analysis": {
      "contrast_level": "High",
      "description": "Độ tương phản cao, tạo sự nổi bật"
    }
  },
  "timestamp": "2025-07-06T12:30:00.000Z"
}
```

#### `GET /images/{id}/temperature`
**Description:** Get color temperature analysis

**Response:**
```json
{
  "success": true,
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "temperature": {
    "overall_temperature": "cool",
    "temperature_score": -0.35,
    "description": "Lạnh - tạo cảm giác tĩnh lặng, chuyên nghiệp",
    "warm_colors": 1,
    "cool_colors": 2,
    "neutral_colors": 1,
    "temperature_balance": 0.33
  },
  "timestamp": "2025-07-06T12:30:00.000Z"
}
```

#### `GET /images/{id}/mood`
**Description:** Get mood and emotion analysis

**Response:**
```json
{
  "success": true,
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "mood": {
    "primary_mood": "professional",
    "secondary_moods": ["trustworthy", "calm"],
    "mood_description": "Tạo cảm giác chuyên nghiệp",
    "emotional_impact": {
      "level": "Medium",
      "description": "Tác động cảm xúc vừa phải"
    }
  },
  "timestamp": "2025-07-06T12:30:00.000Z"
}
```

#### `GET /images/{id}/recommendations`
**Description:** Get professional recommendations

**Response:**
```json
{
  "success": true,
  "image_id": "550e8400-e29b-41d4-a716-446655440000",
  "recommendations": [
    {
      "type": "Application",
      "suggestion": "Thích hợp cho brand chuyên nghiệp, công nghệ",
      "details": "Màu lạnh tạo cảm giác tin cậy, phù hợp với tài chính, y tế"
    },
    {
      "type": "Professional Use",
      "suggestion": "Phù hợp cho thiết kế web/print",
      "details": "Với harmony score 82, phù hợp cho các dự án sáng tạo"
    }
  ],
  "timestamp": "2025-07-06T12:30:00.000Z"
}
```

---

### **📊 Legacy Endpoints**

#### `POST /analyze` (Deprecated)
**Description:** Legacy analysis endpoint for backward compatibility

**⚠️ Deprecated:** Use `POST /images` instead

**Request Body:**
```json
{
  "bucket": "image-analyzer-workshop-1751722329",
  "image_data": "base64_encoded_image_data"
}
```

---

## 🔧 **HTTP STATUS CODES**

### **Success Codes:**
- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### **Client Error Codes:**
- `400 Bad Request` - Invalid request format
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Valid request but unable to process

### **Server Error Codes:**
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

---

## 🔒 **AUTHENTICATION & SECURITY**

### **CORS Support:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

### **Rate Limiting:**
- **Default:** 1000 requests per hour per IP
- **Burst:** 100 requests per minute

### **Security Headers:**
- Content-Type validation
- Request size limits (10MB max)
- Input sanitization

---

## 📝 **ERROR HANDLING**

### **Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "timestamp": "2025-07-06T12:30:00.000Z"
  }
}
```

### **Common Error Codes:**
- `INVALID_REQUEST` - Request format is invalid
- `MISSING_REQUIRED_FIELD` - Required field is missing
- `IMAGE_NOT_FOUND` - Specified image does not exist
- `ANALYSIS_FAILED` - Image analysis failed
- `STORAGE_ERROR` - S3 storage error
- `PROCESSING_ERROR` - Internal processing error

---

## 🧪 **TESTING EXAMPLES**

### **JavaScript/Fetch:**
```javascript
// Create image analysis
const response = await fetch('https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_data: base64ImageData,
    options: {
      analysis_type: 'comprehensive'
    }
  })
});

const result = await response.json();
console.log('Image ID:', result.image.id);

// Get color analysis
const colorsResponse = await fetch(`https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/${result.image.id}/colors`);
const colors = await colorsResponse.json();
console.log('Dominant colors:', colors.colors);
```

### **Python/Requests:**
```python
import requests
import base64

# Create image analysis
with open('image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

response = requests.post(
    'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images',
    json={
        'image_data': image_data,
        'options': {
            'analysis_type': 'comprehensive'
        }
    }
)

result = response.json()
image_id = result['image']['id']

# Get harmony analysis
harmony_response = requests.get(
    f'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/{image_id}/harmony'
)

harmony = harmony_response.json()
print(f"Harmony Score: {harmony['harmony']['harmony_score']}")
```

### **cURL Examples:**
```bash
# Health check
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/health

# List images
curl -X GET "https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images?limit=5"

# Get specific image
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/550e8400-e29b-41d4-a716-446655440000

# Get color analysis
curl -X GET https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/images/550e8400-e29b-41d4-a716-446655440000/colors
```

---

## 🚀 **PERFORMANCE & SCALABILITY**

### **Response Times:**
- **Health Check:** < 100ms
- **Image Upload:** < 2s
- **Color Analysis:** < 4s
- **List Images:** < 500ms

### **Scalability Features:**
- **Auto-scaling Lambda:** Handles concurrent requests
- **S3 Storage:** Unlimited image storage
- **CloudFront CDN:** Fast image delivery
- **Pagination:** Efficient large dataset handling

---

## 📊 **MONITORING & ANALYTICS**

### **Available Metrics:**
- Request count and response times
- Error rates by endpoint
- Image upload statistics
- Analysis success rates

### **Logging:**
- CloudWatch Logs integration
- Request/response logging
- Error tracking and alerting

---

## 🔮 **FUTURE ENHANCEMENTS**

### **Planned Features (v13.0):**
- **Batch Processing:** Multiple image analysis
- **Webhooks:** Real-time notifications
- **Custom Models:** User-trained analysis models
- **Export Features:** PDF reports, CSV data
- **Advanced Filtering:** Complex query capabilities

### **API Versioning:**
- **Current:** v12.0 (RESTful Architecture)
- **Previous:** v11.0 (Color Harmony & Temperature)
- **Legacy:** v10.0 and below (Deprecated)

---

## 📞 **SUPPORT & RESOURCES**

### **Documentation:**
- **API Reference:** This document
- **OpenAPI Spec:** Available at `/swagger.json`
- **Postman Collection:** Available for download

### **Support Channels:**
- **GitHub Issues:** Bug reports and feature requests
- **Email Support:** Technical assistance
- **Community Forum:** Developer discussions

---

## 🎯 **CONCLUSION**

**RESTful API v12.0** provides a professional, scalable, and well-documented interface for AI-powered image analysis:

### **🌟 Key Benefits:**
- ✅ **RESTful Design** - Industry-standard architecture
- ✅ **Resource-based URLs** - Intuitive endpoint structure
- ✅ **Comprehensive Analysis** - Color, harmony, temperature, mood
- ✅ **Flexible Querying** - Pagination and filtering
- ✅ **Error Handling** - Proper status codes and messages
- ✅ **Backward Compatibility** - Legacy endpoint support

### **🚀 Ready for Integration:**
- **Web Applications** - CORS-enabled for browser use
- **Mobile Apps** - RESTful endpoints for native apps
- **Server-to-Server** - API-to-API integration
- **Microservices** - Service mesh compatibility

---

**🌐 PROFESSIONAL RESTFUL API v12.0 - READY FOR PRODUCTION!**

---

**📞 Support:** RESTful API v12.0
**📅 Released:** July 6, 2025
**🔖 Version:** Professional RESTful Architecture
**🌐 Base URL:** https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod
