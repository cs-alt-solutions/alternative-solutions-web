/* src/components/dashboard/storefronts/editor/core/HeroSizingControls.tsx */
'use client';

import React from 'react';
import { Lock, Unlock, ArrowUpDown, LayoutPanelLeft } from 'lucide-react';

interface HeroSizingControlsProps {
  formData: any;
  setFormData: any;
}

const HEIGHT_OPTIONS = [
  { id: 'default', label: 'Auto' },
  { id: 'compact', label: 'Compact' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'full', label: 'Full' },
] as const;

const PLACEMENT_OPTIONS = [
  { id: 'beside', label: 'Beside Copy' },
  { id: 'masthead', label: 'Top-Left' },
  { id: 'stacked', label: 'Stacked' },
] as const;

export default function HeroSizingControls({ formData, setFormData }: HeroSizingControlsProps) {
  const isHubMode = formData.engine_mode === 'hub' || formData.content_layout === 'hub';
  const isStaticHubHero = formData.hub_hero_static === true;
  const activeHeight = formData.hero_height || 'default';
  const activePlacement = formData.logo_placement || 'beside';
  const hasLogo = typeof formData.brand_logo === 'string' && formData.brand_logo.trim() !== '';

  return (
    <div className="space-y-3 pt-2">
      {/* Hero Height Control */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <ArrowUpDown size={10} className="text-amber-400" />
            Hero Banner Height
          </span>
          <span className="text-[9px] font-mono text-zinc-600">
            {activeHeight === 'compact'
              ? '~55vh'
              : activeHeight === 'balanced'
                ? '~75vh'
                : activeHeight === 'full'
                  ? '100vh'
                  : 'Layout Default'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
          {HEIGHT_OPTIONS.map((opt) => {
            const selected = activeHeight === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData((prev: any) => ({ ...prev, hero_height: opt.id }))}
                className={`py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selected
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo Placement Control (Cardless / Cinematic Lockups) */}
      {hasLogo && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <LayoutPanelLeft size={10} className="text-amber-400" />
            Logo Placement
          </span>

          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
            {PLACEMENT_OPTIONS.map((opt) => {
              const selected = activePlacement === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, logo_placement: opt.id }))}
                  className={`py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selected
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hub Static Hero Lock */}
      {isHubMode && (
        <button
          type="button"
          onClick={() =>
            setFormData((prev: any) => ({ ...prev, hub_hero_static: !prev.hub_hero_static }))
          }
          className={`w-full px-3 py-2 rounded-lg border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
            isStaticHubHero
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isStaticHubHero ? <Lock size={12} className="shrink-0" /> : <Unlock size={12} className="shrink-0" />}
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Keep Main Hero Static
              </span>
              <span className="text-[9px] text-zinc-500 block truncate">
                {isStaticHubHero
                  ? 'Locked to main Core hero photo across all departments'
                  : 'Swaps Hero banner to each department #1 Cover'}
              </span>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
              isStaticHubHero ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500'
            }`}
          >
            {isStaticHubHero ? 'ON' : 'OFF'}
          </span>
        </button>
      )}
    </div>
  );
}