/* src/components/dashboard/tasks/TaskBoard.tsx */
'use client';
import React from 'react';
import TaskCard from './TaskCard';
import { Briefcase, Layers, CheckCircle2 } from 'lucide-react';

export default function TaskBoard({ tasks, clients }: { tasks: any[], clients: any[] }) {
  // Group tasks by storefront_id (Client)
  const groupedTasks = tasks.reduce((acc: any, task) => {
    const key = task.storefront_id || 'internal';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {tasks.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center bg-black/20">
          <CheckCircle2 size={32} className="text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Queue is clear. No active tasks.</p>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([clientId, clientTasks]: [string, any]) => {
          const client = clients.find(c => c.id === clientId);
          const clientName = client ? client.business_name : clientId === 'internal' ? 'Alt Solutions (Internal)' : 'Unknown Client';

          return (
            <div key={clientId} className="bg-black/40 border border-white/5 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  {clientId === 'internal' ? <Layers size={14} /> : <Briefcase size={14} />}
                </div>
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-widest">{clientName}</h2>
                </div>
                <span className="ml-auto text-[9px] text-zinc-500 font-mono tracking-widest uppercase bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                  {clientTasks.length} Tasks
                </span>
              </div>

              {/* 🚀 FIX: Stacked Row Layout instead of Grid */}
              <div className="flex flex-col gap-2">
                {clientTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}