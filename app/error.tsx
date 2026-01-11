"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-light tracking-tight">Something went wrong</h2>
                    <p className="text-zinc-500 text-lg font-light leading-relaxed">
                        We encountered an unexpected error. Our team has been notified.
                    </p>
                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-4 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-left overflow-auto max-h-48">
                            <code className="text-xs text-red-200 font-mono">
                                {error.message}
                            </code>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        className="rounded-full px-8 bg-white text-black hover:bg-zinc-200 transition-all font-medium flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </Button>
                    <Button
                        onClick={() => window.location.href = "/"}
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Go Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
