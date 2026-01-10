"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Panel } from "@/components/dashboard/Panel";
import { Play, Plus, Video, Clock, Zap } from "lucide-react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalReels: 0,
    processingTime: "—",
    conversionRate: "—",
  });
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosResp, reelsResp] = await Promise.all([
          api.video.list(),
          api.reels.list({ limit: 50 }),
        ]);

        const videos = videosResp.data || [];
        const reels = reelsResp.data || [];

        setRecentVideos(videos.slice(0, 4));
        setStats({
          totalVideos: videos.length,
          totalReels: reels.length,
          processingTime: "2m 18s",
          conversionRate: "94",
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Neural Grid Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="neural-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#neuralGradient)" strokeWidth="1"/>
              </pattern>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00ffff', stopOpacity:0.4}} />
                <stop offset="100%" style={{stopColor:'#ff00ff', stopOpacity:0.4}} />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-studio-neon-cyan/5 rounded-full blur-3xl animate-drift-slow shadow-studio-glow-cyan" />
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-studio-neon-magenta/5 rounded-full blur-3xl animate-float shadow-studio-glow-magenta" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4"
        >
          <h1 className="text-display-lg text-studio-paper font-light" style={{ textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>
            Neural Command Center
          </h1>
          <p className="text-xl text-studio-neon-cyan max-w-2xl mx-auto" style={{ textShadow: '0 0 10px rgba(0,255,255,0.3)' }}>
            Quantum processing hub. Forge viral narratives from raw data streams.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { label: "Videos Processed", value: stats.totalVideos, icon: Video },
            { label: "Reels Created", value: stats.totalReels, icon: Play },
            { label: "Avg Processing", value: stats.processingTime, icon: Clock },
            { label: "Quality Score", value: `${stats.conversionRate}%`, icon: Zap },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="studio-panel text-center p-6">
                <Icon className="h-8 w-8 text-studio-neon-cyan mx-auto mb-4 opacity-80 shadow-studio-glow-cyan" />
                <p className="studio-text-label mb-2">{stat.label}</p>
                <p className="text-3xl font-light text-studio-paper">{stat.value}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Main Studio Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pipeline Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <Panel title="Active Pipeline" subtitle="Current processing queue">
              <div className="space-y-6">
                {recentVideos.slice(0, 3).map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.6 }}
                    className="flex items-center justify-between p-4 bg-studio-slate/20 rounded-2xl border border-white/5"
                  >
                    <div className="space-y-1">
                      <p className="text-studio-paper font-medium">{video.title || "Untitled Project"}</p>
                      <p className="studio-text-label">Processing • {video.progress || 68}% complete</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1 bg-studio-iron rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-studio-neon-cyan to-studio-neon-green transition-all duration-1000 rounded-full shadow-studio-glow-cyan"
                          style={{ width: `${video.progress || 68}%` }}
                        />
                      </div>
                      <div className="px-3 py-1 bg-studio-neon-cyan/20 text-studio-neon-cyan text-xs rounded-full font-medium shadow-studio-glow-cyan">
                        Active
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Panel>

            <Panel title="Recent Creations" subtitle="Latest reels ready for publishing">
              <div className="space-y-4">
                {["Summer Campaign Teaser", "Behind the Scenes", "Product Launch"].map((reel, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + 0.1 * i, duration: 0.5 }}
                    className="flex items-center justify-between p-4 bg-studio-coal/30 rounded-xl border border-white/5 hover:border-studio-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-studio-neon-green/20 rounded-lg flex items-center justify-center shadow-studio-glow-green">
                        <Play className="h-5 w-5 text-studio-neon-green" />
                      </div>
                      <div>
                        <p className="text-studio-paper font-medium">{reel}</p>
                        <p className="studio-text-label">Ready to publish</p>
                      </div>
                    </div>
                    <Link href="/videos">
                      <button className="studio-button-secondary text-sm px-4 py-2">
                        View
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Studio Controls */}
          <div className="space-y-8">
            <Panel title="Studio Actions" subtitle="Create and manage">
              <div className="space-y-4">
                <Link href="/add-video">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full studio-button-primary py-4 rounded-xl text-lg"
                  >
                    <Plus className="h-5 w-5 mr-2 inline" />
                    Add New Video
                  </motion.button>
                </Link>

                <Link href="/connect-instagram">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full studio-button-secondary py-4 rounded-xl text-lg"
                  >
                    <Play className="h-5 w-5 mr-2 inline" />
                    Connect Instagram
                  </motion.button>
                </Link>
              </div>
            </Panel>

            <Panel title="System Status" subtitle="Live monitoring">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="studio-text-label">Instagram Link</span>
                  <span className="text-studio-neon-green font-medium shadow-studio-glow-green">Live</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="studio-text-label">Active Jobs</span>
                  <span className="text-studio-paper font-medium">2</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="studio-text-label">Queue Status</span>
                  <span className="text-studio-neon-yellow font-medium shadow-studio-glow-gold">Stable</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
