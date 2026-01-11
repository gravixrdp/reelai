"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FrameType, TextOverlay } from "@/types/frames";
import { FrameSelector } from "@/components/editor/FrameSelector";
import { TextOverlayEditor } from "@/components/editor/TextOverlayEditor";
import { ReelPreview } from "@/components/editor/ReelPreview";
import { Loader2, ArrowLeft, Wand2, Download, Instagram, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VideoStatus {
    video_id: number;
    title: string;
    youtube_url: string;
    status: string;
}

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const videoId = params.videoId as string;

    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState<VideoStatus | null>(null);
    const [selectedFrame, setSelectedFrame] = useState<FrameType>('CENTER_STRIP');
    const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);

    // Render status
    const [isRendering, setIsRendering] = useState(false);
    const [renderResult, setRenderResult] = useState<{ url: string } | null>(null);

    // Initial load
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/videos/${videoId}`);
                if (!res.ok) throw new Error("Video not found");
                const data = await res.json();
                setVideo(data);
            } catch (error) {
                console.error("Failed to load video", error);
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideo();
        }
    }, [videoId]);

    const handleRender = async () => {
        if (!video) return;

        setIsRendering(true);
        setRenderResult(null);

        try {
            const res = await fetch("http://localhost:8000/api/editor/render", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    video_id: video.video_id,
                    frame_type: selectedFrame,
                    text_overlays: textOverlays,
                    has_shadow: true, // Default to true based on requirements
                    has_overlay: false
                })
            });

            if (!res.ok) {
                throw new Error("Render failed");
            }

            const data = await res.json();
            if (data.success && data.url) {
                // Determine full URL (assuming backend serves public folder)
                setRenderResult({
                    url: `http://localhost:8000${data.url}`,
                    path: data.output_path || data.url // Use whatever path backend gave for re-upload
                });
            }

        } catch (error) {
            console.error("Render error:", error);
            alert("Failed to render video. Please try again.");
        } finally {
            setIsRendering(false);
        }
    };

    const handleUpload = async () => {
        if (!renderResult) return;

        setIsUploading(true);
        setUploadResult(null);

        try {
            // For local dev, we might need to be careful about the path we send.
            // The backend expects a path it can read or a URL it can download.
            // Our render endpoint returned 'output_path' which is local file path.
            // We should send THAT back.

            const res = await fetch("http://localhost:8000/api/editor/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    video_path: renderResult.path,
                    caption: `Created with Gravix Reel Studio 🚀\n\n#reels #contentcreator #${selectedFrame.toLowerCase().replace('_', '')}`
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Upload failed");
            }

            const data = await res.json();
            if (data.success) {
                setUploadResult({ status: 'success' });
            }

        } catch (error) {
            console.error("Upload error:", error);
            alert(`Failed to upload: ${error}`);
            setUploadResult({ status: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
                <p className="text-zinc-400">Video not found</p>
                <Link href="/videos">
                    <Button variant="outline">Go Back</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/videos/${videoId}`} className="text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-semibold text-lg">{video.title}</h1>
                            <p className="text-xs text-zinc-500 font-mono">ID: {videoId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium">
                            Mini Editor Mode
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Controls */}
                    <div className="space-y-8 order-2 lg:order-1">

                        {/* Frame Selection */}
                        <section className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
                            <FrameSelector
                                selectedFrame={selectedFrame}
                                onChange={setSelectedFrame}
                            />
                        </section>

                        {/* Text Overlay */}
                        <section className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
                            <TextOverlayEditor
                                textOverlays={textOverlays}
                                onChange={setTextOverlays}
                            />
                        </section>

                        {/* Actions */}
                        <div className="sticky bottom-4 bg-black/80 backdrop-blur p-4 border border-white/10 rounded-xl space-y-4">
                            <Button
                                className="w-full h-12 text-base font-semibold bg-white text-black hover:bg-zinc-200"
                                onClick={handleRender}
                                disabled={isRendering}
                            >
                                {isRendering ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Rendering Reel...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5 mr-2" />
                                        Render Reel
                                    </>
                                )}
                            </Button>

                            {renderResult && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400 text-sm font-medium">Render Complete!</span>
                                        </div>
                                        <a
                                            href={renderResult.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                        >
                                            <Button size="sm" variant="ghost" className="h-8 text-green-400 hover:text-green-300 hover:bg-green-500/20">
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </a>
                                    </div>

                                    {/* Upload Button */}
                                    <Button
                                        className={`w-full h-12 text-base font-semibold transition-all ${uploadResult?.status === 'success'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-default'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                            }`}
                                        onClick={handleUpload}
                                        disabled={isUploading || uploadResult?.status === 'success'}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Publishing to Instagram...
                                            </>
                                        ) : uploadResult?.status === 'success' ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                Published Successfully!
                                            </>
                                        ) : (
                                            <>
                                                <Instagram className="w-5 h-5 mr-2" />
                                                Post to Instagram
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-zinc-500">
                                        Posts to connected account (@gravi_xshow)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Preview & Output */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="sticky top-24">

                            {/* LIVE PREVIEW or FINAL RESULT */}
                            {renderResult ? (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                    <h3 className="text-lg font-medium text-green-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Final Result
                                    </h3>
                                    <div className="aspect-[9/16] w-full max-w-sm mx-auto bg-black rounded-xl overflow-hidden border-2 border-green-500/30 shadow-2xl shadow-green-900/20">
                                        <video
                                            src={renderResult.url}
                                            controls
                                            autoPlay
                                            loop
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setRenderResult(null)}>
                                            Back to Editor Preview
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <ReelPreview
                                        frameType={selectedFrame}
                                        textOverlays={textOverlays}
                                    />
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
