"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Panel } from "@/components/dashboard/Panel";
import { api } from "@/lib/api";
import { Search, Download, Eye, Clock, Video, Play } from "lucide-react";

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const res = await api.video.list();
        setVideos(res.data || []);
      } catch (error) {
        console.error("Error loading videos", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => (video.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase()));
  }, [videos, searchQuery]);

  const renderStatus = (status?: string) => {
    if (status === "completed") return (
      <div className="px-3 py-1 bg-studio-accent/10 text-studio-accent text-xs rounded-full font-medium">
        ✓ Completed
      </div>
    );
    if (status === "processing") return (
      <div className="px-3 py-1 bg-studio-gold/10 text-studio-gold text-xs rounded-full font-medium">
        ⟳ Processing
      </div>
    );
    return (
      <div className="px-3 py-1 bg-studio-iron/50 text-studio-fog text-xs rounded-full font-medium">
        Pending
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-studio-velvet/3 rounded-full blur-3xl animate-drift-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-display-lg text-studio-paper font-light">
            Reels Timeline
          </h1>
          <p className="text-xl text-studio-cloud max-w-2xl mx-auto">
            Your cinematic journey. From concept to vertical masterpiece.
          </p>
        </motion.div>

        {/* Search and Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Panel title="Search Library" subtitle="Find your creations">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-studio-fog" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full studio-input pl-12"
                />
              </div>
              <p className="studio-text-label mt-2">
                {isLoading ? "Loading..." : `${filteredVideos.length} reels in your library`}
              </p>
            </Panel>
          </div>

          <Panel title="Overview" subtitle="Your progress">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-studio-coal/30 rounded-xl">
                <p className="studio-text-label">Total</p>
                <p className="text-2xl font-light text-studio-paper">{videos.length}</p>
              </div>
              <div className="text-center p-4 bg-studio-accent/5 rounded-xl">
                <p className="studio-text-label">Ready</p>
                <p className="text-2xl font-light text-studio-accent">
                  {videos.filter((v) => v.status === "completed").length}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {isLoading && (
            <Panel>
              <div className="py-12 text-center">
                <p className="studio-text-label">Loading your cinematic library...</p>
              </div>
            </Panel>
          )}

          {!isLoading && filteredVideos.length === 0 && (
            <Panel className="text-center">
              <div className="py-12 space-y-6">
                <Video className="h-16 w-16 text-studio-fog mx-auto opacity-50" />
                <div>
                  <p className="text-studio-paper font-medium text-lg mb-2">Your timeline awaits</p>
                  <p className="text-studio-cloud">Begin your first creation to see it here.</p>
                </div>
                <Link href="/add-video">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="studio-button-primary px-8 py-4"
                  >
                    Start Creating
                  </motion.button>
                </Link>
              </div>
            </Panel>
          )}

          {!isLoading && filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Panel title={video.title || "Untitled Project"} className="hover:border-studio-accent/30 transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-studio-accent/10 rounded-2xl flex items-center justify-center">
                      <Play className="h-8 w-8 text-studio-accent" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-studio-fog">
                          <Clock className="h-4 w-4" />
                          {video.duration || "--"}
                        </div>
                        <div className="flex items-center gap-1 text-studio-fog">
                          <Video className="h-4 w-4" />
                          {new Date(video.created_at || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {renderStatus(video.status)}
                    <div className="flex gap-2">
                      <Link href={`/processing-status?videoId=${video.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-studio-iron/50 hover:bg-studio-steel rounded-xl transition-colors"
                        >
                          <Eye className="h-5 w-5 text-studio-cloud" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-studio-iron/50 hover:bg-studio-steel rounded-xl transition-colors"
                      >
                        <Download className="h-5 w-5 text-studio-cloud" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
