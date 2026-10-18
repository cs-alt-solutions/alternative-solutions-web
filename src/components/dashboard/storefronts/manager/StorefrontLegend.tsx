/* src/components/dashboard/storefronts/manager/StorefrontLegend.tsx */
import React from 'react';

export default function StorefrontLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 px-3 py-3 mb-6 border border-zinc-800/50 bg-zinc-900/30 rounded-lg">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">System Legend:</span>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-zinc-600 shadow-[0_0_8px_rgba(82,82,91,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Offline / Pending</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Awaiting Payment</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Building Core</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Content Assembly</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Client Review</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Awaiting Assets</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Live Production</span>
      </div>
    </div>
  );
}