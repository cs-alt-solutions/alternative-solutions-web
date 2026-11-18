/* src/components/dashboard/tasks/TasksManager.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Plus, Filter } from 'lucide-react';
import TaskBoard from './TaskBoard';
import TaskEditorModal from './TaskEditorModal';
import { TASK_COPY } from '@/config/dashboard/tasks';
import { quickUpdateStorefrontStatus } from '@/app/actions/storefronts';

export default function TasksManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const copy = TASK_COPY.HEADER;

  const fetchCoreData = async () => {
    const { data: clientData } = await supabase
      .from('storefronts')
      .select('id, business_name, status')
      .eq('is_template', false)
      .not('status', 'in', '("PENDING","CANCELED","PROTOTYPE")')
      .order('business_name', { ascending: true });

    if (clientData) setClients(clientData);
    
    const { data: taskData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (taskData) setTasks(taskData);
  };

  useEffect(() => {
    fetchCoreData();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);

    // Auto-sync storefront status if an "Awaiting..." task is marked DONE from the board
    if (targetTask?.storefront_id && targetTask?.title?.toLowerCase().startsWith('awaiting')) {
      const targetClient = clients.find(c => c.id === targetTask.storefront_id);
      if (newStatus.toUpperCase() === 'DONE' && targetClient?.status === 'AWAITING_ASSETS') {
        await quickUpdateStorefrontStatus(targetTask.storefront_id, 'CONTENT_ASSEMBLY', {
          type: 'CONTENT_ASSEMBLY',
          message: `Dependency resolved (${targetTask.title}). Resuming build in Active Workshop.`,
          timestamp: new Date().toISOString()
        });
        fetchCoreData();
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm(TASK_COPY.MODAL.CONFIRM_DELETE)) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = selectedClientFilter === 'ALL'
    ? tasks
    : selectedClientFilter === 'INTERNAL'
      ? tasks.filter(t => !t.storefront_id)
      : tasks.filter(t => t.storefront_id === selectedClientFilter);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{copy.TITLE}</h1>
          <p className="text-sm text-zinc-400 mt-1">{copy.SUBTITLE}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">{copy.FILTER_ALL_CLIENTS}</option>
              <option value="INTERNAL">{copy.INTERNAL_OPTION}</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.business_name}</option>
              ))}
            </select>
          </div>

          <button 
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] cursor-pointer"
          >
            <Plus size={16} /> {copy.BTN_NEW}
          </button>
        </div>
      </div>

      <TaskBoard 
        tasks={filteredTasks} 
        clients={clients} 
        onUpdateStatus={handleUpdateStatus} 
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />

      {isModalOpen && (
        <TaskEditorModal 
          task={editingTask}
          preselectedStorefrontId={selectedClientFilter !== 'ALL' && selectedClientFilter !== 'INTERNAL' ? selectedClientFilter : ''}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }} 
          onSuccess={fetchCoreData}
        />
      )}
    </div>
  );
}