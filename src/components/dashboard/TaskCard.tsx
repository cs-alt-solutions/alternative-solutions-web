/* src/components/dashboard/TaskCard.tsx */
import React from 'react';
import { Task } from '@/types'; // Fix: Pointing to unified types

export default function TaskCard({ task }: { task: Task }) {
  // Industrial styling based on task priority
  const priorityColors: Record<string, string> = {
    'Critical': 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
    'High': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Medium': 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20',
    'Low': 'text-text-muted bg-white/5 border-white/10',
  };

  return (
    <div className="p-4 rounded-xl bg-bg-surface-100 border border-white/5 hover:border-brand-primary/30 transition-all group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{task.id}</span>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors['Low']}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-sm font-medium text-white mb-4 leading-snug group-hover:text-brand-primary transition-colors">
        {task.title}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
         <div className="w-6 h-6 rounded-full bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-inner">
           {task.assignee?.charAt(0) || 'U'}
         </div>
         <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{task.status}</span>
      </div>
    </div>
  );
}