'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2, Shield, Wallet, Terminal, Zap, AlertTriangle } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';
import { useWizard } from './core/WizardContext';
import { submitStorefrontApplication } from '@/app/actions/storefront_applications';

const PILLAR_ICONS = [
  { Icon: Terminal, color: "text-amber-400" },
  { Icon: Wallet, color: "text-emerald-400" },
  { Icon: Zap, color: "text-cyan-400" }
];

export default function Step3Scope() {
  const router = useRouter();
  const { formData, updateForm, prevStep } = useWizard();
  const copy = WIZARD_COPY.STEP_3;
  
  const [isPledged, setIsPledged] = useState(Boolean(formData.isPledged));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    updateForm({
      targetPlan: 'standard', 
      priorityQueue: false,
      isPledged: true
    });

    try {
      const payload = new FormData();
      
      payload.append('name', formData.name || '');
      payload.append('email', formData.email || '');
      payload.append('projectName', formData.businessName || '');
      payload.append('socials', JSON.stringify(formData.socialHandles || {}));
      
      payload.append('selectedPlan', 'standard'); 
      payload.append('priorityQueue', 'false');
      
      const result = await submitStorefrontApplication(payload);
      
      if (result.success) {
        alert(copy.ALERTS?.SUCCESS || "Application successfully submitted!");
        setTimeout(() => router.push('/'), 1500);
      } else {
        throw new Error(result.error || copy.ALERTS?.ERROR);
      }
    } catch (error: any) {
      console.error("Submission Failed:", error);
      alert(error.message || copy.ALERTS?.ERROR);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 flex flex-col space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN} <span className="text-cyan-400">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          {copy.SUBTITLE_START} <span className="text-white font-semibold">{copy.SUBTITLE_HIGHLIGHT}</span> {copy.SUBTITLE_END}
        </p>
      </div>

      {/* THE LIVE CAPACITY BANNER (Krispy Kreme Style) */}
      <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative overflow-hidden">
          {/* Subtle glow effect behind the icon */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[50px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="p-3 bg-amber-500/20 rounded-xl shrink-0 border border-amber-500/40 relative z-10">
            <AlertTriangle className="text-amber-400 w-6 h-6 animate-pulse" />
          </div>
          
          <div className="text-center sm:text-left relative z-10">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">
              {copy.CAPACITY_BANNER?.STATUS || "LIVE ENGINE STATUS: AT CAPACITY"}
            </h3>
            <p className="text-xs text-amber-100/70 leading-relaxed font-medium">
              {copy.CAPACITY_BANNER?.BODY || "My drafting table is currently full with active client builds. Please still submit your application! You will be placed in a brief wait queue, and I will pull your file the exact moment a build slot opens."}
            </p>
          </div>
        </div>
      </div>

      {/* RULES OF ENGAGEMENT */}
      <div className="max-w-3xl mx-auto w-full pt-4 animate-in fade-in duration-500">
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-4 pl-2">{copy.PILLARS_TITLE}</h3>
        <div className="flex flex-col gap-3">
          {(copy.PILLARS || []).map((pillar: any, idx: number) => {
            const { Icon, color } = PILLAR_ICONS[idx] || PILLAR_ICONS[0];
            return (
              <div key={idx} className="bg-zinc-900/40 p-4 md:p-5 rounded-2xl border border-zinc-800/80 flex flex-col sm:flex-row gap-4 items-start relative overflow-hidden transition-colors">
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 shrink-0 mt-1">
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <h4 className="text-zinc-100 font-black tracking-widest uppercase text-xs mb-1.5">{pillar.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: pillar.body }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE PLEDGE CHECKBOX */}
      <div 
        onClick={() => setIsPledged(!isPledged)}
        className={`relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group mt-2 max-w-3xl mx-auto w-full ${
          isPledged ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'bg-zinc-950 border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <div className="flex items-center gap-5">
          <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
            isPledged ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'border-zinc-600 text-transparent group-hover:border-zinc-500'
          }`}>
            <CheckCircle2 size={18} className={isPledged ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
          </div>
          <span className={`font-black uppercase tracking-widest text-sm md:text-base transition-colors ${
            isPledged ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'
          }`}>
            {copy.PLEDGE.CHECKBOX_LABEL}
          </span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="w-full flex items-center justify-between pt-6 mt-auto border-t border-zinc-800/60 shrink-0">
        <button 
          type="button" onClick={prevStep} disabled={isSubmitting}
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors duration-300 disabled:opacity-50"
        >
          <ArrowLeft className="w-3 h-3" /> {copy.ACTIONS.BACK}
        </button>
        
        <button 
          type="button" onClick={handleSubmit} disabled={!isPledged || isSubmitting}
          className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            isPledged
              ? 'text-zinc-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.05] cursor-pointer' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {copy.ACTIONS.SUBMIT_LOADING}</>
          ) : (
            <>
              <Shield className="w-4 h-4" /> 
              {copy.ACTIONS.SUBMIT}
            </>
          )}
        </button>
      </div>

    </div>
  );
}