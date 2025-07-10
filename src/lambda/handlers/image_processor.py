"""
Image Processor - Handles image upload and analysis coordination
"""
import base64
import uuid
from datetime import datetime
from .s3_manager import S3Manager
from .analysis_engine import AnalysisEngine

class ImageProcessor:
    def __init__(self):
        self.s3_manager = S3Manager()
        self.analysis_engine = AnalysisEngine()
    
    def process_image(self, bucket, image_data, context):
        """Process image through complete analysis pipeline"""
        
        # Generate unique key for image
        image_key = self._generate_image_key()
        
        # Upload image to S3
        s3_url = self.s3_manager.upload_image(bucket, image_key, image_data)
        
        # Perform comprehensive analysis
        analysis_results = self.analysis_engine.analyze_image(bucket, image_key)
        
        # Build final result
        result = {
            'image': s3_url,
            'analysis_results': analysis_results,
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'request_id': context.aws_request_id,
                'processing_version': '2.0'
            }
        }
        
        return result
    
    def _generate_image_key(self):
        """Generate unique S3 key for image"""
        timestamp = datetime.now().strftime('%Y/%m/%d')
        unique_id = str(uuid.uuid4())
        return f"uploads/{timestamp}/{unique_id}.jpg"
