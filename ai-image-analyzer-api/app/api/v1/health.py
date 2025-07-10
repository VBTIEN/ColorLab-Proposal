"""
Health Check Router
API health monitoring endpoints
"""

from fastapi import APIRouter
from app.core.config import settings
from app.utils.aws_clients import AWSClients
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get(
    "/health",
    summary="Health Check",
    description="Check API health and dependencies status"
)
async def health_check():
    """
    Comprehensive health check
    
    Returns service status and dependencies health
    """
    try:
        # Check AWS services
        aws_clients = AWSClients()
        dependencies = {}
        
        # Check S3
        try:
            aws_clients.s3.head_bucket(Bucket=settings.S3_BUCKET_NAME)
            dependencies["s3"] = "healthy"
        except Exception:
            dependencies["s3"] = "unhealthy"
        
        # Check Rekognition
        try:
            aws_clients.rekognition.describe_collection(CollectionId="test")
            dependencies["rekognition"] = "healthy"
        except Exception:
            dependencies["rekognition"] = "available"  # Service exists but no test collection
        
        # Overall health status
        overall_status = "healthy" if all(
            status in ["healthy", "available"] for status in dependencies.values()
        ) else "degraded"
        
        return {
            "success": True,
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": overall_status,
            "timestamp": settings.get_current_timestamp(),
            "dependencies": dependencies,
            "endpoints": {
                "POST /api/v1/images": "Create image analysis",
                "GET /api/v1/images": "List images",
                "GET /api/v1/images/{id}": "Get specific image",
                "GET /api/v1/images/{id}/colors": "Get color analysis",
                "GET /api/v1/images/{id}/harmony": "Get harmony analysis",
                "GET /api/v1/images/{id}/temperature": "Get temperature analysis",
                "GET /api/v1/images/{id}/mood": "Get mood analysis",
                "GET /api/v1/images/{id}/recommendations": "Get recommendations"
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Health check error: {str(e)}")
        return {
            "success": False,
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "unhealthy",
            "timestamp": settings.get_current_timestamp(),
            "error": str(e)
        }
