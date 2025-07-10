"""
Simple FastAPI test để kiểm tra cấu trúc cơ bản
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI application
app = FastAPI(
    title="AI Image Analyzer API",
    description="Professional AI-powered image analysis service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "success": True,
        "service": "AI Image Analyzer API",
        "version": "1.0.0",
        "description": "Professional AI-powered image analysis service",
        "docs_url": "/docs",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "status": "healthy",
        "service": "AI Image Analyzer API"
    }

# API v1 endpoints
@app.get("/api/v1/health")
async def api_health():
    """API v1 health check"""
    return {
        "success": True,
        "status": "healthy",
        "version": "v1",
        "service": "AI Image Analyzer API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
