"""
Service Tests
Unit tests cho business logic services
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.services.image_service import image_service
from app.services.analysis_service import analysis_service
from app.models.image import AnalysisType, ImageStatus

class TestImageService:
    """Test image service functionality"""
    
    @pytest.mark.asyncio
    async def test_validate_image_data_valid(self):
        """Test image data validation with valid data"""
        # Minimal valid base64 image data (1x1 pixel PNG)
        valid_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        result = await image_service.validate_image_data(valid_data)
        assert result is True
    
    @pytest.mark.asyncio
    async def test_validate_image_data_invalid(self):
        """Test image data validation with invalid data"""
        invalid_data = "invalid_base64_data"
        
        result = await image_service.validate_image_data(invalid_data)
        assert result is False
    
    @pytest.mark.asyncio
    async def test_generate_image_id(self):
        """Test image ID generation"""
        image_id = await image_service.generate_image_id()
        
        assert isinstance(image_id, str)
        assert len(image_id) > 0
        assert "-" in image_id  # UUID format
    
    @pytest.mark.asyncio
    @patch('app.services.image_service.s3_client')
    async def test_upload_to_s3_success(self, mock_s3):
        """Test successful S3 upload"""
        mock_s3.put_object = AsyncMock(return_value={"ETag": "test-etag"})
        
        result = await image_service.upload_to_s3(
            image_data=b"test_image_data",
            key="test/image.jpg",
            content_type="image/jpeg"
        )
        
        assert result is True
        mock_s3.put_object.assert_called_once()
    
    @pytest.mark.asyncio
    @patch('app.services.image_service.s3_client')
    async def test_upload_to_s3_failure(self, mock_s3):
        """Test S3 upload failure"""
        mock_s3.put_object = AsyncMock(side_effect=Exception("S3 Error"))
        
        result = await image_service.upload_to_s3(
            image_data=b"test_image_data",
            key="test/image.jpg",
            content_type="image/jpeg"
        )
        
        assert result is False

class TestAnalysisService:
    """Test analysis service functionality"""
    
    @pytest.mark.asyncio
    async def test_generate_analysis_id(self):
        """Test analysis ID generation"""
        analysis_id = await analysis_service.generate_analysis_id()
        
        assert isinstance(analysis_id, str)
        assert len(analysis_id) > 0
        assert analysis_id.startswith("analysis_")
    
    @pytest.mark.asyncio
    @patch('app.services.analysis_service.color_analyzer')
    async def test_analyze_color_success(self, mock_analyzer):
        """Test successful color analysis"""
        mock_analyzer.analyze_image_colors = AsyncMock(return_value={
            "dominant_colors": [
                {"hex": "#FF0000", "percentage": 45.2, "name": "Red"},
                {"hex": "#00FF00", "percentage": 32.1, "name": "Green"}
            ],
            "color_harmony": {"type": "complementary", "score": 8.5},
            "temperature": {"value": "warm", "score": 7.2}
        })
        
        result = await analysis_service.analyze_color(
            image_url="https://example.com/test.jpg",
            options={}
        )
        
        assert result is not None
        assert "dominant_colors" in result
        mock_analyzer.analyze_image_colors.assert_called_once()
    
    @pytest.mark.asyncio
    @patch('app.services.analysis_service.color_analyzer')
    async def test_analyze_color_failure(self, mock_analyzer):
        """Test color analysis failure"""
        mock_analyzer.analyze_image_colors = AsyncMock(side_effect=Exception("Analysis failed"))
        
        with pytest.raises(Exception):
            await analysis_service.analyze_color(
                image_url="https://example.com/test.jpg",
                options={}
            )
    
    @pytest.mark.asyncio
    async def test_get_analysis_result_not_found(self):
        """Test getting non-existent analysis result"""
        result = await analysis_service.get_analysis_result("nonexistent-id")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_list_analyses_empty(self):
        """Test listing analyses when empty"""
        result = await analysis_service.list_analyses(page=1, limit=10)
        
        assert isinstance(result, dict)
        assert "items" in result
        assert "total" in result
        assert "page" in result
        assert "limit" in result
    
    @pytest.mark.asyncio
    async def test_delete_analysis_not_found(self):
        """Test deleting non-existent analysis"""
        result = await analysis_service.delete_analysis("nonexistent-id")
        assert result is False
    
    @pytest.mark.asyncio
    async def test_get_analysis_stats(self):
        """Test getting analysis statistics"""
        stats = await analysis_service.get_analysis_stats()
        
        assert isinstance(stats, dict)
        assert "total_analyses" in stats
        assert "by_type" in stats
        assert "by_status" in stats

class TestServiceIntegration:
    """Test service integration"""
    
    @pytest.mark.asyncio
    async def test_image_and_analysis_workflow(self):
        """Test integrated workflow between image and analysis services"""
        # This would test the integration between services
        # For now, just verify services can be imported and initialized
        
        assert image_service is not None
        assert analysis_service is not None
        
        # Test that services have required methods
        assert hasattr(image_service, 'create_image')
        assert hasattr(image_service, 'get_image')
        assert hasattr(analysis_service, 'analyze_color')
        assert hasattr(analysis_service, 'analyze_composition')

# Test fixtures
@pytest.fixture
def mock_s3_client():
    """Mock S3 client for testing"""
    mock_client = Mock()
    mock_client.put_object = AsyncMock(return_value={"ETag": "test-etag"})
    mock_client.get_object = AsyncMock(return_value={
        "Body": Mock(read=AsyncMock(return_value=b"test_data"))
    })
    return mock_client

@pytest.fixture
def sample_image_metadata():
    """Sample image metadata for testing"""
    return {
        "id": "test-image-id",
        "filename": "test.jpg",
        "content_type": "image/jpeg",
        "size": 1024,
        "status": ImageStatus.UPLOADED,
        "created_at": "2025-01-01T00:00:00Z"
    }

@pytest.fixture
def sample_analysis_result():
    """Sample analysis result for testing"""
    return {
        "id": "test-analysis-id",
        "image_id": "test-image-id",
        "analysis_type": AnalysisType.COLOR,
        "status": "completed",
        "result": {
            "dominant_colors": [
                {"hex": "#FF0000", "percentage": 45.2, "name": "Red"}
            ],
            "color_harmony": {"type": "complementary", "score": 8.5}
        },
        "created_at": "2025-01-01T00:00:00Z",
        "completed_at": "2025-01-01T00:01:00Z"
    }

if __name__ == "__main__":
    pytest.main([__file__])
