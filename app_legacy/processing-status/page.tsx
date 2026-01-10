"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  PlugZap,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

export default function ProcessingStatusPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading status...</div>}>
      <ProcessingStatusContent />
    </Suspense>
  );
}

function ProcessingStatusContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [overallProgress, setOverallProgress] = useState(10);
  const [statusLabel, setStatusLabel] = useState("Pending");
  const [isComplete, setIsComplete] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    let timer: NodeJS.Timeout;

    const sync = async () => {
      try {
        setIsLoading(true);
        const resp = await api.video.status(videoId);
        const data = resp.data;
        const status = data.status || "pending";

        const mappedProgress = status === "completed" ? 100 : status === "processing" ? 60 : 10;
        setOverallProgress(mappedProgress);
        setIsComplete(status === "completed");
        setStatusLabel(status === "completed" ? "Completed" : status === "processing" ? "Processing" : "Pending");
        setVideoTitle(data.title ?? null);
        setDuration(typeof data.duration === "number" ? data.duration : null);
        setUpdatedAt(data.updated_at ?? null);
      } catch (error) {
        console.error("Error fetching status", error);
      } finally {
        setIsLoading(false);
      }
    };

    sync();
    timer = setInterval(sync, 4000);
    return () => clearInterval(timer);
  }, [videoId]);

  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="h-4 w-4" /> In-flight processing
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your video is moving through the pipeline.</h1>
        <p className="text-muted-foreground max-w-2xl">We slice, caption, crop, and prep for Instagram. Stay on this page—this surface updates live.</p>
      </div>

      {!videoId && (
        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardContent className="py-8 flex flex-col gap-3">
            <p className="font-semibold">No video selected</p>
            <p className="text-sm text-muted-foreground">Start from Add Video to begin processing, then you’ll see live status here.</p>
            <div className="flex gap-2">
              <Link href="/add-video">
                <Button>Add a video</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Go to dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Real-time status for this upload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{statusLabel}</span>
                <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
                <p className="text-muted-foreground">Video status</p>
                <p className="font-semibold flex items-center gap-2">
                  <PlugZap className="h-4 w-4" />
                  {statusLabel}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
                <p className="text-muted-foreground">Title</p>
                <p className="font-semibold flex items-center gap-2">
                  {videoTitle || "Loading..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {duration ? `${Math.floor(duration / 60)}m ${duration % 60}s` : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
                <p className="text-muted-foreground">Last update</p>
                <p className="font-semibold flex items-center gap-2">
                  {updatedAt ? new Date(updatedAt).toLocaleString() : "--"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/70 bg-card/70 shadow-soft">
        <CardContent className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">What happens next</p>
            <p className="text-lg font-semibold">We’ll notify you once reels are ready to preview.</p>
            <p className="text-sm text-muted-foreground">Stay here or jump to dashboard. Connection status lives in Connect Instagram.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard">
              <Button variant="outline">Go to dashboard</Button>
            </Link>
            <Link href="/videos" className={isComplete ? undefined : "pointer-events-none"} aria-disabled={!isComplete}>
              <Button disabled={!isComplete}>View reels</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
