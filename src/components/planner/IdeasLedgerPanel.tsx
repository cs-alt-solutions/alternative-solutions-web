/* src/components/planner/IdeasLedgerPanel.tsx */
'use client';

import React from 'react';
import { Lightbulb, Plus } from 'lucide-react';

interface IdeasLedgerProps {
  copy: any;
  ideas: any[]; // Matches the 'ideas' prop sent from the parent
}

export default function IdeasLedgerPanel({ copy, ideas = [] }: IdeasLedgerProps) {
  return (
    <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex-1 flex flex-col group hover:border-brand-primary/20 transition-all">
       <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Lightbulb size={12} /> {copy.SECTIONS.IDEAS}
        </h3>
        <button className="text-[10px] font-mono text-brand-primary flex items-center gap-1 hover:underline">
          <Plus size={10} /> {copy.BTN_ADD}
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-50">
        {ideas.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-lg p-8">
             <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">{copy.PLACEHOLDERS.CAL_INIT}</span>
          </div>
        ) : (
          ideas.map((item, idx) => (
            <div key={item.id || idx} className="p-3 rounded bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer">
              <div className="text-[10px] font-bold text-white/80 mb-1">{item.title}</div>
              <div className="text-[9px] font-mono text-white/30 uppercase">{item.type}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}