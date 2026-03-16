/* src/utils/glossary.ts */

export const SYSTEM_CONFIG = {
  RATES: {
    LABOR: 50,
    FOUNDER: 5,     
    PUBLIC: 49      
  }
};

export interface AppTool { id: string; name: string; cost: number; category: 'PROJECT' | 'INVENTORY' | 'FINANCE'; }
export interface HourTier { label: string; value: number; }

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
        TAG: "SYSTEM INITIALIZATION",
        TITLE_1: "BUILDING THE",
        TITLE_2: "FOUNDATION.",
        SUBHEAD: "I don't do cookie-cutter templates. I architect custom, high-performance ecosystems driven by AI and built for scale."
      },
      PROBLEM_STATEMENT: {
        TAG: "THE REALITY CHECK",
        TITLE: "You are running a business on duct tape.",
        DESC: "Paying for 8 different apps that don't talk to each other isn't an ecosystem. It's a headache. I build unified engines that actually share the same brain."
      },
      FLAGSHIP: {
        TAG: "FOR THE SOLO MAKER",
        TITLE: "MEET SHIFT STUDIO",
        DESC: "You are a one-person powerhouse making products from home, not a corporate warehouse. Stop guessing your profit margins and connect your raw materials, daily builds, and finances into one intelligent command center.",
        CTA: "Explore Shift Studio",
        LINK: "/products/shift-studio"
      },
      BENTO: {
        PRODUCT: { TAG: "THE ECOSYSTEM", TITLE: "ALL SYSTEMS. ONE BRAIN.", DESC: "Explore the full suite of hybrid frameworks built to run your business without the friction.", CTA: "See the Network", LINK: "/products" },
        STORY: { TAG: "THE ARCHITECT", TITLE: "BUILT DIFFERENT.", DESC: "No corporate boxes. No fragile workarounds. Just a relentlessly strong foundation built by a neurodivergent mind.", CTA: "View Telemetry", LINK: "/founder" },
        BETA: { TAG: "CO-OP MODE", TITLE: "JOIN THE BUILD", DESC: "I am building the tools I actually want to use. Grab a spot on the waitlist and help me shape the ecosystem.", CTA: "Apply for Access", LINK: "/blueprint" },
        TECH: { TAG: "INTERNAL WIRING", TITLE: "AI AS A PARTNER", DESC: "I don't sell generic AI wrappers. I use AI internally as a relentless coding partner to architect bulletproof systems faster.", CTA: "" }
      }
    },
    
    ECOSYSTEM: {
      HEADER: { TITLE: "The Ecosystem", DESC: "A family of tools that share the same brain. Everything just works together." },
      ACTIVE: { TAG: "FOR THE MAKER", STATUS: "THE COMMERCE ENGINE • V1 BETA" },
      CLASSIFIED: { TITLE: "WHAT'S NEXT", STATUS: "EXPANDING THE NETWORK..." },
      CO_OP: { 
        TITLE_1: "Got a problem?", 
        TITLE_2: "Let's fix it.", 
        DESC_1: "The whole point is that everything works together. I connect the dots; you bring the experience.", 
        DESC_2: "Why wait for a big company to build a tool that doesn't fit? Let's team up.",
        DESC_3: "Value for value. Let's build something real.",
        CARD_TITLE: "The Co-Op Program",
        CARD_DESC: "Tell me what’s slowing you down. If it fits the ecosystem, we build it together.",
        CTA: "Pitch an Idea" 
      }
    },

    FOUNDER: {
      HEADER: { TAG: "THE ORIGIN STORY", TITLE_1: "BUILT DIFFERENT.", TITLE_2: "LITERALLY." },
      CONTENT: {
        INTRO: "I don't fit into a standard corporate box. My entire life has been wired around finding the alternative way to operate.",
        THE_HYBRID: "I spent years connecting dots and fixing broken workflows before I realized I didn't need their permission. I took the skills and built my own hybrid framework.",
        BOX_TAG: "PASSIVE ABILITY • THE REWIRING",
        BOX_QUOTE: "\"Where others see a tangled mess of disconnected systems, my AuDHD sees exactly how to rewire them into one unified engine.\"",
        P3: "I'm not here to sell you a gimmick. I use AI internally—as a relentless coding partner—to harness raw processing power.",
        THE_MINDSET_TITLE: "TECH WIRING MEETS BRAIN WIRING",
        THE_MINDSET: "Rewiring your business isn't just a tech problem. It's a neuroplasticity problem. Your brain has to actively form new pathways to trust the automation.",
        NEURO_LINK_TEXT: "Explore Neuroplasticity →",
        NEURO_LINK_URL: "https://my.clevelandclinic.org/health/articles/neuroplasticity",
      },
      STATS: { TITLE: "ARCHITECT'S TELEMETRY", ROLE: "Lead Solutions Architect", CLASS: "Hybrid", WIRING: "AuDHD + Dyslexic", FUEL: "Coffee & Sarcasm", CO_WORKERS: "5 Cats & an 8-Year-Old Boss" },
      FOOTER: { TITLE: "Ready to build something real?", CTA: "Enter The Ecosystem" }
    },

    BLUEPRINT: {
      HEADER: { TAG: "THE LAB • REWARD PROTOCOL", TITLE_1: "POKE A", TITLE_2: "HOLE.", DESC: "The software you use every day was built to keep you in a bubble of 'good enough.' I am here to pop it." },
      GLITCHBOT: { TAG: "SYSTEM INTERCEPT • GLITCH_BOT", TITLE: "\"I am the bridge.\"", DESC: "Courtney writes the code. You break the software. I process the friction logs." },
      REWARDS: {
        TITLE: "You build the bricks.\nYou keep the keys.",
        DESC: "Log the friction, get XP. Earn ranks to unlock permanent rewards.",
        RANKS: [
          { title: "Operative", desc: "You're in the room. You see the build." },
          { title: "Architect", desc: "You own the software. Permanent access." },
          { title: "Apex", desc: "You're on the board. We build the future." }
        ]
      },
      FOOTER: { TITLE: "Ready to see what’s outside the bubble?", CTA: "Initiate Connection" }
    },

    SHIFT_STUDIO_PAGE: {
      PRODUCT_NAME: "SHIFT STUDIO",
      STATUS: "CURRENTLY BUILDING • SECTOR 01",
      HERO: {
        TITLE: "BUILT FOR THE SOLO MAKER.",
        SUBHEAD: "You are a one-person powerhouse making products from home, not a corporate warehouse. Stop guessing your profit margins and connect your raw materials, daily builds, and finances into one intelligent command center.",
      },
      ROI: {
        TITLE: "What are you actually paying for?",
        SUBTITLE: "I've pre-loaded the industry baseline. Select your own tools to see your custom 'Tech Tax' in real-time.",
        STEP_1_LABEL: "What's currently in your stack?",
        STEP_2_LABEL: "Hours lost to manual tasks weekly?",
        STEP_3_LABEL: "What is your hourly rate?",
        MONTHLY_HEAD: "MONTHLY",
        YEARLY_HEAD: "YEARLY",
        BREAKDOWN_TITLE: "THE SHIFT STUDIO EQUATION",
        STACK_SUBTOTAL: "MONEY SAVED ON APPS",
        LABOR_SUBTOTAL: "VALUE OF RECOVERED TIME",
        APPS_LABEL: "YOUR CURRENT TECH DEBT",
        TIME_LABEL: "VALUE OF RECOVERED TIME",
        COST_LABEL: "SHIFT STUDIO (INVESTMENT)",
        DISCLAIMER: "*App costs are estimates based on standard monthly prices.",
        CATEGORIES: { PROJECT: "Tasks & Planning", INVENTORY: "Sales & Inventory", FINANCE: "Money & Bookkeeping" },
        APPS: [
          { id: "notion", name: "Notion", cost: 10, category: "PROJECT" },
          { id: "asana", name: "Asana", cost: 11, category: "PROJECT" },
          { id: "trello", name: "Trello", cost: 5, category: "PROJECT" },
          { id: "monday", name: "Monday.com", cost: 24, category: "PROJECT" },
          { id: "shopify", name: "Shopify", cost: 39, category: "INVENTORY" },
          { id: "square", name: "Square", cost: 30, category: "INVENTORY" },
          { id: "shipstation", name: "ShipStation", cost: 10, category: "INVENTORY" },
          { id: "shopmonkey", name: "Shopmonkey", cost: 135, category: "INVENTORY" },
          { id: "quickbooks", name: "QuickBooks", cost: 35, category: "FINANCE" },
          { id: "xero", name: "Xero", cost: 15, category: "FINANCE" },
          { id: "freshbooks", name: "FreshBooks", cost: 19, category: "FINANCE" }
        ] as AppTool[],
        HOUR_TIERS: [
          { label: "1-2 hrs", value: 1.5 },
          { label: "3-5 hrs", value: 4 },
          { label: "5-10 hrs", value: 7.5 },
          { label: "10+ hrs", value: 12 }
        ] as HourTier[],
        OUTPUT_LABEL: "NET PROFIT (MONEY BACK IN YOUR POCKET)",
        OUTPUT_SUBTEXT: "*This is what you save by replacing your apps and getting your time back."
      },
      MATRIX: {
        TAG: "THE REAL DIFFERENCE",
        TITLE: "How it stacks up.",
        SUBTITLE: "You didn't start a business to be an accountant. Here is how I fix the headache of using ten different apps.",
        HEAD_STANDARD: "Disconnected Systems",
        HEAD_SHIFT: "Shift Studio Native",
        SECTIONS: [
          { TITLE: "YOUR DATA", ROWS: [
            { feature: "Inventory Sync", duct: "Copying numbers manually.", shift: "Native, instant data flow.", image: "/images/diff-sync.png" }, 
            { feature: "Real Profit Tracking", duct: "Figuring profit once a month.", shift: "Profit updates with every sale.", image: "/images/diff-profit.png" }
          ]},
          { TITLE: "YOUR WORKFLOW", ROWS: [
            { feature: "AI Partnership", duct: "Basic help with no context.", shift: "AI that knows your goals.", image: "/images/diff-ai.png" }, 
            { feature: "Daily Tasks", duct: "Constant switching between apps.", shift: "Everything in one unified view.", image: "/images/diff-tasks.png" }
          ]},
          { TITLE: "YOUR MONEY", ROWS: [
            { feature: "Monthly Bills", duct: "Paying for 5-8 separate apps.", shift: "One spot to access everything.", image: "/images/diff-bills.png" }, 
            { feature: "Maintenance Overhead", duct: "Spending hours fixing broken links.", shift: "I handle the wiring; you build.", image: "/images/diff-maint.png" }
          ]}
        ]
      },
      EVIDENCE: {
        TAG: "LIVE SYSTEM CAPTURE",
        MODULES: [
          { 
            ID: "main", 
            IMAGES: ["/images/shift-main.png"], 
            CAPTION: "SHIFT STUDIO • MAIN COMMAND", 
            TITLE: "The Central Nervous System.", 
            DESC: "Your entire operation at a glance. Stop digging through tabs to figure out what's moving and what needs your attention.", 
            FACTS: ["Real-time pulse monitoring", "Automated lead routing", "Unified operational overview"] 
          },
          { 
            ID: "workshop", 
            IMAGES: ["/images/shift-board.png", "/images/shift-inventory.png"], 
            CAPTION: "ACTIVE PROJECT FLOW & INVENTORY", 
            TITLE: "The Workshop Core.", 
            DESC: "Build products from raw materials to final pricing. The true power of Shift Studio is the native connection between your daily tasks and your stock. As you move projects across your Kanban board, the system automatically allocates the required components from your connected inventory. No more jumping between different apps just to update stock or check material availability.", 
            FACTS: ["Visual Kanban project tracking", "Live component & material allocation", "Low-stock automated alerts", "Multi-stage build syncing"] 
          },
          { 
            ID: "ledger", 
            IMAGES: ["/images/shift-ledger.png"], 
            CAPTION: "FINANCIAL TELEMETRY", 
            TITLE: "The Live Ledger.", 
            DESC: "Bespoke financial analysis built for makers. See exactly what each build costs you in materials and time, and watch your true profit margins update live.", 
            FACTS: ["Per-item profit margin analysis", "Automated expense tracking", "No spreadsheet formulas required"] 
          },
          { 
            ID: "spark", 
            IMAGES: ["/images/shift-spark.png"], 
            CAPTION: "INTELLIGENT ASSISTANCE", 
            TITLE: "Meet Spark AI.", 
            DESC: "Not just another generic chatbot. Spark is wired directly into your ecosystem. It knows your inventory levels, your past projects, and your financial goals, acting as a relentless partner that helps you process data instantly.", 
            FACTS: ["Context-aware assistance", "Automated task generation", "Instant ecosystem data retrieval"] 
          },
          { 
            ID: "wizard", 
            IMAGES: ["/images/shift-wizard.png"], 
            CAPTION: "SYSTEM ONBOARDING", 
            TITLE: "The Setup Wizard.", 
            DESC: "No more blank canvas anxiety. When you enter the ecosystem, the interactive wizard guides you through wiring your exact business model into the platform, ensuring your foundation is rock solid from day one.", 
            FACTS: ["Guided step-by-step setup", "Custom framework generation", "Zero blank-page syndrome"] 
          }
        ]
      },
      SECTORS: {
        PHILOSOPHY: { TAG: "THE REALITY CHECK", TITLE: "Stop running a business on top of your business.", DESC: "Shift Studio handles the making and the managing in one place." },
        SYSTEM_MODULES: [{ ID: "MOD_01", TITLE: "THE COMMAND", DESC: "Task tracking and daily project routing.", STATUS: "ACTIVE" }, { ID: "MOD_02", TITLE: "THE WORKSHOP", DESC: "Real-time tracking for materials and inventory.", STATUS: "STABLE" }, { ID: "MOD_03", TITLE: "THE LEDGER", DESC: "Bespoke financial analysis for makers.", STATUS: "BETA" }],
        FLIGHT_PLAN: "THE PLAN", FAQ: "SYSTEM INQUIRIES"
      },
      ROADMAP: { PHASE_1_TITLE: "Phase 1: The Engine", PHASE_1_DESC: "Deploying core Workshop modules.", PHASE_2_TITLE: "Phase 2: Neural Network", PHASE_2_DESC: "Expanding into AI-driven forecasting." }
    }
  },

  PUBLIC_LOGS: { SUBHEAD: "GLOBAL TRANSMISSIONS", TITLE: "PUBLIC AUDIO LOGS", DESC: "Unfiltered transmissions, raw strategy, and architectural updates from the build." },
  
  ACCESS_HOOK: { FIELDS: { NAME: "What's your name?", EMAIL: "Email Address", PHONE: "Phone Number (Optional)", }, BTN_SUBMIT: "REQUEST CLEARANCE", SUCCESS_MSG: "ACCESS GRANTED. WELCOME TO THE BUILD.", AUTO_SIGNUP: "HEY, YOU WEREN'T ON THE LIST YET—BUT I SIGNED YOU UP. WELCOME IN." },
  
  JOIN_PAGE: { 
    SUCCESS_MSG: "YOU'RE ON THE LIST. STAY TUNED.", 
    HYPE: { 
      PODCAST_TITLE: "THE ARCHITECT'S PODCAST", 
      PODCAST_DESC: "Listen to the development journey.", 
      AUDIO_PLAYER: { PREFIX: "EPISODE •", STREAMING: "STREAMING...", ENCRYPTED: "ENCRYPTED" }, 
      REALITY_CHECK: { TITLE: "THE REALITY CHECK", TEXT: "You started this to create, not to be an accountant." }, 
      FAQ: [{ q: "When does the Beta start?", a: "Rollouts begin late Q1 2026." }, { q: "Is it free?", a: "Beta testers get free access for feedback." }] 
    } 
  },

  DASHBOARD: { 
    COMMON: { BRAND_VERSION: "Alt OS v1.0", STATUS_ONLINE: "SYSTEM ONLINE", ACTION_REVIEW: "REVIEW" }, 
    SIDEBAR: { GROUPS: { COMMAND: "Command", OPERATIONS: "Operations", STUDIO: "Studio", SYSTEM: "System" }, OVERVIEW: "Overview", WAITLIST: "Beta Command", TASKS: "Strategic Planner", BROADCAST: "Broadcast Hub", AGENTS: "AI Agents", CONFIG: "Config", EXIT: "← Exit to Public Site" }, 
    WAITLIST: { TITLE: "Beta Command", LEAD_COUNT: "Total Scanned", ROW_ACTIONS: { INVITE: "Send Invite", QUARANTINE: "Quarantine User" } }, 
    PROJECT_BOARD: { NOT_FOUND: "PROJECT MISSING", ADD_TASK: "NEW TASK", COLUMNS: { TODO: "TODO", IN_PROGRESS: "BUILDING", REVIEW: "TESTING", DONE: "SHIPPED" } }, 
    OVERVIEW: { 
      TITLE: "SYSTEM COMMAND", 
      DIRECTIVE: { TITLE: "THE DAILY DIRECTIVE", SUBTITLE: "HEAVY LIFTING ONLY", EMPTY: "ALL SYSTEMS CLEAR. AWAITING COMMAND.", TYPES: { LEAD: "NEW INQUquiry", TASK: "ACTIVE DEV TASK" }, ACTIONS: { PROCESS: "PROCESS", EXECUTE: "EXECUTE" } }, 
      LIVE_FEED: { TITLE: "NETWORK PULSE", NEW_BETA: "WAITING_FOR_PULSE..." }, 
      INFRASTRUCTURE: { TITLE: "TECH STACK OVERWATCH", SUBTITLE: "LIVE SERVICE STATUS", PLATFORMS: { GITHUB: "GITHUB (CODE)", VERCEL: "VERCEL (DEPLOY)", SUPABASE: "SUPABASE (DATA)" } }, 
      PANELS: { ACTION_REQD: "PRIORITY ACTION QUEUE", ENGINEERING: "INTERNAL ENGINEERING" }, 
      TELEMETRY: { TITLE: "NETWORK TELEMETRY", CHART_LABEL: "REQUEST VOLUME", METRICS: { TRAFFIC: "LIVE TRAFFIC", CONVERSION: "CONVERSION" } } 
    }, 
    MEDIA_HUB: { TITLE: "BROADCAST Hub", SUBTITLE: "GLOBAL COMMS", TABS: { AUDIO: "Audio Logs", SOCIAL: "Social", CAMPAIGNS: "Campaigns" }, STUDIO: { TITLE: "STUDIO COMMAND", NO_NOTES: "No transmissions detected.", BTN_PUBLISH: "AUTHORIZE" } }, 
    STRATEGIC_PLANNER: { 
      BTN_ADD: "LOG DIRECTIVE", 
      ACTIONS: { AUDIO: "RECORD AUDIO", AUTHORIZE: "AUTHORIZE BUILD" }, 
      MODAL: { TARGET_LABEL: "Deployment Target", TARGET_LEDGER: "IDEAS LEDGER", TARGET_FLOW: "ACTIVE FLOW", DATE_LABEL: "Execution Date", TITLE_LABEL: "Directive Title", TITLE_PLACEHOLDER: "ENTER DIRECTIVE...", CLASS_LABEL: "Classification", INTENSITY_LABEL: "Intensity", PHASES_LABEL: "Strategic Phases", PHASE_ADD: "ADD PHASE", PHASE_PLACEHOLDER: "PHASE 01...", STATUS_SUBMITTING: "AUTHORIZING...", TYPES: { FEATURE: "FEATURE", INFRA: "INFRASTRUCTURE", BUG: "SYSTEM FIX" }, PRIORITIES: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", CRITICAL: "CRITICAL" } } 
    } 
  },

  SUPPORT_MODULE: { TITLE: "FUEL THE ENGINE", DESC: "I build independent software without VC funding. Your support goes directly into server costs.", STRIPE_LINK: "https://buy.stripe.com/test_placeholder", BTN_TEXT: "CONTRIBUTE" },
  FOUNDING_MEMBER: { TITLE: "BECOME A FOUNDING MEMBER", DESC: "This is an early-access beta. Secure your spot at the legacy rate forever.", FUTURE_PRICE: "$49.00", FUTURE_LABEL: "V1.0 PUBLIC RELEASE", MIN_WARNING: "Minimum contribution is $5.00/month.", STRIPE_LINK: "YOUR_LIVE_STRIPE_LINK_HERE", BTN_TEXT: "SECURE MY SPOT", LOCKED_LABEL: "LOCKED LEGACY RATE", BILLING_CYCLE: "RECURRING MONTHLY", SUCCESS: { TITLE: "ACCESS GRANTED.", DESC: "Welcome to the engine.", BTN_ENTER: "INITIALIZE STUDIO", STUDIO_URL: "https://studio.alternativesolutions.com" } }
};

export interface StrategicGoal { id: string; label: string; color: string; description: string; }
export const STRATEGIC_GOALS: Record<string, StrategicGoal> = { 
  WEBSITE: { id: 'goal_website', label: 'Alternative Solutions Brand', color: '#00D1FF', description: 'The digital face.' }, 
  COMMAND_CENTER: { id: 'goal_command', label: 'Lead Architect Dashboard', color: '#7000FF', description: 'Internal engine.' }, 
  SHIFT_STUDIO: { id: 'goal_shift', label: 'Shift Studio (Beta)', color: '#FF007A', description: 'Command center.' } 
};

export interface Directive { id: number; goalId: string; title: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'completed'; classification: string; }