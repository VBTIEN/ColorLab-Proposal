"""
Professional AI Analysis Engine
Advanced image analysis with sophisticated AI reasoning
"""
import boto3
import json
import numpy as np
from datetime import datetime

class ProfessionalAIEngine:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime')
        self.analysis_frameworks = {
            'photography': self._photography_framework,
            'art_analysis': self._art_analysis_framework,
            'technical_quality': self._technical_quality_framework,
            'composition': self._composition_framework,
            'color_theory': self._color_theory_framework
        }
    
    def comprehensive_analysis(self, image_data, technical_metrics):
        """
        Perform comprehensive professional analysis using multiple AI frameworks
        """
        try:
            # Multi-framework analysis
            analyses = {}
            
            for framework_name, framework_func in self.analysis_frameworks.items():
                try:
                    analysis = framework_func(image_data, technical_metrics)
                    analyses[framework_name] = analysis
                except Exception as e:
                    print(f"Framework {framework_name} failed: {str(e)}")
                    analyses[framework_name] = {'error': str(e)}
            
            # Synthesize comprehensive analysis
            final_analysis = self._synthesize_analysis(analyses, technical_metrics)
            
            return {
                'comprehensive_analysis': final_analysis,
                'framework_analyses': analyses,
                'analysis_quality': 'professional',
                'confidence_score': self._calculate_confidence(analyses),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Professional AI Engine error: {str(e)}")
            return self._fallback_professional_analysis(technical_metrics)
    
    def _photography_framework(self, image_data, metrics):
        """Photography-focused analysis framework"""
        
        prompt = self._create_photography_prompt(image_data, metrics)
        
        return self._call_bedrock_with_advanced_prompt(
            prompt, 
            "photography_expert",
            temperature=0.3,  # Lower temperature for technical accuracy
            max_tokens=1500
        )
    
    def _art_analysis_framework(self, image_data, metrics):
        """Art and aesthetic analysis framework"""
        
        prompt = self._create_art_analysis_prompt(image_data, metrics)
        
        return self._call_bedrock_with_advanced_prompt(
            prompt,
            "art_critic",
            temperature=0.5,  # Moderate temperature for creative analysis
            max_tokens=1200
        )
    
    def _technical_quality_framework(self, image_data, metrics):
        """Technical quality assessment framework"""
        
        prompt = self._create_technical_prompt(image_data, metrics)
        
        return self._call_bedrock_with_advanced_prompt(
            prompt,
            "technical_expert",
            temperature=0.2,  # Very low temperature for precise technical analysis
            max_tokens=1000
        )
    
    def _composition_framework(self, image_data, metrics):
        """Composition and visual design framework"""
        
        prompt = self._create_composition_prompt(image_data, metrics)
        
        return self._call_bedrock_with_advanced_prompt(
            prompt,
            "composition_expert",
            temperature=0.4,
            max_tokens=1200
        )
    
    def _color_theory_framework(self, image_data, metrics):
        """Color theory and psychology framework"""
        
        prompt = self._create_color_theory_prompt(image_data, metrics)
        
        return self._call_bedrock_with_advanced_prompt(
            prompt,
            "color_theorist",
            temperature=0.4,
            max_tokens=1000
        )
    
    def _create_photography_prompt(self, image_data, metrics):
        """Create sophisticated photography analysis prompt"""
        
        # Extract key technical data
        quality_metrics = metrics.get('quality_metrics', {})
        color_analysis = metrics.get('low_level_features', {}).get('color_analysis', {})
        objects = metrics.get('high_level_features', {}).get('objects', [])
        faces = metrics.get('high_level_features', {}).get('faces', [])
        
        # Determine image category
        image_category = self._categorize_image(objects, faces)
        
        prompt = f"""
        Bạn là một nhiếp ảnh gia chuyên nghiệp với 20 năm kinh nghiệm, được đào tạo bài bản về kỹ thuật và thẩm mỹ nhiếp ảnh. Hãy phân tích bức ảnh {image_category} này với góc nhìn chuyên nghiệp.

        📊 DỮ LIỆU KỸ THUẬT:
        - Độ sáng: {quality_metrics.get('brightness', 'N/A')}
        - Độ sắc nét: {quality_metrics.get('sharpness', 'N/A')}
        - Độ tương phản: {quality_metrics.get('contrast', 'N/A')}
        - Điểm chất lượng tổng thể: {quality_metrics.get('overall_quality_score', 'N/A')}
        - Màu sắc chủ đạo: {self._format_colors(color_analysis.get('dominant_colors', []))}
        - Đối tượng chính: {self._format_objects(objects[:5])}
        - Số người: {len(faces)}

        🎯 YÊU CẦU PHÂN TÍCH CHUYÊN NGHIỆP:

        1. **ĐÁNH GIÁ KỸ THUẬT** (Technical Assessment):
           - Phân tích exposure, focus, và depth of field
           - Đánh giá noise, dynamic range, và color accuracy
           - Nhận xét về camera settings và lens characteristics

        2. **COMPOSITION ANALYSIS**:
           - Rule of thirds, leading lines, framing
           - Balance, symmetry, và visual weight distribution
           - Foreground, middle ground, background relationship

        3. **LIGHTING ANALYSIS**:
           - Chất lượng và hướng ánh sáng
           - Hard vs soft light, color temperature
           - Shadow và highlight management

        4. **AESTHETIC EVALUATION**:
           - Visual impact và emotional response
           - Style và genre classification
           - Artistic merit và creative execution

        5. **PROFESSIONAL RECOMMENDATIONS**:
           - Cải thiện kỹ thuật cụ thể
           - Alternative shooting approaches
           - Post-processing suggestions

        Viết phân tích 6-8 câu, sử dụng thuật ngữ chuyên nghiệp nhưng dễ hiểu. Tập trung vào insights sâu sắc và practical advice.
        """
        
        return prompt
    
    def _create_art_analysis_prompt(self, image_data, metrics):
        """Create sophisticated art analysis prompt"""
        
        color_analysis = metrics.get('low_level_features', {}).get('color_analysis', {})
        spatial_features = metrics.get('low_level_features', {}).get('spatial_features', {})
        
        prompt = f"""
        Bạn là một nhà phê bình nghệ thuật và giáo sư mỹ thuật với chuyên môn sâu về lý thuyết màu sắc, composition, và tâm lý học thị giác.

        🎨 DỮ LIỆU THẨM MỸ:
        - Harmony màu sắc: {color_analysis.get('color_harmony', {}).get('harmony_type', 'N/A')}
        - Điểm harmony: {color_analysis.get('color_harmony', {}).get('harmony_score', 'N/A')}
        - Composition type: {spatial_features.get('composition_type', 'N/A')}
        - Balance score: {spatial_features.get('balance_score', 'N/A')}
        - Focal points: {spatial_features.get('focal_points', 'N/A')}

        🎭 PHÂN TÍCH NGHỆ THUẬT CHUYÊN SÂU:

        1. **COLOR PSYCHOLOGY & THEORY**:
           - Ý nghĩa tâm lý của color palette
           - Color relationships và emotional impact
           - Cultural và symbolic associations

        2. **VISUAL HIERARCHY & FLOW**:
           - Eye movement patterns
           - Visual emphasis và focal points
           - Gestalt principles application

        3. **AESTHETIC PHILOSOPHY**:
           - Art movement influences
           - Style classification và historical context
           - Conceptual depth và meaning

        4. **EMOTIONAL RESONANCE**:
           - Mood và atmosphere creation
           - Viewer engagement strategies
           - Psychological impact assessment

        5. **ARTISTIC MERIT**:
           - Originality và creative vision
           - Technical skill demonstration
           - Cultural và social relevance

        Phân tích với góc nhìn của một art critic chuyên nghiệp, sử dụng terminology chính xác và insights sâu sắc.
        """
        
        return prompt
    
    def _create_technical_prompt(self, image_data, metrics):
        """Create technical quality assessment prompt"""
        
        quality_metrics = metrics.get('quality_metrics', {})
        
        prompt = f"""
        Bạn là một kỹ sư hình ảnh và technical director với expertise về image processing, optics, và digital imaging technology.

        🔬 TECHNICAL SPECIFICATIONS:
        - Brightness: {quality_metrics.get('brightness', 'N/A')}
        - Sharpness: {quality_metrics.get('sharpness', 'N/A')}
        - Contrast: {quality_metrics.get('contrast', 'N/A')}
        - Quality Category: {quality_metrics.get('quality_category', 'N/A')}
        - Technical Assessment: {quality_metrics.get('technical_assessment', {})}

        ⚙️ TECHNICAL ANALYSIS FRAMEWORK:

        1. **IMAGE QUALITY METRICS**:
           - SNR (Signal-to-Noise Ratio) assessment
           - MTF (Modulation Transfer Function) analysis
           - Dynamic range evaluation

        2. **OPTICAL CHARACTERISTICS**:
           - Lens performance indicators
           - Aberration analysis (chromatic, spherical)
           - Distortion và vignetting assessment

        3. **DIGITAL PROCESSING QUALITY**:
           - Compression artifacts detection
           - Color space và gamut analysis
           - Bit depth và tonal range evaluation

        4. **TECHNICAL STANDARDS COMPLIANCE**:
           - Industry standard benchmarks
           - Professional workflow compatibility
           - Print và display optimization

        5. **IMPROVEMENT RECOMMENDATIONS**:
           - Specific technical adjustments
           - Equipment upgrade suggestions
           - Workflow optimization tips

        Phân tích với độ chính xác kỹ thuật cao, sử dụng metrics cụ thể và professional terminology.
        """
        
        return prompt
    
    def _create_composition_prompt(self, image_data, metrics):
        """Create composition analysis prompt"""
        
        spatial_features = metrics.get('low_level_features', {}).get('spatial_features', {})
        
        prompt = f"""
        Bạn là một visual design expert và composition specialist với background về graphic design, photography, và visual communication.

        📐 COMPOSITION DATA:
        - Composition Analysis: {spatial_features.get('composition_analysis', {})}
        - Visual Center of Mass: {spatial_features.get('spatial_distribution', {}).get('visual_center_of_mass', {})}
        - Focal Points: {spatial_features.get('focal_points', {})}

        🎯 COMPOSITION ANALYSIS FRAMEWORK:

        1. **GEOMETRIC PRINCIPLES**:
           - Rule of thirds application
           - Golden ratio và fibonacci spirals
           - Symmetry và asymmetry balance

        2. **VISUAL WEIGHT DISTRIBUTION**:
           - Element placement strategy
           - Negative space utilization
           - Visual tension creation

        3. **DEPTH & DIMENSION**:
           - Layering techniques
           - Perspective và vanishing points
           - Foreground/background relationships

        4. **MOVEMENT & RHYTHM**:
           - Leading lines effectiveness
           - Pattern và repetition usage
           - Visual flow optimization

        5. **DESIGN PRINCIPLES**:
           - Unity và coherence
           - Contrast và emphasis
           - Proportion và scale relationships

        Phân tích với expertise của một professional designer, focusing on actionable composition insights.
        """
        
        return prompt
    
    def _create_color_theory_prompt(self, image_data, metrics):
        """Create color theory analysis prompt"""
        
        color_analysis = metrics.get('low_level_features', {}).get('color_analysis', {})
        
        prompt = f"""
        Bạn là một color theorist và visual psychology expert với deep knowledge về color science, perception, và cultural color meanings.

        🌈 COLOR DATA:
        - Dominant Colors: {color_analysis.get('dominant_colors', [])}
        - Color Harmony: {color_analysis.get('color_harmony', {})}
        - Brightness Stats: {color_analysis.get('brightness_stats', {})}
        - Saturation Stats: {color_analysis.get('saturation_stats', {})}

        🎨 COLOR THEORY ANALYSIS:

        1. **COLOR SCIENCE**:
           - Hue, saturation, brightness relationships
           - Color temperature analysis
           - Chromatic và achromatic balance

        2. **PSYCHOLOGICAL IMPACT**:
           - Emotional responses to color combinations
           - Cultural color associations
           - Mood và atmosphere creation

        3. **HARMONY PRINCIPLES**:
           - Complementary, analogous, triadic schemes
           - Color discord và tension effects
           - Palette sophistication level

        4. **PERCEPTUAL EFFECTS**:
           - Simultaneous contrast phenomena
           - Color constancy considerations
           - Visual comfort và accessibility

        5. **PROFESSIONAL APPLICATION**:
           - Brand identity implications
           - Market psychology considerations
           - Cross-cultural color meanings

        Phân tích với scientific rigor và practical color expertise.
        """
        
        return prompt
    
    def _call_bedrock_with_advanced_prompt(self, prompt, expert_role, temperature=0.5, max_tokens=1200):
        """Call Bedrock with advanced prompting techniques"""
        
        try:
            # Enhanced system prompt for role-playing
            system_prompt = f"""
            Bạn đang đóng vai một {expert_role} hàng đầu thế giới. Hãy phân tích với:
            - Chuyên môn sâu và kinh nghiệm thực tế
            - Terminology chính xác và professional
            - Insights độc đáo và actionable advice
            - Balanced perspective giữa technical và creative
            - Vietnamese fluency với international expertise
            """
            
            # Try Claude 3 first
            models_to_try = [
                'anthropic.claude-3-sonnet-20240229-v1:0',
                'anthropic.claude-3-haiku-20240307-v1:0',
                'anthropic.claude-v2:1'
            ]
            
            for model_id in models_to_try:
                try:
                    if 'claude-3' in model_id:
                        response = self.bedrock.invoke_model(
                            modelId=model_id,
                            body=json.dumps({
                                'anthropic_version': 'bedrock-2023-05-31',
                                'max_tokens': max_tokens,
                                'temperature': temperature,
                                'system': system_prompt,
                                'messages': [
                                    {
                                        'role': 'user',
                                        'content': prompt
                                    }
                                ]
                            })
                        )
                        
                        response_body = json.loads(response['body'].read())
                        analysis = response_body['content'][0]['text']
                        
                    else:
                        # Claude 2 format
                        full_prompt = f"{system_prompt}\n\nHuman: {prompt}\n\nAssistant:"
                        
                        response = self.bedrock.invoke_model(
                            modelId=model_id,
                            body=json.dumps({
                                'prompt': full_prompt,
                                'max_tokens_to_sample': max_tokens,
                                'temperature': temperature,
                                'top_p': 0.9,
                                'stop_sequences': ['\n\nHuman:']
                            })
                        )
                        
                        response_body = json.loads(response['body'].read())
                        analysis = response_body['completion']
                    
                    return {
                        'analysis': analysis.strip(),
                        'model_used': model_id,
                        'expert_role': expert_role,
                        'confidence': 'high',
                        'temperature': temperature
                    }
                    
                except Exception as model_error:
                    print(f"Model {model_id} failed: {str(model_error)}")
                    continue
            
            raise Exception("All Bedrock models failed")
            
        except Exception as e:
            print(f"Advanced Bedrock call failed: {str(e)}")
            return {
                'analysis': f"Advanced AI analysis temporarily unavailable. Error: {str(e)}",
                'model_used': 'fallback',
                'expert_role': expert_role,
                'confidence': 'low'
            }
    
    def _synthesize_analysis(self, analyses, technical_metrics):
        """Synthesize multiple framework analyses into comprehensive assessment"""
        
        try:
            # Extract successful analyses
            successful_analyses = {k: v for k, v in analyses.items() 
                                 if 'error' not in v and 'analysis' in v}
            
            if not successful_analyses:
                return self._fallback_professional_analysis(technical_metrics)
            
            # Create synthesis prompt
            synthesis_prompt = f"""
            Bạn là một Master Analyst với expertise tổng hợp từ nhiều chuyên gia. Hãy tổng hợp các phân tích chuyên môn sau thành một đánh giá toàn diện:

            📊 CÁC PHÂN TÍCH CHUYÊN MÔN:
            """
            
            for framework, analysis in successful_analyses.items():
                synthesis_prompt += f"\n\n🔹 {framework.upper()}:\n{analysis.get('analysis', '')}"
            
            synthesis_prompt += f"""

            🎯 YÊU CẦU TỔNG HỢP:
            1. Tạo một đánh giá tổng thể coherent và professional
            2. Highlight những insights quan trọng nhất
            3. Resolve bất kỳ contradictions nào giữa các analyses
            4. Provide actionable recommendations
            5. Maintain professional tone và technical accuracy

            Viết 1 đoạn văn 6-8 câu, tổng hợp tinh hoa từ tất cả các góc nhìn chuyên môn.
            """
            
            # Call Bedrock for synthesis
            synthesis_result = self._call_bedrock_with_advanced_prompt(
                synthesis_prompt,
                "master_analyst",
                temperature=0.4,
                max_tokens=1000
            )
            
            return {
                'comprehensive_analysis': synthesis_result.get('analysis', ''),
                'synthesis_quality': 'high',
                'frameworks_used': list(successful_analyses.keys()),
                'model_used': synthesis_result.get('model_used', 'unknown')
            }
            
        except Exception as e:
            print(f"Synthesis failed: {str(e)}")
            return self._fallback_professional_analysis(technical_metrics)
    
    def _calculate_confidence(self, analyses):
        """Calculate overall confidence score based on successful analyses"""
        
        successful_count = sum(1 for analysis in analyses.values() 
                             if 'error' not in analysis and 'analysis' in analysis)
        total_frameworks = len(analyses)
        
        base_confidence = (successful_count / total_frameworks) * 100
        
        # Adjust based on analysis quality indicators
        quality_bonus = 0
        for analysis in analyses.values():
            if analysis.get('confidence') == 'high':
                quality_bonus += 10
            elif analysis.get('confidence') == 'medium':
                quality_bonus += 5
        
        final_confidence = min(100, base_confidence + quality_bonus)
        
        return round(final_confidence, 1)
    
    def _categorize_image(self, objects, faces):
        """Categorize image type for specialized analysis"""
        
        if len(faces) > 0:
            return "chân dung" if len(faces) == 1 else "ảnh nhóm"
        
        object_names = [obj.get('name', '').lower() for obj in objects[:5]]
        
        nature_keywords = ['landscape', 'mountain', 'tree', 'sky', 'water', 'nature']
        architecture_keywords = ['building', 'architecture', 'house', 'bridge']
        street_keywords = ['street', 'car', 'road', 'urban', 'city']
        
        if any(keyword in ' '.join(object_names) for keyword in nature_keywords):
            return "phong cảnh tự nhiên"
        elif any(keyword in ' '.join(object_names) for keyword in architecture_keywords):
            return "kiến trúc"
        elif any(keyword in ' '.join(object_names) for keyword in street_keywords):
            return "street photography"
        else:
            return "nghệ thuật tổng hợp"
    
    def _format_colors(self, colors):
        """Format color data for prompt"""
        if not colors:
            return "Không xác định"
        
        return ", ".join([f"{color.get('color', 'Unknown')} ({color.get('pixel_percent', 0):.1f}%)" 
                         for color in colors[:3]])
    
    def _format_objects(self, objects):
        """Format object data for prompt"""
        if not objects:
            return "Không xác định"
        
        return ", ".join([f"{obj.get('name', 'Unknown')} ({obj.get('confidence', 0):.1f}%)" 
                         for obj in objects])
    
    def _fallback_professional_analysis(self, technical_metrics):
        """Professional fallback analysis when AI fails"""
        
        quality_metrics = technical_metrics.get('quality_metrics', {})
        color_analysis = technical_metrics.get('low_level_features', {}).get('color_analysis', {})
        
        # Rule-based professional analysis
        analysis_parts = []
        
        # Technical assessment
        brightness = quality_metrics.get('brightness', 50)
        sharpness = quality_metrics.get('sharpness', 50)
        contrast = quality_metrics.get('contrast', 50)
        
        if sharpness > 80:
            analysis_parts.append("Ảnh thể hiện độ sắc nét xuất sắc với chi tiết rõ ràng, cho thấy kỹ thuật focus chính xác")
        elif sharpness > 60:
            analysis_parts.append("Độ sắc nét ở mức tốt, phù hợp với mục đích sử dụng chuyên nghiệp")
        else:
            analysis_parts.append("Cần cải thiện độ sắc nét để đạt tiêu chuẩn chuyên nghiệp")
        
        # Color analysis
        dominant_colors = color_analysis.get('dominant_colors', [])
        if len(dominant_colors) >= 3:
            analysis_parts.append("Bảng màu phong phú tạo visual interest cao, thể hiện sự hiểu biết về color theory")
        elif len(dominant_colors) >= 2:
            analysis_parts.append("Color palette hài hòa với tông màu cân bằng, phù hợp với aesthetic hiện đại")
        
        # Composition assessment
        if quality_metrics.get('overall_quality_score', 50) > 70:
            analysis_parts.append("Composition tổng thể đạt tiêu chuẩn chuyên nghiệp với technical execution tốt")
        
        # Professional recommendations
        recommendations = []
        if brightness < 40:
            recommendations.append("điều chỉnh exposure để tối ưu dynamic range")
        if contrast < 40:
            recommendations.append("tăng cường contrast để improve visual impact")
        
        if recommendations:
            analysis_parts.append(f"Gợi ý chuyên nghiệp: {', '.join(recommendations)}")
        
        final_analysis = ". ".join(analysis_parts) + "."
        
        return {
            'comprehensive_analysis': final_analysis,
            'synthesis_quality': 'rule_based',
            'frameworks_used': ['technical_assessment', 'color_theory', 'composition'],
            'model_used': 'Professional Rule-based Analysis'
        }
