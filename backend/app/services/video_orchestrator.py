import logging
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.video import Video, VideoChunk, VideoStatus
from app.services.youtube_service import YouTubeService
from app.services.video_processor import VideoProcessor
from app.core.database import SessionLocal

logger = logging.getLogger(__name__)

class VideoOrchestrator:
    """
    Orchestrates the entire video processing pipeline:
    1. Download YouTube Video
    2. Split into Chunks
    3. Save Chunks to DB
    """
    
    def __init__(self, db: Session = None):
        self.youtube_service = YouTubeService()
        self.video_processor = VideoProcessor()
        self.db = db if db else SessionLocal()

    async def process_video(self, video_id: int):
        """
        Main entry point for processing a video.
        Should be called as a background task.
        """
        # Create a new DB session for the background task if strictly needed,
        # but sharing the one passed in __init__ is risky if it closes.
        # Ideally, use a context manager or dependency injection pattern for background tasks.
        # For simplicity in this direct implementation, we'll manage a session here if self.db is closed or not trustworthy for async background.
        
        # Proper session handling for background task
        # We will create a fresh session for this long-running process
        session = SessionLocal()
        
        try:
            video = session.query(Video).filter(Video.id == video_id).first()
            if not video:
                logger.error(f"Video {video_id} not found in DB")
                return

            logger.info(f"Starting processing for Video {video.youtube_video_id}")
            
            # 1. Update Status: DOWNLOADING
            video.status = VideoStatus.DOWNLOADING
            session.commit()

            # 2. Download
            success, result = await self.youtube_service.download_video(video.youtube_url, video.youtube_video_id)
            
            if not success or not result:
                raise Exception("Download failed")
            
            # Update Video Metadata
            video.status = VideoStatus.DOWNLOADED
            video.title = result.get('title')
            video.description = result.get('description')
            video.duration = result.get('duration')
            video.thumbnail_url = result.get('thumbnail_url')
            video.video_file_path = result.get('video_path')
            video.audio_file_path = result.get('audio_path')
            # Handle transcript - it might be a tuple or None
            transcript_result = result.get('transcript')
            if isinstance(transcript_result, tuple):
                video.transcript = transcript_result[0] if transcript_result else None
            else:
                video.transcript = transcript_result
            
            session.commit()
            
            # 3. Update Status: PROCESSING (Splitting)
            video.status = VideoStatus.PROCESSING
            session.commit()
            
            # 4. Split Video
            # Define chunk directory
            chunk_base_dir = result.get('video_path').rsplit('/', 1)[0] + "/chunks"
            chunks = self.video_processor.cut_video_into_chunks(video.video_file_path, chunk_base_dir)
            
            # 5. Save Chunks to DB
            for chunk_path, index, start, end in chunks:
                chunk_record = VideoChunk(
                    video_id=video.id,
                    chunk_number=index + 1,
                    start_time=start,
                    end_time=end,
                    duration=end - start,
                    file_path=chunk_path,
                    file_size=0, # Optional: os.path.getsize(chunk_path)
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(chunk_record)
            
            # 6. Complete
            video.status = VideoStatus.COMPLETED
            video.error_message = None
            session.commit()
            
            logger.info(f"Video {video.youtube_video_id} processing complete. {len(chunks)} chunks created.")

        except Exception as e:
            logger.error(f"Error processing video {video_id}: {str(e)}")
            # Fail safely
            try:
                video = session.query(Video).filter(Video.id == video_id).first()
                if video:
                    video.status = VideoStatus.FAILED
                    video.error_message = str(e)
                    session.commit()
            except:
                pass
        finally:
            session.close()
