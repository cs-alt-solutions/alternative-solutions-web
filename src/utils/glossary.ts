/* src/utils/glossary.ts */
import { MARKETING_COPY } from '../config/marketing';
import { DASHBOARD_COPY } from '../config/dashboard';
import { WIZARD_COPY as WIZARD } from '../config/wizard';

export * from '../config/routes';
export * from '../config/system';
export * from '../config/sandbox';
export * from '../config/plans'; // <-- Add this line
export { WIZARD_COPY } from '../config/wizard';

// Reassemble the object so existing components don't break
export const WEBSITE_COPY = {
  ...MARKETING_COPY,
  DASHBOARD: DASHBOARD_COPY,
  WIZARD: WIZARD
};

export const SANDBOX_CLIENTS = {};