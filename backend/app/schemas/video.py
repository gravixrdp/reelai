"""Video processing schemas"""

from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime


class VideoUploadRequest(BaseModel):
    """YouTube video upload request"""
    youtube_url: HttpUrl
    custom_caption: Optional[str] = None
    title: Optional[str] = None


class VideoStatusResponse(BaseModel):
    """Video processing status"""
    video_id: int
    youtube_url: str
    title: Optional[str]
    description: Optional[str] = None
    duration: Optional[float] = None
    thumbnail_url: Optional[str] = None
    status: str
    progress: float
    total_jobs: int
    completed_jobs: int
    failed_jobs: int
    reels_created: int
    error: Optional[str] = None
    created_at: datetime


class ReelResponse(BaseModel):
    """Individual reel response"""
    reel_id: int
    reel_number: int
    file_path: str
    duration: float
    title: Optional[str]
    caption: Optional[str]
    hashtags: Optional[List[str]]
    topics: Optional[List[str]]
    quality_score: Optional[float]
    is_uploaded: bool
    instagram_url: Optional[str]


class ReelUploadResponse(BaseModel):
    """Reel upload response"""
    success: bool
    post_id: Optional[str] = None
    post_url: Optional[str] = None
    message: str
