"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";

const ALL_TEMPLATES = [
  { id: 1, title: "Viral Hook Opener", category: "tiktok", price: 12, rating: 4.9, downloads: 2840, tags: ["Hook", "Viral"], gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20", badge: "tiktok" as const },
  { id: 2, title: "Luxury Brand Reveal", category: "instagram", price: 15, rating: 4.8, downloads: 1920, tags: ["Luxury", "Brand"], gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20", badge: "instagram" as const },
  { id: 3, title: "Retention Booster", category: "youtube", price: 14, rating: 4.9, downloads: 3100, tags: ["Retention", "Shorts"], gradient: "from-red-500/20 to-orange-500/20", border: "border-red-500/20", badge: "youtube" as const },
  { id: 4, title: "Thought Leader Post", category: "linkedin", price: 11, rating: 4.7, downloads: 1450, tags: ["B2B", "Authority"], gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", badge: "linkedin" as const },
  { id: 5, title: "Product Story Arc", category: "ugc", price: 19, rating: 5.0, downloads: 4200, tags: ["UGC", "Product"], gradient: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/20", badge: "gold" as const },
  { id: 6, title: "Behind The Scenes Kit", category: "tiktok", price: 13, rating: 4.8, downloads: 2100, tags: ["BTS", "Authentic"], gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20", badge: "tiktok" as const },
  { id: 7, title: "Carousel Swipe Story", category: "instagram", price: 16, rating: 4.9, downloads: 2450, tags: ["Carousel", "Story"], gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20", badge: "instagram" as const },
  { id: 8, title: "Cinematic Intro Pack", category: "youtube", price: 18, rating: 4.8, downloads: 1780, tags: ["Cinematic", "Intro"], gradient: "from-red-500/20 to-orange-500/20", border: "border-red-500/20", badge: "youtube" as const },
  { id: 9, title: "Authority Builder", category: "linkedin", price: 13, rating: 4.6, downloads: 980, tags: ["Authority", "B2B"], gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", badge: "linkedin" as const },
  { id: 10, title: "Unboxing Script Kit", category: "ugc", price: 21, rating: 4.9, downloads: 3300, tags: ["Unboxing", "Script"], gradient: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/20", badge: "gold" as const },
  { id: 11, title: "Trending Sound Hook", category: "tiktok", price: 10, rating: 4.7, downloads: 3800, tags: ["Trending", "Hook"], gradient: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20", badge: "tiktok" as const },
  { id: 12, title: "Lifestyle Aesthetic Reel", category: "instagram", price: 14, rating: 4.8, downloads: 2100, tags: ["Lifestyle", "Aesthetic"], gradient: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20", badge: "instagram" as const },
];

const SORT_OPTIONS = ["Most Popular", "Newest", "Price: Low to High", "Price: High to Low", "Highest Rated"];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");

  const filtered = ALL_TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Page Header */}
      <div className="bg-card/50 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  500+ Templates
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Browse All Templates
              </h1>
              <p className="text-muted-foreground mt-2">
                Cinematic, editable templates for every platform and niche.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[{ id: "all", name: "All", icon: "✨", count: ALL_TEMPLATES.length, color: "from-brand-500/20 to-purple-500/20", border: "border-brand-500/20" }, ...TEMPLATE_CATEGORIES].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                activeCategory === cat.id
                  ? "border-brand-500/50 bg-brand-500/10 shadow-neon"
                  : "border-border bg-card hover:border-brand-500/30"
              }`}
            >
              <div className="text-xl mb-1">{cat.icon}</div>
              <p className="text-sm font-semibold text-foreground leading-tight">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cat.count} templates</p>
            </button>
          ))}
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-5">
          Showing <strong className="text-foreground">{filtered.length}</strong> templates
        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-border bg-card hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Preview */}
              <div className={`relative h-44 bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                <div className={`w-24 h-40 rounded-xl border-2 ${template.border} bg-white/5 flex flex-col items-center justify-center gap-1.5 p-2`}>
                  <div className="w-full h-1.5 rounded-full bg-white/20" />
                  <div className="w-3/4 h-1.5 rounded-full bg-white/15" />
                  <div className="w-full h-10 rounded-lg bg-white/10 mt-1" />
                  <div className="w-full h-1.5 rounded-full bg-white/15 mt-1" />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant={template.badge} className="text-xs">
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button size="sm" variant="glass" className="gap-1 text-white text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </Button>
                  <Button size="sm" variant="gradient" className="gap-1 text-xs">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Buy
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{template.title}</h3>
                  <span className="text-brand-400 font-bold text-sm">${template.price}</span>
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

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No templates found matching your search.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
