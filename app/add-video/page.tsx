"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/motion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/components/hooks/use-toast";
import { Upload, Link as LinkIcon, Loader2, CheckCircle2 } from "lucide-react";

interface UploadItem {
    id: string;
    url: string;
    status: "pending" | "uploading" | "completed" | "error";
    progress: number;
    error?: string;
}

export default function AddVideoPage() {
    const [urls, setUrls] = useState<string>("");
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const urlList = urls.split("\n").filter(url => url.trim());

        if (urlList.length === 0) {
            toast({
                title: "Error",
                description: "Please enter at least one YouTube URL",
            });
            setLoading(false);
            return;
        }

        const newUploads: UploadItem[] = urlList.map((url, index) => ({
            id: `upload-${Date.now()}-${index}`,
            url: url.trim(),
            status: "pending",
            progress: 0,
        }));

        setUploads(newUploads);

        // Process each URL
        for (let i = 0; i < newUploads.length; i++) {
            const upload = newUploads[i];

            setUploads(prev => prev.map(u =>
                u.id === upload.id ? { ...u, status: "uploading" } : u
            ));

            try {
                // Call real backend API
                // Nginx will route /api/videos -> localhost:8000/videos
                const response = await fetch("/api/videos/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        youtube_url: upload.url,
                        title: `Imported via Web ${new Date().toISOString()}`
                    }),
                });

                if (response.ok) {
                    const data = await response.json();

                    setUploads(prev => prev.map(u =>
                        u.id === upload.id ? { ...u, status: "completed", progress: 100 } : u
                    ));

                    toast({
                        title: "Success",
                        description: `Video queued for processing: ${data.video_id}`,
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Upload failed");
                }
            } catch (error) {
                setUploads(prev => prev.map(u =>
                    u.id === upload.id ? {
                        ...u,
                        status: "error",
                        error: error instanceof Error ? error.message : "Upload failed"
                    } : u
                ));

                toast({
                    title: "Error",
                    description: `Failed to upload: ${upload.url}`,
                });
            }
        }

        setLoading(false);

        // Redirect to videos page after a delay
        setTimeout(() => {
            router.push("/videos");
        }, 2000);
    }

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">New Project</h1>
                    <p className="text-zinc-500 mt-2 font-light">Import content to the studio.</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="w-5 h-5" />
                            Source Material
                        </CardTitle>
                        <CardDescription>
                            Enter YouTube URLs (one per line for batch upload)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="urls" className="text-sm font-medium text-zinc-300">
                                    YouTube URLs
                                </label>
                                <textarea
                                    ref={textareaRef}
                                    id="urls"
                                    placeholder="https://youtube.com/watch?v=...&#10;https://youtube.com/watch?v=...&#10;https://youtube.com/watch?v=..."
                                    value={urls}
                                    onChange={(e) => setUrls(e.target.value)}
                                    required
                                    rows={5}
                                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-mono resize-none"
                                />
                                <p className="text-xs text-zinc-500">
                                    Supports batch upload - enter multiple URLs, one per line
                                </p>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={loading || !urls.trim()}
                                    className="flex-1 sm:flex-none"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Begin Processing
                                        </>
                                    )}
                                </Button>
                                {uploads.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setUploads([]);
                                            setUrls("");
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>

                        {uploads.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <h3 className="text-sm font-medium text-zinc-300">Upload Progress</h3>
                                {uploads.map((upload) => (
                                    <div
                                        key={upload.id}
                                        className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-zinc-300 truncate font-mono">
                                                    {upload.url}
                                                </p>
                                            </div>
                                            <div>
                                                {upload.status === "completed" && (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                )}
                                                {upload.status === "uploading" && (
                                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                )}
                                                {upload.status === "error" && (
                                                    <div className="w-5 h-5 rounded-full bg-red-500" />
                                                )}
                                            </div>
                                        </div>

                                        {(upload.status === "uploading" || upload.status === "completed") && (
                                            <ProgressBar
                                                progress={upload.progress}
                                                showPercentage={false}
                                            />
                                        )}

                                        {upload.error && (
                                            <p className="text-xs text-red-400">{upload.error}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
                <Card className="bg-white/5 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-base">Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                Automatic video download and processing
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                Batch upload support for multiple videos
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                Real-time progress tracking
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                AI-powered metadata generation
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    );
}
