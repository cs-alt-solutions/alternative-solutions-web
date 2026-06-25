export const SHIFT_STUDIO_PAGE = {
  PRODUCT_NAME: "SHIFT STUDIO",
  STATUS: "CURRENTLY BUILDING • SECTOR 01",
  HERO: {
    TITLE: "BUILT FOR THE SMALL BUSINESS & SOLO MAKER.",
    SUBHEAD: "Stop guessing your profit margins and doing data entry on the weekends. Connect your raw materials, daily builds, and finances into one intelligent command center."
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
    ],
    HOUR_TIERS: [
      { label: "1-2 hrs", value: 1.5 },
      { label: "3-5 hrs", value: 4 },
      { label: "5-10 hrs", value: 7.5 },
      { label: "10+ hrs", value: 12 }
    ],
    OUTPUT_LABEL: "NET PROFIT (MONEY BACK IN YOUR POCKET)",
    OUTPUT_SUBTEXT: "*This is what you save by ditching the fragile workarounds and getting your time back."
  },
  MATRIX: {
    TAG: "THE REAL DIFFERENCE",
    TITLE: "How it stacks up.",
    SUBTITLE: "You didn't start a business to become a full-time data entry clerk. Here is how I fix the headache.",
    HEAD_STANDARD: "Disconnected Systems",
    HEAD_SHIFT: "Shift Studio Native",
    SECTIONS: [
      { TITLE: "YOUR DATA", ROWS: [
        { feature: "Inventory Sync", duct: "Copying numbers manually." }, 
        { feature: "Real Profit Tracking", duct: "Figuring profit out once a month and crying." }
      ]},
      { TITLE: "YOUR WORKFLOW", ROWS: [
        { feature: "AI Partnership", duct: "A generic chatbot that doesn't know you." }, 
        { feature: "Daily Tasks", duct: "15 browser tabs and a lost sticky note." }
      ]},
      { TITLE: "YOUR MONEY", ROWS: [
        { feature: "Monthly Bills", duct: "Paying 5 separate companies." }, 
        { feature: "Maintenance Overhead", duct: "Spending your weekend fixing broken Zaps." }
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
        DESC: "Context-switching is the enemy of getting things done. Shift Studio puts everything in one view. Spark AI actually knows your goals, while your daily tasks are natively connected to your active inventory.", 
        FACTS: ["AI partnership with business context", "Tasks connected to active inventory", "No context-switching between tools"] 
      },
      { 
        ID: "money",
        IMAGES: ["/images/shift-ledger.png"],
        CAPTION: "SHIFT STUDIO NATIVE", 
        TITLE: "Consolidate Your Costs.", 
        DESC: "Paying for 5 separate apps and spending hours fixing broken links is burning your cash. Shift Studio gives you one spot for everything. I handle the wiring; you focus on making things.", 
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
};