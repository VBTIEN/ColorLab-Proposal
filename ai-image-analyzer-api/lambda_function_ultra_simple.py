import json
from datetime import datetime

def lambda_handler(event, context):
    """Ultra simple Lambda handler for testing"""
    
    try:
        # Simple response
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Ultra simple API is working!',
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'event_received': True
            })
        }
        
        return response
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
