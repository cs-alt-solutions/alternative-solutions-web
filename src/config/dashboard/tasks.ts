/* src/config/dashboard/tasks.ts */

export const TASK_COPY = {
  HEADER: {
    TITLE: 'Global Task Grid',
    SUBTITLE: 'Cross-client command center and sprint objectives.',
    BTN_NEW: 'New Objective',
    FILTER_ALL_CLIENTS: 'All Clients & Internal',
    INTERNAL_OPTION: 'Alt Solutions (Internal HQ)'
  },
  COLUMNS: {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Completed'
  },
  PRIORITIES: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical'
  },
  BOARD: {
    EMPTY_COLUMN: 'Queue clear.'
  },
  CARD: {
    INTERNAL_BADGE: 'Internal HQ',
    NO_DUE_DATE: 'No Due Date',
    MARK_COMPLETE: 'Toggle Completion Status'
  },
  MODAL: {
    CREATE_TITLE: 'Assign New Objective',
    EDIT_TITLE: 'Update Objective',
    LABEL_TITLE: 'Objective / Task',
    PLACEHOLDER_TITLE: 'Enter custom objective...',
    LABEL_CLIENT: 'Target Client / Storefront',
    INTERNAL_HQ: 'Alt Solutions (Internal HQ)',
    LABEL_DUE: 'Target Due Date',
    LABEL_PRIORITY: 'Priority Level',
    LABEL_STATUS: 'Current Stage',
    LABEL_DESC: 'Notes & Context',
    PLACEHOLDER_DESC: 'Add specific details, links, or blockers...',
    BTN_DELETE: 'Delete Objective',
    CONFIRM_DELETE: 'Permanently delete this objective?',
    BTN_CANCEL: 'Cancel',
    BTN_SAVE: 'Save Objective',
    BTN_SAVING: 'Saving...'
  }
};