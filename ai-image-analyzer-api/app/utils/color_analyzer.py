"""
Color Analyzer Utility
Advanced color extraction and analysis algorithms
"""

import io
import math
from typing import List, Dict, Any, Tuple
from collections import Counter
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans
import logging

logger = logging.getLogger(__name__)

class ColorAnalyzer:
    """Advanced color analysis utility"""
    
    def __init__(self):
        self.color_name_mapping = {
            # Vietnamese color names mapping
            'black': 'Đen',
            'white': 'Trắng', 
            'red': 'Đỏ',
            'green': 'Xanh lá',
            'blue': 'Xanh dương',
            'yellow': 'Vàng',
            'orange': 'Cam',
            'purple': 'Tím',
            'pink': 'Hồng',
            'brown': 'Nâu',
            'gray': 'Xám',
            'grey': 'Xám',
            'cyan': 'Xanh cyan',
            'magenta': 'Đỏ tím',
            'lime': 'Xanh chanh',
            'navy': 'Xanh navy',
            'maroon': 'Đỏ nâu',
            'olive': 'Xanh ô liu',
            'silver': 'Bạc',
            'gold': 'Vàng kim'
        }
        
        self.temperature_mapping = {
            # Color temperature classification
            'warm': ['red', 'orange', 'yellow', 'pink', 'brown', 'gold', 'maroon'],
            'cool': ['blue', 'green', 'purple', 'cyan', 'navy', 'olive'],
            'neutral': ['black', 'white', 'gray', 'grey', 'silver']
        }
    
    def extract_dominant_colors(self, image_bytes: bytes, num_colors: int = 6) -> List[Dict[str, Any]]:
        """Extract dominant colors from image using K-means clustering"""
        try:
            # Open image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize for performance (max 300px)
            max_size = 300
            if max(image.size) > max_size:
                ratio = max_size / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Convert to numpy array
            img_array = np.array(image)
            pixels = img_array.reshape(-1, 3)
            
            # Remove pure black/white noise (optional)
            pixels = self._filter_noise_pixels(pixels)
            
            # Perform K-means clustering
            kmeans = KMeans(n_clusters=min(num_colors, len(pixels)), random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            # Get cluster centers (dominant colors)
            colors = kmeans.cluster_centers_.astype(int)
            
            # Calculate color percentages
            labels = kmeans.labels_
            label_counts = Counter(labels)
            total_pixels = len(labels)
            
            # Build color information
            color_info = []
            for i, color in enumerate(colors):
                rgb = [int(c) for c in color]
                hex_code = self._rgb_to_hex(rgb)
                percentage = (label_counts[i] / total_pixels) * 100
                
                # Get color name and temperature
                color_name = self._get_color_name(rgb)
                temperature = self._get_color_temperature(color_name)
                
                color_info.append({
                    'name': color_name,
                    'hex_code': hex_code,
                    'rgb': rgb,
                    'percentage': round(percentage, 1),
                    'temperature': temperature,
                    'source': 'k_means_clustering'
                })
            
            # Sort by percentage (descending)
            color_info.sort(key=lambda x: x['percentage'], reverse=True)
            
            return color_info
            
        except Exception as e:
            logger.error(f"❌ Error extracting colors: {str(e)}")
            return self._create_fallback_colors()
    
    def enhance_with_labels(self, base_colors: List[Dict[str, Any]], rekognition_labels: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Enhance color analysis with AWS Rekognition labels"""
        try:
            # Extract color hints from labels
            color_hints = []
            
            for label in rekognition_labels:
                label_name = label['Name'].lower()
                confidence = label['Confidence']
                
                # Map labels to colors
                color_mapping = {
                    'black': ('Đen', '#000000', 'neutral'),
                    'dark': ('Đen', '#000000', 'neutral'),
                    'white': ('Trắng', '#FFFFFF', 'neutral'),
                    'light': ('Trắng', '#FFFFFF', 'neutral'),
                    'blue': ('Xanh dương', '#0066CC', 'cool'),
                    'red': ('Đỏ', '#FF0000', 'warm'),
                    'green': ('Xanh lá', '#00AA00', 'cool'),
                    'yellow': ('Vàng', '#FFFF00', 'warm'),
                    'orange': ('Cam', '#FFA500', 'warm'),
                    'purple': ('Tím', '#800080', 'cool'),
                    'violet': ('Tím', '#800080', 'cool'),
                    'brown': ('Nâu', '#8B4513', 'warm'),
                    'gray': ('Xám', '#808080', 'neutral'),
                    'grey': ('Xám', '#808080', 'neutral'),
                    'pink': ('Hồng', '#FFC0CB', 'warm'),
                    'gold': ('Vàng kim', '#FFD700', 'warm'),
                    'silver': ('Bạc', '#C0C0C0', 'neutral')
                }
                
                for color_key, (vn_name, hex_code, temp) in color_mapping.items():
                    if color_key in label_name:
                        color_hints.append({
                            'name': vn_name,
                            'hex_code': hex_code,
                            'rgb': self._hex_to_rgb(hex_code),
                            'temperature': temp,
                            'confidence': confidence,
                            'source': 'aws_rekognition'
                        })
                        break
            
            # Merge with base colors
            if color_hints:
                enhanced_colors = []
                
                # Add high-confidence Rekognition colors first
                for hint in color_hints:
                    if hint['confidence'] > 70:
                        # Calculate percentage based on confidence
                        percentage = min(hint['confidence'] / 2, 50)  # Max 50%
                        hint['percentage'] = round(percentage, 1)
                        enhanced_colors.append(hint)
                
                # Add base colors that don't conflict
                for base_color in base_colors:
                    # Check if similar color already exists
                    if not any(self._colors_similar(base_color['rgb'], ec['rgb']) for ec in enhanced_colors):
                        enhanced_colors.append(base_color)
                
                # Normalize percentages
                total_percentage = sum(color['percentage'] for color in enhanced_colors)
                if total_percentage > 0:
                    for color in enhanced_colors:
                        color['percentage'] = round((color['percentage'] / total_percentage) * 100, 1)
                
                return enhanced_colors[:6]  # Limit to 6 colors
            
            return base_colors
            
        except Exception as e:
            logger.error(f"❌ Error enhancing colors with labels: {str(e)}")
            return base_colors
    
    def analyze_temperature(self, colors: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze color temperature distribution"""
        try:
            warm_count = 0
            cool_count = 0
            neutral_count = 0
            
            warm_percentage = 0
            cool_percentage = 0
            neutral_percentage = 0
            
            for color in colors:
                temp = color.get('temperature', 'neutral')
                percentage = color.get('percentage', 0)
                
                if temp == 'warm':
                    warm_count += 1
                    warm_percentage += percentage
                elif temp == 'cool':
                    cool_count += 1
                    cool_percentage += percentage
                else:
                    neutral_count += 1
                    neutral_percentage += percentage
            
            # Calculate overall temperature
            total_temp_colors = warm_count + cool_count
            if total_temp_colors == 0:
                overall_temperature = 'neutral'
                temperature_score = 0.0
            else:
                # Score from -1 (very cool) to +1 (very warm)
                warm_weight = warm_percentage / 100.0
                cool_weight = cool_percentage / 100.0
                temperature_score = warm_weight - cool_weight
                
                if temperature_score > 0.2:
                    overall_temperature = 'warm'
                elif temperature_score < -0.2:
                    overall_temperature = 'cool'
                else:
                    overall_temperature = 'neutral'
            
            # Generate description
            descriptions = {
                'warm': 'Ấm áp - tạo cảm giác gần gũi, năng động và thân thiện',
                'cool': 'Lạnh - tạo cảm giác tĩnh lặng, chuyên nghiệp và tin cậy',
                'neutral': 'Trung tính - cân bằng giữa ấm và lạnh, tạo cảm giác ổn định'
            }
            
            # Calculate balance ratio
            total_colors = warm_count + cool_count + neutral_count
            temperature_balance = warm_count / total_colors if total_colors > 0 else 0.5
            
            return {
                'overall_temperature': overall_temperature,
                'temperature_score': round(temperature_score, 2),
                'description': descriptions[overall_temperature],
                'warm_colors': warm_count,
                'cool_colors': cool_count,
                'neutral_colors': neutral_count,
                'temperature_balance': round(temperature_balance, 2),
                'warm_percentage': round(warm_percentage, 1),
                'cool_percentage': round(cool_percentage, 1),
                'neutral_percentage': round(neutral_percentage, 1)
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing temperature: {str(e)}")
            return self._create_fallback_temperature()
    
    # Private helper methods
    def _filter_noise_pixels(self, pixels: np.ndarray) -> np.ndarray:
        """Filter out noise pixels (pure black/white)"""
        # Remove pure black and pure white pixels (often noise)
        mask = ~((pixels == [0, 0, 0]).all(axis=1) | (pixels == [255, 255, 255]).all(axis=1))
        filtered_pixels = pixels[mask]
        
        # If too many pixels filtered, return original
        if len(filtered_pixels) < len(pixels) * 0.1:
            return pixels
        
        return filtered_pixels
    
    def _rgb_to_hex(self, rgb: List[int]) -> str:
        """Convert RGB to hex color code"""
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}".upper()
    
    def _hex_to_rgb(self, hex_code: str) -> List[int]:
        """Convert hex to RGB"""
        hex_code = hex_code.lstrip('#')
        return [int(hex_code[i:i+2], 16) for i in (0, 2, 4)]
    
    def _get_color_name(self, rgb: List[int]) -> str:
        """Get Vietnamese color name from RGB"""
        # Convert RGB to HSV for better color classification
        r, g, b = [x/255.0 for x in rgb]
        
        # Calculate luminance
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        
        # Check for grayscale
        if max(rgb) - min(rgb) < 30:  # Low saturation
            if luminance > 0.9:
                return 'Trắng'
            elif luminance < 0.1:
                return 'Đen'
            elif luminance > 0.7:
                return 'Xám nhạt'
            elif luminance < 0.3:
                return 'Xám đậm'
            else:
                return 'Xám'
        
        # Calculate hue
        max_val = max(r, g, b)
        min_val = min(r, g, b)
        diff = max_val - min_val
        
        if diff == 0:
            return 'Xám'
        
        if max_val == r:
            hue = (60 * ((g - b) / diff) + 360) % 360
        elif max_val == g:
            hue = (60 * ((b - r) / diff) + 120) % 360
        else:
            hue = (60 * ((r - g) / diff) + 240) % 360
        
        # Map hue to color names
        if hue < 15 or hue >= 345:
            return 'Đỏ'
        elif hue < 45:
            return 'Cam'
        elif hue < 75:
            return 'Vàng'
        elif hue < 150:
            return 'Xanh lá'
        elif hue < 210:
            return 'Xanh dương'
        elif hue < 270:
            return 'Tím'
        elif hue < 330:
            return 'Hồng'
        else:
            return 'Đỏ'
    
    def _get_color_temperature(self, color_name: str) -> str:
        """Get color temperature classification"""
        color_lower = color_name.lower()
        
        # Check warm colors
        warm_keywords = ['đỏ', 'cam', 'vàng', 'hồng', 'nâu', 'red', 'orange', 'yellow', 'pink', 'brown']
        if any(keyword in color_lower for keyword in warm_keywords):
            return 'warm'
        
        # Check cool colors
        cool_keywords = ['xanh', 'tím', 'blue', 'green', 'purple', 'cyan']
        if any(keyword in color_lower for keyword in cool_keywords):
            return 'cool'
        
        # Default to neutral
        return 'neutral'
    
    def _colors_similar(self, rgb1: List[int], rgb2: List[int], threshold: int = 50) -> bool:
        """Check if two colors are similar"""
        distance = math.sqrt(sum((a - b) ** 2 for a, b in zip(rgb1, rgb2)))
        return distance < threshold
    
    def _create_fallback_colors(self) -> List[Dict[str, Any]]:
        """Create fallback colors when analysis fails"""
        return [
            {
                'name': 'Xám',
                'hex_code': '#808080',
                'rgb': [128, 128, 128],
                'percentage': 50.0,
                'temperature': 'neutral',
                'source': 'fallback'
            },
            {
                'name': 'Trắng',
                'hex_code': '#FFFFFF',
                'rgb': [255, 255, 255],
                'percentage': 30.0,
                'temperature': 'neutral',
                'source': 'fallback'
            },
            {
                'name': 'Đen',
                'hex_code': '#000000',
                'rgb': [0, 0, 0],
                'percentage': 20.0,
                'temperature': 'neutral',
                'source': 'fallback'
            }
        ]
    
    def _create_fallback_temperature(self) -> Dict[str, Any]:
        """Create fallback temperature analysis"""
        return {
            'overall_temperature': 'neutral',
            'temperature_score': 0.0,
            'description': 'Trung tính - cân bằng cơ bản',
            'warm_colors': 0,
            'cool_colors': 0,
            'neutral_colors': 3,
            'temperature_balance': 0.5,
            'warm_percentage': 0.0,
            'cool_percentage': 0.0,
            'neutral_percentage': 100.0
        }
