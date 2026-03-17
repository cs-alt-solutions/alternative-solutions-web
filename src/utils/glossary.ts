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
    BETA_CENTER: "THE LAB",
  },
  
  GLOBAL_FOOTER: {
    LEGAL_ENTITY: "Alternative Solutions I/O LLC. All rights reserved.",
    TAGLINE: "Built by Humans.",
    CTA: {
      TITLE: "CHOOSE YOUR PATH.",
      DESC: "The foundation is being poured. Enter the lab to claim your founder's seat, become a monthly backer, or fuel the engine.",
      BTN_TEXT: "ENTER THE LAB",
      LINK: "/blueprint"
    }
  },

  PUBLIC_SITE: {
    HOME: {
      HERO: {
        TAG: "SYSTEM INITIALIZATION",
        TITLE_1: "BUILDING THE",
        TITLE_2: "FOUNDATION.",
        SUBHEAD: "I don't do cookie-cutter templates. I architect custom, high-performance ecosystems driven by AI and built for scale.",
        CTA_PRIMARY: "Claim Your Seat",
        CTA_PRIMARY_LINK: "/blueprint",
        CTA_SECONDARY: "Explore the Ecosystem",
        CTA_SECONDARY_LINK: "/products"
      },
      AUTHORITY_BANNER: {
        TEXT: "BUILT ON ENTERPRISE-GRADE INFRASTRUCTURE",
        STACK: [
          { name: "NEXT.JS", desc: "The engine. Makes the whole ecosystem load lightning fast." },
          { name: "SUPABASE", desc: "The vault. Where all your data is locked down and secured." },
          { name: "VERCEL", desc: "The grid. Keeps the system online 24/7 without a hiccup." },
          { name: "STRIPE", desc: "The bank. Enterprise-grade checkout so you get paid safely." },
          { name: "GITHUB", desc: "The blueprint room. Where every line of code history is stored." },
          { name: "VS CODE", desc: "The workbench. Where the actual architecture is written." }
        ]
      },
      PROBLEM_STATEMENT: {
        TAG: "THE REALITY CHECK",
        TITLE: "You are running a business on duct tape.",
        DESC: "Paying for 8 different apps that don't talk to each other isn't an ecosystem. It's a headache. I build unified engines that actually share the same brain."
      },
      METHODOLOGY: {
        TAG: "THE PROCESS",
        TITLE: "HOW THE ENGINE IS BUILT.",
        STEPS: [
          { title: "1. The Audit", desc: "I map out every piece of duct tape holding your current workflow together to find the friction." },
          { title: "2. The Wiring", desc: "I architect a custom, unified system using enterprise-grade code and AI automation." },
          { title: "3. The Deployment", desc: "You get the keys to a single, intelligent command center that runs your entire operation." }
        ]
      },
      FLAGSHIP: {
        TAG: "FOR THE SMALL BUSINESS",
        TITLE: "MEET SHIFT STUDIO",
        DESC: "You are a small business or a solo powerhouse making things work from home, not a corporate warehouse backed by millions. Stop guessing your profit margins and connect your raw materials, daily builds, and finances into one intelligent command center.",
        CTA: "Explore Shift Studio",
        LINK: "/products/shift-studio"
      },
      BENTO: {
        PRODUCT: { TAG: "THE ECOSYSTEM", TITLE: "ALL SYSTEMS. ONE BRAIN.", DESC: "Explore the full suite of hybrid frameworks built to run your business without the friction.", CTA: "See the Network", LINK: "/products" },
        STORY: { TAG: "THE ARCHITECT", TITLE: "BUILT DIFFERENT.", DESC: "No corporate boxes. No fragile workarounds. Just a relentlessly strong foundation built by a neurodivergent mind.", CTA: "View Telemetry", LINK: "/founder" },
        BETA: { TAG: "CO-OP MODE", TITLE: "JOIN THE BUILD", DESC: "I am building the tools I actually want to use. Grab a spot on the waitlist and help me shape the ecosystem.", CTA: "Apply for Access", LINK: "/blueprint" },
        TECH: { TAG: "INTERNAL WIRING", TITLE: "AI AS A PARTNER", DESC: "I don't sell generic AI wrappers. I use AI internally as a relentless coding partner to architect bulletproof systems faster.", CTA: "" }
      },
      LAUNCH_TELEMETRY: {
        COUNTDOWN_LABEL: "BETA ACCESS INITIALIZING IN",
        COUNTDOWN_TARGET: "2026-04-01T00:00:00",
        SPOTS_LABEL: "EXCLUSIVE FUNDING SLOTS REMAINING",
        SPOTS_REMAINING: 19, 
        SPOTS_TOTAL: 20,
        CTA_URGENCY: "Secure your legacy rate before the grid closes."
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
      HEADER: { 
        TAG: "THE LAB • ARCHITECT PROTOCOL", 
        TITLE_1: "ENTER THE", 
        TITLE_2: "LABORATORY.", 
        DESC: "Alternative Solutions isn't just a single app—it's an active workshop. I am building an entire ecosystem of different tools and resources designed specifically for small businesses and the 'small humans' starting from nothing. Our first flagship build is Shift Studio. Welcome to the drafting table." 
      },
      THE_PLEDGE: {
        TITLE_1: "100% Independent.",
        TITLE_2: "100% Yours.",
        DESC: "I started Alternative Solutions I/O LLC to escape the standard corporate tech trap. I don't have VC investors or millions in the bank. I am literally building this from my rental house, starting from nothing. When you secure a seat, you aren't just buying one piece of software. You are funding my ability to continuously build and release a whole suite of alternative tools for everyday humans fighting to build their own futures."
      },
      REWARDS: {
        TITLE: "The Perks",
        RANKS: [
          { title: "Founding Architect", desc: "Lock in the $5/mo V1.0 legacy rate for life. You were here when it was just a blueprint." },
          { title: "Lab Partner", desc: "You get a direct line to the drafting table. Vote on features, test early builds, and tell me exactly what's broken." },
          { title: "Apex Contributor", desc: "Immortalize your support. Your name or alias is permanently hardcoded into the 'Built By' page of the final platform." }
        ]
      },
      FUNDING_PATHS: {
        TITLE: "CHOOSE YOUR PATH",
        SUBTITLE: "Three ways to help build the foundation.",
        PATH_1: {
          TAG: "V1 BETA ACCESS",
          TITLE: "THE BUILDER",
          PRICE: "$5.00",
          PERIOD: "/ month",
          DESC: "You need the tools. Lock in the legacy rate for our first release (Shift Studio), get beta access as it drops, and secure your spot for everything else I build next.",
          BTN_TEXT: "SECURE MY SEAT"
        },
        PATH_2: {
          TAG: "MONTHLY SUPPORT",
          TITLE: "THE BACKER",
          PRICE: "Custom",
          PERIOD: "/ month",
          DESC: "You believe in independent software. Set your own monthly amount to help cover development time. You'll be added to the Foundation Roster, and you can cancel anytime with one click.",
          BTN_TEXT: "BECOME A BACKER",
          LINK: "https://support.alternativesolutions.io/b/dRm5kD4PF8em2sRgQd97G03" 
        },
        PATH_3: {
          TAG: "ONE-TIME TIP",
          TITLE: "THE BOOST",
          PRICE: "Custom",
          PERIOD: "one-time",
          DESC: "You just want to throw some fuel in the tank today. A one-time tip to keep the coffee flowing and the code compiling.",
          BTN_TEXT: "SEND A BOOST",
          LINK: "https://support.alternativesolutions.io/b/00wdR981ReCK4AZ2Zn97G00"
        }
      },
      ROSTER: {
        TAG: "LIVE TELEMETRY",
        TITLE: "THE FOUNDATION ROSTER",
        DESC: "To the early adopters keeping the lights on and the code compiling: thank you. You are building this foundation with me. (Contributors can choose to remain anonymous).",
        EMPTY_STATE: "The grid is waiting. Be the first to initialize the foundation."
      },
      FOOTER: { TITLE: "Ready to join the foundation?", CTA: "Secure Your Architect Seat" }
    },

    SHIFT_STUDIO_PAGE: {
      PRODUCT_NAME: "SHIFT STUDIO",
      STATUS: "CURRENTLY BUILDING • SECTOR 01",
      HERO: {
        TITLE: "BUILT FOR THE SMALL BUSINESS & SOLO MAKER.",
        SUBHEAD: "You are a small business or a solo powerhouse making things work from home, not a corporate warehouse backed by millions. Stop guessing your profit margins and connect your raw materials, daily builds, and finances into one intelligent command center.",
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
    SIDEBAR: { GROUPS: { COMMAND: "Command", OPERATIONS: "Operations", STUDIO: "Studio", SYSTEM: "System" }, OVERVIEW: "Overview", FOUNDATION: "Foundation Command", TASKS: "Strategic Planner", BROADCAST: "Broadcast Hub", AGENTS: "AI Agents", CONFIG: "Config", EXIT: "← Exit to Public Site" }, 
    FOUNDATION: { 
      TITLE: "Foundation Command", 
      STATS_TITLE: "LIVE REVENUE METRICS",
      ROSTER_TITLE: "THE FOUNDATION ROSTER",
      COLUMNS: { NAME: "Name", CONTACT: "Contact", TIER: "Support Tier", STATUS: "Status", AMOUNT: "Amount", ACTIONS: "Actions" },
      ROW_ACTIONS: { INVITE: "Grant Beta Access", UPGRADE: "Upgrade Tier", QUARANTINE: "Remove User" } 
    },
    PROJECT_BOARD: { NOT_FOUND: "PROJECT MISSING", ADD_TASK: "NEW TASK", COLUMNS: { TODO: "TODO", IN_PROGRESS: "BUILDING", REVIEW: "TESTING", DONE: "SHIPPED" } }, 
    OVERVIEW: { 
      TITLE: "SYSTEM COMMAND", 
      DIRECTIVE: { TITLE: "THE DAILY DIRECTIVE", SUBTITLE: "HEAVY LIFTING ONLY", EMPTY: "ALL SYSTEMS CLEAR. AWAITING COMMAND.", TYPES: { LEAD: "NEW INQUIRY", TASK: "ACTIVE DEV TASK" }, ACTIONS: { PROCESS: "PROCESS", EXECUTE: "EXECUTE" } }, 
      LIVE_FEED: { TITLE: "NETWORK PULSE", NEW_BETA: "WAITING_FOR_PULSE..." }, 
      INFRASTRUCTURE: { TITLE: "TECH STACK OVERWATCH", SUBTITLE: "LIVE SERVICE STATUS", PLATFORMS: { GITHUB: "GITHUB (CODE)", VERCEL: "VERCEL (DEPLOY)", SUPABASE: "SUPABASE (DATA)" } }, 
      PANELS: { ACTION_REQD: "PRIORITY ACTION QUEUE", ENGINEERING: "INTERNAL ENGINEERING" }, 
      TELEMETRY: { TITLE: "NETWORK TELEMETRY", CHART_LABEL: "REQUEST VOLUME", METRICS: { TRAFFIC: "LIVE TRAFFIC", CONVERSION: "CONVERSION" } } 
    }, 
    MEDIA_HUB: { 
      TITLE: "BROADCAST Hub", 
      SUBTITLE: "GLOBAL COMMS", 
      TABS: { AUDIO: "Audio Logs", SOCIAL: "Social", CAMPAIGNS: "Campaigns" }, 
      STUDIO: { TITLE: "STUDIO COMMAND", NO_NOTES: "No transmissions detected.", BTN_PUBLISH: "AUTHORIZE" },
      CAMPAIGNS: {
        TITLE: "COMPOSE DISPATCH",
        AUDIENCE_LABEL: "TARGET ROSTER:",
        AUDIENCES: {
          ALL: "Entire Roster",
          FOUNDERS: "Founding Architects",
          OBSERVERS: "Waitlist / Observers"
        },
        EDITOR_TABS: { WRITE: "WRITE (MD)", PREVIEW: "PREVIEW" },
        AI_ASSIST: "SPARK AI: DRAFT RELEASE NOTES",
        PLACEHOLDERS: {
          SUBJECT: "Transmission Subject...",
          BODY: "Draft your transmission here. Markdown is supported..."
        },
        ACTIONS: {
          SCHEDULE: "SCHEDULE",
          SEND: "SEND TRANSMISSION"
        },
        SIDEBAR: {
          STATS_TITLE: "ACTIVE ROSTER",
          STATS_SYNC: "SYSTEM SYNC",
          STATS_DESC: "Connect Resend or SendGrid API to activate live broadcast capabilities.",
          RECENT_TITLE: "RECENT DISPATCHES",
          EMPTY_RECENT: "No recent transmissions."
        }
      }
    }, 
    STRATEGIC_PLANNER: { 
      BTN_ADD: "LOG DIRECTIVE", 
      ACTIONS: { AUDIO: "RECORD AUDIO", AUTHORIZE: "AUTHORIZE BUILD" }, 
      MODAL: { TARGET_LABEL: "Deployment Target", TARGET_LEDGER: "IDEAS LEDGER", TARGET_FLOW: "ACTIVE FLOW", DATE_LABEL: "Execution Date", TITLE_LABEL: "Directive Title", TITLE_PLACEHOLDER: "ENTER DIRECTIVE...", CLASS_LABEL: "Classification", INTENSITY_LABEL: "Intensity", PHASES_LABEL: "Strategic Phases", PHASE_ADD: "ADD PHASE", PHASE_PLACEHOLDER: "PHASE 01...", STATUS_SUBMITTING: "AUTHORIZING...", TYPES: { FEATURE: "FEATURE", INFRA: "INFRASTRUCTURE", BUG: "SYSTEM FIX" }, PRIORITIES: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", CRITICAL: "CRITICAL" } } 
    } 
  },

  SUPPORT_MODULE: { TITLE: "FUEL THE ENGINE", DESC: "I build independent software without VC funding. Your support goes directly into server costs.", STRIPE_LINK: "https://support.alternativesolutions.io/b/00wdR981ReCK4AZ2Zn97G00", BTN_TEXT: "CONTRIBUTE" },
  FOUNDING_MEMBER: { 
    TITLE: "BECOME A FOUNDING MEMBER", 
    DESC: "This is an early-access beta. Secure your spot at the legacy rate forever.", 
    FUTURE_PRICE: "$49.00", 
    FUTURE_LABEL: "V1.0 PUBLIC RELEASE", 
    MIN_WARNING: "Minimum contribution is $5.00/month.", 
    STRIPE_LINK: "https://support.alternativesolutions.io/b/bJefZh81R1PY7Nb8jH97G02", 
    BTN_TEXT: "SECURE MY SPOT", 
    LOCKED_LABEL: "LOCKED LEGACY RATE", 
    BILLING_CYCLE: "RECURRING MONTHLY", 
    SUCCESS: { 
      TITLE: "ACCESS GRANTED.", 
      DESC: "Welcome to the engine.", 
      BTN_ENTER: "INITIALIZE STUDIO", 
      STUDIO_URL: "https://studio.alternativesolutions.io" 
    },
    DISCLAIMER: {
      TITLE: "BEFORE YOU SUBSCRIBE.",
      DESC: "Alternative Solutions is a one-person lab. Before you lock in your legacy rate, I need to make sure you know exactly what you're getting into:",
      POINTS: [
        "I acknowledge this is a recurring $5/month subscription (and I'm stoked to lock this rate in forever instead of paying $49 later).",
        "I understand the app isn't live yet. I am joining as an 'Early Funder' to fund the final stretch of development and unlock exclusive 'First 20' perks before the beta even drops.",
        "I understand that when the V1 Beta does launch, it will be clunky. I will definitely encounter bugs, missing features, and friction.",
        "I know I am here to help Courtney test and shape the final product, not just consume a finished app."
      ],
      BTN_CANCEL: "NOPE, I'M OUT",
      BTN_CONFIRM: "I'M READY. LET'S BUILD."
    }
  }
};

export interface StrategicGoal { id: string; label: string; color: string; description: string; }
export const STRATEGIC_GOALS: Record<string, StrategicGoal> = { 
  WEBSITE: { id: 'goal_website', label: 'Alternative Solutions Brand', color: '#00D1FF', description: 'The digital face.' }, 
  COMMAND_CENTER: { id: 'goal_command', label: 'Lead Architect Dashboard', color: '#7000FF', description: 'Internal engine.' }, 
  SHIFT_STUDIO: { id: 'goal_shift', label: 'Shift Studio (Beta)', color: '#FF007A', description: 'Command center.' } 
};

export interface Directive { id: number; goalId: string; title: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'completed'; classification: string; }