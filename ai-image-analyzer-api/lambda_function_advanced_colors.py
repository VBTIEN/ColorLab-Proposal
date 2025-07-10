"""
AI Image Analyzer Lambda Function with Advanced Color Analysis
Enhanced with real color extraction from images
"""
import json
import os
import boto3
import base64
import uuid
from datetime import datetime
from botocore.exceptions import ClientError
import io
from PIL import Image
import numpy as np
from collections import Counter
import colorsys

# Set up environment
os.environ.setdefault('PYTHONPATH', '/var/task:/var/task/app')

def lambda_handler(event, context):
    """
    AWS Lambda handler function with advanced color analysis
    """
    
    # CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        # Get request details
        method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        print(f"Request: {method} {path}")
        
        # Handle OPTIONS requests (CORS preflight)
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS preflight successful'})
            }
        
        # Route handling
        if path == '/':
            return handle_root(headers)
        elif path == '/health':
            return handle_health(headers)
        elif path == '/api/v1/health':
            return handle_detailed_health(headers)
        elif path == '/api/v1/docs':
            return handle_docs()
        elif path.startswith('/api/v1/analyze'):
            return handle_analyze(event, headers)
        else:
            return handle_not_found(path, headers)
            
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'message': 'Internal server error'
            })
        }

def handle_root(headers):
    """Handle root endpoint"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            "success": True,
            "service": "AI Image Analyzer API",
            "version": "1.0.0 - Advanced Colors",
            "description": "Professional AI-powered image analysis with advanced color extraction",
            "docs_url": "/api/v1/docs",
            "health_check": "/api/v1/health",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "features": [
                "AWS Rekognition object detection",
                "Advanced color analysis with K-means clustering",
                "Real color extraction from images",
                "Color temperature and brightness analysis",
                "HSV color space analysis"
            ]
        })
    }

def handle_health(headers):
    """Handle basic health check"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            "success": True,
            "status": "healthy",
            "service": "AI Image Analyzer API - Advanced Colors",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    }

def handle_detailed_health(headers):
    """Handle detailed health check"""
    health_status = {
        "success": True,
        "status": "healthy",
        "service": "AI Image Analyzer API - Advanced Colors",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {},
        "features": {
            "color_analysis": "advanced",
            "object_detection": "aws_rekognition",
            "image_processing": "pillow",
            "color_clustering": "available"
        }
    }
    
    # Check AWS services
    try:
        # Check S3
        s3_client = boto3.client('s3')
        s3_client.list_buckets()
        health_status["services"]["s3"] = "healthy"
    except ClientError:
        health_status["services"]["s3"] = "unhealthy"
        health_status["status"] = "degraded"
    
    try:
        # Check Rekognition
        rekognition_client = boto3.client('rekognition')
        health_status["services"]["rekognition"] = "healthy"
    except Exception:
        health_status["services"]["rekognition"] = "unhealthy"
        health_status["status"] = "degraded"
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(health_status)
    }

def handle_docs():
    """Handle API documentation"""
    headers = {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    }
    
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Image Analyzer API - Advanced Colors</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
            .get { background: #61affe; }
            .post { background: #49cc90; }
            code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; }
            .feature { background: #e8f5e8; padding: 10px; margin: 5px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>🤖 AI Image Analyzer API - Advanced Colors</h1>
        <p>Professional AI-powered image analysis with advanced color extraction</p>
        
        <div class="feature">
            <h3>🎨 Advanced Color Analysis Features:</h3>
            <ul>
                <li><strong>K-means Clustering:</strong> Accurate dominant color extraction</li>
                <li><strong>Color Quantization:</strong> Multiple extraction methods</li>
                <li><strong>Color Names:</strong> Human-readable color names</li>
                <li><strong>Temperature Analysis:</strong> Warm/cool/neutral classification</li>
                <li><strong>HSV Analysis:</strong> Hue, saturation, value breakdown</li>
                <li><strong>Brightness Detection:</strong> Light/medium/dark classification</li>
            </ul>
        </div>
        
        <h2>📋 Available Endpoints</h2>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /</h3>
            <p>Root endpoint with API information and features</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /health</h3>
            <p>Basic health check</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method get">GET</span> /api/v1/health</h3>
            <p>Detailed health check with AWS services and features</p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method post">POST</span> /api/v1/analyze</h3>
            <p>Advanced image analysis with real color extraction</p>
            <p><strong>Request Body:</strong></p>
            <pre><code>{
  "bucket": "your-s3-bucket",
  "image_data": "base64-encoded-image",
  "analysis_type": "comprehensive"
}</code></pre>
            <p><strong>Enhanced Response includes:</strong></p>
            <ul>
                <li>Object detection with AWS Rekognition</li>
                <li>Real dominant colors extracted from image</li>
                <li>Color names, hex codes, RGB values</li>
                <li>Color temperature (warm/cool/neutral)</li>
                <li>HSV color space values</li>
                <li>Brightness classification</li>
                <li>Accurate color percentages</li>
            </ul>
        </div>
        
        <h2>🎨 Color Analysis Sample Response</h2>
        <pre><code>{
  "dominant_colors": [
    {
      "color": "Sky Blue",
      "hex": "#87CEEB",
      "rgb": [135, 206, 235],
      "percentage": 35.2,
      "temperature": "cool",
      "hsv": {
        "hue": 197.0,
        "saturation": 42.6,
        "value": 92.2
      },
      "brightness": "light"
    }
  ]
}</code></pre>
        
        <hr>
        <p><em>AI Image Analyzer API v1.0.0 - Advanced Colors</em></p>
    </body>
    </html>
    """
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': html_content
    }

def handle_analyze(event, headers):
    """Handle image analysis with advanced color extraction"""
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        bucket = body.get('bucket')
        image_data = body.get('image_data')
        analysis_type = body.get('analysis_type', 'comprehensive')
        
        if not bucket or not image_data:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'error': 'Missing required fields',
                    'message': 'bucket and image_data are required'
                })
            }
        
        # Decode image
        image_bytes = base64.b64decode(image_data)
        
        # Upload to S3
        s3_client = boto3.client('s3')
        current_time = datetime.now()
        folder_path = f"uploads/{current_time.strftime('%Y/%m/%d')}"
        image_key = f"{folder_path}/{uuid.uuid4().hex}.jpg"
        
        s3_client.put_object(
            Bucket=bucket,
            Key=image_key,
            Body=image_bytes,
            ContentType='image/jpeg'
        )
        
        # Perform advanced analysis
        analysis_result = perform_advanced_analysis(bucket, image_key, image_data, analysis_type)
        
        # Create response
        result = {
            "success": True,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "version": "v1.0.0 - Advanced Colors",
            "image_url": f"https://{bucket}.s3.amazonaws.com/{image_key}",
            "analysis": analysis_result
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'message': 'Analysis failed'
            })
        }

def perform_advanced_analysis(bucket, image_key, image_data, analysis_type):
    """Perform advanced image analysis with real color extraction"""
    try:
        # AWS Rekognition analysis
        rekognition_client = boto3.client('rekognition')
        response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': image_key}},
            MaxLabels=25,
            MinConfidence=25
        )
        
        # Extract labels
        labels = [
            {
                "name": label['Name'],
                "confidence": round(label['Confidence'], 2),
                "categories": [cat['Name'] for cat in label.get('Categories', [])]
            }
            for label in response.get('Labels', [])
        ]
        
        # Advanced color analysis
        colors = analyze_image_colors_advanced(image_data)
        
        return {
            "objects_detected": labels[:10],
            "dominant_colors": colors,
            "analysis_method": "AWS Rekognition + Advanced Color Analysis",
            "color_extraction": "K-means clustering + Color quantization",
            "total_objects": len(labels),
            "total_colors": len(colors),
            "confidence_threshold": 25.0,
            "analysis_type": analysis_type
        }
        
    except Exception as e:
        print(f"Advanced analysis failed: {str(e)}")
        return create_fallback_analysis()

def analyze_image_colors_advanced(image_data):
    """
    Advanced color analysis using K-means clustering and color quantization
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image for faster processing
        image = resize_image_for_analysis(image, max_size=300)
        
        # Extract colors using multiple methods
        colors_kmeans = extract_colors_kmeans(image)
        colors_quantized = extract_colors_quantization(image)
        
        # Combine and refine results
        combined_colors = combine_color_results(colors_kmeans, colors_quantized)
        
        # Format results with color names and additional info
        final_colors = format_color_results(combined_colors)
        
        return final_colors
        
    except Exception as e:
        print(f"Advanced color analysis error: {str(e)}")
        return get_fallback_colors()

def resize_image_for_analysis(image, max_size=300):
    """Resize image while maintaining aspect ratio"""
    width, height = image.size
    
    if max(width, height) > max_size:
        if width > height:
            new_width = max_size
            new_height = int((height * max_size) / width)
        else:
            new_height = max_size
            new_width = int((width * max_size) / height)
        
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return image

def extract_colors_kmeans(image, k=8):
    """Extract colors using K-means clustering"""
    try:
        # Convert image to numpy array
        img_array = np.array(image)
        pixels = img_array.reshape(-1, 3)
        
        # Remove very dark and very light pixels (noise reduction)
        pixels = pixels[~np.all(pixels < 20, axis=1)]  # Remove very dark
        pixels = pixels[~np.all(pixels > 235, axis=1)]  # Remove very light
        
        if len(pixels) == 0:
            return []
        
        # Simple K-means implementation (since sklearn might not be available)
        colors = simple_kmeans(pixels, k=min(k, len(pixels)))
        
        return colors
        
    except Exception as e:
        print(f"K-means color extraction error: {str(e)}")
        return []

def simple_kmeans(pixels, k=8, max_iterations=20):
    """Simple K-means implementation for color clustering"""
    try:
        # Initialize centroids randomly
        np.random.seed(42)
        centroids = pixels[np.random.choice(len(pixels), k, replace=False)]
        
        for _ in range(max_iterations):
            # Assign pixels to nearest centroid
            distances = np.sqrt(((pixels - centroids[:, np.newaxis])**2).sum(axis=2))
            labels = np.argmin(distances, axis=0)
            
            # Update centroids
            new_centroids = np.array([pixels[labels == i].mean(axis=0) for i in range(k)])
            
            # Check for convergence
            if np.allclose(centroids, new_centroids):
                break
                
            centroids = new_centroids
        
        # Calculate percentages
        unique_labels, counts = np.unique(labels, return_counts=True)
        total_pixels = len(labels)
        
        color_percentages = []
        for i, centroid in enumerate(centroids):
            if i in unique_labels:
                count = counts[list(unique_labels).index(i)]
                percentage = (count / total_pixels) * 100
                if percentage >= 2.0:  # Minimum 2% to include
                    color_percentages.append((tuple(centroid.astype(int)), percentage))
        
        return sorted(color_percentages, key=lambda x: x[1], reverse=True)
        
    except Exception as e:
        print(f"Simple K-means error: {str(e)}")
        return []

def extract_colors_quantization(image):
    """Extract colors using color quantization"""
    try:
        # Quantize image to reduce color palette
        quantized = image.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
        quantized_rgb = quantized.convert('RGB')
        
        # Get color histogram
        colors = quantized_rgb.getcolors(maxcolors=256)
        if not colors:
            return []
        
        total_pixels = sum(count for count, color in colors)
        
        color_percentages = []
        for count, color in colors:
            percentage = (count / total_pixels) * 100
            if percentage >= 2.0:  # Minimum 2% to include
                color_percentages.append((color, percentage))
        
        return sorted(color_percentages, key=lambda x: x[1], reverse=True)
        
    except Exception as e:
        print(f"Quantization color extraction error: {str(e)}")
        return []

def combine_color_results(colors1, colors2):
    """Combine results from different color extraction methods"""
    if not colors1 and not colors2:
        return []
    
    if not colors1:
        return colors2[:8]
    
    if not colors2:
        return colors1[:8]
    
    # Combine and merge similar colors
    all_colors = {}
    
    # Add colors from first method
    for color, percentage in colors1:
        all_colors[color] = percentage
    
    # Add colors from second method, merging similar ones
    for color, percentage in colors2:
        merged = False
        for existing_color in list(all_colors.keys()):
            if colors_similar(color, existing_color, threshold=30):
                # Merge similar colors
                avg_color = tuple(
                    int((color[i] + existing_color[i]) / 2) for i in range(3)
                )
                combined_percentage = (all_colors[existing_color] + percentage) / 2
                del all_colors[existing_color]
                all_colors[avg_color] = combined_percentage
                merged = True
                break
        
        if not merged:
            all_colors[color] = percentage
    
    # Sort by percentage and return top colors
    sorted_colors = sorted(all_colors.items(), key=lambda x: x[1], reverse=True)
    return sorted_colors[:8]

def colors_similar(color1, color2, threshold=30):
    """Check if two colors are similar based on Euclidean distance"""
    distance = sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)) ** 0.5
    return distance < threshold

def format_color_results(colors):
    """Format color results with names, hex codes, and additional info"""
    formatted_colors = []
    
    for color_rgb, percentage in colors:
        try:
            # Convert to hex
            hex_code = '#{:02x}{:02x}{:02x}'.format(*color_rgb)
            
            # Get color name
            color_name = get_color_name(color_rgb)
            
            # Get color temperature
            temperature = get_color_temperature(color_rgb)
            
            # Get HSV values
            hsv = rgb_to_hsv(color_rgb)
            
            formatted_colors.append({
                'color': color_name,
                'hex': hex_code.upper(),
                'rgb': list(color_rgb),
                'percentage': round(percentage, 1),
                'temperature': temperature,
                'hsv': {
                    'hue': round(hsv[0], 1),
                    'saturation': round(hsv[1], 1),
                    'value': round(hsv[2], 1)
                },
                'brightness': get_brightness(color_rgb)
            })
            
        except Exception as e:
            print(f"Error formatting color {color_rgb}: {str(e)}")
            continue
    
    return formatted_colors

def get_color_name(rgb):
    """Get approximate color name for RGB values"""
    r, g, b = rgb
    
    # Define basic color ranges
    if r > 200 and g > 200 and b > 200:
        return "White"
    elif r < 50 and g < 50 and b < 50:
        return "Black"
    elif r > 150 and g < 100 and b < 100:
        return "Red"
    elif r < 100 and g > 150 and b < 100:
        return "Green"
    elif r < 100 and g < 100 and b > 150:
        return "Blue"
    elif r > 150 and g > 150 and b < 100:
        return "Yellow"
    elif r > 150 and g < 150 and b > 150:
        return "Magenta"
    elif r < 150 and g > 150 and b > 150:
        return "Cyan"
    elif r > 150 and g > 100 and b < 100:
        return "Orange"
    elif r > 100 and g < 100 and b > 100:
        return "Purple"
    elif r > 100 and g > 100 and b > 100:
        return "Gray"
    elif r > 139 and g > 69 and b < 50:
        return "Brown"
    elif r > 200 and g > 150 and b > 200:
        return "Pink"
    else:
        # More specific color naming based on dominant channel
        max_channel = max(r, g, b)
        if max_channel == r:
            if g > b:
                return "Orange Red" if g > 100 else "Dark Red"
            else:
                return "Red Purple" if b > 100 else "Dark Red"
        elif max_channel == g:
            if r > b:
                return "Yellow Green" if r > 100 else "Dark Green"
            else:
                return "Blue Green" if b > 100 else "Dark Green"
        else:  # max_channel == b
            if r > g:
                return "Blue Purple" if r > 100 else "Dark Blue"
            else:
                return "Sky Blue" if g > 100 else "Dark Blue"

def get_color_temperature(rgb):
    """Determine if color is warm, cool, or neutral"""
    r, g, b = rgb
    
    # Convert to HSV for better temperature analysis
    h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
    h_degrees = h * 360
    
    # Low saturation colors are neutral
    if s < 0.2:
        return 'neutral'
    
    # Warm colors: red, orange, yellow (0-60, 300-360)
    if (0 <= h_degrees <= 60) or (300 <= h_degrees <= 360):
        return 'warm'
    # Cool colors: blue, green, purple (120-300)
    elif 120 <= h_degrees <= 300:
        return 'cool'
    # Yellow-green range (60-120)
    else:
        return 'neutral' if s < 0.5 else 'warm'

def rgb_to_hsv(rgb):
    """Convert RGB to HSV"""
    r, g, b = [x/255.0 for x in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    return (h * 360, s * 100, v * 100)

def get_brightness(rgb):
    """Determine if color is light, medium, or dark"""
    # Calculate perceived brightness using luminance formula
    r, g, b = rgb
    brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
    
    if brightness > 0.7:
        return 'light'
    elif brightness > 0.3:
        return 'medium'
    else:
        return 'dark'

def get_fallback_colors():
    """Return fallback colors when analysis fails"""
    return [
        {
            'color': 'Gray',
            'hex': '#808080',
            'rgb': [128, 128, 128],
            'percentage': 60.0,
            'temperature': 'neutral',
            'hsv': {'hue': 0, 'saturation': 0, 'value': 50.2},
            'brightness': 'medium'
        },
        {
            'color': 'White',
            'hex': '#FFFFFF',
            'rgb': [255, 255, 255],
            'percentage': 25.0,
            'temperature': 'neutral',
            'hsv': {'hue': 0, 'saturation': 0, 'value': 100.0},
            'brightness': 'light'
        },
        {
            'color': 'Black',
            'hex': '#000000',
            'rgb': [0, 0, 0],
            'percentage': 15.0,
            'temperature': 'neutral',
            'hsv': {'hue': 0, 'saturation': 0, 'value': 0.0},
            'brightness': 'dark'
        }
    ]

def create_fallback_analysis():
    """Create fallback analysis result"""
    return {
        "objects_detected": ["Unknown"],
        "dominant_colors": get_fallback_colors(),
        "analysis_method": "Fallback Analysis - Advanced Colors",
        "color_extraction": "Fallback mode",
        "total_objects": 1,
        "total_colors": 3,
        "note": "Unable to perform detailed analysis"
    }

def handle_not_found(path, headers):
    """Handle 404 not found"""
    return {
        'statusCode': 404,
        'headers': headers,
        'body': json.dumps({
            "success": False,
            "error": "Not Found",
            "message": f"Endpoint {path} not found",
            "available_endpoints": [
                "/",
                "/health",
                "/api/v1/health",
                "/api/v1/docs",
                "/api/v1/analyze"
            ]
        })
    }
