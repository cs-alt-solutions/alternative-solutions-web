'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { X, Lightbulb, Send, Plus, Trash2, ListChecks } from 'lucide-react';
import { logIdeaDirective } from '@/app/actions';

interface LogDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogDirectiveModal({ isOpen, onClose }: LogDirectiveModalProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [phases, setPhases] = useState<string[]>(['']);

  if (!isOpen) return null;

  const addPhase = () => setPhases([...phases, '']);
  const updatePhase = (index: number, value: string) => {
    const newPhases = [...phases];
    newPhases[index] = value;
    setPhases(newPhases);
  };
  const removePhase = (index: number) => setPhases(phases.filter((_, i) => i !== index));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('phases', JSON.stringify(phases.filter(p => p.trim() !== '')));
    const result = await logIdeaDirective(formData);
    if (result.success) {
      setPhases(['']);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-bg-app border border-white/10 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary"><Lightbulb size={20} /></div>
            <h2 className="text-lg font-black uppercase text-white tracking-widest">{copy.BTN_ADD}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40">
          <div>
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 block">System Directive Title</label>
            <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-bold uppercase tracking-tight" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select name="type" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-xs">
              <option value="FEATURE">FEATURE DEVELOPMENT</option>
              <option value="INFRA">INFRASTRUCTURE CORE</option>
              <option value="BUG">SYSTEM FIX</option>
            </select>
            <select name="priority" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-xs">
              <option value="LOW">LOW (OPTIMIZATION)</option>
              <option value="MEDIUM">MEDIUM (STANDARD)</option>
              <option value="HIGH">HIGH (ACCELERATED)</option>
              <option value="CRITICAL">CRITICAL (TITANIUM)</option>
            </select>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-brand-primary uppercase tracking-widest flex items-center gap-2"><ListChecks size={12} /> Strategic Phases</label>
              <button type="button" onClick={addPhase} className="text-[10px] font-mono text-white/40 hover:text-brand-primary flex items-center gap-1 transition-colors"><Plus size={12} /> ADD PHASE</button>
            </div>
            {phases.map((phase, index) => (
              <div key={index} className="flex gap-2">
                <input value={phase} onChange={(e) => updatePhase(index, e.target.value)} placeholder={`Phase ${index + 1}...`} className="flex-1 bg-white/2 border border-white/5 rounded-lg px-4 py-2 text-white text-xs" />
                <button type="button" onClick={() => removePhase(index)} className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="px-8 py-3 rounded-full bg-brand-primary text-black font-black text-xs uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Send size={14} className="inline mr-2" /> {copy.ACTIONS.AUTHORIZE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}