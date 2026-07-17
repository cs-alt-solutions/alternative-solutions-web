'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, Link as LinkIcon, Mail } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface Step2Props {
  activeSocials: Record<string, boolean>;
  socialHandles: Record<string, string>;
  toggleSocial: (network: string) => void;
  handleSocialInputChange: (network: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Network({ activeSocials, socialHandles, toggleSocial, handleSocialInputChange, onNext, onPrev }: Step2Props) {
  const copy = WIZARD_COPY.STEP_2;
  
  const isLocalValid = Object.keys(activeSocials).every(network => {
    if (activeSocials[network]) {
      return socialHandles[network] && socialHandles[network].trim() !== '';
    }
    return true; 
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          {copy.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['instagram', 'facebook', 'x', 'linkedin'].map((network) => (
          <div 
            key={network} 
            className={`flex flex-col w-full bg-zinc-900/40 rounded-2xl border overflow-hidden transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 ${activeSocials[network] ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}
          >
            <button 
              type="button" 
              onClick={() => toggleSocial(network)} 
              className="flex items-center justify-between p-5 w-full transition-all"
            >
              <span className="capitalize font-medium text-lg text-white">{network}</span>
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeSocials[network] ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
                {activeSocials[network] && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>
            
            {activeSocials[network] && (
              <div className="bg-zinc-950 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
                 <input 
                  type="text"
                  placeholder={copy.PLACEHOLDERS.SOCIAL}
                  value={socialHandles[network] || ''}
                  onChange={(e) => handleSocialInputChange(network, e.target.value)}
                  className="w-full bg-transparent py-4 px-5 text-white focus:outline-none text-sm placeholder:text-zinc-600"
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}

        <div 
          className={`flex flex-col w-full md:col-span-2 bg-zinc-900/40 rounded-2xl border overflow-hidden transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 ${activeSocials['other'] ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-zinc-800 border-dashed hover:border-zinc-600'}`}
        >
          <button 
            type="button" 
            onClick={() => toggleSocial('other')} 
            className="flex items-center justify-between p-5 w-full transition-all"
          >
            <div className="flex items-center gap-3 text-zinc-300">
              <LinkIcon className="w-5 h-5" /> 
              <span className="font-medium text-lg text-white">{copy.LABELS.OTHER_LINK}</span>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeSocials['other'] ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'}`}>
              {activeSocials['other'] && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </button>
          
          {activeSocials['other'] && (
            <div className="bg-zinc-950 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
                <input 
                type="url"
                placeholder={copy.PLACEHOLDERS.OTHER}
                value={socialHandles['other'] || ''}
                onChange={(e) => handleSocialInputChange('other', e.target.value)}
                className="w-full bg-transparent py-4 px-5 text-white focus:outline-none text-sm placeholder:text-zinc-600"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 flex items-start gap-4">
          <Mail className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-white text-lg mb-1">{copy.COMMUNICATION.TITLE}</h4>
            <p className="text-zinc-400 leading-relaxed text-sm">
              {copy.COMMUNICATION.BODY}
            </p>
          </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-zinc-800/50 mt-8">
        <button 
          type="button" 
          onClick={onPrev}
          className="px-6 py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          type="button" 
          onClick={onNext}
          disabled={!isLocalValid}
          className={`relative flex-1 overflow-hidden py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${isLocalValid ? 'text-white border border-indigo-500/50 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          <span className="relative z-10">{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}