"""Video processing routes"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.video import Video, VideoStatus
from app.schemas.video import VideoUploadRequest, VideoStatusResponse
from app.services.video_orchestrator import VideoOrchestrator
from app.services.youtube_service import YouTubeService
import logging
from datetime import datetime

router = APIRouter(prefix="/videos", tags=["Videos"])
logger = logging.getLogger(__name__)

async def process_video_background(video_id: int):
    """Background task wrapper"""
    orchestrator = VideoOrchestrator()
    await orchestrator.process_video(video_id)

@router.post("/", response_model=VideoStatusResponse)
async def create_video(
    request: VideoUploadRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit a YouTube video for processing"""
    
    # 1. Validate URL
    yt_service = YouTubeService()
    video_id_str = yt_service.extract_youtube_id(str(request.youtube_url))
    
    if not video_id_str:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    # 2. Check if already exists
    existing = db.query(Video).filter(Video.youtube_video_id == video_id_str).first()
    if existing:
        # If failed, allow retry? For now return existing
        return _map_video_response(existing)
        
    # 3. Create Record
    new_video = Video(
        youtube_url=str(request.youtube_url),
        youtube_video_id=video_id_str,
        status=VideoStatus.UPLOADED,
        custom_caption=request.custom_caption,
        title=request.title or f"Video {video_id_str}", # Temp title
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    
    # 4. Trigger Background Task
    background_tasks.add_task(process_video_background, new_video.id)
    
    return _map_video_response(new_video)

@router.get("/", response_model=List[VideoStatusResponse])
async def list_videos(db: Session = Depends(get_db)):
    """List all videos"""
    videos = db.query(Video).order_by(Video.created_at.desc()).all()
    return [_map_video_response(v) for v in videos]

@router.get("/{video_id}", response_model=VideoStatusResponse)
async def get_video(video_id: int, db: Session = Depends(get_db)):
    """Get video details"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return _map_video_response(video)

@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(video_id: int, db: Session = Depends(get_db)):
    """Delete a video and its associated data"""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Optional: Delete files from disk?
    # For now, just delete DB record to clear UI
    db.delete(video)
    db.commit()
    return None

def _map_video_response(video: Video) -> VideoStatusResponse:
    return VideoStatusResponse(
        video_id=video.id,
        youtube_url=video.youtube_url,
        title=video.title,
        description=video.description,
        duration=video.duration,
        thumbnail_url=video.thumbnail_url,
        status=video.status,
        progress=0.0, # TODO: calculate real progress
        total_jobs=0,
        completed_jobs=0,
        failed_jobs=0,
        reels_created=len(video.chunks) if video.chunks else 0,
        error=video.error_message,
        created_at=video.created_at
    )

