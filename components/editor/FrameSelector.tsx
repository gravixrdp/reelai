"use client";

import { useState } from "react";
import { FrameType } from "@/types/frames";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FrameSelectorProps {
    selectedFrame: FrameType;
    onChange: (frame: FrameType) => void;
}

const FRAMES = [
    {
        id: 'CENTER_STRIP' as FrameType,
        name: 'Center Strip',
        description: 'Clean, minimal layout with video perfectly centered',
        icon: (
            <div className="w-full h-full bg-black rounded flex items-center justify-center p-2">
                <div className="w-full h-16 bg-zinc-700 rounded"></div>
            </div>
        ),
    },
    {
        id: 'DIVIDER_FRAME' as FrameType,
        name: 'Divider Frame',
        description: 'Professional editorial style with divider lines',
        icon: (
            <div className="w-full h-full bg-zinc-800 rounded flex flex-col items-center justify-center p-2 gap-1">
                <div className="w-full h-0.5 bg-white"></div>
                <div className="w-full h-16 bg-zinc-700 rounded"></div>
                <div className="w-full h-0.5 bg-white"></div>
            </div>
        ),
    },
    {
        id: 'LOWER_ANCHOR' as FrameType,
        name: 'Lower Anchor',
        description: 'Cinematic layout with video anchored lower',
        icon: (
            <div className="w-full h-full bg-black rounded flex flex-col justify-end p-2 pb-6">
                <div className="w-full h-16 bg-zinc-700 rounded"></div>
            </div>
        ),
    },
];

export function FrameSelector({ selectedFrame, onChange }: FrameSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Select Frame</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FRAMES.map((frame) => {
                    const isSelected = selectedFrame === frame.id;

                    return (
                        <motion.button
                            key={frame.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onChange(frame.id)}
                            className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                                    ? 'border-white bg-white/5'
                                    : 'border-white/10 bg-zinc-900/40 hover:border-white/20'
                                }
              `}
                        >
                            {/* Visual Preview */}
                            <div className="aspect-[9/16] mb-3 rounded-lg overflow-hidden border border-white/10">
                                {frame.icon}
                            </div>

                            {/* Frame Info */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-white">{frame.name}</p>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-green-400" />
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {frame.description}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
