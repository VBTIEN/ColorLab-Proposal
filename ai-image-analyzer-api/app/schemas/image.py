"""
Image Schemas
Pydantic schemas cho request/response validation
"""

from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, validator
from app.models.image import (
    ImageStatus, AnalysisType, ColorTemperature, HarmonyType,
    EmotionalImpactLevel, ColorInfo, HarmonyAnalysis, 
    TemperatureAnalysis, MoodAnalysis, Recommendation
)

# Request Schemas
class ImageUploadSchema(BaseModel):
    """Schema for image upload requests"""
    image_data: str = Field(
        ..., 
        description="Base64 encoded image data (without data:image/jpeg;base64, prefix)",
        min_length=100
    )
    filename: Optional[str] = Field(
        None, 
        description="Original filename",
        max_length=255
    )
    analysis_type: AnalysisType = Field(
        default=AnalysisType.COMPREHENSIVE,
        description="Type of analysis to perform"
    )
    options: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional analysis options"
    )
    
    @validator('image_data')
    def validate_image_data(cls, v):
        """Validate base64 image data"""
        if v.startswith('data:'):
            raise ValueError('Image data should not include data URL prefix')
        
        # Basic base64 validation
        import base64
        try:
            base64.b64decode(v[:100])  # Test first 100 chars
        except Exception:
            raise ValueError('Invalid base64 image data')
        
        return v

class AnalysisRequestSchema(BaseModel):
    """Schema for analysis requests"""
    image_url: str = Field(
        ...,
        description="URL of the image to analyze"
    )
    analysis_type: AnalysisType = Field(
        default=AnalysisType.COMPREHENSIVE,
        description="Type of analysis to perform"
    )
    options: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional analysis options"
    )

class ColorAnalysisSchema(BaseModel):
    """Schema for color analysis results"""
    dominant_colors: List[ColorInfo] = Field(
        default_factory=list,
        description="Dominant colors in the image"
    )
    color_distribution: Dict[str, float] = Field(
        default_factory=dict,
        description="Color distribution percentages"
    )
    harmony_analysis: Optional[HarmonyAnalysis] = Field(
        None,
        description="Color harmony analysis"
    )
    temperature_analysis: Optional[TemperatureAnalysis] = Field(
        None,
        description="Color temperature analysis"
    )

class CompositionAnalysisSchema(BaseModel):
    """Schema for composition analysis results"""
    rule_of_thirds: Dict[str, Any] = Field(
        default_factory=dict,
        description="Rule of thirds analysis"
    )
    leading_lines: Dict[str, Any] = Field(
        default_factory=dict,
        description="Leading lines analysis"
    )
    symmetry: Dict[str, Any] = Field(
        default_factory=dict,
        description="Symmetry analysis"
    )
    balance: Dict[str, Any] = Field(
        default_factory=dict,
        description="Visual balance analysis"
    )
    focal_points: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Focal points in the image"
    )
    
    @validator('filename')
    def validate_filename(cls, v):
        """Validate filename"""
        if v is not None:
            # Remove path separators for security
            v = v.replace('/', '').replace('\\', '')
            if not v:
                return None
        return v

class ImageUpdateSchema(BaseModel):
    """Schema for image update requests"""
    analysis_type: Optional[AnalysisType] = Field(None, description="New analysis type")
    options: Optional[Dict[str, Any]] = Field(None, description="Updated analysis options")

class ImageQuerySchema(BaseModel):
    """Schema for image query parameters"""
    limit: int = Field(
        default=10, 
        ge=1, 
        le=100, 
        description="Number of images to return"
    )
    offset: int = Field(
        default=0, 
        ge=0, 
        description="Number of images to skip"
    )
    status: Optional[ImageStatus] = Field(
        None, 
        description="Filter by processing status"
    )
    date_from: Optional[str] = Field(
        None, 
        description="Filter from date (YYYY-MM-DD format)"
    )
    date_to: Optional[str] = Field(
        None, 
        description="Filter to date (YYYY-MM-DD format)"
    )
    analysis_type: Optional[AnalysisType] = Field(
        None, 
        description="Filter by analysis type"
    )
    
    @validator('date_from', 'date_to')
    def validate_date_format(cls, v):
        """Validate date format"""
        if v is not None:
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Date must be in YYYY-MM-DD format')
        return v

# Response Schemas
class ImageMetadataSchema(BaseModel):
    """Schema for image metadata"""
    filename: Optional[str] = Field(None, description="Original filename")
    content_type: str = Field(..., description="Image MIME type")
    size_bytes: int = Field(..., description="File size in bytes")
    dimensions: Optional[Dict[str, int]] = Field(None, description="Image dimensions")
    upload_source: Optional[str] = Field(None, description="Upload source identifier")

class ColorInfoSchema(BaseModel):
    """Schema for color information"""
    name: str = Field(..., description="Color name in Vietnamese")
    hex_code: str = Field(..., description="Hex color code")
    percentage: float = Field(..., description="Percentage of image")
    rgb: List[int] = Field(..., description="RGB values")
    temperature: ColorTemperature = Field(..., description="Color temperature")
    confidence: Optional[float] = Field(None, description="Detection confidence")

class HarmonyAnalysisSchema(BaseModel):
    """Schema for harmony analysis"""
    primary_harmony: Dict[str, str] = Field(..., description="Primary harmony info")
    secondary_harmony: List[str] = Field(default=[], description="Secondary harmony types")
    harmony_score: int = Field(..., description="Harmony score (0-100)")
    color_relationships: List[str] = Field(default=[], description="Color relationships")
    balance_analysis: Dict[str, str] = Field(..., description="Balance analysis")
    contrast_analysis: Dict[str, str] = Field(..., description="Contrast analysis")

class TemperatureAnalysisSchema(BaseModel):
    """Schema for temperature analysis"""
    overall_temperature: ColorTemperature = Field(..., description="Overall temperature")
    temperature_score: float = Field(..., description="Temperature score")
    description: str = Field(..., description="Temperature description")
    warm_colors: int = Field(..., description="Number of warm colors")
    cool_colors: int = Field(..., description="Number of cool colors")
    neutral_colors: int = Field(..., description="Number of neutral colors")
    temperature_balance: float = Field(..., description="Temperature balance")

class MoodAnalysisSchema(BaseModel):
    """Schema for mood analysis"""
    primary_mood: str = Field(..., description="Primary mood")
    secondary_moods: List[str] = Field(default=[], description="Secondary moods")
    mood_description: str = Field(..., description="Mood description")
    emotional_impact: Dict[str, str] = Field(..., description="Emotional impact")

class RecommendationSchema(BaseModel):
    """Schema for recommendations"""
    type: str = Field(..., description="Recommendation type")
    suggestion: str = Field(..., description="Recommendation text")
    details: str = Field(..., description="Detailed explanation")

class ImageAnalysisSchema(BaseModel):
    """Schema for complete image analysis"""
    dominant_colors: List[ColorInfoSchema] = Field(default=[], description="Dominant colors")
    color_harmony: Optional[HarmonyAnalysisSchema] = Field(None, description="Harmony analysis")
    color_temperature: Optional[TemperatureAnalysisSchema] = Field(None, description="Temperature analysis")
    mood_analysis: Optional[MoodAnalysisSchema] = Field(None, description="Mood analysis")
    recommendations: List[RecommendationSchema] = Field(default=[], description="Recommendations")
    analysis_method: str = Field(..., description="Analysis method")
    accuracy_level: str = Field(..., description="Accuracy level")
    total_colors: int = Field(..., description="Total colors detected")
    processing_time: Optional[float] = Field(None, description="Processing time")

class ImageSchema(BaseModel):
    """Schema for complete image data"""
    id: str = Field(..., description="Image identifier")
    url: str = Field(..., description="Image URL")
    s3_key: str = Field(..., description="S3 storage key")
    status: ImageStatus = Field(..., description="Processing status")
    metadata: ImageMetadataSchema = Field(..., description="Image metadata")
    analysis: Optional[ImageAnalysisSchema] = Field(None, description="Analysis results")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")
    analysis_options: Optional[Dict[str, Any]] = Field(None, description="Analysis options")

class HATEOASLinks(BaseModel):
    """Schema for HATEOAS links"""
    self: str = Field(..., description="Self link")
    colors: Optional[str] = Field(None, description="Colors analysis link")
    harmony: Optional[str] = Field(None, description="Harmony analysis link")
    temperature: Optional[str] = Field(None, description="Temperature analysis link")
    mood: Optional[str] = Field(None, description="Mood analysis link")
    recommendations: Optional[str] = Field(None, description="Recommendations link")
    update: Optional[str] = Field(None, description="Update link")
    delete: Optional[str] = Field(None, description="Delete link")

class PaginationSchema(BaseModel):
    """Schema for pagination information"""
    limit: int = Field(..., description="Items per page")
    offset: int = Field(..., description="Items skipped")
    total: int = Field(..., description="Total items")
    has_more: bool = Field(..., description="Has more items")
    next_offset: Optional[int] = Field(None, description="Next page offset")
    prev_offset: Optional[int] = Field(None, description="Previous page offset")

# Main Response Schemas
class ImageResponseSchema(BaseModel):
    """Schema for single image response"""
    success: bool = Field(default=True, description="Success status")
    image: ImageSchema = Field(..., description="Image data")
    links: HATEOASLinks = Field(..., description="Navigation links")
    timestamp: str = Field(..., description="Response timestamp")

class ImageListResponseSchema(BaseModel):
    """Schema for image list response"""
    success: bool = Field(default=True, description="Success status")
    images: List[ImageSchema] = Field(..., description="List of images")
    pagination: PaginationSchema = Field(..., description="Pagination info")
    filters: Dict[str, Any] = Field(default={}, description="Applied filters")
    timestamp: str = Field(..., description="Response timestamp")

class AnalysisResponseSchema(BaseModel):
    """Schema for analysis-specific responses"""
    success: bool = Field(default=True, description="Success status")
    image_id: str = Field(..., description="Image identifier")
    analysis_type: str = Field(..., description="Analysis type")
    data: Union[
        List[ColorInfoSchema],
        HarmonyAnalysisSchema,
        TemperatureAnalysisSchema,
        MoodAnalysisSchema,
        List[RecommendationSchema]
    ] = Field(..., description="Analysis data")
    timestamp: str = Field(..., description="Response timestamp")

class ErrorSchema(BaseModel):
    """Schema for error responses"""
    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Error details")
    timestamp: str = Field(..., description="Error timestamp")

class ErrorResponseSchema(BaseModel):
    """Schema for error response"""
    success: bool = Field(default=False, description="Success status")
    error: ErrorSchema = Field(..., description="Error information")

class HealthCheckSchema(BaseModel):
    """Schema for health check response"""
    success: bool = Field(default=True, description="Health status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Check timestamp")
    dependencies: Dict[str, str] = Field(default={}, description="Dependencies status")
    endpoints: Dict[str, str] = Field(default={}, description="Available endpoints")

# Validation Schemas
class Base64ImageValidator(BaseModel):
    """Validator for base64 image data"""
    
    @staticmethod
    def validate_image_format(image_data: str) -> bool:
        """Validate image format from base64 data"""
        import base64
        import io
        from PIL import Image
        
        try:
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            
            # Try to open with PIL
            image = Image.open(io.BytesIO(image_bytes))
            
            # Check if it's a valid image format
            return image.format.lower() in ['jpeg', 'jpg', 'png', 'gif', 'webp']
        except Exception:
            return False
    
    @staticmethod
    def get_image_info(image_data: str) -> Dict[str, Any]:
        """Get image information from base64 data"""
        import base64
        import io
        from PIL import Image
        
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            return {
                'format': image.format,
                'mode': image.mode,
                'size': image.size,
                'width': image.width,
                'height': image.height,
                'size_bytes': len(image_bytes)
            }
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")

# Export all schemas
__all__ = [
    'ImageUploadSchema',
    'ImageUpdateSchema', 
    'ImageQuerySchema',
    'ImageResponseSchema',
    'ImageListResponseSchema',
    'AnalysisResponseSchema',
    'ErrorResponseSchema',
    'HealthCheckSchema',
    'Base64ImageValidator'
]
