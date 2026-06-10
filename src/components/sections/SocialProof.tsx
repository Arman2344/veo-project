"use client";

import React, { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

const PLATFORM_STATS = [
  { platform: "TikTok", icon: "🎵", color: "text-pink-400", stat: "500M+ views generated" },
  { platform: "Instagram", icon: "📸", color: "text-purple-400", stat: "200M+ impressions" },
  { platform: "YouTube", icon: "▶️", color: "text-red-400", stat: "100M+ watch time mins" },
  { platform: "LinkedIn", icon: "💼", color: "text-blue-400", stat: "50M+ professional reach" },
];

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  return (
    <div className="flex-shrink-0 w-80 p-5 rounded-2xl border border-border bg-card hover:border-brand-500/30 transition-all duration-300 mx-3">
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            {testimonial.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-green-400 font-medium justify-end">
            <TrendingUp className="w-3 h-3" />
            {testimonial.followers}
          </div>
          <p className="text-xs text-muted-foreground">{testimonial.platform}</p>
        </div>
      </div>
    </div>
  );
}

function InfiniteScroll({ items, direction = "left", speed = 30 }: {
  items: typeof TESTIMONIALS;
  direction?: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useAnimationFrame(() => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const totalWidth = el.scrollWidth / 2;
    xRef.current += direction === "left" ? -speed / 60 : speed / 60;
    if (direction === "left" && Math.abs(xRef.current) >= totalWidth) {
      xRef.current = 0;
    }
    if (direction === "right" && xRef.current >= 0) {
      xRef.current = -totalWidth;
    }
    el.style.transform = `translateX(${xRef.current}px)`;
  });

  const duplicated = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex" style={{ willChange: "transform" }}>
        {duplicated.map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} testimonial={item} />
        ))}
      </div>
    </div>
  );
}

export default function SocialProof() {
  const allTestimonials = [
    ...TESTIMONIALS,
    ...TESTIMONIALS.map((t) => ({ ...t, name: t.name + " " })),
  ];

  return (
    <section className="py-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5 fill-current" />
              Creator Success Stories
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Trusted by <span className="text-gradient">50,000+</span> creators
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From TikTok to LinkedIn — creators across every platform are
              growing faster with ViralKit templates.
            </p>
          </motion.div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {PLATFORM_STATS.map((stat, i) => (
            <motion.div
              key={stat.platform}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-4 rounded-2xl border border-border bg-card text-center"
            >
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <p className={`text-sm font-semibold ${stat.color}`}>{stat.platform}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.stat}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scrolling testimonials */}
      <div className="space-y-4">
        <InfiniteScroll items={TESTIMONIALS} direction="left" speed={25} />
        <InfiniteScroll items={[...TESTIMONIALS].reverse()} direction="right" speed={20} />
      </div>
    </section>
  );
}
