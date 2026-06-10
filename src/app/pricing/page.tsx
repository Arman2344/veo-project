import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for creators of all sizes. Start free, upgrade when ready.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Simple, creator-first pricing</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            No hidden fees. No complexity. Just great templates.
          </p>
        </div>
      </div>
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
