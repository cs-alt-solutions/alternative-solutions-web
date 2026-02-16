/* src/utils/glossary.js */
export const WEBSITE_COPY = {
  NAV: {
    BRAND: "ALTERNATIVE SOLUTIONS",
    SERVICES: "SERVICES",
    SHIFT_STUDIO: "SHIFT STUDIO (BETA)",
    LOGIN: "CLIENT PORTAL",
  },

  HERO: {
    TITLE: "SYSTEMS THAT ACTUALLY WORK.",
    SUBHEAD: "Stop wrestling with spreadsheets and duct-taped apps. We build rock-solid, custom software so you can stop managing tech and get back to your business.",
    CTA_PRIMARY: "JOIN THE WAITLIST",
    CTA_SECONDARY: "SEE HOW WE WORK",
  },

  MISSION: {
    TITLE: "NO PLUG-AND-PLAY NONSENSE.",
    DESC: "You don't need another generic monthly subscription that only solves half your problem. We dig into how you actually work, find the friction, and build a foundational framework you own.",
  },

  HOW_IT_WORKS: {
    TITLE: "THE HYBRID APPROACH",
    SUBTITLE: "We combine deep business analysis with AI development speed.",
    STEP_1: {
      TITLE: "FIND THE LEAK",
      DESC: "We don't just write code. We map out your daily workflow to find exactly where you are losing time and money.",
    },
    STEP_2: {
      TITLE: "AI-ACCELERATED BUILD",
      DESC: "By leveraging AI for the heavy lifting of development, we turn what used to be months of expensive coding into a few weeks.",
    },
    STEP_3: {
      TITLE: "OWN YOUR FOUNDATION",
      DESC: "We deliver custom, scalable tools built specifically for your exact needs. No workarounds. No forcing your process into a pre-made box.",
    },
  },

  SERVICES_PAGE: {
    HERO: {
      TITLE: "TECH BUILT TO GIVE YOUR TIME BACK.",
      SUBTITLE: "Software shouldn't be a part-time job. It should be the invisible engine running your business.",
    },
    STORY: {
      TITLE: "WHY 'ALTERNATIVE'?",
      DESC: "Because the standard way is broken. Most tech agencies sell you bloat you don't need. We build exactly what you need to thrive, nothing you don't.",
    },
    TIERS: {
      ONE: { 
        TITLE: "The Automator", 
        PRICE: "Quick Fixes", 
        DESC: "Custom scripts to stop the manual data entry. We make your current tools do the boring work for you.",
        FEATURES: ["Custom Integrations", "Email Responders", "Data Pipelines", "Single-Task Tooling"],
      },
      TWO: { 
        TITLE: "The Connector", 
        PRICE: "Integrations", 
        DESC: "We bridge the gap. We make your separate apps talk to each other so your inventory, sales, and emails actually sync up.",
        FEATURES: ["Cross-Platform Syncing", "Inventory Pipelines", "Automated Onboarding", "Workflow Logic"],
      },
      THREE: { 
        TITLE: "The Architect", 
        PRICE: "Full Systems", 
        DESC: "Ground-up custom software. A professional, scalable framework built to be the permanent home for your operations.",
        FEATURES: ["End-to-End Software", "Client Portals", "Analytics Dashboards", "Future-Proof Scale"],
      },
    },
  },

  // --- NEW: THE AGENCY HOOK ---
  AGENCY_HOOK: {
    TITLE: "READY TO STOP THE LEAK?",
    SUBHEAD: "Let's map out your workflow and find the friction. Request a custom systems audit and let's build a foundation you actually own.",
  },

  JOIN_PAGE: {
    TITLE: "SHIFT STUDIO.",
    SUBHEAD: "The command center for creators is currently in private testing. Join the list to secure access.",
    INPUT_PLACEHOLDER: "enter your email address...",
    BTN_SUBMIT: "REQUEST ACCESS",
    SUCCESS_MSG: "YOU'RE ON THE LIST. STAY TUNED.",
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