/* src/components/planner/DailyDebriefPanel.tsx */
'use client';

import React from 'react';
import { ListChecks } from 'lucide-react';

interface PlannerTask {
  id: string;
  title: string;
  type: string;
  status: string;
}

interface DailyDebriefPanelProps {
  copy: any;
  tasks: PlannerTask[];
  onTaskUpdate: () => void;
}

/**
 * DAILY DEBRIEF PANEL
 * Logic: Displays the actionable tasks for the selected day.
 */
export default function DailyDebriefPanel({ copy, tasks, onTaskUpdate }: DailyDebriefPanelProps) {
  return (
    <section className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
      <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <ListChecks size={12} className="text-brand-primary" /> {copy.SECTIONS.DEBRIEF}
      </h3>

      <div className="min-h-37.5 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-lg text-[10px] font-mono text-white/10 uppercase tracking-widest p-8">
            {copy.PLACEHOLDERS.CLEAR}
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-4 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between hover:border-brand-primary/30 transition-all">
              <div>
                <span className="text-sm font-bold text-white/80 block">{task.title}</span>
                <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">{task.type}</span>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase border border-white/10 px-2 py-1 rounded">
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}