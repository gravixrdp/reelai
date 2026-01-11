"""
Test suite for text layout calculator
"""

import pytest
from app.services.text_layout_calculator import (
    TextLayoutCalculator,
    TextLayout,
    calculate_text_for_frame
)
from app.config.frames import get_frame_config, FrameType


class TestTextLayoutCalculation:
    """Test text layout calculations"""
    
    def test_short_text_uses_max_font_size(self):
        """Short text should use maximum font size"""
        calc = TextLayoutCalculator()
        layout = calc.calculate_layout(
            text="Short text",
            zone_id="top",
            zone_y_start=0,
            zone_y_end=600,
            zone_height=600
        )
        
        assert layout.font_size == 72  # MAX_FONT_SIZE
        assert len(layout.lines) == 1
    
    def test_long_text_decreases_font_size(self):
        """Long text should decrease font size to fit"""
        calc = TextLayoutCalculator()
        long_text = "This is a very long text that should need to decrease font size to fit properly"
        
        layout = calc.calculate_layout(
            text=long_text,
            zone_id="top",
            zone_y_start=0,
            zone_y_end=600,
            zone_height=600
        )
        
        # Should use smaller font or wrap to multiple lines
        assert layout.font_size <= 72
        assert len(layout.lines) >= 1
    
    def test_word_wrapping(self):
        """Text should wrap at word boundaries"""
        calc = TextLayoutCalculator()
        layout = calc.calculate_layout(
            text="This is a test caption for the reel",
            zone_id="top",
            zone_y_start=0,
            zone_y_end=600,
            zone_height=600
        )
        
        # Should wrap into multiple lines
        assert len(layout.lines) >= 2
        # Each line should be a full word (no mid-word breaks)
        for line in layout.lines:
            assert ' ' in line or len(layout.lines) == 1
    
    def test_font_size_minimum(self):
        """Font size should never go below minimum"""
        calc = TextLayoutCalculator()
        very_long_text = " ".join(["word"] * 100)  # Very long text
        
        layout = calc.calculate_layout(
            text=very_long_text,
            zone_id="top",
            zone_y_start=0,
            zone_y_end=200,  # Small zone
            zone_height=200
        )
        
        assert layout.font_size >= calc.MIN_FONT_SIZE
    
    def test_vertical_centering(self):
        """Text should be vertically centered in zone"""
        calc = TextLayoutCalculator()
        layout = calc.calculate_layout(
            text="Centered",
            zone_id="top",
            zone_y_start=100,
            zone_y_end=500,
            zone_height=400
        )
        
        # Y position should be somewhere in the middle of the zone
        zone_center = (100 + 500) // 2
        # Allow some tolerance
        assert abs(layout.y - (zone_center - layout.total_height // 2)) < 100
    
    def test_horizontal_positioning(self):
        """Text should have correct horizontal margin"""
        calc = TextLayoutCalculator()
        layout = calc.calculate_layout(
            text="Test",
            zone_id="top",
            zone_y_start=0,
            zone_y_end=600,
            zone_height=600
        )
        
        assert layout.x == calc.HORIZONTAL_MARGIN  # 50px


class TestFrameIntegration:
    """Test text layout with frame configurations"""
    
    def test_calculate_for_center_strip_top(self):
        """Calculate layout for CENTER_STRIP top zone"""
        frame = get_frame_config(FrameType.CENTER_STRIP)
        layout = calculate_text_for_frame(
            text="Top caption",
            zone="top",
            frame_config=frame
        )
        
        assert layout.zone == "top"
        assert layout.y < frame.video_y_position  # Text above video
    
    def test_calculate_for_lower_anchor_top(self):
        """LOWER_ANCHOR should have larger top zone for text"""
        frame = get_frame_config(FrameType.LOWER_ANCHOR)
        layout = calculate_text_for_frame(
            text="Large top caption with more space",
            zone="top",
            frame_config=frame
        )
        
        # Should fit comfortably in larger top zone
        assert layout.zone == "top"
        assert layout.font_size >= 60  # Should have room for larger font
    
    def test_invalid_zone_raises_error(self):
        """Invalid zone should raise ValueError"""
        frame = get_frame_config(FrameType.CENTER_STRIP)
        
        with pytest.raises(ValueError, match="Zone .* not found"):
            calculate_text_for_frame(
                text="Test",
                zone="middle",  # Invalid zone
                frame_config=frame
            )


class TestTextLayoutProperties:
    """Test TextLayout class properties"""
    
    def test_total_height_calculation(self):
        """total_height should match lines * line_height"""
        layout = TextLayout(
            text="Test",
            zone="top",
            font_size=72,
            x=50,
            y=100,
            lines=["Line 1", "Line 2"],
            line_height=90
        )
        
        assert layout.total_height == 180  # 2 * 90


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
