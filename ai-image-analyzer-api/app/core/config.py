"""
Configuration settings for the application
"""
import os
from typing import Optional

class Settings:
    """Application settings"""
    
    # API Settings
    API_TITLE: str = "AI Image Analyzer API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Professional AI-powered image analysis service"
    
    # AWS Settings
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-southeast-1")
    S3_BUCKET: Optional[str] = os.getenv("S3_BUCKET")
    
    # Lambda Settings
    IS_LAMBDA: bool = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # CORS Settings
    CORS_ORIGINS: list = ["*"]
    
    # Analysis Settings
    REKOGNITION_MAX_LABELS: int = 25
    REKOGNITION_MIN_CONFIDENCE: float = 25.0

# Create settings instance
settings = Settings()
