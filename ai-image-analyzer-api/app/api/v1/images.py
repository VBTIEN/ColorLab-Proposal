"""
Images API Router
RESTful endpoints cho image operations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging

from app.core.config import settings
from app.schemas.image import (
    ImageUploadSchema, ImageUpdateSchema, ImageQuerySchema,
    ImageResponseSchema, ImageListResponseSchema, ErrorResponseSchema
)
from app.services.image_service import image_service
from app.models.image import ImageStatus, AnalysisType
from app.utils.response_builder import ResponseBuilder

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/images",
    response_model=ImageResponseSchema,
    status_code=201,
    summary="Create Image Analysis",
    description="Upload image and perform comprehensive AI analysis"
)
async def create_image(upload_data: ImageUploadSchema):
    """
    Create new image and start analysis
    
    - **image_data**: Base64 encoded image data
    - **filename**: Original filename (optional)
    - **analysis_type**: Type of analysis to perform
    - **options**: Additional analysis options
    """
    try:
        logger.info(f"📤 Creating image with analysis type: {upload_data.analysis_type}")
        
        # Create image and start analysis
        image = await image_service.create_image(upload_data)
        
        # Build HATEOAS links
        links = ResponseBuilder.build_image_links(image.id)
        
        # Create response
        response_data = {
            "success": True,
            "image": image.dict(),
            "links": links,
            "timestamp": settings.get_current_timestamp()
        }
        
        logger.info(f"✅ Created image {image.id}")
        return JSONResponse(content=response_data, status_code=201)
        
    except ValueError as e:
        logger.warning(f"⚠️ Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"❌ Error creating image: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images",
    response_model=ImageListResponseSchema,
    summary="List Images",
    description="Get list of images with pagination and filtering"
)
async def list_images(
    limit: int = Query(default=10, ge=1, le=100, description="Number of images to return"),
    offset: int = Query(default=0, ge=0, description="Number of images to skip"),
    status: Optional[ImageStatus] = Query(None, description="Filter by processing status"),
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    analysis_type: Optional[AnalysisType] = Query(None, description="Filter by analysis type")
):
    """
    List images with pagination and filtering
    
    - **limit**: Number of images per page (1-100)
    - **offset**: Number of images to skip
    - **status**: Filter by processing status
    - **date_from**: Filter from date
    - **date_to**: Filter to date
    - **analysis_type**: Filter by analysis type
    """
    try:
        logger.info(f"📋 Listing images: limit={limit}, offset={offset}")
        
        # Create query object
        query = ImageQuerySchema(
            limit=limit,
            offset=offset,
            status=status,
            date_from=date_from,
            date_to=date_to,
            analysis_type=analysis_type
        )
        
        # Get images
        images, pagination = await image_service.list_images(query)
        
        # Build response
        response_data = {
            "success": True,
            "images": [image.dict() for image in images],
            "pagination": pagination,
            "filters": {
                "status": status,
                "date_from": date_from,
                "date_to": date_to,
                "analysis_type": analysis_type
            },
            "timestamp": settings.get_current_timestamp()
        }
        
        logger.info(f"✅ Listed {len(images)} images")
        return response_data
        
    except ValueError as e:
        logger.warning(f"⚠️ Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"❌ Error listing images: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images/{image_id}",
    response_model=ImageResponseSchema,
    summary="Get Image",
    description="Get specific image details and analysis results"
)
async def get_image(
    image_id: str = Path(..., description="Image identifier")
):
    """
    Get specific image by ID
    
    - **image_id**: Unique image identifier
    """
    try:
        logger.info(f"🔍 Getting image {image_id}")
        
        # Get image
        image = await image_service.get_image(image_id)
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Build HATEOAS links
        links = ResponseBuilder.build_image_links(image_id)
        
        # Create response
        response_data = {
            "success": True,
            "image": image.dict(),
            "links": links,
            "timestamp": settings.get_current_timestamp()
        }
        
        logger.info(f"✅ Retrieved image {image_id}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting image {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put(
    "/images/{image_id}",
    response_model=ImageResponseSchema,
    summary="Update Image",
    description="Update image analysis settings and re-run analysis"
)
async def update_image(
    image_id: str = Path(..., description="Image identifier"),
    update_data: ImageUpdateSchema = None
):
    """
    Update image analysis settings
    
    - **image_id**: Unique image identifier
    - **analysis_type**: New analysis type
    - **options**: Updated analysis options
    """
    try:
        logger.info(f"🔄 Updating image {image_id}")
        
        # Update image
        image = await image_service.update_image(
            image_id, 
            update_data.dict(exclude_unset=True) if update_data else {}
        )
        
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Build HATEOAS links
        links = ResponseBuilder.build_image_links(image_id)
        
        # Create response
        response_data = {
            "success": True,
            "image": image.dict(),
            "links": links,
            "timestamp": settings.get_current_timestamp()
        }
        
        logger.info(f"✅ Updated image {image_id}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating image {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete(
    "/images/{image_id}",
    summary="Delete Image",
    description="Delete image and all associated analysis data"
)
async def delete_image(
    image_id: str = Path(..., description="Image identifier")
):
    """
    Delete image and its analysis data
    
    - **image_id**: Unique image identifier
    """
    try:
        logger.info(f"🗑️ Deleting image {image_id}")
        
        # Delete image
        success = await image_service.delete_image(image_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Create response
        response_data = {
            "success": True,
            "message": f"Image {image_id} deleted successfully",
            "timestamp": settings.get_current_timestamp()
        }
        
        logger.info(f"✅ Deleted image {image_id}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting image {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Sub-resource endpoints for specific analysis data
@router.get(
    "/images/{image_id}/colors",
    summary="Get Color Analysis",
    description="Get dominant colors analysis for specific image"
)
async def get_image_colors(
    image_id: str = Path(..., description="Image identifier")
):
    """Get color analysis for specific image"""
    try:
        logger.info(f"🎨 Getting colors for image {image_id}")
        
        colors = await image_service.get_image_analysis(image_id, "colors")
        if colors is None:
            raise HTTPException(status_code=404, detail="Image or analysis not found")
        
        response_data = {
            "success": True,
            "image_id": image_id,
            "analysis_type": "colors",
            "data": colors,
            "timestamp": settings.get_current_timestamp()
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting colors for {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images/{image_id}/harmony",
    summary="Get Harmony Analysis",
    description="Get color harmony analysis for specific image"
)
async def get_image_harmony(
    image_id: str = Path(..., description="Image identifier")
):
    """Get harmony analysis for specific image"""
    try:
        logger.info(f"🌈 Getting harmony for image {image_id}")
        
        harmony = await image_service.get_image_analysis(image_id, "harmony")
        if harmony is None:
            raise HTTPException(status_code=404, detail="Image or analysis not found")
        
        response_data = {
            "success": True,
            "image_id": image_id,
            "analysis_type": "harmony",
            "data": harmony,
            "timestamp": settings.get_current_timestamp()
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting harmony for {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images/{image_id}/temperature",
    summary="Get Temperature Analysis",
    description="Get color temperature analysis for specific image"
)
async def get_image_temperature(
    image_id: str = Path(..., description="Image identifier")
):
    """Get temperature analysis for specific image"""
    try:
        logger.info(f"🌡️ Getting temperature for image {image_id}")
        
        temperature = await image_service.get_image_analysis(image_id, "temperature")
        if temperature is None:
            raise HTTPException(status_code=404, detail="Image or analysis not found")
        
        response_data = {
            "success": True,
            "image_id": image_id,
            "analysis_type": "temperature",
            "data": temperature,
            "timestamp": settings.get_current_timestamp()
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting temperature for {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images/{image_id}/mood",
    summary="Get Mood Analysis",
    description="Get mood and emotion analysis for specific image"
)
async def get_image_mood(
    image_id: str = Path(..., description="Image identifier")
):
    """Get mood analysis for specific image"""
    try:
        logger.info(f"😊 Getting mood for image {image_id}")
        
        mood = await image_service.get_image_analysis(image_id, "mood")
        if mood is None:
            raise HTTPException(status_code=404, detail="Image or analysis not found")
        
        response_data = {
            "success": True,
            "image_id": image_id,
            "analysis_type": "mood",
            "data": mood,
            "timestamp": settings.get_current_timestamp()
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting mood for {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get(
    "/images/{image_id}/recommendations",
    summary="Get Recommendations",
    description="Get professional recommendations for specific image"
)
async def get_image_recommendations(
    image_id: str = Path(..., description="Image identifier")
):
    """Get recommendations for specific image"""
    try:
        logger.info(f"💡 Getting recommendations for image {image_id}")
        
        recommendations = await image_service.get_image_analysis(image_id, "recommendations")
        if recommendations is None:
            raise HTTPException(status_code=404, detail="Image or analysis not found")
        
        response_data = {
            "success": True,
            "image_id": image_id,
            "analysis_type": "recommendations",
            "data": recommendations,
            "timestamp": settings.get_current_timestamp()
        }
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting recommendations for {image_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
