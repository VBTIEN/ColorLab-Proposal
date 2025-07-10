"""
Fixed AWS Lambda handler for AI Image Analyzer FastAPI
"""
import json
import sys
import os
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))
sys.path.insert(0, str(current_dir / "app"))

def lambda_handler(event, context):
    """AWS Lambda entry point"""
    try:
        # Try to import and use FastAPI
        from mangum import Mangum
        from app.main_test import app
        
        # Create Mangum handler
        handler = Mangum(app, lifespan="off")
        
        # Log the event for debugging
        print(f"Event: {json.dumps(event, default=str)}")
        
        # Handle the request
        response = handler(event, context)
        
        # Log the response for debugging
        print(f"Response: {json.dumps(response, default=str)}")
        
        return response
        
    except ImportError as import_error:
        print(f"Import error: {import_error}")
        
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": {
                    "code": "IMPORT_ERROR",
                    "message": f"Failed to import dependencies: {str(import_error)}"
                }
            })
        }
    
    except Exception as general_error:
        print(f"Error in lambda_handler: {str(general_error)}")
        import traceback
        traceback.print_exc()
        
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": str(general_error)
                }
            })
        }
