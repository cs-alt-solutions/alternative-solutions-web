/* src/components/planner/DailyDebriefPanel.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { CheckCircle2, Circle, ListChecks, Loader2, AlertCircle, ArrowRightLeft, Calendar, Lightbulb } from 'lucide-react';
import { toggleDirectiveStatus, rescheduleDirective } from '@/app/actions';

interface PlannerTask {
  id: string;
  title: string;
  type: string;
  time: string;
  reflection?: string;
  status: string;
}

interface DailyDebriefPanelProps {
  tasks: PlannerTask[];
  onTaskUpdate: () => void;
}

export default function DailyDebriefPanel({ tasks, onTaskUpdate }: DailyDebriefPanelProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'CHECK' | 'UNCHECK' } | null>(null);
  const [triageId, setTriageId] = useState<string | null>(null);

  async function executeToggle(id: string, currentStatus: string) {
    setLoadingId(id);
    const newStatus = currentStatus === 'DONE' ? 'BACKLOG' : 'DONE';
    
    const formData = new FormData();
    formData.append('id', id);
    formData.append('targetStatus', newStatus);
    
    const result = await toggleDirectiveStatus(formData);
    if (result.success) {
      setConfirmAction(null);
      onTaskUpdate(); 
    }
    setLoadingId(null);
  }

  async function executeTriage(id: string, target: 'TODAY' | 'LEDGER') {
    setLoadingId(id);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('target', target);

    const result = await rescheduleDirective(formData);
    if (result.success) {
      setTriageId(null);
      onTaskUpdate();
    }
    setLoadingId(null);
  }

  return (
    <section className="h-full flex flex-col bg-bg-surface-100 border border-border-subtle rounded-xl p-6">
      <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <ListChecks size={12} className="text-brand-primary" /> {copy.SECTIONS.DEBRIEF}
      </h3>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-50">
        {tasks.length === 0 ? (
          <div className="p-6 border border-dashed border-border-subtle rounded-lg text-[10px] font-mono text-text-muted uppercase text-center h-full flex items-center justify-center">
            {copy.PLACEHOLDERS.CLEAR}
          </div>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === 'DONE';
            const isLoading = loadingId === task.id;
            const isConfirming = confirmAction?.id === task.id;
            const isTriaging = triageId === task.id;

            return (
              <div key={task.id} className={`p-4 border rounded-lg flex flex-col gap-3 transition-all ${isDone && !isConfirming ? 'bg-bg-app border-border-subtle opacity-50' : 'bg-bg-surface-200 border-border-subtle hover:border-brand-primary/30'}`}>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => {
                        setTriageId(null);
                        setConfirmAction({ id: task.id, type: isDone ? 'UNCHECK' : 'CHECK' });
                      }}
                      disabled={isLoading}
                      className={`mt-0.5 shrink-0 transition-all ${isDone ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary hover:scale-110'}`}
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin text-brand-primary" /> : isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                    
                    <div className="flex-1">
                      <span className={`text-sm font-bold block mb-1 ${isDone ? 'text-text-muted line-through' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">{task.type}</span>
                        {task.reflection && (
                           <span className="text-[10px] text-text-muted italic block truncate max-w-50">- {task.reflection}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TRIAGE BUTTON (Only shows if task is NOT done) */}
                  {!isDone && !isConfirming && (
                    <button 
                      onClick={() => setTriageId(isTriaging ? null : task.id)}
                      className={`shrink-0 p-1.5 rounded text-text-muted transition-colors ${isTriaging ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                      <ArrowRightLeft size={14} />
                    </button>
                  )}
                </div>

                {/* THE INTENTIONALITY CHECK LAYER */}
                {isConfirming && (
                  <div className="pt-3 mt-1 border-t border-border-subtle flex items-center justify-between animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-accent">
                      <AlertCircle size={12} />
                      <span>{confirmAction.type === 'CHECK' ? 'Is this 100% complete?' : "Unchecking this. Need to revisit?"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setConfirmAction(null)} 
                        className="px-3 py-1.5 rounded-md text-[9px] font-bold font-mono uppercase tracking-widest text-text-muted hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => executeToggle(task.id, task.status)} 
                        className="px-3 py-1.5 rounded-md bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-[9px] font-bold font-mono uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                {/* THE TRIAGE MENU LAYER */}
                {isTriaging && !isConfirming && (
                  <div className="pt-3 mt-1 border-t border-border-subtle flex items-center justify-between animate-in slide-in-from-top-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Reschedule Task:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => executeTriage(task.id, 'LEDGER')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold font-mono uppercase tracking-widest text-text-muted hover:text-white hover:border-white/30 transition-all"
                      >
                        <Lightbulb size={10} /> To Ledger
                      </button>
                      <button 
                        onClick={() => executeTriage(task.id, 'TODAY')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 text-[9px] font-bold font-mono uppercase tracking-widest hover:bg-brand-secondary hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                      >
                        <Calendar size={10} /> Push to Today
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </section>
  );
}