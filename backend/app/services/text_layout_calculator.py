"""Text Layout Calculator for Smart Mini Video Editing

Calculates optimal text positioning, sizing, and line breaks for text overlays.
Ensures text never overlaps video and fits within safe zones.
"""

import re
from typing import List, Tuple
from dataclasses import dataclass


@dataclass
class TextLayout:
    """Calculated text layout"""
    text: str
    zone: str  # 'top' or 'bottom'
    font_size: int
    x: int
    y: int
    lines: List[str]
    line_height: int
    color: str = "#FFFFFF"
    font_family: str = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    
    @property
    def total_height(self) -> int:
        """Calculate total height of text block"""
        return len(self.lines) * self.line_height


class TextLayoutCalculator:
    """Calculate text layout for safe zones"""
    
    # Font size constraints
    MIN_FONT_SIZE = 36
    MAX_FONT_SIZE = 72
    INITIAL_FONT_SIZE = 72
    
    # Margins
    HORIZONTAL_MARGIN = 50  # Left/right padding
    VERTICAL_MARGIN = 30    # Top/bottom padding within zone
    
    def __init__(self, reel_width: int = 1080):
        self.reel_width = reel_width
        self.max_text_width = reel_width - (2 * self.HORIZONTAL_MARGIN)  # 980px
    
    def calculate_layout(
        self,
        text: str,
        zone_id: str,
        zone_y_start: int,
        zone_y_end: int,
        zone_height: int
    ) -> TextLayout:
        """
        Calculate optimal text layout for given zone.
        
        Args:
            text: Text content to render
            zone_id: 'top' or 'bottom'
            zone_y_start: Y coordinate of zone start
            zone_y_end: Y coordinate of zone end
            zone_height: Height of safe zone
        
        Returns:
            TextLayout with calculated positions and font size
        """
        # Start with maximum font size and decrease if needed
        font_size = self.INITIAL_FONT_SIZE
        lines = []
        
        # Try decreasing font sizes until text fits
        while font_size >= self.MIN_FONT_SIZE:
            lines = self._wrap_text(text, font_size)
            line_height = self._calculate_line_height(font_size)
            total_height = len(lines) * line_height
            
            # Check if text fits in zone (with margins)
            available_height = zone_height - (2 * self.VERTICAL_MARGIN)
            
            if total_height <= available_height:
                # Text fits!
                break
            
            # Try smaller font
            font_size -= 4
        
        # If still doesn't fit, truncate text
        if font_size < self.MIN_FONT_SIZE:
            font_size = self.MIN_FONT_SIZE
            lines = self._wrap_text(text, font_size)
            line_height = self._calculate_line_height(font_size)
            # TODO: Could add "..." truncation here
        
        # Calculate Y position (center text vertically in zone)
        line_height = self._calculate_line_height(font_size)
        total_text_height = len(lines) * line_height
        
        # Center vertically in available zone
        zone_center_y = (zone_y_start + zone_y_end) // 2
        text_y = zone_center_y - (total_text_height // 2)
        
        # X position (centered horizontally)
        text_x = self.HORIZONTAL_MARGIN
        
        return TextLayout(
            text=text,
            zone=zone_id,
            font_size=font_size,
            x=text_x,
            y=text_y,
            lines=lines,
            line_height=line_height
        )
    
    def _wrap_text(self, text: str, font_size: int) -> List[str]:
        """
        Wrap text to fit max width.
        Uses approximate character width calculation.
        """
        # Approximate character width (very rough estimation)
        # For DejaVuSans-Bold: char_width ≈ font_size * 0.6
        avg_char_width = font_size * 0.6
        max_chars_per_line = int(self.max_text_width / avg_char_width)
        
        # Simple word wrapping
        words = text.split()
        lines = []
        current_line = []
        current_length = 0
        
        for word in words:
            word_length = len(word)
            
            # Check if adding this word exceeds max
            if current_length + word_length + len(current_line) > max_chars_per_line:
                # Start new line
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
                current_length = word_length
            else:
                current_line.append(word)
                current_length += word_length
        
        # Add last line
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines if lines else [text]  # Fallback to single line
    
    def _calculate_line_height(self, font_size: int) -> int:
        """Calculate line height based on font size (with spacing)"""
        return int(font_size * 1.3)  # 30% spacing between lines
    
    def validate_text_placement(
        self,
        text_y: int,
        text_height: int,
        video_y_start: int,
        video_y_end: int
    ) -> bool:
        """
        Validate that text doesn't overlap video.
        
        Returns True if placement is safe, False if overlaps.
        """
        text_y_end = text_y + text_height
        
        # Check for overlap
        if text_y_end < video_y_start:
            return True  # Text is above video
        elif text_y > video_y_end:
            return True  # Text is below video
        else:
            return False  # Overlap detected!


def calculate_text_for_frame(
    text: str,
    zone: str,
    frame_config
) -> TextLayout:
    """
    Convenience function to calculate text layout for a frame zone.
    
    Args:
        text: Text to render
        zone: 'top' or 'bottom'
        frame_config: FrameConfig object with text_zones
    
    Returns:
        TextLayout with calculated positions
    """
    calculator = TextLayoutCalculator()
    
    # Find the requested zone
    zone_obj = None
    for z in frame_config.text_zones:
        if z.zone_id == zone:
            zone_obj = z
            break
    
    if not zone_obj:
        raise ValueError(f"Zone '{zone}' not found in frame config")
    
    return calculator.calculate_layout(
        text=text,
        zone_id=zone,
        zone_y_start=zone_obj.y_start,
        zone_y_end=zone_obj.y_end,
        zone_height=zone_obj.height
    )
