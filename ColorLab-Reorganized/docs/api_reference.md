# ColorLab API Reference

## Overview
ColorLab provides a RESTful API for professional color analysis of images.

## Base URL
```
https://spsvd9ec7i.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Authentication
No authentication required for public endpoints.

## Endpoints

### POST /analyze
Analyze colors in an uploaded image.

**Request:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "dominant_colors": [...],
  "regional_analysis": {...},
  "statistics": {...}
}
```

For complete API documentation, see the main README.md file.
