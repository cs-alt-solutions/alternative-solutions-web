/* src/config/dashboard.ts */

export const DASHBOARD_COPY = {
  COMMON: { BRAND_VERSION: "Alternative Solutions Workspace", STATUS_ONLINE: "All Systems Go", ACTION_REVIEW: "Review" }, 
  SIDEBAR: { 
    GROUPS: { INFRASTRUCTURE: "Settings & Setup", COMMAND: "My Workspace", OPERATIONS: "Life & Logistics", STUDIO: "Apps", SYSTEM: "System" }, 
    OVERVIEW: "Home", 
    FOUNDATION: "The Drafting Table",
    LEDGER: "The Ledger",
    ECOSYSTEM_MANAGER: "My Products",
    BETA_COMMAND: "Members & Access",
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
        BTN_MANAGE: "Manage Project",
        BTN_PROMOTE: "Deploy to Ecosystem" 
      }
    },
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
    COLUMNS: { NAME: "Name", Contact: "Contact", TIER: "Support Level", STATUS: "Status", AMOUNT: "Amount", ACTIONS: "Actions" },
    ROW_ACTIONS: { INVITE: "Give Access", UPGRADE: "Change Level", QUARANTINE: "Remove", TOGGLE_ANON: "Hide Name" }
  },
  
  ECOSYSTEM_MANAGER: {
    TITLE: "My Products",
    SUBTITLE: "Manage everything live on your website.",
    STATUS: "Synced",
    SEARCH_PLACEHOLDER: "Search your products...",
    BTN_NEW_MODULE: "Add New Product",
    COLUMNS: ["Product", "Tagline", "Frontend Placement", "Active Users", "Actions"],
    STATUS_OPTIONS: ["USABLE APPS", "PROTOTYPES", "COMING SOON", "ARCHIVED"],
    BADGES: { PUBLIC: "On Website", INTERNAL: "Internal Only" },
    PANEL: {
      TITLE_NEW: "Add a Product",
      TITLE_EDIT: "Edit Product",
      TABS: { CORE: "Basic Info", MARKETING: "Website Text", DEPLOY: "Publishing" },
      CORE: { FIELD_NAME: "Product Name", FIELD_TAGLINE: "Tagline", FIELD_DESC: "Short Description", FIELD_ICON: "Icon Name" },
      MARKETING: { FIELD_PUBLIC_TITLE: "Headline", FIELD_PUBLIC_DESC: "Full Description", FIELD_FEATURES: "Features (Comma separated)", FIELD_CTA: "Button Text" },
      DEPLOY: { 
        FIELD_STATUS: "Ecosystem Placement",
        TOGGLE_PUBLIC: "Show on Public Website", 
        TOGGLE_DESC: "Turn this on to instantly route this app to the selected tab on your /products page." 
      },
      BTN_SAVE: "Save Product",
      BTN_CANCEL: "Cancel"
    }
  },

  BETA_COMMAND: {
    TITLE: "Members & Access",
    SUBTITLE: "Who has the keys to your apps.",
    STATUS: "Live",
    TABS: { MATRIX: "User List", FEEDBACK: "Feedback", POLLING: "Roadmap Votes", SANDBOXES: "Demo Portals" },
    MATRIX: {
      SEARCH_PLACEHOLDER: "Search by name or email...",
      COLUMNS: ["Person", "Email", "Access Level", "Status"],
      ACCESS_MODULES: ["Shift Studio", "GlitchBot", "API"],
      DETAILS: { REAL_NAME: "Name", CONTACT: "Email", JOINED: "Joined On", PHONE: "Phone", FOUNDER_BADGE: "Founding 20", COHORTS: "Has Access To", ASSIGN_COHORT: "+ Give Access" }
    },
    FEEDBACK: { TITLE: "Feedback & Ideas", FILTER_ALL: "Everything", FILTER_BUGS: "Bugs", FILTER_IDEAS: "Ideas" },
    POLLING: { TITLE: "Community Votes", VOTES_LBL: "Total Votes", ACTIVE_POLLS: "Active Polls", PIPELINE_TITLE: "Suggested by AI", PIPELINE_DESC: "Spark AI grouped similar feedback into these ideas.", BTN_PROMOTE: "Ask the Community", EVIDENCE: "Based on feedback from" },
    SANDBOXES: {
      INFO_TITLE: "Sandbox Access Control",
      INFO_DESC: "Manage client demo environments. Edit agency details, reset access PINs, and define granular module access for individual team members.",
      LBL_ACCESS_CODE: "Access Code",
      LBL_MASTER_PIN: "Master PIN",
      LBL_PRIMARY_CONTACT: "Primary Contact",
      BTN_EDIT: "Edit Details",
      BTN_MANAGE: "Manage Access",
      BTN_PORTAL: "Enter Portal",
      EDIT_MODAL: {
        TITLE: "Edit Sandbox Config",
        AGENCY_NAME: "Agency Name",
        APP_TITLE: "App Title",
        ACCESS_CODE: "Company Code",
        MASTER_PIN: "Master PIN",
        PRIMARY_CONTACT: "Primary Contact",
        BTN_SAVE: "Commit Changes",
        BTN_CANCEL: "Abort"
      }
    }
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
};