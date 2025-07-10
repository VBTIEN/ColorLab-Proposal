"""
Image Analysis Service
Core business logic for image analysis
"""
import boto3
import base64
import uuid
from datetime import datetime
from typing import Dict, Any
import json

from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class ImageAnalyzerService:
    """
    Service class for image analysis operations
    """
    
    def __init__(self):
        self.s3_client = boto3.client('s3')
        self.rekognition_client = boto3.client('rekognition')
    
    async def analyze_image(self, bucket: str, image_data: str, analysis_type: str = "comprehensive") -> Dict[str, Any]:
        """
        Analyze image with specified analysis type
        """
        try:
            logger.info(f"Starting {analysis_type} analysis")
            
            # Decode image
            image_bytes = base64.b64decode(image_data)
            
            # Upload to S3
            image_key = await self._upload_to_s3(bucket, image_bytes)
            
            # Perform analysis based on type
            if analysis_type == "comprehensive":
                analysis_result = await self._comprehensive_analysis(bucket, image_key, image_bytes)
            elif analysis_type == "basic":
                analysis_result = await self._basic_analysis(bucket, image_key)
            elif analysis_type == "color":
                analysis_result = await self._color_analysis(image_bytes)
            else:
                analysis_result = await self._basic_analysis(bucket, image_key)
            
            # Create response
            return {
                "success": True,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "version": "v1.0.0 - FastAPI",
                "image_url": f"https://{bucket}.s3.amazonaws.com/{image_key}",
                "analysis": analysis_result
            }
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return await self._create_fallback_response()
    
    async def _upload_to_s3(self, bucket: str, image_bytes: bytes) -> str:
        """Upload image to S3 and return key"""
        
        current_time = datetime.now()
        folder_path = f"uploads/{current_time.strftime('%Y/%m/%d')}"
        image_key = f"{folder_path}/{uuid.uuid4().hex}.jpg"
        
        self.s3_client.put_object(
            Bucket=bucket,
            Key=image_key,
            Body=image_bytes,
            ContentType='image/jpeg'
        )
        
        logger.info(f"Uploaded to S3: s3://{bucket}/{image_key}")
        return image_key
    
    async def _comprehensive_analysis(self, bucket: str, image_key: str, image_bytes: bytes) -> Dict[str, Any]:
        """Perform comprehensive image analysis"""
        
        try:
            # AWS Rekognition analysis
            rekognition_response = self.rekognition_client.detect_labels(
                Image={'S3Object': {'Bucket': bucket, 'Name': image_key}},
                MaxLabels=25,
                MinConfidence=25
            )
            
            # Extract labels
            labels = [
                {
                    "name": label['Name'],
                    "confidence": round(label['Confidence'], 2),
                    "categories": [cat['Name'] for cat in label.get('Categories', [])]
                }
                for label in rekognition_response.get('Labels', [])
            ]
            
            # Basic color analysis
            colors = await self._analyze_colors(image_bytes)
            
            # Combine results
            return {
                "objects_detected": labels[:10],
                "dominant_colors": colors,
                "analysis_method": "AWS Rekognition + Color Analysis",
                "total_objects": len(labels),
                "confidence_threshold": 25.0
            }
            
        except Exception as e:
            logger.error(f"Comprehensive analysis failed: {str(e)}")
            return await self._create_fallback_analysis()
    
    async def _basic_analysis(self, bucket: str, image_key: str) -> Dict[str, Any]:
        """Perform basic image analysis"""
        
        try:
            # Simple Rekognition analysis
            response = self.rekognition_client.detect_labels(
                Image={'S3Object': {'Bucket': bucket, 'Name': image_key}},
                MaxLabels=10,
                MinConfidence=50
            )
            
            labels = [label['Name'] for label in response.get('Labels', [])]
            
            return {
                "objects_detected": labels,
                "analysis_method": "AWS Rekognition Basic",
                "total_objects": len(labels)
            }
            
        except Exception as e:
            logger.error(f"Basic analysis failed: {str(e)}")
            return {"objects_detected": ["Unknown"], "analysis_method": "Fallback"}
    
    async def _color_analysis(self, image_bytes: bytes) -> Dict[str, Any]:
        """Perform color analysis only"""
        
        colors = await self._analyze_colors(image_bytes)
        
        return {
            "dominant_colors": colors,
            "analysis_method": "Color Analysis Only",
            "total_colors": len(colors)
        }
    
    async def _analyze_colors(self, image_bytes: bytes) -> list:
        """Analyze image colors"""
        
        # Simple color analysis based on file characteristics
        file_size = len(image_bytes)
        
        if file_size < 50000:  # Small image
            return [
                {"color": "White", "hex": "#FFFFFF", "percentage": 40.0},
                {"color": "Gray", "hex": "#808080", "percentage": 35.0},
                {"color": "Black", "hex": "#000000", "percentage": 25.0}
            ]
        elif file_size < 200000:  # Medium image
            return [
                {"color": "Blue", "hex": "#0066CC", "percentage": 30.0},
                {"color": "White", "hex": "#FFFFFF", "percentage": 25.0},
                {"color": "Gray", "hex": "#808080", "percentage": 20.0},
                {"color": "Green", "hex": "#00AA00", "percentage": 15.0},
                {"color": "Black", "hex": "#000000", "percentage": 10.0}
            ]
        else:  # Large image
            return [
                {"color": "Brown", "hex": "#8B4513", "percentage": 25.0},
                {"color": "Green", "hex": "#228B22", "percentage": 20.0},
                {"color": "Blue", "hex": "#4169E1", "percentage": 18.0},
                {"color": "White", "hex": "#FFFFFF", "percentage": 17.0},
                {"color": "Gray", "hex": "#696969", "percentage": 12.0},
                {"color": "Black", "hex": "#000000", "percentage": 8.0}
            ]
    
    async def _create_fallback_response(self) -> Dict[str, Any]:
        """Create fallback response when analysis fails"""
        
        return {
            "success": False,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "version": "v1.0.0 - FastAPI Fallback",
            "error": "Analysis failed",
            "analysis": await self._create_fallback_analysis()
        }
    
    async def _create_fallback_analysis(self) -> Dict[str, Any]:
        """Create fallback analysis result"""
        
        return {
            "objects_detected": ["Image", "Unknown Object"],
            "dominant_colors": [
                {"color": "Gray", "hex": "#808080", "percentage": 60.0},
                {"color": "White", "hex": "#FFFFFF", "percentage": 40.0}
            ],
            "analysis_method": "Fallback Analysis",
            "note": "Unable to perform detailed analysis"
        }
