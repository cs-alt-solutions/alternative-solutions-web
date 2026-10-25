/* src/components/dashboard/settings/TaskAutomations.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Zap, Plus, Power, Loader2, Save, X, Activity, BookOpen, ShieldAlert, Trash2, Settings, AlignLeft } from 'lucide-react';

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
  const [libraryTasks, setLibraryTasks] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  
  // Modal & Security State (No more accordions)
  const [activeEditRule, setActiveEditRule] = useState<any | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [formData, setFormData] = useState({
    trigger_status: 'PENDING_BUILD',
    title: '',
    description: '',
    priority: 'Medium',
    is_active: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data: tmplData } = await supabase.from('task_templates').select('*').order('created_at', { ascending: true });
    if (tmplData) setTemplates(tmplData);
    
    const { data: libData } = await supabase.from('task_library').select('*').order('title', { ascending: true });
    if (libData) setLibraryTasks(libData);
    
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

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
      setFormData({ ...formData, title: '' });
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

  const toggleActive = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('task_templates').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) {
      await fetchData();
      // If they toggle it from inside the modal, update the modal state too
      if (activeEditRule && activeEditRule.id === id) {
        setActiveEditRule({ ...activeEditRule, is_active: !currentStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmText !== 'DELETE') return;
    const { error } = await supabase.from('task_templates').delete().eq('id', id);
    if (!error) {
      setActiveEditRule(null);
      setDeleteConfirmText('');
      fetchData();
    }
  };

  const openSettings = (rule: any) => {
    setActiveEditRule(rule);
    setDeleteConfirmText('');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all">
      <div 
        className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/70 transition-colors"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 shadow-inner">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">System Automations</h2>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
              Event-driven task generation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowNewForm(!showNewForm); setIsPanelOpen(true); }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              showNewForm ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
            }`}
          >
            {showNewForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Rule</>}
          </button>
        </div>
      </div>

      {isPanelOpen && (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          {showNewForm && (
            <div className="p-6 bg-amber-500/5 border-b border-amber-500/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={12} /> Trigger Event (When Status Becomes...)
                  </label>
                  <select 
                    value={formData.trigger_status}
                    onChange={(e) => setFormData({...formData, trigger_status: e.target.value})}
                    className="w-full bg-zinc-950 border border-amber-500/30 rounded-lg px-4 py-3 text-xs text-white focus:border-amber-500 outline-none cursor-pointer shadow-inner"
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
                  <select 
                    value={formData.title}
                    onChange={handleLibrarySelect}
                    className="w-full bg-zinc-950 border border-cyan-500/30 rounded-lg px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer shadow-inner"
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-400 h-16 resize-none focus:border-amber-500 outline-none custom-scrollbar shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-white focus:border-amber-500 outline-none cursor-pointer shadow-inner"
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

          <div className="p-4 sm:p-6 bg-black/40 flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="text-amber-500 animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/30">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">No automation rules configured.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-800/80 rounded-xl bg-zinc-950 shadow-md">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="px-5 py-4">Trigger Event</th>
                      <th className="px-5 py-4">Generated Task</th>
                      <th className="px-5 py-4 text-center">Priority</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {templates.map(template => {
                      const triggerName = TRIGGER_STATUSES.find(s => s.value === template.trigger_status)?.label || template.trigger_status;
                      
                      return (
                        <tr key={template.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="px-5 py-4">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm border ${template.is_active ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-zinc-500 bg-zinc-800/50 border-zinc-700'}`}>
                              {triggerName}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className={`text-sm font-bold truncate max-w-[200px] md:max-w-[250px] ${template.is_active ? 'text-white' : 'text-zinc-500'}`}>{template.title}</div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                              !template.is_active ? 'text-zinc-600 border-zinc-700 bg-zinc-800/50' :
                              template.priority === 'High' || template.priority === 'Critical' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
                            }`}>
                              {template.priority}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button 
                              onClick={(e) => toggleActive(template.id, template.is_active, e)}
                              className={`p-1.5 rounded-md transition-colors border flex items-center justify-center mx-auto ${
                                template.is_active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white'
                              }`}
                              title={template.is_active ? "Rule Active (Click to Pause)" : "Rule Paused (Click to Activate)"}
                            >
                              <Power size={12} />
                            </button>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openSettings(template); }}
                              className="p-1.5 inline-flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
                              title="Manage Automation Rule"
                            >
                              <Settings size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MANAGE & DELETE AUTOMATION */}
      {activeEditRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Settings size={16} className="text-amber-400" /> Manage Automation Rule
              </h2>
              <button onClick={() => setActiveEditRule(null)} className="text-zinc-500 hover:text-white transition-colors p-1 bg-black rounded border border-zinc-800">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Trigger Event</label>
                  <div className="text-sm font-bold text-amber-400 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                    {TRIGGER_STATUSES.find(s => s.value === activeEditRule.trigger_status)?.label || activeEditRule.trigger_status}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Generated Task</label>
                  <div className="text-sm font-bold text-white bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                    {activeEditRule.title}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1 flex items-center gap-1.5"><AlignLeft size={12}/> Embedded Context</label>
                  <div className="text-xs font-mono text-zinc-400 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg min-h-[60px] whitespace-pre-wrap">
                    {activeEditRule.description || "No standard instructions provided."}
                  </div>
                </div>
              </div>

              {/* Status Toggle from within Modal */}
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Rule Status</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Toggle whether this automation fires.</p>
                </div>
                <button 
                  onClick={() => toggleActive(activeEditRule.id, activeEditRule.is_active)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeEditRule.is_active ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white'
                  }`}
                >
                  <Power size={12} /> {activeEditRule.is_active ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* 2-STEP DELETION SECURITY */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl overflow-hidden p-5 flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 rounded-md border border-red-500/30 shrink-0">
                    <ShieldAlert size={16} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black text-red-400 uppercase tracking-[0.2em]">Danger Zone</h3>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Permanently obliterate this automation rule.
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
                    onClick={() => handleDelete(activeEditRule.id)}
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <Trash2 size={12} /> Purge Rule
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