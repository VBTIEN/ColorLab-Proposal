// Accurate Color Extraction - Fix False Colors Issue
console.log('🎨 Accurate Color Extraction Loading...');

class AccurateColorExtractor {
    constructor() {
        this.minColorThreshold = 0.01; // Minimum 1% presence to be considered
        this.colorSimilarityThreshold = 30; // RGB distance threshold
        this.debugMode = true;
    }
    
    // Enhanced color extraction from actual image data
    async extractAccurateColors(imageFile) {
        console.log('🔍 Starting accurate color extraction...');
        
        try {
            // Create canvas to read actual pixel data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Set canvas size (limit for performance)
                        const maxSize = 400;
                        let { width, height } = img;
                        
                        if (width > maxSize || height > maxSize) {
                            const ratio = Math.min(maxSize / width, maxSize / height);
                            width = Math.floor(width * ratio);
                            height = Math.floor(height * ratio);
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw image to canvas
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Get actual pixel data
                        const imageData = ctx.getImageData(0, 0, width, height);
                        const pixels = imageData.data;
                        
                        console.log(`📊 Analyzing ${width}x${height} pixels (${pixels.length / 4} total pixels)`);
                        
                        // Extract colors from actual pixels
                        const actualColors = this.extractColorsFromPixels(pixels, width * height);
                        
                        resolve(actualColors);
                        
                    } catch (error) {
                        reject(error);
                    }
                };
                
                img.onerror = reject;
                img.src = URL.createObjectURL(imageFile);
            });
            
        } catch (error) {
            console.error('❌ Accurate color extraction failed:', error);
            throw error;
        }
    }
    
    extractColorsFromPixels(pixels, totalPixels) {
        console.log('🎨 Extracting colors from actual pixels...');
        
        const colorMap = new Map();
        const colorCounts = {};
        
        // Process every pixel
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Group similar colors to reduce noise
            const colorKey = this.getColorKey(r, g, b);
            
            if (colorCounts[colorKey]) {
                colorCounts[colorKey].count++;
            } else {
                colorCounts[colorKey] = {
                    r: r,
                    g: g,
                    b: b,
                    count: 1,
                    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
                };
            }
        }
        
        // Convert to array and sort by frequency
        const colorArray = Object.values(colorCounts);
        colorArray.sort((a, b) => b.count - a.count);
        
        // Filter out colors with very low presence
        const minCount = Math.max(1, Math.floor(totalPixels * this.minColorThreshold));
        const significantColors = colorArray.filter(color => color.count >= minCount);
        
        console.log(`✅ Found ${significantColors.length} significant colors (min count: ${minCount})`);
        
        if (this.debugMode) {
            console.log('🔍 Top 10 actual colors found:');
            significantColors.slice(0, 10).forEach((color, i) => {
                const percentage = ((color.count / totalPixels) * 100).toFixed(2);
                console.log(`${i + 1}. ${color.hex} (${color.r}, ${color.g}, ${color.b}) - ${percentage}% (${color.count} pixels)`);
            });
        }
        
        return this.formatColorsForAnalysis(significantColors, totalPixels);
    }
    
    getColorKey(r, g, b) {
        // Group similar colors together to reduce noise
        const groupSize = 8; // Group colors within 8 RGB values
        const groupedR = Math.floor(r / groupSize) * groupSize;
        const groupedG = Math.floor(g / groupSize) * groupSize;
        const groupedB = Math.floor(b / groupSize) * groupSize;
        
        return `${groupedR}-${groupedG}-${groupedB}`;
    }
    
    formatColorsForAnalysis(colors, totalPixels) {
        return colors.map((color, index) => {
            const percentage = (color.count / totalPixels) * 100;
            
            return {
                rank: index + 1,
                hex: color.hex,
                rgb: {
                    r: color.r,
                    g: color.g,
                    b: color.b
                },
                name: this.getAccurateColorName(color.r, color.g, color.b),
                percentage: Math.round(percentage * 100) / 100,
                pixel_count: color.count,
                quality_score: 0.98, // High quality from actual pixels
                luminance: this.calculateLuminance(color.r, color.g, color.b),
                saturation: this.calculateSaturation(color.r, color.g, color.b),
                source: 'actual_pixels'
            };
        });
    }
    
    getAccurateColorName(r, g, b) {
        // Use Chroma.js if available for accurate naming
        if (typeof chroma !== 'undefined') {
            try {
                const color = chroma.rgb(r, g, b);
                const [h, s, l] = color.hsl();
                
                // Enhanced color naming based on HSL
                if (s < 0.1) {
                    if (l < 0.1) return "Black";
                    if (l < 0.3) return "Dark Gray";
                    if (l < 0.7) return "Gray";
                    if (l < 0.9) return "Light Gray";
                    return "White";
                }
                
                // More accurate hue-based naming
                const hue = h || 0;
                let baseName = "";
                
                if (hue < 10 || hue >= 350) baseName = "Red";
                else if (hue < 25) baseName = "Red Orange";
                else if (hue < 40) baseName = "Orange";
                else if (hue < 55) baseName = "Yellow Orange";
                else if (hue < 70) baseName = "Yellow";
                else if (hue < 85) baseName = "Yellow Green";
                else if (hue < 140) baseName = "Green";
                else if (hue < 170) baseName = "Blue Green";
                else if (hue < 200) baseName = "Cyan";
                else if (hue < 240) baseName = "Blue";
                else if (hue < 280) baseName = "Blue Violet";
                else if (hue < 320) baseName = "Violet";
                else baseName = "Red Violet";
                
                // Add lightness modifiers
                if (l < 0.25) baseName = "Very Dark " + baseName;
                else if (l < 0.4) baseName = "Dark " + baseName;
                else if (l > 0.8) baseName = "Very Light " + baseName;
                else if (l > 0.65) baseName = "Light " + baseName;
                
                // Add saturation modifiers
                if (s > 0.8) baseName = "Vivid " + baseName;
                else if (s < 0.3) baseName = "Muted " + baseName;
                
                return baseName;
                
            } catch (error) {
                console.warn('⚠️ Chroma.js naming error:', error);
            }
        }
        
        // Fallback naming
        return this.basicColorName(r, g, b);
    }
    
    basicColorName(r, g, b) {
        // Simple RGB-based naming
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        
        if (max - min < 30) {
            // Grayscale
            if (max < 50) return "Black";
            if (max < 100) return "Dark Gray";
            if (max < 180) return "Gray";
            if (max < 220) return "Light Gray";
            return "White";
        }
        
        // Color detection
        if (r > g && r > b) return "Red";
        if (g > r && g > b) return "Green";
        if (b > r && b > g) return "Blue";
        if (r > b && g > b) return "Yellow";
        if (r > g && b > g) return "Magenta";
        if (g > r && b > r) return "Cyan";
        
        return "Mixed Color";
    }
    
    calculateLuminance(r, g, b) {
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    
    calculateSaturation(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
    }
}

// Override professional color analyzer to use accurate extraction
if (window.professionalColorAnalyzer) {
    const originalAnalyzeProfessional = window.professionalColorAnalyzer.analyzeProfessional;
    
    window.professionalColorAnalyzer.analyzeProfessional = async function(imageFile) {
        console.log('🎨 Using accurate color extraction...');
        
        try {
            // Use accurate color extraction
            const accurateExtractor = new AccurateColorExtractor();
            const actualColors = await accurateExtractor.extractAccurateColors(imageFile);
            
            console.log(`✅ Extracted ${actualColors.length} actual colors from image`);
            
            // Generate analysis with actual colors
            const analysis = {
                dominant_colors: actualColors.slice(0, 10),
                color_frequency: {
                    total_pixels: actualColors.reduce((sum, color) => sum + color.pixel_count, 0),
                    unique_colors: actualColors.length,
                    diversity_index: Math.min(1, actualColors.length / 100),
                    most_frequent: actualColors[0] || null
                },
                professional_grade: true,
                accuracy_level: 'actual_pixels',
                processing_method: 'accurate_extraction'
            };
            
            // Call server API with actual color data
            const serverResult = await this.callEnhancedAPI(imageFile, {
                actual_colors: actualColors,
                extraction_method: 'accurate_pixels'
            });
            
            // Combine with server analysis
            return {
                ...serverResult,
                analysis: {
                    ...serverResult.analysis,
                    dominant_colors: actualColors.slice(0, 10),
                    color_frequency: analysis.color_frequency,
                    accuracy_note: 'Colors extracted from actual image pixels'
                }
            };
            
        } catch (error) {
            console.error('❌ Accurate extraction failed, using fallback:', error);
            // Fallback to original method
            return originalAnalyzeProfessional.call(this, imageFile);
        }
    };
}

// Global instance
window.accurateColorExtractor = new AccurateColorExtractor();

console.log('🎨 Accurate Color Extraction loaded successfully');
