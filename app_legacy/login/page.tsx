"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // Stub auth flow: route to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="hidden lg:flex flex-col justify-between rounded-2xl border border-border/70 bg-card/70 p-8 shadow-soft">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-4 w-4" /> GRAVIXAI
            </div>
            <h1 className="text-3xl font-bold leading-tight">Log in to your monochrome workspace.</h1>
            <p className="text-muted-foreground">One surface for links, processing, and Instagram connection.</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Keep your IG token healthy via Connect Instagram.</p>
            <p>• Paste YouTube links and watch reels process live.</p>
            <p>• Dark, disciplined UI across every page.</p>
          </div>
        </div>

        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              No account? <Link href="/signup" className="underline">Create one</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
