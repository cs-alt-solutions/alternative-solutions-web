/* src/utils/glossary.ts */
import { MARKETING_COPY } from '../config/marketing';
import { DASHBOARD_COPY } from '../config/dashboard';

// 1. Import your modular client configs for the Sandbox Portal
import { divisionConfig } from '../config/clients/division';
import { luckystrikeConfig } from '../config/clients/luckystrike';

export * from '../config/system';
export * from '../config/sandbox';

// Reassemble the object so existing components don't break
export const WEBSITE_COPY = {
  ...MARKETING_COPY,
  DASHBOARD: DASHBOARD_COPY
};

// 2. Export the master Sandbox Client registry
export const SANDBOX_CLIENTS = {
  division: divisionConfig,
  luckystrike: luckystrikeConfig,
};