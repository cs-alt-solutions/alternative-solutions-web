/* src/app/dashboard/project/[id]/page.tsx */
import React from 'react';
import Link from 'next/link';
import { getProjectById } from '@/data/store'; // IMPORTING FROM GHOST DB
import { ArrowLeft, MoreHorizontal, Calendar, Clock, Plus, CheckCircle2 } from 'lucide-react';

export default function ProjectDetail({ params }: { params: { id: string } }) {
  // Simulate fetching data based on the URL ID
  const project = getProjectById(params.id);

  if (!project) return <div className="p-8 text-white">Project not found.</div>;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-text-main">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-bg-app flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-white">{project.name}</h1>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Client: {project.client}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted border border-white/10 px-3 py-1.5 rounded-md">
                <Calendar size={12} />
                <span>Due: {project.dueDate}</span>
            </div>
            <button className="text-white/40 hover:text-white">
                <MoreHorizontal size={18} />
            </button>
        </div>
      </header>

      {/* WORKSPACE (KANBAN) */}
      <main className="flex-1 p-6 overflow-x-auto">
        {/* FIXED: min-w-[1000px] -> min-w-250 (Tailwind v4 Optimized) */}
        <div className="flex gap-6 h-full min-w-250">
            
            {/* COLUMN: TODO */}
            <KanbanColumn 
                title="To Do" 
                count={project.tasks.filter(t => t.status === 'Todo').length} 
                accent="border-l-4 border-l-white/20"
            >
                {project.tasks.filter(t => t.status === 'Todo').map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
                <button className="w-full py-3 border border-dashed border-white/10 rounded-lg text-white/20 text-xs font-mono uppercase hover:border-brand-primary/50 hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Task
                </button>
            </KanbanColumn>

            {/* COLUMN: IN PROGRESS */}
            <KanbanColumn 
                title="In Progress" 
                count={project.tasks.filter(t => t.status === 'In Progress').length}
                accent="border-l-4 border-l-brand-primary"
            >
                {project.tasks.filter(t => t.status === 'In Progress').map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </KanbanColumn>

            {/* COLUMN: DONE */}
            <KanbanColumn 
                title="Completed" 
                count={project.tasks.filter(t => t.status === 'Done').length}
                accent="border-l-4 border-l-emerald-500"
            >
                {project.tasks.filter(t => t.status === 'Done').map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </KanbanColumn>

        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KanbanColumn({ title, count, children, accent }: any) {
    return (
        <div className="w-80 flex flex-col gap-4">
            <div className={`flex items-center justify-between px-4 py-3 bg-bg-surface-100 rounded-lg border border-white/5 ${accent}`}>
                <span className="font-bold text-xs uppercase tracking-widest text-white/80">{title}</span>
                <span className="bg-white/10 text-white/60 text-[10px] font-mono px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    )
}

function TaskCard({ task }: any) {
    return (
        <div className="bg-bg-app border border-white/5 p-4 rounded-lg shadow-sm hover:border-brand-primary/30 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider border ${
                   task.priority === 'Critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                   task.priority === 'High' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                   "bg-blue-500/10 text-blue-500 border-blue-500/20"
                }`}>
                    {task.priority}
                </span>
                <Clock size={12} className="text-white/20 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="text-sm font-medium text-white mb-3 leading-snug">{task.title}</h4>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center text-[8px] font-bold text-brand-primary">
                        {task.assignee.charAt(0)}
                    </div>
                    <span className="text-[10px] text-text-muted">{task.assignee}</span>
                </div>
                {task.status === 'Done' && <CheckCircle2 size={14} className="text-emerald-500" />}
            </div>
        </div>
    )
}