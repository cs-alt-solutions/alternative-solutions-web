'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Link as LinkIcon, Mail, Flame, AtSign } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface Step2Props {
  activeSocials: Record<string, boolean>;
  socialHandles: Record<string, string>;
  toggleSocial: (network: string) => void;
  handleSocialInputChange: (network: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  originStory?: string;
  onOriginStoryChange?: (value: string) => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

export default function Step2Network({ 
  activeSocials, 
  socialHandles, 
  toggleSocial, 
  handleSocialInputChange, 
  onNext, 
  onPrev,
  originStory,
  onOriginStoryChange,
  formData,
  setFormData
}: Step2Props) {
  const copy = WIZARD_COPY.STEP_2;
  
  // 🚀 LOCAL REACT STATE: Guarantees typing works instantly even if parent props are missing!
  const [localStory, setLocalStory] = useState(() => originStory || formData?.originStory || '');

  const handleStoryUpdate = (val: string) => {
    setLocalStory(val);
    if (onOriginStoryChange) {
      onOriginStoryChange(val);
    } else if (setFormData && formData) {
      setFormData({ ...formData, originStory: val });
    }
  };

  const cleanAndSetHandle = (network: string, rawValue: string) => {
    if (network === 'other') {
      handleSocialInputChange(network, rawValue);
      return;
    }
    const cleaned = rawValue
      .replace(/^https?:\/\/(www\.)?[^\/]+\//i, '')
      .replace(/^@/, '')
      .trim();
    handleSocialInputChange(network, cleaned);
  };

  const isSocialValid = Object.keys(activeSocials).every(network => {
    if (activeSocials[network]) {
      return socialHandles[network] && socialHandles[network].trim() !== '';
    }
    return true; 
  });

  // Now checks localStory directly so you can NEVER get stuck!
  const isStoryValid = localStory.trim() !== '';
  const isLocalValid = isSocialValid && isStoryValid;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-10">
      
      {/* THE WELCOME HOOK & STALKING LICENSE */}
      <div className="space-y-2 mb-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-500 animate-text-gradient">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed font-normal">
          {copy.SUBTITLE}
        </p>
      </div>

      <div className="space-y-6">
        
        {/* CARD 1: THE NETWORK TOGGLES & STRICT INPUTS */}
        <div className="bg-zinc-900/30 border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl transition-all space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['instagram', 'facebook', 'x', 'linkedin'].map((network) => (
              <div 
                key={network} 
                className={`flex flex-col w-full rounded-xl border overflow-hidden transition-all duration-300 ${
                  activeSocials[network] 
                    ? 'bg-zinc-900/80 border-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                    : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <button 
                  type="button" 
                  onClick={() => toggleSocial(network)} 
                  className="flex items-center justify-between p-4 w-full transition-all cursor-pointer group"
                >
                  <span className="capitalize font-semibold text-sm text-zinc-200 group-hover:text-indigo-400 transition-colors">{network}</span>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeSocials[network] ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                    {activeSocials[network] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
                
                {activeSocials[network] && (
                  <div className="bg-zinc-950/80 border-t border-zinc-800/80 flex items-center px-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <span className="text-zinc-500 font-mono text-sm select-none pr-1 flex items-center gap-1">
                      <AtSign className="w-3.5 h-3.5 text-indigo-400" />
                    </span>
                    <input 
                      type="text"
                      placeholder={copy.PLACEHOLDERS.SOCIAL}
                      value={socialHandles[network] || ''}
                      onChange={(e) => cleanAndSetHandle(network, e.target.value)}
                      className="w-full bg-transparent py-3.5 px-2 text-zinc-100 focus:outline-none text-sm font-normal placeholder:text-zinc-600 font-mono transition-colors"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            ))}

            {/* OTHER LINK */}
            <div 
              className={`flex flex-col w-full md:col-span-2 rounded-xl border overflow-hidden transition-all duration-300 ${
                activeSocials['other'] 
                  ? 'bg-zinc-900/80 border-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'bg-zinc-950/40 border-zinc-800/80 border-dashed hover:border-zinc-700'
              }`}
            >
              <button 
                type="button" 
                onClick={() => toggleSocial('other')} 
                className="flex items-center justify-between p-4 w-full transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <LinkIcon className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" /> 
                  <span className="font-semibold text-sm text-zinc-200 group-hover:text-indigo-400 transition-colors">{copy.LABELS.OTHER_LINK}</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeSocials['other'] ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                  {activeSocials['other'] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
              
              {activeSocials['other'] && (
                <div className="bg-zinc-950/80 border-t border-zinc-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
                  <input 
                    type="url"
                    placeholder={copy.PLACEHOLDERS.OTHER}
                    value={socialHandles['other'] || ''}
                    onChange={(e) => cleanAndSetHandle('other', e.target.value)}
                    className="w-full bg-transparent py-3.5 px-4 text-zinc-100 focus:outline-none text-sm font-normal placeholder:text-zinc-600 font-mono transition-colors"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🚀 CARD 2: REQUIRED ORIGIN STORY & BADASS BRAG */}
        {copy.ORIGIN_STORY && (
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden group focus-within:border-indigo-500/50 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-focus-within:via-indigo-500/50 transition-all duration-700" />
            
            <div className="space-y-1.5">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{copy.ORIGIN_STORY.TITLE}</span>
              </h3>
              <p className="text-xs md:text-sm text-zinc-300 font-normal max-w-xl leading-relaxed">
                {copy.ORIGIN_STORY.SUBTITLE}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-baseline pr-1">
                <label className="text-xs font-semibold text-indigo-400 block pl-1 uppercase tracking-wider font-mono">
                  {copy.ORIGIN_STORY.LABEL}
                </label>
                {!isStoryValid && (
                  <span className="text-[10px] text-amber-400/80 font-medium uppercase tracking-wider animate-pulse font-mono">Required to Proceed</span>
                )}
              </div>
              <textarea 
                required
                rows={4}
                value={localStory}
                onChange={(e) => handleStoryUpdate(e.target.value)}
                className={`w-full bg-zinc-950/60 border rounded-xl p-4 text-zinc-100 focus:outline-none text-sm font-normal placeholder:text-zinc-600 transition-all shadow-inner resize-none leading-relaxed ${!isStoryValid ? 'border-zinc-800 focus:border-amber-400/80' : 'border-zinc-800/80 focus:border-indigo-500/50'}`} 
                placeholder={copy.ORIGIN_STORY.PLACEHOLDER} 
              />
              <span className="text-[11px] text-zinc-500 block pl-1 font-normal leading-relaxed">{copy.ORIGIN_STORY.HELPER}</span>
            </div>
          </div>
        )}

      </div>

      {/* CARD 3: HOW I COMMUNICATE */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 md:p-6 flex items-start gap-3.5 shadow-sm">
        <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-zinc-200 text-sm mb-1">{copy.COMMUNICATION.TITLE}</h4>
          <p className="text-zinc-400 leading-relaxed text-xs font-normal">
            {copy.COMMUNICATION.BODY}
          </p>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-4 border-t border-zinc-800/60 gap-4">
        <button 
          type="button" 
          onClick={onPrev}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Step 1</span>
        </button>
        <button 
          type="button" 
          onClick={onNext}
          disabled={!isLocalValid}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${isLocalValid ? 'text-zinc-950 bg-indigo-400 hover:bg-indigo-300 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:scale-[1.01]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          <span>{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}