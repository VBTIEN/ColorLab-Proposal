#!/usr/bin/env python3
"""
AI Image Analyzer API Server Runner
Script để chạy API server với các tùy chọn khác nhau
"""

import os
import sys
import argparse
import uvicorn
from pathlib import Path

# Add app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def main():
    parser = argparse.ArgumentParser(description="Run AI Image Analyzer API Server")
    
    parser.add_argument(
        "--host", 
        default="0.0.0.0", 
        help="Host to bind to (default: 0.0.0.0)"
    )
    
    parser.add_argument(
        "--port", 
        type=int, 
        default=8000, 
        help="Port to bind to (default: 8000)"
    )
    
    parser.add_argument(
        "--reload", 
        action="store_true", 
        help="Enable auto-reload for development"
    )
    
    parser.add_argument(
        "--workers", 
        type=int, 
        default=1, 
        help="Number of worker processes (default: 1)"
    )
    
    parser.add_argument(
        "--log-level", 
        default="info", 
        choices=["critical", "error", "warning", "info", "debug", "trace"],
        help="Log level (default: info)"
    )
    
    parser.add_argument(
        "--env", 
        default="development",
        choices=["development", "production", "testing"],
        help="Environment (default: development)"
    )
    
    args = parser.parse_args()
    
    # Set environment
    os.environ["ENVIRONMENT"] = args.env
    
    # Configure uvicorn settings
    config = {
        "app": "app.main:app",
        "host": args.host,
        "port": args.port,
        "log_level": args.log_level,
    }
    
    if args.reload:
        config["reload"] = True
        config["reload_dirs"] = ["app"]
    else:
        config["workers"] = args.workers
    
    print(f"🚀 Starting AI Image Analyzer API Server...")
    print(f"   Environment: {args.env}")
    print(f"   Host: {args.host}")
    print(f"   Port: {args.port}")
    print(f"   Workers: {args.workers if not args.reload else '1 (reload mode)'}")
    print(f"   Log Level: {args.log_level}")
    print(f"   Reload: {'Yes' if args.reload else 'No'}")
    print(f"")
    print(f"📚 API Documentation: http://{args.host}:{args.port}/api/v1/docs")
    print(f"🏥 Health Check: http://{args.host}:{args.port}/api/v1/health")
    print(f"")
    
    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
