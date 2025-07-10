"""
API Tests
Unit tests cho các API endpoints
"""

import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import app

# Test client
client = TestClient(app)

class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "service" in data
        assert "version" in data
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "status" in data["data"]
    
    def test_health_detailed(self):
        """Test detailed health check"""
        response = client.get("/api/v1/health/detailed")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "system" in data["data"]
        assert "services" in data["data"]

class TestImageEndpoints:
    """Test image-related endpoints"""
    
    def test_list_images_empty(self):
        """Test listing images when empty"""
        response = client.get("/api/v1/images")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
    
    def test_create_image_invalid_data(self):
        """Test creating image with invalid data"""
        invalid_payload = {
            "image_data": "invalid_base64",
            "filename": "test.jpg"
        }
        response = client.post("/api/v1/images", json=invalid_payload)
        assert response.status_code == 422  # Validation error
    
    def test_get_nonexistent_image(self):
        """Test getting non-existent image"""
        response = client.get("/api/v1/images/nonexistent-id")
        assert response.status_code == 404

class TestAnalysisEndpoints:
    """Test analysis-related endpoints"""
    
    def test_color_analysis_invalid_url(self):
        """Test color analysis with invalid URL"""
        invalid_payload = {
            "image_url": "invalid-url",
            "analysis_type": "COLOR"
        }
        response = client.post("/api/v1/analysis/color", json=invalid_payload)
        assert response.status_code in [400, 422, 500]  # Should fail
    
    def test_composition_analysis_invalid_url(self):
        """Test composition analysis with invalid URL"""
        invalid_payload = {
            "image_url": "invalid-url",
            "analysis_type": "COMPOSITION"
        }
        response = client.post("/api/v1/analysis/composition", json=invalid_payload)
        assert response.status_code in [400, 422, 500]  # Should fail
    
    def test_get_nonexistent_analysis(self):
        """Test getting non-existent analysis"""
        response = client.get("/api/v1/analysis/nonexistent-id")
        assert response.status_code == 404
    
    def test_list_analyses_empty(self):
        """Test listing analyses when empty"""
        response = client.get("/api/v1/analysis")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

class TestErrorHandling:
    """Test error handling"""
    
    def test_404_endpoint(self):
        """Test non-existent endpoint"""
        response = client.get("/api/v1/nonexistent")
        assert response.status_code == 404
    
    def test_method_not_allowed(self):
        """Test method not allowed"""
        response = client.patch("/api/v1/health")
        assert response.status_code == 405

@pytest.mark.asyncio
class TestAsyncEndpoints:
    """Test async endpoints"""
    
    async def test_async_health_check(self):
        """Test async health check"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/api/v1/health")
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True

# Test fixtures
@pytest.fixture
def sample_image_data():
    """Sample base64 image data for testing"""
    # Minimal valid base64 image data (1x1 pixel PNG)
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

@pytest.fixture
def sample_analysis_request():
    """Sample analysis request for testing"""
    return {
        "image_url": "https://example.com/test-image.jpg",
        "analysis_type": "COMPREHENSIVE",
        "options": {
            "include_color": True,
            "include_composition": True
        }
    }

# Integration tests
class TestIntegration:
    """Integration tests"""
    
    def test_full_workflow_simulation(self, sample_image_data):
        """Test simulated full workflow"""
        # This would test the full workflow in a real scenario
        # For now, just test that the endpoints are accessible
        
        # 1. Check health
        health_response = client.get("/api/v1/health")
        assert health_response.status_code == 200
        
        # 2. List images (should be empty initially)
        list_response = client.get("/api/v1/images")
        assert list_response.status_code == 200
        
        # 3. List analyses (should be empty initially)
        analyses_response = client.get("/api/v1/analysis")
        assert analyses_response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])
