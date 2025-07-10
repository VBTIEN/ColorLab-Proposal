"""
Advanced AI Color Analyzer with OpenCV and K-Means Clustering
- Real pixel-based analysis using OpenCV
- K-Means clustering for accurate dominant colors
- Dynamic color count based on image complexity
- Multiple color space analysis (RGB, HSV, LAB)
"""
import json
import os
import boto3
import base64
import uuid
import io
from datetime import datetime
from collections import Counter
import colorsys
import numpy as np

# Try to import OpenCV and related libraries
try:
    import cv2
    from sklearn.cluster import KMeans
    OPENCV_AVAILABLE = True
    print("✅ OpenCV and scikit-learn available - Advanced color analysis enabled")
except ImportError:
    OPENCV_AVAILABLE = False
    print("⚠️ OpenCV not available - Using fallback analysis")

def lambda_handler(event, context):
    """Advanced AI-powered Lambda handler with OpenCV"""
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
    
    try:
        method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        print(f"🎨 Advanced Color AI Request: {method} {path}")
        
        if method == 'OPTIONS':
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'message': 'CORS OK'})}
        
        if path == '/' or path == '':
            return handle_root(headers)
        elif path == '/health' or path.endswith('/health'):
            return handle_health(headers)
        elif 'analyze' in path:
            return handle_advanced_color_analysis(event, headers)
        else:
            return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

def handle_root(headers):
    """Root endpoint"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            "success": True,
            "message": "🎨 Advanced AI Color Analyzer with OpenCV",
            "version": "6.0.0-opencv-kmeans",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "technology": "OpenCV + K-Means Clustering + Multiple Color Spaces",
            "features": [
                "OpenCV real pixel analysis",
                "K-Means clustering for dominant colors", 
                "Dynamic color count based on image complexity",
                "RGB, HSV, LAB color space analysis",
                "Amazon Bedrock AI insights",
                "Professional color harmony analysis"
            ],
            "opencv_available": OPENCV_AVAILABLE
        })
    }

def handle_health(headers):
    """Health check"""
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            "success": True,
            "status": "healthy",
            "version": "6.0.0-opencv-kmeans",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "technology": "Advanced Color Analysis",
            "opencv_available": OPENCV_AVAILABLE,
            "clustering": "K-Means available" if OPENCV_AVAILABLE else "Fallback clustering",
            "color_spaces": ["RGB", "HSV", "LAB"] if OPENCV_AVAILABLE else ["RGB"]
        })
    }

def handle_advanced_color_analysis(event, headers):
    """Handle advanced color analysis with OpenCV"""
    try:
        # Parse request
        if event.get('body'):
            body = base64.b64decode(event['body']).decode('utf-8') if event.get('isBase64Encoded') else event['body']
            request_data = json.loads(body)
        else:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Body required'})}
        
        if 'image_data' not in request_data:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'image_data required'})}
        
        # Decode image
        image_bytes = base64.b64decode(request_data['image_data'])
        
        print(f"🎨 Starting advanced color analysis for {len(image_bytes)} bytes")
        
        # Perform advanced color analysis
        color_analysis = perform_opencv_color_analysis(image_bytes)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'analysis': color_analysis,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'version': '6.0.0-opencv-kmeans',
                'technology': 'OpenCV + K-Means'
            })
        }
        
    except Exception as e:
        print(f"❌ Advanced color analysis error: {str(e)}")
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

def perform_opencv_color_analysis(image_bytes):
    """Perform advanced color analysis using OpenCV and K-Means"""
    try:
        print("🎨 Starting OpenCV + K-Means color analysis...")
        
        if OPENCV_AVAILABLE:
            # Use OpenCV for real analysis
            color_data = analyze_with_opencv_kmeans(image_bytes)
        else:
            # Fallback to enhanced analysis
            color_data = analyze_with_enhanced_fallback(image_bytes)
        
        # AI analysis of the extracted colors
        ai_insights = analyze_colors_with_bedrock_advanced(color_data)
        
        # Calculate accurate total colors
        total_colors = calculate_opencv_total_colors(image_bytes) if OPENCV_AVAILABLE else estimate_total_colors(image_bytes)
        
        return {
            "dominant_colors": color_data['dominant_colors'],
            "total_colors": total_colors,
            "dominant_colors_count": len(color_data['dominant_colors']),
            "color_distribution": color_data['color_distribution'],
            "color_harmony": color_data.get('color_harmony', {}),
            "ai_color_insights": ai_insights,
            "analysis_method": "OpenCV + K-Means Clustering" if OPENCV_AVAILABLE else "Enhanced Fallback Analysis",
            "color_spaces_analyzed": ["RGB", "HSV", "LAB"] if OPENCV_AVAILABLE else ["RGB"],
            "clustering_algorithm": "K-Means" if OPENCV_AVAILABLE else "Enhanced Sampling",
            "color_accuracy": "high" if OPENCV_AVAILABLE else "medium",
            "opencv_powered": OPENCV_AVAILABLE
        }
        
    except Exception as e:
        print(f"❌ OpenCV color analysis failed: {str(e)}")
        return create_advanced_fallback()

def analyze_with_opencv_kmeans(image_bytes):
    """Advanced color analysis using OpenCV and K-Means"""
    try:
        print("🔬 Using OpenCV + K-Means for color analysis...")
        
        # Convert bytes to OpenCV image
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Could not decode image")
        
        # Convert BGR to RGB (OpenCV uses BGR by default)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Get image dimensions
        height, width, channels = image_rgb.shape
        total_pixels = height * width
        
        print(f"📊 Image dimensions: {width}x{height} ({total_pixels:,} pixels)")
        
        # Resize image if too large for faster processing
        max_pixels = 300000  # 300K pixels max
        if total_pixels > max_pixels:
            scale = np.sqrt(max_pixels / total_pixels)
            new_width = int(width * scale)
            new_height = int(height * scale)
            image_rgb = cv2.resize(image_rgb, (new_width, new_height))
            print(f"📏 Resized to: {new_width}x{new_height}")
        
        # Reshape image to be a list of pixels
        pixels = image_rgb.reshape(-1, 3)
        
        # Determine optimal number of clusters dynamically
        optimal_k = determine_optimal_clusters(pixels)
        print(f"🎯 Optimal clusters determined: {optimal_k}")
        
        # Apply K-Means clustering
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get cluster centers (dominant colors)
        colors = kmeans.cluster_centers_.astype(int)
        labels = kmeans.labels_
        
        # Calculate color percentages
        label_counts = Counter(labels)
        total_pixels_processed = len(pixels)
        
        dominant_colors = []
        
        for i, color in enumerate(colors):
            count = label_counts[i]
            percentage = (count / total_pixels_processed) * 100
            
            r, g, b = color
            
            # Generate comprehensive color info
            color_info = {
                "color": get_intelligent_color_name(r, g, b),
                "hex": f"#{r:02x}{g:02x}{b:02x}",
                "rgb": [int(r), int(g), int(b)],
                "percentage": round(percentage, 2),
                "pixel_count": count,
                "temperature": analyze_color_temperature(r, g, b),
                "brightness": analyze_brightness_level(r, g, b),
                "saturation": analyze_saturation_level(r, g, b),
                "hsv": convert_rgb_to_hsv(r, g, b),
                "lab": convert_rgb_to_lab(r, g, b, image_rgb),
                "color_harmony_role": determine_harmony_role(r, g, b, colors)
            }
            
            dominant_colors.append(color_info)
        
        # Sort by percentage (descending)
        dominant_colors.sort(key=lambda x: x['percentage'], reverse=True)
        
        # Analyze color distribution
        color_distribution = analyze_advanced_color_distribution(dominant_colors)
        
        # Analyze color harmony
        color_harmony = analyze_color_harmony_advanced(dominant_colors)
        
        print(f"✅ OpenCV analysis completed: {len(dominant_colors)} colors extracted")
        
        return {
            "dominant_colors": dominant_colors,
            "color_distribution": color_distribution,
            "color_harmony": color_harmony,
            "analysis_method": "OpenCV + K-Means Clustering",
            "clusters_used": optimal_k,
            "total_pixels_analyzed": total_pixels_processed
        }
        
    except Exception as e:
        print(f"❌ OpenCV analysis error: {str(e)}")
        return analyze_with_enhanced_fallback(image_bytes)

def determine_optimal_clusters(pixels):
    """Determine optimal number of clusters using elbow method"""
    try:
        # Sample pixels for faster computation
        sample_size = min(10000, len(pixels))
        sample_pixels = pixels[np.random.choice(len(pixels), sample_size, replace=False)]
        
        # Test different cluster numbers
        max_k = min(15, sample_size // 100)  # Don't exceed reasonable limits
        min_k = 3
        
        if max_k <= min_k:
            return 5  # Default fallback
        
        inertias = []
        k_range = range(min_k, max_k + 1)
        
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=3)
            kmeans.fit(sample_pixels)
            inertias.append(kmeans.inertia_)
        
        # Simple elbow detection
        if len(inertias) >= 3:
            # Find the point where improvement starts to diminish
            improvements = []
            for i in range(1, len(inertias)):
                improvement = inertias[i-1] - inertias[i]
                improvements.append(improvement)
            
            # Find where improvement drops significantly
            for i in range(1, len(improvements)):
                if improvements[i] < improvements[i-1] * 0.7:  # 30% drop in improvement
                    return min_k + i
        
        # Default to middle value if elbow method fails
        return min_k + (max_k - min_k) // 2
        
    except Exception as e:
        print(f"⚠️ Optimal cluster determination failed: {str(e)}")
        return 6  # Safe default

def convert_rgb_to_lab(r, g, b, image_rgb):
    """Convert RGB to LAB color space using OpenCV"""
    try:
        # Create a single pixel image
        pixel = np.uint8([[[r, g, b]]])
        lab_pixel = cv2.cvtColor(pixel, cv2.COLOR_RGB2LAB)
        l, a, b_lab = lab_pixel[0][0]
        
        return {
            "l": int(l),
            "a": int(a),
            "b": int(b_lab)
        }
    except Exception:
        return {"l": 50, "a": 0, "b": 0}  # Neutral gray fallback

def analyze_color_harmony_advanced(dominant_colors):
    """Advanced color harmony analysis"""
    try:
        if len(dominant_colors) < 2:
            return {"type": "monochromatic", "quality": "simple", "description": "Single dominant color"}
        
        # Get hues from top colors
        hues = []
        for color in dominant_colors[:6]:  # Analyze top 6 colors
            hsv = color['hsv']
            if hsv['saturation'] > 10:  # Only consider saturated colors
                hues.append(hsv['hue'])
        
        if len(hues) < 2:
            return {"type": "achromatic", "quality": "neutral", "description": "Mostly neutral colors"}
        
        # Analyze hue relationships
        harmony_analysis = analyze_hue_relationships(hues)
        
        return harmony_analysis
        
    except Exception as e:
        print(f"❌ Color harmony analysis error: {str(e)}")
        return {"type": "unknown", "quality": "analysis_failed", "description": "Could not analyze harmony"}

def analyze_hue_relationships(hues):
    """Analyze relationships between hues"""
    try:
        # Calculate hue differences
        hue_diffs = []
        for i in range(len(hues)):
            for j in range(i + 1, len(hues)):
                diff = abs(hues[i] - hues[j])
                # Handle circular nature of hue
                diff = min(diff, 360 - diff)
                hue_diffs.append(diff)
        
        if not hue_diffs:
            return {"type": "monochromatic", "quality": "simple"}
        
        avg_diff = sum(hue_diffs) / len(hue_diffs)
        min_diff = min(hue_diffs)
        max_diff = max(hue_diffs)
        
        # Determine harmony type
        if avg_diff < 30:
            harmony_type = "analogous"
            quality = "harmonious"
            description = "Colors are adjacent on the color wheel, creating harmony"
        elif any(abs(diff - 180) < 15 for diff in hue_diffs):
            harmony_type = "complementary"
            quality = "high_contrast"
            description = "Colors are opposite on the color wheel, creating strong contrast"
        elif any(abs(diff - 120) < 20 for diff in hue_diffs):
            harmony_type = "triadic"
            quality = "balanced"
            description = "Colors are evenly spaced on the color wheel"
        elif any(abs(diff - 90) < 15 for diff in hue_diffs):
            harmony_type = "tetradic"
            quality = "complex"
            description = "Colors form a square or rectangle on the color wheel"
        elif avg_diff > 60:
            harmony_type = "polychromatic"
            quality = "vibrant"
            description = "Multiple diverse colors creating a vibrant palette"
        else:
            harmony_type = "mixed"
            quality = "moderate"
            description = "Mixed color relationships with moderate contrast"
        
        return {
            "type": harmony_type,
            "quality": quality,
            "description": description,
            "average_hue_difference": round(avg_diff, 1),
            "contrast_level": "high" if max_diff > 120 else "medium" if max_diff > 60 else "low"
        }
        
    except Exception as e:
        print(f"❌ Hue relationship analysis error: {str(e)}")
        return {"type": "unknown", "quality": "error"}

def calculate_opencv_total_colors(image_bytes):
    """Calculate total unique colors using OpenCV"""
    try:
        # Convert bytes to OpenCV image
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return estimate_total_colors(image_bytes)
        
        # Convert to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Reshape to list of pixels
        pixels = image_rgb.reshape(-1, 3)
        
        # Get unique colors
        unique_colors = np.unique(pixels, axis=0)
        
        return len(unique_colors)
        
    except Exception as e:
        print(f"❌ OpenCV total colors calculation error: {str(e)}")
        return estimate_total_colors(image_bytes)
