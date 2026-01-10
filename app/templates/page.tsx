"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import { Sparkles, Zap, Heart, TrendingUp, Film, Music } from "lucide-react";

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: any;
    settings: {
        transitions?: string;
        effects?: string[];
        music?: boolean;
        textStyle?: string;
    };
}

const templates: Template[] = [
    {
        id: "viral-hook",
        name: "Viral Hook",
        description: "Attention-grabbing opening with dynamic text animations",
        category: "Engagement",
        icon: Zap,
        settings: {
            transitions: "quick-cuts",
            effects: ["zoom", "glitch"],
            textStyle: "bold-animated"
        }
    },
    {
        id: "storytelling",
        name: "Storytelling",
        description: "Smooth transitions for narrative-driven content",
        category: "Narrative",
        icon: Film,
        settings: {
            transitions: "smooth-fade",
            effects: ["ken-burns"],
            music: true,
            textStyle: "elegant"
        }
    },
    {
        id: "trending-music",
        name: "Trending Music",
        description: "Sync cuts with popular music beats",
        category: "Music",
        icon: Music,
        settings: {
            transitions: "beat-synced",
            effects: ["rhythm-zoom"],
            music: true,
            textStyle: "bouncy"
        }
    },
    {
        id: "educational",
        name: "Educational",
        description: "Clear captions and step-by-step breakdowns",
        category: "Education",
        icon: TrendingUp,
        settings: {
            transitions: "slide",
            effects: ["highlight"],
            textStyle: "clear-readable"
        }
    },
    {
        id: "emotional",
        name: "Emotional",
        description: "Cinematic effects for heartfelt moments",
        category: "Lifestyle",
        icon: Heart,
        settings: {
            transitions: "cinematic-fade",
            effects: ["vignette", "color-grade"],
            music: true,
            textStyle: "serif"
        }
    },
    {
        id: "ai-powered",
        name: "AI Auto-Select",
        description: "Let AI choose the best template based on content",
        category: "AI",
        icon: Sparkles,
        settings: {
            transitions: "auto",
            effects: ["auto-detect"],
            textStyle: "auto"
        }
    }
];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];

    const filteredTemplates = selectedCategory === "all"
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Template Library</h1>
                    <p className="text-zinc-500 mt-2 font-light">
                        Professional templates to enhance your reels
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="capitalize whitespace-nowrap"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </FadeIn>

            <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === template.id;

                    return (
                        <FadeInItem key={template.id}>
                            <Card
                                className={`h-full cursor-pointer transition-all ${isSelected ? "ring-2 ring-white" : ""
                                    }`}
                                onClick={() => setSelectedTemplate(template.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {template.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <CardDescription className="text-sm">
                                        {template.description}
                                    </CardDescription>

                                    <div className="space-y-2">
                                        <p className="text-xs text-zinc-500 font-medium">Features:</p>
                                        <ul className="space-y-1">
                                            {template.settings.transitions && (
                                                <li className="text-xs text-zinc-400 flex items-center gap-2">
                                                    <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                                    Transitions: {template.settings.transitions}
                                                </li>
                                            )}
                                            {template.settings.effects && (
                                                <li className="text-xs text-zinc-400 flex items-center gap-2">
                                                    <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                                    Effects: {template.settings.effects.join(", ")}
                                                </li>
                                            )}
                                            {template.settings.music && (
                                                <li className="text-xs text-zinc-400 flex items-center gap-2">
                                                    <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                                    Music sync enabled
                                                </li>
                                            )}
                                            {template.settings.textStyle && (
                                                <li className="text-xs text-zinc-400 flex items-center gap-2">
                                                    <div className="h-1 w-1 bg-zinc-500 rounded-full" />
                                                    Text: {template.settings.textStyle}
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <Button
                                        className="w-full"
                                        variant={isSelected ? "default" : "outline"}
                                        size="sm"
                                    >
                                        {isSelected ? "Selected" : "Use Template"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </FadeInItem>
                    );
                })}
            </FadeInStagger>

            {selectedTemplate && (
                <FadeIn delay={0.2}>
                    <Card className="bg-white/5 border-white/5">
                        <CardHeader>
                            <CardTitle className="text-base">Apply Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-400 mb-4">
                                This template will be applied to all new videos you process.
                                You can change this at any time.
                            </p>
                            <div className="flex gap-3">
                                <Button onClick={() => {
                                    // Save template preference
                                    localStorage.setItem('selectedTemplate', selectedTemplate);
                                }}>
                                    Save as Default
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>
            )}
        </div>
    );
}
