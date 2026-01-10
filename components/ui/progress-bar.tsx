"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number;
    label?: string;
    showPercentage?: boolean;
}

export function ProgressBar({ progress, label, showPercentage = true }: ProgressBarProps) {
    return (
        <div className="w-full space-y-2">
            {label && (
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{label}</span>
                    {showPercentage && <span className="text-zinc-300">{Math.round(progress)}%</span>}
                </div>
            )}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-white to-zinc-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
