"""
Image analysis endpoints
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import base64
import json

from ..services.image_analyzer import ImageAnalyzerService
from ..utils.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

class AnalyzeRequest(BaseModel):
    bucket: str
    image_data: str  # base64 encoded
    analysis_type: Optional[str] = "comprehensive"

class AnalyzeResponse(BaseModel):
    success: bool
    timestamp: str
    version: str
    image_url: Optional[str] = None
    analysis: dict

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """
    Analyze uploaded image with AI
    """
    try:
        logger.info(f"Starting image analysis: {request.analysis_type}")
        
        # Initialize analyzer service
        analyzer = ImageAnalyzerService()
        
        # Perform analysis
        result = await analyzer.analyze_image(
            bucket=request.bucket,
            image_data=request.image_data,
            analysis_type=request.analysis_type
        )
        
        logger.info("Image analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Image analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Analysis Failed",
                "message": str(e)
            }
        )

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload image file for analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read file content
        content = await file.read()
        
        # Convert to base64
        image_data = base64.b64encode(content).decode('utf-8')
        
        return {
            "success": True,
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "image_data": image_data
        }
        
    except Exception as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Upload Failed",
                "message": str(e)
            }
        )
