"""
Frame Configuration System for Smart Mini Video Editing

Defines the 3 frame layouts:
- CENTER_STRIP: Video centered vertically with equal black space
- DIVIDER_FRAME: Video centered with divider lines above/below
- LOWER_ANCHOR: Video positioned lower for cinematic effect

All frames maintain:
- Reel size: 1080x1920 (9:16)
- Video: Full width (1080px), 16:9 aspect ratio
- Video height: 607.5px (1080 * 9/16)
- Original video aspect ratio preserved
"""

from dataclasses import dataclass
from typing import List, Literal
from enum import Enum


class FrameType(str, Enum):
    """Available frame types"""
    CENTER_STRIP = "CENTER_STRIP"
    DIVIDER_FRAME = "DIVIDER_FRAME"
    LOWER_ANCHOR = "LOWER_ANCHOR"


@dataclass
class TextZone:
    """Text safe zone definition"""
    zone_id: str  # 'top' or 'bottom'
    y_start: int  # Starting Y coordinate
    y_end: int    # Ending Y coordinate
    max_width: int = 980  # Max text width (1080 - 50px padding each side)
    
    @property
    def height(self) -> int:
        """Get zone height"""
        return self.y_end - self.y_start
    
    @property
    def center_y(self) -> int:
        """Get vertical center of zone"""
        return (self.y_start + self.y_end) // 2


@dataclass
class FrameConfig:
    """Frame configuration with layout geometry"""
    id: FrameType
    name: str
    description: str
    background_color: str
    
    # Video positioning
    video_y_position: int  # Absolute Y coordinate for video top edge
    video_width: int = 1080
    video_height: int = 608  # 1080 * 9/16 = 607.5, rounded to 608
    
    # Divider settings (for DIVIDER_FRAME)
    divider_enabled: bool = False
    divider_thickness: int = 2
    divider_color: str = "#FFFFFF"
    divider_top_y: int = 0
    divider_bottom_y: int = 0
    
    # Text safe zones
    text_zones: List[TextZone] = None
    
    def __post_init__(self):
        """Calculate text zones if not provided"""
        if self.text_zones is None:
            self.text_zones = self._calculate_text_zones()
            
        # Calculate divider positions if enabled
        if self.divider_enabled:
            self.divider_top_y = self.video_y_position - 10
            self.divider_bottom_y = self.video_y_position + self.video_height + 10
    
    def _calculate_text_zones(self) -> List[TextZone]:
        """Calculate safe zones based on video position"""
        # Top zone: from 0 to video start (with margin)
        top_zone = TextZone(
            zone_id="top",
            y_start=0,
            y_end=self.video_y_position - 50  # 50px margin before video
        )
        
        # Bottom zone: from video end to 1920 (with margin)
        bottom_zone = TextZone(
            zone_id="bottom",
            y_start=self.video_y_position + self.video_height + 50,  # 50px margin after video
            y_end=1920
        )
        
        return [top_zone, bottom_zone]
    
    @property
    def video_bottom_y(self) -> int:
        """Get Y coordinate of video bottom edge"""
        return self.video_y_position + self.video_height
    
    @property
    def top_black_space(self) -> int:
        """Get height of black space above video"""
        return self.video_y_position
    
    @property
    def bottom_black_space(self) -> int:
        """Get height of black space below video"""
        return 1920 - self.video_bottom_y


# ============================================================================
# FRAME DEFINITIONS
# ============================================================================

# FRAME 1: CENTER_STRIP
# Video perfectly centered with equal black space top and bottom
CENTER_STRIP = FrameConfig(
    id=FrameType.CENTER_STRIP,
    name="Center Strip",
    description="Clean, minimal layout with video perfectly centered",
    background_color="#000000",
    video_y_position=656,  # (1920 - 608) / 2 = 656
)

# FRAME 2: DIVIDER_FRAME
# Video centered with thin white divider lines for editorial look
DIVIDER_FRAME = FrameConfig(
    id=FrameType.DIVIDER_FRAME,
    name="Divider Frame",
    description="Professional editorial style with divider lines",
    background_color="#2b2b2b",
    video_y_position=656,  # Same as CENTER_STRIP
    divider_enabled=True,
    divider_thickness=2,
    divider_color="#FFFFFF",
)

# FRAME 3: LOWER_ANCHOR
# Video positioned lower for cinematic effect with more space on top
LOWER_ANCHOR = FrameConfig(
    id=FrameType.LOWER_ANCHOR,
    name="Lower Anchor",
    description="Cinematic layout with video anchored lower",
    background_color="#000000",
    video_y_position=836,  # 656 + 180 = 836 (180px below center)
)


# Frame registry for lookup
FRAME_REGISTRY: dict[FrameType, FrameConfig] = {
    FrameType.CENTER_STRIP: CENTER_STRIP,
    FrameType.DIVIDER_FRAME: DIVIDER_FRAME,
    FrameType.LOWER_ANCHOR: LOWER_ANCHOR,
}


def get_frame_config(frame_type: FrameType) -> FrameConfig:
    """Get frame configuration by type"""
    return FRAME_REGISTRY[frame_type]


def list_all_frames() -> List[FrameConfig]:
    """Get all available frame configurations"""
    return list(FRAME_REGISTRY.values())


def validate_frame_type(frame_type: str) -> bool:
    """Check if frame type is valid"""
    try:
        FrameType(frame_type)
        return True
    except ValueError:
        return False
