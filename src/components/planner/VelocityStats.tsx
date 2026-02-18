import React from 'react';
import { Zap } from 'lucide-react';

interface VelocityProps {
  copy: any;
  savings: string;
  freedom: string;
}

export default function VelocityStats({ copy, savings, freedom }: VelocityProps) {
  return (
    <section className="bg-black/40 border border-white/5 rounded-2xl p-6">
      <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Zap size={14} className="text-brand-primary" /> {copy.TITLE}
      </h3>
      <div className="space-y-4">
        <div>
          <span className="text-[9px] font-mono text-white/30 uppercase block mb-1">{copy.SAVINGS}</span>
          <span className="text-2xl font-black text-brand-primary tracking-tighter tabular-nums">{savings}</span>
        </div>
        <div className="pt-4 border-t border-white/5">
          <span className="text-[9px] font-mono text-white/30 uppercase block mb-1">{copy.FREEDOM}</span>
          <span className="text-lg font-black text-brand-secondary tracking-tighter tabular-nums">{freedom}</span>
        </div>
      </div>
    </section>
  );
}