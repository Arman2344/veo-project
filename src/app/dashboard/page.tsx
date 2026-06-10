"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Package,
  Clock,
  CreditCard,
  Settings,
  Zap,
  Star,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PURCHASED_TEMPLATES = [
  { id: 1, title: "Viral Hook Opener", platform: "TikTok", purchasedAt: "2024-01-15", downloads: 3, badge: "tiktok" as const },
  { id: 2, title: "Luxury Brand Reveal", platform: "Instagram", purchasedAt: "2024-01-10", downloads: 1, badge: "instagram" as const },
  { id: 3, title: "Product Story Arc", platform: "UGC", purchasedAt: "2024-01-08", downloads: 5, badge: "gold" as const },
];

const STAT_CARDS = [
  { label: "Templates Owned", value: "24", icon: Package, color: "text-brand-400", bg: "bg-brand-500/10" },
  { label: "Total Downloads", value: "147", icon: Download, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Days Active", value: "32", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Plan", value: "Pro", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const NAV_ITEMS = [
  { label: "My Templates", icon: Package, active: true },
  { label: "Downloads", icon: Download, active: false },
  { label: "Billing", icon: CreditCard, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("My Templates");

  return (
    <div className="min-h-screen bg-background pt-16 flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card p-4 hidden lg:block">
        <div className="mb-6 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Creator User</p>
              <div className="flex items-center gap-1.5">
                <Badge variant="gradient" className="text-xs">Creator Pro</Badge>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeNav === item.label
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 p-4 rounded-xl border border-border bg-background">
          <p className="text-xs font-semibold text-foreground mb-1">Storage Used</p>
          <div className="w-full h-1.5 bg-border rounded-full mt-2 mb-1">
            <div className="h-full w-2/3 bg-gradient-to-r from-brand-500 to-purple-600 rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground">2.4 GB of 5 GB</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Welcome back! Here&apos;s your creator overview.
              </p>
            </div>
            <Link href="/templates">
              <Button variant="gradient" size="sm" className="gap-1.5">
                <Zap className="w-4 h-4" />
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="p-4 rounded-2xl border border-border bg-card"
              >
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Purchased Templates */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">My Templates</h2>
              <Link href="/templates">
                <button className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  Get more <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {PURCHASED_TEMPLATES.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-brand-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center text-lg">
                      📱
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{template.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={template.badge} className="text-xs">{template.platform}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Purchased {new Date(template.purchasedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {template.downloads} downloads
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Open Editor", desc: "Customize your templates", icon: "✏️", href: "/editor" },
                { title: "Browse UGC Kit", desc: "Premium UGC templates", icon: "🎬", href: "/ugc" },
                { title: "Upgrade Plan", desc: "Unlock all features", icon: "⚡", href: "/pricing" },
              ].map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="p-4 rounded-2xl border border-border bg-card hover:border-brand-500/30 hover:shadow-card-hover transition-all duration-200 cursor-pointer">
                    <span className="text-2xl block mb-2">{action.icon}</span>
                    <p className="font-semibold text-foreground text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
