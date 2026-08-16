/* src/components/portal/core/theme.ts */

export const PORTAL_THEMES = {
  client: {
    badge: 'ACTIVE CLIENT',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    hoverText: 'hover:text-cyan-400',
  },
  beta: {
    badge: 'BETA PARTNER',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    hoverText: 'hover:text-amber-400',
  },
  internal: {
    badge: 'INTERNAL STAFF',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-400',
    border: 'border-fuchsia-500/20',
    hoverText: 'hover:text-fuchsia-400',
  }
} as const;

export type PortalTier = keyof typeof PORTAL_THEMES;

/**
 * Helper function to determine the user's tier based on their clientId
 * and return the exact Tailwind classes for their theme.
 */
export function getPortalTheme(clientId: string) {
  let tier: PortalTier = 'client';
  
  if (clientId === 'luckystrike') tier = 'beta';
  if (clientId === 'division') tier = 'internal'; 
  
  return PORTAL_THEMES[tier];
}