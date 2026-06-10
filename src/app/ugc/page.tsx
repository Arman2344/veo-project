"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  ShoppingCart,
  Eye,
  Check,
  ArrowRight,
  Film,
  Mic,
  Package,
  Target,
  MessageSquare,
  Play,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UGC_FEATURES = [
  {
    icon: Target,
    title: "Hook Templates",
    description: "Scroll-stopping opening hooks that capture attention in the first 2 seconds.",
    count: "24 hooks",
  },
  {
    icon: Film,
    title: "Product Review Scripts",
    description: "Structured review formats that build trust and drive purchases.",
    count: "18 scripts",
  },
  {
    icon: MessageSquare,
    title: "Storytelling Structures",
    description: "Narrative frameworks that create emotional connection with your audience.",
    count: "15 structures",
  },
  {
    icon: Package,
    title: "Cinematic Product Showcase",
    description: "Professional product reveal and showcase sequences for luxury brand feel.",
    count: "20 prompts",
  },
  {
    icon: Mic,
    title: "Voiceover Templates",
    description: "Word-for-word voiceover scripts optimized for conversion.",
    count: "30 scripts",
  },
  {
    icon: Play,
    title: "Call-to-Action Templates",
    description: "High-converting CTAs that drive clicks, follows, and purchases.",
    count: "22 CTAs",
  },
];

const UGC_TEMPLATES = [
  { id: 1, title: "The Problem-Solution Arc", type: "Script Structure", level: "Beginner", price: 19, rating: 5.0, downloads: 4200 },
  { id: 2, title: "Luxury Unboxing Sequence", type: "Product Showcase", level: "Intermediate", price: 24, rating: 4.9, downloads: 3100 },
  { id: 3, title: "Before & After Transform", type: "Story Structure", level: "Beginner", price: 17, rating: 4.8, downloads: 2800 },
  { id: 4, title: "Expert Review Formula", type: "Review Script", level: "Advanced", price: 22, rating: 4.9, downloads: 2450 },
  { id: 5, title: "Day-in-My-Life Product Integration", type: "Lifestyle Story", level: "Intermediate", price: 21, rating: 4.7, downloads: 1980 },
  { id: 6, title: "Viral Challenge Hook", type: "Hook Template", level: "Beginner", price: 15, rating: 4.8, downloads: 3600 },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function UGCPage() {
  const [activeType, setActiveType] = useState("All");

  const types = ["All", ...Array.from(new Set(UGC_TEMPLATES.map((t) => t.type)))];
  const filtered = activeType === "All" ? UGC_TEMPLATES : UGC_TEMPLATES.filter((t) => t.type === activeType);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 cinematic-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Premium UGC Creator Kit
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6">
              Professional UGC Templates
              <br />
              <span className="text-gradient-gold">That Land Brand Deals</span>
            </h1>

            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              The complete UGC creator toolkit with product review scripts, storytelling
              structures, cinematic showcase prompts, and conversion-optimized CTAs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gradient-pink"
                size="xl"
                className="gap-2 min-w-52 from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                <Crown className="w-5 h-5" />
                Get UGC Kit — $49/mo
              </Button>
              <Button variant="glass" size="xl" className="text-white border-white/20 min-w-52 gap-2">
                <Eye className="w-5 h-5" />
                Preview Templates
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
              {["129 total templates", "Monthly new additions", "7-day money back"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* UGC Features Grid */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything in the <span className="text-gradient">UGC Creator Kit</span>
            </h2>
            <p className="text-muted-foreground">
              A complete system for creating professional UGC content that brands pay premium rates for.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {UGC_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-amber-500/30 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <Badge variant="gold">{feature.count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Browser */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">UGC Templates</h2>
              <p className="text-muted-foreground mt-1">Browse and preview before you buy</p>
            </div>
          </div>

          {/* Type filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeType === type
                    ? "bg-amber-500 text-white"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group p-5 rounded-2xl border border-border bg-card hover:border-amber-500/30 hover:shadow-card-hover transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="gold" className="mb-2">{template.type}</Badge>
                    <h3 className="font-semibold text-foreground">{template.title}</h3>
                  </div>
                  <span className="font-bold text-amber-400 text-lg">${template.price}</span>
                </div>

                {/* Preview mockup */}
                <div className="h-28 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-3 flex items-center justify-center">
                  <div className="text-3xl opacity-50">🎬</div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${LEVEL_COLORS[template.level]}`}>
                      {template.level}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-foreground font-medium">{template.rating}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{template.downloads.toLocaleString()} sold</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-card/50 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Start landing <span className="text-gradient-gold">premium brand deals</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Brands pay 3-10x more for UGC creators who produce professional, cinematic content.
            Our kit gives you the templates to do exactly that.
          </p>
          <Link href="/pricing">
            <Button variant="gradient" size="xl" className="gap-2 from-amber-500 to-orange-600">
              Get Creator Pro — Includes UGC Kit
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
