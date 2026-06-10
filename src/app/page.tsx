import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import TemplateShowcase from "@/components/sections/TemplateShowcase";
import SocialProof from "@/components/sections/SocialProof";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <TemplateShowcase />
      <SocialProof />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
