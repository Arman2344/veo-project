"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

const CATEGORY_TEMPLATES: Record<string, Array<{
  id: number; title: string; price: number; rating: number; downloads: number; tags: string[];
}>> = {
  tiktok: [
    { id: 1, title: "Viral Hook Opener", price: 12, rating: 4.9, downloads: 2840, tags: ["Hook", "Viral", "Trending"] },
    { id: 2, title: "Behind The Scenes Kit", price: 13, rating: 4.8, downloads: 2100, tags: ["BTS", "Authentic"] },
    { id: 3, title: "Trending Sound Hook", price: 10, rating: 4.7, downloads: 3800, tags: ["Trending", "Sound"] },
    { id: 4, title: "Day in My Life Template", price: 11, rating: 4.8, downloads: 1900, tags: ["Lifestyle", "Relatable"] },
    { id: 5, title: "POV Storytelling Arc", price: 14, rating: 4.9, downloads: 2200, tags: ["POV", "Story"] },
    { id: 6, title: "Transformation Reveal", price: 15, rating: 5.0, downloads: 3400, tags: ["Before/After", "Viral"] },
  ],
  instagram: [
    { id: 1, title: "Luxury Brand Reveal", price: 15, rating: 4.8, downloads: 1920, tags: ["Luxury", "Brand"] },
    { id: 2, title: "Carousel Swipe Story", price: 16, rating: 4.9, downloads: 2450, tags: ["Carousel", "Story"] },
    { id: 3, title: "Lifestyle Aesthetic Reel", price: 14, rating: 4.8, downloads: 2100, tags: ["Lifestyle", "Aesthetic"] },
    { id: 4, title: "Product Showcase Reel", price: 17, rating: 4.7, downloads: 1600, tags: ["Product", "Showcase"] },
    { id: 5, title: "Brand Collab Template", price: 18, rating: 4.9, downloads: 1400, tags: ["Collab", "Brand"] },
  ],
  youtube: [
    { id: 1, title: "Retention Booster Short", price: 14, rating: 4.9, downloads: 3100, tags: ["Retention", "Shorts"] },
    { id: 2, title: "Cinematic Intro Pack", price: 18, rating: 4.8, downloads: 1780, tags: ["Cinematic", "Intro"] },
    { id: 3, title: "Hook in 3 Seconds Formula", price: 16, rating: 5.0, downloads: 2900, tags: ["Hook", "Formula"] },
    { id: 4, title: "End Screen CTA Template", price: 12, rating: 4.7, downloads: 1200, tags: ["CTA", "End Screen"] },
  ],
  linkedin: [
    { id: 1, title: "Thought Leader Post", price: 11, rating: 4.7, downloads: 1450, tags: ["B2B", "Authority"] },
    { id: 2, title: "Authority Builder", price: 13, rating: 4.6, downloads: 980, tags: ["Authority", "Growth"] },
    { id: 3, title: "Viral B2B Story Arc", price: 14, rating: 4.8, downloads: 1100, tags: ["B2B", "Viral"] },
    { id: 4, title: "Company Milestone Post", price: 10, rating: 4.5, downloads: 780, tags: ["Company", "Milestone"] },
  ],
  ugc: [
    { id: 1, title: "Product Story Arc", price: 19, rating: 5.0, downloads: 4200, tags: ["UGC", "Product"] },
    { id: 2, title: "Unboxing Script Kit", price: 21, rating: 4.9, downloads: 3300, tags: ["Unboxing", "Script"] },
    { id: 3, title: "Expert Review Formula", price: 22, rating: 4.9, downloads: 2450, tags: ["Review", "Expert"] },
    { id: 4, title: "Viral Challenge Hook", price: 15, rating: 4.8, downloads: 3600, tags: ["Challenge", "Hook"] },
    { id: 5, title: "Luxury Unboxing Sequence", price: 24, rating: 4.9, downloads: 3100, tags: ["Luxury", "Unboxing"] },
  ],
};

const BADGE_VARIANTS: Record<string, "tiktok" | "instagram" | "youtube" | "linkedin" | "gold"> = {
  tiktok: "tiktok",
  instagram: "instagram",
  youtube: "youtube",
  linkedin: "linkedin",
  ugc: "gold",
};

interface Props {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { category } = use(params);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const categoryData = TEMPLATE_CATEGORIES.find((c) => c.slug === category);
  const templates = CATEGORY_TEMPLATES[category] || [];

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/templates">
            <Button variant="gradient">Browse All Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-card/50 border-b border-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Templates
          </Link>

          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryData.color} flex items-center justify-center text-2xl shadow-luxury`}>
              {categoryData.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{categoryData.name}</h1>
              <p className="text-muted-foreground mt-1">{categoryData.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={BADGE_VARIANTS[category] ?? "default"}>
                  {categoryData.count} templates
                </Badge>
                {categoryData.premium && (
                  <Badge variant="gold">⭐ Premium Collection</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              onHoverStart={() => setHoveredId(template.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group rounded-2xl border border-border bg-card hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Preview */}
              <div className="relative h-48 bg-gradient-to-br from-brand-500/10 to-purple-500/10 flex items-center justify-center">
                <div className="text-5xl opacity-50">{categoryData.icon}</div>
                {hoveredId === template.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
                  >
                    <Button size="sm" variant="glass" className="gap-1 text-white text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button size="sm" variant="gradient" className="gap-1 text-xs">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Buy
                    </Button>
                  </motion.div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={BADGE_VARIANTS[category] ?? "default"}>
                    {categoryData.platforms[0]}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{template.title}</h3>
                  <span className="text-brand-400 font-bold">${template.price}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {template.tags.map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
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
        </div>
      </div>
    </div>
  );
}
