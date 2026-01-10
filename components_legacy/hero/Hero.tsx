"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Futuristic Grid Background */}
      <div className="absolute inset-0 bg-studio-black">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="url(#gridGradient)" strokeWidth="1"/>
              </pattern>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#00ffff', stopOpacity:0.3}} />
                <stop offset="100%" style={{stopColor:'#ff00ff', stopOpacity:0.3}} />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* 3D Ambient Environment */}
      <HeroScene />

      {/* Neon Glowing Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-studio-neon-cyan/10 rounded-full blur-3xl animate-drift-slow shadow-studio-glow-cyan" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-studio-neon-magenta/10 rounded-full blur-3xl animate-drift shadow-studio-glow-magenta" style={{ animationDelay: '-20s' }} />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-studio-neon-green/10 rounded-full blur-3xl animate-float shadow-studio-glow-green" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.h1
              className="text-display-xl md:text-display-xl text-studio-paper text-balance font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ textShadow: '0 0 20px rgba(0,255,255,0.5)' }}
            >
              Reels Forge
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl text-studio-neon-cyan max-w-3xl mx-auto text-balance leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ textShadow: '0 0 10px rgba(0,255,255,0.3)' }}
            >
              Neural Networks. Quantum Processing.
              <br />
              Forge viral reels from YouTube streams.
            </motion.p>
          </div>

          <motion.div
            className="flex items-center justify-center gap-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Link href="/add-video">
              <motion.button
                className="studio-button-primary text-lg px-10 py-5 rounded-2xl shadow-studio-glow-cyan hover:shadow-studio-glow-cyan transition-all duration-500"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,255,0.6)' }}
                whileTap={{ scale: 0.98 }}
              >
                Initialize Forge
              </motion.button>
            </Link>

            <Link href="/dashboard">
              <motion.button
                className="studio-button-secondary text-lg px-10 py-5 rounded-2xl border border-studio-neon-magenta/40 hover:border-studio-neon-magenta hover:shadow-studio-glow-magenta transition-all duration-500"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,0,255,0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                Access Matrix
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
