'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface Step3Props {
  selectedVibe: string | null;
  setSelectedVibe: (vibe: string) => void;
  vibes: any[]; // <-- Restored our database pipeline!
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Vibe({ selectedVibe, setSelectedVibe, vibes, onNext, onPrev }: Step3Props) {
  const copy = WIZARD_COPY.STEP_3;
  const cluelessId = WIZARD_COPY.VIBES?.CLUELESS_ID || 'clueless';

  // We keep the styles mapped dynamically by ID, but using strict Tailwind classes (No inline hex!)
  const getVibeStyles = (id: string) => {
    switch(id) {
      case 'brutalist': return 'bg-yellow-400 border-4 border-black text-black font-black uppercase rounded-none transition-all';
      case 'neon': return 'bg-zinc-950 border border-fuchsia-500 text-cyan-400 font-mono rounded-lg transition-all';
      case 'minimal': return 'bg-white border border-gray-200 text-gray-900 font-sans rounded-xl transition-all';
      case 'organic': return 'bg-stone-100 border-stone-300 text-stone-700 font-serif rounded-[2rem] transition-all';
      case 'clueless': return 'bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 rounded-xl transition-all mt-4 sm:col-span-2';
      default: return 'bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-400">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {copy.SUBTITLE}
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          {vibes && vibes.length > 0 ? (
            vibes.map((vibe) => (
              <div 
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`relative p-8 cursor-pointer opacity-90 hover:opacity-100 ${getVibeStyles(vibe.id)} ${selectedVibe === vibe.id ? 'ring-4 ring-cyan-500' : ''}`}
              >
                {selectedVibe === vibe.id && vibe.id !== cluelessId && (
                  <div className="absolute top-4 right-4 text-current opacity-50">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                )}
                {vibe.id === cluelessId && <HelpCircle className="w-10 h-10 mb-4 opacity-50 mx-auto" />}
                <h4 className="text-2xl mb-2 tracking-wide font-bold">{vibe.title}</h4>
                <p className="opacity-80 text-base">{vibe.desc}</p>
              </div>
            ))
          ) : (
             <div className="sm:col-span-2 text-center text-zinc-500 py-8 border-2 border-dashed border-zinc-800 bg-zinc-900/50 rounded-xl font-mono uppercase tracking-widest text-sm">
                Awaiting Database Connection...
             </div>
          )}
        </div>

        {selectedVibe === cluelessId && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300 bg-fuchsia-500/10 border border-fuchsia-500/30 p-6 rounded-2xl text-center">
            <p className="text-fuchsia-300 font-bold text-lg mb-2">{copy.CLUELESS.HEADER}</p>
            <p className="text-sm text-fuchsia-400/70">
              {copy.CLUELESS.SUBTEXT}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
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
          disabled={!selectedVibe}
          className={`relative flex-1 overflow-hidden py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${selectedVibe ? 'text-white border border-fuchsia-500/50 hover:border-fuchsia-400 shadow-glow-fuchsia hover:scale-[1.02]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          {selectedVibe && (
            <div className="absolute left-0 top-0 h-full w-[75%] bg-linear-to-r from-blue-500 via-purple-500 to-fuchsia-500 opacity-60 transition-all duration-700 ease-out"></div>
          )}
          <span className="relative z-10">{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}