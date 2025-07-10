#!/usr/bin/env python3
"""
Development server runner for AI Image Analyzer API
"""

import os
import sys
import uvicorn

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

if __name__ == "__main__":
    print("🚀 Starting AI Image Analyzer API Development Server...")
    print(f"📁 Project root: {project_root}")
    print("📖 API Documentation will be available at: http://localhost:8000/api/v1/docs")
    print("🔍 Alternative docs at: http://localhost:8000/api/v1/redoc")
    print("❤️  Health check at: http://localhost:8000/health")
    print("-" * 60)
    
    uvicorn.run(
        "app.main_test:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )
