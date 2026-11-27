/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/LayoutCardPrimitives.tsx */
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VISUAL_ARCH_COPY } from '@/config/dashboard/editor';

export const LEGACY_TOKEN_HEX: Record<string, string> = {
  'cyan-500': '#06b6d4',
  'fuchsia-500': '#d946ef',
  'emerald-500': '#10b981',
  'amber-500': '#f59e0b',
  'rose-500': '#f43f5e',
  'indigo-500': '#6366f1',
  'zinc-500': '#71717a',
};

export const toHex = (val?: string, fallback = '#f59e0b') => {
  if (!val) return fallback;
  if (val.startsWith('#')) return val;
  return LEGACY_TOKEN_HEX[val] || fallback;
};

export const normalizeHexBody = (raw: string) =>
  raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();

export const HERO_NAME_MAP: Record<string, string> = {
  center: VISUAL_ARCH_COPY.LAYOUTS.LABELS.CENTERED,
  'split-left': VISUAL_ARCH_COPY.LAYOUTS.LABELS.SPLIT_LEFT,
  'split-right': VISUAL_ARCH_COPY.LAYOUTS.LABELS.SPLIT_RIGHT,
  cinematic: VISUAL_ARCH_COPY.LAYOUTS.LABELS.CINEMATIC,
  glass: VISUAL_ARCH_COPY.LAYOUTS.LABELS.GLASS,
  'editorial-frame': VISUAL_ARCH_COPY.LAYOUTS.LABELS.EDITORIAL_FRAME,
  'arch-spotlight': VISUAL_ARCH_COPY.LAYOUTS.LABELS.ARCH_SPOTLIGHT,
  'bento-hero': VISUAL_ARCH_COPY.LAYOUTS.LABELS.BENTO_HERO,
  'bottom-dock': VISUAL_ARCH_COPY.LAYOUTS.LABELS.BOTTOM_DOCK,
  'top-dock': VISUAL_ARCH_COPY.LAYOUTS.LABELS.TOP_DOCK,
  'minimal-type': VISUAL_ARCH_COPY.LAYOUTS.LABELS.MINIMAL_TYPE,
  masthead: VISUAL_ARCH_COPY.LAYOUTS.LABELS.MASTHEAD,
  'masthead-wash': VISUAL_ARCH_COPY.LAYOUTS.LABELS.MASTHEAD,
};

export function composeMastheadLayout(
  base: 'masthead' | 'masthead-wash',
  font: string,
  color: string
) {
  const cleanFont = font || 'default';
  const cleanColor = color || 'default';
  if (cleanColor !== 'default') return `${base}--${cleanFont}--${cleanColor}`;
  if (cleanFont !== 'default') return `${base}--${cleanFont}`;
  return base;
}

export function LayoutOptionCard({
  active,
  disabled,
  label,
  compact = false,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  compact?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${compact ? 'p-2.5' : 'p-3'} border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
        active ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
      }`}
    >
      {children}
      <span
        className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-bold uppercase tracking-wider text-center ${
          active ? 'text-fuchsia-400' : 'text-zinc-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export function AdvancedToggle({
  isOpen,
  onClick,
  count,
}: {
  isOpen: boolean;
  onClick: () => void;
  count: number;
}) {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-800 rounded-lg text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-fuchsia-400 hover:border-fuchsia-900/50 hover:bg-fuchsia-950/20 transition-all cursor-pointer"
    >
      {isOpen ? (
        <>
          <ChevronUp size={14} /> {VISUAL_ARCH_COPY.LAYOUTS.ADVANCED_HIDE}
        </>
      ) : (
        <>
          <ChevronDown size={14} /> {VISUAL_ARCH_COPY.LAYOUTS.ADVANCED_SHOW} ({count})
        </>
      )}
    </button>
  );
}