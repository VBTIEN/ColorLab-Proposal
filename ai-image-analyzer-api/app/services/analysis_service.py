"""
Analysis Service
AI-powered image analysis logic
"""

import json
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
import boto3
from botocore.exceptions import ClientError
import logging

from app.core.config import settings
from app.models.image import (
    ImageAnalysis, ColorInfo, HarmonyAnalysis, TemperatureAnalysis,
    MoodAnalysis, Recommendation, AnalysisType, ColorTemperature
)
from app.utils.aws_clients import AWSClients
from app.utils.color_analyzer import ColorAnalyzer
from app.utils.harmony_analyzer import HarmonyAnalyzer
from app.utils.mood_analyzer import MoodAnalyzer

logger = logging.getLogger(__name__)

class AnalysisService:
    """Service for AI-powered image analysis"""
    
    def __init__(self):
        self.aws_clients = AWSClients()
        self.color_analyzer = ColorAnalyzer()
        self.harmony_analyzer = HarmonyAnalyzer()
        self.mood_analyzer = MoodAnalyzer()
    
    async def analyze_image(
        self, 
        s3_key: str, 
        analysis_type: AnalysisType,
        options: Dict[str, Any] = None
    ) -> ImageAnalysis:
        """Perform comprehensive image analysis"""
        try:
            logger.info(f"🎨 Starting {analysis_type} analysis for {s3_key}")
            
            # Get image from S3 for analysis
            image_bytes = await self._get_image_from_s3(s3_key)
            
            # Perform AWS Rekognition analysis
            rekognition_data = await self._analyze_with_rekognition(s3_key)
            
            # Initialize analysis components
            dominant_colors = []
            color_harmony = None
            color_temperature = None
            mood_analysis = None
            recommendations = []
            
            # Perform analysis based on type
            if analysis_type in [AnalysisType.COMPREHENSIVE, AnalysisType.COLORS_ONLY]:
                dominant_colors = await self._analyze_colors(image_bytes, rekognition_data)
            
            if analysis_type in [AnalysisType.COMPREHENSIVE, AnalysisType.HARMONY_ONLY]:
                if dominant_colors or analysis_type == AnalysisType.HARMONY_ONLY:
                    if not dominant_colors:
                        dominant_colors = await self._analyze_colors(image_bytes, rekognition_data)
                    color_harmony = await self._analyze_harmony(dominant_colors)
            
            if analysis_type in [AnalysisType.COMPREHENSIVE, AnalysisType.TEMPERATURE_ONLY]:
                if dominant_colors or analysis_type == AnalysisType.TEMPERATURE_ONLY:
                    if not dominant_colors:
                        dominant_colors = await self._analyze_colors(image_bytes, rekognition_data)
                    color_temperature = await self._analyze_temperature(dominant_colors)
            
            if analysis_type in [AnalysisType.COMPREHENSIVE, AnalysisType.MOOD_ONLY]:
                if dominant_colors or analysis_type == AnalysisType.MOOD_ONLY:
                    if not dominant_colors:
                        dominant_colors = await self._analyze_colors(image_bytes, rekognition_data)
                    mood_analysis = await self._analyze_mood(
                        dominant_colors, color_harmony, color_temperature
                    )
            
            if analysis_type == AnalysisType.COMPREHENSIVE:
                recommendations = await self._generate_recommendations(
                    dominant_colors, color_harmony, color_temperature, mood_analysis
                )
            
            # Create analysis result
            analysis = ImageAnalysis(
                dominant_colors=dominant_colors,
                color_harmony=color_harmony,
                color_temperature=color_temperature,
                mood_analysis=mood_analysis,
                recommendations=recommendations,
                analysis_method="AWS Rekognition + Advanced Color Theory v12.0",
                accuracy_level="Professional",
                total_colors=len(dominant_colors)
            )
            
            logger.info(f"✅ Completed {analysis_type} analysis for {s3_key}")
            return analysis
            
        except Exception as e:
            logger.error(f"❌ Error analyzing image {s3_key}: {str(e)}")
            # Return fallback analysis
            return await self._create_fallback_analysis()
    
    async def _get_image_from_s3(self, s3_key: str) -> bytes:
        """Get image bytes from S3"""
        try:
            response = self.aws_clients.s3.get_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=s3_key
            )
            return response['Body'].read()
        except Exception as e:
            logger.error(f"❌ Error getting image from S3: {str(e)}")
            raise
    
    async def _analyze_with_rekognition(self, s3_key: str) -> Dict[str, Any]:
        """Analyze image with AWS Rekognition"""
        try:
            # Detect labels
            labels_response = self.aws_clients.rekognition.detect_labels(
                Image={
                    'S3Object': {
                        'Bucket': settings.S3_BUCKET_NAME,
                        'Name': s3_key
                    }
                },
                MaxLabels=settings.REKOGNITION_MAX_LABELS,
                MinConfidence=settings.REKOGNITION_MIN_CONFIDENCE
            )
            
            # Detect text (if available)
            try:
                text_response = self.aws_clients.rekognition.detect_text(
                    Image={
                        'S3Object': {
                            'Bucket': settings.S3_BUCKET_NAME,
                            'Name': s3_key
                        }
                    }
                )
            except Exception:
                text_response = {'TextDetections': []}
            
            # Detect faces (if available)
            try:
                faces_response = self.aws_clients.rekognition.detect_faces(
                    Image={
                        'S3Object': {
                            'Bucket': settings.S3_BUCKET_NAME,
                            'Name': s3_key
                        }
                    },
                    Attributes=['ALL']
                )
            except Exception:
                faces_response = {'FaceDetails': []}
            
            return {
                'labels': labels_response.get('Labels', []),
                'text': text_response.get('TextDetections', []),
                'faces': faces_response.get('FaceDetails', [])
            }
            
        except Exception as e:
            logger.error(f"❌ Error with Rekognition analysis: {str(e)}")
            return {'labels': [], 'text': [], 'faces': []}
    
    async def _analyze_colors(self, image_bytes: bytes, rekognition_data: Dict[str, Any]) -> List[ColorInfo]:
        """Analyze dominant colors"""
        try:
            # Extract colors from image
            base_colors = self.color_analyzer.extract_dominant_colors(image_bytes)
            
            # Enhance with Rekognition labels
            enhanced_colors = self.color_analyzer.enhance_with_labels(
                base_colors, rekognition_data['labels']
            )
            
            # Convert to ColorInfo objects
            color_infos = []
            for color_data in enhanced_colors:
                color_info = ColorInfo(
                    name=color_data['name'],
                    hex_code=color_data['hex_code'],
                    percentage=color_data['percentage'],
                    rgb=color_data['rgb'],
                    temperature=ColorTemperature(color_data['temperature']),
                    confidence=color_data.get('confidence')
                )
                color_infos.append(color_info)
            
            return color_infos[:6]  # Limit to 6 colors
            
        except Exception as e:
            logger.error(f"❌ Error analyzing colors: {str(e)}")
            return await self._create_fallback_colors()
    
    async def _analyze_harmony(self, colors: List[ColorInfo]) -> HarmonyAnalysis:
        """Analyze color harmony"""
        try:
            harmony_data = self.harmony_analyzer.analyze_harmony(colors)
            
            return HarmonyAnalysis(
                primary_harmony=harmony_data['primary_harmony'],
                secondary_harmony=harmony_data['secondary_harmony'],
                harmony_score=harmony_data['harmony_score'],
                color_relationships=harmony_data['color_relationships'],
                balance_analysis=harmony_data['balance_analysis'],
                contrast_analysis=harmony_data['contrast_analysis']
            )
            
        except Exception as e:
            logger.error(f"❌ Error analyzing harmony: {str(e)}")
            return await self._create_fallback_harmony()
    
    async def _analyze_temperature(self, colors: List[ColorInfo]) -> TemperatureAnalysis:
        """Analyze color temperature"""
        try:
            temp_data = self.color_analyzer.analyze_temperature(colors)
            
            return TemperatureAnalysis(
                overall_temperature=ColorTemperature(temp_data['overall_temperature']),
                temperature_score=temp_data['temperature_score'],
                description=temp_data['description'],
                warm_colors=temp_data['warm_colors'],
                cool_colors=temp_data['cool_colors'],
                neutral_colors=temp_data['neutral_colors'],
                temperature_balance=temp_data['temperature_balance']
            )
            
        except Exception as e:
            logger.error(f"❌ Error analyzing temperature: {str(e)}")
            return await self._create_fallback_temperature()
    
    async def _analyze_mood(
        self, 
        colors: List[ColorInfo],
        harmony: Optional[HarmonyAnalysis],
        temperature: Optional[TemperatureAnalysis]
    ) -> MoodAnalysis:
        """Analyze mood and emotions"""
        try:
            mood_data = self.mood_analyzer.analyze_mood(colors, harmony, temperature)
            
            return MoodAnalysis(
                primary_mood=mood_data['primary_mood'],
                secondary_moods=mood_data['secondary_moods'],
                mood_description=mood_data['mood_description'],
                emotional_impact=mood_data['emotional_impact']
            )
            
        except Exception as e:
            logger.error(f"❌ Error analyzing mood: {str(e)}")
            return await self._create_fallback_mood()
    
    async def _generate_recommendations(
        self,
        colors: List[ColorInfo],
        harmony: Optional[HarmonyAnalysis],
        temperature: Optional[TemperatureAnalysis],
        mood: Optional[MoodAnalysis]
    ) -> List[Recommendation]:
        """Generate professional recommendations"""
        try:
            recommendations = []
            
            # Harmony-based recommendations
            if harmony and harmony.harmony_score < 60:
                recommendations.append(Recommendation(
                    type="Harmony Improvement",
                    suggestion="Cân bằng lại màu sắc để tạo hài hòa tốt hơn",
                    details="Xem xét sử dụng màu sắc theo quy tắc hài hòa như complementary hoặc analogous"
                ))
            
            # Temperature-based recommendations
            if temperature:
                if temperature.temperature_balance < 0.3:
                    recommendations.append(Recommendation(
                        type="Temperature Balance",
                        suggestion="Thêm màu ấm để tạo cân bằng nhiệt độ",
                        details="Màu ấm như đỏ, cam, vàng sẽ tạo cảm giác gần gũi hơn"
                    ))
                elif temperature.temperature_balance > 0.7:
                    recommendations.append(Recommendation(
                        type="Temperature Balance",
                        suggestion="Thêm màu lạnh để tạo cân bằng nhiệt độ",
                        details="Màu lạnh như xanh dương, xanh lá sẽ tạo cảm giác tĩnh lặng hơn"
                    ))
            
            # Color count recommendations
            if len(colors) > 5:
                recommendations.append(Recommendation(
                    type="Color Simplification",
                    suggestion="Giảm số lượng màu để tạo sự tập trung",
                    details="Quá nhiều màu có thể tạo cảm giác rối mắt, nên giới hạn 3-5 màu chính"
                ))
            
            # Application-specific recommendations
            if temperature and temperature.overall_temperature == ColorTemperature.WARM:
                recommendations.append(Recommendation(
                    type="Application",
                    suggestion="Thích hợp cho brand năng động, thân thiện",
                    details="Màu ấm tạo cảm giác gần gũi, phù hợp với F&B, giải trí"
                ))
            elif temperature and temperature.overall_temperature == ColorTemperature.COOL:
                recommendations.append(Recommendation(
                    type="Application",
                    suggestion="Thích hợp cho brand chuyên nghiệp, công nghệ",
                    details="Màu lạnh tạo cảm giác tin cậy, phù hợp với tài chính, y tế"
                ))
            
            return recommendations[:5]  # Limit to 5 recommendations
            
        except Exception as e:
            logger.error(f"❌ Error generating recommendations: {str(e)}")
            return []
    
    # Fallback methods
    async def _create_fallback_analysis(self) -> ImageAnalysis:
        """Create fallback analysis when main analysis fails"""
        fallback_colors = await self._create_fallback_colors()
        
        return ImageAnalysis(
            dominant_colors=fallback_colors,
            color_harmony=await self._create_fallback_harmony(),
            color_temperature=await self._create_fallback_temperature(),
            mood_analysis=await self._create_fallback_mood(),
            recommendations=[
                Recommendation(
                    type="General",
                    suggestion="Thêm màu sắc để tạo sự thú vị",
                    details="Màu sắc hiện tại khá trung tính"
                )
            ],
            analysis_method="Fallback Analysis v12.0",
            accuracy_level="Basic",
            total_colors=3
        )
    
    async def _create_fallback_colors(self) -> List[ColorInfo]:
        """Create fallback color analysis"""
        return [
            ColorInfo(
                name="Xám",
                hex_code="#808080",
                percentage=50.0,
                rgb=[128, 128, 128],
                temperature=ColorTemperature.NEUTRAL,
                confidence=60.0
            ),
            ColorInfo(
                name="Trắng",
                hex_code="#FFFFFF",
                percentage=30.0,
                rgb=[255, 255, 255],
                temperature=ColorTemperature.NEUTRAL,
                confidence=70.0
            ),
            ColorInfo(
                name="Đen",
                hex_code="#000000",
                percentage=20.0,
                rgb=[0, 0, 0],
                temperature=ColorTemperature.NEUTRAL,
                confidence=65.0
            )
        ]
    
    async def _create_fallback_harmony(self) -> HarmonyAnalysis:
        """Create fallback harmony analysis"""
        return HarmonyAnalysis(
            primary_harmony={
                "type": "Monochromatic",
                "description": "Đơn sắc cơ bản"
            },
            secondary_harmony=["None"],
            harmony_score=60,
            color_relationships=["Không có mối quan hệ đặc biệt"],
            balance_analysis={
                "balance_type": "Balanced",
                "description": "Cân bằng cơ bản"
            },
            contrast_analysis={
                "contrast_level": "Medium",
                "description": "Tương phản vừa phải"
            }
        )
    
    async def _create_fallback_temperature(self) -> TemperatureAnalysis:
        """Create fallback temperature analysis"""
        return TemperatureAnalysis(
            overall_temperature=ColorTemperature.NEUTRAL,
            temperature_score=0.0,
            description="Trung tính - cân bằng cơ bản",
            warm_colors=0,
            cool_colors=0,
            neutral_colors=3,
            temperature_balance=0.5
        )
    
    async def _create_fallback_mood(self) -> MoodAnalysis:
        """Create fallback mood analysis"""
        return MoodAnalysis(
            primary_mood="neutral",
            secondary_moods=["balanced"],
            mood_description="Trung tính, cân bằng",
            emotional_impact={
                "level": "Low",
                "description": "Tác động nhẹ"
            }
        )

# Create global service instance
analysis_service = AnalysisService()
