/**
 * API Client for Reel Editing
 */

import { ReelEditData, ReelEditRequest, FrameConfig, RenderJobResponse } from '@/types/frames';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get detailed reel information with editing metadata
 */
export async function getReel(reelId: number): Promise\u003cReelEditData\u003e {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/reels/${reelId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch reel');
    }

    return response.json();
}

/**
 * Update reel frame and/or text overlays
 */
export async function updateReel(
    reelId: number,
    updates: ReelEditRequest
): Promise\u003cReelEditData\u003e {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/reels/${reelId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update reel');
    }

    return response.json();
}

/**
 * Queue reel re-render with current settings
 */
export async function renderReel(reelId: number): Promise\u003cRenderJobResponse\u003e {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/reels/${reelId}/render`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to queue render');
    }

    return response.json();
}

/**
 * Get list of available frame configurations
 */
export async function getFrameConfigs(): Promise\u003cFrameConfig[]\u003e {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/api/reels/frames/list`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch frame configs');
    }

    return response.json();
}
