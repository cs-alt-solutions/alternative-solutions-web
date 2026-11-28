/* src/components/dashboard/storefronts/editor/capabilities/CapabilitiesAddonsList.tsx */
'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

interface CapabilitiesAddonsListProps {
  addons: any[];
  onAddAddon: () => void;
  onUpdateAddon: (index: number, field: string, value: string) => void;
  onRemoveAddon: (index: number) => void;
}

export default function CapabilitiesAddonsList({
  addons,
  onAddAddon,
  onUpdateAddon,
  onRemoveAddon,
}: CapabilitiesAddonsListProps) {
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;

  if (addons.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 space-y-2">
        <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
          {copy.EMPTY_ADDONS}
        </p>
        <button
          type="button"
          onClick={onAddAddon}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/25 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {copy.ADD_ADDON_BTN}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {addons.map((addon) => (
        <div
          key={addon.originalIndex}
          className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col gap-2 group relative"
        >
          <button
            type="button"
            onClick={() => onRemoveAddon(addon.originalIndex)}
            className="absolute top-2.5 right-2.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
            title={copy.REMOVE_ADDON_TITLE}
          >
            <Trash2 size={13} />
          </button>

          <div className="flex items-center gap-2 pr-6">
            <input
              value={addon.title}
              onChange={(e) => onUpdateAddon(addon.originalIndex, 'title', e.target.value)}
              placeholder={copy.ADDON_NAME_PLACEHOLDER}
              className="flex-1 min-w-0 bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white text-xs focus:border-fuchsia-500 outline-none"
            />
            <input
              value={addon.price}
              onChange={(e) => onUpdateAddon(addon.originalIndex, 'price', e.target.value)}
              placeholder={copy.ADDON_PRICE_PLACEHOLDER}
              className="w-20 shrink-0 bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-fuchsia-400 font-mono font-bold text-xs focus:border-fuchsia-500 outline-none"
            />
          </div>

          <input
            value={addon.description}
            onChange={(e) => onUpdateAddon(addon.originalIndex, 'description', e.target.value)}
            placeholder={copy.ADDON_DESC_PLACEHOLDER}
            className="w-full bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-zinc-300 text-[11px] focus:border-fuchsia-500 outline-none"
          />
        </div>
      ))}
    </div>
  );
}