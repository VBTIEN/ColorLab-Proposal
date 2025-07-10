"""
Test PIL import in Lambda environment
"""
import json
import sys
import os

def lambda_handler(event, context):
    """Test PIL import"""
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        # Check Python path
        python_path = sys.path
        
        # Try to import PIL
        try:
            from PIL import Image
            import numpy as np
            pil_available = True
            pil_error = None
        except ImportError as e:
            pil_available = False
            pil_error = str(e)
        
        # Check environment
        env_vars = dict(os.environ)
        
        result = {
            "success": True,
            "pil_available": pil_available,
            "pil_error": pil_error,
            "python_path": python_path,
            "environment_vars": {k: v for k, v in env_vars.items() if 'PIL' in k or 'PYTHON' in k or 'PATH' in k},
            "lambda_runtime_dir": os.listdir('/opt') if os.path.exists('/opt') else "No /opt directory"
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result, indent=2)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
