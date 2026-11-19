/* src/config/dashboard/overview.ts */

export type StorefrontBucket = 'LIVE' | 'HOLDING' | 'WORKSHOP' | 'PROTOTYPE' | 'IGNORED';

export function classifyStorefront(store: any): StorefrontBucket {
  if (!store) return 'IGNORED';
  const rawStatus = (store.status || 'PENDING_BUILD').toUpperCase().trim();

  if (store.is_template === true || rawStatus === 'PROTOTYPE') {
    return 'PROTOTYPE';
  }

  if (['PENDING', 'CANCELED', 'HIDDEN', 'MAINTENANCE'].includes(rawStatus)) {
    return 'IGNORED';
  }

  if (['ACTIVE', 'LIVE'].includes(rawStatus)) {
    return 'LIVE';
  }

  if ([
    'ONBOARDING',
    'AWAITING_PAYMENT',
    'IN_REVIEW',
    'IN REVIEW',
    'AWAITING_ASSETS',
    'ON_HOLD',
    'CHANGES_REQUESTED'
  ].includes(rawStatus)) {
    return 'HOLDING';
  }

  return 'WORKSHOP';
}

export const OVERVIEW_COPY = {
  TELEMETRY: {
    RADAR_TITLE: 'Application Radar',
    RADAR_SUBTITLE: 'Pending Leads',
    ACTION_REQUIRED: 'Action Required',
    AWAITING_REVIEW: '0 Awaiting Review',
    ONBOARDING_SUFFIX: 'Onboarding',
    CAPACITY_TITLE: 'Active Workshop',
    IN_PROGRESS: 'In Your Court',
    SLOTS_OPEN: 'Slots Open',
    HOLDING_TITLE: 'Awaiting Client',
    HOLDING_SUBTITLE: 'In Their Court',
    ASSETS_SUFFIX: 'Assets / Review',
    MRR_TITLE: 'Monthly Revenue',
    COLLECTED_LABEL: 'Collected',
    EXPECTED_PREFIX: 'Expected:',
    UPCOMING_PREFIX: 'Upcoming:',
    LIVE_SUFFIX: 'Live'
  },
  INTAKE: {
    TITLE: 'Pending Applications',
    SUBTITLE: 'Awaiting Authorization',
    QUEUE_SUFFIX: 'IN QUEUE',
    EMPTY_TITLE: 'Pipeline Clear — No Pending Applications',
    UP_NEXT: 'Up Next',
    FAST_TRACK: 'Fast Track',
    APPLIED_TODAY: 'Applied today',
    WAITING_1_DAY: 'Waiting 1 day',
    WAITING_PREFIX: 'Waiting',
    WAITING_SUFFIX: 'days'
  },
  PULSE: {
    PIPELINE_TITLE: 'Storefront Pipeline Mirror',
    OPEN_ENGINE_LINK: 'Storefronts',
    TIER_WORKSHOP: 'Active Workshop',
    TIER_HOLDING: 'Awaiting Client',
    TIER_LIVE: 'Live Production',
    TIER_PROTOTYPES: 'Prototypes',
    LEDGER_TITLE: 'Recent Ledger Activity',
    OPEN_LEDGER_LINK: 'Full Ledger',
    EMPTY_LEDGER: 'No cleared invoices found.',
    PROMO_TAG: 'Promo Applied'
  },
  REQUESTS: {
    TITLE: 'Client Request Radar',
    PENDING_SUFFIX: 'PENDING',
    INBOX_ZERO: 'Inbox Zero — All Clear',
    RECENT_LABEL: 'Recent (<48h)',
    AGING_LABEL: 'Aging (48h+)',
    VAULT_DROPS_LABEL: 'Media Vault Drops',
    BTN_OPEN_DESK: 'Open Support Desk'
  },
  QR: {
    TITLE: 'Quick QR Generator',
    TARGET_LABEL: 'Target Live Storefront',
    TOGGLE_BUILDS_OFF: 'Live Only',
    TOGGLE_BUILDS_ON: '+ Active Builds',
    LOADING_TARGETS: 'Loading live targets...',
    HQ_OPTION: 'Main HQ Site',
    GROUP_LIVE: 'Live Production Websites',
    GROUP_BUILDS: 'In-Progress Client Builds',
    CUSTOM_OPTION: 'Custom Input',
    AWAITING_URL: 'Awaiting URL',
    BTN_GENERATING: 'Generating...',
    BTN_EXPORT: 'Export QR PNG'
  }
};