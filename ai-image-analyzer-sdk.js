/**
 * AI Image Analyzer SDK v12.0
 * Professional JavaScript SDK for RESTful API
 */

class AIImageAnalyzerSDK {
    constructor(options = {}) {
        this.baseURL = options.baseURL || 'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod';
        this.timeout = options.timeout || 30000;
        this.defaultBucket = options.bucket || 'image-analyzer-workshop-1751722329';
        this.apiKey = options.apiKey || null;
        
        // Request interceptors
        this.requestInterceptors = [];
        this.responseInterceptors = [];
    }

    /**
     * Add request interceptor
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add response interceptor
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Make HTTP request with interceptors
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Default options
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add API key if provided
        if (this.apiKey) {
            requestOptions.headers['X-API-Key'] = this.apiKey;
        }

        // Apply request interceptors
        for (const interceptor of this.requestInterceptors) {
            await interceptor(requestOptions);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Apply response interceptors
            for (const interceptor of this.responseInterceptors) {
                await interceptor(response);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(response.status, errorData.error?.message || response.statusText, errorData);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError(408, 'Request timeout');
            }
            throw error;
        }
    }

    // =============================================================================
    // HEALTH CHECK METHODS
    // =============================================================================

    /**
     * Check API health
     */
    async health() {
        return await this.request('/health');
    }

    /**
     * Get API status and endpoints
     */
    async status() {
        return await this.request('/');
    }

    // =============================================================================
    // IMAGE METHODS
    // =============================================================================

    /**
     * Create image analysis
     */
    async createImage(imageData, options = {}) {
        const requestBody = {
            image_data: imageData,
            bucket: options.bucket || this.defaultBucket,
            options: options.analysisOptions || {}
        };

        return await this.request('/images', {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });
    }

    /**
     * Upload image from file input
     */
    async uploadImage(file, options = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];
                    const result = await this.createImage(base64Data, options);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * List images with pagination
     */
    async listImages(options = {}) {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.offset) params.append('offset', options.offset);
        if (options.date) params.append('date', options.date);

        const queryString = params.toString();
        const endpoint = queryString ? `/images?${queryString}` : '/images';
        
        return await this.request(endpoint);
    }

    /**
     * Get specific image
     */
    async getImage(imageId) {
        return await this.request(`/images/${imageId}`);
    }

    /**
     * Update image analysis
     */
    async updateImage(imageId, options = {}) {
        return await this.request(`/images/${imageId}`, {
            method: 'PUT',
            body: JSON.stringify({ options })
        });
    }

    /**
     * Delete image
     */
    async deleteImage(imageId) {
        return await this.request(`/images/${imageId}`, {
            method: 'DELETE'
        });
    }

    // =============================================================================
    // ANALYSIS METHODS
    // =============================================================================

    /**
     * Get color analysis
     */
    async getColors(imageId) {
        return await this.request(`/images/${imageId}/colors`);
    }

    /**
     * Get harmony analysis
     */
    async getHarmony(imageId) {
        return await this.request(`/images/${imageId}/harmony`);
    }

    /**
     * Get temperature analysis
     */
    async getTemperature(imageId) {
        return await this.request(`/images/${imageId}/temperature`);
    }

    /**
     * Get mood analysis
     */
    async getMood(imageId) {
        return await this.request(`/images/${imageId}/mood`);
    }

    /**
     * Get recommendations
     */
    async getRecommendations(imageId) {
        return await this.request(`/images/${imageId}/recommendations`);
    }

    /**
     * Get complete analysis for image
     */
    async getCompleteAnalysis(imageId) {
        const [colors, harmony, temperature, mood, recommendations] = await Promise.all([
            this.getColors(imageId),
            this.getHarmony(imageId),
            this.getTemperature(imageId),
            this.getMood(imageId),
            this.getRecommendations(imageId)
        ]);

        return {
            image_id: imageId,
            colors: colors.colors,
            harmony: harmony.harmony,
            temperature: temperature.temperature,
            mood: mood.mood,
            recommendations: recommendations.recommendations
        };
    }

    // =============================================================================
    // CONVENIENCE METHODS
    // =============================================================================

    /**
     * Analyze image from file (one-step process)
     */
    async analyzeImage(file, options = {}) {
        const uploadResult = await this.uploadImage(file, options);
        const imageId = uploadResult.image.id;
        
        if (options.includeCompleteAnalysis) {
            const completeAnalysis = await this.getCompleteAnalysis(imageId);
            return {
                ...uploadResult,
                complete_analysis: completeAnalysis
            };
        }
        
        return uploadResult;
    }

    /**
     * Analyze image from base64 data
     */
    async analyzeImageData(base64Data, options = {}) {
        const uploadResult = await this.createImage(base64Data, options);
        const imageId = uploadResult.image.id;
        
        if (options.includeCompleteAnalysis) {
            const completeAnalysis = await this.getCompleteAnalysis(imageId);
            return {
                ...uploadResult,
                complete_analysis: completeAnalysis
            };
        }
        
        return uploadResult;
    }

    /**
     * Get paginated images with auto-pagination
     */
    async getAllImages(options = {}) {
        const allImages = [];
        let offset = 0;
        const limit = options.limit || 10;
        
        while (true) {
            const response = await this.listImages({ 
                ...options, 
                limit, 
                offset 
            });
            
            allImages.push(...response.images);
            
            if (!response.pagination.has_more) {
                break;
            }
            
            offset += limit;
            
            // Safety check to prevent infinite loops
            if (offset > 1000) {
                console.warn('Stopped pagination at 1000 images');
                break;
            }
        }
        
        return allImages;
    }

    // =============================================================================
    // LEGACY METHODS (for backward compatibility)
    // =============================================================================

    /**
     * Legacy analyze method
     * @deprecated Use createImage() instead
     */
    async analyze(bucket, imageData) {
        console.warn('analyze() method is deprecated. Use createImage() instead.');
        
        return await this.request('/analyze', {
            method: 'POST',
            body: JSON.stringify({
                bucket,
                image_data: imageData
            })
        });
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(status, message, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

/**
 * SDK Factory with common configurations
 */
class AIImageAnalyzerSDKFactory {
    /**
     * Create SDK for development environment
     */
    static development(options = {}) {
        return new AIImageAnalyzerSDK({
            baseURL: 'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod',
            timeout: 60000, // Longer timeout for development
            ...options
        });
    }

    /**
     * Create SDK for production environment
     */
    static production(options = {}) {
        return new AIImageAnalyzerSDK({
            baseURL: 'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod',
            timeout: 30000,
            ...options
        });
    }

    /**
     * Create SDK with logging interceptors
     */
    static withLogging(options = {}) {
        const sdk = new AIImageAnalyzerSDK(options);
        
        // Request logging
        sdk.addRequestInterceptor(async (requestOptions) => {
            console.log('🚀 API Request:', {
                method: requestOptions.method,
                url: requestOptions.url,
                headers: requestOptions.headers
            });
        });
        
        // Response logging
        sdk.addResponseInterceptor(async (response) => {
            console.log('📥 API Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
        });
        
        return sdk;
    }
}

/**
 * Utility functions
 */
const AIImageAnalyzerUtils = {
    /**
     * Convert file to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Validate image file
     */
    validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            throw new Error(`Invalid file type: ${file.type}. Supported types: ${validTypes.join(', ')}`);
        }

        if (file.size > maxSize) {
            throw new Error(`File too large: ${file.size} bytes. Maximum size: ${maxSize} bytes`);
        }

        return true;
    },

    /**
     * Format color data for display
     */
    formatColors(colors) {
        return colors.map(color => ({
            name: color.mau,
            hex: color.ma_hex,
            percentage: color.ty_le_phan_tram,
            rgb: color.rgb,
            temperature: color.temperature
        }));
    },

    /**
     * Calculate harmony score description
     */
    getHarmonyDescription(score) {
        if (score >= 90) return 'Xuất sắc - Hài hòa hoàn hảo';
        if (score >= 75) return 'Tốt - Hài hòa tốt';
        if (score >= 60) return 'Khá - Hài hòa chấp nhận được';
        if (score >= 45) return 'Trung bình - Cần cải thiện';
        return 'Kém - Cần điều chỉnh lại';
    }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        AIImageAnalyzerSDK,
        AIImageAnalyzerSDKFactory,
        AIImageAnalyzerUtils,
        APIError
    };
} else if (typeof window !== 'undefined') {
    // Browser
    window.AIImageAnalyzerSDK = AIImageAnalyzerSDK;
    window.AIImageAnalyzerSDKFactory = AIImageAnalyzerSDKFactory;
    window.AIImageAnalyzerUtils = AIImageAnalyzerUtils;
    window.APIError = APIError;
}

/**
 * Usage Examples:
 * 
 * // Basic usage
 * const sdk = new AIImageAnalyzerSDK();
 * const result = await sdk.analyzeImage(fileInput.files[0]);
 * 
 * // With options
 * const sdk = AIImageAnalyzerSDKFactory.withLogging({
 *     timeout: 60000
 * });
 * 
 * const result = await sdk.analyzeImage(file, {
 *     includeCompleteAnalysis: true,
 *     analysisOptions: {
 *         analysis_type: 'comprehensive'
 *     }
 * });
 * 
 * // Get specific analysis
 * const colors = await sdk.getColors(imageId);
 * const harmony = await sdk.getHarmony(imageId);
 * 
 * // List images
 * const images = await sdk.listImages({ limit: 20, date: '2025-07-06' });
 */
