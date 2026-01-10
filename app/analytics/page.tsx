"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import { TrendingUp, Video, Clock, CheckCircle2 } from "lucide-react";

interface AnalyticsData {
    totalVideos: number;
    totalReels: number;
    processingTime: string;
    successRate: number;
    recentActivity: Array<{
        id: string;
        action: string;
        time: string;
        status: "success" | "processing" | "failed";
    }>;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalVideos: 0,
        totalReels: 0,
        processingTime: "0 min",
        successRate: 0,
        recentActivity: [],
    });

    useEffect(() => {
        // Fetch analytics data
        const fetchAnalytics = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/analytics");
                if (response.ok) {
                    const data = await response.json();
                    setAnalytics(data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Analytics</h1>
                    <p className="text-zinc-500 mt-2 font-light">Performance insights and metrics.</p>
                </div>
            </FadeIn>

            <FadeInStagger className="grid gap-6 md:grid-cols-4">
                <FadeInItem>
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Total Videos</CardTitle>
                            <Video className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-light text-white">{analytics.totalVideos}</div>
                            <p className="text-xs text-zinc-500 mt-1">All time</p>
                        </CardContent>
                    </Card>
                </FadeInItem>

                <FadeInItem>
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Reels Created</CardTitle>
                            <TrendingUp className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-light text-white">{analytics.totalReels}</div>
                            <p className="text-xs text-zinc-500 mt-1">Total output</p>
                        </CardContent>
                    </Card>
                </FadeInItem>

                <FadeInItem>
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Avg. Time</CardTitle>
                            <Clock className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-light text-white">{analytics.processingTime}</div>
                            <p className="text-xs text-zinc-500 mt-1">Per video</p>
                        </CardContent>
                    </Card>
                </FadeInItem>

                <FadeInItem>
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">Success Rate</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-light text-white">{analytics.successRate}%</div>
                            <p className="text-xs text-zinc-500 mt-1">Completion rate</p>
                        </CardContent>
                    </Card>
                </FadeInItem>
            </FadeInStagger>

            <FadeIn delay={0.3}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-light text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-zinc-600">
                                No recent activity to display
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {analytics.recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-2 w-2 rounded-full ${activity.status === "success"
                                                        ? "bg-green-500"
                                                        : activity.status === "processing"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                            />
                                            <span className="text-zinc-300">{activity.action}</span>
                                        </div>
                                        <span className="text-zinc-500 text-sm">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    );
}
