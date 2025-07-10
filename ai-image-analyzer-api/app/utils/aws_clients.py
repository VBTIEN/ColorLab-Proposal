"""
AWS Clients Management
Centralized AWS service clients
"""

import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AWSClients:
    """Singleton class for AWS service clients"""
    
    _instance = None
    _clients = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AWSClients, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.initialized = True
            self._setup_clients()
    
    def _setup_clients(self):
        """Initialize AWS service clients"""
        try:
            aws_config = settings.get_aws_config()
            
            # S3 Client
            self._clients['s3'] = boto3.client('s3', **aws_config)
            
            # Rekognition Client
            self._clients['rekognition'] = boto3.client('rekognition', **aws_config)
            
            # Bedrock Client (if available)
            try:
                self._clients['bedrock'] = boto3.client('bedrock-runtime', **aws_config)
            except Exception as e:
                logger.warning(f"Bedrock client not available: {str(e)}")
            
            # Lambda Client
            self._clients['lambda'] = boto3.client('lambda', **aws_config)
            
            logger.info("✅ AWS clients initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Error initializing AWS clients: {str(e)}")
            raise
    
    @property
    def s3(self):
        """Get S3 client"""
        return self._clients['s3']
    
    @property
    def rekognition(self):
        """Get Rekognition client"""
        return self._clients['rekognition']
    
    @property
    def bedrock(self):
        """Get Bedrock client"""
        return self._clients.get('bedrock')
    
    @property
    def lambda_client(self):
        """Get Lambda client"""
        return self._clients['lambda']
    
    def test_connections(self):
        """Test all AWS service connections"""
        results = {}
        
        # Test S3
        try:
            self.s3.head_bucket(Bucket=settings.S3_BUCKET_NAME)
            results['s3'] = 'connected'
        except ClientError as e:
            results['s3'] = f'error: {str(e)}'
        
        # Test Rekognition
        try:
            self.rekognition.describe_collection(CollectionId='test')
            results['rekognition'] = 'connected'
        except ClientError:
            results['rekognition'] = 'available'  # Service exists
        
        # Test Bedrock
        if self.bedrock:
            try:
                self.bedrock.list_foundation_models()
                results['bedrock'] = 'connected'
            except ClientError as e:
                results['bedrock'] = f'error: {str(e)}'
        else:
            results['bedrock'] = 'not_available'
        
        return results
