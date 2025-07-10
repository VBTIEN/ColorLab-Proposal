"""
Simple AWS Lambda handler for AI Image Analyzer FastAPI
Simplified version without complex dependencies
"""
import json
import sys
import os
from pathlib import Path

def lambda_handler(event, context):
    """AWS Lambda entry point"""
    try:
        # Log the event for debugging
        print(f"Event: {json.dumps(event, default=str)}")
        
        # Get HTTP method and path
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        print(f"Method: {http_method}, Path: {path}")
        
        # Simple routing
        if path == '/' or path == '':
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                "body": json.dumps({
                    "success": True,
                    "service": "AI Image Analyzer API",
                    "version": "1.0.0",
                    "description": "Professional AI-powered image analysis service",
                    "docs_url": "/api/v1/docs",
                    "health_check": "/api/v1/health",
                    "timestamp": "2025-07-06T17:45:00Z"
                })
            }
        
        elif path == '/health':
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": True,
                    "status": "healthy",
                    "service": "AI Image Analyzer API",
                    "timestamp": "2025-07-06T17:45:00Z"
                })
            }
        
        elif path == '/api/v1/health':
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": True,
                    "status": "healthy",
                    "version": "v1",
                    "service": "AI Image Analyzer API",
                    "timestamp": "2025-07-06T17:45:00Z"
                })
            }
        
        elif path == '/api/v1/docs':
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "text/html",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>AI Image Analyzer API Documentation</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
                        .method { color: #fff; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
                        .get { background: #61affe; }
                        .post { background: #49cc90; }
                    </style>
                </head>
                <body>
                    <h1>🤖 AI Image Analyzer API</h1>
                    <p>Professional AI-powered image analysis service</p>
                    
                    <h2>Available Endpoints:</h2>
                    
                    <div class="endpoint">
                        <span class="method get">GET</span> <strong>/</strong>
                        <p>API information and status</p>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method get">GET</span> <strong>/health</strong>
                        <p>Basic health check</p>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method get">GET</span> <strong>/api/v1/health</strong>
                        <p>API v1 health check</p>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method post">POST</span> <strong>/api/v1/images/analyze</strong>
                        <p>Analyze image with AI (Coming soon)</p>
                    </div>
                    
                    <div class="endpoint">
                        <span class="method get">GET</span> <strong>/api/v1/images</strong>
                        <p>List analyzed images (Coming soon)</p>
                    </div>
                    
                    <h2>🚀 Status: Deployed on AWS Lambda</h2>
                    <p>Region: ap-southeast-1 (Singapore)</p>
                    <p>Runtime: Python 3.11</p>
                </body>
                </html>
                """
            }
        
        else:
            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "success": False,
                    "error": {
                        "code": "NOT_FOUND",
                        "message": f"Endpoint {path} not found"
                    }
                })
            }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
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
                    "message": str(e)
                }
            })
        }
