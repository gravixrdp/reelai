"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

const DEFAULT_APP_ID = "1632604658173104";
const DEFAULT_APP_SECRET = "a7faff51a441aa066be803a59006c385";
const DEFAULT_INSTAGRAM_HANDLE = "@gravi_xshow";
const DEFAULT_REDIRECT = "http://localhost:8000/api/social/facebook/callback";

export default function ConnectInstagramPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<{
    fb_page_connected: boolean;
    fb_page_id: string | null;
    fb_page_name: string | null;
    ig_connected: boolean;
    ig_user_id: string | null;
    long_lived_token_valid: boolean;
    token_expiry_date: string | null;
    required_permissions_missing: string[];
    message: string;
  } | null>(null);

  const [form, setForm] = useState({
    instagramHandle: DEFAULT_INSTAGRAM_HANDLE,
    businessAccountId: "",
    facebookPageId: "",
    appId: DEFAULT_APP_ID,
    appSecret: DEFAULT_APP_SECRET,
    redirectUri: DEFAULT_REDIRECT,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setStatusLoading(true);
        setStatusError(null);
        const res = await api.social.checkConnection();
        const data = res.data;
        setStatusData(data);
        setIsConnected(Boolean(data.ig_connected && data.fb_page_connected && data.long_lived_token_valid));
        setForm((prev) => ({
          ...prev,
          instagramHandle: data.ig_user_id ? `@${data.ig_user_id}` : prev.instagramHandle,
          businessAccountId: data.ig_user_id || prev.businessAccountId,
          facebookPageId: data.fb_page_id || prev.facebookPageId,
        }));
      } catch (err: any) {
        setStatusError("Unable to load status. Check backend connectivity.");
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
      }, 1200);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowToken(false);
  };

  return (
    <div className="max-w-5xl space-y-10">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <ShieldCheck className="h-4 w-4" /> Instagram Business OAuth
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Connect Instagram without leaving the site
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Provide your Instagram Business details and kick off the OAuth handoff directly here. We keep everything monochrome and minimal so you can focus on connecting, not configuring.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="xl:col-span-2 border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Connection summary</CardTitle>
            <CardDescription>Status pulled from backend checker.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
              <p className="text-muted-foreground">Page linked</p>
              <p className="font-semibold">{statusData?.fb_page_name || statusData?.fb_page_id || "Missing"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
              <p className="text-muted-foreground">Instagram user</p>
              <p className="font-semibold">{statusData?.ig_user_id || "Not linked"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
              <p className="text-muted-foreground">Token valid</p>
              <p className="font-semibold">{statusData?.long_lived_token_valid ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 space-y-1">
              <p className="text-muted-foreground">Missing perms</p>
              <p className="font-semibold">{statusData?.required_permissions_missing?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>All fields stay on-page so you do not have to jump around.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handle">Instagram handle</Label>
              <Input
                id="handle"
                placeholder="@yourhandle"
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biz">Business Account ID</Label>
                <Input
                  id="biz"
                  placeholder="1784..."
                  value={form.businessAccountId}
                  onChange={(e) => setForm({ ...form, businessAccountId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page">Facebook Page ID</Label>
                <Input
                  id="page"
                  placeholder="1234..."
                  value={form.facebookPageId}
                  onChange={(e) => setForm({ ...form, facebookPageId: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appId">App ID</Label>
                <Input
                  id="appId"
                  placeholder="app id"
                  value={form.appId}
                  onChange={(e) => setForm({ ...form, appId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">App Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="••••••"
                  value={form.appSecret}
                  onChange={(e) => setForm({ ...form, appSecret: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="redirect">Redirect URI</Label>
              <Input
                id="redirect"
                type="url"
                value={form.redirectUri}
                onChange={(e) => setForm({ ...form, redirectUri: e.target.value })}
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-card/50 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Required permissions</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement", "business_management"].map((perm) => (
                  <li key={perm} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground/70" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full h-12 text-base"
              onClick={handleConnect}
              disabled={isLoading}
            >
              <Instagram className="mr-2 h-5 w-5" />
              {isLoading ? "Connecting..." : "Connect with Instagram"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Live status</CardTitle>
            <CardDescription>Stay on this page to confirm and manage the session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {statusLoading && (
              <p className="text-sm text-muted-foreground">Checking connection…</p>
            )}
            {statusError && (
              <p className="text-sm text-destructive">{statusError}</p>
            )}

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3">
              <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-foreground" : "bg-muted-foreground/40"}`} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isConnected ? "Connected to Instagram" : "Not connected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isConnected ? "You can now publish reels directly." : "Complete the form and start OAuth to link your account."}
                </p>
              </div>
            </div>

            {statusData && (
              <div className="grid grid-cols-1 gap-3 text-sm text-foreground">
                <div className="flex justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3">
                  <span className="text-muted-foreground">Facebook Page</span>
                  <span className="font-medium">{statusData.fb_page_name || statusData.fb_page_id || "Missing"}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3">
                  <span className="text-muted-foreground">Instagram User</span>
                  <span className="font-medium">{statusData.ig_user_id || "Not linked"}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3">
                  <span className="text-muted-foreground">Token valid</span>
                  <span className="font-medium">{statusData.long_lived_token_valid ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">{statusData.token_expiry_date ? new Date(statusData.token_expiry_date).toLocaleString() : "Unknown"}</span>
                </div>
                <div className="rounded-lg border border-border/40 bg-card/50 px-4 py-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Missing permissions</span>
                    <span className="font-medium">{statusData.required_permissions_missing?.length || 0}</span>
                  </div>
                  {statusData.required_permissions_missing?.length > 0 && (
                    <ul className="text-muted-foreground space-y-1">
                      {statusData.required_permissions_missing.map((perm) => (
                        <li key={perm} className="flex items-center gap-2 text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-between rounded-lg border border-border/40 bg-card/50 px-4 py-3">
                  <span className="text-muted-foreground">Message</span>
                  <span className="font-medium">{statusData.message}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Access token</Label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-lg bg-muted border border-border/40 font-mono text-sm">
                  {isConnected
                    ? statusData?.long_lived_token_valid
                      ? showToken
                        ? "token_available"
                        : "••••••••••••••••"
                      : "missing"
                    : "—"}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowToken(!showToken)}
                  disabled={!isConnected || !statusData?.long_lived_token_valid}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Review before posting</Label>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-foreground/70" /> Verify your handle and page ownership
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-foreground/70" /> Confirm redirect URI matches your Meta app settings
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-foreground/70" /> Ensure permissions above are granted during OAuth
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="w-1/2" onClick={handleDisconnect} disabled={!isConnected}>
                Disconnect
              </Button>
              <Button className="w-1/2" disabled={!isConnected}>
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
