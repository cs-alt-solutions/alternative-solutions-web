export const CLIENT_PORTAL_COPY = {
  WELCOME_TITLE: "Welcome to your Workspace",
  WELCOME_DESC: "This is your dedicated secure command center. Use this portal to securely transfer assets, review active prototypes, and manage your infrastructure with Alternative Solutions.",
  MODULES: {
    MESSAGES_TITLE: "Direct Messages",
    MESSAGES_EMPTY: "No new messages. You're all caught up.",
    TRANSFERS_TITLE: "Secure Transfer",
    TRANSFERS_DESC: "Drop high-res photos, vectors, or documents directly into our development pipeline.",
    PROTOTYPES_TITLE: "Active Prototypes",
    PROTOTYPES_DESC: "View your deployed test environments."
  }
};

export const STOREFRONT_COPY = {
  topShelf: "Top Shelf",
  featured: "Featured",
  promo: "Promo",
  by: "By",
  startingAt: "Starting At",
  options: "Options",
  unnamed: "Unnamed Item"
};

export const STAGING_COPY = {
  TITLE: "Interactive Staging",
  DESC: "Dispatch the interactive review layer to the client for final sign-off.",
  ROUTE_LABEL: "Target Routing",
  STATUS_LABEL: "Current Status",
  MISSING_EMAIL: "Missing Email",
  BTN_DISPATCH: "Dispatch Review Link",
  BTN_DISPATCHING: "Transmitting...",
  BTN_COPY: "Copy Manual Link",
  BTN_COPIED: "Copied to Clipboard",
  LOGS_TITLE: "Transmission Logs",
  LOGS_EMPTY: "No staging history recorded.",
  LOG_SUCCESS_MSG: "Review link successfully sent to",
  AUDIT_TITLE: "Incoming Audits",
  AUDIT_DESC: "Client feedback and structural approvals drop directly into this ledger.",
  AUDIT_EMPTY: "Awaiting client review..."
};

export const STOREFRONT_ENGINE_COPY = {
  HEADER: { TITLE: "Storefront Engine", SUBTITLE: "Manage active client projects and sandbox prototypes." },
  TABS: { CLIENTS: "Active Clients", PROTOTYPES: "Prototypes", ALL: "All" },
  SEARCH_PLACEHOLDER: "Search records...",
  FILTERS: { CATEGORY: "All Categories", PLAN: "All Plans", STATUS: "All Statuses" },
  TABLE: { BUSINESS: "Client / Business", CATEGORY: "Category", PLAN: "Plan Tier", STATUS: "Current Status", TIMELINE: "Timeline", ACTIONS: "System Actions", EMPTY: "No matching records found." }
};

export const STOREFRONT_EDITOR_COPY = {
  INDUSTRIES: [
    { id: 'E-Commerce', label: 'E-Commerce' }, { id: 'Automotive', label: 'Automotive' },
    { id: 'Culinary', label: 'Culinary' }, { id: 'Wellness', label: 'Wellness' },
    { id: 'Creative', label: 'Creative' }, { id: 'Contracting', label: 'Contracting' },
    { id: 'Consulting', label: 'Consulting' }, { id: 'Tech & SaaS', label: 'Tech & SaaS' },
    { id: 'Local Services', label: 'Local Services' }, { id: 'General', label: 'General / Other' }
  ],
  DYNAMIC_TABS: { CULINARY: "Menu Builder", CREATIVE: "Portfolio Engine", CONTRACTING: "Scope & Proof", DEFAULT: "Services" },
  TERMINATION: { CONFIRM_PREFIX: "Are you absolutely sure you want to permanently delete \"", CONFIRM_SUFFIX: "\"? This will obliterate client data and cannot be reversed." },
  SYSTEM_LOCK: { TITLE: "System Locked", STATUS_PREFIX: "STATUS:", BODY: "The architecture is currently secured for client review or active deployment. The Canvas and all Editor configurations are strictly read-only to prevent accidental data contamination.", BTN_OVERRIDE: "Silent Admin Override", BTN_REVERT: "Revert to Building" }
};