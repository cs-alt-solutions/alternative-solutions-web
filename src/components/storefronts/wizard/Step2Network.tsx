'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Instagram, Facebook, Twitter, Linkedin, Youtube, Link as LinkIcon, Hash } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';
import { useWizard } from './core/WizardContext'; 

export default function Step2Network() {
  const { formData, updateForm, nextStep, prevStep } = useWizard();
  const copy = WIZARD_COPY.STEP_2;

  // 1. Toggles | 2. Usernames 
  const [internalStep, setInternalStep] = useState(1);
  const totalInternalSteps = 2; // Reduced to 2!

  const activeSocials = formData.activeSocials || {};
  const socialHandles = formData.socialHandles || {};

  // Check how many networks they actually selected
  const selectedNetworksCount = Object.values(activeSocials).filter(Boolean).length;

  // The actual icons to display
  const NETWORKS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'tiktok', label: 'TikTok', icon: Hash }, 
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'other', label: 'Other Link', icon: LinkIcon }
  ];

  const toggleSocial = (network: string) => {
    updateForm({
      activeSocials: {
        ...activeSocials,
        [network]: !activeSocials[network]
      }
    });
  };

  const cleanAndSetHandle = (network: string, rawValue: string) => {
    let cleaned = rawValue;
    if (network !== 'other') {
      cleaned = rawValue
        .replace(/^https?:\/\/(www\.)?[^\/]+\//i, '')
        .replace(/^@/, '')
        .trim();
    }
    updateForm({
      socialHandles: {
        ...socialHandles,
        [network]: cleaned
      }
    });
  };

  const canProceed = () => {
    if (internalStep === 1) return true; // They can proceed with 0 selected
    if (internalStep === 2) {
      // Must have typed a handle for every active network
      return Object.keys(activeSocials).every(network => {
        if (activeSocials[network]) {
          return socialHandles[network] && socialHandles[network].trim() !== '';
        }
        return true; 
      });
    }
    return false;
  };

  const handleNext = () => {
    if (internalStep === 1 && selectedNetworksCount === 0) {
      // Smart Skip: If they didn't select any networks, skip usernames and go straight to Step 3
      nextStep();
    } else if (internalStep < totalInternalSteps) {
      setInternalStep(prev => prev + 1);
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (internalStep > 1) {
      setInternalStep(prev => prev - 1);
    } else {
      prevStep(); // Returns to the global Step 1
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500 min-h-125 flex flex-col">
      
      {/* FORCES EVERYTHING DEAD CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full py-8 my-auto text-center">
        
        {/* STATIC HEADER (No longer dynamic since story is gone!) */}
        <div className="space-y-4 w-full">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
            {copy.TITLE_MAIN}
            <span className="text-cyan-400">{copy.TITLE_HIGHLIGHT}</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
            {copy.SUBTITLE}
          </p>
        </div>

        {/* THE INPUT AREA */}
        <div className="w-full relative flex justify-center">

          {/* STEP 2A: THE ICONS (Grid of clickable platforms) */}
          {internalStep === 1 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {NETWORKS.map((net) => {
                  const isActive = activeSocials[net.id];
                  const Icon = net.icon;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => toggleSocial(net.id)}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-zinc-900/80 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] scale-105' 
                          : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 transition-colors ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span className="text-xs font-bold uppercase tracking-widest">{net.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2B: THE USERNAMES */}
          {internalStep === 2 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full max-w-lg space-y-6">
              {NETWORKS.filter(n => activeSocials[n.id]).map((net) => {
                const Icon = net.icon;
                return (
                  <div key={net.id} className="relative flex items-center w-full">
                    {/* The sleek icon prefix */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 text-zinc-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <input 
                      type={net.id === 'other' ? 'url' : 'text'}
                      value={socialHandles[net.id] || ''}
                      onChange={(e) => cleanAndSetHandle(net.id, e.target.value)}
                      className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-cyan-400 text-left pl-14 pr-4 text-xl md:text-2xl text-white outline-none transition-all pb-3 placeholder:text-zinc-700"
                      placeholder={net.id === 'other' ? copy.PLACEHOLDERS.OTHER : copy.PLACEHOLDERS.SOCIAL}
                      autoFocus={Object.keys(activeSocials)[0] === net.id} // Auto-focus the first selected item
                      onKeyDown={(e) => e.key === 'Enter' && canProceed() ? handleNext() : null}
                    />
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* FOOTER ACTIONS - Locked to the bottom */}
      <div className="w-full flex items-center justify-between pt-6 mt-auto border-t border-zinc-800/60 shrink-0">
        <button 
          type="button" 
          onClick={handleBack}
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        
        <button 
          type="button" 
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            canProceed() 
              ? 'text-zinc-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.05] cursor-pointer' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <span>{internalStep === totalInternalSteps ? copy.ACTIONS.NEXT : "Continue"}</span>
          {internalStep !== totalInternalSteps && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}