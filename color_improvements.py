# Color Improvements - Accurate Color Names & Enhanced Regional Analysis

import math
import statistics
from collections import Counter

# ===== 1. ACCURATE COLOR NAMING LIBRARY =====

# Comprehensive color database with accurate names
COLOR_DATABASE = {
    # Reds
    (255, 0, 0): "Red",
    (220, 20, 60): "Crimson",
    (178, 34, 34): "Firebrick",
    (139, 0, 0): "Dark Red",
    (255, 99, 71): "Tomato",
    (255, 69, 0): "Red Orange",
    (255, 160, 122): "Light Salmon",
    (250, 128, 114): "Salmon",
    (233, 150, 122): "Dark Salmon",
    (240, 128, 128): "Light Coral",
    (205, 92, 92): "Indian Red",
    (255, 182, 193): "Light Pink",
    (255, 192, 203): "Pink",
    (255, 20, 147): "Deep Pink",
    (199, 21, 133): "Medium Violet Red",
    
    # Oranges
    (255, 165, 0): "Orange",
    (255, 140, 0): "Dark Orange",
    (255, 127, 80): "Coral",
    (255, 218, 185): "Peach Puff",
    (255, 228, 196): "Bisque",
    (255, 222, 173): "Navajo White",
    (245, 222, 179): "Wheat",
    (222, 184, 135): "Burlywood",
    (210, 180, 140): "Tan",
    (255, 248, 220): "Cornsilk",
    
    # Yellows
    (255, 255, 0): "Yellow",
    (255, 255, 224): "Light Yellow",
    (255, 250, 205): "Lemon Chiffon",
    (250, 250, 210): "Light Goldenrod Yellow",
    (255, 239, 213): "Papaya Whip",
    (255, 228, 181): "Moccasin",
    (255, 218, 185): "Peach Puff",
    (238, 232, 170): "Pale Goldenrod",
    (240, 230, 140): "Khaki",
    (189, 183, 107): "Dark Khaki",
    (255, 215, 0): "Gold",
    (218, 165, 32): "Goldenrod",
    (184, 134, 11): "Dark Goldenrod",
    
    # Greens
    (0, 255, 0): "Lime",
    (0, 128, 0): "Green",
    (34, 139, 34): "Forest Green",
    (0, 100, 0): "Dark Green",
    (173, 255, 47): "Green Yellow",
    (127, 255, 0): "Chartreuse",
    (124, 252, 0): "Lawn Green",
    (50, 205, 50): "Lime Green",
    (152, 251, 152): "Pale Green",
    (144, 238, 144): "Light Green",
    (0, 250, 154): "Medium Spring Green",
    (0, 255, 127): "Spring Green",
    (60, 179, 113): "Medium Sea Green",
    (46, 139, 87): "Sea Green",
    (32, 178, 170): "Light Sea Green",
    (0, 139, 139): "Dark Cyan",
    
    # Blues
    (0, 0, 255): "Blue",
    (0, 0, 139): "Dark Blue",
    (0, 0, 205): "Medium Blue",
    (65, 105, 225): "Royal Blue",
    (100, 149, 237): "Cornflower Blue",
    (176, 196, 222): "Light Steel Blue",
    (176, 224, 230): "Powder Blue",
    (173, 216, 230): "Light Blue",
    (135, 206, 250): "Light Sky Blue",
    (135, 206, 235): "Sky Blue",
    (0, 191, 255): "Deep Sky Blue",
    (30, 144, 255): "Dodger Blue",
    (70, 130, 180): "Steel Blue",
    (95, 158, 160): "Cadet Blue",
    
    # Purples
    (128, 0, 128): "Purple",
    (75, 0, 130): "Indigo",
    (72, 61, 139): "Dark Slate Blue",
    (106, 90, 205): "Slate Blue",
    (123, 104, 238): "Medium Slate Blue",
    (147, 112, 219): "Medium Purple",
    (138, 43, 226): "Blue Violet",
    (148, 0, 211): "Dark Violet",
    (153, 50, 204): "Dark Orchid",
    (186, 85, 211): "Medium Orchid",
    (221, 160, 221): "Plum",
    (238, 130, 238): "Violet",
    (255, 0, 255): "Magenta",
    (218, 112, 214): "Orchid",
    (199, 21, 133): "Medium Violet Red",
    
    # Browns
    (165, 42, 42): "Brown",
    (139, 69, 19): "Saddle Brown",
    (160, 82, 45): "Sienna",
    (205, 133, 63): "Peru",
    (222, 184, 135): "Burlywood",
    (245, 245, 220): "Beige",
    (245, 222, 179): "Wheat",
    (244, 164, 96): "Sandy Brown",
    (210, 180, 140): "Tan",
    (188, 143, 143): "Rosy Brown",
    (255, 228, 196): "Bisque",
    
    # Grays
    (0, 0, 0): "Black",
    (105, 105, 105): "Dim Gray",
    (128, 128, 128): "Gray",
    (169, 169, 169): "Dark Gray",
    (192, 192, 192): "Silver",
    (211, 211, 211): "Light Gray",
    (220, 220, 220): "Gainsboro",
    (245, 245, 245): "White Smoke",
    (255, 255, 255): "White",
    
    # Special colors
    (255, 215, 0): "Gold",
    (192, 192, 192): "Silver",
    (255, 105, 180): "Hot Pink",
    (255, 20, 147): "Deep Pink",
    (0, 255, 255): "Cyan",
    (0, 255, 255): "Aqua",
    (127, 255, 212): "Aquamarine",
    (240, 255, 255): "Azure",
    (245, 255, 250): "Mint Cream",
    (240, 255, 240): "Honeydew",
}

def get_accurate_color_name(r, g, b):
    """Get accurate color name using comprehensive color database"""
    target_color = (r, g, b)
    
    # Check for exact match first
    if target_color in COLOR_DATABASE:
        return COLOR_DATABASE[target_color]
    
    # Find closest color using Euclidean distance
    min_distance = float('inf')
    closest_color_name = "Unknown"
    
    for (cr, cg, cb), name in COLOR_DATABASE.items():
        # Calculate Euclidean distance in RGB space
        distance = math.sqrt((r - cr)**2 + (g - cg)**2 + (b - cb)**2)
        
        if distance < min_distance:
            min_distance = distance
            closest_color_name = name
    
    # If distance is too large, use generic names
    if min_distance > 100:
        return get_generic_color_name(r, g, b)
    
    return closest_color_name

def get_generic_color_name(r, g, b):
    """Fallback to generic color naming"""
    # Convert to HSV for better color classification
    h, s, v = rgb_to_hsv_accurate(r, g, b)
    
    # Low saturation = grayscale
    if s < 0.1:
        if v < 0.2:
            return "Black"
        elif v < 0.4:
            return "Dark Gray"
        elif v < 0.6:
            return "Gray"
        elif v < 0.8:
            return "Light Gray"
        else:
            return "White"
    
    # Color classification based on hue
    if h < 15 or h >= 345:
        return "Red"
    elif h < 45:
        return "Orange"
    elif h < 75:
        return "Yellow"
    elif h < 150:
        return "Green"
    elif h < 210:
        return "Blue"
    elif h < 270:
        return "Purple"
    elif h < 330:
        return "Pink"
    else:
        return "Red"

def rgb_to_hsv_accurate(r, g, b):
    """Convert RGB to HSV accurately"""
    r, g, b = r/255.0, g/255.0, b/255.0
    
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    diff = max_val - min_val
    
    # Value
    v = max_val
    
    # Saturation
    if max_val == 0:
        s = 0
    else:
        s = diff / max_val
    
    # Hue
    if diff == 0:
        h = 0
    elif max_val == r:
        h = (60 * ((g - b) / diff) + 360) % 360
    elif max_val == g:
        h = (60 * ((b - r) / diff) + 120) % 360
    else:
        h = (60 * ((r - g) / diff) + 240) % 360
    
    return h, s, v

# ===== 2. ENHANCED REGIONAL ANALYSIS =====

def analyze_enhanced_regional_analysis(image_bytes, colors):
    """Enhanced regional analysis with better algorithms"""
    try:
        print("🗺️ Starting enhanced regional analysis...")
        
        # Calculate image dimensions estimation
        total_bytes = len(image_bytes)
        estimated_pixels = len(colors)
        
        # Estimate image dimensions (assuming square-ish image)
        estimated_width = int(math.sqrt(estimated_pixels))
        estimated_height = estimated_pixels // estimated_width if estimated_width > 0 else 1
        
        print(f"📐 Estimated dimensions: {estimated_width}x{estimated_height} ({estimated_pixels} pixels)")
        
        # Enhanced 3x3 grid analysis
        regions = analyze_3x3_grid_enhanced(colors, estimated_width, estimated_height)
        
        # Additional analysis: center vs edges
        center_edge_analysis = analyze_center_vs_edges(colors, estimated_width, estimated_height)
        
        # Color distribution analysis
        distribution_analysis = analyze_color_distribution(colors, regions)
        
        # Visual balance analysis
        balance_analysis = analyze_visual_balance(regions)
        
        return {
            "regions": regions,
            "center_edge_analysis": center_edge_analysis,
            "distribution_analysis": distribution_analysis,
            "balance_analysis": balance_analysis,
            "analysis_method": "enhanced_regional_analysis_v2",
            "estimated_dimensions": {
                "width": estimated_width,
                "height": estimated_height,
                "total_pixels": estimated_pixels
            },
            "total_regions": len(regions)
        }
        
    except Exception as e:
        print(f"❌ Enhanced regional analysis failed: {str(e)}")
        return {"regions": [], "error": str(e)}

def analyze_3x3_grid_enhanced(colors, width, height):
    """Enhanced 3x3 grid analysis with better pixel mapping"""
    regions = []
    region_names = [
        "Top-Left", "Top-Center", "Top-Right",
        "Middle-Left", "Center", "Middle-Right", 
        "Bottom-Left", "Bottom-Center", "Bottom-Right"
    ]
    
    # Calculate region boundaries
    region_width = width // 3
    region_height = height // 3
    
    for i, region_name in enumerate(region_names):
        # Calculate region coordinates
        row = i // 3
        col = i % 3
        
        start_x = col * region_width
        end_x = (col + 1) * region_width if col < 2 else width
        start_y = row * region_height
        end_y = (row + 1) * region_height if row < 2 else height
        
        # Extract colors from this region
        region_colors = []
        for y in range(start_y, min(end_y, height)):
            for x in range(start_x, min(end_x, width)):
                pixel_index = y * width + x
                if pixel_index < len(colors):
                    region_colors.append(colors[pixel_index])
        
        if region_colors:
            # Analyze region colors
            region_analysis = analyze_region_colors(region_colors, region_name)
            regions.append(region_analysis)
        else:
            # Fallback for empty regions
            regions.append({
                "region": region_name,
                "dominant_color": {"hex": "#808080", "rgb": {"r": 128, "g": 128, "b": 128}},
                "color_count": 0,
                "brightness": 0.5,
                "saturation": 0.5,
                "pixel_count": 0
            })
    
    return regions

def analyze_region_colors(region_colors, region_name):
    """Analyze colors within a specific region"""
    # Count color frequencies
    color_counter = Counter(region_colors)
    most_common = color_counter.most_common(5)
    
    # Get dominant color
    dominant = most_common[0] if most_common else ((128, 128, 128), 1)
    dominant_rgb = dominant[0]
    
    # Calculate region statistics
    avg_r = sum(c[0] for c in region_colors) / len(region_colors)
    avg_g = sum(c[1] for c in region_colors) / len(region_colors)
    avg_b = sum(c[2] for c in region_colors) / len(region_colors)
    
    # Calculate brightness and saturation
    brightness_values = [(r + g + b) / (3 * 255) for r, g, b in region_colors]
    avg_brightness = sum(brightness_values) / len(brightness_values)
    
    saturation_values = []
    for r, g, b in region_colors:
        max_val = max(r, g, b)
        min_val = min(r, g, b)
        if max_val > 0:
            saturation_values.append((max_val - min_val) / max_val)
        else:
            saturation_values.append(0)
    
    avg_saturation = sum(saturation_values) / len(saturation_values) if saturation_values else 0
    
    # Color diversity in region
    unique_colors = len(set(region_colors))
    color_diversity = unique_colors / len(region_colors) if region_colors else 0
    
    # Get accurate color name
    accurate_name = get_accurate_color_name(int(dominant_rgb[0]), int(dominant_rgb[1]), int(dominant_rgb[2]))
    
    return {
        "region": region_name,
        "dominant_color": {
            "hex": f"#{int(dominant_rgb[0]):02x}{int(dominant_rgb[1]):02x}{int(dominant_rgb[2]):02x}",
            "rgb": {"r": int(dominant_rgb[0]), "g": int(dominant_rgb[1]), "b": int(dominant_rgb[2])},
            "name": accurate_name,
            "percentage": round((dominant[1] / len(region_colors)) * 100, 2)
        },
        "average_color": {
            "hex": f"#{int(avg_r):02x}{int(avg_g):02x}{int(avg_b):02x}",
            "rgb": {"r": int(avg_r), "g": int(avg_g), "b": int(avg_b)},
            "name": get_accurate_color_name(int(avg_r), int(avg_g), int(avg_b))
        },
        "statistics": {
            "pixel_count": len(region_colors),
            "unique_colors": unique_colors,
            "color_diversity": round(color_diversity, 3),
            "brightness": round(avg_brightness, 3),
            "saturation": round(avg_saturation, 3)
        },
        "top_colors": [
            {
                "hex": f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}",
                "rgb": {"r": color[0], "g": color[1], "b": color[2]},
                "name": get_accurate_color_name(color[0], color[1], color[2]),
                "count": count,
                "percentage": round((count / len(region_colors)) * 100, 2)
            }
            for color, count in most_common[:3]
        ]
    }

def analyze_center_vs_edges(colors, width, height):
    """Analyze center vs edge color distribution"""
    center_colors = []
    edge_colors = []
    
    center_margin = min(width, height) // 4
    
    for y in range(height):
        for x in range(width):
            pixel_index = y * width + x
            if pixel_index < len(colors):
                # Check if pixel is in center or edge
                if (center_margin <= x < width - center_margin and 
                    center_margin <= y < height - center_margin):
                    center_colors.append(colors[pixel_index])
                else:
                    edge_colors.append(colors[pixel_index])
    
    # Analyze center colors
    center_analysis = {}
    if center_colors:
        center_counter = Counter(center_colors)
        center_dominant = center_counter.most_common(1)[0]
        center_analysis = {
            "dominant_color": {
                "hex": f"#{center_dominant[0][0]:02x}{center_dominant[0][1]:02x}{center_dominant[0][2]:02x}",
                "name": get_accurate_color_name(center_dominant[0][0], center_dominant[0][1], center_dominant[0][2]),
                "count": center_dominant[1]
            },
            "pixel_count": len(center_colors),
            "unique_colors": len(set(center_colors))
        }
    
    # Analyze edge colors
    edge_analysis = {}
    if edge_colors:
        edge_counter = Counter(edge_colors)
        edge_dominant = edge_counter.most_common(1)[0]
        edge_analysis = {
            "dominant_color": {
                "hex": f"#{edge_dominant[0][0]:02x}{edge_dominant[0][1]:02x}{edge_dominant[0][2]:02x}",
                "name": get_accurate_color_name(edge_dominant[0][0], edge_dominant[0][1], edge_dominant[0][2]),
                "count": edge_dominant[1]
            },
            "pixel_count": len(edge_colors),
            "unique_colors": len(set(edge_colors))
        }
    
    return {
        "center": center_analysis,
        "edges": edge_analysis,
        "center_edge_contrast": calculate_color_contrast(
            center_analysis.get("dominant_color", {}).get("hex", "#808080"),
            edge_analysis.get("dominant_color", {}).get("hex", "#808080")
        )
    }

def analyze_color_distribution(colors, regions):
    """Analyze overall color distribution across regions"""
    # Calculate color variance across regions
    region_brightnesses = [region.get("statistics", {}).get("brightness", 0.5) for region in regions]
    region_saturations = [region.get("statistics", {}).get("saturation", 0.5) for region in regions]
    
    brightness_variance = statistics.variance(region_brightnesses) if len(region_brightnesses) > 1 else 0
    saturation_variance = statistics.variance(region_saturations) if len(region_saturations) > 1 else 0
    
    return {
        "brightness_distribution": {
            "mean": statistics.mean(region_brightnesses),
            "variance": brightness_variance,
            "uniformity": "High" if brightness_variance < 0.01 else "Medium" if brightness_variance < 0.05 else "Low"
        },
        "saturation_distribution": {
            "mean": statistics.mean(region_saturations),
            "variance": saturation_variance,
            "uniformity": "High" if saturation_variance < 0.01 else "Medium" if saturation_variance < 0.05 else "Low"
        }
    }

def analyze_visual_balance(regions):
    """Analyze visual balance across regions"""
    # Calculate weight distribution (based on brightness and saturation)
    weights = []
    for region in regions:
        stats = region.get("statistics", {})
        brightness = stats.get("brightness", 0.5)
        saturation = stats.get("saturation", 0.5)
        # Visual weight = combination of brightness and saturation
        weight = (1 - brightness) * 0.7 + saturation * 0.3
        weights.append(weight)
    
    # Analyze balance between different areas
    top_weight = sum(weights[0:3])  # Top row
    middle_weight = sum(weights[3:6])  # Middle row
    bottom_weight = sum(weights[6:9])  # Bottom row
    
    left_weight = sum([weights[0], weights[3], weights[6]])  # Left column
    center_weight = sum([weights[1], weights[4], weights[7]])  # Center column
    right_weight = sum([weights[2], weights[5], weights[8]])  # Right column
    
    return {
        "horizontal_balance": {
            "top": round(top_weight, 3),
            "middle": round(middle_weight, 3),
            "bottom": round(bottom_weight, 3),
            "balance_score": 1 - abs(top_weight - bottom_weight) / max(top_weight + bottom_weight, 0.001)
        },
        "vertical_balance": {
            "left": round(left_weight, 3),
            "center": round(center_weight, 3),
            "right": round(right_weight, 3),
            "balance_score": 1 - abs(left_weight - right_weight) / max(left_weight + right_weight, 0.001)
        },
        "overall_balance": "Excellent" if min(
            1 - abs(top_weight - bottom_weight) / max(top_weight + bottom_weight, 0.001),
            1 - abs(left_weight - right_weight) / max(left_weight + right_weight, 0.001)
        ) > 0.8 else "Good" if min(
            1 - abs(top_weight - bottom_weight) / max(top_weight + bottom_weight, 0.001),
            1 - abs(left_weight - right_weight) / max(left_weight + right_weight, 0.001)
        ) > 0.6 else "Fair"
    }

def calculate_color_contrast(hex1, hex2):
    """Calculate contrast between two colors"""
    try:
        # Convert hex to RGB
        r1, g1, b1 = int(hex1[1:3], 16), int(hex1[3:5], 16), int(hex1[5:7], 16)
        r2, g2, b2 = int(hex2[1:3], 16), int(hex2[3:5], 16), int(hex2[5:7], 16)
        
        # Calculate luminance
        def luminance(r, g, b):
            r, g, b = r/255.0, g/255.0, b/255.0
            r = r/12.92 if r <= 0.03928 else ((r + 0.055)/1.055) ** 2.4
            g = g/12.92 if g <= 0.03928 else ((g + 0.055)/1.055) ** 2.4
            b = b/12.92 if b <= 0.03928 else ((b + 0.055)/1.055) ** 2.4
            return 0.2126 * r + 0.7152 * g + 0.0722 * b
        
        l1 = luminance(r1, g1, b1)
        l2 = luminance(r2, g2, b2)
        
        # Calculate contrast ratio
        contrast = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
        return round(contrast, 2)
        
    except:
        return 1.0

print("🎨 Color improvements module loaded successfully")
