"""
Health check endpoints
"""
from fastapi import APIRouter
from datetime import datetime
import boto3
from botocore.exceptions import ClientError

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "success": True,
        "status": "healthy",
        "service": "AI Image Analyzer API",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@router.get("/api/v1/health")
async def detailed_health_check():
    """Detailed health check with AWS services"""
    
    health_status = {
        "success": True,
        "status": "healthy",
        "service": "AI Image Analyzer API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {}
    }
    
    # Check AWS services
    try:
        # Check S3
        s3_client = boto3.client('s3')
        s3_client.list_buckets()
        health_status["services"]["s3"] = "healthy"
    except ClientError:
        health_status["services"]["s3"] = "unhealthy"
        health_status["status"] = "degraded"
    
    try:
        # Check Rekognition
        rekognition_client = boto3.client('rekognition')
        rekognition_client.describe_collection(CollectionId='test')  # This will fail but shows service is available
        health_status["services"]["rekognition"] = "healthy"
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            health_status["services"]["rekognition"] = "healthy"  # Service is available
        else:
            health_status["services"]["rekognition"] = "unhealthy"
            health_status["status"] = "degraded"
    
    return health_status
