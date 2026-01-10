"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">Studio Dashboard</h1>
                        <p className="text-zinc-500 mt-2 font-light">Overview of your creative output.</p>
                    </div>
                    <Link href="/add-video">
                        <Button className="rounded-full px-6 bg-white text-black hover:bg-zinc-200 border-none">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Project
                        </Button>
                    </Link>
                </div>
            </FadeIn>

            <FadeInStagger className="grid gap-6 md:grid-cols-3">
                <FadeInItem>
                    <Card className="h-full min-h-[160px] flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-zinc-400">Total Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-light text-white">0 <span className="text-base text-zinc-600 ml-1">Reels</span></div>
                        </CardContent>
                    </Card>
                </FadeInItem>
                <FadeInItem>
                    <Card className="h-full min-h-[160px] flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-zinc-400">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-light text-white">-- <span className="text-base text-zinc-600 ml-1">%</span></div>
                        </CardContent>
                    </Card>
                </FadeInItem>
                <FadeInItem>
                    <Card className="h-full min-h-[160px] flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-zinc-400">Active Pipeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-light text-zinc-500">No active signals</div>
                        </CardContent>
                    </Card>
                </FadeInItem>
            </FadeInStagger>

            <FadeIn delay={0.4}>
                <h2 className="text-lg font-light text-white mb-6">Recent Activity</h2>
                <Card className="min-h-[300px] flex items-center justify-center border-dashed border-white/10 bg-transparent">
                    <div className="text-center">
                        <p className="text-zinc-600 font-light">The timeline is empty.</p>
                        <Button variant="link" className="text-zinc-400 mt-2">
                            Initialize a project to begin
                        </Button>
                    </div>
                </Card>
            </FadeIn>
        </div>
    );
}
