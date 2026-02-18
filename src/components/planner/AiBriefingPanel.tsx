import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface AiBriefingProps {
  copy: any;
  message: string;
  gamePlan: string[];
}

export default function AiBriefingPanel({ copy, message, gamePlan }: AiBriefingProps) {
  return (
    <section className="bg-linear-to-b from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={48} /></div>
      <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-4 flex items-center gap-2">
        <Activity size={14} /> {copy.TITLE}
      </h3>
      <p className="text-sm text-white/80 font-light leading-relaxed mb-4 italic">"{message}"</p>
      <div className="pt-4 border-t border-white/5">
        <span className="text-[10px] font-mono text-white/40 uppercase">{copy.GAME_PLAN}</span>
        <ul className="mt-2 space-y-2">
          {gamePlan.map((item, i) => (
            <li key={i} className="text-xs text-white/60 flex items-center gap-2">
              <div className="w-1 h-1 bg-brand-primary rounded-full" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}