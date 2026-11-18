/* src/config/dashboard/overview.ts */

export type StorefrontBucket = 'LIVE' | 'HOLDING' | 'WORKSHOP' | 'PROTOTYPE' | 'IGNORED';

/**
 * SINGLE SOURCE OF TRUTH: Classifies any storefront row into its exact operational bucket.
 * - WORKSHOP = Ball is in YOUR court (Work Queue, Core Architecture, Content Assembly)
 * - HOLDING  = Ball is in CLIENT'S court (Onboarding, Awaiting Payment, Client Review, Awaiting Assets, On Hold)
 * - LIVE     = Live Production Grid
 */
export function classifyStorefront(store: any): StorefrontBucket {
  if (!store) return 'IGNORED';
  const rawStatus = (store.status || 'PENDING_BUILD').toUpperCase().trim();

  // 1. Prototypes / Templates always go to The Lab
  if (store.is_template === true || rawStatus === 'PROTOTYPE') {
    return 'PROTOTYPE';
  }

  // 2. Unapproved applications, canceled, or hidden/archived rows are ignored from active counts
  if (['PENDING', 'CANCELED', 'HIDDEN', 'MAINTENANCE'].includes(rawStatus)) {
    return 'IGNORED';
  }

  // 3. Live Production Grid (Real, live websites)
  if (['ACTIVE', 'LIVE'].includes(rawStatus)) {
    return 'LIVE';
  }

  // 4. Awaiting Client Action (Ball is in the client's court — never blocks your 5 build slots!)
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

  // 5. The Active Workshop (Ball is in YOUR court: PENDING_BUILD, BUILDING_CORE, CONTENT_ASSEMBLY)
  return 'WORKSHOP';
}

export const OVERVIEW_COPY = {
  TELEMETRY: {
    RADAR_TITLE: 'Application Radar',
    RADAR_SUBTITLE: 'Pending Leads',
    ACTION_REQUIRED: 'Action Required',
    AWAITING_REVIEW: '0 Awaiting Review',
    ONBOARDING_SUFFIX: 'Onboarding',
    CAPACITY_TITLE: 'Active Capacity',
    IN_PROGRESS: 'In Your Court',
    SLOTS_OPEN: 'Slots Open',
    HOLDING_SUFFIX: 'Awaiting Client',
    LAB_TITLE: 'The Lab',
    LAB_SUBTITLE: 'Models & Demos',
    PUBLIC_SHOWCASE_SUFFIX: 'Public Showcase',
    MRR_TITLE: 'Net MRR',
    PER_MONTH: '/mo',
    LIVE_SUFFIX: 'Live',
    NET_PREFIX: 'Net:',
    PROMO_PREFIX: 'Promo:',
    GROSS_PREFIX: 'Gross:'
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