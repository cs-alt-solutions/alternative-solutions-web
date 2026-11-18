/* src/components/dashboard/tasks/TaskBoard.tsx */
'use client';

import React from 'react';
import TaskCard from './TaskCard';
import { Briefcase, Layers, CheckCircle2 } from 'lucide-react';
import { TASK_COPY } from '@/config/dashboard/tasks';

interface TaskBoardProps {
  tasks: any[];
  clients: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: any) => void;
}

export default function TaskBoard({ 
  tasks, 
  clients, 
  onUpdateStatus, 
  onDeleteTask,
  onEditTask 
}: TaskBoardProps) {
  const groupedTasks = tasks.reduce((acc: any, task: any) => {
    const key = task.storefront_id || 'internal';
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {tasks.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center bg-black/20">
          <CheckCircle2 size={32} className="text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{TASK_COPY.BOARD.EMPTY_COLUMN}</p>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([clientId, clientTasks]: [string, any]) => {
          const client = clients.find(c => c.id === clientId);
          const clientName = client ? client.business_name : clientId === 'internal' ? TASK_COPY.HEADER.INTERNAL_OPTION : 'Client Workspace';

          return (
            <div key={clientId} className="bg-black/40 border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  {clientId === 'internal' ? <Layers size={16} /> : <Briefcase size={16} />}
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">{clientName}</h2>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{clientTasks.length} Active Items</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {clientTasks.map((task: any) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdateStatus={onUpdateStatus} 
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}