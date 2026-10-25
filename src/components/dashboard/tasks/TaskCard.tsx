/* src/components/dashboard/tasks/TaskCard.tsx */
import React from 'react';
import { GripVertical, CheckCircle2, Clock, PlayCircle, Trash2, ChevronDown } from 'lucide-react';

interface TaskCardProps {
  task: any;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdateStatus, onDelete }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    'Critical': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    'High': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Medium': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Low': 'text-zinc-400 bg-white/5 border-white/10',
  };

  const StatusIcon = task.status === 'Done' ? CheckCircle2 
                   : task.status === 'In Progress' ? PlayCircle 
                   : Clock;

  const isDone = task.status === 'Done';

  return (
    <div className={`group flex items-start justify-between p-3 bg-zinc-900/50 border rounded-xl hover:bg-zinc-800/50 transition-all ${isDone ? 'border-zinc-800/40 opacity-60' : 'border-zinc-800/80 hover:border-cyan-500/30'}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <GripVertical size={14} className="text-zinc-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
        
        <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${isDone ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-950 border border-zinc-800'}`}>
          <StatusIcon size={14} />
        </div>
        
        <div className="flex flex-col min-w-0 pr-3">
          <span className={`text-sm font-bold truncate ${isDone ? 'text-zinc-500 line-through' : 'text-white'}`}>
            {task.title}
          </span>
          {task.description && (
            <span className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
              {task.description}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0 mt-1">
        <div className="relative group/status hidden sm:block">
          <select
            value={task.status || 'Todo'}
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
            className={`appearance-none cursor-pointer inline-flex items-center pr-6 pl-2 py-0.5 rounded border outline-none text-[9px] font-black uppercase tracking-widest transition-colors ${
              isDone ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <option value="Todo" className="bg-zinc-900 text-white">TODO</option>
            <option value="In Progress" className="bg-zinc-900 text-white">IN PROGRESS</option>
            <option value="Done" className="bg-zinc-900 text-white">DONE</option>
          </select>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={10} className={isDone ? 'text-emerald-500/50' : 'text-zinc-500'} />
          </div>
        </div>

        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors['Low']}`}>
          {task.priority || 'Low'}
        </span>

        <button 
          onClick={() => onDelete(task.id)}
          className="p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          title="Delete Task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}