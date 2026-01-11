"""
Editor API Endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.reel_composer import ReelComposer
from app.services.instagram_publisher import InstagramPublisher
from app.models.instagram import InstagramAccount, InstagramAccountStatus
from app.config.frames import FrameType
from app.models.video import Video
import logging
import os
from pathlib import Path

router = APIRouter(prefix="/editor", tags=["Editor"])
logger = logging.getLogger(__name__)

class UploadRequest(BaseModel):
    video_path: str
    caption: str
    
class UploadResponse(BaseModel):
    success: bool
    media_id: Optional[str] = None
    reel_id: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None

class TextOverlayRequest(BaseModel):
    text: str
    zone: str  # 'top' or 'bottom'

class RenderRequest(BaseModel):
    video_id: int
    frame_type: FrameType
    text_overlays: List[TextOverlayRequest] = []
    has_shadow: bool = False
    has_overlay: bool = False
    start_time: float = 0.0
    duration: Optional[float] = None

class RenderResponse(BaseModel):
    success: bool
    output_path: Optional[str] = None
    url: Optional[str] = None
    message: Optional[str] = None

@router.post("/render", response_model=RenderResponse)
async def render_reel(
    request: RenderRequest,
    db: Session = Depends(get_db)
):
    """
    Render a final reel based on editor configuration.
    Currently synchronous for MVP reliability, but uses 10-min timeout internally.
    """
    try:
        # 1. Fetch source video
        video = db.query(Video).filter(Video.id == request.video_id).first()
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
            
        # TODO: In a real flow, we'd use a specific clip/chunk. 
        # For now, we'll try to use the first downloaded file if exists, 
        # or assuming the video record has a path.
        # Since the User Context says "Video is split into 30-40 sec clips", 
        # we might need to know WHICH clip. 
        # For this implementation, I will look for a 'processed_path' or similar on the video object 
        # or construct a path based on ID. 
        
        # Use settings for path
        from app.core.config import get_settings
        settings = get_settings()
        
        # Consistent path logic with YouTubeService
        # storage_base / video_id / video_id.mp4
        input_path = f"{settings.storage_base_path}/{video.youtube_video_id}/{video.youtube_video_id}.mp4"
        
        if not os.path.exists(input_path):
             logger.error(f"Source video not found at {input_path}")
             raise HTTPException(status_code=400, detail=f"Source video file not found. Please re-process the video.")

        # 2. Prepare Output Path
        output_filename = f"reel_{request.video_id}_{request.frame_type.value}.mp4"
        output_dir = "public/renders"
        output_path = f"{output_dir}/{output_filename}"
        
        # Ensure 'public/renders' exists
        os.makedirs(output_dir, exist_ok=True)

        # 3. Call Composer
        composer = ReelComposer()
        
        # Convert pydantic models to dicts for service
        overlays_dict = [
            {"text": t.text, "zone": t.zone} 
            for t in request.text_overlays
        ]
        
        final_path = composer.compose_reel(
            input_video_path=input_path,
            output_path=output_path,
            frame_type=request.frame_type,
            text_overlays=overlays_dict,
            has_shadow=request.has_shadow,
            has_overlay=request.has_overlay,
            start_time=request.start_time,
            duration=request.duration
        )
        
        # 4. Return URL
        # Assuming app mounts /public
        public_url = f"/public/renders/{output_filename}"
        
        return RenderResponse(
            success=True,
            output_path=final_path,
            url=public_url
        )

    except Exception as e:
        logger.error(f"Render failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload", response_model=UploadResponse)
async def upload_reel(
    request: UploadRequest,
    db: Session = Depends(get_db)
):
    """
    Upload a rendered reel to the connected Instagram account.
    """
    try:
        # 1. Get Connected Account
        account = db.query(InstagramAccount).filter(
            InstagramAccount.status == InstagramAccountStatus.CONNECTED
        ).first()
        
        if not account:
            raise HTTPException(status_code=400, detail="No connected Instagram account found. Please connect in settings.")
            
        # 2. Get Public URL for the video
        # Instagram API requires a public URL. 
        # Since we are on localhost/VPS, we need to ensure this is accessible.
        # If running locally with ngrok, this needs the public URL.
        # IF running on VPS, we need the IP/Domain.
        
        # HACK: For this specific VPS environment, we need to know the public IP or use a tunnel.
        # However, checking the User Context, we are on a linux VPS.
        # Instagram API *cannot* read localhost.
        
        # If the file is in 'public/renders', we can serve it. 
        # But we need the Base URL.
        # Let's check env vars or settings.
        
        from app.core.config import get_settings
        settings = get_settings()
        
        # Assuming there is a BASE_URL setting or we construct it.
        # If not, we might fail unless we simulate it or use a service like Cloudinary (which we have cdn_upload_service for?)
        # Let's see `cdn_upload_service.py` exists.
        
        # Checking if we have a CDN service?
        # Listing services showed `cdn_upload_service.py`. Let's use it if possible.
        # Or blindly trust `settings.allowed_origins` or similar?
        
        # Let's try to use the `request.video_path` which likely came from our render response.
        # It is a local path like `public/renders/xyz.mp4`.
        
        # We will use cdn_upload_service to get a public URL if available.
        # Let's import it inline to check.
        
        # Re-reading directory list... `cdn_upload_service.py` exists.
        from app.services.cdn_upload_service import CDNUploadService
        cdn_service = CDNUploadService()
        
        # Upload to CDN (or verify it can be served)
        # Note: If CDN service is not configured, this might fail.
        # fallback: try to use the server's public IP if known?
        
        # Let's try CDN upload first.
        try:
             public_url = await cdn_service.upload_file(request.video_path)
        except Exception as cdn_error:
             # Fallback: Assume we are reachable? 
             # Or maybe just fail for now?
             logger.warning(f"CDN Upload failed: {cdn_error}. Trying to use raw path if exposed?")
             # If we return a local path to Instagram, it WILL fail.
             # We must provide a public URL.
             
             # HACK: If we are testing on a system where we can't expose port 8000 to internet,
             # this step is effectively blocked without a tunnel (ngrok).
             # But the user asked for a *Real* test.
             
             # Let's assume the user has set up the environment correctly or we can use a temp file host?
             # Actually, `cdn_upload_service.py` is likely the intended way.
             raise HTTPException(status_code=500, detail=f"Could not generate public URL for Instagram: {str(cdn_error)}")

        if not public_url:
             raise HTTPException(status_code=500, detail="Failed to generate public URL for video")

        # 3. Publish
        publisher = InstagramPublisher()
        result = publisher.upload_and_publish(
            ig_user_id=account.instagram_user_id,
            video_url=public_url,
            caption=request.caption,
            access_token=account.access_token
        )
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error", "Upload failed"))
            
        return UploadResponse(
            success=True,
            media_id=result.get("media_id"),
            reel_id=result.get("reel_id"),
            message="Reel successfully uploaded and published!"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload flow failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
