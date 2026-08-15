// src/config/lifecycle.ts

export type StorefrontStatus = 
  | 'PENDING' 
  | 'BUILDING' 
  | 'AWAITING_ASSETS' // 🚀 NEW
  | 'ON_HOLD'         // 🚀 NEW
  | 'IN REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'LIVE' 
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
  'PENDING': {
    label: 'Pending Intake',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['BUILDING', 'CANCELED'],
    description: 'Awaiting architectural approval.'
  },
  'BUILDING': {
    label: 'Building',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: false, 
    allowedNextStates: ['AWAITING_ASSETS', 'ON_HOLD', 'IN REVIEW', 'CANCELED'],
    description: 'In the workshop. Fully editable, hidden from public view.'
  },
  // 🚀 NEW: Waiting on the client
  'AWAITING_ASSETS': {
    label: 'Awaiting Assets',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: false, 
    allowedNextStates: ['BUILDING', 'ON_HOLD', 'CANCELED'],
    description: 'Build paused. Waiting on client to provide logos, copy, or media.'
  },
  // 🚀 NEW: General pause
  'ON_HOLD': {
    label: 'On Hold',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true, 
    allowedNextStates: ['BUILDING', 'CANCELED'],
    description: 'Project frozen. No active development happening.'
  },
  'IN REVIEW': {
    label: 'In Review',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    isPubliclyVisible: true, 
    isCanvasLocked: true,    
    allowedNextStates: ['BUILDING', 'APPROVED', 'CANCELED'], 
    description: 'Staging link transmitted. Canvas locked during client review.'
  },
  'APPROVED': {
    label: 'Approved',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['ACTIVE', 'LIVE', 'CANCELED'],
    description: 'Client approved the build. Ready for billing handshake.'
  },
  'ACTIVE': {
    label: 'Active',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-emerald-500/30',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['LIVE', 'MAINTENANCE', 'HIDDEN', 'CANCELED'],
    description: 'Subscription activated. Payment verified.'
  },
  'LIVE': {
    label: 'Live',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['MAINTENANCE', 'HIDDEN', 'CANCELED'], 
    description: 'Production active. Recurring revenue pipeline established.'
  },
  'MAINTENANCE': {
    label: 'Maintenance Mode',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    isPubliclyVisible: false, 
    isCanvasLocked: false,    
    allowedNextStates: ['ACTIVE', 'LIVE', 'HIDDEN', 'CANCELED'],
    description: 'Temporarily offline for scheduled upgrades.'
  },
  'HIDDEN': {
    label: 'Hidden',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['ACTIVE', 'LIVE', 'MAINTENANCE', 'CANCELED'],
    description: 'Active subscription, but temporarily hidden from the public grid.'
  },
  'CANCELED': {
    label: 'Canceled',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['BUILDING'], 
    description: 'Project terminated or archived.'
  }
};