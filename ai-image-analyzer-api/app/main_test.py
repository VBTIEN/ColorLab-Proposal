"""
AI Image Analyzer API - Test Main Application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config_simple import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Global HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "timestamp": settings.get_current_timestamp()
            }
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "success": True,
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.PROJECT_DESCRIPTION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "timestamp": settings.get_current_timestamp()
    }

# Health check endpoints
@app.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "success": True,
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "timestamp": settings.get_current_timestamp()
    }

@app.get(f"{settings.API_V1_STR}/health")
async def api_v1_health():
    """API v1 health check"""
    return {
        "success": True,
        "status": "healthy",
        "version": "v1",
        "service": settings.PROJECT_NAME,
        "timestamp": settings.get_current_timestamp()
    }

# Basic image analysis endpoint (placeholder)
@app.post(f"{settings.API_V1_STR}/images/analyze")
async def analyze_image():
    """Placeholder for image analysis"""
    return {
        "success": True,
        "message": "Image analysis endpoint - coming soon",
        "timestamp": settings.get_current_timestamp()
    }

# List images endpoint (placeholder)
@app.get(f"{settings.API_V1_STR}/images")
async def list_images():
    """Placeholder for listing images"""
    return {
        "success": True,
        "data": [],
        "message": "Images list endpoint - coming soon",
        "timestamp": settings.get_current_timestamp()
    }

if __name__ == "__main__":
    import uvicorn
    logger.info(f"🚀 Starting {settings.PROJECT_NAME}...")
    uvicorn.run(
        "app.main_test:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
