/* src/app/dashboard/project/[id]/page.tsx */
import React from 'react';
import Link from 'next/link';
import { getProjectById } from '@/data/store';
import { WEBSITE_COPY } from '@/utils/glossary';
import TaskCard from '@/components/dashboard/TaskCard';
import { ArrowLeft, Plus, Activity, Calendar } from 'lucide-react';

export default function ProjectWorkspace({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  const copy = WEBSITE_COPY.DASHBOARD.PROJECT_BOARD;

  // Failsafe: If the project ID doesn't exist
  if (!project) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center font-mono text-brand-primary uppercase tracking-widest text-sm">
        {copy.NOT_FOUND}
      </div>
    );
  }

  // Filter tasks into their respective columns
  const columns = [
    { id: 'Todo', title: copy.COLUMNS.TODO, tasks: project.tasks.filter(t => t.status === 'Todo') },
    { id: 'In Progress', title: copy.COLUMNS.IN_PROGRESS, tasks: project.tasks.filter(t => t.status === 'In Progress') },
    { id: 'Review', title: copy.COLUMNS.REVIEW, tasks: project.tasks.filter(t => t.status === 'Review') },
    { id: 'Done', title: copy.COLUMNS.DONE, tasks: project.tasks.filter(t => t.status === 'Done') },
  ];

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-white overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute inset-0 bg-stardust pointer-events-none opacity-50" />
      
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 bg-bg-app/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary border border-white/10 hover:border-brand-primary/30 transition-all">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-black uppercase tracking-tight">{project.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                project.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
              }`}>
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted font-mono uppercase tracking-wider">
               <span className="flex items-center gap-1"><Calendar size={12}/> Due: {project.dueDate}</span>
               <span className="flex items-center gap-1"><Activity size={12}/> Client: {project.client}</span>
            </div>
          </div>
        </div>

        {/* Action Center & Progress */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
             <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">System Progress</div>
             <div className="flex items-center gap-3">
               <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                 {/* Exemption for calculated inline styles allowed by ARCHITECTURE.md */}
                 <div className="h-full bg-brand-primary rounded-full" style={{ width: `${project.progress}%` }} />
               </div>
               <span className="text-xs font-bold text-white w-8">{project.progress}%</span>
             </div>
          </div>
          <button className="btn-brand px-4 py-2 text-[10px] flex items-center gap-2 h-auto">
            <Plus size={14} /> {copy.ADD_TASK}
          </button>
        </div>
      </header>

      {/* KANBAN BOARD */}
      <main className="flex-1 overflow-x-auto p-8 relative z-0">
        <div className="flex gap-6 min-w-max h-full pb-8">
          {columns.map((col) => (
            <div key={col.id} className="w-80 flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">{col.title}</h3>
                <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                  {col.tasks.length}
                </span>
              </div>
              
              {/* Task List */}
              <div className="flex-1 space-y-4">
                {col.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {col.tasks.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded-xl h-24 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest text-white/20">
                    No active tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}