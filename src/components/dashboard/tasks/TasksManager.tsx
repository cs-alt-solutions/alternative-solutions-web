/* src/components/dashboard/tasks/TasksManager.tsx */
'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Plus, Loader2 } from 'lucide-react';
import TaskBoard from './TaskBoard';
import TaskEditorModal from './TaskEditorModal';

export default function TasksManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoreData = async () => {
    // 🚀 FIX: Only grab REAL clients, completely ignoring prototypes
    const { data: clientData } = await supabase
      .from('storefronts')
      .select('id, business_name')
      .eq('is_template', false); 
      
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

  const handleSaveTask = async (taskData: any) => {
    setIsSaving(true);
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description, // 🚀 ADDED: Passes the notes into the database
        storefront_id: taskData.storefront_id === 'internal' ? null : taskData.storefront_id,
        priority: taskData.priority,
        status: taskData.status,
        assignee: 'System'
      };

      const { error } = await supabase.from('tasks').insert([payload]);
      if (error) throw error;

      await fetchCoreData(); 
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Task Save Error:", err);
      alert("Failed to save task. Check console.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Global Task Grid</h1>
          <p className="text-sm text-zinc-400 mt-1">Cross-client command center.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold px-4 py-2.5 rounded-md transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
        >
          <Plus size={16} /> NEW TASK
        </button>
      </div>

      <TaskBoard tasks={tasks} clients={clients} />

      {isModalOpen && (
        <TaskEditorModal 
          activeClients={clients} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTask}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}