# Part 2 of Enhanced Lambda Function

def generate_enhanced_dominant_colors(colors, color_counter):
    """Generate enhanced dominant colors with accurate names"""
    try:
        print("🎨 Generating enhanced dominant colors with accurate names...")
        
        # Get most common colors
        most_common = color_counter.most_common(15)
        
        # Apply K-Means++ for better clustering
        if len(most_common) > 6:
            clustered_colors = kmeans_plus_plus([color for color, _ in most_common], k=8)
        else:
            clustered_colors = [color for color, _ in most_common]
        
        dominant_colors = []
        total_samples = len(colors)
        
        for i, color in enumerate(clustered_colors):
            r, g, b = [int(c) for c in color]
            
            # Get accurate color name
            accurate_name = get_accurate_color_name(r, g, b)
            
            # Calculate quality metrics
            quality_score = calculate_quality_score(color, clustered_colors)
            
            # Estimate percentage
            percentage = max(1.0, (100 / len(clustered_colors)))
            
            dominant_colors.append({
                "rank": i + 1,
                "hex": f"#{r:02x}{g:02x}{b:02x}",
                "rgb": {"r": r, "g": g, "b": b},
                "name": accurate_name,
                "percentage": round(percentage, 2),
                "pixel_count": max(1, total_samples // len(clustered_colors)),
                "quality_score": quality_score,
                "luminance": calculate_luminance(r, g, b),
                "saturation": calculate_saturation(r, g, b)
            })
        
        print(f"✅ Generated {len(dominant_colors)} enhanced dominant colors with accurate names")
        return dominant_colors
        
    except Exception as e:
        print(f"❌ Enhanced dominant colors failed: {str(e)}")
        return []

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
                "dominant_color": {
                    "hex": "#808080", 
                    "rgb": {"r": 128, "g": 128, "b": 128},
                    "name": "Gray"
                },
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
    
    # Get accurate color names
    dominant_name = get_accurate_color_name(int(dominant_rgb[0]), int(dominant_rgb[1]), int(dominant_rgb[2]))
    average_name = get_accurate_color_name(int(avg_r), int(avg_g), int(avg_b))
    
    return {
        "region": region_name,
        "dominant_color": {
            "hex": f"#{int(dominant_rgb[0]):02x}{int(dominant_rgb[1]):02x}{int(dominant_rgb[2]):02x}",
            "rgb": {"r": int(dominant_rgb[0]), "g": int(dominant_rgb[1]), "b": int(dominant_rgb[2])},
            "name": dominant_name,
            "percentage": round((dominant[1] / len(region_colors)) * 100, 2)
        },
        "average_color": {
            "hex": f"#{int(avg_r):02x}{int(avg_g):02x}{int(avg_b):02x}",
            "rgb": {"r": int(avg_r), "g": int(avg_g), "b": int(avg_b)},
            "name": average_name
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

# Helper functions
def kmeans_plus_plus(colors, k=6, max_iterations=20):
    """K-Means++ algorithm for better initialization"""
    try:
        if len(colors) <= k:
            return colors
        
        # K-Means++ initialization
        centers = []
        centers.append(random.choice(colors))
        
        # Choose remaining centers
        for _ in range(k - 1):
            distances = []
            for color in colors:
                min_dist = min(euclidean_distance(color, center) for center in centers)
                distances.append(min_dist ** 2)
            
            # Weighted random selection
            total_dist = sum(distances)
            if total_dist == 0:
                centers.append(random.choice(colors))
            else:
                probabilities = [d / total_dist for d in distances]
                centers.append(weighted_random_choice(colors, probabilities))
        
        return centers
        
    except Exception as e:
        print(f"❌ K-Means++ failed: {str(e)}")
        return colors[:k]

def euclidean_distance(color1, color2):
    """Calculate Euclidean distance between two colors"""
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(color1, color2)))

def weighted_random_choice(items, weights):
    """Choose item based on weights"""
    total = sum(weights)
    r = random.uniform(0, total)
    cumulative = 0
    for item, weight in zip(items, weights):
        cumulative += weight
        if r <= cumulative:
            return item
    return items[-1]

def calculate_quality_score(color, all_colors):
    """Calculate quality score for color clustering"""
    if len(all_colors) <= 1:
        return 1.0
    
    # Calculate average distance to other colors
    distances = [euclidean_distance(color, other) for other in all_colors if other != color]
    avg_distance = sum(distances) / len(distances) if distances else 0
    
    # Normalize to 0-1 range (higher is better separation)
    return min(1.0, max(0.0, avg_distance / 441.67))

def calculate_luminance(r, g, b):
    """Calculate relative luminance"""
    return 0.299 * (r / 255.0) + 0.587 * (g / 255.0) + 0.114 * (b / 255.0)

def calculate_saturation(r, g, b):
    """Calculate saturation"""
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    
    if max_val == 0:
        return 0
    
    return (max_val - min_val) / max_val

print("🎨 ColorLab enhanced functions part 2 loaded")
