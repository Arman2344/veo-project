"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

const DEMO_TEMPLATES = [
  {
    id: 1,
    title: "Viral Hook Opener",
    category: "tiktok",
    platform: "TikTok",
    price: 12,
    rating: 4.9,
    downloads: 2840,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/20",
    badge: "tiktok" as const,
    tags: ["Hook", "Viral", "Trending"],
  },
  {
    id: 2,
    title: "Luxury Brand Reveal",
    category: "instagram",
    platform: "Instagram",
    price: 15,
    rating: 4.8,
    downloads: 1920,
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
    badge: "instagram" as const,
    tags: ["Luxury", "Brand", "Cinematic"],
  },
  {
    id: 3,
    title: "Retention Booster Short",
    category: "youtube",
    platform: "YouTube",
    price: 14,
    rating: 4.9,
    downloads: 3100,
    gradient: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/20",
    badge: "youtube" as const,
    tags: ["Retention", "Shorts", "Hook"],
  },
  {
    id: 4,
    title: "Thought Leader Post",
    category: "linkedin",
    platform: "LinkedIn",
    price: 11,
    rating: 4.7,
    downloads: 1450,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    badge: "linkedin" as const,
    tags: ["B2B", "Authority", "Growth"],
  },
  {
    id: 5,
    title: "Product Story Arc",
    category: "ugc",
    platform: "UGC",
    price: 19,
    rating: 5.0,
    downloads: 4200,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/20",
    badge: "gold" as const,
    tags: ["UGC", "Product", "Story"],
  },
  {
    id: 6,
    title: "Behind The Scenes Kit",
    category: "tiktok",
    platform: "TikTok",
    price: 13,
    rating: 4.8,
    downloads: 2100,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/20",
    badge: "tiktok" as const,
    tags: ["BTS", "Authentic", "Relatable"],
  },
];

const CATEGORY_FILTERS = [
  { id: "all", label: "All Templates" },
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "ugc", label: "UGC" },
];

export default function TemplateShowcase() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? DEMO_TEMPLATES
      : DEMO_TEMPLATES.filter((t) => t.category === activeFilter);

  return (
    <section className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-3">
                <Star className="w-3.5 h-3.5 fill-current" />
                Top Templates
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                Templates that{" "}
                <span className="text-gradient">go viral</span>
              </h2>
            </motion.div>
          </div>
          <Link href="/templates">
            <Button variant="outline" className="gap-2 shrink-0">
              View All Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-brand-500 text-white shadow-neon"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-brand-500/30"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border bg-card overflow-hidden cursor-pointer border-border hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-300"
              >
                {/* Template Preview Area */}
                <div
                  className={`relative h-48 bg-gradient-to-br ${template.gradient} flex items-center justify-center overflow-hidden`}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-32 h-56 rounded-2xl border-2 ${template.border} bg-white/5 flex flex-col items-center justify-center gap-2 p-3`}>
                      <div className="w-full h-2 rounded-full bg-white/20" />
                      <div className="w-3/4 h-2 rounded-full bg-white/15" />
                      <div className="w-full h-14 rounded-xl bg-white/10 mt-2" />
                      <div className="w-full h-2 rounded-full bg-white/15 mt-2" />
                      <div className="w-2/3 h-2 rounded-full bg-white/10" />
                    </div>
                  </div>

                  {/* Platform badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={template.badge}>{template.platform}</Badge>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button size="sm" variant="glass" className="gap-1.5 text-white">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button size="sm" variant="gradient" className="gap-1.5">
                      <ShoppingCart className="w-4 h-4" />
                      Buy
                    </Button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{template.title}</h3>
                    <span className="font-bold text-brand-400">${template.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{template.rating}</span>
                    </div>
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
