"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 cinematic-bg" />
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-600/30 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-600/30 blur-3xl"
            />
          </div>

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 py-16 sm:py-20 px-8 sm:px-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-white/80 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Start for free today
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 max-w-3xl mx-auto">
              Ready to create content that{" "}
              <span className="text-gradient">actually goes viral?</span>
            </h2>

            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              Join 50,000+ creators using ViralKit to grow their audience and
              land brand deals faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/templates">
                <Button
                  variant="gradient"
                  size="xl"
                  className="group gap-2 min-w-52"
                >
                  Browse Templates
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="xl"
                  className="min-w-52 bg-white text-gray-900 hover:bg-white/90"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="text-white/40 text-sm mt-6">
              No credit card required · 7-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
