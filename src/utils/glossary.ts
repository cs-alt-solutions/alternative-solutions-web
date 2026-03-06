/* src/utils/glossary.ts */

export const WEBSITE_COPY = {
  NAV: {
    BRAND: "Alternative Solutions",
    ECOSYSTEM: "The Ecosystem",
    STORY: "The Story",
    WORKSPACE: "Workspace",
    BETA_CENTER: "BETA CENTER",
  },
  
  PUBLIC_SITE: {
    HOME: {
      HERO: {
        TAG: "NO VC FUNDING. NO CORPORATE FLUFF. JUST REAL TOOLS.",
        TITLE_1: "WORK LESS.",
        TITLE_2: "OPERATE BETTER.",
        SUBHEAD: "The industry standard software is bloated, expensive, and broken.",
        SUBHEAD_ITALIC: "We are building the alternative."
      },
      BENTO: {
        PRODUCT: {
          TAG: "The Flagship",
          TITLE: "Shift Studio",
          DESC: "Stop duct-taping platforms together. Shift Studio connects your sales, marketing, operations, and inventory into one high-performance engine.",
          CTA: "Enter The Studio"
        },
        STORY: {
          TAG: "The Story",
          TITLE: "Who is building this?",
          DESC: "No massive tech company. Just 20 years of cross-industry intel and the drive to do the f****** work.",
          CTA: "Read the Manifesto"
        },
        BETA: {
          TAG: "// Universal Testing Ground",
          TITLE: "Break the software. Earn your seat.",
          DESC: "Test our products in the real world and tell us exactly where they break. You report the friction, we write the code.",
          CTA: "Enter Beta Center"
        }
      },
      FOOTER: {
        TITLE: "Built different. Because it had to be.",
        COPYRIGHT: "Alternative Solutions LLC // Est. 2025"
      }
    },
    ECOSYSTEM: {
      HEADER: {
        TITLE: "The Ecosystem",
        DESC: "Alternative Solutions is an expanding network of tools designed to fix broken industries."
      },
      ACTIVE: {
        TAG: "// Active Deployments",
        STATUS: "STATUS: V1 BETA ACTIVE"
      },
      CLASSIFIED: {
        TITLE: "PROJECT CLASSIFIED",
        STATUS: "IN DEVELOPMENT // STANDBY"
      },
      CO_OP: {
        TITLE_1: "Got an idea?",
        TITLE_2: "Let's build it.",
        DESC_1: "I connect concepts across industries. You have the boots-on-the-ground experience.",
        DESC_2: "Why wait for a massive tech company? Let's team up.",
        DESC_3: "Service for service. Value for value.",
        CARD_TITLE: "The Co-Op Program",
        CARD_DESC: "Submit your friction points or app ideas. We build them together.",
        CTA: "Pitch an Idea"
      }
    },
    FOUNDER: {
      HEADER: {
        TAG: "THE MANIFESTO // DEC 2025",
        TITLE_1: "WHO GETS TO SAY",
        TITLE_2: "WHAT YOU'RE WORTH?"
      },
      CONTENT: {
        P1_A: "I’m done with the 'termination' culture. Alternative Solutions isn't just an app—",
        P1_B: "it’s the culture I’ve been dying to have my entire life.",
        P2: "For 20 years, I watched industries build walls. They degraded the 'job hoppers' because they were afraid of someone who understood the whole map.",
        BOX_TAG: "THE CONCEPT REPOSITORY",
        BOX_QUOTE: "\"I spent two decades getting paid to master every concept they tried to hide. I traded college for reality.\"",
        P3: "We work together. Service for service. Value for value. No separate houses. No fake professionalism. Just people who f****** do the work."
      },
      FOOTER: {
        TITLE: "Ready to break the bubble?",
        CTA: "Join The Movement"
      }
    },
    BLUEPRINT: {
      HEADER: {
        TAG: "THE LAB // REWARD PROTOCOL",
        TITLE_1: "POKE A",
        TITLE_2: "HOLE.",
        DESC: "The software you use every day was built to keep you in a bubble of 'good enough.' We are here to pop it."
      },
      GLITCHBOT: {
        TAG: "SYSTEM INTERCEPT // GLITCH_BOT",
        TITLE: "\"I am the bridge.\"",
        DESC: "Courtney writes the code. You break the software. I process the friction logs. No corporate fluff—just clean data and permanent rewards."
      },
      REWARDS: {
        TITLE: "You build the bricks.\nYou keep the keys.",
        DESC: "Log the friction, get XP. Earn ranks to unlock permanent rewards. I reward the people who actually help me build the software.",
        RANKS: [
          { title: "Operative", desc: "You're in the room. You see the build." },
          { title: "Architect", desc: "You own the software. Permanent access." },
          { title: "Apex", desc: "You're on the board. We build the future." }
        ]
      },
      FOOTER: {
        TITLE: "Ready to see what’s outside the bubble?",
        CTA: "Initiate Connection"
      }
    }
  },

  PUBLIC_LOGS: {
    SUBHEAD: "GLOBAL TRANSMISSIONS",
    TITLE: "PUBLIC AUDIO LOGS",
    DESC: "Unfiltered transmissions, raw strategy, and architectural updates from the build."
  },

  ACCESS_HOOK: {
    FIELDS: {
      NAME: "What's your name?",
      EMAIL: "Email Address",
      PHONE: "Phone Number (Optional)",
    },
    BTN_SUBMIT: "REQUEST CLEARANCE",
    SUCCESS_MSG: "ACCESS GRANTED. WELCOME TO THE BUILD.",
    AUTO_SIGNUP: "HEY, YOU WEREN'T ON THE LIST YET—BUT WE SIGNED YOU UP. WELCOME IN."
  },

  JOIN_PAGE: {
    SUCCESS_MSG: "YOU'RE ON THE LIST. STAY TUNED.",
    HYPE: {
      PODCAST_TITLE: "THE ARCHITECT'S PODCAST",
      PODCAST_DESC: "Listen to the development journey.",
      AUDIO_PLAYER: {
        PREFIX: "EPISODE //",
        STREAMING: "STREAMING...",
        ENCRYPTED: "ENCRYPTED"
      },
      MANIFESTO: { TITLE: "THE REALITY CHECK", TEXT: "You started this to create, not to be an accountant." },
      FAQ: [
        { q: "When does the Beta start?", a: "Rollouts begin late Q1 2026." },
        { q: "Is it free?", a: "Beta testers get free access for feedback." },
      ]
    }
  },

  SHIFT_STUDIO_PAGE: {
    STATUS: "CURRENTLY BUILDING // SECTOR 01",
    HERO: {
      TITLE: "STOP RUNNING TWO BUSINESSES.",
      SUBHEAD: "You built this to make things—not to be an IT manager. Shift Studio combines your workshop, your finances, and your sales into a single engine so you can get back to the work that matters.",
    },
    PODCAST_FEED: { 
      TITLE: "DEV INTEL FEED", 
      SUBHEAD: "RAW TRANSMISSIONS",
      FALLBACK: "AWAITING INCOMING TRANSMISSIONS..." 
    },
    // NEW ROBUST EVIDENCE REGISTRY
    EVIDENCE: {
      TAG: "LIVE SYSTEM CAPTURE",
      MODULES: [
        {
          ID: "main",
          IMAGE: "/images/shift-main.png",
          CAPTION: "SHIFT STUDIO // MAIN COMMAND INTERFACE",
          TITLE: "The Central Nervous System.",
          DESC: "Your entire operation at a glance. We routed global metrics, active build directives, and priority lead queues into a single pane of glass.",
          FACTS: ["Real-time pulse monitoring", "Automated lead routing", "Unified daily directives"]
        },
        {
          ID: "board",
          IMAGE: "/images/shift-board.png",
          CAPTION: "ACTIVE PROJECT FLOW // KANBAN",
          TITLE: "The Workshop Board.",
          DESC: "Stop wondering where the build is at. Track every project phase from raw material to shipped product without opening a separate project management app.",
          FACTS: ["Visual build stages", "Client timeline tracking", "Zero-friction handoffs"]
        },
        {
          ID: "ledger",
          IMAGE: "/images/shift-ledger.png",
          CAPTION: "FINANCIAL LEDGER // REAL-TIME SYNC",
          TITLE: "The Maker's Ledger.",
          DESC: "Business math, automated. Your workshop data flows directly into your financial analysis so you never have to do double-entry accounting again.",
          FACTS: ["Live profit margins", "Automated material costs", "No 'magic' numbers"]
        }
      ]
    },
    SECTORS: {
      PHILOSOPHY: {
        TAG: "THE REALITY CHECK",
        TITLE: "Stop running a business on top of your business.",
        DESC: "Most software asks you to do double the work: do the job, then record the job in five different apps. Shift Studio is the only engine built to handle the making and the managing in one place."
      },
      SYSTEM_MODULES: [
        { 
          ID: "MOD_01", 
          TITLE: "THE WORKSHOP", 
          DESC: "Real-time tracking for raw materials, build stages, and finished inventory.",
          STATUS: "STABLE"
        },
        { 
          ID: "MOD_02", 
          TITLE: "THE LEDGER", 
          DESC: "Bespoke financial analysis designed for makers. Your workshop data flows directly into your profit analysis. No double-entry.",
          STATUS: "BETA"
        },
        { 
          ID: "MOD_03", 
          TITLE: "THE REACH", 
          DESC: "Direct channel integration. Master your sales across every platform without the corporate middlemen.",
          STATUS: "DEVELOPING"
        }
      ],
      FLIGHT_PLAN: "THE PLAN",
      FAQ: "SYSTEM INQUIRIES"
    },
    ROADMAP: {
      PHASE_1_TITLE: "Phase 1: The Engine", 
      PHASE_1_DESC: "Deploying core Workshop and Ledger modules for initial testing.",
      PHASE_2_TITLE: "Phase 2: The Neural Network", 
      PHASE_2_DESC: "Expanding into multi-channel marketing and AI-driven inventory forecasting.",
    },
    // ADD THIS BLOCK BACK IN
    BOTTOM_CTA: { 
      TITLE: "Ready to take control?", 
      DESC: "Secure your spot for the Shift Studio closed beta rollout." 
    }
  },
  DASHBOARD: {
    COMMON: { BRAND_VERSION: "Alt // OS v1.0", STATUS_ONLINE: "SYSTEM ONLINE", ACTION_REVIEW: "REVIEW" },
    SIDEBAR: { GROUPS: { COMMAND: "Command", OPERATIONS: "Operations", STUDIO: "Studio", SYSTEM: "System" }, OVERVIEW: "Overview", WAITLIST: "Beta Command", TASKS: "Strategic Planner", BROADCAST: "Broadcast Hub", AGENTS: "AI Agents", CONFIG: "Config", EXIT: "← Exit to Public Site" },
    WAITLIST: { TITLE: "Beta Command", LEAD_COUNT: "Total Scanned", ROW_ACTIONS: { INVITE: "Send Invite", QUARANTINE: "Quarantine User" } },
    PROJECT_BOARD: { NOT_FOUND: "PROJECT MISSING", ADD_TASK: "NEW TASK", COLUMNS: { TODO: "TODO", IN_PROGRESS: "BUILDING", REVIEW: "TESTING", DONE: "SHIPPED" } },
    OVERVIEW: { TITLE: "SYSTEM COMMAND", DIRECTIVE: { TITLE: "THE DAILY DIRECTIVE", SUBTITLE: "HEAVY LIFTING ONLY", EMPTY: "ALL SYSTEMS CLEAR. AWAITING COMMAND.", TYPES: { LEAD: "NEW INQUIRY", TASK: "ACTIVE DEV TASK" }, ACTIONS: { PROCESS: "PROCESS", EXECUTE: "EXECUTE" } }, LIVE_FEED: { TITLE: "NETWORK PULSE", NEW_BETA: "WAITING_FOR_PULSE..." }, INFRASTRUCTURE: { TITLE: "TECH STACK OVERWATCH", SUBTITLE: "LIVE SERVICE STATUS", PLATFORMS: { GITHUB: "GITHUB (CODE)", VERCEL: "VERCEL (DEPLOY)", SUPABASE: "SUPABASE (DATA)" } }, PANELS: { ACTION_REQD: "PRIORITY ACTION QUEUE", ENGINEERING: "INTERNAL ENGINEERING" }, TELEMETRY: { TITLE: "NETWORK TELEMETRY", CHART_LABEL: "REQUEST VOLUME", METRICS: { TRAFFIC: "LIVE TRAFFIC", CONVERSION: "CONVERSION" } } },
    MEDIA_HUB: { TITLE: "BROADCAST HUB", SUBTITLE: "GLOBAL COMMS", TABS: { AUDIO: "Audio Logs", SOCIAL: "Social", CAMPAIGNS: "Campaigns" }, STUDIO: { TITLE: "STUDIO COMMAND", NO_NOTES: "No transmissions detected.", BTN_PUBLISH: "AUTHORIZE" } },
    STRATEGIC_PLANNER: { 
      BTN_ADD: "LOG DIRECTIVE", 
      ACTIONS: { AUDIO: "RECORD AUDIO", AUTHORIZE: "AUTHORIZE BUILD" },
      MODAL: {
        TARGET_LABEL: "Deployment Target",
        TARGET_LEDGER: "IDEAS LEDGER",
        TARGET_FLOW: "ACTIVE FLOW",
        DATE_LABEL: "Execution Date",
        TITLE_LABEL: "Directive Title",
        TITLE_PLACEHOLDER: "ENTER DIRECTIVE...",
        CLASS_LABEL: "Classification",
        INTENSITY_LABEL: "Intensity",
        PHASES_LABEL: "Strategic Phases",
        PHASE_ADD: "ADD PHASE",
        PHASE_PLACEHOLDER: "PHASE 01...",
        STATUS_SUBMITTING: "AUTHORIZING...",
        TYPES: { FEATURE: "FEATURE", INFRA: "INFRASTRUCTURE", BUG: "SYSTEM FIX" },
        PRIORITIES: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", CRITICAL: "CRITICAL" }
      }
    }
  },
  
  SUPPORT_MODULE: {
    TITLE: "FUEL THE ENGINE",
    DESC: "We build independent software without VC funding. Your support goes directly into server costs.",
    STRIPE_LINK: "https://buy.stripe.com/test_placeholder", 
    BTN_TEXT: "CONTRIBUTE"
  }
};

export interface StrategicGoal { id: string; label: string; color: string; description: string; }
export const STRATEGIC_GOALS: Record<string, StrategicGoal> = {
  WEBSITE: { id: 'goal_website', label: 'Alternative Solutions Brand', color: '#00D1FF', description: 'The digital face.' },
  COMMAND_CENTER: { id: 'goal_command', label: 'Lead Architect Dashboard', color: '#7000FF', description: 'Internal engine.' },
  SHIFT_STUDIO: { id: 'goal_shift', label: 'Shift Studio (Beta)', color: '#FF007A', description: 'Command center.' }
};
export interface Directive { id: number; goalId: string; title: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'completed'; classification: string; }