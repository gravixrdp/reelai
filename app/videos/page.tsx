"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import {
    Video,
    Search,
    Filter,
    Download,
    Share2,
    Trash2,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";

interface VideoData {
    id: string;
    title: string;
    youtube_url: string;
    youtube_id: string;
    duration: number;
    thumbnail_url?: string;
    status: "pending" | "downloading" | "processing" | "completed" | "failed";
    reels_count: number;
    created_at: string;
    error_message?: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchVideos();
        const interval = setInterval(fetchVideos, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchVideos() {
        try {
            const response = await fetch("http://localhost:8000/api/video/");
            if (response.ok) {
                const data = await response.json();
                setVideos(data);
            }
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteVideo(id: string) {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/video/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setVideos(videos.filter(v => v.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete video:", error);
        }
    }

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.youtube_url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || video.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "processing":
            case "downloading":
                return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
            case "failed":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-zinc-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "default";
            case "processing":
            case "downloading": return "secondary";
            case "failed": return "destructive";
            default: return "outline";
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">Video Library</h1>
                        <p className="text-zinc-500 mt-2 font-light">
                            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                            {filterStatus !== "all" && ` · Filtered by ${filterStatus}`}
                        </p>
                    </div>
                    <Button onClick={fetchVideos} variant="outline" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                    </Button>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "processing", "completed", "failed"].map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(status)}
                                className="capitalize"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {loading && videos.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                </div>
            ) : filteredVideos.length === 0 ? (
                <FadeIn delay={0.2}>
                    <Card className="min-h-[300px] flex items-center justify-center border-dashed border-white/10 bg-transparent">
                        <div className="text-center">
                            <Video className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-600 font-light">
                                {searchQuery || filterStatus !== "all"
                                    ? "No videos match your search"
                                    : "No videos yet. Start by adding a new video."}
                            </p>
                            {!searchQuery && filterStatus === "all" && (
                                <Button
                                    variant="link"
                                    className="text-zinc-400 mt-2"
                                    onClick={() => window.location.href = "/add-video"}
                                >
                                    Add your first video
                                </Button>
                            )}
                        </div>
                    </Card>
                </FadeIn>
            ) : (
                <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVideos.map((video) => (
                        <FadeInItem key={video.id}>
                            <Card className="h-full flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base line-clamp-2">
                                            {video.title || "Untitled Video"}
                                        </CardTitle>
                                        {getStatusIcon(video.status)}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={getStatusColor(video.status) as any} className="text-xs">
                                            {video.status}
                                        </Badge>
                                        {video.reels_count > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                                {video.reels_count} reel{video.reels_count !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                    {video.thumbnail_url && (
                                        <div className="aspect-video rounded-md overflow-hidden bg-zinc-800">
                                            <img
                                                src={video.thumbnail_url}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {(video.status === "processing" || video.status === "downloading") && (
                                            <ProgressBar
                                                progress={video.status === "downloading" ? 30 : 70}
                                                label={video.status === "downloading" ? "Downloading..." : "Processing..."}
                                                showPercentage={false}
                                            />
                                        )}

                                        {video.error_message && (
                                            <div className="text-xs text-red-400 bg-red-900/10 p-2 rounded border border-red-900/20">
                                                {video.error_message}
                                            </div>
                                        )}

                                        <div className="text-xs text-zinc-500 space-y-1">
                                            <p>Duration: {Math.floor(video.duration / 60)}m {video.duration % 60}s</p>
                                            <p>Added: {new Date(video.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => window.open(video.youtube_url, "_blank")}
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                        {video.status === "completed" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.location.href = `/videos/${video.id}/reels`}
                                            >
                                                <Share2 className="h-3 w-3 mr-1" />
                                                Reels
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteVideo(video.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
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
