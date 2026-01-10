"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { isValidYoutubeUrl, extractVideoId } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Youtube,
  Settings2,
  Upload,
  Scissors,
  ShieldCheck,
  Sparkles,
  PlugZap,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function AddVideoPage() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [clipLength, setClipLength] = useState("30");
  const [style, setStyle] = useState("auto");
  const [customCaption, setCustomCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    return isValidYoutubeUrl(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setError("");

    if (url && !validateUrl(url)) {
      setError("Please enter a valid YouTube URL");
    }
  };

  const handlePreview = async () => {
    if (!validateUrl(youtubeUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    try {
      const videoId = extractVideoId(youtubeUrl);
      setVideoPreview({
        id: videoId,
        title: "YouTube video",
        duration: "--",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      });
      toast.success("Preview ready");
    } catch (error) {
      setError("Failed to load video preview");
      toast.error("Failed to load video preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!validateUrl(youtubeUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    try {
      // Create or reuse backend video record
      const uploadResp = await api.video.uploadYoutube(youtubeUrl, customCaption || undefined);
      const created = uploadResp.data;
      const vid = created.id as string;
      setCurrentVideoId(vid);

      await api.video.process(vid);

      toast.success("Processing started");
      router.push(`/processing-status?videoId=${vid}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to process video";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Paste once, stay inside
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-studio-paper" style={{ textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>Quantum Video Forge</h1>
        <p className="text-studio-neon-cyan max-w-2xl" style={{ textShadow: '0 0 10px rgba(0,255,255,0.3)' }}>Neural processing pipeline. Transform YouTube streams into Instagram-ready reels with AI precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>YouTube input</CardTitle>
            <CardDescription>Paste a link, choose clip length and processing style.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={handleUrlChange}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              {error && (
                <div className="flex gap-2 text-sm text-destructive mt-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {youtubeUrl && validateUrl(youtubeUrl) && (
                <div className="flex gap-2 text-sm text-foreground mt-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  Valid YouTube URL
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clipLength">Clip length</Label>
                <Select value={clipLength} onValueChange={setClipLength}>
                  <SelectTrigger id="clipLength">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="35">35 seconds</SelectItem>
                    <SelectItem value="40">40 seconds</SelectItem>
                    <SelectItem value="45">45 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Duration per reel.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Processing style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (recommended)</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How we frame & caption.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customCaption">Custom caption (optional)</Label>
              <textarea
                id="customCaption"
                placeholder="Enter a custom caption for your reels. Leave empty for AI-generated captions."
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={2200}
              />
              <p className="text-xs text-muted-foreground">Custom caption for Instagram posts. Max 2200 characters.</p>
            </div>

            {videoPreview && (
              <div className="space-y-4 pt-4 border-t border-border/40">
                <h3 className="font-semibold">Preview</h3>
                <div className="rounded-xl overflow-hidden border border-border/60 bg-black relative">
                  <Image
                    fill
                    src={videoPreview.thumbnail}
                    alt="Video thumbnail"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{videoPreview.title}</p>
                  <p className="text-sm text-muted-foreground">Duration: {videoPreview.duration}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!validateUrl(youtubeUrl) || isLoading}
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={handleProcess}
                disabled={!validateUrl(youtubeUrl) || isLoading}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? "Processing..." : "Process video"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Pipeline overview</CardTitle>
            <CardDescription>Everything the system will do with your link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {[{
              title: "Scene slicing",
              desc: "Sequential 30-40s cuts with silence trimming and loudness normalization.",
              icon: Scissors,
            }, {
              title: "Caption & crop",
              desc: "Auto captions, vertical 1080x1920 frame, safe margins for IG UI.",
              icon: ShieldCheck,
            }, {
              title: "Publish-ready",
              desc: "Stores reels in queue, ready for Instagram push without leaving the site.",
              icon: PlugZap,
            }].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
                  <div className="h-10 w-10 rounded-lg border border-border/70 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
            <div className="rounded-xl border border-border/60 bg-background/70 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Reminder</p>
              <p className="text-sm text-foreground mt-1">You can monitor token health and page linkage in the Connect Instagram screen.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Sequential cutting",
            description: "We keep clips in order so context is never lost between reels.",
          },
          {
            title: "Vertical format",
            description: "Outputs in 1080x1920 with safe text framing and contrast-aware captions.",
          },
          {
            title: "Quality assured",
            description: "Audio, pacing, and margins reviewed before you publish to IG.",
          },
        ].map((item, idx) => (
          <Card key={idx} className="border border-border/70 bg-card/70">
            <CardContent className="pt-6 space-y-2">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
