/* src/components/planner/IdeasLedgerPanel.tsx */
import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface IdeasLedgerProps {
  copy: string;
  ideas: any[];
}

export default function IdeasLedgerPanel({ copy, ideas }: IdeasLedgerProps) {
  return (
    <section className="bg-bg-surface-100 border border-border-subtle rounded-xl p-6 flex flex-col max-h-100">
      <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 shrink-0">
        <Lightbulb size={12} className="text-brand-accent" /> {copy}
      </h3>
      
      <div className="space-y-2 overflow-y-auto pr-2 flex-1 custom-scrollbar">
        {ideas.length === 0 ? (
           <div className="p-4 border border-dashed border-white/10 rounded-lg text-[10px] font-mono text-white/20 uppercase text-center">
             WORKSPACE CLEAR
           </div>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="p-3 bg-bg-surface-200 border border-border-subtle rounded-lg flex items-center justify-between group hover:border-brand-primary/30 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block mb-1">{idea.title}</span>
                <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">{idea.type}</span>
              </div>
              <button className="text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}