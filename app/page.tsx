"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Play } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/ui/motion";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/ui/hero-3d"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Navbar with Glassmorphism */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-white/[0.05] bg-black/50 backdrop-blur-xl fixed top-0 z-50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <span className="font-semibold tracking-tight text-lg">Gravix</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-6">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-medium shadow-[0_0_20px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.6)] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with 3D Background */}
      <section className="relative pt-44 pb-32 px-6 flex items-center justify-center min-h-[90vh] overflow-hidden">
        {/* R3F 3D Background */}
        <Hero3D />

        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeIn>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-sm text-zinc-300 mb-10 cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-medium bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">v1.0 Public Beta</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
              Create Silence.<br />
              <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">Automate Clarity.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The premium automated studio for creators who need scale without noise.
              Turn long-form content into pristine, vertical Reels instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login">
                <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
                  Start Creating <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-white/10 bg-white/[0.02] text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all">
                  How it works
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Feature Cards - 3D Tilt Effect */}
      <section className="py-32 border-t border-white/5 relative z-10 bg-zinc-950/50 backdrop-blur-3xl">
        <FadeInStagger className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Official API", desc: "Verified Instagram Partner integration. Secure, compliant, and ban-safe.", color: "text-green-400" },
            { icon: Zap, title: "Auto-Processing", desc: "Intelligent 9:16 cropping and smart splitting. No manual editing required.", color: "text-amber-400" },
            { icon: CheckCircle2, title: "Draft & Forget", desc: "Upload a link, we handle the rest. Review drafts before they go live.", color: "text-cyan-400" }
          ].map((item, i) => (
            <FadeInItem key={i}>
              <motion.div
                whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden h-full"
              >
                <div className={`absolute inset-0 bg-${item.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`} />
                <div className="relative z-10 flex flex-col items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-3 text-white group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed font-light group-hover:text-zinc-400 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* How it Works - Glassmorphism */}
      <section id="how-it-works" className="py-40 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-24 text-center tracking-tight">
              Workflow <span className="text-zinc-600">Simplified</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect", desc: "Link your Instagram Business account via official OAuth.", delay: 0 },
              { step: "02", title: "Upload", desc: "Paste any YouTube link. We extract high-quality video & audio.", delay: 0.1 },
              { step: "03", title: "Scale", desc: "We generate optimized chunks ready for Reels. You click publish.", delay: 0.2 }
            ].map((item, i) => (
              <FadeIn key={i} delay={item.delay}>
                <div className="group p-10 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:from-white/[0.08] hover:to-white/[0.02] transition-all duration-500 relative overflow-hidden min-h-[300px] flex flex-col justify-end">
                  <div className="absolute top-6 right-8 font-bold text-8xl text-white/[0.03] group-hover:text-white/[0.06] transition-colors select-none">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-medium mb-4 relative z-10 text-white">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed relative z-10 text-lg font-light group-hover:text-zinc-300 transition-colors">{item.desc}</p>

                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-white/5 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-600">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity text-white">
            <div className="w-4 h-4 rounded-full border border-white/30" />
            <span>Gravix Inc.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
