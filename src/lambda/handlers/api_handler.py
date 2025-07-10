"""
API Gateway Handler - Main entry point for Lambda function
"""
import json
from datetime import datetime
from .image_processor import ImageProcessor
from .response_builder import ResponseBuilder

class APIHandler:
    def __init__(self):
        self.image_processor = ImageProcessor()
        self.response_builder = ResponseBuilder()
    
    def handle_request(self, event, context):
        """Main handler for API Gateway requests"""
        
        try:
            # Handle CORS preflight
            if event.get('httpMethod') == 'OPTIONS':
                return self.response_builder.cors_response()
            
            # Parse request body
            request_data = self._parse_request_body(event)
            
            # Validate request
            validation_error = self._validate_request(request_data)
            if validation_error:
                return self.response_builder.error_response(400, validation_error)
            
            # Process image
            analysis_result = self.image_processor.process_image(
                bucket=request_data.get('bucket'),
                image_data=request_data.get('image_data'),
                context=context
            )
            
            return self.response_builder.success_response(analysis_result)
            
        except Exception as e:
            print(f"API Handler Error: {str(e)}")
            return self.response_builder.error_response(500, f"Internal server error: {str(e)}")
    
    def _parse_request_body(self, event):
        """Parse and validate request body"""
        if 'body' not in event:
            return {}
        
        try:
            if isinstance(event['body'], str):
                return json.loads(event['body'])
            return event['body']
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON in request body")
    
    def _validate_request(self, request_data):
        """Validate request data"""
        if not request_data.get('image_data'):
            return "Missing required parameter: image_data"
        
        # Validate base64 image data
        try:
            import base64
            base64.b64decode(request_data['image_data'])
        except Exception:
            return "Invalid base64 image data"
        
        return None
