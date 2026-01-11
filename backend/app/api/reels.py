"""Reels routes"""

import logging
import uuid
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Reel, Video
from app.schemas import ReelResponse
from app.schemas.reel_editing import (
    ReelDetailResponse, 
    ReelEditRequest, 
    FrameConfigResponse,
    RenderJobResponse
)
from app.config.frames import list_all_frames

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/reels", tags=["reels"])


@router.get("/", response_model=list[ReelResponse])
async def list_all_reels(
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(50),
    status: str = Query(None)
):
    """List all reels with optional status filter"""
    query = db.query(Reel)
    
    if status:
        query = query.filter_by(publish_status=status)
    
    reels = query.offset(skip).limit(limit).all()
    
    return reels


@router.get("/pending-publish/count")
async def get_pending_publish_count(db: Session = Depends(get_db)):
    """Get count of reels pending publish"""
    count = db.query(Reel).filter_by(publish_status="pending").count()
    
    return {
        "pending_count": count
    }


@router.get("/video/{video_id}", response_model=list[ReelResponse])
async def get_video_reels(
    video_id: str,
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(50)
):
    """Get all reels for a video"""
    video = db.query(Video).filter_by(id=video_id).first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    reels = db.query(Reel).filter_by(video_id=video_id).offset(skip).limit(limit).all()
    
    return reels


@router.get("/{reel_id}/details", response_model=ReelResponse)
async def get_reel_details(
    reel_id: str,
    db: Session = Depends(get_db)
):
    """Get individual reel details"""
    reel = db.query(Reel).filter_by(id=reel_id).first()
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    return reel


@router.post("/{reel_id}/publish")
async def publish_reel(
    reel_id: str,
    db: Session = Depends(get_db)
):
    """Trigger reel publishing to Instagram"""
    reel = db.query(Reel).filter_by(id=reel_id).first()
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    if reel.publish_status == "published":
        raise HTTPException(status_code=400, detail="Reel already published")
    
    return {
        "reel_id": reel_id,
        "status": "publishing",
        "message": "Reel publish job queued"
    }


@router.post("/job/{job_id}/upload-all-instagram")
async def upload_all_reels_to_instagram(job_id: int, db: Session = Depends(get_db)):
    """Upload all reels from a job to Instagram - placeholder"""
    # TODO: Trigger bulk Instagram upload task
    return {"message": "Upload all reels to Instagram endpoint - backend implementation pending"}


# ============================================================================
# SMART MINI EDITOR ENDPOINTS
# ============================================================================

@router.get("/{reel_id}", response_model=ReelDetailResponse)
async def get_reel_detail(reel_id: int, db: Session = Depends(get_db)):
    """Get reel with full editing metadata"""
    reel = db.query(Reel).filter_by(id=reel_id).first()
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    return reel


@router.patch("/{reel_id}", response_model=ReelDetailResponse)
async def update_reel_edit(
    reel_id: int,
    edit_request: ReelEditRequest,
    db: Session = Depends(get_db)
):
    """Update reel frame type and/or text overlays"""
    reel = db.query(Reel).filter_by(id=reel_id).first()
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    # Update fields if provided
    if edit_request.frame_type is not None:
        reel.frame_type = edit_request.frame_type
        reel.is_edited = True
    
    if edit_request.text_overlays is not None:
        reel.text_overlays = [overlay.model_dump() for overlay in edit_request.text_overlays]
        reel.is_edited = True
    
    if edit_request.has_shadow is not None:
        reel.has_shadow = edit_request.has_shadow
    
    if edit_request.shadow_intensity is not None:
        reel.shadow_intensity = edit_request.shadow_intensity
    
    if edit_request.has_overlay is not None:
        reel.has_overlay = edit_request.has_overlay
    
    if edit_request.overlay_opacity is not None:
        reel.overlay_opacity = edit_request.overlay_opacity
    
    db.commit()
    db.refresh(reel)
    
    return reel


@router.post("/{reel_id}/render", response_model=RenderJobResponse)
async def render_reel_job(reel_id: int, db: Session = Depends(get_db)):
    """
    Queue reel re-render with current frame/text settings.
    
    This creates a background job to re-compose the reel using the
    ReelComposer service with the user's custom frame and text overlays.
    """
    reel = db.query(Reel).filter_by(id=reel_id).first()
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # TODO: Queue background job to render reel
    # This would call ReelComposer.compose_reel() with reel's settings
    # For now, return mock response
    
    logger.info(f"Queued render job {job_id} for reel {reel_id}")
    
    return RenderJobResponse(
        job_id=job_id,
        reel_id=reel_id,
        status="queued",
        message="Reel render job queued successfully"
    )


@router.get("/frames/list", response_model=List[FrameConfigResponse])
async def list_frame_configs():
    """List all available frame configurations"""
    frames = list_all_frames()
    
    return [
        FrameConfigResponse(
            id=frame.id.value,
            name=frame.name,
            description=frame.description,
            preview_image=None  # TODO: Add preview images
        )
        for frame in frames
    ]
