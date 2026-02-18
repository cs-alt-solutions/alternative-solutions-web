/* src/app/dashboard/tasks/page.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowLeft, Plus, GripVertical, Terminal, Bug, Lightbulb } from 'lucide-react';

// Pre-populating your requested placeholder so you don't forget it!
const MOCK_TASKS = [
  {
    id: '1',
    title: 'AI Triage Sensitivity Controls',
    desc: 'Add a slider to adjust the leniency of the AI synthesis (strict vs loose) for beta feedback. Ensures we don\'t miss edge cases if AI filters too aggressively.',
    column: 'BACKLOG',
    tag: 'FEATURE',
    priority: 'LOW'
  },
  {
    id: '2',
    title: 'Shift Studio Beta Pipelines',
    desc: 'Wire up the Supabase backend for the deployment modal. Need to ensure Magic Links dispatch correctly.',
    column: 'ACTIVE',
    tag: 'INFRA',
    priority: 'HIGH'
  }
];

export default function InternalRoadmap() {
  const copy = WEBSITE_COPY.DASHBOARD.INTERNAL_TASKS;

  const renderColumn = (title: string, columnKey: string) => {
    const columnTasks = MOCK_TASKS.filter(task => task.column === columnKey);
    
    return (
      <div className="flex-1 bg-black/20 rounded-xl border border-white/5 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h3>
          <span className="bg-black/50 px-2 py-0.5 rounded text-[10px] font-mono text-white/50">{columnTasks.length}</span>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {columnTasks.map(task => (
            <div key={task.id} className="bg-bg-surface-100 border border-white/10 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-brand-primary/40 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest border ${
                    task.tag === 'FEATURE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    task.tag === 'BUG' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {task.tag === 'FEATURE' ? <Lightbulb size={8} className="inline mr-1" /> : task.tag === 'BUG' ? <Bug size={8} className="inline mr-1" /> : <Terminal size={8} className="inline mr-1" />}
                    {copy.TAGS[task.tag as keyof typeof copy.TAGS]}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest border ${
                    task.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <GripVertical size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              
              <h4 className="text-sm font-bold text-white mb-2 leading-tight">{task.title}</h4>
              <p className="text-xs text-white/60 font-light leading-relaxed line-clamp-3">{task.desc}</p>
            </div>
          ))}
          
          {columnTasks.length === 0 && (
            <div className="h-full flex items-center justify-center opacity-30 select-none border-2 border-dashed border-white/10 rounded-lg py-8">
              <span className="text-[10px] font-mono uppercase tracking-widest">Drop Zone</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-full mx-auto w-full relative z-10 flex-1 flex flex-col pb-8">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                <ArrowLeft size={16} />
              </Link>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy.TITLE}</h1>
                 <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1 block">
                   {copy.SUBTITLE}
                 </span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-mono uppercase font-bold text-black bg-brand-primary hover:bg-brand-primary/90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Plus size={16} /> {copy.BTN_ADD}
            </button>
          </div>

          {/* KANBAN BOARD */}
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
             {renderColumn(copy.COLUMNS.BACKLOG, 'BACKLOG')}
             {renderColumn(copy.COLUMNS.ACTIVE, 'ACTIVE')}
             {renderColumn(copy.COLUMNS.REVIEW, 'REVIEW')}
             {renderColumn(copy.COLUMNS.DONE, 'DONE')}
          </div>
          
       </div>
    </div>
  );
}