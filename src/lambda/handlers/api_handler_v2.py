import json
from datetime import datetime
from .enhanced_processor_v2 import EnhancedProcessorV2
from .response_builder import ResponseBuilder

class APIHandlerV2:
    def __init__(self):
        self.processor = EnhancedProcessorV2()
        self.response_builder = ResponseBuilder()
    
    def handle_request(self, event, context):
        """Enhanced API handler with professional AI analysis"""
        
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
            
            # Process with professional AI analysis
            analysis_result = self.processor.process_image(
                bucket=request_data.get('bucket', 'image-analyzer-workshop-1751722329'),
                image_data=request_data.get('image_data'),
                context=context
            )
            
            # Enhanced response with professional insights
            enhanced_response = self._enhance_response(analysis_result)
            
            return self.response_builder.success_response(enhanced_response)
            
        except Exception as e:
            print(f"Professional API Handler Error: {str(e)}")
            return self.response_builder.error_response(500, f"Professional analysis failed: {str(e)}")
    
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
        """Enhanced request validation"""
        if not request_data.get('image_data'):
            return "Missing required parameter: image_data"
        
        # Validate base64 image data
        try:
            import base64
            decoded_data = base64.b64decode(request_data['image_data'])
            
            # Check if it's a valid image (basic check)
            if len(decoded_data) < 100:  # Too small to be a real image
                return "Image data appears to be invalid or corrupted"
                
        except Exception:
            return "Invalid base64 image data"
        
        return None
    
    def _enhance_response(self, analysis_result):
        """Enhance response with user-friendly formatting"""
        
        try:
            professional_analysis = analysis_result.get('professional_analysis', {})
            
            # Create enhanced response structure
            enhanced = {
                'image_info': {
                    'location': analysis_result.get('image', ''),
                    'analysis_timestamp': analysis_result.get('metadata', {}).get('timestamp', ''),
                    'analysis_version': analysis_result.get('metadata', {}).get('version', ''),
                    'processing_engine': analysis_result.get('metadata', {}).get('analysis_engine', '')
                },
                'technical_analysis': self._format_technical_analysis(professional_analysis.get('technical_metrics', {})),
                'ai_insights': self._format_ai_insights(professional_analysis.get('professional_ai_analysis', {})),
                'summary': professional_analysis.get('analysis_summary', {}),
                'metadata': analysis_result.get('metadata', {})
            }
            
            return enhanced
            
        except Exception as e:
            print(f"Response enhancement failed: {str(e)}")
            return analysis_result  # Return original if enhancement fails
    
    def _format_technical_analysis(self, technical_metrics):
        """Format technical analysis for better presentation"""
        
        if not technical_metrics:
            return {'error': 'Technical analysis not available'}
        
        try:
            # Extract and format key technical data
            quality_metrics = technical_metrics.get('quality_metrics', {})
            color_analysis = technical_metrics.get('low_level_features', {}).get('color_analysis', {})
            objects = technical_metrics.get('high_level_features', {}).get('objects', [])
            faces = technical_metrics.get('high_level_features', {}).get('faces', [])
            
            return {
                'image_quality': {
                    'overall_score': quality_metrics.get('overall_quality_score', 0),
                    'category': quality_metrics.get('quality_category', 'Unknown'),
                    'professional_grade': quality_metrics.get('professional_grade', False),
                    'technical_details': {
                        'brightness': quality_metrics.get('brightness', 0),
                        'sharpness': quality_metrics.get('sharpness', 0),
                        'contrast': quality_metrics.get('contrast', 0)
                    },
                    'assessment': quality_metrics.get('technical_assessment', {})
                },
                'color_analysis': {
                    'dominant_colors': color_analysis.get('dominant_colors', [])[:5],  # Top 5 colors
                    'color_harmony': color_analysis.get('color_harmony', {}),
                    'palette_richness': len(color_analysis.get('dominant_colors', []))
                },
                'content_analysis': {
                    'objects_detected': len(objects),
                    'faces_detected': len(faces),
                    'primary_objects': [obj['name'] for obj in objects[:5]],
                    'image_classification': technical_metrics.get('image_classification', {})
                },
                'composition': technical_metrics.get('low_level_features', {}).get('spatial_features', {})
            }
            
        except Exception as e:
            return {'error': f'Technical formatting failed: {str(e)}'}
    
    def _format_ai_insights(self, ai_analysis):
        """Format AI insights for better presentation"""
        
        if not ai_analysis or 'error' in ai_analysis:
            return {
                'status': 'fallback',
                'message': 'Advanced AI analysis not available, using technical analysis',
                'error': ai_analysis.get('error', 'Unknown error')
            }
        
        try:
            comprehensive = ai_analysis.get('comprehensive_analysis', {})
            framework_analyses = ai_analysis.get('framework_analyses', {})
            
            # Extract successful framework analyses
            successful_frameworks = {}
            for framework, analysis in framework_analyses.items():
                if 'error' not in analysis and 'analysis' in analysis:
                    successful_frameworks[framework] = {
                        'analysis': analysis['analysis'][:500] + '...' if len(analysis['analysis']) > 500 else analysis['analysis'],
                        'expert_role': analysis.get('expert_role', 'Unknown'),
                        'confidence': analysis.get('confidence', 'Medium')
                    }
            
            return {
                'status': 'success',
                'comprehensive_analysis': comprehensive.get('comprehensive_analysis', ''),
                'analysis_quality': ai_analysis.get('analysis_quality', 'professional'),
                'confidence_score': ai_analysis.get('confidence_score', 0),
                'frameworks_used': list(successful_frameworks.keys()),
                'expert_insights': successful_frameworks,
                'synthesis_info': {
                    'model_used': comprehensive.get('model_used', 'Unknown'),
                    'frameworks_count': len(successful_frameworks),
                    'synthesis_quality': comprehensive.get('synthesis_quality', 'Unknown')
                }
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'AI insights formatting failed: {str(e)}',
                'raw_data': ai_analysis
            }

class ResponseBuilder:
    def __init__(self):
        self.cors_headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        }
    
    def success_response(self, data):
        """Create successful response"""
        return {
            'statusCode': 200,
            'headers': self.cors_headers,
            'body': json.dumps(data, indent=2, ensure_ascii=False)
        }
    
    def error_response(self, status_code, message):
        """Create error response"""
        return {
            'statusCode': status_code,
            'headers': self.cors_headers,
            'body': json.dumps({
                'error': message,
                'timestamp': datetime.now().isoformat()
            }, ensure_ascii=False)
        }
    
    def cors_response(self):
        """Create CORS preflight response"""
        return {
            'statusCode': 200,
            'headers': self.cors_headers,
            'body': json.dumps({'message': 'CORS preflight successful'})
        }
