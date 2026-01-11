"""
Test suite for frame configuration system
"""

import pytest
from app.config.frames import (
    FrameType,
    get_frame_config,
    list_all_frames,
    validate_frame_type,
    CENTER_STRIP,
    DIVIDER_FRAME,
    LOWER_ANCHOR
)


class TestFrameGeometry:
    """Test frame geometry calculations"""
    
    def test_center_strip_geometry(self):
        """CENTER_STRIP should have equal black space top and bottom"""
        frame = get_frame_config(FrameType.CENTER_STRIP)
        
        assert frame.video_y_position == 656
        assert frame.video_height == 608
        assert frame.top_black_space == 656
        assert frame.bottom_black_space == 656
        assert frame.top_black_space == frame.bottom_black_space
    
    def test_divider_frame_geometry(self):
        """DIVIDER_FRAME should match CENTER_STRIP position with dividers"""
        frame = get_frame_config(FrameType.DIVIDER_FRAME)
        
        assert frame.video_y_position == 656
        assert frame.divider_enabled is True
        assert frame.divider_thickness == 2
        assert frame.divider_top_y == 646  # 656 - 10
        assert frame.divider_bottom_y == 1274  # 656 + 608 + 10
    
    def test_lower_anchor_geometry(self):
        """LOWER_ANCHOR should have more space on top than bottom"""
        frame = get_frame_config(FrameType.LOWER_ANCHOR)
        
        assert frame.video_y_position == 836  # 180px below center
        assert frame.top_black_space == 836
        assert frame.bottom_black_space == 476
        assert frame.top_black_space > frame.bottom_black_space
    
    def test_all_frames_have_correct_dimensions(self):
        """All frames should maintain correct reel dimensions"""
        for frame in list_all_frames():
            # Video should span full width
            assert frame.video_width == 1080
            
            # Video height should be 16:9 aspect
            assert frame.video_height == 608  # 1080 * 9/16 ≈ 608
            
            # Total height should be 1920
            total_height = frame.top_black_space + frame.video_height + frame.bottom_black_space
            assert total_height == 1920


class TestTextZones:
    """Test text safe zone calculations"""
    
    def test_center_strip_text_zones(self):
        """CENTER_STRIP text zones should not overlap video"""
        frame = get_frame_config(FrameType.CENTER_STRIP)
        
        top_zone = frame.text_zones[0]
        bottom_zone = frame.text_zones[1]
        
        # Top zone: 0 to video_y - 50
        assert top_zone.zone_id == 'top'
        assert top_zone.y_start == 0
        assert top_zone.y_end == 606  # 656 - 50
        
        # Bottom zone: video_y + video_height + 50 to 1920
        assert bottom_zone.zone_id == 'bottom'
        assert bottom_zone.y_start == 1314  # 656 + 608 + 50
        assert bottom_zone.y_end == 1920
    
    def test_lower_anchor_larger_top_zone(self):
        """LOWER_ANCHOR should have larger top text zone"""
        frame = get_frame_config(FrameType.LOWER_ANCHOR)
        
        top_zone = frame.text_zones[0]
        bottom_zone = frame.text_zones[1]
        
        # Top zone should be larger
        assert top_zone.height > bottom_zone.height
        assert top_zone.height == 786  # 836 - 50
    
    def test_no_text_zone_overlap_with_video(self):
        """Text zones should never overlap video region"""
        for frame in list_all_frames():
            video_start = frame.video_y_position
            video_end = frame.video_y_position + frame.video_height
            
            for zone in frame.text_zones:
                if zone.zone_id == 'top':
                    # Top zone should end before video
                    assert zone.y_end < video_start
                else:  # bottom
                    # Bottom zone should start after video
                    assert zone.y_start > video_end


class TestFrameRegistry:
    """Test frame configuration registry"""
    
    def test_all_three_frames_registered(self):
        """Should have exactly 3 frames"""
        frames = list_all_frames()
        assert len(frames) == 3
    
    def test_frame_types_are_unique(self):
        """All frame IDs should be unique"""
        frames = list_all_frames()
        frame_ids = [f.id for f in frames]
        assert len(frame_ids) == len(set(frame_ids))
    
    def test_get_frame_by_type(self):
        """Should retrieve correct frame by type"""
        center = get_frame_config(FrameType.CENTER_STRIP)
        assert center.name == "Center Strip"
        
        divider = get_frame_config(FrameType.DIVIDER_FRAME)
        assert divider.name == "Divider Frame"
        
        lower = get_frame_config(FrameType.LOWER_ANCHOR)
        assert lower.name == "Lower Anchor"
    
    def test_validate_frame_type(self):
        """Frame type validation should work correctly"""
        assert validate_frame_type('CENTER_STRIP') is True
        assert validate_frame_type('DIVIDER_FRAME') is True
        assert validate_frame_type('LOWER_ANCHOR') is True
        assert validate_frame_type('INVALID_FRAME') is False
        assert validate_frame_type('') is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
