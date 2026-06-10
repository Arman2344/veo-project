"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Palette,
  Zap,
  Download,
  Mail,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

const FEATURES = [
  {
    icon: Pencil,
    title: "Fully Editable Templates",
    description:
      "Every template is 100% editable. Change text, colors, fonts, and media to match your brand in seconds.",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    icon: Palette,
    title: "Drag & Drop Customization",
    description:
      "Our intuitive editor makes customization effortless — no design skills required. Just point, click, and create.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Prompt Packs",
    description:
      "Get access to curated AI prompts that generate scroll-stopping captions, hooks, and CTAs for every platform.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Users,
    title: "UGC Creator Kits",
    description:
      "Separate premium UGC section with product storytelling templates that make brands pay you more.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "All templates are designed mobile-first — create, edit, and export directly from your phone.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Zap,
    title: "Instant Digital Delivery",
    description:
      "Purchase and download in under 60 seconds. Your files are unlocked instantly after payment.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Mail,
    title: "Auto Email Delivery",
    description:
      "Files are automatically delivered to your email. Plus get access via your personal dashboard forever.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description:
      "Export your finished content to MP4, MOV, or PDF with one click, optimized for each platform.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Everything You Need
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Built for{" "}
              <span className="text-gradient">serious creators</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Professional tools and templates that give you an unfair advantage
              in the content creator economy.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

              <div
                className={`relative w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="relative font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
