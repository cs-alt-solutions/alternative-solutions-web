'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from './core/WizardContext';
import { CheckCircle, Shield, Loader2, Layout, AlertTriangle, Terminal } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';
import { submitStorefrontApplication } from '@/app/actions/storefront_applications';

// Map specific icons and colors to the pillars by index so the UI stays crisp
const PILLAR_ICONS = [
  { Icon: Layout, color: "text-cyan-400" },
  { Icon: Terminal, color: "text-amber-400" },
  { Icon: Shield, color: "text-emerald-400" },
  { Icon: AlertTriangle, color: "text-rose-400" }
];

export default function Step5Pledge() {
  const router = useRouter();
  const { formData, updateForm, prevStep } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = WIZARD_COPY.STEP_5;

  const togglePledge = () => {
    updateForm({ isPledged: !formData.isPledged });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Format payload with all client info and architectural choices
      const payload = new FormData();
      payload.append('name', formData.name || '');
      payload.append('email', formData.email || '');
      payload.append('phone', formData.phone || '');
      payload.append('projectName', formData.businessName || '');
      payload.append('description', formData.description || '');
      payload.append('socials', JSON.stringify(formData.socialHandles || {}));
      
      // Architecture Selections
      payload.append('selectedVibe', formData.themeStyle || 'clueless');
      payload.append('brandColor', formData.brandColor || 'cyan');
      payload.append('heroLayout', formData.heroLayout || 'centered');
      payload.append('storyLayout', formData.storyLayout || 'classic-split');
      payload.append('contentLayout', formData.contentLayout || 'stacked');
      
      // Scope & Plan Options
      payload.append('selectedPlan', formData.targetPlan || 'standard');
      payload.append('tagline', formData.tagline || '');
      payload.append('wantsCustom', (formData.headlineMode === 'custom').toString());
      payload.append('existingDomain', formData.customDomain || '');
      payload.append('priorityQueue', formData.priorityQueue ? 'true' : 'false');
      
      const result = await submitStorefrontApplication(payload);

      if (result.success) {
        alert(copy.ALERTS.SUCCESS);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error(result.error || copy.ALERTS.ERROR);
      }
    } catch (error: any) {
      console.error("Submission Failed:", error);
      alert(error.message || copy.ALERTS.ERROR);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 max-w-3xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <h2 className="text-4xl font-black uppercase tracking-widest text-white">
          {copy.TITLE_MAIN}<span className="text-emerald-400">{copy.TITLE_HIGHLIGHT}</span>
        </h2>
        <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
          {copy.SUBTITLE}
        </p>
      </div>

      {/* The 4 Pillars (Linear Stack Layout mapped from config) */}
      <div className="flex flex-col gap-4">
        {copy.PILLARS.map((pillar, idx) => {
          const { Icon, color } = PILLAR_ICONS[idx] || PILLAR_ICONS[0];
          const isHardBoundary = idx === 3;
          
          return (
            <div 
              key={idx} 
              className="bg-zinc-900/40 p-5 md:p-6 rounded-2xl border border-zinc-800/80 flex flex-col md:flex-row gap-4 md:gap-6 items-start relative overflow-hidden hover:border-zinc-700 transition-colors"
            >
              {isHardBoundary && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50" />}
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 shrink-0">
                <Icon size={20} className={color} /> 
              </div>
              <div>
                <h4 className="text-zinc-100 font-black tracking-widest uppercase text-sm mb-2">
                  {pillar.title}
                </h4>
                <p 
                  className="text-sm text-zinc-400 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: pillar.body }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Agreement Checkbox */}
      <div 
        onClick={togglePledge}
        className={`relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group mt-4 ${
          formData.isPledged 
            ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
            : 'bg-zinc-950 border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <div className="flex items-center gap-5">
          <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
            formData.isPledged 
              ? 'bg-emerald-500 border-emerald-500 text-zinc-950' 
              : 'border-zinc-600 text-transparent group-hover:border-zinc-500'
          }`}>
            <CheckCircle size={18} className={formData.isPledged ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
          </div>
          <span className={`font-black uppercase tracking-widest text-sm md:text-base transition-colors ${
            formData.isPledged ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'
          }`}>
            {copy.AGREEMENT.CHECKBOX_LABEL}
          </span>
        </div>
      </div>

      {/* Navigation & Submit Controls */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-zinc-800/50 mt-2 gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-4 sm:py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          {copy.ACTIONS.BACK}
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!formData.isPledged || isSubmitting}
          className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 disabled:hover:bg-emerald-500 text-zinc-950 text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {copy.ACTIONS.SUBMITTING}
            </>
          ) : (
            <>
              <Shield size={18} />
              {copy.ACTIONS.SUBMIT}
            </>
          )}
        </button>
      </div>

    </div>
  );
}