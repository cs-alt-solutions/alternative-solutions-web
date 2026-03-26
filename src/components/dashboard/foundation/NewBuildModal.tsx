/* src/components/dashboard/foundation/NewBuildModal.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { X, Rocket, Briefcase, Beaker, Calculator, DollarSign, Cpu, Loader2, Handshake, Percent, Tag, Wrench, Scale, Coffee, MoreHorizontal, CalendarClock } from 'lucide-react';
import { WEBSITE_COPY, SYSTEM_CONFIG } from '@/utils/glossary';

interface NewBuildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewBuildModal({ onClose, onSuccess }: NewBuildModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.NEW_BUILD_MODAL;
  
  // Advanced Hybrid Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'PROTOTYPE',
    client_name: '',
    compensation_types: ['FIXED'], // Now an array for Hybrid stacking
    
    // Fixed Capital
    fixed_amount: '', 
    fixed_schedule: 'UPFRONT', 
    
    // Rev Share
    rev_amount: '',
    rev_type: 'PERCENTAGE', 
    rev_trigger: 'GROSS_SALES',
    
    // Barter
    barter_category: 'GOODS',
    barter_terms: ''
  });

  const fixedNum = parseFloat(formData.fixed_amount) || 0;
  const platformCut = fixedNum * SYSTEM_CONFIG.FEES.PLATFORM_CUT; 
  const netProfit = fixedNum - platformCut;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type });
  };

  // Toggles the compensation models on/off
  const toggleCompType = (compType: string) => {
    setFormData(prev => {
      const types = prev.compensation_types;
      if (types.includes(compType)) {
        if (types.length === 1) return prev; // Prevent deselecting everything
        return { ...prev, compensation_types: types.filter(t => t !== compType) };
      } else {
        return { ...prev, compensation_types: [...types, compType] };
      }
    });
  };

  const handleBarterCategory = (category: string) => {
    setFormData({ ...formData, barter_category: category });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const compensationDetails = {
      fixed_schedule: formData.fixed_schedule,
      rev_amount: formData.rev_amount,
      rev_type: formData.rev_type,
      rev_trigger: formData.rev_trigger,
      barter_category: formData.barter_category
    };

    const { error } = await supabase.from('projects').insert({
      name: formData.title, // FIX: Explicitly mapping to the required "name" column
      title: formData.title, // Keeping title populated as well
      type: formData.type,
      client_name: formData.client_name,
      compensation_types: formData.compensation_types,
      target_amount: fixedNum, 
      barter_terms: formData.barter_terms,
      compensation_details: compensationDetails,
      status: 'DRAFTING',
      progress: 0
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
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Project Codename *</label>
                <input type="text" required name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Logistic Ops Interface" className="w-full bg-black border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Target Client</label>
                <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Who is this for?" className="w-full bg-black border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-brand-primary outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex">Architecture Classification</label>
              <div className="grid md:grid-cols-3 gap-4">
                <button type="button" onClick={() => handleTypeSelect('INTERNAL')} className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${formData.type === 'INTERNAL' ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)] text-cyan-400' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                  <Cpu size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Internal Core</span>
                </button>
                <button type="button" onClick={() => handleTypeSelect('PROTOTYPE')} className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${formData.type === 'PROTOTYPE' ? 'bg-fuchsia-500/10 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.1)] text-fuchsia-400' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                  <Beaker size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Spec Prototype</span>
                </button>
                <button type="button" onClick={() => handleTypeSelect('CLIENT')} className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${formData.type === 'CLIENT' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] text-emerald-400' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                  <Briefcase size={20} /> <span className="font-bold uppercase tracking-widest text-xs">Signed Contract</span>
                </button>
              </div>
            </div>

            {/* HYBRID VALUE EXCHANGE CONFIGURATOR */}
            <div className="pt-6 border-t border-slate-800">
              <label className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Handshake size={14} /> Hybrid Contract Builder (Select Multiple)
              </label>
              
              <div className="flex gap-2 mb-6 bg-black p-1.5 rounded-xl border border-slate-800">
                <button type="button" onClick={() => toggleCompType('FIXED')} className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.compensation_types.includes('FIXED') ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-slate-500 hover:text-white'}`}>Fixed Capital</button>
                <button type="button" onClick={() => toggleCompType('REV_SHARE')} className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.compensation_types.includes('REV_SHARE') ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-slate-500 hover:text-white'}`}>Rev Share</button>
                <button type="button" onClick={() => toggleCompType('BARTER')} className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.compensation_types.includes('BARTER') ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-slate-500 hover:text-white'}`}>Value Trade</button>
              </div>

              <div className="space-y-4">
                {/* 1. FIXED BLOCK */}
                {formData.compensation_types.includes('FIXED') && (
                  <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50 animate-in fade-in zoom-in-95">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Total Fixed Funding ($)</label>
                        <div className="relative">
                          <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="number" required name="fixed_amount" value={formData.fixed_amount} onChange={handleChange} placeholder="0.00" className="w-full bg-black border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Payment Schedule</label>
                        <div className="flex gap-2 h-11">
                          <button type="button" onClick={() => setFormData({...formData, fixed_schedule: 'UPFRONT'})} className={`flex-1 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border ${formData.fixed_schedule === 'UPFRONT' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}>Upfront</button>
                          <button type="button" onClick={() => setFormData({...formData, fixed_schedule: 'MILESTONES'})} className={`flex-1 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center justify-center gap-1 ${formData.fixed_schedule === 'MILESTONES' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}><CalendarClock size={12}/> Tiers</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REV SHARE BLOCK */}
                {formData.compensation_types.includes('REV_SHARE') && (
                  <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50 animate-in fade-in zoom-in-95">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Fee Structure</label>
                        <select name="rev_type" value={formData.rev_type} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-400 outline-none transition-colors cursor-pointer">
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FLAT_FEE">Flat Fee ($)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Rate / Amount</label>
                        <div className="relative">
                          {formData.rev_type === 'PERCENTAGE' ? <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /> : <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />}
                          <input type="number" step="0.01" required name="rev_amount" value={formData.rev_amount} onChange={handleChange} placeholder={formData.rev_type === 'PERCENTAGE' ? "10" : "0.20"} className="w-full bg-black border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Trigger Metric</label>
                        <select name="rev_trigger" value={formData.rev_trigger} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-amber-400 outline-none transition-colors cursor-pointer">
                          <option value="PER_TRANSACTION">Per Order/Transaction</option>
                          <option value="GROSS_SALES">Total Gross Volume</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. BARTER BLOCK */}
                {formData.compensation_types.includes('BARTER') && (
                  <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50 animate-in fade-in zoom-in-95">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex">Trade Category</label>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button type="button" onClick={() => handleBarterCategory('GOODS')} className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center gap-2 ${formData.barter_category === 'GOODS' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}><Tag size={12}/> Inventory</button>
                      <button type="button" onClick={() => handleBarterCategory('SERVICES_AUTO')} className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center gap-2 ${formData.barter_category === 'SERVICES_AUTO' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}><Wrench size={12}/> Auto Repair</button>
                      <button type="button" onClick={() => handleBarterCategory('SERVICES_LEGAL')} className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center gap-2 ${formData.barter_category === 'SERVICES_LEGAL' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}><Scale size={12}/> Consult</button>
                      <button type="button" onClick={() => handleBarterCategory('OTHER')} className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all border flex items-center gap-2 ${formData.barter_category === 'OTHER' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-black border-slate-800 text-slate-500 hover:text-white'}`}><MoreHorizontal size={12}/> Custom</button>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Specific Trade Terms</label>
                      <textarea 
                        required name="barter_terms" value={formData.barter_terms} onChange={handleChange} rows={2}
                        placeholder={formData.barter_category === 'GOODS' ? "e.g., Monthly supply of 5 disposables..." : "e.g., Free maintenance on fleet vehicles..."}
                        className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-400 outline-none transition-colors resize-none" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Real-Time Telemetry (Only active if Fixed Funding is present) */}
            {formData.compensation_types.includes('FIXED') && fixedNum > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden animate-in fade-in">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calculator size={12} /> Upfront Telemetry Matrix
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Gross Target</div>
                    <div className="text-lg font-bold text-white">${fixedNum.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tax / Reserve (15%)</div>
                    <div className="text-lg font-bold text-red-400">-${platformCut.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-brand-primary uppercase tracking-widest mb-1">Net Operating Fuel</div>
                    <div className="text-2xl font-black text-emerald-400">${netProfit.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="px-8 py-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 shrink-0 mt-auto">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
              Abort
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-2 py-4 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Rocket size={16} /> Deploy to Drafting Table</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}