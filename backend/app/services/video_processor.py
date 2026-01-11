import os
import subprocess
import logging
from typing import List, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)


class VideoProcessor:
    """Cut videos into sequential 35-second chunks"""
    
    def __init__(self, ffmpeg_path: str = "ffmpeg", ffprobe_path: str = "ffprobe", chunk_duration: int = 30):
        self.ffmpeg_path = ffmpeg_path
        self.ffprobe_path = ffprobe_path
        self.chunk_duration = chunk_duration
    
    def get_video_duration(self, video_path: str) -> float:
        """Get total video duration in seconds"""
        try:
            cmd = [
                self.ffprobe_path,
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1:noprint_wrappers=1",
                video_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                return float(result.stdout.strip())
            else:
                raise Exception(f"ffprobe error: {result.stderr}")
        
        except Exception as e:
            logger.error(f"Duration extraction error: {str(e)}")
            raise
    
    def cut_video_into_chunks(self, video_path: str, chunk_dir: str) -> List[Tuple[str, int, int, int]]:
        """
        Cut video into sequential 30-second chunks with 9:16 aspect ratio (Reels format).
        Returns: List of (chunk_path, chunk_index, start_time, end_time)
        """
        try:
            os.makedirs(chunk_dir, exist_ok=True)
            
            # Get total duration
            total_duration = self.get_video_duration(video_path)
            logger.info(f"Video duration: {total_duration}s")
            
            chunks = []
            chunk_index = 0
            start_time = 0
            
            # Cut into sequential chunks
            while start_time < total_duration:
                end_time = min(start_time + self.chunk_duration, total_duration)
                duration = end_time - start_time
                
                # Only create chunk if it's at least 10 seconds
                if duration < 10:
                    logger.info(f"Skipping final chunk < 10s: {duration}s")
                    break
                
                chunk_path = os.path.join(chunk_dir, f"chunk_{chunk_index:03d}.mp4")
                
                # FFmpeg command to cut chunk AND convert to 9:16
                # Filter: Scale to fit 1080x1920 box, decrease if needed, then pad with black bars to fill 1080x1920
                filter_complex = "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"
                
                cmd = [
                    self.ffmpeg_path,
                    "-i", video_path,
                    "-ss", str(start_time),
                    "-t", str(duration),
                    "-c:v", "libx264",
                    "-c:a", "aac",
                    "-vf", filter_complex,
                    "-crf", "23",            # Good quality
                    "-preset", "fast",       # Reasonable speed
                    "-y",                    # Overwrite
                    chunk_path
                ]
                
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
                
                if result.returncode != 0:
                    logger.error(f"Chunk cutting error: {result.stderr}")
                    raise Exception(f"Failed to cut chunk {chunk_index}: {result.stderr}")
                
                chunks.append((chunk_path, chunk_index, int(start_time), int(end_time)))
                logger.info(f"Created chunk {chunk_index}: {start_time}s - {end_time}s")
                
                chunk_index += 1
                start_time = end_time
            
            logger.info(f"Total chunks created: {len(chunks)}")
            return chunks
        
        except Exception as e:
            logger.error(f"Video cutting error: {str(e)}")
            raise
