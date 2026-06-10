"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FLOATING_CARDS = [
  {
    platform: "TikTok",
    views: "2.4M views",
    color: "from-pink-500 to-rose-500",
    icon: "🎵",
    delay: 0,
    position: "top-20 -left-4 sm:left-8",
  },
  {
    platform: "Instagram",
    views: "890K likes",
    color: "from-purple-500 to-pink-500",
    icon: "📸",
    delay: 1.5,
    position: "top-32 -right-4 sm:right-8",
  },
  {
    platform: "YouTube",
    views: "1.2M subs",
    color: "from-red-500 to-orange-500",
    icon: "▶️",
    delay: 0.8,
    position: "bottom-32 -left-4 sm:left-16",
  },
];

const STATS = [
  { value: "50K+", label: "Creators" },
  { value: "500+", label: "Templates" },
  { value: "4.9★", label: "Rating" },
  { value: "10M+", label: "Views Generated" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden cinematic-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-pink-600/10 blur-3xl"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm font-medium text-foreground">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-gradient">New: AI Prompt Packs Now Available</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            Create Viral Content{" "}
            <br />
            <span className="text-gradient">Faster With AI</span>
            <br />
            Templates
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Editable cinematic templates for TikTok, Instagram, YouTube, LinkedIn,
            and UGC creators. Fully customizable, instant delivery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/templates">
              <Button variant="gradient" size="xl" className="group gap-2 min-w-48">
                Browse Templates
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/editor">
              <Button
                variant="glass"
                size="xl"
                className="gap-2 min-w-48 text-white border-white/20 hover:border-white/40"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Creating
              </Button>
            </Link>
          </motion.div>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-16"
          >
            {[
              { label: "TikTok", icon: "🎵", color: "tiktok" },
              { label: "Instagram", icon: "📸", color: "instagram" },
              { label: "YouTube", icon: "▶️", color: "youtube" },
              { label: "LinkedIn", icon: "💼", color: "linkedin" },
              { label: "UGC", icon: "🎬", color: "gold" },
            ].map(({ label, icon, color }) => (
              <Badge
                key={label}
                variant={color as "tiktok" | "instagram" | "youtube" | "linkedin" | "gold"}
                className="px-3 py-1.5 text-sm gap-1.5"
              >
                <span>{icon}</span>
                {label}
              </Badge>
            ))}
          </motion.div>
        </div>

        {/* Floating Cards - Desktop */}
        <div className="relative hidden lg:block">
          {FLOATING_CARDS.map((card) => (
            <motion.div
              key={card.platform}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + card.delay }}
              className={`absolute ${card.position}`}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay,
                }}
                className="glass rounded-2xl p-4 flex items-center gap-3 min-w-44 border border-white/10 shadow-luxury"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg flex-shrink-0`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-white/50 font-medium">{card.platform}</p>
                  <p className="text-sm text-white font-bold">{card.views}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-8"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gradient">{value}</p>
              <p className="text-sm text-white/50 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-xs text-white font-bold"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-white/60">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>
              <strong className="text-white">50,000+</strong> creators trust ViralKit
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
