"""
Advanced Color Analysis Algorithm
Extracts dominant colors from images using multiple techniques
"""
import base64
import io
from PIL import Image
import numpy as np
from collections import Counter
import colorsys
import webcolors
from typing import List, Dict, Tuple, Any

class AdvancedColorAnalyzer:
    """
    Advanced color analyzer that extracts dominant colors from images
    using K-means clustering and color quantization
    """
    
    def __init__(self):
        self.max_colors = 8
        self.min_percentage = 2.0  # Minimum percentage to include a color
        
    def analyze_image_colors(self, image_data: str) -> List[Dict[str, Any]]:
        """
        Analyze colors from base64 image data
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            List of color dictionaries with name, hex, rgb, and percentage
        """
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image for faster processing (max 300px)
            image = self._resize_image(image, max_size=300)
            
            # Extract dominant colors using multiple methods
            colors_kmeans = self._extract_colors_kmeans(image)
            colors_quantized = self._extract_colors_quantization(image)
            
            # Combine and refine results
            combined_colors = self._combine_color_results(colors_kmeans, colors_quantized)
            
            # Convert to final format with color names
            final_colors = self._format_color_results(combined_colors)
            
            return final_colors
            
        except Exception as e:
            print(f"Color analysis error: {str(e)}")
            return self._get_fallback_colors()
    
    def _resize_image(self, image: Image.Image, max_size: int = 300) -> Image.Image:
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
    
    def _extract_colors_kmeans(self, image: Image.Image, k: int = 8) -> List[Tuple[Tuple[int, int, int], float]]:
        """Extract colors using K-means clustering"""
        try:
            from sklearn.cluster import KMeans
            
            # Convert image to numpy array
            img_array = np.array(image)
            pixels = img_array.reshape(-1, 3)
            
            # Remove very dark and very light pixels (noise reduction)
            pixels = pixels[~np.all(pixels < 20, axis=1)]  # Remove very dark
            pixels = pixels[~np.all(pixels > 235, axis=1)]  # Remove very light
            
            if len(pixels) == 0:
                return []
            
            # Apply K-means clustering
            kmeans = KMeans(n_clusters=min(k, len(pixels)), random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            # Get cluster centers (dominant colors) and their frequencies
            colors = kmeans.cluster_centers_.astype(int)
            labels = kmeans.labels_
            
            # Calculate percentages
            label_counts = Counter(labels)
            total_pixels = len(labels)
            
            color_percentages = []
            for i, color in enumerate(colors):
                percentage = (label_counts[i] / total_pixels) * 100
                if percentage >= self.min_percentage:
                    color_percentages.append((tuple(color), percentage))
            
            return sorted(color_percentages, key=lambda x: x[1], reverse=True)
            
        except ImportError:
            # Fallback if sklearn is not available
            return self._extract_colors_simple(image)
        except Exception as e:
            print(f"K-means color extraction error: {str(e)}")
            return []
    
    def _extract_colors_quantization(self, image: Image.Image) -> List[Tuple[Tuple[int, int, int], float]]:
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
                if percentage >= self.min_percentage:
                    color_percentages.append((color, percentage))
            
            return sorted(color_percentages, key=lambda x: x[1], reverse=True)
            
        except Exception as e:
            print(f"Quantization color extraction error: {str(e)}")
            return []
    
    def _extract_colors_simple(self, image: Image.Image) -> List[Tuple[Tuple[int, int, int], float]]:
        """Simple color extraction fallback method"""
        try:
            # Get most common colors
            colors = image.getcolors(maxcolors=256*256*256)
            if not colors:
                return []
            
            total_pixels = sum(count for count, color in colors)
            
            # Filter and sort colors
            color_percentages = []
            for count, color in colors:
                percentage = (count / total_pixels) * 100
                if percentage >= self.min_percentage:
                    color_percentages.append((color, percentage))
            
            return sorted(color_percentages, key=lambda x: x[1], reverse=True)[:8]
            
        except Exception as e:
            print(f"Simple color extraction error: {str(e)}")
            return []
    
    def _combine_color_results(self, colors1: List, colors2: List) -> List[Tuple[Tuple[int, int, int], float]]:
        """Combine results from different color extraction methods"""
        if not colors1 and not colors2:
            return []
        
        if not colors1:
            return colors2[:self.max_colors]
        
        if not colors2:
            return colors1[:self.max_colors]
        
        # Combine and merge similar colors
        all_colors = {}
        
        # Add colors from first method
        for color, percentage in colors1:
            all_colors[color] = percentage
        
        # Add colors from second method, merging similar ones
        for color, percentage in colors2:
            merged = False
            for existing_color in list(all_colors.keys()):
                if self._colors_similar(color, existing_color, threshold=30):
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
        return sorted_colors[:self.max_colors]
    
    def _colors_similar(self, color1: Tuple[int, int, int], color2: Tuple[int, int, int], threshold: int = 30) -> bool:
        """Check if two colors are similar based on Euclidean distance"""
        distance = sum((c1 - c2) ** 2 for c1, c2 in zip(color1, color2)) ** 0.5
        return distance < threshold
    
    def _format_color_results(self, colors: List[Tuple[Tuple[int, int, int], float]]) -> List[Dict[str, Any]]:
        """Format color results with names, hex codes, and additional info"""
        formatted_colors = []
        
        for color_rgb, percentage in colors:
            try:
                # Convert to hex
                hex_code = '#{:02x}{:02x}{:02x}'.format(*color_rgb)
                
                # Get color name
                color_name = self._get_color_name(color_rgb)
                
                # Get color temperature
                temperature = self._get_color_temperature(color_rgb)
                
                # Get HSV values
                hsv = self._rgb_to_hsv(color_rgb)
                
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
                    'brightness': self._get_brightness(color_rgb)
                })
                
            except Exception as e:
                print(f"Error formatting color {color_rgb}: {str(e)}")
                continue
        
        return formatted_colors
    
    def _get_color_name(self, rgb: Tuple[int, int, int]) -> str:
        """Get the closest color name for RGB values"""
        try:
            # Try to get exact color name
            return webcolors.rgb_to_name(rgb)
        except ValueError:
            # Find closest color name
            min_distance = float('inf')
            closest_name = 'Unknown'
            
            for name in webcolors.CSS3_HEX_TO_NAMES.values():
                try:
                    name_rgb = webcolors.name_to_rgb(name)
                    distance = sum((c1 - c2) ** 2 for c1, c2 in zip(rgb, name_rgb)) ** 0.5
                    if distance < min_distance:
                        min_distance = distance
                        closest_name = name
                except ValueError:
                    continue
            
            return closest_name.replace('_', ' ').title()
    
    def _get_color_temperature(self, rgb: Tuple[int, int, int]) -> str:
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
    
    def _rgb_to_hsv(self, rgb: Tuple[int, int, int]) -> Tuple[float, float, float]:
        """Convert RGB to HSV"""
        r, g, b = [x/255.0 for x in rgb]
        h, s, v = colorsys.rgb_to_hsv(r, g, b)
        return (h * 360, s * 100, v * 100)
    
    def _get_brightness(self, rgb: Tuple[int, int, int]) -> str:
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
    
    def _get_fallback_colors(self) -> List[Dict[str, Any]]:
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

# Global instance
color_analyzer = AdvancedColorAnalyzer()
