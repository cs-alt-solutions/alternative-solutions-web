/* src/components/dashboard/foundation/NewBuildModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { X, Rocket, Briefcase, Cpu, Loader2, Users } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface NewBuildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewBuildModal({ onClose, onSuccess }: NewBuildModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.NEW_BUILD_MODAL;

  // We fetch existing clients from the database to populate the dropdown
  const [existingClients, setExistingClients] = useState<any[]>([]);
  
  // Advanced Factory State
  const [formData, setFormData] = useState({
    title: '',
    type: 'INTERNAL', // Default to Internal
    clientMode: 'EXISTING', // 'EXISTING' or 'NEW'
    selectedClientId: '', // If existing
    newClientName: '', // If new
  });

  // Load clients when modal opens
  useEffect(() => {
    const fetchClients = async () => {
      // In the future, this will fetch from a dedicated 'clients' table. 
      // For now, we pull unique client names from existing projects as a fallback.
      const { data } = await supabase.from('projects').select('client_name').not('client_name', 'is', null);
      if (data) {
        const uniqueClients = Array.from(new Set(data.map(d => d.client_name)));
        setExistingClients(uniqueClients);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Determine the final client name based on our intelligent logic
    let finalClientName = null;
    if (formData.type === 'CLIENT' || formData.type === 'PROTOTYPE') {
      finalClientName = formData.clientMode === 'NEW' ? formData.newClientName : formData.selectedClientId;
    }

    const { error } = await supabase.from('projects').insert({
      name: formData.title,
      title: formData.title,
      type: formData.type,
      client_name: finalClientName,
      status: 'DRAFTING',
      progress: 0,
      // We will add target_url/demo_url here later when we wire up the iframes!
    });

    if (!error) {
      onSuccess();
      onClose();
    } else {
      console.error("Initialization Error:", error);
      alert(`Database Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 p-4">
      <div className="w-full max-w-2xl bg-bg-app border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest">{copy.TITLE}</h2>
            <p className="text-xs text-brand-primary font-mono uppercase tracking-widest mt-1">{copy.DESC}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* 1. PROJECT NAME */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Rocket size={12} /> Project Codename *
              </label>
              <input 
                type="text" 
                required 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g., Shift Studio V1" 
                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none transition-colors" 
              />
            </div>

            {/* 2. ARCHITECTURE CLASSIFICATION */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex">Architecture Classification</label>
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => handleTypeSelect('INTERNAL')} 
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${formData.type === 'INTERNAL' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)] text-cyan-400' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}
                >
                  <Cpu size={20} /> 
                  <span className="font-bold uppercase tracking-widest text-xs">Internal / SaaS</span>
                  <span className="text-[10px] font-mono text-slate-500">Built for the Alternative Solutions Ecosystem.</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => handleTypeSelect('CLIENT')} 
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${formData.type === 'CLIENT' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] text-emerald-400' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}
                >
                  <Briefcase size={20} /> 
                  <span className="font-bold uppercase tracking-widest text-xs">Client Work</span>
                  <span className="text-[10px] font-mono text-slate-500">Built for a specific external client or agency.</span>
                </button>
              </div>
            </div>

            {/* 3. INTELLIGENT CLIENT ROUTING (Only shows if CLIENT is selected) */}
            {formData.type === 'CLIENT' && (
              <div className="pt-6 border-t border-slate-800 animate-in fade-in zoom-in-95">
                <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users size={14} /> Client Assignment
                </label>
                
                <div className="flex gap-2 mb-4 bg-black p-1.5 rounded-xl border border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, clientMode: 'EXISTING'})} 
                    className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.clientMode === 'EXISTING' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    Existing Client
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, clientMode: 'NEW'})} 
                    className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.clientMode === 'NEW' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-transparent text-slate-500 hover:text-white'}`}
                  >
                    + New Client
                  </button>
                </div>

                {formData.clientMode === 'EXISTING' ? (
                  <select 
                    name="selectedClientId" 
                    value={formData.selectedClientId} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-4 text-sm text-white focus:border-emerald-400 outline-none transition-colors"
                  >
                    <option value="" disabled>Select a client from the Rolodex...</option>
                    {existingClients.map((client, idx) => (
                      <option key={idx} value={client}>{client}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    name="newClientName" 
                    value={formData.newClientName} 
                    onChange={handleChange} 
                    required 
                    placeholder="Enter new client name..." 
                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-4 text-sm text-white focus:border-emerald-400 outline-none transition-colors" 
                  />
                )}
              </div>
            )}

          </div>

          <div className="px-8 py-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 shrink-0 mt-auto">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
              Abort
            </button>
            <button type="submit" disabled={isSubmitting || !formData.title} className="flex-2 py-4 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Rocket size={16} /> Deploy to Drafting Table</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}