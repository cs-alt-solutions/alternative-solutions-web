/* src/components/dashboard/tasks/TaskCard.tsx */
import React from 'react';
import { GripVertical, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface TaskCardProps {
  task: any;
}

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    'Critical': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    'High': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Medium': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Low': 'text-zinc-400 bg-white/5 border-white/10',
  };

  const StatusIcon = task.status === 'Done' ? CheckCircle2 
                   : task.status === 'In Progress' ? PlayCircle 
                   : Clock;

  return (
    <div className="group flex items-start justify-between p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl hover:bg-zinc-800/50 hover:border-cyan-500/30 transition-all">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <GripVertical size={14} className="text-zinc-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
        
        <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${task.status === 'Done' ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-950 border border-zinc-800'}`}>
          <StatusIcon size={14} />
        </div>
        
        <div className="flex flex-col min-w-0 pr-3">
          <span className={`text-sm font-bold truncate ${task.status === 'Done' ? 'text-zinc-500 line-through' : 'text-white'}`}>
            {task.title}
          </span>
          {/* 🚀 ADDED: Displays the task description if one was written */}
          {task.description && (
            <span className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
              {task.description}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0 mt-1">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">
          {task.status || 'Todo'}
        </span>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors['Low']}`}>
          {task.priority || 'Low'}
        </span>
      </div>
    </div>
  );
}