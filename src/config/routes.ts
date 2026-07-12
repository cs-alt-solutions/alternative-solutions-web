/* src/config/routes.ts */

export const ROUTES = {
  // 🌍 PUBLIC MARKETING & FRONTEND
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    FOUNDER: '/founder',
    STOREFRONTS: {
      ROOT: '/storefronts',
      APPLY: '/storefronts/apply',
    },
    SECTOR_ZERO: {
      ROOT: '/sector-zero',
      APPLY: '/sector-zero/apply',
    },
    PRODUCTS: {
      ROOT: '/products',
      SHIFT_STUDIO: '/products/shift-studio',
    }
  },

  // 🛡️ COMMAND CENTER (INTERNAL DASHBOARD)
  DASHBOARD: {
    HOME: '/dashboard',
    TASKS: '/dashboard/tasks',
    STOREFRONTS: '/dashboard/storefronts',
    DIRECTORY: '/dashboard/members', 
    LEDGER: '/dashboard/ledger',
    INFRASTRUCTURE: '/dashboard/infrastructure',
    FOUNDATION: '/dashboard/foundation',
    ECOSYSTEM: '/dashboard/ecosystem',
    CLIENTS: '/dashboard/clients',
    BROADCAST: '/dashboard/broadcast',
    BETA_COMMAND: '/dashboard/beta-command',
    SETTINGS: '/dashboard/settings', // <-- Added to fix the TypeScript error
    
    // Dynamic Routes (Pass an ID to generate the URL)
    PROJECT: (id: string) => `/dashboard/project/${id}`,
    CLIENT_HQ: (clientId: string) => `/dashboard/clients/${clientId}`,
    CAMPAIGN: (id: string) => `/dashboard/foundation/campaign/${id}`,
  },

  // 🤝 CLIENT-FACING PORTALS
  PORTAL: {
    // Dynamic Routes (Pass the Client's ID)
    OVERVIEW: (clientId: string) => `/portal/${clientId}`,
    TRANSFER: (clientId: string) => `/portal/${clientId}/transfer`,
    SETTINGS: (clientId: string) => `/portal/${clientId}/settings`,
    PROTOTYPES: (clientId: string) => `/portal/${clientId}/prototypes`,
  },

  // 🧪 LEGACY / SANDBOX ENVIRONMENTS
  SANDBOX: {
    ROOT: (clientId: string) => `/sandbox/${clientId}`,
  }
};