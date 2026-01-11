"""Reel editing schemas for frame and text overlay management"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


class TextOverlay(BaseModel):
    """Text overlay configuration"""
    text: str = Field(..., min_length=1, max_length=200, description="Text content")
    zone: Literal['top', 'bottom'] = Field(..., description="Text zone placement")
    font_size: Optional[int] = Field(None, ge=36, le=72, description="Auto-calculated if not provided")
    x: Optional[int] = Field(None, description="X position (auto-calculated)")
    y: Optional[int] = Field(None, description="Y position (auto-calculated)")


class FrameConfigResponse(BaseModel):
    """Frame configuration info"""
    id: str
    name: str
    description: str
    preview_image: Optional[str] = None


class ReelEditRequest(BaseModel):
    """Request to edit reel frame/text"""
    frame_type: Optional[Literal['CENTER_STRIP', 'DIVIDER_FRAME', 'LOWER_ANCHOR']] = None
    text_overlays: Optional[List[TextOverlay]] = None
    has_shadow: Optional[bool] = None
    shadow_intensity: Optional[float] = Field(None, ge=0.0, le=1.0)
    has_overlay: Optional[bool] = None
    overlay_opacity: Optional[float] = Field(None, ge=0.0, le=1.0)


class ReelDetailResponse(BaseModel):
    """Detailed reel response with editing metadata"""
    reel_id: int
    video_id: int
    chunk_id: int
    reel_number: int
    file_path: str
    duration: float
    
    # Frame & Text
    frame_type: str
    text_overlays: Optional[List[dict]] = None
    has_shadow: bool
    shadow_intensity: float
    has_overlay: bool
    overlay_opacity: float
    is_edited: bool
    
    # AI Metadata
    title: Optional[str] = None
    caption: Optional[str] = None
    hashtags: Optional[List[str]] = None
    quality_score: Optional[float] = None
    
    # Instagram
    is_uploaded: bool
    instagram_url: Optional[str] = None
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RenderJobResponse(BaseModel):
    """Render job initiation response"""
    job_id: str
    reel_id: int
    status: str
    message: str
