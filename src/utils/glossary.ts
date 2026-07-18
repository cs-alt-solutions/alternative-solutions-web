/* src/utils/glossary.ts */
import { MARKETING_COPY } from '../config/marketing';
import { DASHBOARD_COPY } from '../config/dashboard';
import { WIZARD_COPY as WIZARD } from '../config/wizard';

// Export your email copy for the API routes
export { EMAIL_COPY } from '../config/emails';

// Central Registry/Glossary definition
export const GLOSSARY = {
  ERRORS: {
    MISSING_EMAIL: 'Email is required',
  },
  DEFAULT_WORKSPACE_NAME: 'Workspace',
  ROLES: {
    DEFAULT_OPERATOR: 'Operator',
    CLIENT_OWNER: 'Client Owner',
  }
};

export * from '../config/routes';
export * from '../config/system';
export * from '../config/sandbox';
export * from '../config/plans';
export { WIZARD_COPY } from '../config/wizard';

// Reassemble the object so existing components don't break
export const WEBSITE_COPY = {
  ...MARKETING_COPY,
  DASHBOARD: DASHBOARD_COPY,
  WIZARD: WIZARD
};

export const SANDBOX_CLIENTS = {};