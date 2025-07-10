import json
import sys
import os

def lambda_handler(event, context):
    """Test PIL availability"""
    
    result = {
        "python_path": sys.path,
        "environment": dict(os.environ),
        "pil_test": "not_tested",
        "numpy_test": "not_tested"
    }
    
    # Test PIL
    try:
        from PIL import Image
        result["pil_test"] = "success"
        result["pil_version"] = Image.__version__ if hasattr(Image, '__version__') else "unknown"
    except ImportError as e:
        result["pil_test"] = f"failed: {str(e)}"
    
    # Test numpy
    try:
        import numpy as np
        result["numpy_test"] = "success"
        result["numpy_version"] = np.__version__
    except ImportError as e:
        result["numpy_test"] = f"failed: {str(e)}"
    
    return {
        'statusCode': 200,
        'body': json.dumps(result, indent=2)
    }
