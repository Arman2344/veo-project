"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Type,
  Palette,
  Image as ImageIcon,
  Download,
  Undo,
  Redo,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Sliders,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: "🎵", ratio: "9:16" },
  { id: "instagram", label: "Instagram", icon: "📸", ratio: "1:1" },
  { id: "youtube", label: "YouTube", icon: "▶️", ratio: "16:9" },
  { id: "linkedin", label: "LinkedIn", icon: "💼", ratio: "1.91:1" },
];

const TOOL_TABS = ["Text", "Colors", "Media", "Effects", "Layers"];

const TEXT_STYLES = [
  { label: "Headline", preview: "Big Bold Text", size: "text-2xl", weight: "font-black" },
  { label: "Subtitle", preview: "Medium Subtitle", size: "text-lg", weight: "font-semibold" },
  { label: "Body", preview: "Regular body text", size: "text-base", weight: "font-normal" },
  { label: "Caption", preview: "Small caption text", size: "text-sm", weight: "font-medium" },
];

const COLOR_PRESETS = [
  { name: "Neon Purple", hex: "#a855f7" },
  { name: "Electric Blue", hex: "#3b82f6" },
  { name: "Hot Pink", hex: "#ec4899" },
  { name: "Amber Gold", hex: "#f59e0b" },
  { name: "Neon Cyan", hex: "#06b6d4" },
  { name: "Lime Green", hex: "#84cc16" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Deep Black", hex: "#0a0a0a" },
];

export default function EditorPage() {
  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [activeTab, setActiveTab] = useState("Text");
  const [devicePreview, setDevicePreview] = useState("mobile");
  const [primaryColor, setPrimaryColor] = useState("#a855f7");
  const [headline, setHeadline] = useState("Your Viral Hook Here");
  const [subtitle, setSubtitle] = useState("Add your compelling subtitle");

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* Editor Toolbar */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <Undo className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activePlatform === p.id
                    ? "bg-brand-500 text-white"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <span>{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            {[
              { id: "mobile", Icon: Smartphone },
              { id: "tablet", Icon: Tablet },
              { id: "desktop", Icon: Monitor },
            ].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setDevicePreview(id)}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  devicePreview === id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button size="sm" variant="gradient" className="gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Tools */}
        <div className="w-64 border-r border-border bg-card flex flex-col overflow-hidden hidden lg:flex">
          {/* Tab nav */}
          <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
            {TOOL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-shrink-0 px-3 py-3 text-xs font-medium transition-all border-b-2",
                  activeTab === tab
                    ? "border-brand-500 text-brand-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tool content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "Text" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Text Styles
                </p>
                {TEXT_STYLES.map((style) => (
                  <button
                    key={style.label}
                    className="w-full p-3 rounded-xl border border-border bg-card hover:border-brand-500/30 text-left transition-all group"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{style.label}</p>
                    <p className={`${style.size} ${style.weight} text-foreground`}>
                      {style.preview}
                    </p>
                  </button>
                ))}

                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Edit Text
                  </p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Headline</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-brand-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Subtitle</label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-brand-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Colors" && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Color Presets
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setPrimaryColor(color.hex)}
                      title={color.name}
                      className={cn(
                        "w-10 h-10 rounded-xl border-2 transition-all",
                        primaryColor === color.hex
                          ? "border-brand-400 scale-110 shadow-neon"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Custom Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer border border-border"
                  />
                </div>
              </div>
            )}

            {activeTab === "Media" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Upload Media
                </p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-brand-500/50 transition-all cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or <span className="text-brand-400">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4, MOV</p>
                </div>
              </div>
            )}

            {(activeTab === "Effects" || activeTab === "Layers") && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sliders className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {activeTab} panel coming in Creator Pro
                </p>
                <Button size="sm" variant="gradient" className="mt-4 gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Upgrade
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-muted/50 flex items-center justify-center p-4 lg:p-8 overflow-auto">
          <motion.div
            layout
            className={cn(
              "relative bg-black rounded-2xl shadow-luxury overflow-hidden flex items-center justify-center transition-all duration-300",
              activePlatform === "tiktok" || activePlatform === "instagram"
                ? "w-64 h-[460px]"
                : activePlatform === "youtube"
                ? "w-[640px] h-[360px] max-w-full"
                : "w-[640px] h-[335px] max-w-full"
            )}
          >
            {/* Template preview */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}22 0%, #0f0f1a 60%)`,
              }}
            />

            {/* Decorative shapes */}
            <div
              className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-30 blur-xl"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="absolute bottom-10 left-4 w-16 h-16 rounded-full opacity-20 blur-lg"
              style={{ backgroundColor: primaryColor }}
            />

            {/* Content */}
            <div className="relative z-10 p-6 text-center">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}40`,
                }}
              >
                ✨ {PLATFORMS.find((p) => p.id === activePlatform)?.label}
              </div>
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                {headline}
              </h2>
              <p className="text-white/60 text-sm">{subtitle}</p>
              <div
                className="mt-4 px-5 py-2 rounded-full text-sm font-bold text-white inline-block"
                style={{ backgroundColor: primaryColor }}
              >
                Learn More →
              </div>
            </div>

            {/* Platform indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
              <div className="px-3 py-1 rounded-full glass text-xs text-white/60">
                {PLATFORMS.find((p) => p.id === activePlatform)?.ratio} •{" "}
                {PLATFORMS.find((p) => p.id === activePlatform)?.label}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar — Properties */}
        <div className="w-60 border-l border-border bg-card p-4 hidden xl:block">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Properties
          </p>
          <div className="space-y-4">
            {[
              { label: "Font Size", value: "32px" },
              { label: "Line Height", value: "1.2" },
              { label: "Letter Spacing", value: "0px" },
              { label: "Opacity", value: "100%" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <span className="text-xs font-medium text-foreground">{value}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-full h-1.5 rounded-full bg-border appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Export
            </p>
            <div className="space-y-2">
              {["MP4 (1080p)", "MOV (4K)", "PNG Image", "PDF Document"].map((format) => (
                <button
                  key={format}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-brand-500/30 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  <span>{format}</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
