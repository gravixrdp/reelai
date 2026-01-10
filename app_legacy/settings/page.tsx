"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/store";
import { Bell, Shield, Lock, Eye, Mail, Sparkles, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({
    email: true,
    processing: true,
    upload: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    alerts: true,
  });

  const handleSaveProfile = () => {
    // Mock update
    if (user) {
      setUser({ ...user, name, email });
    }
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Monochrome settings
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything about your workspace.</h1>
        <p className="text-muted-foreground max-w-2xl">Profile, notifications, and guardrails—kept minimal and in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your name and email. Stays local for now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full border border-border/70 bg-card/70 flex items-center justify-center text-lg font-semibold">
                  {name?.charAt(0).toUpperCase() || "G"}
                </div>
                <Button variant="outline">Upload</Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveProfile}>Save profile</Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/70 shadow-soft">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Locked to monochrome; pick density and theme.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground flex items-start gap-3">
              <SlidersHorizontal className="h-4 w-4 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Density</p>
                <p>Keep controls compact; monochrome UI stays consistent across pages.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button>Save appearance</Button>
              <Button variant="outline">Revert</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/70 bg-card/70 shadow-soft">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Processing, email, and upload reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              id: "email",
              icon: Mail,
              title: "Email notifications",
              description: "Receive email updates about your account.",
            },
            {
              id: "processing",
              icon: Bell,
              title: "Processing updates",
              description: "Get notified when videos finish processing.",
            },
            {
              id: "upload",
              icon: Bell,
              title: "Upload reminders",
              description: "Prompts to add new YouTube links when idle.",
            },
          ].map((notif) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                <div className="flex gap-3 items-start">
                  <Icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[notif.id as keyof typeof notifications]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [notif.id]: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-border accent-foreground"
                />
              </div>
            );
          })}

          <div className="flex gap-3">
            <Button>Save preferences</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/70 shadow-soft">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Credentials and safeguards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5" />
              <div>
                <p className="font-medium">Two-factor</p>
                <p className="text-sm text-muted-foreground">Add a second factor for logins.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={security.twoFactor}
              onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-border accent-foreground"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div>
                <p className="font-medium">Login alerts</p>
                <p className="text-sm text-muted-foreground">Notify on new device sign-ins.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={security.alerts}
              onChange={(e) => setSecurity({ ...security, alerts: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-border accent-foreground"
            />
          </div>
          <div className="flex gap-3">
            <Button>Save security</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/70 bg-card/70 shadow-soft">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Export or remove your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            Download your data
          </Button>
          <Button variant="destructive" className="w-full">
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
