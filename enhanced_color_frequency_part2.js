// Enhanced Color Frequency Analysis - Part 2: Advanced Metrics & Visualization
console.log('📊 Enhanced Color Frequency Analysis Part 2 Loading...');

// Continue EnhancedColorFrequencyAnalyzer class
EnhancedColorFrequencyAnalyzer.prototype.calculateDiversityMetrics = function(colors, totalPixels) {
    console.log('🌈 Calculating diversity metrics...');
    
    if (colors.length === 0) return null;
    
    // Shannon Diversity Index
    const shannonIndex = this.calculateShannonIndex(colors, totalPixels);
    
    // Simpson Diversity Index
    const simpsonIndex = this.calculateSimpsonIndex(colors, totalPixels);
    
    // Evenness measures
    const shannonEvenness = shannonIndex / Math.log(colors.length);
    const simpsonEvenness = simpsonIndex / colors.length;
    
    // Color richness (effective number of colors)
    const effectiveColors = Math.exp(shannonIndex);
    
    // Rarity analysis
    const rareColors = colors.filter(c => c.percentage < 1).length;
    const commonColors = colors.filter(c => c.percentage > 5).length;
    
    // Diversity classification
    let diversityLevel = 'moderate';
    if (effectiveColors > 20) diversityLevel = 'very_high';
    else if (effectiveColors > 15) diversityLevel = 'high';
    else if (effectiveColors > 10) diversityLevel = 'moderate';
    else if (effectiveColors > 5) diversityLevel = 'low';
    else diversityLevel = 'very_low';
    
    return {
        shannon_index: Math.round(shannonIndex * 1000) / 1000,
        simpson_index: Math.round(simpsonIndex * 1000) / 1000,
        shannon_evenness: Math.round(shannonEvenness * 1000) / 1000,
        simpson_evenness: Math.round(simpsonEvenness * 1000) / 1000,
        effective_colors: Math.round(effectiveColors * 10) / 10,
        diversity_level: diversityLevel,
        rare_colors_count: rareColors,
        common_colors_count: commonColors,
        richness_ratio: Math.round((colors.length / totalPixels * 10000) * 100) / 100
    };
};

EnhancedColorFrequencyAnalyzer.prototype.analyzeColorClustering = function(colors) {
    console.log('🎯 Analyzing color clustering patterns...');
    
    if (colors.length < 3) return null;
    
    // Group colors by similarity
    const clusters = this.groupColorsBySimilarity(colors);
    
    // Analyze cluster characteristics
    const clusterStats = clusters.map(cluster => {
        const totalPercentage = cluster.reduce((sum, color) => sum + color.percentage, 0);
        const avgPercentage = totalPercentage / cluster.length;
        
        return {
            size: cluster.length,
            total_percentage: Math.round(totalPercentage * 100) / 100,
            average_percentage: Math.round(avgPercentage * 100) / 100,
            dominant_color: cluster[0],
            color_range: this.calculateColorRange(cluster)
        };
    });
    
    // Sort clusters by total percentage
    clusterStats.sort((a, b) => b.total_percentage - a.total_percentage);
    
    // Clustering quality metrics
    const largestCluster = clusterStats[0];
    const clusteringCoefficient = this.calculateClusteringCoefficient(clusters);
    
    return {
        total_clusters: clusters.length,
        largest_cluster: largestCluster,
        clustering_coefficient: Math.round(clusteringCoefficient * 1000) / 1000,
        cluster_distribution: clusterStats.slice(0, 5), // Top 5 clusters
        clustering_quality: clusteringCoefficient > 0.7 ? 'high' : 
                           clusteringCoefficient > 0.4 ? 'moderate' : 'low'
    };
};

EnhancedColorFrequencyAnalyzer.prototype.calculateEvennessIndex = function(frequencies) {
    if (frequencies.length === 0) return 0;
    
    const maxPossibleEvenness = 100 / frequencies.length;
    const actualEvenness = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
    
    return Math.round((actualEvenness / maxPossibleEvenness) * 1000) / 1000;
};

EnhancedColorFrequencyAnalyzer.prototype.analyzeBinShape = function(bins) {
    const maxBin = Math.max(...bins);
    const maxIndex = bins.indexOf(maxBin);
    const totalBins = bins.length;
    
    // Determine distribution shape
    if (maxIndex < totalBins * 0.3) return 'left_heavy';
    if (maxIndex > totalBins * 0.7) return 'right_heavy';
    if (maxBin > bins.reduce((sum, count) => sum + count, 0) * 0.5) return 'peaked';
    return 'distributed';
};

EnhancedColorFrequencyAnalyzer.prototype.calculateHierarchyStrength = function(topColors) {
    if (topColors.length < 2) return 0;
    
    let hierarchyScore = 0;
    for (let i = 0; i < topColors.length - 1; i++) {
        const ratio = topColors[i].percentage / topColors[i + 1].percentage;
        hierarchyScore += Math.min(ratio, 3); // Cap at 3x difference
    }
    
    return Math.round((hierarchyScore / (topColors.length - 1)) * 100) / 100;
};

EnhancedColorFrequencyAnalyzer.prototype.calculateShannonIndex = function(colors, totalPixels) {
    let shannonIndex = 0;
    
    colors.forEach(color => {
        const proportion = color.pixel_count / totalPixels;
        if (proportion > 0) {
            shannonIndex -= proportion * Math.log(proportion);
        }
    });
    
    return shannonIndex;
};

EnhancedColorFrequencyAnalyzer.prototype.calculateSimpsonIndex = function(colors, totalPixels) {
    let simpsonIndex = 0;
    
    colors.forEach(color => {
        const proportion = color.pixel_count / totalPixels;
        simpsonIndex += proportion * proportion;
    });
    
    return 1 - simpsonIndex;
};

EnhancedColorFrequencyAnalyzer.prototype.groupColorsBySimilarity = function(colors) {
    const clusters = [];
    const used = new Set();
    
    colors.forEach((color, index) => {
        if (used.has(index)) return;
        
        const cluster = [color];
        used.add(index);
        
        // Find similar colors
        colors.forEach((otherColor, otherIndex) => {
            if (used.has(otherIndex) || index === otherIndex) return;
            
            const distance = this.calculateColorDistance(color, otherColor);
            if (distance < this.similarityThreshold) {
                cluster.push(otherColor);
                used.add(otherIndex);
            }
        });
        
        // Sort cluster by percentage
        cluster.sort((a, b) => b.percentage - a.percentage);
        clusters.push(cluster);
    });
    
    return clusters.sort((a, b) => {
        const aTotal = a.reduce((sum, c) => sum + c.percentage, 0);
        const bTotal = b.reduce((sum, c) => sum + c.percentage, 0);
        return bTotal - aTotal;
    });
};

EnhancedColorFrequencyAnalyzer.prototype.calculateColorDistance = function(color1, color2) {
    const r1 = color1.rgb.r, g1 = color1.rgb.g, b1 = color1.rgb.b;
    const r2 = color2.rgb.r, g2 = color2.rgb.g, b2 = color2.rgb.b;
    
    return Math.sqrt(
        Math.pow(r2 - r1, 2) + 
        Math.pow(g2 - g1, 2) + 
        Math.pow(b2 - b1, 2)
    );
};

EnhancedColorFrequencyAnalyzer.prototype.calculateColorRange = function(cluster) {
    if (cluster.length < 2) return 0;
    
    let maxDistance = 0;
    for (let i = 0; i < cluster.length; i++) {
        for (let j = i + 1; j < cluster.length; j++) {
            const distance = this.calculateColorDistance(cluster[i], cluster[j]);
            maxDistance = Math.max(maxDistance, distance);
        }
    }
    
    return Math.round(maxDistance * 10) / 10;
};

EnhancedColorFrequencyAnalyzer.prototype.calculateClusteringCoefficient = function(clusters) {
    if (clusters.length === 0) return 0;
    
    const totalColors = clusters.reduce((sum, cluster) => sum + cluster.length, 0);
    const avgClusterSize = totalColors / clusters.length;
    
    // Higher coefficient for fewer, larger clusters
    return Math.min(1, avgClusterSize / 5);
};

EnhancedColorFrequencyAnalyzer.prototype.getFallbackAnalysis = function(colors, totalPixels) {
    console.log('🔄 Using fallback frequency analysis...');
    
    return {
        basic_stats: {
            total_colors: colors.length,
            total_pixels: totalPixels,
            most_frequent: colors[0] || null
        },
        analysis_quality: 'fallback'
    };
};

EnhancedColorFrequencyAnalyzer.prototype.logAnalysisResults = function(result) {
    console.log('📊 Enhanced Color Frequency Analysis Results:');
    console.log('📈 Basic Stats:', result.basic_stats);
    console.log('📊 Distribution:', result.distribution);
    console.log('👑 Dominance:', result.dominance);
    console.log('🌈 Diversity:', result.diversity);
    console.log('🎯 Clustering:', result.clustering);
};

console.log('📊 Enhanced Color Frequency Analysis Part 2 loaded');
