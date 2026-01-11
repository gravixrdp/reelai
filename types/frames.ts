/**
 * Frame System Types for Smart Mini Video Editor
 */

export type FrameType = 'CENTER_STRIP' | 'DIVIDER_FRAME' | 'LOWER_ANCHOR';

export interface FrameConfig {
    id: FrameType;
    name: string;
    description: string;
    previewImage?: string;
}

export interface TextZone {
    zone_id: 'top' | 'bottom';
    y_start: number;
    y_end: number;
    max_width: number;
}

export interface TextOverlay {
    text: string;
    zone: 'top' | 'bottom';
    font_size?: number;  // Auto-calculated if not provided
    x?: number;
    y?: number;
}

export interface ReelEditData {
    reel_id: number;
    video_id: number;
    chunk_id: number;
    reel_number: number;
    file_path: string;
    duration: number;

    // Frame & Text
    frame_type: FrameType;
    text_overlays: TextOverlay[] | null;
    has_shadow: boolean;
    shadow_intensity: number;
    has_overlay: boolean;
    overlay_opacity: number;
    is_edited: boolean;

    // AI Metadata
    title?: string;
    caption?: string;
    hashtags?: string[];
    quality_score?: number;

    // Instagram
    is_uploaded: boolean;
    instagram_url?: string;

    created_at: string;
    updated_at: string;
}

export interface ReelEditRequest {
    frame_type?: FrameType;
    text_overlays?: TextOverlay[];
    has_shadow?: boolean;
    shadow_intensity?: number;
    has_overlay?: boolean;
    overlay_opacity?: number;
}

export interface RenderJobResponse {
    job_id: string;
    reel_id: number;
    status: string;
    message: string;
}
