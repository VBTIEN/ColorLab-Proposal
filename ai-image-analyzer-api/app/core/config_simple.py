"""
Simple Configuration Settings
"""

import os
from datetime import datetime
from typing import List, Optional

class Settings:
    """Simple application settings"""
    
    # Project Information
    PROJECT_NAME: str = "AI Image Analyzer API"
    PROJECT_DESCRIPTION: str = "Professional AI-powered image analysis service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # AWS Configuration
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    
    # S3 Configuration
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "ai-image-analyzer-bucket")
    S3_UPLOAD_PREFIX: str = "uploads/"
    S3_ANALYSIS_PREFIX: str = "analysis/"
    
    @staticmethod
    def get_current_timestamp() -> str:
        """Get current timestamp in ISO format"""
        return datetime.utcnow().isoformat() + "Z"

# Create settings instance
settings = Settings()
