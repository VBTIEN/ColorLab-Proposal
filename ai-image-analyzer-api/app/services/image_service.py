"""
Image Service
Business logic cho image processing và analysis
"""

import base64
import uuid
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Tuple
import boto3
from botocore.exceptions import ClientError
import logging

from app.core.config import settings
from app.models.image import (
    Image, ImageStatus, ImageMetadata, ImageAnalysis,
    ColorInfo, HarmonyAnalysis, TemperatureAnalysis, 
    MoodAnalysis, Recommendation, AnalysisType
)
from app.schemas.image import ImageUploadSchema, ImageQuerySchema
from app.services.analysis_service import AnalysisService
from app.utils.aws_clients import AWSClients
from app.utils.image_utils import ImageUtils

logger = logging.getLogger(__name__)

class ImageService:
    """Service class for image operations"""
    
    def __init__(self):
        self.aws_clients = AWSClients()
        self.analysis_service = AnalysisService()
        self.image_utils = ImageUtils()
    
    async def create_image(self, upload_data: ImageUploadSchema) -> Image:
        """Create new image and start analysis"""
        try:
            # Generate unique image ID
            image_id = str(uuid.uuid4())
            
            # Validate and decode image data
            image_bytes = base64.b64decode(upload_data.image_data)
            
            # Validate image format and size
            await self._validate_image(image_bytes, upload_data.filename)
            
            # Get image metadata
            metadata = await self._extract_image_metadata(
                image_bytes, 
                upload_data.filename
            )
            
            # Generate S3 keys
            s3_key = settings.get_s3_image_key(image_id)
            analysis_key = settings.get_s3_analysis_key(image_id)
            
            # Upload image to S3
            image_url = await self._upload_to_s3(image_bytes, s3_key, metadata.content_type)
            
            # Create image object
            image = Image(
                id=image_id,
                url=image_url,
                s3_key=s3_key,
                status=ImageStatus.PENDING,
                metadata=metadata,
                analysis_options={
                    "analysis_type": upload_data.analysis_type,
                    "options": upload_data.options or {}
                }
            )
            
            # Start analysis asynchronously
            asyncio.create_task(
                self._perform_analysis(image, upload_data.analysis_type)
            )
            
            logger.info(f"✅ Created image {image_id} and started analysis")
            return image
            
        except Exception as e:
            logger.error(f"❌ Error creating image: {str(e)}")
            raise
    
    async def get_image(self, image_id: str) -> Optional[Image]:
        """Get image by ID"""
        try:
            # Try to get from cache first (if Redis is available)
            cached_image = await self._get_from_cache(image_id)
            if cached_image:
                return cached_image
            
            # Get from S3 storage
            analysis_key = settings.get_s3_analysis_key(image_id)
            
            try:
                response = self.aws_clients.s3.get_object(
                    Bucket=settings.S3_BUCKET_NAME,
                    Key=analysis_key
                )
                
                image_data = json.loads(response['Body'].read().decode('utf-8'))
                image = Image(**image_data)
                
                # Cache the result
                await self._cache_image(image)
                
                return image
                
            except ClientError as e:
                if e.response['Error']['Code'] == 'NoSuchKey':
                    logger.warning(f"Image {image_id} not found in S3")
                    return None
                raise
                
        except Exception as e:
            logger.error(f"❌ Error getting image {image_id}: {str(e)}")
            raise
    
    async def list_images(self, query: ImageQuerySchema) -> Tuple[List[Image], Dict[str, Any]]:
        """List images with pagination and filtering"""
        try:
            # Build S3 prefix for filtering
            prefix = settings.S3_ANALYSIS_PATH + "/"
            
            # Add date filtering to prefix if specified
            if query.date_from:
                date_from = datetime.strptime(query.date_from, '%Y-%m-%d')
                prefix += date_from.strftime('%Y/%m/%d') + "/"
            
            # List objects from S3
            paginator = self.aws_clients.s3.get_paginator('list_objects_v2')
            page_iterator = paginator.paginate(
                Bucket=settings.S3_BUCKET_NAME,
                Prefix=prefix,
                PaginationConfig={
                    'MaxItems': query.limit + query.offset + 10,
                    'PageSize': 100
                }
            )
            
            images = []
            total_count = 0
            
            for page in page_iterator:
                if 'Contents' not in page:
                    break
                
                for obj in page['Contents']:
                    if not obj['Key'].endswith('.json'):
                        continue
                    
                    total_count += 1
                    
                    # Apply offset
                    if total_count <= query.offset:
                        continue
                    
                    # Apply limit
                    if len(images) >= query.limit:
                        break
                    
                    # Get image data
                    try:
                        response = self.aws_clients.s3.get_object(
                            Bucket=settings.S3_BUCKET_NAME,
                            Key=obj['Key']
                        )
                        
                        image_data = json.loads(response['Body'].read().decode('utf-8'))
                        image = Image(**image_data)
                        
                        # Apply filters
                        if self._matches_filters(image, query):
                            images.append(image)
                            
                    except Exception as e:
                        logger.warning(f"Error loading image from {obj['Key']}: {str(e)}")
                        continue
            
            # Pagination info
            pagination = {
                'limit': query.limit,
                'offset': query.offset,
                'total': total_count,
                'has_more': total_count > query.offset + query.limit,
                'next_offset': query.offset + query.limit if total_count > query.offset + query.limit else None,
                'prev_offset': max(0, query.offset - query.limit) if query.offset > 0 else None
            }
            
            return images, pagination
            
        except Exception as e:
            logger.error(f"❌ Error listing images: {str(e)}")
            raise
    
    async def update_image(self, image_id: str, update_data: Dict[str, Any]) -> Optional[Image]:
        """Update image and re-run analysis if needed"""
        try:
            # Get existing image
            image = await self.get_image(image_id)
            if not image:
                return None
            
            # Update analysis options if provided
            if 'analysis_type' in update_data or 'options' in update_data:
                image.analysis_options = image.analysis_options or {}
                
                if 'analysis_type' in update_data:
                    image.analysis_options['analysis_type'] = update_data['analysis_type']
                
                if 'options' in update_data:
                    image.analysis_options['options'] = update_data['options']
                
                # Re-run analysis
                image.status = ImageStatus.PENDING
                image.updated_at = datetime.utcnow()
                
                # Start analysis asynchronously
                asyncio.create_task(
                    self._perform_analysis(
                        image, 
                        AnalysisType(update_data.get('analysis_type', AnalysisType.COMPREHENSIVE))
                    )
                )
            
            # Save updated image
            await self._save_image(image)
            
            logger.info(f"✅ Updated image {image_id}")
            return image
            
        except Exception as e:
            logger.error(f"❌ Error updating image {image_id}: {str(e)}")
            raise
    
    async def delete_image(self, image_id: str) -> bool:
        """Delete image and its analysis"""
        try:
            # Get image to find S3 keys
            image = await self.get_image(image_id)
            if not image:
                return False
            
            # Delete from S3
            objects_to_delete = [
                {'Key': image.s3_key},  # Original image
                {'Key': settings.get_s3_analysis_key(image_id)}  # Analysis data
            ]
            
            self.aws_clients.s3.delete_objects(
                Bucket=settings.S3_BUCKET_NAME,
                Delete={'Objects': objects_to_delete}
            )
            
            # Remove from cache
            await self._remove_from_cache(image_id)
            
            logger.info(f"✅ Deleted image {image_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error deleting image {image_id}: {str(e)}")
            raise
    
    async def get_image_analysis(self, image_id: str, analysis_type: str) -> Optional[Dict[str, Any]]:
        """Get specific analysis data for image"""
        try:
            image = await self.get_image(image_id)
            if not image or not image.analysis:
                return None
            
            analysis_data = {
                'colors': image.analysis.dominant_colors,
                'harmony': image.analysis.color_harmony,
                'temperature': image.analysis.color_temperature,
                'mood': image.analysis.mood_analysis,
                'recommendations': image.analysis.recommendations
            }
            
            return analysis_data.get(analysis_type)
            
        except Exception as e:
            logger.error(f"❌ Error getting analysis {analysis_type} for image {image_id}: {str(e)}")
            raise
    
    # Private methods
    async def _validate_image(self, image_bytes: bytes, filename: Optional[str]) -> None:
        """Validate image data"""
        # Check file size
        if len(image_bytes) > settings.MAX_FILE_SIZE:
            raise ValueError(f"Image too large: {len(image_bytes)} bytes. Max: {settings.MAX_FILE_SIZE}")
        
        # Validate image format
        if not self.image_utils.is_valid_image(image_bytes):
            raise ValueError("Invalid image format")
        
        # Check content type
        content_type = self.image_utils.get_content_type(image_bytes)
        if not settings.is_allowed_image_type(content_type):
            raise ValueError(f"Unsupported image type: {content_type}")
    
    async def _extract_image_metadata(self, image_bytes: bytes, filename: Optional[str]) -> ImageMetadata:
        """Extract metadata from image"""
        content_type = self.image_utils.get_content_type(image_bytes)
        dimensions = self.image_utils.get_dimensions(image_bytes)
        
        return ImageMetadata(
            filename=filename,
            content_type=content_type,
            size_bytes=len(image_bytes),
            dimensions=dimensions,
            upload_source="api_v1"
        )
    
    async def _upload_to_s3(self, image_bytes: bytes, s3_key: str, content_type: str) -> str:
        """Upload image to S3"""
        try:
            self.aws_clients.s3.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=s3_key,
                Body=image_bytes,
                ContentType=content_type,
                Metadata={
                    'upload-time': datetime.utcnow().isoformat(),
                    'service': 'ai-image-analyzer-api',
                    'version': settings.VERSION
                }
            )
            
            # Generate public URL
            url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
            return url
            
        except Exception as e:
            logger.error(f"❌ Error uploading to S3: {str(e)}")
            raise
    
    async def _perform_analysis(self, image: Image, analysis_type: AnalysisType) -> None:
        """Perform image analysis asynchronously"""
        try:
            # Update status
            image.status = ImageStatus.PROCESSING
            await self._save_image(image)
            
            # Perform analysis
            start_time = datetime.utcnow()
            
            analysis_result = await self.analysis_service.analyze_image(
                image.s3_key,
                analysis_type,
                image.analysis_options.get('options', {}) if image.analysis_options else {}
            )
            
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            analysis_result.processing_time = processing_time
            
            # Update image with results
            image.analysis = analysis_result
            image.status = ImageStatus.COMPLETED
            image.updated_at = datetime.utcnow()
            
            await self._save_image(image)
            
            logger.info(f"✅ Completed analysis for image {image.id} in {processing_time:.2f}s")
            
        except Exception as e:
            logger.error(f"❌ Error analyzing image {image.id}: {str(e)}")
            
            # Update status to failed
            image.status = ImageStatus.FAILED
            image.updated_at = datetime.utcnow()
            await self._save_image(image)
    
    async def _save_image(self, image: Image) -> None:
        """Save image data to S3"""
        try:
            analysis_key = settings.get_s3_analysis_key(image.id)
            
            # Convert to dict for JSON serialization
            image_dict = image.dict()
            
            # Upload to S3
            self.aws_clients.s3.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=analysis_key,
                Body=json.dumps(image_dict, default=str, ensure_ascii=False, indent=2),
                ContentType='application/json'
            )
            
            # Update cache
            await self._cache_image(image)
            
        except Exception as e:
            logger.error(f"❌ Error saving image {image.id}: {str(e)}")
            raise
    
    def _matches_filters(self, image: Image, query: ImageQuerySchema) -> bool:
        """Check if image matches query filters"""
        # Status filter
        if query.status and image.status != query.status:
            return False
        
        # Date range filter
        if query.date_from:
            date_from = datetime.strptime(query.date_from, '%Y-%m-%d')
            if image.created_at < date_from:
                return False
        
        if query.date_to:
            date_to = datetime.strptime(query.date_to, '%Y-%m-%d') + timedelta(days=1)
            if image.created_at >= date_to:
                return False
        
        # Analysis type filter
        if query.analysis_type and image.analysis_options:
            if image.analysis_options.get('analysis_type') != query.analysis_type:
                return False
        
        return True
    
    async def _get_from_cache(self, image_id: str) -> Optional[Image]:
        """Get image from cache (Redis if available)"""
        # TODO: Implement Redis caching
        return None
    
    async def _cache_image(self, image: Image) -> None:
        """Cache image data"""
        # TODO: Implement Redis caching
        pass
    
    async def _remove_from_cache(self, image_id: str) -> None:
        """Remove image from cache"""
        # TODO: Implement Redis caching
        pass

# Create global service instance
image_service = ImageService()
