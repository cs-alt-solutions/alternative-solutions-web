export const HUMAN_MANAGEMENT_COPY = {
  INVITE_MODAL: {
    TITLE: "Authorize New Human",
    DESC: "Grant system access and define clearance levels.",
    FIELDS: { NAME: "Full Name", EMAIL: "Email Address", ROLE: "System Role", WORKSPACE: "Workspace Assignment" },
    ROLES: { OBSERVER: "Observer (View Only)", CLIENT: "Client Owner", STAFF: "Internal Staff", ADMIN: "Super Admin" },
    ACTIONS: { CANCEL: "Abort", SUBMIT: "Send Invitation", SAVING: "Transmitting..." }
  },
  ACCESS_TAB: {
    STATUS_ACTIVE: "Active",
    STATUS_PENDING: "Pending / Invited",
    BTN_RESEND: "Resend Invite",
    BTN_RESENDING: "Transmitting...",
  }
};

export const PROJECT_BOARD_COPY = { 
  NOT_FOUND: "Project Not Found", 
  ADD_TASK: "Add Task", 
  COLUMNS: { TODO: "To Do", IN_PROGRESS: "Doing", REVIEW: "Review", DONE: "Done" } 
};

export const STRATEGIC_PLANNER_COPY = {
  BTN_ADD: "Add Task",
  ACTIONS: { AUDIO: "Record Voice Memo", AUTHORIZE: "Save Task" },
  MODAL: { 
    TARGET_LABEL: "Where does this go?", TARGET_LEDGER: "Idea List", TARGET_FLOW: "Active Sprint", 
    DATE_LABEL: "Due Date", TITLE_LABEL: "What needs to happen?", TITLE_PLACEHOLDER: "Type it out...", 
    CLASS_LABEL: "Category", INTENSITY_LABEL: "Effort", PHASES_LABEL: "Steps", PHASE_ADD: "Add Step", 
    PHASE_PLACEHOLDER: "First step...", STATUS_SUBMITTING: "Saving...", 
    TYPES: { FEATURE: "New Feature", INFRA: "Under the Hood", BUG: "Fix a Bug" }, 
    PRIORITIES: { LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Drop Everything" } 
  }
};

export const SUPPORT_DESK_COPY = {
  HEADER: { TITLE: "Support Desk", SUBTITLE: "Global Triage & Client Requests" },
  TABS: { OPEN: "Needs Action", RESOLVED: "Resolved", CANCELED: "Canceled" },
  ACTIONS: { SYNC: "Sync Queue", RESOLVE: "Resolve", CANCEL: "Trash", SEND: "Send Message", SENDING: "Sending...", RESOLVING: "Mark as Resolved" },
  EMPTY_STATES: { OPEN: "Inbox is zero. No active requests.", RESOLVED: "No resolved tickets yet.", CANCELED: "No canceled tickets in the archive." },
  LABELS: { CLIENT: "Client Request:", RESPONSE: "Your Response:", CANCEL_REASON: "Admin Override / Cancel Reason:" }
};