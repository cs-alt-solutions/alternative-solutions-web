/* src/components/planner/DailyDebriefPanel.tsx */
'use client';

import React from 'react';
import { ListChecks, Circle, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types';

interface DailyDebriefPanelProps {
  copy: any;
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}

export default function DailyDebriefPanel({ copy, tasks, onTaskUpdate }: DailyDebriefPanelProps) {
  // SAFETY GUARD
  if (!copy) return null;

  return (
    <section className="bg-black/30 border border-white/5 rounded-2xl flex flex-col h-100 group hover:border-brand-primary/20 transition-all overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
        <ListChecks size={14} className="text-brand-primary" /> 
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
          {copy.DEBRIEF}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl text-center p-8">
            <CheckCircle2 size={24} className="text-white/5 mb-3" />
            <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
              {copy.CLEAR || "Queue Clear"}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 bg-white/2 border border-white/5 rounded-xl flex items-start gap-4 hover:border-brand-primary/30 transition-all"
              >
                <button 
                  onClick={() => onTaskUpdate({ ...task, status: 'Done' })}
                  className="mt-0.5 text-white/20 hover:text-brand-primary transition-colors shrink-0"
                >
                  <Circle size={16} />
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-white/80 block uppercase truncate">
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">
                      {task.priority}
                    </span>
                    <span className="text-[9px] font-mono text-white/20 uppercase px-1.5 py-0.5 rounded border border-white/10">
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}