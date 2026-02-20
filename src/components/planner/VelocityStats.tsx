/* src/components/planner/VelocityStats.tsx */
import React from 'react';
import { Zap } from 'lucide-react';

interface VelocityProps {
  copy: {
    TITLE: string;
    SAVINGS: string;
    FREEDOM: string;
    INDUSTRY_LABEL: string;
    ARCHITECT_LABEL: string;
  };
}

export default function VelocityStats({ copy }: VelocityProps) {
  // SAFETY GUARD
  if (!copy) return null;

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full group">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
          <Zap size={16} />
        </div>
        <h3 className="text-[10px] font-mono text-white uppercase tracking-widest">{copy.TITLE}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-white/30 uppercase">{copy.SAVINGS}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic">12.5</span>
            <span className="text-[10px] font-mono text-brand-primary uppercase">HRS</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-white/30 uppercase">{copy.FREEDOM}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white italic">28</span>
            <span className="text-[10px] font-mono text-brand-primary uppercase">HRS</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
        <div className="flex justify-between items-center text-[9px] font-mono uppercase">
          <span className="text-white/30">{copy.INDUSTRY_LABEL}</span>
          <span className="text-white/60">40H / WEEK</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono uppercase">
          <span className="text-brand-primary font-bold">{copy.ARCHITECT_LABEL}</span>
          <span className="text-white font-black italic">18H / WEEK</span>
        </div>
      </div>
    </div>
  );
}