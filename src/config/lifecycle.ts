// src/config/lifecycle.ts

export type StorefrontStatus = 
  | 'PENDING' 
  | 'BUILDING' 
  | 'IN REVIEW' 
  | 'APPROVED' 
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
    isCanvasLocked: false, // ONLY state where the canvas is fully unlocked
    allowedNextStates: ['IN REVIEW', 'CANCELED'],
    description: 'In the workshop. Fully editable, hidden from public view.'
  },
  'IN REVIEW': {
    label: 'In Review',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    isPubliclyVisible: true, 
    isCanvasLocked: true,    
    allowedNextStates: ['BUILDING', 'APPROVED', 'CANCELED'], // Can go back to building if they want changes
    description: 'Staging link transmitted. Canvas locked during client review.'
  },
  'APPROVED': {
    label: 'Approved',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['LIVE', 'CANCELED'],
    description: 'Client approved the build. Ready for billing handshake.'
  },
  'LIVE': {
    label: 'Live',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    isPubliclyVisible: true,
    isCanvasLocked: true,
    allowedNextStates: ['MAINTENANCE', 'HIDDEN', 'CANCELED'], // Now they have access to the post-launch states!
    description: 'Production active. Recurring revenue pipeline established.'
  },
  'MAINTENANCE': {
    label: 'Maintenance Mode',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    isPubliclyVisible: false, // Shows a maintenance screen to the public
    isCanvasLocked: false,    // Unlocks so you can make updates
    allowedNextStates: ['LIVE', 'HIDDEN', 'CANCELED'],
    description: 'Temporarily offline for scheduled upgrades.'
  },
  'HIDDEN': {
    label: 'Hidden',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['LIVE', 'MAINTENANCE', 'CANCELED'],
    description: 'Active subscription, but temporarily hidden from the public grid.'
  },
  'CANCELED': {
    label: 'Canceled',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    isPubliclyVisible: false,
    isCanvasLocked: true,
    allowedNextStates: ['BUILDING'], // In case of accidental cancellation
    description: 'Project terminated or archived.'
  }
};