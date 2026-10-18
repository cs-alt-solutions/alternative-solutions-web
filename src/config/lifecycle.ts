/* src/config/lifecycle.ts */

export type StorefrontStatus = 
  | 'AWAITING_PAYMENT' 
  | 'PENDING_BUILD' 
  | 'BUILDING_CORE' 
  | 'IN_REVIEW' 
  | 'CONTENT_ASSEMBLY' 
  | 'AWAITING_ASSETS'
  | 'ON_HOLD'
  | 'ACTIVE' 
  | 'MAINTENANCE' 
  | 'HIDDEN' 
  | 'CANCELED';

export interface LifecycleConfig {
  label: string;
  badgeColor: string;
  isPubliclyVisible: boolean;
  isCanvasLocked: boolean;
  allowedNextStates: StorefrontStatus[];
  description: string;
}

export const STOREFRONT_LIFECYCLE: Record<StorefrontStatus, LifecycleConfig> = {
  'AWAITING_PAYMENT': {
    label: 'Awaiting Payment',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['PENDING_BUILD', 'CANCELED'],
    description: 'Application approved. Awaiting $5 Stripe checkout completion.'
  },
  'PENDING_BUILD': {
    label: 'Work Queue',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['BUILDING_CORE', 'CANCELED'],
    description: 'Payment cleared. Project is officially in the queue.'
  },
  'BUILDING_CORE': {
    label: 'Core Architecture',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: false, 
    allowedNextStates: ['IN_REVIEW', 'CANCELED'],
    description: 'Constructing layout, colors, typography, and routing.'
  },
  'IN_REVIEW': {
    label: 'Client Review',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: true,    
    allowedNextStates: ['BUILDING_CORE', 'CONTENT_ASSEMBLY', 'CANCELED'], 
    description: 'Staging link transmitted. Canvas locked pending architectural sign-off.'
  },
  'CONTENT_ASSEMBLY': {
    label: 'Content Assembly',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: false,
    allowedNextStates: ['ACTIVE', 'CANCELED', 'AWAITING_ASSETS'],
    description: 'Architecture locked. Uploading Drop Vault assets and formatting copy.'
  },
  'AWAITING_ASSETS': {
    label: 'Awaiting Assets',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: false,
    allowedNextStates: ['ACTIVE', 'CONTENT_ASSEMBLY', 'CANCELED'],
    description: 'Site is active but waiting on client to upload final media or text.'
  },
  'ON_HOLD': {
    label: 'On Hold',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['BUILDING_CORE', 'CANCELED'],
    description: 'Project frozen or paused.'
  },
  'ACTIVE': {
    label: 'Live Production',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['MAINTENANCE', 'HIDDEN', 'CANCELED'],
    description: 'Site fully populated and live. Recurring revenue pipeline active.'
  },
  'MAINTENANCE': {
    label: 'Maintenance Mode',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    isPubliclyVisible: false, 
    isCanvasLocked: false,    
    allowedNextStates: ['ACTIVE', 'HIDDEN', 'CANCELED'],
    description: 'Temporarily offline for scheduled upgrades or massive structural edits.'
  },
  'HIDDEN': {
    label: 'Hidden',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['ACTIVE', 'MAINTENANCE', 'CANCELED'],
    description: 'Active subscription, but temporarily removed from public directories.'
  },
  'CANCELED': {
    label: 'Canceled',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['PENDING_BUILD'], 
    description: 'Project terminated or archived.'
  }
};