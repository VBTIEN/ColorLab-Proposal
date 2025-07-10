"""
Image Models
Pydantic models cho Image entities
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
from enum import Enum

class ImageStatus(str, Enum):
    """Image processing status"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalysisType(str, Enum):
    """Types of analysis available"""
    BASIC = "basic"
    COMPREHENSIVE = "comprehensive"
    COLORS_ONLY = "colors_only"
    HARMONY_ONLY = "harmony_only"
    TEMPERATURE_ONLY = "temperature_only"
    MOOD_ONLY = "mood_only"

class ColorTemperature(str, Enum):
    """Color temperature types"""
    WARM = "warm"
    COOL = "cool"
    NEUTRAL = "neutral"

class HarmonyType(str, Enum):
    """Color harmony types"""
    MONOCHROMATIC = "monochromatic"
    ANALOGOUS = "analogous"
    COMPLEMENTARY = "complementary"
    TRIADIC = "triadic"
    SPLIT_COMPLEMENTARY = "split_complementary"
    TETRADIC = "tetradic"
    COMPLEX = "complex"

class EmotionalImpactLevel(str, Enum):
    """Emotional impact levels"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

# Base Models
class ColorInfo(BaseModel):
    """Individual color information"""
    name: str = Field(..., description="Color name in Vietnamese")
    hex_code: str = Field(..., description="Hex color code")
    percentage: float = Field(..., ge=0, le=100, description="Percentage of image")
    rgb: List[int] = Field(..., description="RGB values [R, G, B]")
    temperature: ColorTemperature = Field(..., description="Color temperature")
    confidence: Optional[float] = Field(None, ge=0, le=100, description="Detection confidence")
    
    @validator('rgb')
    def validate_rgb(cls, v):
        if len(v) != 3:
            raise ValueError('RGB must have exactly 3 values')
        if not all(0 <= val <= 255 for val in v):
            raise ValueError('RGB values must be between 0 and 255')
        return v
    
    @validator('hex_code')
    def validate_hex_code(cls, v):
        if not v.startswith('#') or len(v) != 7:
            raise ValueError('Hex code must be in format #RRGGBB')
        return v.upper()

class HarmonyAnalysis(BaseModel):
    """Color harmony analysis results"""
    primary_harmony: Dict[str, str] = Field(..., description="Primary harmony type and description")
    secondary_harmony: List[str] = Field(default=[], description="Secondary harmony types")
    harmony_score: int = Field(..., ge=0, le=100, description="Harmony score (0-100)")
    color_relationships: List[str] = Field(default=[], description="Color relationships")
    balance_analysis: Dict[str, str] = Field(..., description="Color balance analysis")
    contrast_analysis: Dict[str, str] = Field(..., description="Color contrast analysis")

class TemperatureAnalysis(BaseModel):
    """Color temperature analysis results"""
    overall_temperature: ColorTemperature = Field(..., description="Overall color temperature")
    temperature_score: float = Field(..., description="Temperature score (-1 to 1)")
    description: str = Field(..., description="Temperature description")
    warm_colors: int = Field(..., ge=0, description="Number of warm colors")
    cool_colors: int = Field(..., ge=0, description="Number of cool colors")
    neutral_colors: int = Field(..., ge=0, description="Number of neutral colors")
    temperature_balance: float = Field(..., ge=0, le=1, description="Temperature balance ratio")

class EmotionalImpact(BaseModel):
    """Emotional impact analysis"""
    level: EmotionalImpactLevel = Field(..., description="Impact level")
    description: str = Field(..., description="Impact description")

class MoodAnalysis(BaseModel):
    """Mood analysis results"""
    primary_mood: str = Field(..., description="Primary mood detected")
    secondary_moods: List[str] = Field(default=[], description="Secondary moods")
    mood_description: str = Field(..., description="Mood description")
    emotional_impact: EmotionalImpact = Field(..., description="Emotional impact analysis")

class Recommendation(BaseModel):
    """Professional recommendation"""
    type: str = Field(..., description="Recommendation type")
    suggestion: str = Field(..., description="Recommendation suggestion")
    details: str = Field(..., description="Detailed explanation")

class ImageAnalysis(BaseModel):
    """Complete image analysis results"""
    dominant_colors: List[ColorInfo] = Field(default=[], description="Dominant colors")
    color_harmony: Optional[HarmonyAnalysis] = Field(None, description="Color harmony analysis")
    color_temperature: Optional[TemperatureAnalysis] = Field(None, description="Temperature analysis")
    mood_analysis: Optional[MoodAnalysis] = Field(None, description="Mood analysis")
    recommendations: List[Recommendation] = Field(default=[], description="Professional recommendations")
    analysis_method: str = Field(..., description="Analysis method used")
    accuracy_level: str = Field(..., description="Analysis accuracy level")
    total_colors: int = Field(..., ge=0, description="Total number of colors detected")
    processing_time: Optional[float] = Field(None, description="Processing time in seconds")

class ImageMetadata(BaseModel):
    """Image metadata information"""
    filename: Optional[str] = Field(None, description="Original filename")
    content_type: str = Field(..., description="Image content type")
    size_bytes: int = Field(..., ge=0, description="File size in bytes")
    dimensions: Optional[Dict[str, int]] = Field(None, description="Image dimensions")
    upload_source: Optional[str] = Field(None, description="Upload source")

class Image(BaseModel):
    """Main Image model"""
    id: str = Field(..., description="Unique image identifier")
    url: str = Field(..., description="Image URL")
    s3_key: str = Field(..., description="S3 storage key")
    status: ImageStatus = Field(default=ImageStatus.PENDING, description="Processing status")
    metadata: ImageMetadata = Field(..., description="Image metadata")
    analysis: Optional[ImageAnalysis] = Field(None, description="Analysis results")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")
    analysis_options: Optional[Dict[str, Any]] = Field(None, description="Analysis configuration")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() + "Z"
        }

# Request/Response Models
class ImageUploadRequest(BaseModel):
    """Image upload request"""
    image_data: str = Field(..., description="Base64 encoded image data")
    filename: Optional[str] = Field(None, description="Original filename")
    analysis_type: AnalysisType = Field(default=AnalysisType.COMPREHENSIVE, description="Type of analysis")
    options: Optional[Dict[str, Any]] = Field(None, description="Additional analysis options")

class ImageListQuery(BaseModel):
    """Image list query parameters"""
    limit: int = Field(default=10, ge=1, le=100, description="Number of images to return")
    offset: int = Field(default=0, ge=0, description="Number of images to skip")
    status: Optional[ImageStatus] = Field(None, description="Filter by status")
    date_from: Optional[datetime] = Field(None, description="Filter from date")
    date_to: Optional[datetime] = Field(None, description="Filter to date")
    analysis_type: Optional[AnalysisType] = Field(None, description="Filter by analysis type")

class ImageResponse(BaseModel):
    """Image response model"""
    success: bool = Field(default=True, description="Request success status")
    image: Image = Field(..., description="Image data")
    links: Dict[str, str] = Field(default={}, description="HATEOAS links")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class ImageListResponse(BaseModel):
    """Image list response model"""
    success: bool = Field(default=True, description="Request success status")
    images: List[Image] = Field(..., description="List of images")
    pagination: Dict[str, Any] = Field(..., description="Pagination information")
    filters: Dict[str, Any] = Field(default={}, description="Applied filters")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class AnalysisResponse(BaseModel):
    """Analysis-specific response model"""
    success: bool = Field(default=True, description="Request success status")
    image_id: str = Field(..., description="Image identifier")
    analysis_type: str = Field(..., description="Type of analysis")
    data: Dict[str, Any] = Field(..., description="Analysis data")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(default=False, description="Request success status")
    error: Dict[str, Any] = Field(..., description="Error information")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
