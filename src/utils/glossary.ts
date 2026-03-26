/* src/utils/glossary.ts */
import { MARKETING_COPY } from '../config/marketing';
import { DASHBOARD_COPY } from '../config/dashboard';

export * from '../config/system';
export * from '../config/sandbox';

// Reassemble the object so existing components don't break
export const WEBSITE_COPY = {
  ...MARKETING_COPY,
  DASHBOARD: DASHBOARD_COPY
};