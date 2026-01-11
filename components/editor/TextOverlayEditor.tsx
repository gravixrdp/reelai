"use client";

import { useState } from "react";
import { TextOverlay } from "@/types/frames";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Type } from "lucide-react";

interface TextOverlayEditorProps {
    textOverlays: TextOverlay[];
    onChange: (overlays: TextOverlay[]) => void;
}

export function TextOverlayEditor({ textOverlays, onChange }: TextOverlayEditorProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const addTextOverlay = (zone: 'top' | 'bottom') => {
        const newOverlay: TextOverlay = {
            text: '',
            zone,
        };
        onChange([...textOverlays, newOverlay]);
        setEditingIndex(textOverlays.length);
    };

    const updateTextOverlay = (index: number, text: string) => {
        const updated = [...textOverlays];
        updated[index] = { ...updated[index], text };
        onChange(updated);
    };

    const removeTextOverlay = (index: number) => {
        onChange(textOverlays.filter((_, i) => i !== index));
        setEditingIndex(null);
    };

    const topOverlays = textOverlays.filter(o => o.zone === 'top');
    const bottomOverlays = textOverlays.filter(o => o.zone === 'bottom');

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Text Overlays</h3>

            {/* Top Zone */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-400">Top Zone</p>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTextOverlay('top')}
                        className="h-8 text-xs border-white/10 hover:border-white/20"
                        disabled={topOverlays.length >= 1}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Text
                    </Button>
                </div>

                {topOverlays.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-center">
                        <Type className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500">No text in top zone</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {textOverlays.map((overlay, idx) => {
                            if (overlay.zone !== 'top') return null;

                            return (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        placeholder="Enter text for top zone..."
                                        value={overlay.text}
                                        onChange={(e) => updateTextOverlay(idx, e.target.value)}
                                        maxLength={200}
                                        className="flex-1 bg-zinc-900/60 border-white/10 focus:border-white/30"
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeTextOverlay(idx)}
                                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom Zone */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-400">Bottom Zone</p>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTextOverlay('bottom')}
                        className="h-8 text-xs border-white/10 hover:border-white/20"
                        disabled={bottomOverlays.length >= 1}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Text
                    </Button>
                </div>

                {bottomOverlays.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-center">
                        <Type className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                        <p className="text-xs text-zinc-500">No text in bottom zone</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {textOverlays.map((overlay, idx) => {
                            if (overlay.zone !== 'bottom') return null;

                            return (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        placeholder="Enter text for bottom zone..."
                                        value={overlay.text}
                                        onChange={(e) => updateTextOverlay(idx, e.target.value)}
                                        maxLength={200}
                                        className="flex-1 bg-zinc-900/60 border-white/10 focus:border-white/30"
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeTextOverlay(idx)}
                                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300 leading-relaxed">
                    💡 <strong>Auto-sizing:</strong> Text will automatically resize to fit the available space.
                    Keep your text concise for best results.
                </p>
            </div>
        </div>
    );
}
