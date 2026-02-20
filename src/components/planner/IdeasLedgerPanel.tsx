/* src/components/planner/IdeasLedgerPanel.tsx */
'use client';

import React from 'react';
import { Lightbulb, Plus, ChevronRight } from 'lucide-react';
import { Task } from '@/types';

interface IdeasLedgerProps {
  copy: any;
  tasks: Task[]; // Renamed to tasks to match the parent orchestration
}

export default function IdeasLedgerPanel({ copy, tasks = [] }: IdeasLedgerProps) {
  // SAFETY GUARD
  if (!copy) return null;

  return (
    <div className="bg-black/30 border border-white/5 rounded-2xl flex flex-col h-100 group hover:border-brand-primary/20 transition-all overflow-hidden">
       <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Lightbulb size={14} className="text-yellow-400" /> {copy.IDEAS}
        </h3>
        <span className="text-[10px] font-mono text-white/20 uppercase">
          {tasks.length} Dormant
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl p-8 text-center">
             <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest leading-relaxed">
               {copy.CAL_INIT || "Awaiting build directives..."}
             </span>
          </div>
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="p-3 rounded-lg bg-white/2 border border-white/5 hover:bg-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group/item flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white/80 group-hover/item:text-white transition-colors uppercase">
                    {task.title}
                  </div>
                  <div className="text-[9px] font-mono text-white/30 uppercase mt-0.5">
                    {task.priority} // {task.id.slice(0, 8)}
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/10 group-hover/item:text-brand-primary transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}