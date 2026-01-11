"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ConnectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (code) {
            handleCallback(code);
        } else if (errorParam) {
            setStatus("error");
            setMessage("Instagram connection was denied or failed.");
        }
    }, [code, errorParam]);

    const handleCallback = async (authCode: string) => {
        setStatus("loading");
        setMessage("Connecting to Instagram...");

        try {
            // Allow for local dev or prod URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

            const res = await fetch(`${apiUrl}/api/instagram/auth/callback?code=${authCode}`, {
                method: "POST",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to exchange token");
            }

            setStatus("success");
            setMessage("Instagram connected successfully!");

            // Redirect to dashboard after delay
            setTimeout(() => {
                router.push("/");
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setMessage(err.message || "Connection failed");
        }
    };

    const handleConnect = async () => {
        setStatus("loading");
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/instagram/auth/url`);
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Failed to initialize connection.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full border border-zinc-800 p-8 rounded-lg bg-zinc-900/50">
                <h1 className="text-2xl font-bold mb-2">Connect Instagram</h1>
                <p className="text-zinc-400 mb-8 text-sm">
                    Link your Instagram Business account to start automating Reels.
                </p>

                {status === "loading" && (
                    <div className="py-8 text-center bg-zinc-900 border border-zinc-800 rounded animate-pulse">
                        <span className="text-sm text-zinc-300">{message || "Processing..."}</span>
                    </div>
                )}

                {status === "error" && (
                    <div className="p-4 mb-4 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm">
                        ❌ {message}
                        <br />
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-2 text-xs underline hover:text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {status === "success" && (
                    <div className="p-4 mb-4 bg-green-900/20 border border-green-900/50 rounded text-green-200 text-sm">
                        ✅ {message}
                    </div>
                )}

                {status === "idle" && (
                    <button
                        onClick={handleConnect}
                        className="w-full py-3 px-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Connect via Facebook</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ConnectPage() {
    return (
        <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
            <ConnectContent />
        </Suspense>
    );
}
