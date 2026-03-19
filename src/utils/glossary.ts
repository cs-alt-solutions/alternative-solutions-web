/* src/utils/glossary.ts */

export const SYSTEM_CONFIG = {
  RATES: {
    LABOR: 50,
    FOUNDER: 5,     
    PUBLIC: 49      
  },
  FEES: {
    PLATFORM_CUT: 0.15 
  },
  // ADD THIS BLOCK: This resolves the TypeScript "Property does not exist" error
  PAYROLL_MATRIX: {
    PERSONAL: 0.50,
    BUSINESS: 0.30,
    VAULT: 0.20
  },
  // NEW: Personal Survival Budget (The 50% breakdown)
  SURVIVAL_BUDGET: {
    RENT: 0.60,      // 60% of your Personal Share
    UTILITIES: 0.20, // 20%
    GROCERIES: 0.15, // 15% (Supplemented by SNAP)
    MISC: 0.05       // 5%
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
        TOGGLES: {
          BASELINE: "Industry Baseline",
          CUSTOM: "Custom Audit"
        },
        BASELINE_INFO: {
          TITLE: "The 'Cost of Doing Business'",
          DESC: "This is the bare minimum you'd spend on the cheapest apps just to keep your business running without doing everything manually on paper. It's what the industry expects you to pay.",
          PROMPT: "Want to see your real numbers? Switch to a Custom Audit to pick the apps you actually use."
        },
        MANUAL_INPUT_LABEL: "Or enter a custom monthly cost:",
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
            { feature: "Inventory Sync", duct: "Copying numbers manually." }, 
            { feature: "Real Profit Tracking", duct: "Figuring profit once a month." }
          ]},
          { TITLE: "YOUR WORKFLOW", ROWS: [
            { feature: "AI Partnership", duct: "Basic help with no context." }, 
            { feature: "Daily Tasks", duct: "Constant switching between apps." }
          ]},
          { TITLE: "YOUR MONEY", ROWS: [
            { feature: "Monthly Bills", duct: "Paying for 5-8 separate apps." }, 
            { feature: "Maintenance Overhead", duct: "Spending hours fixing broken links." }
          ]}
        ]
      },
      EVIDENCE: {
        TAG: "LIVE SYSTEM CAPTURE",
        MODULES: [
          { 
            ID: "data",
            IMAGES: ["/images/shift-inventory.png", "/images/shift-board.png"],
            CAPTION: "SHIFT STUDIO NATIVE", 
            TITLE: "Live Data. No Manual Entry.", 
            DESC: "Stop copying numbers across spreadsheets and figuring out your profit margins at the end of the month. Shift Studio provides native, instant data flow. Your inventory syncs automatically, and your profit updates with every single sale.", 
            FACTS: ["Instant inventory synchronization", "Real-time profit margin updates", "Zero manual data entry required"] 
          },
          { 
            ID: "workflow",
            IMAGES: ["/images/shift-spark.png"],
            CAPTION: "SHIFT STUDIO NATIVE", 
            TITLE: "One Unified Workspace.", 
            DESC: "Constant switching between apps kills momentum. Shift Studio provides everything in one unified view. Spark AI acts as a partner that actually knows your goals, while your daily tasks are natively connected to your inventory.", 
            FACTS: ["AI partnership with business context", "Tasks connected to active inventory", "No context-switching between tools"] 
          },
          { 
            ID: "money",
            IMAGES: ["/images/shift-ledger.png"],
            CAPTION: "SHIFT STUDIO NATIVE", 
            TITLE: "Consolidate Your Costs.", 
            DESC: "Paying for 5-8 separate apps and spending hours fixing broken links is burning your cash. Shift Studio gives you one spot to access everything. I handle the wiring and maintenance; you focus on building your business.", 
            FACTS: ["Replace 5+ subscriptions with one", "Zero maintenance or API wiring", "Bespoke financial ledger included"] 
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
    COMMON: { BRAND_VERSION: "Alternative Solutions Workspace", STATUS_ONLINE: "All Systems Go", ACTION_REVIEW: "Review" }, 
    SIDEBAR: { 
      GROUPS: { INFRASTRUCTURE: "Settings & Setup", COMMAND: "My Workspace", OPERATIONS: "Life & Logistics", STUDIO: "Apps", SYSTEM: "System" }, 
      OVERVIEW: "Home", 
      FOUNDATION: "The Drafting Table",
      LEDGER: "The Ledger",
      ECOSYSTEM_MANAGER: "My Products",
      BETA_COMMAND: "Members & Access",
      TASKS: "To-Do List", 
      BROADCAST: "Emails & Updates", 
      AGENTS: "AI Assistants", 
      CONFIG: "Settings", 
      EXIT: "← Back to Website" 
    }, 
    
    FOUNDATION: { 
      TITLE: "The Drafting Table", 
      SUBTITLE: "Where ideas get funded and built.",
      STATS_TITLE: "Revenue & Support",
      ROSTER_TITLE: "Recent Supporters",
      TABS: { ROSTER: "Backers & Funds", WIDGETS: "Share Links" },
      BUILDS: {
        TAB: "Projects in Progress",
        EMPTY_STATE: "Your drafting table is empty. Time to brainstorm.",
        TYPES: {
          CLIENT: "Client Work",
          SAAS: "My Products"
        },
        CARD: {
          TARGET: "Goal",
          RAISED: "Raised",
          BACKERS: "Supporters",
          BTN_WIDGET: "Get Embed Code",
          BTN_MANAGE: "Manage Project"
        }
      },
      // Add this inside WEBSITE_COPY.DASHBOARD.FOUNDATION
      NEW_BUILD_MODAL: {
        TITLE: "Initialize New Project",
        DESC: "Draft a new idea or client commission to the table.",
        FIELDS: {
          TITLE: "Project Name",
          TYPE: "Project Type",
          CLIENT_NAME: "Client Name (Optional)",
          TARGET: "Funding Target ($)"
        },
        ACTIONS: {
          CANCEL: "Abort",
          SUBMIT: "Deploy to Table",
          SAVING: "Deploying..."
        }
      },
      EXTERNAL_FUEL: {
        TITLE: "External Fuel (Side Income)",
        DESC: "Track off-platform shifts, calculate payroll, and route your funds.",
        STATS: {
          TOTAL: "Cleared Income",
          THIS_MONTH: "This Month"
        },
        BUCKETS: {
          PERSONAL: "Personal Survival",
          BUSINESS: "Business Fuel",
          VAULT: "The Vault (Fun/Rainy Day)"
        },
        TABLE: {
          SOURCE: "Shift Details",
          DATE: "Date",
          PAYMENT_METHOD: "Method",
          AMOUNT: "Gross Pay",
          ROUTING: "Fund Routing"
        },
        BTN_ADD: "Log Shift",
        EMPTY: "No external shifts logged yet."
      },
      CAMPAIGN_DETAIL: {
        BACK_BTN: "Back to Drafting Table",
        TABS: {
          OVERVIEW: "Project Details",
          BACKERS: "Supporter List",
          SETTINGS: "Settings & Links"
        },
        STATS: { RAISED: "Total Raised", TARGET: "Goal", BACKERS: "Total Supporters", AVG_BOOST: "Avg. Contribution" },
        ACTIONS: { COPY_WIDGET: "Copy HTML Code", BROADCAST: "Email Supporters", FINALIZE: "Mark as Funded" },
        LEDGER_COLS: { DATE: "Date", BACKER: "Name", AMOUNT: "Amount", TYPE: "Type" }
      },
      STATS: { MRR: "Monthly Recurring", BUILDERS: "Founders", BACKERS: "Monthly Backers", BOOSTS: "One-Time Tips", FUEL: "Total Raised", OBSERVERS: "Waitlist", CLIENTS: "Active Clients" },
      COLUMNS: { NAME: "Name", CONTACT: "Contact", TIER: "Support Level", STATUS: "Status", AMOUNT: "Amount", ACTIONS: "Actions" },
      ROW_ACTIONS: { INVITE: "Give Access", UPGRADE: "Change Level", QUARANTINE: "Remove", TOGGLE_ANON: "Hide Name" }
    },
    
    ECOSYSTEM_MANAGER: {
      TITLE: "My Products",
      SUBTITLE: "Manage everything live on your website.",
      STATUS: "Synced",
      SEARCH_PLACEHOLDER: "Search your products...",
      BTN_NEW_MODULE: "Add New Product",
      COLUMNS: ["Product", "Tagline", "Status", "Active Users", "Actions"],
      STATUS_OPTIONS: ["LIVE", "BETA", "HIDDEN", "ARCHIVED"],
      BADGES: { PUBLIC: "On Website", INTERNAL: "Internal Only" },
      PANEL: {
        TITLE_NEW: "Add a Product",
        TITLE_EDIT: "Edit Product",
        TABS: { CORE: "Basic Info", MARKETING: "Website Text", DEPLOY: "Publishing" },
        CORE: { FIELD_NAME: "Product Name", FIELD_TAGLINE: "Tagline", FIELD_DESC: "Short Description", FIELD_ICON: "Icon Name" },
        MARKETING: { FIELD_PUBLIC_TITLE: "Headline", FIELD_PUBLIC_DESC: "Full Description", FIELD_FEATURES: "Features (Comma separated)", FIELD_CTA: "Button Text" },
        DEPLOY: { FIELD_STATUS: "Status", TOGGLE_PUBLIC: "Show on Public Website", TOGGLE_DESC: "Turn this on to instantly add this to your /products page." },
        BTN_SAVE: "Save Product",
        BTN_CANCEL: "Cancel"
      }
    },

    BETA_COMMAND: {
      TITLE: "Members & Access",
      SUBTITLE: "Who has the keys to your apps.",
      STATUS: "Live",
      TABS: { MATRIX: "User List", FEEDBACK: "Feedback", POLLING: "Roadmap Votes" },
      MATRIX: {
        SEARCH_PLACEHOLDER: "Search by name or email...",
        COLUMNS: ["Person", "Email", "Access Level", "Status"],
        ACCESS_MODULES: ["Shift Studio", "GlitchBot", "API"],
        DETAILS: { REAL_NAME: "Name", CONTACT: "Email", JOINED: "Joined On", PHONE: "Phone", FOUNDER_BADGE: "Founding 20", COHORTS: "Has Access To", ASSIGN_COHORT: "+ Give Access" }
      },
      FEEDBACK: { TITLE: "Feedback & Ideas", FILTER_ALL: "Everything", FILTER_BUGS: "Bugs", FILTER_IDEAS: "Ideas" },
      POLLING: { TITLE: "Community Votes", VOTES_LBL: "Total Votes", ACTIVE_POLLS: "Active Polls", PIPELINE_TITLE: "Suggested by AI", PIPELINE_DESC: "Spark AI grouped similar feedback into these ideas.", BTN_PROMOTE: "Ask the Community", EVIDENCE: "Based on feedback from" }
    },

    INFRASTRUCTURE_HUB: { TITLE: "Under the Hood", DESC: "Quick links to your hosting, database, and billing.", CATEGORIES: { CORE: "Core Tech", FINANCE: "Money & Billing", CODE: "Codebase" } },
    PROJECT_BOARD: { NOT_FOUND: "Project Not Found", ADD_TASK: "Add Task", COLUMNS: { TODO: "To Do", IN_PROGRESS: "Doing", REVIEW: "Review", DONE: "Done" } }, 
    OVERVIEW: { 
      TITLE: "Home", 
      DIRECTIVE: { TITLE: "Up Next", SUBTITLE: "Your priority tasks", EMPTY: "You're all caught up.", TYPES: { LEAD: "New Message", TASK: "Task" }, ACTIONS: { PROCESS: "View", EXECUTE: "Do It" } }, 
      LIVE_FEED: { TITLE: "Recent Activity", NEW_BETA: "Checking..." }, 
      INFRASTRUCTURE: { TITLE: "Tech Status", SUBTITLE: "Are we online?", PLATFORMS: { GITHUB: "GitHub", VERCEL: "Vercel", SUPABASE: "Supabase" } }, 
      PANELS: { ACTION_REQD: "Needs Attention", ENGINEERING: "Development" }, 
      TELEMETRY: { TITLE: "Traffic & Stats", CHART_LABEL: "Page Views", METRICS: { TRAFFIC: "Current Visitors", CONVERSION: "Signups" } } 
    }, 
    MEDIA_HUB: { 
      TITLE: "Emails & Updates", 
      SUBTITLE: "Talk to your people.", 
      TABS: { AUDIO: "Voice Notes", SOCIAL: "Social", CAMPAIGNS: "Emails" }, 
      STUDIO: { TITLE: "Record a Note", NO_NOTES: "No notes yet.", BTN_PUBLISH: "Publish" },
      CAMPAIGNS: {
        TITLE: "Write an Email",
        AUDIENCE_LABEL: "Send to:",
        AUDIENCES: { ALL: "Everyone", FOUNDERS: "Founders Only", OBSERVERS: "Waitlist Only" },
        EDITOR_TABS: { WRITE: "Write", PREVIEW: "Preview" },
        AI_ASSIST: "Spark AI: Help me write this",
        PLACEHOLDERS: { SUBJECT: "Subject line...", BODY: "Type your message here..." },
        ACTIONS: { SCHEDULE: "Schedule", SEND: "Send Now" },
        SIDEBAR: { STATS_TITLE: "Mailing List", STATS_SYNC: "API Check", STATS_DESC: "Connect your email provider to send live emails.", RECENT_TITLE: "Past Emails", EMPTY_RECENT: "You haven't sent any emails yet." }
      }
    },
    STRATEGIC_PLANNER: { 
      BTN_ADD: "Add Task", 
      ACTIONS: { AUDIO: "Record Voice Memo", AUTHORIZE: "Save Task" }, 
      MODAL: { TARGET_LABEL: "Where does this go?", TARGET_LEDGER: "Idea List", TARGET_FLOW: "Active Sprint", DATE_LABEL: "Due Date", TITLE_LABEL: "What needs to happen?", TITLE_PLACEHOLDER: "Type it out...", CLASS_LABEL: "Category", INTENSITY_LABEL: "Effort", PHASES_LABEL: "Steps", PHASE_ADD: "Add Step", PHASE_PLACEHOLDER: "First step...", STATUS_SUBMITTING: "Saving...", TYPES: { FEATURE: "New Feature", INFRA: "Under the Hood", BUG: "Fix a Bug" }, PRIORITIES: { LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Drop Everything" } } 
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