"""
Response Builder Utility
Helper functions for building API responses
"""

from typing import Dict, Any
from app.core.config import settings

class ResponseBuilder:
    """Utility class for building API responses"""
    
    @staticmethod
    def build_image_links(image_id: str) -> Dict[str, str]:
        """Build HATEOAS links for image resource"""
        base_url = settings.API_V1_STR
        
        return {
            "self": f"{base_url}/images/{image_id}",
            "colors": f"{base_url}/images/{image_id}/colors",
            "harmony": f"{base_url}/images/{image_id}/harmony",
            "temperature": f"{base_url}/images/{image_id}/temperature",
            "mood": f"{base_url}/images/{image_id}/mood",
            "recommendations": f"{base_url}/images/{image_id}/recommendations",
            "update": f"{base_url}/images/{image_id}",
            "delete": f"{base_url}/images/{image_id}"
        }
    
    @staticmethod
    def build_pagination_links(
        base_url: str, 
        limit: int, 
        offset: int, 
        total: int,
        query_params: Dict[str, Any] = None
    ) -> Dict[str, str]:
        """Build pagination links"""
        links = {}
        query_params = query_params or {}
        
        # Build query string
        def build_query_string(new_offset: int) -> str:
            params = {**query_params, 'limit': limit, 'offset': new_offset}
            query_parts = [f"{k}={v}" for k, v in params.items() if v is not None]
            return "?" + "&".join(query_parts) if query_parts else ""
        
        # Self link
        links["self"] = base_url + build_query_string(offset)
        
        # First link
        links["first"] = base_url + build_query_string(0)
        
        # Previous link
        if offset > 0:
            prev_offset = max(0, offset - limit)
            links["prev"] = base_url + build_query_string(prev_offset)
        
        # Next link
        if offset + limit < total:
            next_offset = offset + limit
            links["next"] = base_url + build_query_string(next_offset)
        
        # Last link
        last_offset = max(0, ((total - 1) // limit) * limit)
        links["last"] = base_url + build_query_string(last_offset)
        
        return links
    
    @staticmethod
    def build_error_response(
        error_code: str,
        message: str,
        details: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Build standardized error response"""
        return {
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "details": details,
                "timestamp": settings.get_current_timestamp()
            }
        }
    
    @staticmethod
    def build_success_response(
        data: Any,
        message: str = None,
        links: Dict[str, str] = None
    ) -> Dict[str, Any]:
        """Build standardized success response"""
        response = {
            "success": True,
            "data": data,
            "timestamp": settings.get_current_timestamp()
        }
        
        if message:
            response["message"] = message
        
        if links:
            response["links"] = links
        
        return response
