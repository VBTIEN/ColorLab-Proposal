// Enhanced AI Image Analyzer - Main JavaScript
class ImageAnalyzer {
    constructor() {
        this.API_ENDPOINT = 'https://cuwg234q8g.execute-api.ap-southeast-1.amazonaws.com/prod/analyze';
        this.BUCKET_NAME = 'image-analyzer-workshop-1751722329';
        this.currentImageData = null;
        this.analysisResults = null;
        this.isApiOnline = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkApiStatus();
        this.showInfo('🚀 Enhanced AI Image Analyzer ready!');
    }
    
    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeImage());
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Quick questions
        document.getElementById('quickQuestions').addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-question')) {
                document.getElementById('chatInput').value = e.target.dataset.question;
                this.sendMessage();
            }
        });
    }
    
    async checkApiStatus() {
        try {
            const response = await fetch(this.API_ENDPOINT, { method: 'OPTIONS', mode: 'cors' });
            if (response.ok) {
                this.isApiOnline = true;
                document.getElementById('statusIndicator').innerHTML = 
                    '<span class="status-online">✅ Enhanced API Online</span>';
            } else throw new Error('API not responding');
        } catch (error) {
            this.isApiOnline = false;
            document.getElementById('statusIndicator').innerHTML = 
                '<span class="status-offline">⚠️ Demo Mode - Enhanced Features</span>';
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            this.handleFile(e.dataTransfer.files[0]);
        }
    }
    
    handleFileSelect(e) {
        if (e.target.files[0]) {
            this.handleFile(e.target.files[0]);
        }
    }
    
    handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image size must be less than 5MB');
            return;
        }
        
        // Reset previous results
        this.resetAnalysisDisplay();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImageData = e.target.result;
            document.getElementById('previewImg').src = this.currentImageData;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('analyzeBtn').disabled = false;
            this.showSuccess('✅ Image loaded! Ready for comprehensive analysis.');
        };
        reader.readAsDataURL(file);
    }
    
    resetAnalysisDisplay() {
        // Hide all analysis cards and reset their content
        const analysisCards = document.querySelectorAll('.analysis-card');
        analysisCards.forEach(card => {
            card.classList.remove('has-content');
            card.style.display = 'none';
        });
        
        // Clear results sections
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('chatSection').style.display = 'none';
        
        // Clear chat messages
        document.getElementById('chatMessages').innerHTML = '';
        
        // Reset analysis results
        this.analysisResults = null;
        
        console.log('🔄 Analysis display reset for new image');
    }
    
    async analyzeImage() {
        if (!this.currentImageData) return;
        
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('chatSection').style.display = 'none';
        document.getElementById('analyzeBtn').disabled = true;
        
        try {
            if (this.isApiOnline) {
                const response = await fetch(this.API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bucket: this.BUCKET_NAME,
                        image_data: this.currentImageData.split(',')[1]
                    })
                });
                
                if (!response.ok) throw new Error(`API failed: ${response.status}`);
                
                this.analysisResults = await response.json();
                this.showSuccess('✅ Comprehensive analysis completed with AWS AI!');
            } else {
                throw new Error('API offline');
            }
        } catch (error) {
            this.showError(`Using enhanced demo data: ${error.message}`);
            await this.simulateEnhancedAnalysis();
        }
        
        this.displayResults();
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('chatSection').style.display = 'block';
        document.getElementById('analyzeBtn').disabled = false;
    }
    
    async simulateEnhancedAnalysis() {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate realistic demo data based on image type
        this.analysisResults = {
            basic_analysis: {
                labels: [
                    { name: 'Landscape', confidence: 92.1, categories: ['Nature'] },
                    { name: 'Mountain', confidence: 88.5, categories: ['Outdoors'] },
                    { name: 'Sky', confidence: 95.3, categories: ['Nature'] },
                    { name: 'Cloud', confidence: 87.2, categories: ['Weather'] }
                ],
                image_properties: {
                    dominant_colors: [
                        { color: 'Blue', hex: '#4A90E2', pixel_percent: 45.2 },
                        { color: 'Green', hex: '#7ED321', pixel_percent: 35.7 },
                        { color: 'White', hex: '#FFFFFF', pixel_percent: 19.1 }
                    ],
                    quality: { brightness: 78.5, sharpness: 85.2, contrast: 72.3 }
                },
                faces: [], // No faces in landscape
                text: [],
                celebrities: [],
                content_moderation: []
            },
            advanced_analysis: {
                artistic_analysis: 'Bức ảnh phong cảnh thể hiện composition theo quy tắc tam phân với đường chân trời được đặt ở 1/3 khung hình. Tông màu xanh dương và xanh lá tạo cảm giác tự nhiên, hài hòa. Ánh sáng tự nhiên được sử dụng hiệu quả, tạo độ tương phản tốt giữa bầu trời và mặt đất. Độ sâu trường ảnh rộng giúp toàn bộ cảnh quan đều sắc nét.',
                model_used: 'Enhanced Analysis Engine',
                analysis_type: 'comprehensive'
            }
        };
    }
    
    displayResults() {
        const { basic_analysis, advanced_analysis } = this.analysisResults;
        
        // Display statistics
        this.displayStatistics(basic_analysis);
        
        // Display labels
        this.displayLabels(basic_analysis.labels);
        
        // Display colors
        this.displayColors(basic_analysis.image_properties?.dominant_colors);
        
        // Display faces (only if present)
        this.displayFaces(basic_analysis.faces);
        
        // Display text (only if present)
        this.displayText(basic_analysis.text);
        
        // Display artistic analysis
        this.displayArtisticAnalysis(advanced_analysis);
        
        console.log('✅ Results displayed with proper section visibility');
    }
    
    displayStatistics(basicAnalysis) {
        const stats = [];
        
        if (basicAnalysis.labels?.length) {
            stats.push({ number: basicAnalysis.labels.length, label: 'Objects' });
        }
        if (basicAnalysis.faces?.length) {
            stats.push({ number: basicAnalysis.faces.length, label: 'Faces' });
        }
        if (basicAnalysis.text?.length) {
            stats.push({ number: basicAnalysis.text.length, label: 'Text Lines' });
        }
        if (basicAnalysis.image_properties?.dominant_colors?.length) {
            stats.push({ number: basicAnalysis.image_properties.dominant_colors.length, label: 'Colors' });
        }
        
        if (stats.length > 0) {
            document.getElementById('statsGrid').innerHTML = stats.map(s => 
                `<div class="stat-item">
                    <div class="stat-number">${s.number}</div>
                    <div class="stat-label">${s.label}</div>
                </div>`
            ).join('');
            this.showSection('statsCard');
        }
    }
    
    displayLabels(labels) {
        if (labels?.length) {
            document.getElementById('labelsResult').innerHTML = labels.map(l => 
                `<span class="tag">${l.name} <span class="confidence">${l.confidence}%</span></span>`
            ).join('');
            this.showSection('labelsCard');
        }
    }
    
    displayColors(colors) {
        if (colors?.length) {
            const colorsHtml = colors.map(c => 
                `<div class="color-swatch" style="background-color: ${c.hex}" title="${c.color} (${c.pixel_percent}%)">
                    ${c.pixel_percent.toFixed(1)}%
                </div>`
            ).join('');
            
            document.getElementById('colorsResult').innerHTML = 
                `<div style="display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap;">${colorsHtml}</div>
                <p>Màu sắc theo tỷ lệ xuất hiện trong ảnh</p>`;
            this.showSection('colorsCard');
        }
    }
    
    displayFaces(faces) {
        if (faces?.length) {
            const facesHtml = faces.map((face, index) => {
                const emotionsHtml = face.emotions?.map(e => 
                    `<div class="emotion-bar">
                        <span class="emotion-name">${e.type}</span>
                        <div class="emotion-progress">
                            <div class="emotion-fill" style="width: ${e.confidence}%"></div>
                        </div>
                        <span class="confidence">${e.confidence.toFixed(1)}%</span>
                    </div>`
                ).join('') || '';
                
                return `<div class="face-analysis">
                    <h4>👤 Person ${index + 1}</h4>
                    <p><strong>Gender:</strong> ${face.gender?.value} (${face.gender?.confidence?.toFixed(1)}%)</p>
                    <p><strong>Age:</strong> ${face.age_range?.Low}-${face.age_range?.High} years</p>
                    ${emotionsHtml ? `<div style="margin-top: 10px;"><strong>Emotions:</strong>${emotionsHtml}</div>` : ''}
                </div>`;
            }).join('');
            
            document.getElementById('facesResult').innerHTML = facesHtml;
            this.showSection('facesCard');
        }
    }
    
    displayText(textItems) {
        if (textItems?.length) {
            document.getElementById('textResult').innerHTML = textItems.map(t => 
                `<span class="tag">${t.text} <span class="confidence">${t.confidence}%</span></span>`
            ).join('');
            this.showSection('textCard');
        }
    }
    
    displayArtisticAnalysis(advancedAnalysis) {
        if (advancedAnalysis?.artistic_analysis) {
            document.getElementById('artisticResult').innerHTML = 
                `<div style="line-height: 1.6;">
                    <p>${advancedAnalysis.artistic_analysis}</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666;">
                        <strong>Analysis by:</strong> ${advancedAnalysis.model_used}
                        ${advancedAnalysis.analysis_type ? ` | Type: ${advancedAnalysis.analysis_type}` : ''}
                    </div>
                </div>`;
            this.showSection('artisticCard');
        }
    }
    
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('has-content');
            section.style.display = 'block';
        }
    }
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = this.generateSmartResponse(message);
            this.addMessage(response, 'ai');
        }, 1000);
    }
    
    addMessage(text, sender) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    generateSmartResponse(question) {
        if (!this.analysisResults) {
            return "Please analyze an image first so I can provide detailed answers about it.";
        }
        
        const { basic_analysis, advanced_analysis } = this.analysisResults;
        const lowerQ = question.toLowerCase();
        
        // Color analysis
        if (lowerQ.includes('màu') || lowerQ.includes('color')) {
            const colors = basic_analysis.image_properties?.dominant_colors;
            if (colors?.length) {
                const colorList = colors.map(c => `${c.color} (${c.pixel_percent.toFixed(1)}%)`).join(', ');
                return `Image has ${colors.length} dominant colors: ${colorList}. ${colors[0].color} occupies the highest percentage at ${colors[0].pixel_percent.toFixed(1)}%, creating a ${colors.length > 3 ? 'rich and diverse' : 'harmonious and balanced'} color palette.`;
            }
            return "Color analysis not available for this image, but overall it appears to have a balanced color composition.";
        }
        
        // Emotion analysis
        if (lowerQ.includes('cảm xúc') || lowerQ.includes('emotion')) {
            const faces = basic_analysis.faces;
            if (faces?.length) {
                const face = faces[0];
                const topEmotion = face.emotions?.[0];
                if (topEmotion) {
                    return `Detected primary emotion: ${topEmotion.type.toLowerCase()} with ${topEmotion.confidence.toFixed(1)}% confidence. ${topEmotion.type === 'HAPPY' ? 'This is a positive image showing joy and satisfaction.' : 'The emotional expression in this image is quite nuanced.'}`;
                }
            }
            return "No clear facial emotions detected in this image, but the overall composition suggests a peaceful mood.";
        }
        
        // Composition analysis
        if (lowerQ.includes('composition') || lowerQ.includes('bố cục')) {
            const labels = basic_analysis.labels || [];
            const mainElements = labels.slice(0, 3).map(l => l.name).join(', ');
            return `Composition features ${labels.length} main elements: ${mainElements}. ${advanced_analysis?.artistic_analysis?.split('.')[0] || 'The layout is balanced and harmonious'}. This creates a ${labels.some(l => l.categories?.includes('Photography')) ? 'professional' : 'natural'} composition.`;
        }
        
        // Default intelligent response
        const labels = basic_analysis.labels || [];
        const mainElements = labels.slice(0, 2).map(l => l.name).join(' and ') || 'interesting elements';
        return `Based on comprehensive analysis, this image contains ${mainElements} ${basic_analysis.faces?.length ? `with ${basic_analysis.faces.length} person(s)` : ''}. ${advanced_analysis?.artistic_analysis?.split('.')[0] || 'Overall quality is good with balanced composition'}. Would you like me to analyze any specific aspect in more detail?`;
    }
    
    showError(msg) { this.showNotification(msg, 'error'); }
    showSuccess(msg) { this.showNotification(msg, 'success'); }
    showInfo(msg) { this.showNotification(msg, 'info'); }
    
    showNotification(message, type) {
        const div = document.createElement('div');
        div.className = type;
        div.innerHTML = message;
        document.querySelector('.main-content').insertBefore(div, document.querySelector('.upload-section').nextSibling);
        setTimeout(() => div.remove(), 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageAnalyzer = new ImageAnalyzer();
    console.log('🚀 Enhanced AI Image Analyzer initialized with proper section management');
});
