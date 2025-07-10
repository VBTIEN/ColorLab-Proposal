// Continuation of JavaScript for enhanced image analysis

async function analyzeImage() {
    if (!currentImageData) return;
    
    debugLog('Starting comprehensive image analysis...');
    
    // Show loading
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    chatSection.style.display = 'none';
    analyzeBtn.disabled = true;
    
    try {
        if (isApiOnline) {
            debugLog('Attempting real API call...');
            
            const requestBody = {
                bucket: BUCKET_NAME,
                image_data: currentImageData.split(',')[1]
            };
            
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} - ${errorText}`);
            }
            
            const responseText = await response.text();
            analysisResults = JSON.parse(responseText);
            
            showSuccess('✅ Comprehensive analysis completed using AWS AI services!');
        } else {
            throw new Error('API not available');
        }
        
    } catch (error) {
        debugLog('Analysis failed, using demo data', error.message);
        showError(`API call failed: ${error.message}. Showing enhanced demo results.`);
        await simulateComprehensiveAnalysis();
    }
    
    // Display enhanced results
    displayComprehensiveResults();
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'block';
    chatSection.style.display = 'block';
    analyzeBtn.disabled = false;
    
    debugLog('Comprehensive analysis completed');
}

async function simulateComprehensiveAnalysis() {
    debugLog('Using enhanced demo analysis data');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    analysisResults = {
        basic_analysis: {
            labels: [
                { name: 'Person', confidence: 95.2, categories: ['People'], instances: 1, parents: ['Human'] },
                { name: 'Portrait', confidence: 89.1, categories: ['Photography'], instances: 1, parents: ['Art'] },
                { name: 'Smile', confidence: 87.3, categories: ['Facial Expression'], instances: 1, parents: ['Expression'] },
                { name: 'Face', confidence: 94.8, categories: ['People'], instances: 1, parents: ['Human'] },
                { name: 'Photography', confidence: 82.5, categories: ['Art'], instances: 1, parents: ['Creative'] }
            ],
            image_properties: {
                dominant_colors: [
                    { color: 'Blue', hex: '#4A90E2', pixel_percent: 35.2 },
                    { color: 'White', hex: '#FFFFFF', pixel_percent: 28.7 },
                    { color: 'Beige', hex: '#F5F5DC', pixel_percent: 18.3 },
                    { color: 'Brown', hex: '#8B4513', pixel_percent: 12.1 }
                ],
                quality: { brightness: 75.3, sharpness: 82.1 }
            },
            faces: [
                {
                    age_range: { Low: 25, High: 35 },
                    gender: { value: 'Female', confidence: 92.3 },
                    emotions: [
                        { type: 'HAPPY', confidence: 85.2 },
                        { type: 'CALM', confidence: 12.1 },
                        { type: 'CONFIDENT', confidence: 8.7 },
                        { type: 'SURPRISED', confidence: 2.7 }
                    ],
                    attributes: {
                        smile: { Value: true, Confidence: 89.2 },
                        eyeglasses: { Value: false, Confidence: 95.1 },
                        sunglasses: { Value: false, Confidence: 98.7 },
                        beard: { Value: false, Confidence: 99.1 },
                        mustache: { Value: false, Confidence: 99.5 },
                        eyes_open: { Value: true, Confidence: 96.8 },
                        mouth_open: { Value: false, Confidence: 87.3 }
                    },
                    quality: { brightness: 78.5, sharpness: 85.2 },
                    pose: { roll: 2.1, yaw: -5.3, pitch: 1.8 }
                }
            ],
            text: [
                { text: 'Sample Photography', confidence: 92.1, type: 'LINE', id: 1 }
            ],
            celebrities: [],
            content_moderation: []
        },
        advanced_analysis: {
            artistic_analysis: 'Bức ảnh thể hiện một composition chân dung chuyên nghiệp với ánh sáng tự nhiên được sử dụng khéo léo. Tông màu xanh dương và trắng tạo cảm giác thanh thoát, hài hòa, trong khi các chi tiết nâu và be thêm độ ấm áp. Chủ thể được đặt ở vị trí cân đối theo quy tắc tam phân, tạo điểm nhấn mạnh mẽ. Cảm xúc vui vẻ và tự tin được truyền tải rõ ràng qua nụ cười tự nhiên và ánh mắt sáng. Kỹ thuật chụp thể hiện độ sâu trường ảnh phù hợp, làm nổi bật chủ thể trên nền mờ. Về mặt thẩm mỹ, bức ảnh có giá trị cao với chất lượng ánh sáng tốt và độ sắc nét ấn tượng.',
            model_used: 'Enhanced Analysis Engine',
            analysis_type: 'comprehensive'
        }
    };
}

function displayComprehensiveResults() {
    debugLog('Displaying comprehensive results');
    const { basic_analysis, advanced_analysis } = analysisResults;
    
    // Display statistics overview
    displayStatistics(basic_analysis);
    
    // Display labels with enhanced info
    displayEnhancedLabels(basic_analysis.labels);
    
    // Display color palette
    displayColorPalette(basic_analysis.image_properties?.dominant_colors);
    
    // Display enhanced face analysis
    displayEnhancedFaces(basic_analysis.faces);
    
    // Display celebrities if any
    displayCelebrities(basic_analysis.celebrities);
    
    // Display text detection
    displayTextDetection(basic_analysis.text);
    
    // Display enhanced artistic analysis
    displayArtisticAnalysis(advanced_analysis);
}

function displayStatistics(basicAnalysis) {
    const stats = [];
    
    if (basicAnalysis.labels?.length) {
        stats.push({ number: basicAnalysis.labels.length, label: 'Objects Detected' });
    }
    
    if (basicAnalysis.faces?.length) {
        stats.push({ number: basicAnalysis.faces.length, label: 'Faces Found' });
    }
    
    if (basicAnalysis.text?.length) {
        stats.push({ number: basicAnalysis.text.length, label: 'Text Lines' });
    }
    
    if (basicAnalysis.image_properties?.dominant_colors?.length) {
        stats.push({ number: basicAnalysis.image_properties.dominant_colors.length, label: 'Main Colors' });
    }
    
    if (basicAnalysis.celebrities?.length) {
        stats.push({ number: basicAnalysis.celebrities.length, label: 'Celebrities' });
    }
    
    if (stats.length > 0) {
        const statsHtml = stats.map(stat => 
            `<div class="stat-item">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
            </div>`
        ).join('');
        
        document.getElementById('statsGrid').innerHTML = statsHtml;
        document.getElementById('statsCard').classList.add('has-content');
    }
}

function displayEnhancedLabels(labels) {
    if (!labels || labels.length === 0) return;
    
    const labelsHtml = labels.map(label => {
        const categoryInfo = label.categories?.length ? ` (${label.categories[0]})` : '';
        const instanceInfo = label.instances > 1 ? ` x${label.instances}` : '';
        return `<span class="tag">${label.name}${instanceInfo} <span class="confidence">${label.confidence}%${categoryInfo}</span></span>`;
    }).join('');
    
    document.getElementById('labelsResult').innerHTML = labelsHtml;
    document.getElementById('labelsCard').classList.add('has-content');
}

function displayColorPalette(colors) {
    if (!colors || colors.length === 0) return;
    
    const colorsHtml = colors.map(color => 
        `<div class="color-swatch" style="background-color: ${color.hex}" title="${color.color} (${color.pixel_percent}%)">
            ${color.pixel_percent.toFixed(1)}%
        </div>`
    ).join('');
    
    document.getElementById('colorsResult').innerHTML = `
        <div class="color-palette">${colorsHtml}</div>
        <p>Màu sắc được sắp xếp theo tỷ lệ xuất hiện trong ảnh</p>
    `;
    document.getElementById('colorsCard').classList.add('has-content');
}

function displayEnhancedFaces(faces) {
    if (!faces || faces.length === 0) return;
    
    const facesHtml = faces.map((face, index) => {
        const emotionsHtml = face.emotions.map(emotion => 
            `<div class="emotion-bar">
                <span class="emotion-name">${emotion.type}</span>
                <div class="emotion-progress">
                    <div class="emotion-fill" style="width: ${emotion.confidence}%"></div>
                </div>
                <span class="confidence">${emotion.confidence.toFixed(1)}%</span>
            </div>`
        ).join('');
        
        const attributes = [];
        if (face.attributes?.smile?.Value) attributes.push('😊 Có nụ cười');
        if (face.attributes?.eyeglasses?.Value) attributes.push('👓 Đeo kính');
        if (face.attributes?.beard?.Value) attributes.push('🧔 Có râu');
        if (face.attributes?.mustache?.Value) attributes.push('👨 Có ria mép');
        
        return `
            <div class="face-analysis">
                <h4>👤 Người ${index + 1}</h4>
                <p><strong>Giới tính:</strong> ${face.gender.value} (${face.gender.confidence.toFixed(1)}%)</p>
                <p><strong>Tuổi:</strong> ${face.age_range.Low}-${face.age_range.High} tuổi</p>
                ${attributes.length > 0 ? `<p><strong>Đặc điểm:</strong> ${attributes.join(', ')}</p>` : ''}
                <p><strong>Chất lượng:</strong> Độ sáng ${face.quality?.brightness?.toFixed(1)}%, Độ sắc nét ${face.quality?.sharpness?.toFixed(1)}%</p>
                <div style="margin-top: 10px;">
                    <strong>Cảm xúc:</strong>
                    ${emotionsHtml}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('facesResult').innerHTML = facesHtml;
    document.getElementById('facesCard').classList.add('has-content');
}

function displayCelebrities(celebrities) {
    if (!celebrities || celebrities.length === 0) return;
    
    const celebritiesHtml = celebrities.map(celeb => 
        `<div class="celebrity-card">
            <h4>⭐ ${celeb.name}</h4>
            <p>Độ tin cậy: ${celeb.confidence}%</p>
            ${celeb.urls?.length ? `<p>Thông tin: <a href="${celeb.urls[0]}" target="_blank">Xem thêm</a></p>` : ''}
        </div>`
    ).join('');
    
    document.getElementById('celebritiesResult').innerHTML = celebritiesHtml;
    document.getElementById('celebritiesCard').classList.add('has-content');
}

function displayTextDetection(textItems) {
    if (!textItems || textItems.length === 0) return;
    
    const textHtml = textItems.map(text => 
        `<span class="tag">${text.text} <span class="confidence">(${text.confidence}%)</span></span>`
    ).join('');
    
    document.getElementById('textResult').innerHTML = textHtml;
    document.getElementById('textCard').classList.add('has-content');
}

function displayArtisticAnalysis(advancedAnalysis) {
    if (!advancedAnalysis || !advancedAnalysis.artistic_analysis) return;
    
    const analysisHtml = `
        <div style="line-height: 1.6;">
            <p>${advancedAnalysis.artistic_analysis}</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666;">
                <strong>Phân tích bởi:</strong> ${advancedAnalysis.model_used || 'AI Analysis Engine'}
                ${advancedAnalysis.analysis_type ? ` | Loại: ${advancedAnalysis.analysis_type}` : ''}
                ${advancedAnalysis.note ? `<br><em>${advancedAnalysis.note}</em>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('artisticResult').innerHTML = analysisHtml;
    document.getElementById('artisticCard').classList.add('has-content');
}

// Enhanced chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateIntelligentResponse(message);
        addMessage(response, 'ai');
    }, 1500);
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.innerHTML = '💭 Amazon Q đang suy nghĩ...';
    typingDiv.id = 'typing-indicator';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateIntelligentResponse(question) {
    if (!analysisResults) {
        return "Hãy phân tích một bức ảnh trước để tôi có thể trả lời câu hỏi của bạn một cách chi tiết nhất.";
    }
    
    const { basic_analysis, advanced_analysis } = analysisResults;
    const lowerQuestion = question.toLowerCase();
    
    // Phân tích màu sắc
    if (lowerQuestion.includes('màu') || lowerQuestion.includes('color')) {
        const colors = basic_analysis.image_properties?.dominant_colors;
        if (colors && colors.length > 0) {
            const colorList = colors.map(c => `${c.color} (${c.pixel_percent.toFixed(1)}%)`).join(', ');
            return `Bức ảnh có ${colors.length} màu chủ đạo: ${colorList}. Màu ${colors[0].color} chiếm tỷ lệ cao nhất với ${colors[0].pixel_percent.toFixed(1)}% diện tích ảnh. Sự kết hợp màu sắc này tạo nên ${colors.length > 3 ? 'một bảng màu phong phú và đa dạng' : 'một tông màu hài hòa và cân bằng'}.`;
        }
        return "Tôi không thể phân tích chi tiết về màu sắc từ dữ liệu hiện tại, nhưng dựa trên phân tích tổng thể, ảnh có vẻ có tông màu cân bằng.";
    }
    
    // Phân tích cảm xúc
    if (lowerQuestion.includes('cảm xúc') || lowerQuestion.includes('emotion') || lowerQuestion.includes('tâm trạng')) {
        const faces = basic_analysis.faces;
        if (faces && faces.length > 0) {
            const face = faces[0];
            const topEmotion = face.emotions[0];
            const emotionAnalysis = face.emotions.slice(0, 3).map(e => `${e.type} (${e.confidence.toFixed(1)}%)`).join(', ');
            return `Trong ảnh, tôi phát hiện cảm xúc chủ đạo là ${topEmotion.type.toLowerCase()} với độ tin cậy ${topEmotion.confidence.toFixed(1)}%. Các cảm xúc khác bao gồm: ${emotionAnalysis}. ${topEmotion.type === 'HAPPY' ? 'Đây là một bức ảnh tích cực, thể hiện niềm vui và sự hài lòng.' : topEmotion.type === 'CALM' ? 'Bức ảnh truyền tải cảm giác bình yên và thư thái.' : 'Cảm xúc trong ảnh khá phức tạp và đa chiều.'}`;
        }
        return "Không phát hiện khuôn mặt rõ ràng để phân tích cảm xúc, nhưng tổng thể bức ảnh tạo cảm giác tích cực và hài hòa.";
    }
    
    // Phân tích composition
    if (lowerQuestion.includes('composition') || lowerQuestion.includes('bố cục') || lowerQuestion.includes('cấu trúc')) {
        const labels = basic_analysis.labels || [];
        const mainSubjects = labels.slice(0, 3).map(l => l.name).join(', ');
        return `Về composition, bức ảnh có bố cục ${labels.length > 5 ? 'phức tạp' : 'đơn giản'} với các yếu tố chính: ${mainSubjects}. ${advanced_analysis?.artistic_analysis ? 'Theo phân tích chi tiết: ' + advanced_analysis.artistic_analysis.split('.')[0] + '.' : 'Bố cục tổng thể cân đối và hài hòa.'} Điều này tạo nên một composition ${labels.some(l => l.categories?.includes('Photography')) ? 'chuyên nghiệp' : 'tự nhiên'}.`;
    }
    
    // Gợi ý cải thiện
    if (lowerQuestion.includes('cải thiện') || lowerQuestion.includes('improve') || lowerQuestion.includes('better')) {
        const faces = basic_analysis.faces;
        const colors = basic_analysis.image_properties?.dominant_colors;
        const suggestions = [];
        
        if (faces && faces.length > 0) {
            const avgBrightness = faces.reduce((sum, face) => sum + (face.quality?.brightness || 50), 0) / faces.length;
            if (avgBrightness < 60) suggestions.push('tăng độ sáng');
            if (avgBrightness > 85) suggestions.push('giảm độ sáng');
        }
        
        if (colors && colors.length < 3) suggestions.push('thêm điểm nhấn màu sắc');
        if (colors && colors.length > 6) suggestions.push('đơn giản hóa bảng màu');
        
        const labels = basic_analysis.labels || [];
        if (!labels.some(l => l.categories?.includes('Photography'))) {
            suggestions.push('cải thiện góc chụp');
        }
        
        if (suggestions.length > 0) {
            return `Để cải thiện bức ảnh, bạn có thể: ${suggestions.join(', ')}. ${advanced_analysis?.artistic_analysis ? 'Ngoài ra, ' + advanced_analysis.artistic_analysis.split('cải thiện')[1]?.split('.')[0] || 'hãy chú ý đến cân bằng tổng thể.' : 'Hãy thử điều chỉnh exposure và contrast để tối ưu chất lượng.'}`;
        }
        return "Bức ảnh đã có chất lượng tốt. Có thể thử điều chỉnh nhẹ về độ tương phản và độ bão hòa màu để tăng tính thu hút.";
    }
    
    // Phân tích kỹ thuật
    if (lowerQuestion.includes('kỹ thuật') || lowerQuestion.includes('technical') || lowerQuestion.includes('chụp')) {
        const faces = basic_analysis.faces;
        let technicalInfo = [];
        
        if (faces && faces.length > 0) {
            const avgSharpness = faces.reduce((sum, face) => sum + (face.quality?.sharpness || 50), 0) / faces.length;
            technicalInfo.push(`độ sắc nét ${avgSharpness.toFixed(1)}%`);
            
            const pose = faces[0].pose;
            if (Math.abs(pose?.yaw || 0) < 10) technicalInfo.push('góc chụp thẳng');
            else technicalInfo.push('góc chụp nghiêng');
        }
        
        const labels = basic_analysis.labels || [];
        if (labels.some(l => l.name.includes('Portrait'))) technicalInfo.push('kỹ thuật chân dung');
        if (labels.some(l => l.name.includes('Photography'))) technicalInfo.push('chất lượng chuyên nghiệp');
        
        return `Về mặt kỹ thuật, bức ảnh có ${technicalInfo.join(', ')}. ${advanced_analysis?.artistic_analysis ? advanced_analysis.artistic_analysis.split('Kỹ thuật')[1]?.split('.')[0] || 'Kỹ thuật chụp ổn định.' : 'Tổng thể kỹ thuật thực hiện tốt.'} Điều này cho thấy ${faces?.length ? 'người chụp có kinh nghiệm với chân dung' : 'kỹ năng nhiếp ảnh khá tốt'}.`;
    }
    
    // Phân tích tuổi
    if (lowerQuestion.includes('tuổi') || lowerQuestion.includes('age')) {
        const faces = basic_analysis.faces;
        if (faces && faces.length > 0) {
            const ageInfo = faces.map((face, i) => 
                `Người ${i + 1}: ${face.age_range.Low}-${face.age_range.High} tuổi (${face.gender.value})`
            ).join(', ');
            return `Phân tích độ tuổi: ${ageInfo}. ${faces.length === 1 ? 'Đây là một bức chân dung' : 'Đây là ảnh nhóm'} với ${faces.length === 1 ? 'chủ thể' : 'các chủ thể'} trong độ tuổi ${faces[0].age_range.Low < 30 ? 'trẻ' : faces[0].age_range.Low < 50 ? 'trung niên' : 'trưởng thành'}.`;
        }
        return "Không thể xác định độ tuổi chính xác do không phát hiện khuôn mặt rõ ràng trong ảnh.";
    }
    
    // Default intelligent response
    const labels = basic_analysis.labels || [];
    const faces = basic_analysis.faces || [];
    const mainElements = labels.slice(0, 2).map(l => l.name).join(' và ');
    
    return `Dựa trên phân tích chi tiết, bức ảnh ${mainElements ? `chứa ${mainElements}` : 'có composition thú vị'} ${faces.length > 0 ? `với ${faces.length} người` : ''}. ${advanced_analysis?.artistic_analysis ? advanced_analysis.artistic_analysis.split('.')[0] + '.' : 'Tổng thể ảnh có chất lượng tốt và cân bằng.'} Bạn có muốn tôi phân tích sâu hơn về khía cạnh nào cụ thể không?`;
}

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `❌ ${message}`;
    document.querySelector('.main-content').insertBefore(errorDiv, document.querySelector('.upload-section').nextSibling);
    setTimeout(() => errorDiv.remove(), 8000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.innerHTML = message;
    document.querySelector('.main-content').insertBefore(successDiv, document.querySelector('.upload-section').nextSibling);
    setTimeout(() => successDiv.remove(), 5000);
}

function showInfo(message) {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';
    infoDiv.innerHTML = `ℹ️ ${message}`;
    document.querySelector('.main-content').insertBefore(infoDiv, document.querySelector('.upload-section').nextSibling);
    setTimeout(() => infoDiv.remove(), 5000);
}

// Initialize
debugLog('Enhanced script loaded successfully');
console.log('🚀 Enhanced AI Image Analyzer initialized');
console.log('🔗 API Endpoint:', API_ENDPOINT);
console.log('📦 S3 Bucket:', BUCKET_NAME);
console.log('🌐 Enhanced features: Smart display, Intelligent chat, Comprehensive analysis');
