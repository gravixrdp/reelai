"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PlusCircle, Film, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Create", href: "/add-video", icon: PlusCircle },
    { name: "Library", href: "/videos", icon: Film },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    if (pathname === "/" || pathname === "/login") return null;

    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-full flex flex-col items-center py-8 border-r border-white/5 bg-black/40 backdrop-blur-2xl"
        >
            <div className="mb-12">
                <div className="relative w-8 h-8 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 relative z-10">
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group flex items-center justify-center w-full aspect-square"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-x-2 inset-y-2 bg-gradient-to-br from-white/10 to-transparent rounded-xl border border-white/5"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon
                                strokeWidth={1.5}
                                className={cn(
                                    "w-5 h-5 transition-all duration-300 relative z-10",
                                    isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-gray-400 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                )}
                            />
                            {/* Simple tooltip indicator */}
                            <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-xs text-zinc-300 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/5">
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </motion.aside>
    );
}
