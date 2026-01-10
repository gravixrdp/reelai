import type { Metadata } from "next";
import "@/styles/globals.css";
import { RootLayout } from "@/components/layout/root-layout";

export const metadata: Metadata = {
  title: "Reels Forge — Neural YouTube to Instagram Reels Converter",
  description:
    "Neural Networks. Quantum Processing. Transform YouTube videos into viral Instagram Reels with AI precision.",
  keywords: ["Reels Forge", "YouTube", "Instagram", "Reels", "AI", "Neural Networks", "Quantum"],
  authors: [{ name: "Reels Forge" }],
  creator: "Reels Forge",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
