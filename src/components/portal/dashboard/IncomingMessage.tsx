/* src/components/portal/dashboard/IncomingMessage.tsx */
import React from 'react';
import { Radio, Zap, CheckCircle2 } from 'lucide-react';

export default function IncomingMessage({ update }: { update: any }) {
  if (!update) {
    return (
      <div className="bg-linear-to-br from-cyan-950/30 to-zinc-950 border border-cyan-500/20 rounded-3xl p-6 flex flex-col shadow-xl backdrop-blur-sm h-full">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-cyan-500/20">
          <Radio size={16} className="text-cyan-500/50" />
          <h2 className="text-sm font-bold text-cyan-50 uppercase tracking-widest">Platform Dispatch</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border border-dashed border-cyan-500/20 rounded-2xl bg-cyan-950/20">
          <CheckCircle2 size={24} className="text-cyan-500/50 mb-2" />
          <p className="text-xs text-cyan-200/50 font-mono uppercase tracking-widest">All systems nominal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-cyan-950/40 via-zinc-950 to-zinc-950 border border-cyan-500/40 rounded-3xl p-6 flex flex-col shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md h-full relative overflow-hidden group">
      
      {/* Stronger Background Glows */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-cyan-400/30 transition-colors duration-700" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none" />

      <div className="flex items-center justify-between mb-5 pb-4 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/20 rounded-md text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Radio size={14} className="animate-pulse" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest text-shadow-sm">Platform Dispatch</h2>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          Global
        </span>
      </div>
      
      <div className="flex-1 flex flex-col relative z-10">
        <h3 className="text-sm font-black text-white mb-3 leading-snug">
          {update.title}
        </h3>
        <p className="text-[13px] text-cyan-100/70 leading-relaxed flex-1">
          {update.body}
        </p>
        
        <div className="mt-5 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-400/60">
            <Zap size={12} className="text-cyan-400" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-300">Architect Release</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest">
            {new Date(update.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}