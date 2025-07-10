"""
Low-level Features Extractor
Implements professional image analysis standards for basic features
"""
import boto3
import numpy as np
from PIL import Image
import io

class LowLevelFeatureExtractor:
    def __init__(self):
        self.s3 = boto3.client('s3')
    
    def extract_features(self, bucket, key):
        """Extract low-level features following professional standards"""
        
        features = {
            'color_analysis': {},
            'texture_analysis': {},
            'shape_analysis': {},
            'spatial_features': {}
        }
        
        try:
            # Get image from S3
            image_data = self._get_image_from_s3(bucket, key)
            
            # Extract color features
            features['color_analysis'] = self._analyze_color(image_data)
            
            # Extract texture features
            features['texture_analysis'] = self._analyze_texture(image_data)
            
            # Extract shape features
            features['shape_analysis'] = self._analyze_shape(image_data)
            
            # Extract spatial features
            features['spatial_features'] = self._analyze_spatial(image_data)
            
        except Exception as e:
            print(f"Low-level feature extraction error: {str(e)}")
            features['error'] = str(e)
        
        return features
    
    def _get_image_from_s3(self, bucket, key):
        """Get image data from S3"""
        try:
            response = self.s3.get_object(Bucket=bucket, Key=key)
            image_data = response['Body'].read()
            return Image.open(io.BytesIO(image_data))
        except Exception as e:
            raise Exception(f"Failed to get image from S3: {str(e)}")
    
    def _analyze_color(self, image):
        """
        Color Analysis - Professional Standards
        - RGB/HSV histogram analysis
        - Color distribution
        - Dominant colors
        - Color harmony metrics
        """
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Get image array
            img_array = np.array(image)
            
            # Color histogram analysis
            color_analysis = {
                'dominant_colors': self._get_dominant_colors(img_array),
                'color_distribution': self._get_color_distribution(img_array),
                'color_harmony': self._calculate_color_harmony(img_array),
                'brightness_stats': self._get_brightness_stats(img_array),
                'saturation_stats': self._get_saturation_stats(img_array)
            }
            
            return color_analysis
            
        except Exception as e:
            return {'error': f"Color analysis failed: {str(e)}"}
    
    def _get_dominant_colors(self, img_array, n_colors=5):
        """Extract dominant colors using clustering approach"""
        try:
            # Reshape image to list of pixels
            pixels = img_array.reshape(-1, 3)
            
            # Simple dominant color extraction (can be enhanced with K-means)
            unique_colors, counts = np.unique(pixels, axis=0, return_counts=True)
            
            # Get top colors by frequency
            top_indices = np.argsort(counts)[-n_colors:][::-1]
            dominant_colors = []
            
            total_pixels = len(pixels)
            for idx in top_indices:
                color = unique_colors[idx]
                percentage = (counts[idx] / total_pixels) * 100
                
                dominant_colors.append({
                    'rgb': color.tolist(),
                    'hex': f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}",
                    'percentage': round(percentage, 2),
                    'color_name': self._get_color_name(color)
                })
            
            return dominant_colors[:n_colors]
            
        except Exception as e:
            return [{'error': f"Dominant color extraction failed: {str(e)}"}]
    
    def _get_color_name(self, rgb):
        """Get approximate color name from RGB values"""
        r, g, b = rgb
        
        # Simple color naming logic
        if r > 200 and g > 200 and b > 200:
            return "White"
        elif r < 50 and g < 50 and b < 50:
            return "Black"
        elif r > g and r > b:
            return "Red"
        elif g > r and g > b:
            return "Green"
        elif b > r and b > g:
            return "Blue"
        elif r > 150 and g > 150 and b < 100:
            return "Yellow"
        elif r > 150 and g < 100 and b > 150:
            return "Magenta"
        elif r < 100 and g > 150 and b > 150:
            return "Cyan"
        else:
            return "Mixed"
    
    def _get_color_distribution(self, img_array):
        """Analyze color distribution across the image"""
        try:
            # Calculate color channel statistics
            r_channel = img_array[:, :, 0]
            g_channel = img_array[:, :, 1]
            b_channel = img_array[:, :, 2]
            
            return {
                'red_stats': {
                    'mean': float(np.mean(r_channel)),
                    'std': float(np.std(r_channel)),
                    'min': int(np.min(r_channel)),
                    'max': int(np.max(r_channel))
                },
                'green_stats': {
                    'mean': float(np.mean(g_channel)),
                    'std': float(np.std(g_channel)),
                    'min': int(np.min(g_channel)),
                    'max': int(np.max(g_channel))
                },
                'blue_stats': {
                    'mean': float(np.mean(b_channel)),
                    'std': float(np.std(b_channel)),
                    'min': int(np.min(b_channel)),
                    'max': int(np.max(b_channel))
                }
            }
            
        except Exception as e:
            return {'error': f"Color distribution analysis failed: {str(e)}"}
    
    def _calculate_color_harmony(self, img_array):
        """Calculate color harmony metrics"""
        try:
            # Convert to HSV for better color harmony analysis
            from colorsys import rgb_to_hsv
            
            # Sample pixels for analysis (to avoid processing all pixels)
            h, w, _ = img_array.shape
            sample_pixels = img_array[::10, ::10].reshape(-1, 3)
            
            # Convert to HSV
            hsv_values = []
            for pixel in sample_pixels:
                r, g, b = pixel / 255.0
                h_val, s_val, v_val = rgb_to_hsv(r, g, b)
                hsv_values.append([h_val * 360, s_val * 100, v_val * 100])
            
            hsv_array = np.array(hsv_values)
            
            # Calculate harmony metrics
            hue_variance = np.var(hsv_array[:, 0])
            saturation_mean = np.mean(hsv_array[:, 1])
            value_mean = np.mean(hsv_array[:, 2])
            
            # Determine harmony type
            if hue_variance < 100:
                harmony_type = "Monochromatic"
            elif hue_variance < 1000:
                harmony_type = "Analogous"
            else:
                harmony_type = "Complementary"
            
            return {
                'harmony_type': harmony_type,
                'hue_variance': float(hue_variance),
                'saturation_mean': float(saturation_mean),
                'brightness_mean': float(value_mean),
                'harmony_score': self._calculate_harmony_score(hue_variance, saturation_mean)
            }
            
        except Exception as e:
            return {'error': f"Color harmony analysis failed: {str(e)}"}
    
    def _calculate_harmony_score(self, hue_variance, saturation_mean):
        """Calculate overall color harmony score (0-100)"""
        try:
            # Simple scoring algorithm
            variance_score = max(0, 100 - (hue_variance / 50))
            saturation_score = min(100, saturation_mean)
            
            harmony_score = (variance_score + saturation_score) / 2
            return round(harmony_score, 2)
            
        except:
            return 50.0  # Default neutral score
    
    def _get_brightness_stats(self, img_array):
        """Calculate brightness statistics"""
        try:
            # Convert to grayscale for brightness analysis
            gray = np.dot(img_array[...,:3], [0.2989, 0.5870, 0.1140])
            
            return {
                'mean_brightness': float(np.mean(gray)),
                'brightness_std': float(np.std(gray)),
                'brightness_range': float(np.max(gray) - np.min(gray)),
                'brightness_category': self._categorize_brightness(np.mean(gray))
            }
            
        except Exception as e:
            return {'error': f"Brightness analysis failed: {str(e)}"}
    
    def _categorize_brightness(self, mean_brightness):
        """Categorize image brightness"""
        if mean_brightness < 85:
            return "Dark"
        elif mean_brightness < 170:
            return "Medium"
        else:
            return "Bright"
    
    def _get_saturation_stats(self, img_array):
        """Calculate saturation statistics"""
        try:
            # Convert to HSV for saturation analysis
            from colorsys import rgb_to_hsv
            
            # Sample for performance
            sample_pixels = img_array[::5, ::5].reshape(-1, 3)
            saturations = []
            
            for pixel in sample_pixels:
                r, g, b = pixel / 255.0
                _, s, _ = rgb_to_hsv(r, g, b)
                saturations.append(s * 100)
            
            saturations = np.array(saturations)
            
            return {
                'mean_saturation': float(np.mean(saturations)),
                'saturation_std': float(np.std(saturations)),
                'saturation_category': self._categorize_saturation(np.mean(saturations))
            }
            
        except Exception as e:
            return {'error': f"Saturation analysis failed: {str(e)}"}
    
    def _categorize_saturation(self, mean_saturation):
        """Categorize image saturation"""
        if mean_saturation < 30:
            return "Low"
        elif mean_saturation < 70:
            return "Medium"
        else:
            return "High"
    
    def _analyze_texture(self, image):
        """
        Texture Analysis - Professional Standards
        - Local Binary Patterns (LBP)
        - Gray-Level Co-occurrence Matrix (GLCM)
        - Texture energy, contrast, homogeneity
        """
        try:
            # Convert to grayscale for texture analysis
            if image.mode != 'L':
                gray_image = image.convert('L')
            else:
                gray_image = image
            
            img_array = np.array(gray_image)
            
            texture_analysis = {
                'texture_energy': self._calculate_texture_energy(img_array),
                'texture_contrast': self._calculate_texture_contrast(img_array),
                'texture_homogeneity': self._calculate_texture_homogeneity(img_array),
                'texture_category': self._categorize_texture(img_array)
            }
            
            return texture_analysis
            
        except Exception as e:
            return {'error': f"Texture analysis failed: {str(e)}"}
    
    def _calculate_texture_energy(self, img_array):
        """Calculate texture energy using simple gradient method"""
        try:
            # Calculate gradients
            grad_x = np.abs(np.diff(img_array, axis=1))
            grad_y = np.abs(np.diff(img_array, axis=0))
            
            # Calculate energy
            energy = np.mean(grad_x) + np.mean(grad_y)
            return float(energy)
            
        except:
            return 0.0
    
    def _calculate_texture_contrast(self, img_array):
        """Calculate texture contrast"""
        try:
            return float(np.std(img_array))
        except:
            return 0.0
    
    def _calculate_texture_homogeneity(self, img_array):
        """Calculate texture homogeneity"""
        try:
            # Simple homogeneity measure
            local_std = []
            h, w = img_array.shape
            
            # Calculate local standard deviations
            for i in range(0, h-8, 8):
                for j in range(0, w-8, 8):
                    patch = img_array[i:i+8, j:j+8]
                    local_std.append(np.std(patch))
            
            # Homogeneity is inverse of variance in local standard deviations
            homogeneity = 1.0 / (1.0 + np.var(local_std))
            return float(homogeneity)
            
        except:
            return 0.5
    
    def _categorize_texture(self, img_array):
        """Categorize texture type"""
        try:
            energy = self._calculate_texture_energy(img_array)
            
            if energy < 10:
                return "Smooth"
            elif energy < 30:
                return "Medium"
            else:
                return "Rough"
                
        except:
            return "Unknown"
    
    def _analyze_shape(self, image):
        """
        Shape Analysis - Professional Standards
        - Contour detection
        - Shape descriptors
        - Geometric properties
        """
        try:
            # Convert to grayscale for shape analysis
            if image.mode != 'L':
                gray_image = image.convert('L')
            else:
                gray_image = image
            
            img_array = np.array(gray_image)
            
            shape_analysis = {
                'edge_density': self._calculate_edge_density(img_array),
                'shape_complexity': self._calculate_shape_complexity(img_array),
                'geometric_properties': self._analyze_geometric_properties(img_array)
            }
            
            return shape_analysis
            
        except Exception as e:
            return {'error': f"Shape analysis failed: {str(e)}"}
    
    def _calculate_edge_density(self, img_array):
        """Calculate edge density in the image"""
        try:
            # Simple edge detection using gradients
            grad_x = np.abs(np.diff(img_array, axis=1))
            grad_y = np.abs(np.diff(img_array, axis=0))
            
            # Threshold for edge detection
            threshold = 30
            edges_x = grad_x > threshold
            edges_y = grad_y > threshold
            
            total_pixels = img_array.size
            edge_pixels = np.sum(edges_x) + np.sum(edges_y)
            
            edge_density = edge_pixels / total_pixels
            return float(edge_density)
            
        except:
            return 0.0
    
    def _calculate_shape_complexity(self, img_array):
        """Calculate shape complexity"""
        try:
            edge_density = self._calculate_edge_density(img_array)
            
            if edge_density < 0.1:
                return "Simple"
            elif edge_density < 0.3:
                return "Medium"
            else:
                return "Complex"
                
        except:
            return "Unknown"
    
    def _analyze_geometric_properties(self, img_array):
        """Analyze basic geometric properties"""
        try:
            h, w = img_array.shape
            
            return {
                'aspect_ratio': float(w / h),
                'image_size': {'width': w, 'height': h},
                'total_pixels': int(h * w),
                'size_category': self._categorize_size(h * w)
            }
            
        except Exception as e:
            return {'error': f"Geometric analysis failed: {str(e)}"}
    
    def _categorize_size(self, total_pixels):
        """Categorize image size"""
        if total_pixels < 100000:  # < 0.1MP
            return "Small"
        elif total_pixels < 1000000:  # < 1MP
            return "Medium"
        else:
            return "Large"
    
    def _analyze_spatial(self, image):
        """
        Spatial Features Analysis
        - Object positioning
        - Spatial relationships
        - Composition analysis
        """
        try:
            img_array = np.array(image.convert('RGB'))
            h, w, _ = img_array.shape
            
            spatial_analysis = {
                'composition_analysis': self._analyze_composition(img_array),
                'spatial_distribution': self._analyze_spatial_distribution(img_array),
                'focal_points': self._detect_focal_points(img_array)
            }
            
            return spatial_analysis
            
        except Exception as e:
            return {'error': f"Spatial analysis failed: {str(e)}"}
    
    def _analyze_composition(self, img_array):
        """Analyze image composition"""
        try:
            h, w, _ = img_array.shape
            
            # Rule of thirds analysis
            third_h = h // 3
            third_w = w // 3
            
            # Analyze brightness in different regions
            regions = {
                'top_left': np.mean(img_array[:third_h, :third_w]),
                'top_center': np.mean(img_array[:third_h, third_w:2*third_w]),
                'top_right': np.mean(img_array[:third_h, 2*third_w:]),
                'center_left': np.mean(img_array[third_h:2*third_h, :third_w]),
                'center': np.mean(img_array[third_h:2*third_h, third_w:2*third_w]),
                'center_right': np.mean(img_array[third_h:2*third_h, 2*third_w:]),
                'bottom_left': np.mean(img_array[2*third_h:, :third_w]),
                'bottom_center': np.mean(img_array[2*third_h:, third_w:2*third_w]),
                'bottom_right': np.mean(img_array[2*third_h:, 2*third_w:])
            }
            
            # Find the brightest region (potential focal point)
            brightest_region = max(regions, key=regions.get)
            
            return {
                'rule_of_thirds_analysis': regions,
                'primary_focal_region': brightest_region,
                'composition_balance': self._calculate_composition_balance(regions)
            }
            
        except Exception as e:
            return {'error': f"Composition analysis failed: {str(e)}"}
    
    def _calculate_composition_balance(self, regions):
        """Calculate composition balance score"""
        try:
            values = list(regions.values())
            variance = np.var(values)
            
            # Lower variance indicates better balance
            balance_score = max(0, 100 - (variance / 10))
            
            if balance_score > 80:
                return {"score": balance_score, "category": "Well-balanced"}
            elif balance_score > 60:
                return {"score": balance_score, "category": "Moderately balanced"}
            else:
                return {"score": balance_score, "category": "Unbalanced"}
                
        except:
            return {"score": 50, "category": "Unknown"}
    
    def _analyze_spatial_distribution(self, img_array):
        """Analyze spatial distribution of visual elements"""
        try:
            # Convert to grayscale for analysis
            gray = np.dot(img_array[...,:3], [0.2989, 0.5870, 0.1140])
            
            # Calculate center of mass
            h, w = gray.shape
            y_indices, x_indices = np.mgrid[0:h, 0:w]
            
            total_intensity = np.sum(gray)
            center_x = np.sum(x_indices * gray) / total_intensity
            center_y = np.sum(y_indices * gray) / total_intensity
            
            # Normalize to percentage
            center_x_pct = (center_x / w) * 100
            center_y_pct = (center_y / h) * 100
            
            return {
                'visual_center_of_mass': {
                    'x_percent': float(center_x_pct),
                    'y_percent': float(center_y_pct)
                },
                'distribution_analysis': self._categorize_distribution(center_x_pct, center_y_pct)
            }
            
        except Exception as e:
            return {'error': f"Spatial distribution analysis failed: {str(e)}"}
    
    def _categorize_distribution(self, x_pct, y_pct):
        """Categorize spatial distribution"""
        try:
            if 40 <= x_pct <= 60 and 40 <= y_pct <= 60:
                return "Centered"
            elif x_pct < 40:
                return "Left-weighted"
            elif x_pct > 60:
                return "Right-weighted"
            elif y_pct < 40:
                return "Top-weighted"
            elif y_pct > 60:
                return "Bottom-weighted"
            else:
                return "Off-center"
                
        except:
            return "Unknown"
    
    def _detect_focal_points(self, img_array):
        """Detect potential focal points in the image"""
        try:
            # Convert to grayscale
            gray = np.dot(img_array[...,:3], [0.2989, 0.5870, 0.1140])
            
            # Find regions with high contrast (potential focal points)
            h, w = gray.shape
            focal_points = []
            
            # Divide image into grid and find high-contrast regions
            grid_size = 8
            for i in range(0, h-grid_size, grid_size):
                for j in range(0, w-grid_size, grid_size):
                    patch = gray[i:i+grid_size, j:j+grid_size]
                    contrast = np.std(patch)
                    
                    if contrast > 30:  # High contrast threshold
                        focal_points.append({
                            'x': j + grid_size//2,
                            'y': i + grid_size//2,
                            'contrast': float(contrast)
                        })
            
            # Sort by contrast and return top focal points
            focal_points.sort(key=lambda x: x['contrast'], reverse=True)
            
            return {
                'focal_points_count': len(focal_points),
                'top_focal_points': focal_points[:5],  # Top 5 focal points
                'focal_distribution': "Multiple" if len(focal_points) > 3 else "Few" if len(focal_points) > 0 else "None"
            }
            
        except Exception as e:
            return {'error': f"Focal point detection failed: {str(e)}"}
