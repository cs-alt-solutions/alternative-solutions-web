/* src/components/dashboard/settings/TaskLibraryManager.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { BookOpen, Plus, Trash2, Loader2, Save, X, AlignLeft } from 'lucide-react';

export default function TaskLibraryManager() {
  const [libraryTasks, setLibraryTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    default_priority: 'Medium'
  });

  const fetchLibrary = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('task_library')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setLibraryTasks(data);
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
    if (!window.confirm("Delete this master task from the library?")) return;
    const { error } = await supabase.from('task_library').delete().eq('id', id);
    if (!error) fetchLibrary();
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Master Task Library</h2>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
              Standard Operating Procedures
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewForm(!showNewForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            showNewForm ? 'bg-zinc-800 text-zinc-400' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30'
          }`}
        >
          {showNewForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Task</>}
        </button>
      </div>

      {showNewForm && (
        <div className="p-6 bg-cyan-500/5 border-b border-cyan-500/20 animate-in fade-in duration-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Standard Task Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-zinc-950 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                placeholder="e.g. Perform SEO Audit"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Default Priority</label>
              <select 
                value={formData.default_priority}
                onChange={(e) => setFormData({...formData, default_priority: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer"
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
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white h-20 resize-none focus:border-cyan-500 outline-none custom-scrollbar"
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

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 size={24} className="text-cyan-500 animate-spin" /></div>
        ) : libraryTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Library is empty.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {libraryTasks.map(task => (
              <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white truncate">{task.title}</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700">{task.default_priority}</span>
                  </div>
                  {task.description && <p className="text-[10px] font-mono text-zinc-500 truncate">{task.description}</p>}
                </div>
                <button onClick={() => handleDelete(task.id)} className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}