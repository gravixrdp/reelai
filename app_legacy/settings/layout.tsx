"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const settings = [
  {
    label: "Account",
    href: "/settings/account",
    icon: "👤",
  },
  {
    label: "Social Accounts",
    href: "/settings/social-accounts",
    icon: "📱",
  },
  {
    label: "Notifications",
    href: "/settings/notifications",
    icon: "🔔",
  },
  {
    label: "API Keys",
    href: "/settings/api-keys",
    icon: "🔑",
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-4 sticky top-8 h-fit">
              <h2 className="font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-1">
                {settings.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
