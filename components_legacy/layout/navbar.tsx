"use client";

import React from "react";
import Link from "next/link";
import { useUIStore } from "@/lib/store";
import { Menu, Sparkles } from "lucide-react";

export function Navbar() {
  const { toggleSidebar } = useUIStore();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-studio-neon-cyan/30 bg-studio-black/90 backdrop-blur-xl shadow-studio-glow-cyan">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full border border-studio-neon-cyan/40 bg-studio-slate/70 text-studio-paper hover:bg-studio-slate hover:border-studio-neon-cyan transition shadow-studio-glow-cyan"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-studio-neon-cyan/50 bg-gradient-to-br from-studio-neon-cyan to-studio-neon-magenta shadow-studio-glow-cyan" />
            <div className="hidden sm:flex flex-col leading-tight text-studio-paper">
              <span className="font-semibold text-sm tracking-tight text-studio-neon-cyan">YouTube → Reels Forge</span>
              <span className="text-[11px] text-studio-neon-magenta/80">Neural Command Center</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-sm text-studio-paper">
          <Link
            href="/connect-instagram"
            className="inline-flex items-center gap-2 rounded-full border border-studio-neon-magenta/40 bg-studio-slate/70 px-3 py-2 hover:border-studio-neon-magenta hover:bg-studio-slate transition shadow-studio-glow-magenta"
          >
            <Sparkles className="h-4 w-4" />
            Connect
          </Link>
          <Link
            href="/add-video"
            className="inline-flex items-center gap-2 rounded-full bg-studio-neon-cyan px-3 py-2 text-studio-black font-semibold shadow-studio-glow-cyan hover:shadow-studio-glow-cyan hover:-translate-y-0.5 transition"
          >
            Add Video
          </Link>
        </div>
      </div>
    </nav>
  );
}
