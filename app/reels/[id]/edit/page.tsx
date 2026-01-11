"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FrameSelector } from "@/components/editor/FrameSelector";
import { TextOverlayEditor } from "@/components/editor/TextOverlayEditor";
import { ReelPreview } from "@/components/editor/ReelPreview";
import { getReel, updateReel, renderReel } from "@/lib/api/reels";
import { ReelEditData, FrameType, TextOverlay } from "@/types/frames";
import { ArrowLeft, Loader2, Save, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import toast from "react-hot-toast";

export default function ReelEditorPage() {
    const router = useRouter();
    const params = useParams();
    const reelId = parseInt(params.id as string);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rendering, setRendering] = useState(false);
    const [reel, setReel] = useState<ReelEditData | null>(null);

    // Editor state
    const [frameType, setFrameType] = useState<FrameType>('CENTER_STRIP');
    const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadReel();
    }, [reelId]);

    const loadReel = async () => {
        try {
            const data = await getReel(reelId);
            setReel(data);
            setFrameType(data.frame_type);
            setTextOverlays(data.text_overlays || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load reel:', error);
            toast.error('Failed to load reel');
            router.push('/videos');
        }
    };

    const handleFrameChange = (newFrame: FrameType) => {
        setFrameType(newFrame);
        setHasChanges(true);
    };

    const handleTextChange = (newText: TextOverlay[]) => {
        setTextOverlays(newText);
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges) return;

        setSaving(true);
        try {
            const updated = await updateReel(reelId, {
                frame_type: frameType,
                text_overlays: textOverlays,
            });

            setReel(updated);
            setHasChanges(false);
            toast.success('Changes saved!');
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleRender = async () => {
        // Save first if there are unsaved changes
        if (hasChanges) {
            await handleSave();
        }

        setRendering(true);
        try {
            const result = await renderReel(reelId);
            toast.success(result.message);

            // Show render info
            toast.custom((t) => (
                <div className="bg-zinc-900 text-white px-6 py-4 rounded-xl border border-white/10 shadow-xl">
                    <p className="font-medium mb-1">Rendering started</p>
                    <p className="text-sm text-zinc-400">Job ID: {result.job_id.substring(0, 8)}...</p>
                </div>
            ), { duration: 4000 });

        } catch (error) {
            console.error('Failed to render:', error);
            toast.error('Failed to start rendering');
        } finally {
            setRendering(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (!reel) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <FadeIn>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="text-zinc-400 hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-3xl font-light tracking-tight">Reel Editor</h1>
                                <p className="text-zinc-500 mt-1">
                                    Reel #{reel.reel_number} · {Math.round(reel.duration)}s
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || saving}
                                variant="outline"
                                className="border-white/10 hover:border-white/20"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save
                            </Button>

                            <Button
                                onClick={handleRender}
                                disabled={rendering}
                                className="bg-white text-black hover:bg-zinc-200"
                            >
                                {rendering ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Render Reel
                            </Button>
                        </div>
                    </div>
                </FadeIn>

                {/* Main Editor */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Frame & Text Controls */}
                    <div className="lg:col-span-2 space-y-6">
                        <FadeIn delay={0.1}>
                            <Card className="bg-zinc-900/40 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-light">Frame Layout</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FrameSelector
                                        selectedFrame={frameType}
                                        onChange={handleFrameChange}
                                    />
                                </CardContent>
                            </Card>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <Card className="bg-zinc-900/40 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-light">Text Overlays</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TextOverlayEditor
                                        textOverlays={textOverlays}
                                        onChange={handleTextChange}
                                    />
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>

                    {/* Right: Preview */}
                    <div className="lg:col-span-1">
                        <FadeIn delay={0.3}>
                            <Card className="bg-zinc-900/40 border-white/5 sticky top-8">
                                <CardContent className="pt-6">
                                    <ReelPreview
                                        frameType={frameType}
                                        textOverlays={textOverlays}
                                        videoPath={reel.file_path}
                                    />
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </div>

                {/* Status Bar */}
                {hasChanges && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-amber-500/20 border border-amber-500/30 rounded-full backdrop-blur-md">
                        <p className="text-sm text-amber-300 font-medium">
                            You have unsaved changes
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
