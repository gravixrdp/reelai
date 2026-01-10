"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import { useToast } from "@/components/hooks/use-toast";
import {
    Download,
    Instagram,
    Share2,
    Eye,
    Loader2,
    CheckCircle2,
    Film
} from "lucide-react";

interface Reel {
    id: string;
    video_id: string;
    chunk_index: number;
    file_path: string;
    thumbnail_path?: string;
    duration: number;
    title?: string;
    description?: string;
    hashtags?: string;
    published_to_instagram: boolean;
    instagram_media_id?: string;
    created_at: string;
}

export default function ReelsPage() {
    const params = useParams();
    const videoId = params.id as string;
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (videoId) {
            fetchReels();
        }
    }, [videoId]);

    async function fetchReels() {
        try {
            const response = await fetch(`http://localhost:8000/api/reels/${videoId}`);
            if (response.ok) {
                const data = await response.json();
                setReels(data);
            }
        } catch (error) {
            console.error("Failed to fetch reels:", error);
        } finally {
            setLoading(false);
        }
    }

    async function publishToInstagram(reelId: string) {
        setPublishing(reelId);

        try {
            const response = await fetch(`http://localhost:8000/api/reels/${reelId}/publish`, {
                method: "POST",
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Reel published to Instagram successfully",
                });
                fetchReels();
            } else {
                const error = await response.json();
                toast({
                    title: "Error",
                    description: error.detail || "Failed to publish reel",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to publish reel to Instagram",
            });
        } finally {
            setPublishing(null);
        }
    }

    async function downloadReel(reelId: string, filename: string) {
        try {
            const response = await fetch(`http://localhost:8000/api/reels/${reelId}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || `reel-${reelId}.mp4`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download reel",
            });
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Generated Reels</h1>
                    <p className="text-zinc-500 mt-2 font-light">
                        {reels.length} reel{reels.length !== 1 ? 's' : ''} ready to publish
                    </p>
                </div>
            </FadeIn>

            {reels.length === 0 ? (
                <FadeIn delay={0.2}>
                    <Card className="min-h-[300px] flex items-center justify-center border-dashed border-white/10 bg-transparent">
                        <div className="text-center">
                            <Film className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-600 font-light">
                                No reels generated yet. Processing may still be in progress.
                            </p>
                        </div>
                    </Card>
                </FadeIn>
            ) : (
                <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reels.map((reel) => (
                        <FadeInItem key={reel.id}>
                            <Card className="h-full flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base">
                                            Reel #{reel.chunk_index + 1}
                                        </CardTitle>
                                        {reel.published_to_instagram && (
                                            <Badge variant="default" className="text-xs">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Published
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                    {reel.thumbnail_path && (
                                        <div className="aspect-[9/16] rounded-md overflow-hidden bg-zinc-800">
                                            <img
                                                src={reel.thumbnail_path}
                                                alt={`Reel ${reel.chunk_index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {reel.title && (
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-1">Title</p>
                                                <p className="text-sm text-zinc-300">{reel.title}</p>
                                            </div>
                                        )}

                                        {reel.hashtags && (
                                            <div>
                                                <p className="text-xs text-zinc-500 mb-1">Hashtags</p>
                                                <p className="text-xs text-blue-400">{reel.hashtags}</p>
                                            </div>
                                        )}

                                        <div className="text-xs text-zinc-500">
                                            <p>Duration: {reel.duration}s</p>
                                            <p>Created: {new Date(reel.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {!reel.published_to_instagram ? (
                                            <Button
                                                className="w-full"
                                                onClick={() => publishToInstagram(reel.id)}
                                                disabled={publishing === reel.id}
                                            >
                                                {publishing === reel.id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Publishing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Instagram className="h-4 w-4 mr-2" />
                                                        Publish to Instagram
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                                onClick={() => window.open(`https://www.instagram.com/p/${reel.instagram_media_id}`, '_blank')}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View on Instagram
                                            </Button>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                size="sm"
                                                onClick={() => downloadReel(reel.id, `reel-${reel.chunk_index + 1}.mp4`)}
                                            >
                                                <Download className="h-3 w-3 mr-1" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                size="sm"
                                                onClick={() => {
                                                    // Copy share link
                                                    navigator.clipboard.writeText(window.location.href + `/${reel.id}`);
                                                    toast({
                                                        title: "Link copied",
                                                        description: "Share link copied to clipboard",
                                                    });
                                                }}
                                            >
                                                <Share2 className="h-3 w-3 mr-1" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeInItem>
                    ))}
                </FadeInStagger>
            )}
        </div>
    );
}
