"""
Analysis Engine - Comprehensive image analysis with professional standards
"""
import boto3
import json
from .low_level_features import LowLevelFeatureExtractor
from .high_level_features import HighLevelFeatureExtractor
from .quality_metrics import QualityMetricsCalculator

class AnalysisEngine:
    def __init__(self):
        self.rekognition = boto3.client('rekognition')
        self.bedrock = boto3.client('bedrock-runtime')
        
        # Feature extractors
        self.low_level_extractor = LowLevelFeatureExtractor()
        self.high_level_extractor = HighLevelFeatureExtractor(self.rekognition)
        self.quality_calculator = QualityMetricsCalculator()
    
    def analyze_image(self, bucket, key):
        """Comprehensive image analysis following professional standards"""
        
        analysis_results = {
            'low_level_features': {},
            'high_level_features': {},
            'quality_metrics': {},
            'ai_analysis': {}
        }
        
        try:
            # 1. Low-level features (Color, Texture, Shape, Spatial)
            analysis_results['low_level_features'] = self.low_level_extractor.extract_features(bucket, key)
            
            # 2. High-level features (Deep features, Object detection, Segmentation)
            analysis_results['high_level_features'] = self.high_level_extractor.extract_features(bucket, key)
            
            # 3. Quality metrics (PSNR, SSIM, BRISQUE, etc.)
            analysis_results['quality_metrics'] = self.quality_calculator.calculate_metrics(bucket, key)
            
            # 4. AI-powered analysis (Bedrock)
            analysis_results['ai_analysis'] = self._get_ai_analysis(analysis_results)
            
        except Exception as e:
            print(f"Analysis Engine Error: {str(e)}")
            analysis_results['error'] = str(e)
        
        return analysis_results
    
    def _get_ai_analysis(self, features):
        """Get AI-powered analysis using Bedrock"""
        try:
            prompt = self._create_comprehensive_prompt(features)
            
            # Try multiple models
            models = [
                'anthropic.claude-3-haiku-20240307-v1:0',
                'anthropic.claude-v2:1'
            ]
            
            for model_id in models:
                try:
                    if 'claude-3' in model_id:
                        response = self.bedrock.invoke_model(
                            modelId=model_id,
                            body=json.dumps({
                                'anthropic_version': 'bedrock-2023-05-31',
                                'max_tokens': 2000,
                                'messages': [{
                                    'role': 'user',
                                    'content': prompt
                                }]
                            })
                        )
                        
                        response_body = json.loads(response['body'].read())
                        analysis = response_body['content'][0]['text']
                    else:
                        response = self.bedrock.invoke_model(
                            modelId=model_id,
                            body=json.dumps({
                                'prompt': f"\n\nHuman: {prompt}\n\nAssistant:",
                                'max_tokens_to_sample': 2000,
                                'temperature': 0.7
                            })
                        )
                        
                        response_body = json.loads(response['body'].read())
                        analysis = response_body['completion']
                    
                    return {
                        'professional_analysis': analysis.strip(),
                        'model_used': model_id,
                        'analysis_framework': 'comprehensive_professional'
                    }
                    
                except Exception as model_error:
                    print(f"Model {model_id} failed: {str(model_error)}")
                    continue
            
            # Fallback analysis
            return self._generate_professional_fallback(features)
            
        except Exception as e:
            print(f"AI Analysis error: {str(e)}")
            return self._generate_professional_fallback(features)
    
    def _create_comprehensive_prompt(self, features):
        """Create comprehensive analysis prompt based on extracted features"""
        
        low_level = features.get('low_level_features', {})
        high_level = features.get('high_level_features', {})
        quality = features.get('quality_metrics', {})
        
        prompt = f"""
        Bạn là chuyên gia phân tích ảnh chuyên nghiệp. Hãy phân tích bức ảnh dựa trên các đặc trưng kỹ thuật sau:

        🎨 ĐẶC TRƯNG CƠ BẢN (Low-level Features):
        - Màu sắc: {low_level.get('color_analysis', 'N/A')}
        - Kết cấu: {low_level.get('texture_analysis', 'N/A')}
        - Hình dạng: {low_level.get('shape_analysis', 'N/A')}
        - Không gian: {low_level.get('spatial_features', 'N/A')}

        🔍 ĐẶC TRƯNG NÂNG CAO (High-level Features):
        - Đối tượng: {high_level.get('objects', 'N/A')}
        - Khuôn mặt: {high_level.get('faces', 'N/A')}
        - Văn bản: {high_level.get('text', 'N/A')}
        - Phân đoạn: {high_level.get('segmentation', 'N/A')}

        📊 CHẤT LƯỢNG HÌNH ẢNH:
        - Độ sắc nét: {quality.get('sharpness', 'N/A')}
        - Độ tương phản: {quality.get('contrast', 'N/A')}
        - Độ sáng: {quality.get('brightness', 'N/A')}
        - Chỉ số chất lượng: {quality.get('quality_score', 'N/A')}

        📝 YÊU CẦU PHÂN TÍCH CHUYÊN NGHIỆP:
        1. Đánh giá kỹ thuật (Technical Assessment)
        2. Phân tích composition và thẩm mỹ (Aesthetic Analysis)
        3. Chất lượng hình ảnh (Image Quality)
        4. Đặc điểm nổi bật (Key Features)
        5. Gợi ý cải thiện chuyên nghiệp (Professional Recommendations)
        6. Ứng dụng thực tế (Practical Applications)

        Viết phân tích 6-8 câu, chuyên nghiệp nhưng dễ hiểu, bằng tiếng Việt.
        """
        
        return prompt
    
    def _generate_professional_fallback(self, features):
        """Generate professional fallback analysis"""
        
        low_level = features.get('low_level_features', {})
        high_level = features.get('high_level_features', {})
        quality = features.get('quality_metrics', {})
        
        analysis_parts = []
        
        # Technical assessment
        if quality.get('sharpness'):
            sharpness = quality['sharpness']
            if sharpness > 80:
                analysis_parts.append("Ảnh có độ sắc nét cao, chi tiết rõ ràng")
            elif sharpness > 60:
                analysis_parts.append("Độ sắc nét ở mức trung bình")
            else:
                analysis_parts.append("Cần cải thiện độ sắc nét")
        
        # Color analysis
        if low_level.get('color_analysis'):
            color_info = low_level['color_analysis']
            dominant_colors = color_info.get('dominant_colors', [])
            if len(dominant_colors) > 3:
                analysis_parts.append("với bảng màu phong phú và đa dạng")
            else:
                analysis_parts.append("với tông màu hài hòa và cân bằng")
        
        # Object analysis
        if high_level.get('objects'):
            objects = high_level['objects']
            if len(objects) > 5:
                analysis_parts.append("Composition phức tạp với nhiều yếu tố")
            else:
                analysis_parts.append("Composition đơn giản, tập trung")
        
        # Quality assessment
        if quality.get('quality_score'):
            score = quality['quality_score']
            if score > 80:
                analysis_parts.append("Chất lượng tổng thể xuất sắc")
            elif score > 60:
                analysis_parts.append("Chất lượng tốt")
            else:
                analysis_parts.append("Cần cải thiện chất lượng tổng thể")
        
        # Professional recommendations
        recommendations = []
        if quality.get('brightness', 50) < 40:
            recommendations.append("tăng độ sáng")
        if quality.get('contrast', 50) < 40:
            recommendations.append("cải thiện độ tương phản")
        if quality.get('sharpness', 50) < 60:
            recommendations.append("tăng độ sắc nét")
        
        if recommendations:
            analysis_parts.append(f"Gợi ý cải thiện: {', '.join(recommendations)}")
        
        # Combine analysis
        if analysis_parts:
            analysis = '. '.join(analysis_parts) + '.'
        else:
            analysis = "Đây là một bức ảnh có chất lượng tốt với composition cân đối. Kỹ thuật thực hiện ổn định, thể hiện được ý tưởng của tác giả. Có thể cải thiện thêm về độ tương phản và màu sắc để tăng tính thu hút."
        
        return {
            'professional_analysis': analysis,
            'model_used': 'Professional Fallback Analysis',
            'analysis_framework': 'rule_based_professional',
            'note': 'Phân tích dựa trên tiêu chí kỹ thuật chuyên nghiệp'
        }
