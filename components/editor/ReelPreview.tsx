"use client";

import { FrameType, TextOverlay } from "@/types/frames";
import { Play } from "lucide-react";

interface ReelPreviewProps {
    frameType: FrameType;
    textOverlays: TextOverlay[];
    videoPath?: string;
}

export function ReelPreview({ frameType, textOverlays, videoPath }: ReelPreviewProps) {
    // Calculate video position based on frame type
    const getVideoStyles = () => {
        const baseStyles = {
            width: '100%',
            height: '35%', // Approximate 608px / 1920px ≈ 31.7%, using 35% for visibility
            background: '#52525b', // zinc-600 as placeholder
        };

        switch (frameType) {
            case 'CENTER_STRIP':
                return { ...baseStyles, position: 'absolute' as const, top: '32.5%' };
            case 'DIVIDER_FRAME':
                return { ...baseStyles, position: 'absolute' as const, top: '32.5%' };
            case 'LOWER_ANCHOR':
                return { ...baseStyles, position: 'absolute' as const, top: '43%' };
            default:
                return { ...baseStyles, position: 'absolute' as const, top: '32.5%' };
        }
    };

    const getBackgroundColor = () => {
        return frameType === 'DIVIDER_FRAME' ? '#2b2b2b' : '#000000';
    };

    const topText = textOverlays.find(o => o.zone === 'top')?.text;
    const bottomText = textOverlays.find(o => o.zone === 'bottom')?.text;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Preview</h3>

            {/* 9:16 Preview Container */}
            <div className="relative w-full max-w-xs mx-auto aspect-[9/16] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: getBackgroundColor() }}
                >
                    {/* Video Placeholder */}
                    <div style={getVideoStyles()} className="flex items-center justify-center">
                        <div className="text-center">
                            <Play className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                            <p className="text-xs text-zinc-500">Video Preview</p>
                        </div>
                    </div>

                    {/* Divider Lines (DIVIDER_FRAME only) */}
                    {frameType === 'DIVIDER_FRAME' && (
                        <>
                            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: 'calc(32.5% - 5px)' }} />
                            <div className="absolute left-0 right-0 h-0.5 bg-white" style={{ top: 'calc(67.5% + 5px)' }} />
                        </>
                    )}

                    {/* Top Text Zone */}
                    {topText && (
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-4"
                            style={{ height: frameType === 'LOWER_ANCHOR' ? '40%' : '30%' }}>
                            <p className="text-white font-bold text-center text-sm leading-tight">
                                {topText}
                            </p>
                        </div>
                    )}

                    {/* Bottom Text Zone */}
                    {bottomText && (
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4"
                            style={{ height: frameType === 'LOWER_ANCHOR' ? '24%' : '30%' }}>
                            <p className="text-white font-bold text-center text-xs leading-tight">
                                {bottomText}
                            </p>
                        </div>
                    )}
                </div>

                {/* Aspect Ratio Helper */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm">
                    <p className="text-[10px] text-zinc-400 font-mono">1080×1920</p>
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-zinc-500">
                    This is an approximate preview. Actual render will have precise positioning.
                </p>
            </div>
        </div>
    );
}
