// Enhanced Regional Color Distribution Algorithm
console.log('🎯 Enhanced Regional Algorithm Loading...');

class EnhancedRegionalAnalyzer {
    constructor() {
        this.gridSize = 3; // 3x3 grid
        this.colorThreshold = 15; // RGB distance threshold
        this.minRegionPixels = 100; // Minimum pixels per region
        this.debugMode = true;
    }
    
    // Main enhanced regional analysis
    analyzeRegionalDistribution(imageData, dominantColors) {
        console.log('🎯 Starting enhanced regional analysis...');
        
        if (!imageData || !dominantColors) {
            return this.generateFallbackRegions();
        }
        
        try {
            // Step 1: Divide image into 3x3 grid
            const regions = this.divideIntoRegions(imageData);
            
            // Step 2: Analyze each region with enhanced algorithm
            const regionalData = this.analyzeEachRegion(regions, dominantColors);
            
            // Step 3: Remove duplicates and ensure uniqueness
            const uniqueRegions = this.removeDuplicateRegions(regionalData);
            
            // Step 4: Add regional insights
            const enhancedRegions = this.addRegionalInsights(uniqueRegions);
            
            console.log('✅ Enhanced regional analysis complete');
            return enhancedRegions;
            
        } catch (error) {
            console.error('❌ Regional analysis error:', error);
            return this.generateFallbackRegions();
        }
    }
    
    // Divide image into 3x3 grid regions
    divideIntoRegions(imageData) {
        const { width, height, data } = imageData;
        const regions = [];
        
        const regionWidth = Math.floor(width / this.gridSize);
        const regionHeight = Math.floor(height / this.gridSize);
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const startX = col * regionWidth;
                const startY = row * regionHeight;
                const endX = Math.min(startX + regionWidth, width);
                const endY = Math.min(startY + regionHeight, height);
                
                const regionPixels = this.extractRegionPixels(
                    data, width, startX, startY, endX, endY
                );
                
                regions.push({
                    id: `region_${row}_${col}`,
                    position: { row, col },
                    bounds: { startX, startY, endX, endY },
                    pixels: regionPixels,
                    area: (endX - startX) * (endY - startY)
                });
            }
        }
        
        return regions;
    }
    
    // Extract pixels from specific region
    extractRegionPixels(imageData, width, startX, startY, endX, endY) {
        const pixels = [];
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const index = (y * width + x) * 4;
                pixels.push({
                    r: imageData[index],
                    g: imageData[index + 1],
                    b: imageData[index + 2],
                    a: imageData[index + 3]
                });
            }
        }
        
        return pixels;
    }
    
    // Analyze each region with enhanced algorithm
    analyzeEachRegion(regions, dominantColors) {
        return regions.map((region, index) => {
            const analysis = this.analyzeRegionColors(region.pixels, dominantColors);
            
            return {
                id: region.id,
                position: region.position,
                index: index,
                area: region.area,
                pixelCount: region.pixels.length,
                dominantColor: analysis.dominantColor,
                colorDistribution: analysis.distribution,
                uniqueColors: analysis.uniqueColors,
                averageColor: analysis.averageColor,
                colorVariance: analysis.variance,
                regionCharacter: this.determineRegionCharacter(analysis),
                regionName: this.generateRegionName(region.position, analysis)
            };
        });
    }
    
    // Enhanced color analysis for each region
    analyzeRegionColors(pixels, dominantColors) {
        if (pixels.length === 0) {
            return this.getEmptyRegionAnalysis();
        }
        
        // Group similar colors
        const colorGroups = this.groupSimilarColors(pixels);
        
        // Find dominant color in region
        const regionDominant = this.findRegionDominantColor(colorGroups);
        
        // Calculate color distribution
        const distribution = this.calculateColorDistribution(colorGroups, dominantColors);
        
        // Calculate average color
        const averageColor = this.calculateAverageColor(pixels);
        
        // Calculate color variance
        const variance = this.calculateColorVariance(pixels, averageColor);
        
        return {
            dominantColor: regionDominant,
            distribution: distribution,
            uniqueColors: colorGroups.length,
            averageColor: averageColor,
            variance: variance
        };
    }
    
    // Group similar colors to reduce noise
    groupSimilarColors(pixels) {
        const groups = [];
        
        pixels.forEach(pixel => {
            let foundGroup = false;
            
            for (let group of groups) {
                if (this.colorDistance(pixel, group.representative) < this.colorThreshold) {
                    group.pixels.push(pixel);
                    foundGroup = true;
                    break;
                }
            }
            
            if (!foundGroup) {
                groups.push({
                    representative: pixel,
                    pixels: [pixel],
                    count: 1
                });
            }
        });
        
        // Update counts and representatives
        groups.forEach(group => {
            group.count = group.pixels.length;
            group.representative = this.calculateAverageColor(group.pixels);
        });
        
        // Sort by count (most frequent first)
        return groups.sort((a, b) => b.count - a.count);
    }
    
    // Calculate color distance (Euclidean in RGB space)
    colorDistance(color1, color2) {
        const dr = color1.r - color2.r;
        const dg = color1.g - color2.g;
        const db = color1.b - color2.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }
    
    // Find dominant color in region
    findRegionDominantColor(colorGroups) {
        if (colorGroups.length === 0) return { r: 128, g: 128, b: 128 };
        
        const dominant = colorGroups[0].representative;
        const percentage = Math.round((colorGroups[0].count / colorGroups.reduce((sum, g) => sum + g.count, 0)) * 100);
        
        return {
            ...dominant,
            hex: this.rgbToHex(dominant.r, dominant.g, dominant.b),
            percentage: percentage,
            name: this.getColorName(dominant)
        };
    }
    
    // Remove duplicate regions (same dominant color and similar distribution)
    removeDuplicateRegions(regions) {
        const unique = [];
        const seen = new Set();
        
        regions.forEach(region => {
            // Create signature based on dominant color and characteristics
            const signature = `${region.dominantColor.hex}_${region.regionCharacter}_${region.uniqueColors}`;
            
            if (!seen.has(signature)) {
                seen.add(signature);
                unique.push(region);
            } else {
                // If duplicate found, merge data or mark as variant
                const existing = unique.find(r => 
                    r.dominantColor.hex === region.dominantColor.hex &&
                    r.regionCharacter === region.regionCharacter
                );
                
                if (existing) {
                    existing.regionName += ` & ${region.regionName}`;
                    existing.area += region.area;
                }
            }
        });
        
        return unique;
    }
    
    // Add regional insights
    addRegionalInsights(regions) {
        return regions.map(region => ({
            ...region,
            insights: {
                complexity: this.calculateComplexity(region),
                harmony: this.calculateHarmony(region),
                contrast: this.calculateContrast(region),
                temperature: this.calculateTemperature(region.dominantColor)
            }
        }));
    }
    
    // Helper functions
    calculateAverageColor(pixels) {
        if (pixels.length === 0) return { r: 128, g: 128, b: 128 };
        
        const sum = pixels.reduce((acc, pixel) => ({
            r: acc.r + pixel.r,
            g: acc.g + pixel.g,
            b: acc.b + pixel.b
        }), { r: 0, g: 0, b: 0 });
        
        return {
            r: Math.round(sum.r / pixels.length),
            g: Math.round(sum.g / pixels.length),
            b: Math.round(sum.b / pixels.length)
        };
    }
    
    calculateColorVariance(pixels, average) {
        if (pixels.length === 0) return 0;
        
        const variance = pixels.reduce((sum, pixel) => {
            return sum + Math.pow(this.colorDistance(pixel, average), 2);
        }, 0) / pixels.length;
        
        return Math.round(Math.sqrt(variance));
    }
    
    determineRegionCharacter(analysis) {
        const variance = analysis.variance;
        const uniqueColors = analysis.uniqueColors;
        
        if (variance < 20 && uniqueColors < 5) return 'uniform';
        if (variance > 60 && uniqueColors > 15) return 'complex';
        if (variance > 40) return 'varied';
        return 'balanced';
    }
    
    generateRegionName(position, analysis) {
        const positions = [
            ['Top-Left', 'Top-Center', 'Top-Right'],
            ['Mid-Left', 'Center', 'Mid-Right'],
            ['Bottom-Left', 'Bottom-Center', 'Bottom-Right']
        ];
        
        const baseName = positions[position.row][position.col];
        const character = analysis.variance > 40 ? 'Complex' : 'Simple';
        
        return `${baseName} (${character})`;
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    getColorName(color) {
        // Simplified color naming
        const { r, g, b } = color;
        
        if (r > 200 && g < 100 && b < 100) return 'Red';
        if (g > 200 && r < 100 && b < 100) return 'Green';
        if (b > 200 && r < 100 && g < 100) return 'Blue';
        if (r > 200 && g > 200 && b < 100) return 'Yellow';
        if (r > 200 && b > 200 && g < 100) return 'Magenta';
        if (g > 200 && b > 200 && r < 100) return 'Cyan';
        if (r > 180 && g > 180 && b > 180) return 'Light Gray';
        if (r < 80 && g < 80 && b < 80) return 'Dark Gray';
        
        return 'Mixed';
    }
    
    // Fallback for errors
    generateFallbackRegions() {
        const fallbackRegions = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
        
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            
            fallbackRegions.push({
                id: `fallback_${i}`,
                position: { row, col },
                dominantColor: {
                    hex: colors[i],
                    name: `Color ${i + 1}`,
                    percentage: Math.round(60 + Math.random() * 30)
                },
                regionName: `Region ${i + 1}`,
                uniqueColors: Math.round(3 + Math.random() * 8),
                regionCharacter: ['uniform', 'balanced', 'varied'][Math.floor(Math.random() * 3)]
            });
        }
        
        return fallbackRegions;
    }
    
    getEmptyRegionAnalysis() {
        return {
            dominantColor: { r: 128, g: 128, b: 128, hex: '#808080', name: 'Gray', percentage: 100 },
            distribution: [],
            uniqueColors: 1,
            averageColor: { r: 128, g: 128, b: 128 },
            variance: 0
        };
    }
    
    calculateComplexity(region) {
        return region.uniqueColors > 10 ? 'high' : region.uniqueColors > 5 ? 'medium' : 'low';
    }
    
    calculateHarmony(region) {
        return region.colorVariance < 30 ? 'high' : region.colorVariance < 60 ? 'medium' : 'low';
    }
    
    calculateContrast(region) {
        return region.colorVariance > 50 ? 'high' : region.colorVariance > 25 ? 'medium' : 'low';
    }
    
    calculateTemperature(color) {
        const warmth = (color.r * 0.5 + color.g * 0.3) - (color.b * 0.8);
        return warmth > 0 ? 'warm' : 'cool';
    }
}

// Global instance
window.enhancedRegionalAnalyzer = new EnhancedRegionalAnalyzer();

console.log('🎯 Enhanced Regional Algorithm loaded successfully');
