"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <FadeIn>
        <h1 className="text-5xl md:text-7xl font-thin tracking-tight text-white mb-6">
          Create <span className="text-gray-500">Silence.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto font-light leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          The automated studio for creators who value craftsmanship over noise.
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <Link href="/dashboard">
          <Button size="lg" className="rounded-full px-8 gap-2">
            Enter Studio <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </FadeIn>
    </div>
  );
}
