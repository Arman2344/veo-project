import React from "react";
import Link from "next/link";
import { Zap, ExternalLink } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const footerLinks = {
  Product: [
    { label: "Templates", href: "/templates" },
    { label: "UGC Creator Kit", href: "/ugc" },
    { label: "Template Editor", href: "/editor" },
    { label: "Pricing", href: "/pricing" },
  ],
  Platform: [
    { label: "TikTok Templates", href: "/templates/tiktok" },
    { label: "Instagram Reels", href: "/templates/instagram" },
    { label: "YouTube Shorts", href: "/templates/youtube" },
    { label: "LinkedIn Content", href: "/templates/linkedin" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Affiliates", href: "/affiliates" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "License", href: "/license" },
  ],
};

const socialLinks = [
  { icon: "𝕏", href: "#", label: "Twitter / X" },
  { icon: "📸", href: "#", label: "Instagram" },
  { icon: "▶", href: "#", label: "YouTube" },
  { icon: "in", href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-neon">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gradient">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The premium template marketplace for viral content creators. Professional,
              cinematic, and ready to customize.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-brand-500/50 hover:bg-brand-500/10 transition-all duration-200 text-sm font-bold"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground text-sm mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made for creators</span>
            <span className="mx-1">·</span>
            <span className="text-gradient font-semibold">Go viral.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
