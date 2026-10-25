/* src/components/dashboard/tasks/TaskEditorModal.tsx */
'use client';
import React, { useState } from 'react';
import { X, CheckSquare, Briefcase, AlertTriangle, Activity, Loader2, AlignLeft } from 'lucide-react';

const PRESET_OBJECTIVES = [
  { id: 'research', label: 'Initial Client Research & Architecture' },
  { id: 'awaiting_core', label: 'Awaiting Core Brand Assets (Logos, Copy)' },
  { id: 'awaiting_menu', label: 'Awaiting Menu / Product Photos' },
  { id: 'awaiting_feedback', label: 'Awaiting Client Feedback' },
  { id: 'assembly', label: 'Content Assembly & Injection' },
  { id: 'audit', label: 'Final Pre-Launch Audit' },
  { id: 'custom', label: 'Other (Custom Task...)' }
];

export default function TaskEditorModal({ activeClients, onClose, onSave, isSaving }: any) {
  const [objectiveType, setObjectiveType] = useState('research');
  
  const [formData, setFormData] = useState({
    title: PRESET_OBJECTIVES[0].label,
    customTitle: '',
    description: '',
    storefront_id: 'internal',
    priority: 'Medium',
    status: 'Todo'
  });

  const handleObjectiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setObjectiveType(val);
    
    if (val !== 'custom') {
      const matched = PRESET_OBJECTIVES.find(o => o.id === val);
      setFormData({ ...formData, title: matched?.label || '' });
    } else {
      setFormData({ ...formData, title: formData.customTitle });
    }
  };

  const handleCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, customTitle: e.target.value, title: e.target.value });
  };

  const handleSaveClick = () => {
    // Ensure we send the correct title based on the dropdown choice
    const finalTitle = objectiveType === 'custom' ? formData.customTitle : PRESET_OBJECTIVES.find(o => o.id === objectiveType)?.label;
    onSave({ ...formData, title: finalTitle });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            <CheckSquare size={16} className="text-cyan-400" /> New System Task
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Task Objective</label>
            <select 
              value={objectiveType}
              onChange={handleObjectiveChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
            >
              {PRESET_OBJECTIVES.map((obj) => (
                <option key={obj.id} value={obj.id}>{obj.label}</option>
              ))}
            </select>
          </div>

          {/* Reveals only if "Other" is selected */}
          {objectiveType === 'custom' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Custom Task Name</label>
              <input 
                type="text" 
                value={formData.customTitle}
                onChange={handleCustomTitleChange}
                className="w-full bg-zinc-900 border border-cyan-500/50 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="Type your custom objective..."
                autoFocus
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase size={12} /> Target Client
            </label>
            <select 
              value={formData.storefront_id}
              onChange={(e) => setFormData({...formData, storefront_id: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
            >
              <option value="internal">Alt Solutions (Internal)</option>
              {activeClients.map((client: any) => (
                <option key={client.id} value={client.id}>{client.business_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <AlignLeft size={12} /> Notes & Context (Optional)
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-white focus:border-cyan-500 outline-none transition-colors resize-none h-20 placeholder:text-zinc-600"
              placeholder="e.g. Waiting on photos of the new vegan burger..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle size={12} /> Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
              >
                <option value="Low">Low (Backlog)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="High">High (Urgent)</option>
                <option value="Critical">Critical (Blocker)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} /> Status
              </label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
              >
                <option value="Todo">Todo / Awaiting</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button 
            onClick={handleSaveClick}
            disabled={isSaving || !formData.title}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            {isSaving ? 'Deploying...' : 'Deploy Task'}
          </button>
        </div>
      </div>
    </div>
  );
}