/* src/components/dashboard/storefronts/editor/SystemLockShield.tsx */
'use client';

import React from 'react';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';

interface SystemLockShieldProps {
  status: string;
  onOverride: () => void;
  onRevert: () => void;
}

export default function SystemLockShield({ status, onOverride, onRevert }: SystemLockShieldProps) {
  return (
    <div className="absolute inset-0 z-100 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_100px_rgba(6,182,212,0.05)] transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center max-w-sm text-center shadow-2xl">
        <div className="p-4 bg-cyan-500/10 rounded-full mb-4 border border-cyan-500/20">
          <Lock size={32} className="text-cyan-400 animate-pulse" />
        </div>
        
        <h2 className="text-lg font-black text-white tracking-[0.2em] uppercase mb-2">
          {STOREFRONT_EDITOR_COPY.SYSTEM_LOCK?.TITLE || 'SYSTEM LOCKED'}
        </h2>
        
        <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 mb-4 tracking-widest uppercase">
          {STOREFRONT_EDITOR_COPY.SYSTEM_LOCK?.STATUS_PREFIX || 'STATUS:'} {status}
        </div>
        
        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium mb-8 px-4">
          {STOREFRONT_EDITOR_COPY.SYSTEM_LOCK?.BODY || 'This build is in production or review. Edits are disabled to prevent deployment conflicts.'}
        </p>
        
        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={onOverride}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black py-3 px-4 rounded-md text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Unlock size={14} /> {STOREFRONT_EDITOR_COPY.SYSTEM_LOCK?.BTN_OVERRIDE || 'OVERRIDE LOCK'}
          </button>

          <button 
            onClick={onRevert}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-amber-500/50 py-3 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all group cursor-pointer"
          >
            <ShieldAlert size={12} className="group-hover:text-amber-400 transition-colors" />
            {STOREFRONT_EDITOR_COPY.SYSTEM_LOCK?.BTN_REVERT || 'REVERT TO BUILDING'}
          </button>
        </div>
      </div>
    </div>
  );
}