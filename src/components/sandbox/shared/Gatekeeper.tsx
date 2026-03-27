/* src/components/sandbox/shared/Gatekeeper.tsx */
'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface GatekeeperProps {
  onUnlock: () => void;
  appTitle: string;
  pin: string; 
  lockedMessage: string;
}

export default function Gatekeeper({ onUnlock, appTitle, lockedMessage }: GatekeeperProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden">
      <div className="absolute top-0 w-full h-1/2 bg-linear-to-b from-cyan-900/20 to-zinc-950 pointer-events-none"></div>
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-zinc-900 p-6 rounded-3xl mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)] border border-zinc-800 flex items-center justify-center group">
          <ShieldCheck size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:text-cyan-300" />
        </div>
        <h1 className="text-3xl font-black tracking-widest mb-3 text-center text-zinc-100 uppercase drop-shadow-md leading-tight">
          {appTitle}
        </h1>
        <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full mb-12">
          <p className="text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase">{lockedMessage}</p>
        </div>
        <button onClick={onUnlock} className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-3 group">
          Enter Workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}