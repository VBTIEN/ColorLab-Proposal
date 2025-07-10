"""
Lambda Adapter for FastAPI
Converts Lambda events to ASGI format and back
"""
import json
import base64
from typing import Dict, Any
from urllib.parse import unquote_plus

class LambdaAdapter:
    """
    Adapter to run FastAPI applications on AWS Lambda
    """
    
    def __init__(self, app):
        self.app = app
    
    def handle(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        """
        Handle Lambda event and convert to FastAPI response
        """
        try:
            # Convert Lambda event to ASGI scope
            scope = self._create_asgi_scope(event)
            
            # Create ASGI application instance
            from fastapi.testclient import TestClient
            client = TestClient(self.app)
            
            # Extract request details
            method = event.get('httpMethod', 'GET')
            path = event.get('path', '/')
            headers = event.get('headers', {})
            body = event.get('body', '')
            
            # Handle query parameters
            query_params = event.get('queryStringParameters') or {}
            query_string = '&'.join([f"{k}={v}" for k, v in query_params.items()])
            
            # Make request
            if method == 'GET':
                response = client.get(path, params=query_params, headers=headers)
            elif method == 'POST':
                if headers.get('content-type', '').startswith('application/json'):
                    response = client.post(path, json=json.loads(body) if body else {}, headers=headers)
                else:
                    response = client.post(path, data=body, headers=headers)
            elif method == 'OPTIONS':
                response = client.options(path, headers=headers)
            else:
                response = client.request(method, path, headers=headers)
            
            # Convert response to Lambda format
            return self._create_lambda_response(response)
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': str(e),
                    'message': 'Lambda adapter error'
                })
            }
    
    def _create_asgi_scope(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Create ASGI scope from Lambda event"""
        
        headers = event.get('headers', {})
        
        return {
            'type': 'http',
            'method': event.get('httpMethod', 'GET'),
            'path': event.get('path', '/'),
            'query_string': self._encode_query_string(event.get('queryStringParameters', {})),
            'headers': [[k.lower().encode(), v.encode()] for k, v in headers.items()],
            'server': ('lambda', 80),
            'client': ('127.0.0.1', 0)
        }
    
    def _encode_query_string(self, params: Dict[str, str]) -> bytes:
        """Encode query parameters"""
        if not params:
            return b''
        
        query_parts = []
        for key, value in params.items():
            query_parts.append(f"{key}={value}")
        
        return '&'.join(query_parts).encode()
    
    def _create_lambda_response(self, response) -> Dict[str, Any]:
        """Convert FastAPI response to Lambda response format"""
        
        # Get response headers
        headers = dict(response.headers)
        
        # Ensure CORS headers
        headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PUT,DELETE'
        })
        
        # Get response body
        try:
            if response.headers.get('content-type', '').startswith('application/json'):
                body = response.text
            else:
                body = response.text
        except:
            body = str(response.content)
        
        return {
            'statusCode': response.status_code,
            'headers': headers,
            'body': body,
            'isBase64Encoded': False
        }
