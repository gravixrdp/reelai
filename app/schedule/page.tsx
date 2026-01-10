"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import { useToast } from "@/components/hooks/use-toast";
import { Calendar, Clock, Instagram, Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface ScheduledPost {
    id: string;
    reelId: string;
    reelTitle: string;
    scheduledTime: string;
    status: "pending" | "published" | "failed";
}

export default function SchedulePage() {
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const { toast } = useToast();

    function addScheduledPost() {
        if (!selectedDate || !selectedTime) {
            toast({
                title: "Error",
                description: "Please select both date and time",
            });
            return;
        }

        const newPost: ScheduledPost = {
            id: `post-${Date.now()}`,
            reelId: "sample-reel",
            reelTitle: "Sample Reel",
            scheduledTime: `${selectedDate}T${selectedTime}`,
            status: "pending"
        };

        setScheduledPosts([...scheduledPosts, newPost]);
        setSelectedDate("");
        setSelectedTime("");

        toast({
            title: "Success",
            description: "Post scheduled successfully",
        });
    }

    function removeScheduledPost(id: string) {
        setScheduledPosts(scheduledPosts.filter(p => p.id !== id));
        toast({
            title: "Removed",
            description: "Scheduled post removed",
        });
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Schedule Posts</h1>
                    <p className="text-zinc-500 mt-2 font-light">
                        Plan and schedule your Instagram reels in advance
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Schedule New Post
                        </CardTitle>
                        <CardDescription>
                            Select date and time to automatically publish your reel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Date</label>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Time</label>
                                    <Input
                                        type="time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button onClick={addScheduledPost} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
                <div>
                    <h2 className="text-lg font-light text-white mb-4">Scheduled Posts</h2>
                    {scheduledPosts.length === 0 ? (
                        <Card className="min-h-[200px] flex items-center justify-center border-dashed border-white/10 bg-transparent">
                            <div className="text-center">
                                <Clock className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                <p className="text-zinc-600 font-light">
                                    No scheduled posts yet
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {scheduledPosts.map((post) => (
                                <Card key={post.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                    <Instagram className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {post.reelTitle}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">
                                                        {new Date(post.scheduledTime).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={
                                                    post.status === "published" ? "default" :
                                                        post.status === "pending" ? "secondary" : "destructive"
                                                }>
                                                    {post.status === "published" && (
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    )}
                                                    {post.status === "pending" && (
                                                        <Clock className="h-3 w-3 mr-1" />
                                                    )}
                                                    {post.status}
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeScheduledPost(post.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </FadeIn>

            <FadeIn delay={0.4}>
                <Card className="bg-white/5 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-base">Best Times to Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-zinc-400 mb-1">Weekdays</p>
                                <p className="text-white font-medium">11 AM - 1 PM</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-zinc-400 mb-1">Weekends</p>
                                <p className="text-white font-medium">9 AM - 11 AM</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-zinc-400 mb-1">Evenings</p>
                                <p className="text-white font-medium">7 PM - 9 PM</p>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-3">
                            Based on Instagram engagement patterns
                        </p>
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    );
}
