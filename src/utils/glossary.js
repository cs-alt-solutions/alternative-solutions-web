/* src/utils/glossary.js */
export const WEBSITE_COPY = {
  NAV: {
    BRAND: "ALTERNATIVE SOLUTIONS",
    SERVICES: "SERVICES",
    SHIFT_STUDIO: "SHIFT STUDIO (BETA)",
    LOGIN: "CLIENT PORTAL",
  },

  // FIXED: Added back for src/app/page.tsx
  HERO: {
    TITLE: "SMARTER BUSINESS SYSTEMS.",
    SUBHEAD: "Stop fighting with spreadsheets. We build custom software and simple tools to help your business run smoother.",
    CTA_PRIMARY: "JOIN BETA WAITLIST",
    CTA_SECONDARY: "VIEW SERVICES",
  },

  MISSION: {
    TITLE: "BUILT FOR THE SMALL HUMANS.",
    DESC: "You don't need a million-dollar budget to have a professional system. We specialize in building custom solutions for entrepreneurs and small businesses that work as hard as you do.",
  },

  HOW_IT_WORKS: {
    TITLE: "THE HYBRID EDGE",
    SUBTITLE: "Better systems, built in a fraction of the time.",
    STEP_1: {
      TITLE: "STRATEGIC ANALYSIS",
      DESC: "We don't just take orders. We deep-dive into your workflow as a Business Analyst to find the real friction points before writing code.",
    },
    STEP_2: {
      TITLE: "AI-POWERED SPEED",
      DESC: "As an AI-Powered Architect, I use advanced tools to handle the heavy lifting, turning months of development into weeks.",
    },
    STEP_3: {
      TITLE: "SCALABLE CODE",
      DESC: "No 'plug-and-play' hacks. We build custom, foundational frameworks that you own, ensuring your tech grows as fast as your business does.",
    },
  },

  // FIXED: Added back for src/app/page.tsx
  SERVICES_PAGE: {
    HERO: {
      TITLE: "TECH BUILT BY A HUMAN, FOR THE HUMANS.",
      SUBTITLE: "Your software shouldn't be another thing you have to manage. It should be the thing that gives you your time back.",
    },
    STORY: {
      TITLE: "WHY 'ALTERNATIVE'?",
      DESC: "Most tech companies want to sell you a subscription and forget you. We look at your business through a sharp eye for foundations, not just features.",
    },
    TIERS: {
      ONE: { 
        TITLE: "The Automator", 
        PRICE: "Quick Fixes", 
        DESC: "Custom scripts and small-scale automation to stop the manual leak in your day.",
        FEATURES: ["Custom Integrations", "Email Responders", "Data Pipelines", "Single-Task Tooling"],
      },
      TWO: { 
        TITLE: "The Connector", 
        PRICE: "Integrations", 
        DESC: "Making your apps talk to each other. We bridge the gap between your tools so you don't have to.",
        FEATURES: ["Cross-Platform Syncing", "Inventory Pipelines", "Automated Onboarding", "Workflow Logic"],
      },
      THREE: { 
        TITLE: "The Architect", 
        PRICE: "Full Systems", 
        DESC: "Ground-up custom software. Scalable, professional frameworks built to be the permanent engine of your business.",
        FEATURES: ["End-to-End Software", "Client Portals", "Analytics Dashboards", "Future-Proof Scale"],
      },
    },
  },

  JOIN_PAGE: {
    TITLE: "SHIFT STUDIO.",
    SUBHEAD: "The command center for creators is currently in private testing. Join the list to secure access.",
    INPUT_PLACEHOLDER: "enter your email address...",
    BTN_SUBMIT: "REQUEST ACCESS",
    SUCCESS_MSG: "YOU'RE ON THE LIST. STAY TUNED.",
    // FIXED: Expanded HYPE block for src/app/join/page.tsx
    HYPE: {
      VIDEO_TITLE: "STOP JUGGLING APPS.",
      VIDEO_DESC: "Combining inventory, financials, and sales into one glass pane.",
      PODCAST_TITLE: "THE AUDIO LOGS",
      PODCAST_DESC: "Listen to the development journey and the philosophy behind Shift Studio.",
      CARDS: [
        {
          TITLE: "THE WORKSHOP",
          DESC: "Track raw materials, build stages, and finished goods. Know exactly what you have on the shelf.",
        },
        {
          TITLE: "THE LEDGER",
          DESC: "Real profit analysis. Not just 'Revenue', but actual money in your pocket after materials and fees.",
        },
        {
          TITLE: "THE REACH",
          DESC: "Future modules will connect directly to your sales channels. One inventory. Everywhere.",
        },
      ],
      MANIFESTO: {
        TITLE: "THE MAKER'S DILEMMA",
        TEXT: "You started this to create, not to be an accountant. But somewhere between the first sale and the hundredth, you became a professional spreadsheet wrangler. We are building the alternative.",
      },
      FAQ: [
        { q: "When does the Beta start?", a: "Rollouts begin late Q1 2026." },
        { q: "Is it free?", a: "Beta testers get free access for feedback." },
      ],
    }
  },

  // FIXED: Added back for src/app/shift-studio/page.tsx
  SHIFT_STUDIO_PAGE: {
    STATUS: "ENGINEERING IN PROGRESS",
    HERO: {
      TITLE: "OWN THE WORKSHOP. MASTER THE SALE.",
      SUBHEAD: "The command center for creators who sell everywhere. From workshop builds and inventory management to deep financials—stop juggling apps and start scaling your craft.",
    },
    ROADMAP: {
      PHASE_1_TITLE: "Phase 1: The Engine",
      PHASE_1_DESC: "Workshop & Financial Management. Build tracking, material costs, and profit margin analysis.",
      PHASE_2_TITLE: "Phase 2: The Reach",
      PHASE_2_DESC: "Multi-Channel Marketing & AI. Automated listing insights for Etsy and Marketplace.",
    },
  },

  DASHBOARD: {
    WAITLIST: {
      TITLE: "LEAD COMMAND",
      LEAD_COUNT: "ACTIVE LEADS:",
      // FIXED: Added missing dashboard properties
      EXPORT_BTN: "EXPORT CSV",
      FILTER_LABEL: "FILTER BY:",
      COLUMNS: {
        EMAIL: "EMAIL",
        SOURCE: "ENTRY POINT",
        JOINED: "TIMESTAMP",
        STATUS: "STATE",
        ACTIONS: "CONTROL",
      },
      STATUSES: {
        ALL: "ALL STATUSES",
        PENDING: "PENDING",
        INVITED: "INVITED",
        ONBOARDED: "ONBOARDED",
      },
    },
  },

  API: {
    WAITLIST: {
      SUCCESS: "Added to the list.",
      ERR_DUPLICATE: "Already on the list.",
      ERR_INVALID: "Invalid email address.",
      ERR_SERVER: "Server error. Try again later.",
    }
  }
};