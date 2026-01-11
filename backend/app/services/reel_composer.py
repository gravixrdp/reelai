"""
Reel Composer - FFmpeg Video Composition Service

Composes final reels with:
- Frame-based video positioning
- Text overlays
- Divider lines (for DIVIDER_FRAME)
- Shadow/overlay effects

Output: 1080x1920 @ 30fps, H.264+AAC, MP4
"""

import os
import subprocess
import logging
from typing import List, Optional, Dict
from pathlib import Path

from app.config.frames import FrameConfig, get_frame_config, FrameType
from app.services.text_layout_calculator import TextLayout, calculate_text_for_frame

logger = logging.getLogger(__name__)


class ReelComposer:
    """Compose reels with frame layouts and text overlays"""
    
    def __init__(
        self,
        ffmpeg_path: str = "ffmpeg",
        ffprobe_path: str = "ffprobe",
        reel_width: int = 1080,
        reel_height: int = 1920,
        fps: int = 30
    ):
        self.ffmpeg_path = ffmpeg_path
        self.ffprobe_path = ffprobe_path
        self.reel_width = reel_width
        self.reel_height = reel_height
        self.fps = fps
    
    def compose_reel(
        self,
        input_video_path: str,
        output_path: str,
        frame_type: FrameType = FrameType.CENTER_STRIP,
        text_overlays: Optional[List[Dict]] = None,
        has_shadow: bool = False,
        shadow_intensity: float = 0.3,
        has_overlay: bool = False,
        overlay_opacity: float = 0.1,
        start_time: float = 0.0,
        duration: Optional[float] = None
    ) -> str:
        """
        Compose final reel with frame layout and text overlays.
        
        Args:
            input_video_path: Path to source video (16:9 chunk)
            output_path: Path for output reel
            frame_type: Frame configuration to use
            text_overlays: List of text overlay dicts [{text, zone}]
            has_shadow: Add subtle shadow effect
            shadow_intensity: Shadow opacity (0.0-1.0)
            has_overlay: Add subtle color overlay
            overlay_opacity: Overlay opacity (0.0-1.0)
        
        Returns:
            Path to composed reel
        """
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Get frame configuration
            frame_config = get_frame_config(frame_type)
            
            # Build FFmpeg filter chain
            filter_complex = self._build_filter_chain(
                frame_config=frame_config,
                text_overlays=text_overlays or [],
                has_shadow=has_shadow,
                shadow_intensity=shadow_intensity,
                has_overlay=has_overlay,
                overlay_opacity=overlay_opacity
            )
            
            # Build FFmpeg command
            cmd = [self.ffmpeg_path]
            
            # Add trimming if requested (before input for faster seeking)
            if start_time > 0:
                cmd.extend(["-ss", str(start_time)])
            if duration and duration > 0:
                cmd.extend(["-t", str(duration)])
                
            cmd.extend([
                "-i", input_video_path,
                "-filter_complex", filter_complex,
                "-map", "[final]",      # Use final video stream
                "-map", "0:a?",         # Copy audio if exists
                "-c:v", "libx264",      # H.264 video codec
                "-preset", "medium",     # Encoding speed/quality
                "-crf", "23",           # Quality (lower = better, 18-28 range)
                "-pix_fmt", "yuv420p",  # Pixel format for compatibility
                "-r", str(self.fps),    # Frame rate
                "-c:a", "aac",          # AAC audio codec
                "-b:a", "128k",         # Audio bitrate
                "-movflags", "+faststart",  # Enable streaming
                "-y",                   # Overwrite output
                output_path
            ])
            
            logger.info(f"Composing reel with frame={frame_type.value}")
            logger.debug(f"FFmpeg filter: {filter_complex}")
            
            # Execute FFmpeg
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=600  # 10 minute timeout
            )
            
            if result.returncode != 0:
                logger.error(f"FFmpeg composition error: {result.stderr}")
                raise Exception(f"Reel composition failed: {result.stderr}")
            
            # Verify output exists
            if not os.path.exists(output_path):
                raise Exception("Output file was not created")
            
            logger.info(f"Reel composed successfully: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Reel composition error: {str(e)}")
            raise
    
    def _build_filter_chain(
        self,
        frame_config: FrameConfig,
        text_overlays: List[Dict],
        has_shadow: bool,
        shadow_intensity: float,
        has_overlay: bool,
        overlay_opacity: float
    ) -> str:
        """
        Build FFmpeg complex filter chain.
        
        Filter chain steps:
        1. Scale input video to 1080px width (maintain 16:9)
        2. Create colored background (1080x1920)
        3. Overlay scaled video at frame-specific Y position
        4. Add divider lines (if frame has them)
        5. Add text overlays
        6. Add shadow/overlay effects (if enabled)
        """
        filters = []
        
        # Step 1: Scale video to 1080px width
        # Output: 1080 x 608 (16:9 aspect)
        filters.append(f"[0:v]scale={self.reel_width}:-1,setsar=1[scaled]")
        
        # Step 2: Create background
        bg_color = frame_config.background_color.replace('#', '0x')
        filters.append(
            f"color={bg_color}:s={self.reel_width}x{self.reel_height}:r={self.fps}[bg]"
        )
        
        # Step 3: Overlay video at Y position
        y_pos = frame_config.video_y_position
        filters.append(f"[bg][scaled]overlay=0:{y_pos}[composed]")
        
        current_stream = "composed"
        
        # Step 4: Add divider lines (for DIVIDER_FRAME)
        if frame_config.divider_enabled:
            divider_color = frame_config.divider_color.replace('#', '0x')
            thickness = frame_config.divider_thickness
            
            # Top divider
            filters.append(
                f"[{current_stream}]drawbox="
                f"x=0:y={frame_config.divider_top_y}:"
                f"w={self.reel_width}:h={thickness}:"
                f"color={divider_color}:t=fill[divider1]"
            )
            current_stream = "divider1"
            
            # Bottom divider
            filters.append(
                f"[{current_stream}]drawbox="
                f"x=0:y={frame_config.divider_bottom_y}:"
                f"w={self.reel_width}:h={thickness}:"
                f"color={divider_color}:t=fill[divider2]"
            )
            current_stream = "divider2"
        
        # Step 5: Add text overlays
        if text_overlays:
            for i, text_data in enumerate(text_overlays):
                text_content = text_data.get('text', '')
                zone = text_data.get('zone', 'top')
                
                if not text_content:
                    continue
                
                # Calculate text layout
                text_layout = calculate_text_for_frame(
                    text=text_content,
                    zone=zone,
                    frame_config=frame_config
                )
                
                # Escape text for FFmpeg
                escaped_text = self._escape_text(text_layout.text)
                
                # Build drawtext filter
                # Note: FFmpeg drawtext renders line by line
                for line_idx, line in enumerate(text_layout.lines):
                    line_escaped = self._escape_text(line)
                    line_y = text_layout.y + (line_idx * text_layout.line_height)
                    
                    # Center each line horizontally
                    # Using text=\"...\": centers text automatically if x=(w-text_w)/2
                    # But for simplicity, we'll left-align with padding
                    
                    stream_in = current_stream
                    stream_out = f"text{i}_{line_idx}"
                    
                    filters.append(
                        f"[{stream_in}]drawtext="
                        f"text='{line_escaped}':"
                        f"fontfile={text_layout.font_family}:"
                        f"fontsize={text_layout.font_size}:"
                        f"fontcolor={text_layout.color}:"
                        f"x={text_layout.x}:"
                        f"y={line_y}:"
                        f"shadowx=2:shadowy=2:shadowcolor=black@0.5"  # Subtle shadow for readability
                        f"[{stream_out}]"
                    )
                    current_stream = stream_out
        
        # Step 6: Shadow/Overlay effects (optional)
        if has_overlay:
            # Add subtle color overlay
            opacity = min(max(overlay_opacity, 0.0), 1.0)
            filters.append(
                f"[{current_stream}]colorize=hue=0:saturation=0.1:lightness=0:"
                f"mix={opacity}[overlayed]"
            )
            current_stream = "overlayed"
        
        # Final output label
        filters.append(f"[{current_stream}]null[final]")
        
        # Join all filters with semicolon
        return ";".join(filters)
    
    def _escape_text(self, text: str) -> str:
        """Escape text for FFmpeg drawtext filter"""
        # FFmpeg drawtext special characters that need escaping
        # See: https://ffmpeg.org/ffmpeg-filters.html#drawtext
        replacements = {
            "'": r"\'",
            ":": r"\:",
            "\\": r"\\",
            "%": r"\%",
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def get_video_info(self, video_path: str) -> Dict:
        """Get video metadata using ffprobe"""
        try:
            cmd = [
                self.ffprobe_path,
                "-v", "error",
                "-select_streams", "v:0",
                "-show_entries", "stream=width,height,r_frame_rate,duration,codec_name",
                "-show_entries", "format=duration",
                "-of", "json",
                video_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                import json
                return json.loads(result.stdout)
            else:
                logger.error(f"ffprobe error: {result.stderr}")
                return {}
                
        except Exception as e:
            logger.error(f"Failed to get video info: {str(e)}")
            return {}
