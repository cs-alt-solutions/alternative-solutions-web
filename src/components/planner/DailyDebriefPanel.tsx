import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { CheckCircle2, Mic, Share2 } from 'lucide-react';

interface CompletedTask {
  id: string;
  title: string;
  reflection?: string;
}

interface DailyDebriefProps {
  tasks: CompletedTask[];
}

export default function DailyDebriefPanel({ tasks }: DailyDebriefProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;

  return (
    <section className="bg-black/20 border border-white/5 rounded-2xl p-6">
      <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <CheckCircle2 size={12} className="text-emerald-500" /> {copy.SECTIONS.DEBRIEF}
      </h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white/2 border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-white/70 line-through decoration-emerald-500/50">{task.title}</h4>
              <div className="flex gap-2">
                 <button title="Draft Broadcast" className="p-1.5 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/90 hover:text-black transition-all"><Share2 size={12} /></button>
                 <button title="Record Mindset" className="p-1.5 rounded bg-white/5 text-white/40 hover:text-white transition-all"><Mic size={12} /></button>
              </div>
            </div>
            {task.reflection && <p className="mt-2 text-xs text-white/40 italic font-light">"{task.reflection}"</p>}
          </div>
        ))}
      </div>
    </section>
  );
}