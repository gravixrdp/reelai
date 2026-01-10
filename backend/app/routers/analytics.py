# Backend Analytics Endpoint

from fastapi import APIRouter, Depends
from app.api.deps import get_db
from sqlalchemy.orm import Session
from app.models import Video, Reel

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/")
async def get_analytics(db: Session = Depends(get_db)):
    """Get analytics data for the dashboard"""
    
    # Get total counts
    total_videos = db.query(Video).count()
    total_reels = db.query(Reel).count()
    
    # Get completed videos
    completed_videos = db.query(Video).filter(Video.status == "completed").count()
    success_rate = (completed_videos / total_videos * 100) if total_videos > 0 else 0
    
    # Get average processing time (placeholder)
    avg_processing_time = "5 min"
    
    # Get recent activity
    recent_videos = db.query(Video).order_by(Video.created_at.desc()).limit(5).all()
    recent_activity = []
    
    for video in recent_videos:
        activity = {
            "id": str(video.id),
            "action": f"Processed: {video.title or 'Untitled'}",
            "time": video.created_at.isoformat() if hasattr(video.created_at, 'isoformat') else str(video.created_at),
            "status": "success" if video.status == "completed" else "processing" if video.status in ["processing", "downloading"] else "failed"
        }
        recent_activity.append(activity)
    
    return {
        "totalVideos": total_videos,
        "totalReels": total_reels,
        "processingTime": avg_processing_time,
        "successRate": round(success_rate, 1),
        "recentActivity": recent_activity
    }
