// src/components/dashboard/storefronts/editor/DangerZoneCard.tsx
'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DangerZoneProps {
  businessName: string;
  onDelete?: () => void;
}

export default function DangerZoneCard({ businessName, onDelete }: DangerZoneProps) {
  if (!onDelete) return null;

  return (
    <div className="mt-12 mx-4 mb-8 p-6 rounded-2xl bg-red-950/10 border border-red-500/20 space-y-4 shadow-xl">
      <div className="flex items-center gap-3 text-red-400">
        <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Danger Zone</h3>
      </div>

      <p className="text-zinc-400 text-xs leading-relaxed">
        Permanently delete <span className="text-white font-bold">&ldquo;{businessName}&rdquo;</span> and remove its deployment from all public routing galleries. This action destroys client data and cannot be undone.
      </p>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-zinc-950 border border-red-500/30 hover:border-red-500 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Terminate Storefront</span>
        </button>
      </div>
    </div>
  );
}