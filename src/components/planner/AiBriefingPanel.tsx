/* src/components/planner/AiBriefingPanel.tsx */
import React from 'react';
import { Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface AiBriefingProps {
  copy: {
    TITLE: string;
    GAME_PLAN: string;
    DEFAULT_MSG: string;
    ACTIVE_MSG: string;
    GAME_PLAN_TASKS: string[];
  };
  hasActiveDraft: boolean;
}

export default function AiBriefingPanel({ copy, hasActiveDraft }: AiBriefingProps) {
  // SAFETY GUARD: Prevent Runtime TypeError if copy is undefined
  if (!copy) return null;

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-full group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Sparkles size={16} />
          </div>
          <h3 className="text-[10px] font-mono text-white uppercase tracking-widest">{copy.TITLE}</h3>
        </div>
        <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-tighter">
          Intelligence Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-brand-primary uppercase italic">
            <Terminal size={12} /> {copy.GAME_PLAN}
          </div>
          <div className="space-y-2">
            {copy.GAME_PLAN_TASKS.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/2 border border-white/5 group/task hover:border-brand-primary/20 transition-all">
                <span className="text-[10px] font-mono text-white/60">{task}</span>
                <ChevronRight size={12} className="text-white/10 group-hover/task:text-brand-primary" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative">
          <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase italic">
            {hasActiveDraft ? copy.ACTIVE_MSG : copy.DEFAULT_MSG}
          </p>
        </div>
      </div>
    </div>
  );
}