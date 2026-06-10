export const SITE_NAME = "ViralKit";
export const SITE_TAGLINE = "Create Viral Content Faster With AI Templates";
export const SITE_DESCRIPTION =
  "Editable cinematic templates for TikTok, Instagram, YouTube, LinkedIn, and UGC creators.";

export const NAV_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "UGC Creator Kit", href: "/ugc" },
  { label: "Editor", href: "/editor" },
  { label: "Pricing", href: "/pricing" },
];

export const TEMPLATE_CATEGORIES = [
  {
    id: "tiktok",
    name: "TikTok Templates",
    slug: "tiktok",
    description: "Viral cinematic TikTok content templates that stop the scroll",
    icon: "🎵",
    color: "from-pink-500 to-rose-600",
    count: 48,
    platforms: ["TikTok"],
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    slug: "instagram",
    description: "Luxury modern Instagram reels and carousel templates",
    icon: "📸",
    color: "from-purple-500 to-pink-600",
    count: 36,
    platforms: ["Instagram"],
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    slug: "youtube",
    description: "High-retention cinematic YouTube Shorts templates",
    icon: "▶️",
    color: "from-red-500 to-orange-600",
    count: 28,
    platforms: ["YouTube"],
  },
  {
    id: "linkedin",
    name: "LinkedIn Professional",
    slug: "linkedin",
    description: "Professional personal branding and business content",
    icon: "💼",
    color: "from-blue-500 to-cyan-600",
    count: 24,
    platforms: ["LinkedIn"],
  },
  {
    id: "ugc",
    name: "UGC Creator Kit",
    slug: "ugc",
    description: "Premium UGC templates with product storytelling structure",
    icon: "🎬",
    color: "from-amber-500 to-yellow-600",
    count: 32,
    platforms: ["TikTok", "Instagram", "YouTube"],
    premium: true,
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 19,
    yearlyPrice: 15,
    description: "Perfect for individual creators just getting started",
    features: [
      "25 editable templates",
      "TikTok & Instagram templates",
      "Basic color customization",
      "720p export quality",
      "Email delivery",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "Creator Pro",
    price: 49,
    yearlyPrice: 39,
    description: "For serious creators who need professional tools",
    features: [
      "Unlimited templates",
      "All 5 platform templates",
      "Advanced editor & customization",
      "4K export quality",
      "UGC Creator Kit included",
      "AI prompt packs",
      "Priority email support",
      "New templates weekly",
    ],
    cta: "Start Creating",
    popular: true,
    color: "from-brand-500 to-purple-600",
  },
  {
    name: "Agency",
    price: 99,
    yearlyPrice: 79,
    description: "For agencies and teams managing multiple brands",
    features: [
      "Everything in Creator Pro",
      "5 team member seats",
      "White-label exports",
      "Brand kit management",
      "Client dashboard access",
      "API access",
      "Dedicated account manager",
      "Custom template requests",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "from-amber-500 to-orange-600",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    avatar: "/avatars/sarah.jpg",
    platform: "TikTok",
    followers: "2.4M",
    text: "ViralKit completely changed my content game. I went from 50k to 2.4M followers in 8 months using these templates. The cinematic quality is unmatched.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    handle: "@marcusmarketing",
    avatar: "/avatars/marcus.jpg",
    platform: "LinkedIn",
    followers: "180K",
    text: "As a B2B marketer, I needed professional LinkedIn content. These templates save me 10+ hours a week and my engagement tripled.",
    rating: 5,
  },
  {
    name: "Aisha Williams",
    handle: "@aishabeauty",
    avatar: "/avatars/aisha.jpg",
    platform: "Instagram",
    followers: "890K",
    text: "The UGC templates are insane. Brands are reaching out to me for deals because my product reviews look so professional and cinematic.",
    rating: 5,
  },
  {
    name: "Jake Thompson",
    handle: "@jakeyoutuber",
    avatar: "/avatars/jake.jpg",
    platform: "YouTube",
    followers: "1.2M",
    text: "My YouTube Shorts are getting 10x more views since I started using ViralKit. The hook templates alone are worth the price.",
    rating: 5,
  },
];

export const FAQ_ITEMS = [
  {
    question: "What file formats do I receive?",
    answer:
      "Templates are delivered as editable files compatible with Canva, Adobe Premiere, CapCut, and our built-in web editor. You get MP4, MOV, PDF, and editable source files.",
  },
  {
    question: "Can I customize the templates for my brand?",
    answer:
      "Absolutely! Every template is fully editable — change colors, fonts, text, logos, and media. Our drag-and-drop editor makes it easy for anyone, no design skills needed.",
  },
  {
    question: "How does digital delivery work?",
    answer:
      "Instantly after payment, your purchase is unlocked and download links are sent to your email. You also get permanent access through your customer dashboard.",
  },
  {
    question: "Are templates suitable for different niches?",
    answer:
      "Yes! Templates are designed to work across beauty, fitness, food, business, lifestyle, tech, and any other niche. The copy placeholders make it easy to adapt to your content.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee. If you're not satisfied with the quality of the templates, contact us and we'll process a full refund.",
  },
  {
    question: "How often are new templates added?",
    answer:
      "Creator Pro and Agency members get new templates every week, curated based on current trends across all platforms.",
  },
];
