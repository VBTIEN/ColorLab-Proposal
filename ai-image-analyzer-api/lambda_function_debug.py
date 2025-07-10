"""
Debug version of AI Image Analyzer Lambda Function
"""
import json
import os
import boto3
import base64
import uuid
from datetime import datetime

def lambda_handler(event, context):
    """
    Debug Lambda handler
    """
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        # Log the entire event for debugging
        print(f"🔍 DEBUG - Full event: {json.dumps(event)}")
        
        # Get request details
        method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        print(f"🤖 AI Request: {method} {path}")
        
        # Handle OPTIONS requests (CORS preflight)
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight successful'})
            }
        
        # Route handling
        if path == '/' or path == '' or not path:
            return handle_root(headers)
        elif path == '/health' or path.endswith('/health'):
            return handle_health(headers)
        elif 'analyze' in path:
            return handle_analyze_placeholder(headers)
        else:
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'message': f'Debug: Received {method} request to {path}',
                    'event_keys': list(event.keys()),
                    'timestamp': datetime.utcnow().isoformat() + 'Z'
                })
            }
            
    except Exception as e:
        print(f"❌ Lambda error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': f'Internal server error: {str(e)}',
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            })
        }

def handle_root(headers):
    """Handle root endpoint"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            "success": True,
            "message": "🤖 AI Image Analyzer API - Debug Version",
            "version": "2.0.0-debug",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "status": "API is working correctly",
            "features": [
                "Amazon Rekognition object detection",
                "Enhanced color analysis", 
                "Real AI insights",
                "Debug mode active"
            ],
            "endpoints": {
                "/health": "API health check",
                "/api/v1/analyze": "AI-powered image analysis"
            }
        })
    }

def handle_health(headers):
    """Handle health check"""
    health_status = {
        "success": True,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "2.0.0-debug",
        "services": {}
    }
    
    try:
        # Check S3
        s3_client = boto3.client('s3')
        health_status["services"]["s3"] = "healthy"
    except Exception as e:
        print(f"S3 health check failed: {str(e)}")
        health_status["services"]["s3"] = "unhealthy"
        health_status["status"] = "degraded"
    
    try:
        # Check Rekognition
        rekognition_client = boto3.client('rekognition')
        health_status["services"]["rekognition"] = "healthy"
    except Exception as e:
        print(f"Rekognition health check failed: {str(e)}")
        health_status["services"]["rekognition"] = "unhealthy"
        health_status["status"] = "degraded"
    
    health_status["debug"] = "Health endpoint working correctly"
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(health_status)
    }

def handle_analyze_placeholder(headers):
    """Placeholder for analyze endpoint"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'success': True,
            'message': 'Analyze endpoint is working - placeholder response',
            'debug': 'This is a debug version',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        })
    }
