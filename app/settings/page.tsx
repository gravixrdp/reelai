"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Instagram, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useInstagram } from "@/components/hooks/use-instagram";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";

export default function SettingsPage() {
    const { account, isLoading, error, connectAccount, verifyAccount, disconnectAccount } = useInstagram();
    const [username, setUsername] = useState("gravi_xshow");
    const [token, setToken] = useState("EAAZAzZCTeGSbsBQboYINAfJIRnPROIIFLWllIYzwPRgGO4QFu3RTxWqqKDZBJymwUZBriTg8PYI7sp5EttBZBDqd4DkELClYsPNvljnYJwvgPrMS7H1mVF4xD5ZCSG3sr1Nm68QZAwIV3senTFduMZB7JQnt0ViZAZBV290wVnQZCysJp0xAPrr0hCamdShR1ZC6jAZDZD");
    const [igUserId, setIgUserId] = useState("");

    const handleConnect = () => {
        if (!username) return;
        connectAccount(username, token);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "connected": return "default";
            case "verification_failed": return "destructive";
            case "pending_verification": return "secondary";
            default: return "outline";
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Settings</h1>
                    <p className="text-zinc-500 mt-2 font-light">Manage connections and preferences.</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-8">
                <section>
                    <h2 className="text-lg font-light text-white mb-6">Connections</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/10 border border-red-900/20 text-red-400 rounded-md flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {!account ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Connect Instagram</CardTitle>
                                <CardDescription>Enter your details to enable auto-publishing.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-zinc-300">Instagram Username</label>
                                    <Input
                                        placeholder="@username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-zinc-300">Instagram User ID</label>
                                    <Input
                                        placeholder="17841400000000000"
                                        value={igUserId}
                                        onChange={(e) => setIgUserId(e.target.value)}
                                        className="font-mono"
                                    />
                                    <p className="text-xs text-zinc-500">Your Instagram Business Account ID (numeric)</p>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-zinc-300">Access Token (Graph API)</label>
                                    <Input
                                        type="password"
                                        placeholder="EAA..."
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                                <Button onClick={handleConnect} disabled={isLoading || !username}>
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Connect Account
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/5 rounded-full border border-white/5">
                                            <Instagram className="w-5 h-5 text-zinc-100" />
                                        </div>
                                        <div>
                                            <CardTitle className="mb-1">@{account.username}</CardTitle>
                                            <CardDescription>
                                                Status: <span className="capitalize">{account.status.replace("_", " ")}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusColor(account.status) as any}>
                                        {account.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="text-sm text-zinc-400 p-4 bg-white/5 rounded-lg border border-white/5">
                                        {account.status === "connected" ? (
                                            <div className="flex items-center text-green-400 gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Verified and ready to publish.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-zinc-300">Account is not fully verified yet.</p>
                                                {account.last_error && (
                                                    <p className="text-red-400 text-xs font-mono bg-red-900/20 p-2 rounded border border-red-900/30">
                                                        Last Error: {account.last_error}
                                                    </p>
                                                )}
                                                <p className="text-xs text-zinc-500">Attempts: {account.verification_attempts}/3</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        {account.status !== "connected" && (
                                            <Button
                                                onClick={() => verifyAccount(account.id, igUserId, token)}
                                                disabled={isLoading || !igUserId || !token}
                                                variant="default"
                                            >
                                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Test Connection & Verify
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() => disconnectAccount(account.id)}
                                            disabled={isLoading}
                                            className="text-red-400 border-red-900/30 hover:bg-red-900/10 hover:border-red-900/50"
                                        >
                                            Disconnect
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </section>

                <section>
                    <h2 className="text-lg font-light text-white mb-6">Preferences</h2>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">Notifications</p>
                                    <p className="text-sm text-zinc-500">Receive email alerts when jobs complete.</p>
                                </div>
                                <Button variant="outline">Manage</Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </FadeIn>
        </div>
    );
}
