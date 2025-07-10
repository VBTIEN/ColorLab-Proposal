"""
AI Image Analyzer FastAPI Application
Main FastAPI application with all routes and middleware
"""
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import json
from datetime import datetime

from .routers import health, analyze, docs
from .core.config import settings
from .utils.logger import setup_logger

# Setup logger
logger = setup_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI Image Analyzer API",
    description="Professional AI-powered image analysis service",
    version="1.0.0",
    docs_url=None,  # Disable default docs
    redoc_url=None  # Disable default redoc
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(analyze.router, prefix="/api/v1")
app.include_router(docs.router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "success": True,
        "service": "AI Image Analyzer API",
        "version": "1.0.0",
        "description": "Professional AI-powered image analysis service",
        "docs_url": "/api/v1/docs",
        "health_check": "/api/v1/health",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return {
        "success": False,
        "error": "Not Found",
        "message": f"Endpoint {request.url.path} not found",
        "available_endpoints": [
            "/",
            "/health",
            "/api/v1/health",
            "/api/v1/docs",
            "/api/v1/analyze"
        ]
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Custom 500 handler"""
    logger.error(f"Internal server error: {str(exc)}")
    return {
        "success": False,
        "error": "Internal Server Error",
        "message": "An unexpected error occurred"
    }
