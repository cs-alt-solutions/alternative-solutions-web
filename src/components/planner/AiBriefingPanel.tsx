/* src/components/planner/AiBriefingPanel.tsx */
'use client';

import React from 'react';
import { Cpu, Terminal } from 'lucide-react';

interface AiBriefingProps {
  copy: any;
  hasActiveDraft: boolean; // Fixed missing property
}

export default function AiBriefingPanel({ copy, hasActiveDraft }: AiBriefingProps) {
  const briefing = copy.AI_BRIEF;

  return (
    <div className="bg-black/30 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Cpu size={12} className="text-brand-primary" /> {briefing.TITLE}
        </h3>
        <div className={`px-2 py-0.5 rounded-full text-[8px] font-mono border uppercase tracking-widest ${
          hasActiveDraft ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-white/5 text-white/20 border-white/5'
        }`}>
          {hasActiveDraft ? 'ACTIVE_SESSION' : 'IDLE_WAIT'}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-white/60 font-light leading-relaxed">
          {hasActiveDraft ? briefing.ACTIVE_MSG : briefing.DEFAULT_MSG}
        </p>
        
        <div className="pt-4 border-t border-white/5">
           <div className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
             <Terminal size={10} /> {briefing.GAME_PLAN}
           </div>
           <ul className="space-y-2">
             {briefing.GAME_PLAN_TASKS.map((task: string, idx: number) => (
               <li key={idx} className="text-[11px] text-white/40 flex items-center gap-3">
                 <span className="w-1 h-1 bg-brand-primary/40 rounded-full" />
                 {task}
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}