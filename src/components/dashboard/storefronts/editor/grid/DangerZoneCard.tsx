'use client';

import React, { useState } from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';

export default function DangerZoneCard({ onTerminate }: { onTerminate?: () => void }) {
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      alert("Please type 'DELETE' to confirm storefront termination.");
      return;
    }
    if (onTerminate) {
      onTerminate();
    }
  };

  return (
    <div className="bg-red-950/20 border border-red-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      
      {/* HEADER: High-Contrast Hazard Strip */}
      <div className="border-b border-red-500/20 bg-black/40 p-4 flex items-center gap-3">
        <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/30 shadow-inner">
           <ShieldAlert size={14} className="text-red-400" />
        </div>
        <h3 className="text-[11px] font-black text-red-400 uppercase tracking-[0.2em]">Danger Zone — Storefront Termination</h3>
      </div>

      {/* BODY: Tight Bento Grid Layout */}
      <div className="p-5 flex flex-col lg:flex-row items-center justify-between gap-4 bg-black/40">
        <div className="space-y-1 text-left w-full lg:w-auto">
          <span className="block text-xs font-bold text-white uppercase tracking-wider">Purge Storefront Instance</span>
          <p className="text-[10px] text-zinc-400">Once executed, this action is irreversible. All associated configurations and database records will be scrubbed.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
          <input
            type="text"
            placeholder="Type DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="bg-black border border-red-500/30 rounded-md px-3 py-2 text-[10px] text-red-400 font-mono tracking-widest focus:outline-none focus:border-red-500 placeholder:text-zinc-700 w-28 text-center"
          />
          <button
            onClick={handleDelete}
            disabled={confirmText !== 'DELETE'}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <Trash2 size={12} />
            <span>Purge Node</span>
          </button>
        </div>
      </div>

    </div>
  );
}