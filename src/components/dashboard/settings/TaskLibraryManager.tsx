/* src/components/dashboard/settings/TaskLibraryManager.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { BookOpen, Plus, Loader2, Save, X, AlignLeft, ChevronDown, ChevronUp, ShieldAlert, Trash2, Settings } from 'lucide-react';

export default function TaskLibraryManager() {
  const [libraryTasks, setLibraryTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  
  // Modal & Security State
  const [activeEditTask, setActiveEditTask] = useState<any | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    default_priority: 'Medium'
  });

  const fetchLibrary = async () => {
    setIsLoading(true);
    
    // Fetch the library tasks
    const { data: libData } = await supabase.from('task_library').select('*').order('created_at', { ascending: false });
    
    // Fetch automations to count how many triggers are using each library task
    const { data: triggerData } = await supabase.from('task_templates').select('title');
    
    if (libData) {
      const enrichedData = libData.map(task => {
        const usageCount = triggerData ? triggerData.filter(t => t.title === task.title).length : 0;
        return { ...task, triggerCount: usageCount };
      });
      setLibraryTasks(enrichedData);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchLibrary(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('task_library').insert([formData]);
      if (error) throw error;
      
      await fetchLibrary();
      setShowNewForm(false);
      setFormData({ title: '', description: '', default_priority: 'Medium' });
    } catch (err) {
      alert("Failed to save library task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmText !== 'DELETE') return;
    const { error } = await supabase.from('task_library').delete().eq('id', id);
    if (!error) {
      setActiveEditTask(null);
      setDeleteConfirmText('');
      fetchLibrary();
    }
  };

  const openSettings = (task: any) => {
    setActiveEditTask(task);
    setDeleteConfirmText('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
      <div 
        className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/70 transition-colors"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 shadow-inner">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Master Task Library</h2>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
              Standard Operating Procedures
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowNewForm(!showNewForm); setIsPanelOpen(true); }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              showNewForm ? 'bg-zinc-800 text-zinc-400' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
            }`}
          >
            {showNewForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Task</>}
          </button>
          {isPanelOpen ? <ChevronUp size={20} className="text-zinc-500" /> : <ChevronDown size={20} className="text-zinc-500" />}
        </div>
      </div>

      {isPanelOpen && (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          {showNewForm && (
            <div className="p-6 bg-cyan-500/5 border-b border-cyan-500/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Standard Task Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-cyan-500/30 rounded-lg px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none shadow-inner"
                    placeholder="e.g. Perform SEO Audit"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Default Priority</label>
                  <select 
                    value={formData.default_priority}
                    onChange={(e) => setFormData({...formData, default_priority: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer shadow-inner"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><AlignLeft size={12}/> Standard Instructions</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-white h-20 resize-none focus:border-cyan-500 outline-none custom-scrollbar shadow-inner"
                  placeholder="What exactly needs to happen when this task is assigned?"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !formData.title}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save to Library
                </button>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6 bg-black/40 flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="text-cyan-500 animate-spin" /></div>
            ) : libraryTasks.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/30">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Library is empty.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-800/80 rounded-xl bg-zinc-950 shadow-md">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="px-5 py-4">Standard Operation</th>
                      <th className="px-5 py-4">Standard Instructions</th>
                      <th className="px-5 py-4 text-center">Default Priority</th>
                      <th className="px-5 py-4 text-center">Automations</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {libraryTasks.map(task => (
                      <tr key={task.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[250px]">{task.title}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-xs font-mono text-zinc-500 truncate max-w-[250px] md:max-w-xs">
                            {task.description || "No instructions provided."}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                            task.default_priority === 'High' || task.default_priority === 'Critical' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                          }`}>
                            {task.default_priority}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                            {task.triggerCount} Triggers
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openSettings(task); }}
                            className="p-1.5 inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                            title="Manage Master Task"
                          >
                            <Settings size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MANAGE & DELETE TASK */}
      {activeEditTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Settings size={16} className="text-cyan-400" /> Manage Library Task
              </h2>
              <button onClick={() => setActiveEditTask(null)} className="text-zinc-500 hover:text-white transition-colors p-1 bg-black rounded border border-zinc-800">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Task Title</label>
                  <div className="text-sm font-bold text-white bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                    {activeEditTask.title}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Standard Instructions</label>
                  <div className="text-xs font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg min-h-[80px] whitespace-pre-wrap">
                    {activeEditTask.description || "No instructions provided."}
                  </div>
                </div>
              </div>

              {/* 2-STEP DELETION SECURITY */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl overflow-hidden p-5 flex flex-col gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 rounded-md border border-red-500/30 shrink-0">
                    <ShieldAlert size={16} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-red-400 uppercase tracking-[0.2em]">Danger Zone</h3>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Permanently remove this master task from the library. This will not delete previously generated tasks, but it will no longer be available for future automations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="bg-black border border-red-500/30 rounded-md px-3 py-2 text-[10px] text-red-400 font-mono tracking-widest focus:outline-none focus:border-red-500 flex-1 text-center"
                  />
                  <button
                    onClick={() => handleDelete(activeEditTask.id)}
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <Trash2 size={12} /> Purge Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}