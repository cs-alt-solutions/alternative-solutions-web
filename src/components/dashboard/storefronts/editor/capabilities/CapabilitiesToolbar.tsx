/* src/components/dashboard/storefronts/editor/capabilities/CapabilitiesToolbar.tsx */
'use client';

import React from 'react';
import { Plus, Briefcase, Utensils, Sparkles } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY, IndustryBlueprint } from '@/config/dashboard/editor';

interface CapabilitiesToolbarProps {
  isHub: boolean;
  isCulinary: boolean;
  effectiveSubTab: 'primary' | 'addons';
  packagesCount: number;
  addonsCount: number;
  blueprint: IndustryBlueprint;
  onSelectSubTab: (tab: 'primary' | 'addons') => void;
  onAddPrimary: () => void;
  onAddAddon: () => void;
}

export default function CapabilitiesToolbar({
  isHub,
  isCulinary,
  effectiveSubTab,
  packagesCount,
  addonsCount,
  blueprint,
  onSelectSubTab,
  onAddPrimary,
  onAddAddon,
}: CapabilitiesToolbarProps) {
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;

  if (isHub) {
    return (
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 px-1">
          <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
            {blueprint.primaryToggleLabel}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
            {packagesCount}
          </span>
        </div>

        <button
          type="button"
          onClick={onAddPrimary}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer px-3 py-1.5 rounded-lg border shrink-0 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20"
          title={blueprint.addPrimaryBtn}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{copy.DIRECTORY.ADD_BTN}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg flex-1 min-w-0">
        <button
          type="button"
          onClick={() => onSelectSubTab('primary')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
            effectiveSubTab === 'primary'
              ? isCulinary
                ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          {isCulinary ? <Utensils className="w-3 h-3 shrink-0" /> : <Briefcase className="w-3 h-3 shrink-0" />}
          <span className="truncate">{blueprint.primaryToggleLabel}</span>
          <span className="font-mono text-[9px] opacity-75">({packagesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubTab('addons')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
            effectiveSubTab === 'addons'
              ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
              : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate">{blueprint.addonsToggleLabel}</span>
          <span className="font-mono text-[9px] opacity-75">({addonsCount})</span>
        </button>
      </div>

      <button
        type="button"
        onClick={effectiveSubTab === 'primary' ? onAddPrimary : onAddAddon}
        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer px-2.5 py-2 rounded-lg border shrink-0 ${
          effectiveSubTab === 'addons' || isCulinary
            ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25 hover:bg-fuchsia-500/20'
            : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20'
        }`}
        title={effectiveSubTab === 'primary' ? blueprint.addPrimaryBtn : copy.ADD_ADDON_BTN}
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{copy.DIRECTORY.ADD_BTN}</span>
      </button>
    </div>
  );
}