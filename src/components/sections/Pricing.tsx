"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 bg-card/50" id="pricing">
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
              <Zap className="w-3.5 h-3.5" />
              Simple Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Choose your{" "}
              <span className="text-gradient">creator plan</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free, upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={cn("text-sm font-medium", !isYearly ? "text-foreground" : "text-muted-foreground")}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300",
                isYearly ? "bg-brand-500" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                  isYearly && "translate-x-6"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-1.5", isYearly ? "text-foreground" : "text-muted-foreground")}>
              Yearly
              <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-semibold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-8 border transition-all duration-300",
                plan.popular
                  ? "border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-purple-500/5 shadow-neon scale-[1.02]"
                  : "border-border bg-card hover:border-brand-500/30 hover:shadow-card-hover"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-full text-white text-xs font-bold shadow-neon">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} mb-4 text-white`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-green-500 mt-1">
                    Billed ${plan.yearlyPrice * 12}/year — save ${(plan.price - plan.yearlyPrice) * 12}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      plan.popular ? "bg-brand-500/20" : "bg-muted"
                    )}>
                      <Check className={cn(
                        "w-3 h-3",
                        plan.popular ? "text-brand-400" : "text-muted-foreground"
                      )} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.name === "Agency" ? "/contact" : "/sign-up"}>
                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          All plans include 7-day money-back guarantee. No credit card required for free trial.
        </p>
      </div>
    </section>
  );
}
