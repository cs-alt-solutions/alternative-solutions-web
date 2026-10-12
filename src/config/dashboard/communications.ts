export const ECOSYSTEM_MANAGER_COPY = {
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
    DEPLOY: { FIELD_STATUS: "Ecosystem Placement", TOGGLE_PUBLIC: "Show on Public Website", TOGGLE_DESC: "Turn this on to instantly route this app to the selected tab on your /products page." },
    BTN_SAVE: "Save Product",
    BTN_CANCEL: "Cancel"
  }
};

export const BETA_COMMAND_COPY = {
  TITLE: 'Beta Command',
  SUBTITLE: 'Experimental features and community feedback.',
  STATUS: 'Live System',
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
    EDIT_MODAL: { TITLE: "Edit Sandbox Config", AGENCY_NAME: "Agency Name", APP_TITLE: "App Title", ACCESS_CODE: "Company Code", MASTER_PIN: "Master PIN", PRIMARY_CONTACT: "Primary Contact", BTN_SAVE: "Commit Changes", BTN_CANCEL: "Abort" }
  }
};

export const MEDIA_HUB_COPY = {
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
};