/* src/components/dashboard/tasks/TaskEditorModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { X, Loader2, Trash2 } from 'lucide-react';
import { TASK_COPY } from '@/config/dashboard/tasks';
import { quickUpdateStorefrontStatus } from '@/app/actions/storefronts';

const PRESET_OBJECTIVES = [
  "Initial Client Research & Architecture",
  "Configure Core Vibe, Colors & Typography",
  "Build Hero & Brand Story Sections",
  "Format Menu / Services & Capabilities",
  "Upload & Route Drop Vault Media",
  "Awaiting Menu / Product Photos",
  "Awaiting Bio / Brand Copy",
  "Awaiting Domain / DNS Access",
  "Awaiting Client Sign-Off & Review",
  "Final QA & Mobile Responsiveness Check",
  "Custom Objective..."
];

interface TaskEditorModalProps {
  task?: any;
  preselectedStorefrontId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskEditorModal({ 
  task, 
  preselectedStorefrontId = '', 
  onClose, 
  onSuccess 
}: TaskEditorModalProps) {
  const isEditing = !!task;
  const copy = TASK_COPY.MODAL;

  const isExistingCustom = isEditing && !PRESET_OBJECTIVES.includes(task.title);
  
  const [selectedPreset, setSelectedPreset] = useState(
    isEditing ? (isExistingCustom ? "Custom Objective..." : task.title) : PRESET_OBJECTIVES[0]
  );
  const [customTitle, setCustomTitle] = useState(isExistingCustom ? task.title : '');
  
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'TODO');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.split('T')[0] : '');
  const [storefrontId, setStorefrontId] = useState(task?.storefront_id || preselectedStorefrontId || '');
  
  const [clients, setClients] = useState<{id: string, name: string, status?: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchActiveClients = async () => {
      const { data } = await supabase
        .from('storefronts')
        .select('id, business_name, status')
        .eq('is_template', false)
        .not('status', 'in', '("PENDING","CANCELED","PROTOTYPE")')
        .order('business_name', { ascending: true });

      if (data) {
        setClients(data.map(d => ({ id: d.id, name: d.business_name, status: d.status })));
      }
    };
    fetchActiveClients();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = selectedPreset === "Custom Objective..." ? customTitle.trim() : selectedPreset;
    if (!finalTitle) return;

    setIsSaving(true);
    const payload = {
      title: finalTitle,
      description,
      status,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      storefront_id: storefrontId || null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from('tasks').update(payload).eq('id', task.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tasks').insert([payload]);
        if (error) throw error;
      }

      // AUTO-SYNC STOREFRONT STATUS WHEN "AWAITING..." TASKS ARE CREATED OR COMPLETED!
      if (storefrontId) {
        const targetClient = clients.find(c => c.id === storefrontId);
        const isAwaitingTask = finalTitle.toLowerCase().startsWith('awaiting');

        if (isAwaitingTask && status !== 'DONE' && targetClient && !['AWAITING_ASSETS', 'IN_REVIEW', 'ACTIVE', 'LIVE'].includes(targetClient.status || '')) {
          await quickUpdateStorefrontStatus(storefrontId, 'AWAITING_ASSETS', {
            type: 'AWAITING_ASSETS',
            message: `Paused for client dependency: ${finalTitle}`,
            timestamp: new Date().toISOString()
          });
        } else if (isAwaitingTask && status === 'DONE' && targetClient?.status === 'AWAITING_ASSETS') {
          await quickUpdateStorefrontStatus(storefrontId, 'CONTENT_ASSEMBLY', {
            type: 'CONTENT_ASSEMBLY',
            message: `Dependency resolved (${finalTitle}). Resuming build in Active Workshop.`,
            timestamp: new Date().toISOString()
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      alert("Error saving objective. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(copy.CONFIRM_DELETE)) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', task.id);
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            {isEditing ? copy.EDIT_TITLE : copy.CREATE_TITLE}
          </h2>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
              {copy.LABEL_TITLE}
            </label>
            <select 
              value={selectedPreset} 
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer mb-2 font-bold"
            >
              {PRESET_OBJECTIVES.map(obj => (
                <option key={obj} value={obj}>{obj}</option>
              ))}
            </select>

            {selectedPreset === "Custom Objective..." && (
              <input 
                type="text" 
                required 
                value={customTitle} 
                onChange={(e) => setCustomTitle(e.target.value)} 
                placeholder={copy.PLACEHOLDER_TITLE} 
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-cyan-400 focus:border-cyan-500 outline-none transition-colors animate-in fade-in slide-in-from-top-1"
                autoFocus
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                {copy.LABEL_CLIENT}
              </label>
              <select 
                value={storefrontId} 
                onChange={(e) => setStorefrontId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer"
              >
                <option value="">{copy.INTERNAL_HQ}</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                {copy.LABEL_DUE}
              </label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                {copy.LABEL_PRIORITY}
              </label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer font-bold uppercase tracking-wider"
              >
                <option value="LOW">{ TASK_COPY.PRIORITIES.LOW }</option>
                <option value="MEDIUM">{ TASK_COPY.PRIORITIES.MEDIUM }</option>
                <option value="HIGH">{ TASK_COPY.PRIORITIES.HIGH }</option>
                <option value="CRITICAL">{ TASK_COPY.PRIORITIES.CRITICAL }</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                {copy.LABEL_STATUS}
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none cursor-pointer font-bold uppercase tracking-wider"
              >
                <option value="TODO">{ TASK_COPY.COLUMNS.TODO }</option>
                <option value="IN_PROGRESS">{ TASK_COPY.COLUMNS.IN_PROGRESS }</option>
                <option value="DONE">{ TASK_COPY.COLUMNS.DONE }</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
              {copy.LABEL_DESC}
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder={copy.PLACEHOLDER_DESC} 
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-cyan-500 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4">
            {isEditing ? (
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={isDeleting || isSaving}
                className="p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all cursor-pointer"
                title={copy.BTN_DELETE}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {copy.BTN_CANCEL}
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {isSaving ? copy.BTN_SAVING : copy.BTN_SAVE}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}