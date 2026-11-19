/* src/config/lifecycle.ts */
export type StorefrontStatus =
  | 'ONBOARDING'
  | 'PENDING_BUILD'
  | 'BUILDING_CORE'
  | 'IN_REVIEW'
  | 'CONTENT_ASSEMBLY'
  | 'AWAITING_ASSETS'
  | 'ON_HOLD'
  | 'ACTIVE'
  | 'MAINTENANCE'
  | 'HIDDEN'
  | 'CANCELED'
  | 'PROTOTYPE';

export interface LifecycleConfig {
  label: string;
  badgeColor: string;
  isPubliclyVisible: boolean;
  isCanvasLocked: boolean;
  isPortalUnlocked: boolean;
  court: 'YOUR_COURT' | 'THEIR_COURT' | 'LIVE' | 'OFFLINE';
  allowedNextStates: StorefrontStatus[];
  description: string;
}

export const STOREFRONT_LIFECYCLE: Record<StorefrontStatus, LifecycleConfig> = {
  ONBOARDING: {
    label: 'Onboarding',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'THEIR_COURT',
    allowedNextStates: ['PENDING_BUILD', 'BUILDING_CORE', 'ON_HOLD', 'CANCELED'],
    description: 'Application approved. Client is completing the Brain Dump and activating subscription.',
  },
  PENDING_BUILD: {
    label: 'Work Queue',
    badgeColor: 'bg-zinc-500/15 text-zinc-300 border-zinc-600/40',
    isPubliclyVisible: false,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'YOUR_COURT',
    allowedNextStates: ['BUILDING_CORE', 'AWAITING_ASSETS', 'ON_HOLD', 'CANCELED'],
    description: 'Payment cleared. Project is queued and ready to build.',
  },
  BUILDING_CORE: {
    label: 'Core Architecture',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'YOUR_COURT',
    allowedNextStates: ['IN_REVIEW', 'CONTENT_ASSEMBLY', 'AWAITING_ASSETS', 'ON_HOLD', 'CANCELED'],
    description: 'Constructing layout, colors, typography, and routing.',
  },
  IN_REVIEW: {
    label: 'Client Review',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    isPortalUnlocked: true,
    court: 'THEIR_COURT',
    allowedNextStates: ['BUILDING_CORE', 'CONTENT_ASSEMBLY', 'AWAITING_ASSETS', 'ACTIVE', 'ON_HOLD', 'CANCELED'],
    description: 'Staging link sent. Canvas locked while client verifies architecture.',
  },
  CONTENT_ASSEMBLY: {
    label: 'Content Assembly',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'YOUR_COURT',
    allowedNextStates: ['ACTIVE', 'IN_REVIEW', 'AWAITING_ASSETS', 'ON_HOLD', 'CANCELED'],
    description: 'Uploading Drop Vault assets and formatting copy.',
  },
  AWAITING_ASSETS: {
    label: 'Awaiting Assets',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'THEIR_COURT',
    allowedNextStates: ['BUILDING_CORE', 'CONTENT_ASSEMBLY', 'IN_REVIEW', 'ACTIVE', 'ON_HOLD', 'CANCELED'],
    description: 'Paused while waiting on client to upload photos, menu, or copy.',
  },
  ON_HOLD: {
    label: 'On Hold',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    isPortalUnlocked: true,
    court: 'THEIR_COURT',
    allowedNextStates: ['PENDING_BUILD', 'BUILDING_CORE', 'CONTENT_ASSEMBLY', 'AWAITING_ASSETS', 'ACTIVE', 'CANCELED'],
    description: 'Project paused until client is ready to resume.',
  },
  ACTIVE: {
    label: 'Live Production',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-emerald-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    isPortalUnlocked: true,
    court: 'LIVE',
    allowedNextStates: ['MAINTENANCE', 'HIDDEN', 'BUILDING_CORE', 'CANCELED'],
    description: 'Site live in production. Recurring billing active.',
  },
  MAINTENANCE: {
    label: 'Maintenance Mode',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: false,
    isPortalUnlocked: true,
    court: 'YOUR_COURT',
    allowedNextStates: ['ACTIVE', 'HIDDEN', 'CANCELED'],
    description: 'Temporarily offline for upgrades or major edits.',
  },
  HIDDEN: {
    label: 'Hidden',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    isPortalUnlocked: true,
    court: 'OFFLINE',
    allowedNextStates: ['ACTIVE', 'MAINTENANCE', 'CANCELED'],
    description: 'Active subscription, temporarily unlisted from public directories.',
  },
  CANCELED: {
    label: 'Canceled',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    isPortalUnlocked: false,
    court: 'OFFLINE',
    allowedNextStates: ['PENDING_BUILD'],
    description: 'Project terminated or archived.',
  },
  PROTOTYPE: {
    label: 'Lab Prototype',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: false,
    isPortalUnlocked: false,
    court: 'OFFLINE',
    allowedNextStates: [],
    description: 'Internal sandbox model isolated from client billing.',
  },
};

export function hasPortalAccess(status?: string | null): boolean {
  if (!status) return false;
  if (status === 'LIVE') return true;
  const config = STOREFRONT_LIFECYCLE[status as StorefrontStatus];
  return config ? config.isPortalUnlocked : false;
}