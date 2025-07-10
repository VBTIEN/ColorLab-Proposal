"""
AI Image Analyzer - RESTful API v12.0
Cấu trúc lại theo chuẩn RESTful API với endpoints rõ ràng
"""
import json
import boto3
import base64
import uuid
from datetime import datetime
import traceback
import io
import math
from collections import Counter
from botocore.exceptions import ClientError

# Initialize AWS clients
s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')

def lambda_handler(event, context):
    """Main RESTful API handler"""
    
    # CORS headers for all responses
    cors_headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
    
    try:
        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return create_response(200, {'message': 'CORS preflight successful'}, cors_headers)
        
        # Parse request
        http_method = event.get('httpMethod', 'GET')
        resource_path = event.get('resource', '/')
        path_parameters = event.get('pathParameters') or {}
        query_parameters = event.get('queryStringParameters') or {}
        
        print(f"🌐 RESTful API Request: {http_method} {resource_path}")
        print(f"📋 Path Params: {path_parameters}")
        print(f"🔍 Query Params: {query_parameters}")
        
        # Route to appropriate handler
        response_data = route_request(http_method, resource_path, path_parameters, query_parameters, event)
        
        return create_response(200, response_data, cors_headers)
        
    except Exception as e:
        print(f"❌ RESTful API Error: {str(e)}")
        print(f"🔍 Traceback: {traceback.format_exc()}")
        
        error_response = {
            'success': False,
            'error': 'Internal Server Error',
            'message': str(e),
            'timestamp': datetime.now().isoformat()
        }
        
        return create_response(500, error_response, cors_headers)

def route_request(method, resource, path_params, query_params, event):
    """Route requests to appropriate handlers based on RESTful patterns"""
    
    # API Routes
    routes = {
        # Health Check
        ('GET', '/'): handle_health_check,
        ('GET', '/health'): handle_health_check,
        
        # Images Collection
        ('POST', '/images'): handle_create_image_analysis,
        ('GET', '/images'): handle_list_images,
        
        # Individual Image Resource
        ('GET', '/images/{id}'): handle_get_image,
        ('PUT', '/images/{id}'): handle_update_image,
        ('DELETE', '/images/{id}'): handle_delete_image,
        
        # Image Analysis Sub-resources
        ('GET', '/images/{id}/colors'): handle_get_image_colors,
        ('GET', '/images/{id}/harmony'): handle_get_image_harmony,
        ('GET', '/images/{id}/temperature'): handle_get_image_temperature,
        ('GET', '/images/{id}/mood'): handle_get_image_mood,
        ('GET', '/images/{id}/recommendations'): handle_get_image_recommendations,
        
        # Analysis Collection (for batch processing)
        ('POST', '/analysis'): handle_batch_analysis,
        ('GET', '/analysis'): handle_list_analysis,
        ('GET', '/analysis/{id}'): handle_get_analysis,
        
        # Legacy endpoint for backward compatibility
        ('POST', '/analyze'): handle_legacy_analyze,
    }
    
    # Find matching route
    route_key = (method, resource)
    
    if route_key in routes:
        return routes[route_key](path_params, query_params, event)
    
    # Try pattern matching for parameterized routes
    for (route_method, route_pattern), handler in routes.items():
        if method == route_method and matches_pattern(resource, route_pattern):
            # Extract path parameters
            extracted_params = extract_path_params(resource, route_pattern)
            path_params.update(extracted_params)
            return handler(path_params, query_params, event)
    
    # Route not found
    raise Exception(f"Route not found: {method} {resource}")

def matches_pattern(path, pattern):
    """Check if path matches pattern with parameters"""
    path_parts = path.strip('/').split('/')
    pattern_parts = pattern.strip('/').split('/')
    
    if len(path_parts) != len(pattern_parts):
        return False
    
    for path_part, pattern_part in zip(path_parts, pattern_parts):
        if not pattern_part.startswith('{') and path_part != pattern_part:
            return False
    
    return True

def extract_path_params(path, pattern):
    """Extract parameters from path based on pattern"""
    path_parts = path.strip('/').split('/')
    pattern_parts = pattern.strip('/').split('/')
    
    params = {}
    for path_part, pattern_part in zip(path_parts, pattern_parts):
        if pattern_part.startswith('{') and pattern_part.endswith('}'):
            param_name = pattern_part[1:-1]
            params[param_name] = path_part
    
    return params

def create_response(status_code, data, headers):
    """Create standardized API response"""
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps(data, ensure_ascii=False, indent=2)
    }

# =============================================================================
# ROUTE HANDLERS
# =============================================================================

def handle_health_check(path_params, query_params, event):
    """GET / or GET /health - API health check"""
    return {
        'success': True,
        'service': 'AI Image Analyzer RESTful API',
        'version': 'v12.0',
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'POST /images': 'Create new image analysis',
            'GET /images': 'List all images',
            'GET /images/{id}': 'Get specific image',
            'GET /images/{id}/colors': 'Get image color analysis',
            'GET /images/{id}/harmony': 'Get color harmony analysis',
            'GET /images/{id}/temperature': 'Get color temperature analysis',
            'GET /images/{id}/mood': 'Get mood analysis',
            'GET /images/{id}/recommendations': 'Get recommendations',
            'POST /analysis': 'Batch analysis',
            'GET /analysis': 'List analysis results',
            'POST /analyze': 'Legacy endpoint (deprecated)'
        }
    }

def handle_create_image_analysis(path_params, query_params, event):
    """POST /images - Create new image and analyze it"""
    
    try:
        # Parse request body
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        
        # Validate required fields
        if 'image_data' not in body:
            raise ValueError("Missing required field: image_data")
        
        bucket = body.get('bucket', 'image-analyzer-workshop-1751722329')
        image_data = body['image_data']
        analysis_options = body.get('options', {})
        
        # Generate unique image ID
        image_id = str(uuid.uuid4())
        
        # Decode and upload image
        image_bytes = base64.b64decode(image_data)
        
        # Create S3 key with organized structure
        current_time = datetime.now()
        folder_path = f"images/{current_time.strftime('%Y/%m/%d')}"
        image_key = f"{folder_path}/{image_id}.jpg"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket,
            Key=image_key,
            Body=image_bytes,
            ContentType='image/jpeg',
            Metadata={
                'image-id': image_id,
                'upload-time': current_time.isoformat(),
                'analysis-version': 'v12.0'
            }
        )
        
        print(f"✅ Image uploaded: s3://{bucket}/{image_key}")
        
        # Perform comprehensive analysis
        analysis_result = perform_comprehensive_analysis(bucket, image_key, image_bytes, analysis_options)
        
        # Store analysis results in S3
        analysis_key = f"analysis/{current_time.strftime('%Y/%m/%d')}/{image_id}.json"
        s3_client.put_object(
            Bucket=bucket,
            Key=analysis_key,
            Body=json.dumps(analysis_result, ensure_ascii=False, indent=2),
            ContentType='application/json'
        )
        
        # Create response
        response = {
            'success': True,
            'image': {
                'id': image_id,
                'url': f"https://{bucket}.s3.amazonaws.com/{image_key}",
                'upload_time': current_time.isoformat(),
                'size_bytes': len(image_bytes)
            },
            'analysis': analysis_result,
            'links': {
                'self': f"/images/{image_id}",
                'colors': f"/images/{image_id}/colors",
                'harmony': f"/images/{image_id}/harmony",
                'temperature': f"/images/{image_id}/temperature",
                'mood': f"/images/{image_id}/mood",
                'recommendations': f"/images/{image_id}/recommendations"
            }
        }
        
        return response
        
    except Exception as e:
        print(f"❌ Create image analysis error: {str(e)}")
        return create_error_response('CREATE_IMAGE_ERROR', str(e))

def handle_list_images(path_params, query_params, event):
    """GET /images - List all images with pagination"""
    
    try:
        # Parse query parameters
        limit = int(query_params.get('limit', 10))
        offset = int(query_params.get('offset', 0))
        date_filter = query_params.get('date')  # YYYY-MM-DD format
        
        bucket = 'image-analyzer-workshop-1751722329'
        prefix = 'images/'
        
        if date_filter:
            # Filter by date
            date_parts = date_filter.split('-')
            if len(date_parts) >= 3:
                prefix = f"images/{date_parts[0]}/{date_parts[1]}/{date_parts[2]}/"
            elif len(date_parts) >= 2:
                prefix = f"images/{date_parts[0]}/{date_parts[1]}/"
            elif len(date_parts) >= 1:
                prefix = f"images/{date_parts[0]}/"
        
        # List objects from S3
        response = s3_client.list_objects_v2(
            Bucket=bucket,
            Prefix=prefix,
            MaxKeys=limit + offset + 10  # Get extra to handle offset
        )
        
        images = []
        objects = response.get('Contents', [])
        
        # Apply offset and limit
        for obj in objects[offset:offset + limit]:
            if obj['Key'].endswith('.jpg'):
                # Extract image ID from key
                image_id = obj['Key'].split('/')[-1].replace('.jpg', '')
                
                images.append({
                    'id': image_id,
                    'url': f"https://{bucket}.s3.amazonaws.com/{obj['Key']}",
                    'upload_time': obj['LastModified'].isoformat(),
                    'size_bytes': obj['Size'],
                    'links': {
                        'self': f"/images/{image_id}",
                        'analysis': f"/images/{image_id}/colors"
                    }
                })
        
        return {
            'success': True,
            'images': images,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'total': len(objects),
                'has_more': len(objects) > offset + limit
            },
            'filters': {
                'date': date_filter
            }
        }
        
    except Exception as e:
        print(f"❌ List images error: {str(e)}")
        return create_error_response('LIST_IMAGES_ERROR', str(e))

def handle_get_image(path_params, query_params, event):
    """GET /images/{id} - Get specific image details"""
    
    try:
        image_id = path_params.get('id')
        if not image_id:
            raise ValueError("Missing image ID")
        
        bucket = 'image-analyzer-workshop-1751722329'
        
        # Try to find the image in S3
        # Search in recent dates first
        current_time = datetime.now()
        search_prefixes = [
            f"images/{current_time.strftime('%Y/%m/%d')}/{image_id}.jpg",
            f"images/{current_time.strftime('%Y/%m')}/*/image_id}.jpg"
        ]
        
        image_key = None
        image_metadata = None
        
        # Search for the image
        for i in range(7):  # Search last 7 days
            search_date = current_time - timedelta(days=i)
            potential_key = f"images/{search_date.strftime('%Y/%m/%d')}/{image_id}.jpg"
            
            try:
                response = s3_client.head_object(Bucket=bucket, Key=potential_key)
                image_key = potential_key
                image_metadata = response
                break
            except ClientError:
                continue
        
        if not image_key:
            raise ValueError(f"Image not found: {image_id}")
        
        # Get analysis if exists
        analysis_key = image_key.replace('images/', 'analysis/').replace('.jpg', '.json')
        analysis_data = None
        
        try:
            analysis_response = s3_client.get_object(Bucket=bucket, Key=analysis_key)
            analysis_data = json.loads(analysis_response['Body'].read().decode('utf-8'))
        except ClientError:
            print(f"⚠️ No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image': {
                'id': image_id,
                'url': f"https://{bucket}.s3.amazonaws.com/{image_key}",
                'upload_time': image_metadata['LastModified'].isoformat(),
                'size_bytes': image_metadata['ContentLength'],
                'content_type': image_metadata.get('ContentType', 'image/jpeg')
            },
            'analysis': analysis_data,
            'links': {
                'colors': f"/images/{image_id}/colors",
                'harmony': f"/images/{image_id}/harmony",
                'temperature': f"/images/{image_id}/temperature",
                'mood': f"/images/{image_id}/mood",
                'recommendations': f"/images/{image_id}/recommendations"
            }
        }
        
    except Exception as e:
        print(f"❌ Get image error: {str(e)}")
        return create_error_response('GET_IMAGE_ERROR', str(e))

def handle_get_image_colors(path_params, query_params, event):
    """GET /images/{id}/colors - Get color analysis for specific image"""
    
    try:
        image_id = path_params.get('id')
        analysis_data = get_analysis_data(image_id)
        
        if not analysis_data:
            raise ValueError(f"No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image_id': image_id,
            'colors': analysis_data.get('dominant_colors', []),
            'analysis_method': analysis_data.get('analysis_method'),
            'timestamp': analysis_data.get('timestamp')
        }
        
    except Exception as e:
        return create_error_response('GET_COLORS_ERROR', str(e))

def handle_get_image_harmony(path_params, query_params, event):
    """GET /images/{id}/harmony - Get harmony analysis for specific image"""
    
    try:
        image_id = path_params.get('id')
        analysis_data = get_analysis_data(image_id)
        
        if not analysis_data:
            raise ValueError(f"No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image_id': image_id,
            'harmony': analysis_data.get('color_harmony', {}),
            'timestamp': analysis_data.get('timestamp')
        }
        
    except Exception as e:
        return create_error_response('GET_HARMONY_ERROR', str(e))

def handle_get_image_temperature(path_params, query_params, event):
    """GET /images/{id}/temperature - Get temperature analysis for specific image"""
    
    try:
        image_id = path_params.get('id')
        analysis_data = get_analysis_data(image_id)
        
        if not analysis_data:
            raise ValueError(f"No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image_id': image_id,
            'temperature': analysis_data.get('color_temperature', {}),
            'timestamp': analysis_data.get('timestamp')
        }
        
    except Exception as e:
        return create_error_response('GET_TEMPERATURE_ERROR', str(e))

def handle_get_image_mood(path_params, query_params, event):
    """GET /images/{id}/mood - Get mood analysis for specific image"""
    
    try:
        image_id = path_params.get('id')
        analysis_data = get_analysis_data(image_id)
        
        if not analysis_data:
            raise ValueError(f"No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image_id': image_id,
            'mood': analysis_data.get('mood_analysis', {}),
            'timestamp': analysis_data.get('timestamp')
        }
        
    except Exception as e:
        return create_error_response('GET_MOOD_ERROR', str(e))

def handle_get_image_recommendations(path_params, query_params, event):
    """GET /images/{id}/recommendations - Get recommendations for specific image"""
    
    try:
        image_id = path_params.get('id')
        analysis_data = get_analysis_data(image_id)
        
        if not analysis_data:
            raise ValueError(f"No analysis found for image {image_id}")
        
        return {
            'success': True,
            'image_id': image_id,
            'recommendations': analysis_data.get('recommendations', []),
            'timestamp': analysis_data.get('timestamp')
        }
        
    except Exception as e:
        return create_error_response('GET_RECOMMENDATIONS_ERROR', str(e))

def handle_legacy_analyze(path_params, query_params, event):
    """POST /analyze - Legacy endpoint for backward compatibility"""
    
    print("⚠️ Using legacy endpoint /analyze - consider migrating to POST /images")
    
    # Redirect to new endpoint logic
    return handle_create_image_analysis(path_params, query_params, event)

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def get_analysis_data(image_id):
    """Get analysis data for an image from S3"""
    
    bucket = 'image-analyzer-workshop-1751722329'
    
    # Search for analysis file
    current_time = datetime.now()
    
    for i in range(7):  # Search last 7 days
        search_date = current_time - timedelta(days=i)
        analysis_key = f"analysis/{search_date.strftime('%Y/%m/%d')}/{image_id}.json"
        
        try:
            response = s3_client.get_object(Bucket=bucket, Key=analysis_key)
            return json.loads(response['Body'].read().decode('utf-8'))
        except ClientError:
            continue
    
    return None

def create_error_response(error_code, message):
    """Create standardized error response"""
    return {
        'success': False,
        'error': {
            'code': error_code,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
    }

def perform_comprehensive_analysis(bucket, image_key, image_bytes, options):
    """Perform comprehensive image analysis (reuse from v11.0)"""
    
    # Import analysis functions from v11.0
    from lambda_function_color_harmony_v11 import perform_comprehensive_color_analysis
    
    try:
        return perform_comprehensive_color_analysis(bucket, image_key, image_bytes)
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        return create_fallback_analysis()

def create_fallback_analysis():
    """Create fallback analysis when main analysis fails"""
    
    return {
        'dominant_colors': [
            {'mau': 'Xám', 'ma_hex': '#808080', 'ty_le_phan_tram': 50.0, 'rgb': [128, 128, 128], 'temperature': 'neutral'},
            {'mau': 'Trắng', 'ma_hex': '#FFFFFF', 'ty_le_phan_tram': 30.0, 'rgb': [255, 255, 255], 'temperature': 'neutral'},
            {'mau': 'Đen', 'ma_hex': '#000000', 'ty_le_phan_tram': 20.0, 'rgb': [0, 0, 0], 'temperature': 'neutral'}
        ],
        'color_harmony': {
            'primary_harmony': {'type': 'Monochromatic', 'description': 'Đơn sắc cơ bản'},
            'harmony_score': 60,
            'balance_analysis': {'balance_type': 'Balanced', 'description': 'Cân bằng cơ bản'},
            'contrast_analysis': {'contrast_level': 'Medium', 'description': 'Tương phản vừa phải'}
        },
        'color_temperature': {
            'overall_temperature': 'neutral',
            'temperature_score': 0.0,
            'description': 'Trung tính - cân bằng cơ bản',
            'warm_colors': 0,
            'cool_colors': 0,
            'neutral_colors': 3
        },
        'mood_analysis': {
            'primary_mood': 'neutral',
            'secondary_moods': ['balanced'],
            'mood_description': 'Trung tính, cân bằng',
            'emotional_impact': {'level': 'Low', 'description': 'Tác động nhẹ'}
        },
        'recommendations': [
            {'type': 'General', 'suggestion': 'Thêm màu sắc để tạo sự thú vị', 'details': 'Màu sắc hiện tại khá trung tính'}
        ],
        'analysis_method': 'RESTful API Fallback',
        'accuracy_level': 'Basic',
        'total_colors': 3,
        'timestamp': datetime.now().isoformat()
    }

# Import missing timedelta
from datetime import timedelta
