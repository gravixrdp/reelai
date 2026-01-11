"""Reel, Instagram Token, and Job tracking models"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base, IDMixin, TimestampMixin


class ReelQuality(str, enum.Enum):
    """Reel quality score"""
    POOR = "poor"
    FAIR = "fair"
    GOOD = "good"
    EXCELLENT = "excellent"


class Reel(Base, IDMixin, TimestampMixin):
    """Individual reel model - vertical format videos"""
    __tablename__ = "reels"
    
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False, index=True)
    chunk_id = Column(Integer, ForeignKey("video_chunks.id"), nullable=False, index=True)
    
    reel_number = Column(Integer, nullable=False)  # Sequential in video
    file_path = Column(String(500), nullable=False)  # 1080x1920 vertical video
    file_size = Column(Integer, nullable=True)  # in bytes
    duration = Column(Float, nullable=False)  # in seconds
    
    # AI Generated Metadata
    title = Column(String(500), nullable=True)
    caption = Column(Text, nullable=True)
    hashtags = Column(JSON, nullable=True)  # ["#hashtag1", "#hashtag2"]
    topics = Column(JSON, nullable=True)  # ["topic1", "topic2"]
    quality_score = Column(Float, nullable=True)  # 0.0 - 1.0
    quality_grade = Column(Enum(ReelQuality), nullable=True)
    
    # Instagram Upload
    instagram_post_id = Column(String(100), unique=True, nullable=True, index=True)
    instagram_url = Column(String(500), nullable=True)
    is_uploaded = Column(Boolean, default=False, index=True)
    upload_error = Column(Text, nullable=True)
    publish_status = Column(String(50), default='draft', nullable=False)  # draft, queued, published, failed
    
    # Frame & Editing Metadata (Smart Mini Editor)
    frame_type = Column(String(50), default='CENTER_STRIP', nullable=False, index=True)
    text_overlays = Column(JSON, nullable=True)  # [{text, zone, fontSize, x, y}]
    has_shadow = Column(Boolean, default=False)
    shadow_intensity = Column(Float, default=0.3)  # 0.0 - 1.0
    has_overlay = Column(Boolean, default=False)
    overlay_opacity = Column(Float, default=0.1)  # 0.0 - 1.0
    is_edited = Column(Boolean, default=False, index=True)  # Track if user customized
    original_file_path = Column(String(500), nullable=True)  # Original render before edits

    
    # Relationships
    video = relationship("Video", back_populates="reels")
    chunk = relationship("VideoChunk", back_populates="reels")
    
    def __repr__(self):
        return f"<Reel(id={self.id}, video_id={self.video_id}, is_uploaded={self.is_uploaded})>"


class InstagramToken(Base, IDMixin, TimestampMixin):
    """Instagram and Facebook access token storage"""
    __tablename__ = "instagram_tokens"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    # Facebook Page Information
    fb_page_id = Column(String(100), nullable=True, index=True)
    fb_page_name = Column(String(200), nullable=True)
    fb_user_id = Column(String(100), nullable=True)
    
    # Instagram Business Account Information
    ig_user_id = Column(String(100), nullable=True, index=True)
    instagram_username = Column(String(100), nullable=True)
    ig_profile_picture = Column(String(500), nullable=True)
    
    # Access Tokens
    long_lived_token = Column(Text, nullable=True)  # Main long-lived token
    access_token = Column(Text, nullable=False)  # Current valid token (can be short or long-lived)
    token_type = Column(String(50), default="Bearer")
    
    # Token expiry
    expires_at = Column(DateTime, nullable=True)
    token_expires_in = Column(Integer, nullable=True)  # seconds
    is_valid = Column(Boolean, default=True, index=True)
    
    # Refresh tracking
    last_refreshed_at = Column(DateTime, nullable=True)
    refresh_count = Column(Integer, default=0)
    
    # Permissions
    permissions = Column(JSON, nullable=True)  # ["instagram_basic", "pages_show_list", "pages_manage_metadata"]
    
    # Connection status
    is_connected = Column(Boolean, default=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="instagram_token")
    
    def __repr__(self):
        return f"<InstagramToken(user_id={self.user_id}, ig_user={self.instagram_username}, fb_page={self.fb_page_id})>"


class JobStatus(str, enum.Enum):
    """Job status tracking"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Job(Base, IDMixin, TimestampMixin):
    """Background job tracking"""
    __tablename__ = "jobs"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True, index=True)
    
    job_type = Column(String(50), nullable=False)  # youtube_download, cutting, vertical_conversion, ai_generation, instagram_upload
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, index=True)
    
    # Job identifiers
    celery_task_id = Column(String(100), nullable=True, index=True)
    rq_job_id = Column(String(100), nullable=True, index=True)
    
    # Progress tracking
    progress = Column(Float, default=0.0)  # 0-100
    total_steps = Column(Integer, nullable=True)
    completed_steps = Column(Integer, nullable=True)
    
    # Results
    result = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    error_traceback = Column(Text, nullable=True)
    
    # Retry tracking
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    video = relationship("Video", back_populates="jobs")
    
    def __repr__(self):
        return f"<Job(id={self.id}, type={self.job_type}, status={self.status})>"


class Log(Base, IDMixin, TimestampMixin):
    """Application logs for auditing and debugging"""
    __tablename__ = "logs"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True, index=True)
    
    level = Column(String(20), nullable=False)  # INFO, WARNING, ERROR, DEBUG
    service = Column(String(100), nullable=False)  # youtube_service, video_service, etc
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=True)
    
    # Relationships
    user = relationship("User")
    video = relationship("Video")
    job = relationship("Job")
    
    def __repr__(self):
        return f"<Log(level={self.level}, service={self.service})>"
