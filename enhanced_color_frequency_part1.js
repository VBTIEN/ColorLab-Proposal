// Enhanced Color Frequency Analysis - Part 1: Core Algorithm
console.log('📊 Enhanced Color Frequency Analysis Loading...');

class EnhancedColorFrequencyAnalyzer {
    constructor() {
        this.colorBins = 32; // Number of frequency bins
        this.similarityThreshold = 25; // RGB distance for grouping
        this.minSignificance = 0.005; // 0.5% minimum for significance
        this.debugMode = true;
    }
    
    // Main analysis function
    analyzeColorFrequency(colors, totalPixels) {
        console.log('📊 Starting enhanced color frequency analysis...');
        console.log(`📈 Input: ${colors.length} colors, ${totalPixels} total pixels`);
        
        try {
            // 1. Calculate basic frequency statistics
            const basicStats = this.calculateBasicStats(colors, totalPixels);
            
            // 2. Analyze color distribution patterns
            const distributionAnalysis = this.analyzeDistribution(colors);
            
            // 3. Calculate frequency bins for visualization
            const frequencyBins = this.calculateFrequencyBins(colors);
            
            // 4. Analyze color dominance patterns
            const dominanceAnalysis = this.analyzeDominance(colors, totalPixels);
            
            // 5. Calculate diversity metrics
            const diversityMetrics = this.calculateDiversityMetrics(colors, totalPixels);
            
            // 6. Analyze color clustering
            const clusteringAnalysis = this.analyzeColorClustering(colors);
            
            const result = {
                basic_stats: basicStats,
                distribution: distributionAnalysis,
                frequency_bins: frequencyBins,
                dominance: dominanceAnalysis,
                diversity: diversityMetrics,
                clustering: clusteringAnalysis,
                analysis_quality: 'enhanced',
                total_analyzed_pixels: totalPixels
            };
            
            if (this.debugMode) {
                this.logAnalysisResults(result);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Enhanced frequency analysis failed:', error);
            return this.getFallbackAnalysis(colors, totalPixels);
        }
    }
    
    calculateBasicStats(colors, totalPixels) {
        console.log('📊 Calculating basic frequency statistics...');
        
        const totalColorPixels = colors.reduce((sum, color) => sum + color.pixel_count, 0);
        const averageFrequency = totalColorPixels / colors.length;
        
        // Calculate frequency distribution
        const frequencies = colors.map(color => color.percentage);
        frequencies.sort((a, b) => b - a);
        
        // Statistical measures
        const median = this.calculateMedian(frequencies);
        const standardDeviation = this.calculateStandardDeviation(frequencies);
        const variance = Math.pow(standardDeviation, 2);
        
        // Frequency categories
        const highFrequency = colors.filter(c => c.percentage > 5).length;
        const mediumFrequency = colors.filter(c => c.percentage >= 1 && c.percentage <= 5).length;
        const lowFrequency = colors.filter(c => c.percentage < 1).length;
        
        return {
            total_colors: colors.length,
            total_pixels: totalPixels,
            average_frequency: Math.round(averageFrequency * 100) / 100,
            median_frequency: Math.round(median * 100) / 100,
            frequency_std_dev: Math.round(standardDeviation * 100) / 100,
            frequency_variance: Math.round(variance * 100) / 100,
            high_frequency_colors: highFrequency,
            medium_frequency_colors: mediumFrequency,
            low_frequency_colors: lowFrequency,
            most_frequent: colors[0] || null,
            least_frequent: colors[colors.length - 1] || null
        };
    }
    
    analyzeDistribution(colors) {
        console.log('📈 Analyzing color distribution patterns...');
        
        const frequencies = colors.map(color => color.percentage);
        
        // Distribution shape analysis
        const skewness = this.calculateSkewness(frequencies);
        const kurtosis = this.calculateKurtosis(frequencies);
        
        // Determine distribution type
        let distributionType = 'uniform';
        if (Math.abs(skewness) > 1) {
            distributionType = skewness > 0 ? 'right_skewed' : 'left_skewed';
        } else if (kurtosis > 3) {
            distributionType = 'peaked';
        } else if (kurtosis < -1) {
            distributionType = 'flat';
        }
        
        // Color concentration analysis
        const top5Percentage = frequencies.slice(0, 5).reduce((sum, freq) => sum + freq, 0);
        const top10Percentage = frequencies.slice(0, 10).reduce((sum, freq) => sum + freq, 0);
        
        let concentration = 'balanced';
        if (top5Percentage > 80) concentration = 'highly_concentrated';
        else if (top5Percentage > 60) concentration = 'concentrated';
        else if (top5Percentage < 30) concentration = 'dispersed';
        
        return {
            type: distributionType,
            skewness: Math.round(skewness * 1000) / 1000,
            kurtosis: Math.round(kurtosis * 1000) / 1000,
            concentration: concentration,
            top_5_coverage: Math.round(top5Percentage * 100) / 100,
            top_10_coverage: Math.round(top10Percentage * 100) / 100,
            evenness_index: this.calculateEvennessIndex(frequencies)
        };
    }
    
    calculateFrequencyBins(colors) {
        console.log('📊 Calculating frequency bins for visualization...');
        
        // Create frequency bins (0-100% range)
        const bins = new Array(this.colorBins).fill(0);
        const binSize = 100 / this.colorBins;
        
        colors.forEach(color => {
            const binIndex = Math.min(
                Math.floor(color.percentage / binSize),
                this.colorBins - 1
            );
            bins[binIndex]++;
        });
        
        // Generate labels for bins
        const labels = Array.from({length: this.colorBins}, (_, i) => {
            const start = (i * binSize).toFixed(1);
            const end = ((i + 1) * binSize).toFixed(1);
            return `${start}-${end}%`;
        });
        
        // Calculate bin statistics
        const maxBin = Math.max(...bins);
        const totalBins = bins.reduce((sum, count) => sum + count, 0);
        const averageBin = totalBins / this.colorBins;
        
        return {
            bins: bins,
            labels: labels,
            max_bin_count: maxBin,
            average_bin_count: Math.round(averageBin * 100) / 100,
            bin_size_percent: binSize,
            distribution_shape: this.analyzeBinShape(bins)
        };
    }
    
    analyzeDominance(colors, totalPixels) {
        console.log('👑 Analyzing color dominance patterns...');
        
        if (colors.length === 0) return null;
        
        const dominantColor = colors[0];
        const secondaryColor = colors[1] || null;
        const tertiaryColor = colors[2] || null;
        
        // Dominance ratios
        const dominanceRatio = secondaryColor ? 
            dominantColor.percentage / secondaryColor.percentage : Infinity;
        
        // Dominance classification
        let dominanceLevel = 'balanced';
        if (dominantColor.percentage > 50) dominanceLevel = 'overwhelming';
        else if (dominantColor.percentage > 30) dominanceLevel = 'strong';
        else if (dominantColor.percentage > 15) dominanceLevel = 'moderate';
        else if (dominantColor.percentage > 8) dominanceLevel = 'weak';
        
        // Color hierarchy strength
        const hierarchyStrength = this.calculateHierarchyStrength(colors.slice(0, 5));
        
        return {
            dominant_color: {
                hex: dominantColor.hex,
                name: dominantColor.name,
                percentage: dominantColor.percentage,
                pixel_count: dominantColor.pixel_count
            },
            secondary_color: secondaryColor ? {
                hex: secondaryColor.hex,
                name: secondaryColor.name,
                percentage: secondaryColor.percentage
            } : null,
            tertiary_color: tertiaryColor ? {
                hex: tertiaryColor.hex,
                name: tertiaryColor.name,
                percentage: tertiaryColor.percentage
            } : null,
            dominance_level: dominanceLevel,
            dominance_ratio: Math.round(dominanceRatio * 100) / 100,
            hierarchy_strength: hierarchyStrength,
            top_3_coverage: colors.slice(0, 3).reduce((sum, c) => sum + c.percentage, 0)
        };
    }
    
    // Helper functions
    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? 
            (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    
    calculateStandardDeviation(arr) {
        const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }
    
    calculateSkewness(arr) {
        const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
        const stdDev = this.calculateStandardDeviation(arr);
        const n = arr.length;
        
        const skewness = arr.reduce((sum, val) => {
            return sum + Math.pow((val - mean) / stdDev, 3);
        }, 0) / n;
        
        return skewness;
    }
    
    calculateKurtosis(arr) {
        const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
        const stdDev = this.calculateStandardDeviation(arr);
        const n = arr.length;
        
        const kurtosis = arr.reduce((sum, val) => {
            return sum + Math.pow((val - mean) / stdDev, 4);
        }, 0) / n;
        
        return kurtosis - 3; // Excess kurtosis
    }
}

console.log('📊 Enhanced Color Frequency Analysis Part 1 loaded');
