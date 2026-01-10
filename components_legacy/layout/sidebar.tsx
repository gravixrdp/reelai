"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store";
import {
  LayoutDashboard,
  Plus,
  Video,
  Cog,
  Instagram,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Add Video",
    icon: Plus,
    href: "/add-video",
  },
  {
    label: "My Videos",
    icon: Video,
    href: "/videos",
  },
  {
    label: "Connect Instagram",
    icon: Instagram,
    href: "/connect-instagram",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 border-r border-studio-neon-green/30 bg-studio-black/90 backdrop-blur-xl transition-all duration-300 shadow-studio-glow-green lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Close button on mobile */}
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 border",
                    isActive
                      ? "border-studio-neon-cyan/30 bg-studio-slate/70 text-studio-paper shadow-studio-glow-cyan"
                      : "border-transparent text-studio-fog hover:border-studio-neon-green/30 hover:bg-studio-slate/50 hover:text-studio-paper"
                  )}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-studio-neon-cyan shadow-studio-glow-cyan" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
