/* src/config/marketing/sector-zero.ts */
import { SUBSCRIPTION_PLANS } from '../plans';

export const STOREFRONTS = {
  HEADER: {
    TAG: "CUSTOM WEB BUILDS • ZERO FRICTION",
    TITLE_1: "PROFESSIONAL",
    TITLE_2: "STOREFRONTS.",
    DESC: ""
  },
  THE_PLEDGE: {
    TITLE_1: "No Agency Bloat.",
    TITLE_2: "Zero Friction.",
    DESC: "You do the hard work. Getting it online shouldn't be another hurdle. Stop fighting bloated DIY templates and fragmented tools. Let's establish your business in the digital world professionally. There is no 'let's talk it out and see how much I can charge you'—you pay a simple, flat-rate build fee to get the custom engine running, and a flat monthly plan for the enterprise infrastructure. You provide the vision; I handle the code."
  },
  REWARDS: {
    TITLE: "The Specifications",
    RANKS: [
      {
        title: "The Build",
        desc: "A blazing-fast 1-to-3 page custom storefront (Home, About, Contact) perfectly wired to route messages directly to your email."
      },
      {
        title: "The Grid",
        desc: "Automatic listing on the Alternative Solutions Grid—a live directory driving organic traffic and SEO back to your business."
      },
      {
        title: "The Mechanics & Domains",
        desc: "Don't have a web address yet? No sweat. I will help you hunt down the perfect domain. Zero maintenance, enterprise hosting, and seamless domain wiring included."
      }
    ]
  },
  STOREFRONT_OFFER: {
    TITLE: "LET'S BUILD IT.",
    SUBTITLE: "Get your business online today without the DIY headache.",
    TAG: "THE FOUNDATION",
    OFFER_TITLE: "THE MANAGED STOREFRONT",
    DESC: "Stop fighting templates. You pay a one-time, flat-rate fee for the custom build, and pick a simple monthly plan to keep the engine running smoothly on enterprise-grade hosting.",
    TIERS: SUBSCRIPTION_PLANS, // 🚀 Pulls directly from plans.ts
    BTN_TEXT: "START YOUR APPLICATION",
    LINK: "/storefronts/apply"
  },
  ROSTER: {
    TAG: "THE GRID • LIVE PORTFOLIOS",
    TITLE: "ACTIVE CLIENTS",
    DESC: "See who is running their business on the Alternative Solutions Grid. (Clients can choose to remain anonymous).",
    EMPTY_STATE: "The grid is waiting. Be the first to start your build."
  },
  GALLERY: {
    TITLE_1: "Live Website",
    TITLE_2: "Prototypes",
    PITCH_BOLD: "Real code. Real engines. Fictional brands.",
    PITCH_REST: "I don't use bloated templates. Every storefront is custom-built from the ground up. Test-drive the interactive production sandboxes below to see how the engine actually feels across different industries.",
    EMPTY_TITLE: "No Active Prototypes",
    EMPTY_DESC: "Engine standing by for deployment.",
    SECTOR_EMPTY_PRE: "No prototypes deployed in the",
    SECTOR_EMPTY_POST: "aesthetic yet.",
    AESTHETICS: [
      "All Aesthetics",
      "Industrial",
      "Neo-Brutalist",
      "Cyberpunk",
      "Minimalist",
      "Elegant",
      "Organtic",
      "Editorial",
      "Midnight Onyx"
    ],
    AESTHETIC_DESCRIPTIONS: {
      "All Aesthetics": "The complete amphitheater of interactive production sandboxes.",
      "Industrial": "Exposed steel, heavy typography, and zero fluff.",
      "Neo-Brutalist": "Loud, unapologetic, and deliberately rebellious design.",
      "Cyberpunk": "Neon-drenched telemetry engineered for high-velocity brands.",
      "Minimalist": "Clean whitespace, crisp typography, and zero distractions.",
      "Elegant": "Muted palettes and effortless luxury for high-ticket positioning.",
      "Organtic": "Earthy tones and fluid structures grounded in real-world connection.",
      "Editorial": "Magazine-grade storytelling built to turn casual visitors into readers.",
      "Midnight Onyx": "Deep monochrome shadows for undeniable stealth-mode authority."
    }
  },
  FOOTER: {
    TITLE: "Ready to launch your website?",
    CTA: "Start Your Application"
  }
};