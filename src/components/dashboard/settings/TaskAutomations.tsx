/* src/components/dashboard/settings/TaskAutomations.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Zap, Plus, Trash2, Power, Loader2, Save, X, Activity, BookOpen } from 'lucide-react';

const TRIGGER_STATUSES = [
  { value: 'AWAITING_PAYMENT', label: 'Awaiting Payment (Checkout Sent)' },
  { value: 'PENDING_BUILD', label: 'Work Queue (Payment Cleared)' },
  { value: 'BUILDING_CORE', label: 'Core Architecture' },
  { value: 'IN_REVIEW', label: 'Client Verification' },
  { value: 'CONTENT_ASSEMBLY', label: 'Content Assembly' },
  { value: 'AWAITING_ASSETS', label: 'Awaiting Client Assets' },
  { value: 'ACTIVE', label: 'Live Production' }
];

export default function TaskAutomations() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [libraryTasks, setLibraryTasks] = useState<any[]>([]); // 🚀 NEW: Holds library tasks
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState({
    trigger_status: 'PENDING_BUILD',
    title: '',
    description: '',
    priority: 'Medium',
    is_active: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    // Fetch automations
    const { data: tmplData } = await supabase.from('task_templates').select('*').order('created_at', { ascending: true });
    if (tmplData) setTemplates(tmplData);
    
    // 🚀 NEW: Fetch library tasks for the dropdown
    const { data: libData } = await supabase.from('task_library').select('*').order('title', { ascending: true });
    if (libData) setLibraryTasks(libData);
    
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // 🚀 NEW: When you pick a library task, it auto-fills the automation rule!
  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const matchedTask = libraryTasks.find(t => t.title === selectedTitle);
    
    if (matchedTask) {
      setFormData({
        ...formData,
        title: matchedTask.title,
        description: matchedTask.description || '',
        priority: matchedTask.default_priority || 'Medium'
      });
    } else {
      setFormData({ ...formData, title: '' }); // Custom option fallback
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('task_templates').insert([formData]);
      if (error) throw error;
      await fetchData();
      setShowNewForm(false);
      setFormData({ trigger_status: 'PENDING_BUILD', title: '', description: '', priority: 'Medium', is_active: true });
    } catch (err) {
      alert("Failed to save automation.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('task_templates').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this automation rule?")) return;
    const { error } = await supabase.from('task_templates').delete().eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">System Automations</h2>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
              Event-driven task generation
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewForm(!showNewForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
            showNewForm ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
          }`}
        >
          {showNewForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Rule</>}
        </button>
      </div>

      {showNewForm && (
        <div className="p-6 bg-amber-500/5 border-b border-amber-500/20 animate-in fade-in duration-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} /> Trigger Event (When Status Becomes...)
              </label>
              <select 
                value={formData.trigger_status}
                onChange={(e) => setFormData({...formData, trigger_status: e.target.value})}
                className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
              >
                {TRIGGER_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={12} /> Select Master Task
              </label>
              {/* 🚀 NEW: Dropdown populated from the Library! */}
              <select 
                value={formData.title}
                onChange={handleLibrarySelect}
                className="w-full bg-zinc-950 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer"
              >
                <option value="" disabled>-- Select from Library --</option>
                {libraryTasks.map(lib => (
                  <option key={lib.id} value={lib.title}>{lib.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Task Details & Context (Copied from Library)</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-400 h-12 resize-none focus:border-amber-500 outline-none custom-scrollbar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving || !formData.title}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Rule
            </button>
          </div>
        </div>
      )}

      {/* The rest of the component (the map rendering active templates) remains exactly the same! */}
      <div className="p-6">
        {/* ... Keep the existing map code from before here ... */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="text-amber-500 animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/30">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">No automation rules configured.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map(template => {
              const triggerName = TRIGGER_STATUSES.find(s => s.value === template.trigger_status)?.label || template.trigger_status;
              
              return (
                <div key={template.id} className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl transition-all ${template.is_active ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-950 border-zinc-800/50 opacity-60'}`}>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        IF STATUS = {triggerName}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{template.title}</h3>
                    {template.description && (
                      <p className="text-[10px] font-mono text-zinc-500 truncate mt-1">{template.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                      template.priority === 'High' || template.priority === 'Critical' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                    }`}>
                      {template.priority}
                    </span>
                    
                    <div className="w-px h-6 bg-zinc-800 mx-1" />

                    <button 
                      onClick={() => toggleActive(template.id, template.is_active)}
                      className={`p-2 rounded-lg transition-colors border ${
                        template.is_active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Power size={14} />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}