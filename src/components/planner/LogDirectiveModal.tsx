/* src/components/planner/LogDirectiveModal.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { X, Lightbulb, Send, Plus, Trash2, ListChecks, Calendar } from 'lucide-react';
import { logIdeaDirective } from '@/app/actions';

interface LogDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogDirectiveModal({ isOpen, onClose }: LogDirectiveModalProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [phases, setPhases] = useState<string[]>(['']);
  const [destination, setDestination] = useState<'LEDGER' | 'FLOW'>('LEDGER');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('phases', JSON.stringify(phases.filter(p => p.trim() !== '')));
    
    if (destination === 'LEDGER') {
      formData.delete('scheduled_date');
    }

    const result = await logIdeaDirective(formData);
    if (result.success) {
      setPhases(['']);
      setDestination('LEDGER');
      setScheduledDate('');
      setIsSubmitting(false);
      onClose();
    } else {
      setIsSubmitting(false);
      // Lead Architect Note: Add error toast here if needed
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary"><Lightbulb size={20} /></div>
            <h2 className="text-sm font-black uppercase text-white tracking-[0.2em] italic">{copy.BTN_ADD}</h2>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Deployment Target</label>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setDestination('LEDGER')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all ${destination === 'LEDGER' ? 'bg-white text-black font-black' : 'text-white/40 hover:text-white'}`}
              >
                IDEAS LEDGER
              </button>
              <button
                type="button"
                onClick={() => setDestination('FLOW')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all ${destination === 'FLOW' ? 'bg-brand-primary text-black font-black' : 'text-white/40 hover:text-white'}`}
              >
                ACTIVE FLOW
              </button>
            </div>
          </div>

          {destination === 'FLOW' && (
            <div className="animate-in slide-in-from-top-4 duration-300">
               <label className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-3 block">Execution Date</label>
               <input 
                  type="date" 
                  name="scheduled_date" 
                  required 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-primary transition-colors" 
               />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Directive Title</label>
            <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-brand-primary/50 transition-colors" placeholder="ENTER DIRECTIVE..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Classification</label>
              <select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-brand-primary/50 appearance-none">
                <option value="FEATURE">FEATURE</option>
                <option value="INFRA">INFRASTRUCTURE</option>
                <option value="BUG">SYSTEM FIX</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Intensity</label>
              <select name="priority" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-brand-primary/50 appearance-none">
                <option value="Low">LOW</option>
                <option value="Medium">MEDIUM</option>
                <option value="High">HIGH</option>
                <option value="Critical">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-brand-primary uppercase tracking-widest flex items-center gap-2"><ListChecks size={14} /> Strategic Phases</label>
              <button type="button" onClick={addPhase} className="text-[9px] font-mono text-white/40 hover:text-brand-primary flex items-center gap-1 transition-colors uppercase">ADD PHASE</button>
            </div>
            <div className="space-y-2">
              {phases.map((phase, index) => (
                <div key={index} className="flex gap-2">
                  <input value={phase} onChange={(e) => updatePhase(index, e.target.value)} placeholder={`PHASE 0${index + 1}...`} className="flex-1 bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-white text-[10px] font-mono uppercase focus:outline-none focus:border-brand-primary/50 transition-colors" />
                  <button type="button" onClick={() => removePhase(index)} className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-black font-black py-5 rounded-2xl text-[10px] font-mono uppercase tracking-[0.3em] transition-all shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.2)] disabled:opacity-50"
            >
              {isSubmitting ? "AUTHORIZING..." : copy.ACTIONS.AUTHORIZE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}