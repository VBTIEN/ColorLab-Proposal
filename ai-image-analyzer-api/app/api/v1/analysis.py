"""
Analysis API Router
RESTful endpoints cho image analysis operations
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import logging

from app.core.config import settings
from app.schemas.image import (
    AnalysisRequestSchema, AnalysisResponseSchema, 
    ColorAnalysisSchema, CompositionAnalysisSchema,
    ErrorResponseSchema
)
from app.services.analysis_service import analysis_service
from app.models.image import AnalysisType
from app.utils.response_builder import ResponseBuilder

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post(
    "/analysis/color",
    response_model=AnalysisResponseSchema,
    summary="Color Analysis",
    description="Perform detailed color analysis on image"
)
async def analyze_color(request: AnalysisRequestSchema):
    """
    Phân tích màu sắc chi tiết của hình ảnh
    - Dominant colors
    - Color harmony
    - Color temperature
    - Color distribution
    """
    try:
        logger.info(f"Starting color analysis for image: {request.image_url}")
        
        result = await analysis_service.analyze_color(
            image_url=request.image_url,
            options=request.options
        )
        
        return ResponseBuilder.success(
            data=result,
            message="Color analysis completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Color analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Color analysis failed: {str(e)}"
        )

@router.post(
    "/analysis/composition",
    response_model=AnalysisResponseSchema,
    summary="Composition Analysis",
    description="Analyze image composition and visual elements"
)
async def analyze_composition(request: AnalysisRequestSchema):
    """
    Phân tích composition của hình ảnh
    - Rule of thirds
    - Leading lines
    - Symmetry
    - Balance
    """
    try:
        logger.info(f"Starting composition analysis for image: {request.image_url}")
        
        result = await analysis_service.analyze_composition(
            image_url=request.image_url,
            options=request.options
        )
        
        return ResponseBuilder.success(
            data=result,
            message="Composition analysis completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Composition analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Composition analysis failed: {str(e)}"
        )

@router.post(
    "/analysis/comprehensive",
    response_model=AnalysisResponseSchema,
    summary="Comprehensive Analysis",
    description="Perform complete AI image analysis"
)
async def analyze_comprehensive(request: AnalysisRequestSchema):
    """
    Phân tích toàn diện hình ảnh
    - Color analysis
    - Composition analysis
    - Technical quality
    - Aesthetic scoring
    """
    try:
        logger.info(f"Starting comprehensive analysis for image: {request.image_url}")
        
        result = await analysis_service.analyze_comprehensive(
            image_url=request.image_url,
            options=request.options
        )
        
        return ResponseBuilder.success(
            data=result,
            message="Comprehensive analysis completed successfully"
        )
        
    except Exception as e:
        logger.error(f"Comprehensive analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Comprehensive analysis failed: {str(e)}"
        )

@router.get(
    "/analysis/{analysis_id}",
    response_model=AnalysisResponseSchema,
    summary="Get Analysis Result",
    description="Retrieve analysis result by ID"
)
async def get_analysis(
    analysis_id: str = Path(..., description="Analysis ID")
):
    """
    Lấy kết quả phân tích theo ID
    """
    try:
        logger.info(f"Retrieving analysis result: {analysis_id}")
        
        result = await analysis_service.get_analysis_result(analysis_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="Analysis result not found"
            )
        
        return ResponseBuilder.success(
            data=result,
            message="Analysis result retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve analysis: {str(e)}"
        )

@router.get(
    "/analysis",
    response_model=Dict[str, Any],
    summary="List Analysis Results",
    description="List all analysis results with pagination"
)
async def list_analyses(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    analysis_type: Optional[AnalysisType] = Query(None, description="Filter by analysis type"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    """
    Liệt kê các kết quả phân tích với phân trang
    """
    try:
        logger.info(f"Listing analyses - page: {page}, limit: {limit}")
        
        result = await analysis_service.list_analyses(
            page=page,
            limit=limit,
            analysis_type=analysis_type,
            status=status
        )
        
        return ResponseBuilder.success(
            data=result,
            message="Analysis list retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to list analyses: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list analyses: {str(e)}"
        )

@router.delete(
    "/analysis/{analysis_id}",
    summary="Delete Analysis",
    description="Delete analysis result by ID"
)
async def delete_analysis(
    analysis_id: str = Path(..., description="Analysis ID")
):
    """
    Xóa kết quả phân tích theo ID
    """
    try:
        logger.info(f"Deleting analysis: {analysis_id}")
        
        success = await analysis_service.delete_analysis(analysis_id)
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Analysis not found"
            )
        
        return ResponseBuilder.success(
            message="Analysis deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete analysis: {str(e)}"
        )

@router.get(
    "/analysis/stats/summary",
    summary="Analysis Statistics",
    description="Get analysis statistics and summary"
)
async def get_analysis_stats():
    """
    Lấy thống kê phân tích
    """
    try:
        logger.info("Retrieving analysis statistics")
        
        stats = await analysis_service.get_analysis_stats()
        
        return ResponseBuilder.success(
            data=stats,
            message="Analysis statistics retrieved successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to get analysis stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get analysis stats: {str(e)}"
        )
