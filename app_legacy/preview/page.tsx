"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Download,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Reel {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  status: "ready" | "published";
}

export default function PreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const reels: Reel[] = [
    {
      id: 1,
      title: "Reel 1 - Intro",
      duration: "0:35",
      thumbnail: "https://via.placeholder.com/400x600?text=Reel+1",
      status: "ready",
    },
    {
      id: 2,
      title: "Reel 2 - Main Content",
      duration: "0:40",
      thumbnail: "https://via.placeholder.com/400x600?text=Reel+2",
      status: "ready",
    },
    {
      id: 3,
      title: "Reel 3 - Tips",
      duration: "0:38",
      thumbnail: "https://via.placeholder.com/400x600?text=Reel+3",
      status: "ready",
    },
    {
      id: 4,
      title: "Reel 4 - Outro",
      duration: "0:32",
      thumbnail: "https://via.placeholder.com/400x600?text=Reel+4",
      status: "ready",
    },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const currentReel = reels[currentIndex];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Preview Your Reels
        </h1>
        <p className="text-muted-foreground">
          Review and prepare your reels for upload. You generated {reels.length} reels.
        </p>
      </div>

      {/* Main Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
              <Image
                fill
                src={currentReel.thumbnail}
                alt={currentReel.title}
                className="object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    setSelectedReel(currentReel);
                    setIsPreviewOpen(true);
                  }}
                  className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <svg
                    className="h-6 w-6 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentReel.duration}
                </span>
              </div>
            </div>

            {/* Info */}
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Reel {currentIndex + 1} of {reels.length}
                  </p>
                  <h2 className="text-2xl font-bold mt-1">{currentReel.title}</h2>
                </div>

                {/* Controls */}
                <div className="flex gap-2 pt-4 border-t border-border/20">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={reels.length <= 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={reels.length <= 1}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upload Action */}
          <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Ready to Upload?</h3>
                <p className="text-sm text-muted-foreground">
                  Upload all {reels.length} reels directly to Instagram
                </p>
                <Link href="/connect-instagram" className="block w-full">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Instagram
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Reel List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Reels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reels.map((reel, idx) => (
                  <button
                    key={reel.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      currentIndex === idx
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-border/80"
                    }`}
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      Reel {idx + 1}
                    </p>
                    <p className="font-medium truncate">{reel.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reel.duration}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delete Option */}
          <Button variant="destructive" className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete All Reels
          </Button>
        </div>
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReel?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              Video Player Placeholder
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
