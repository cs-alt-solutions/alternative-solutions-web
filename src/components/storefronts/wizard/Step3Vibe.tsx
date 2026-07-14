'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';

interface Step3Props {
  selectedVibe: string | null;
  setSelectedVibe: (vibe: string) => void;
  vibes: any[];
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Vibe({ selectedVibe, setSelectedVibe, vibes, onNext, onPrev }: Step3Props) {
  // Helper to re-apply your specific "Vibe" styles
  const getVibeStyles = (id: string) => {
    switch(id) {
      case 'brutalist': return 'bg-[#E6FF00] border-4 border-black text-black font-black uppercase rounded-none transition-all';
      case 'neon': return 'bg-zinc-950 border border-fuchsia-500 text-cyan-400 font-mono rounded-lg transition-all';
      case 'minimal': return 'bg-white border border-gray-200 text-gray-900 font-sans rounded-xl transition-all';
      case 'organic': return 'bg-[#F4F1EA] border-[#D1CEC7] text-[#5C564A] font-serif rounded-[2rem] transition-all';
      case 'clueless': return 'bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 rounded-xl transition-all';
      default: return 'bg-zinc-900 border border-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      {/* Centered narrative that lives above the inputs */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          Set the <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-400">Vibe.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          This is where you tell me what kind of energy your brand gives off. Pick the style that speaks to you, and I’ll take care of the rest.
        </p>
      </div>
      
      {/* The centered Vibe Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
          {vibes.map((vibe) => (
            <div 
              key={vibe.id}
              onClick={() => setSelectedVibe(vibe.id)}
              className={`relative p-8 cursor-pointer opacity-90 hover:opacity-100 ${getVibeStyles(vibe.id)} ${selectedVibe === vibe.id ? 'ring-4 ring-cyan-500' : ''} ${vibe.id === 'clueless' ? 'mt-4 sm:col-span-2' : ''}`}
            >
              {selectedVibe === vibe.id && vibe.id !== 'clueless' && (
                <div className="absolute top-4 right-4 text-current opacity-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              )}
              {vibe.id === 'clueless' && <HelpCircle className="w-10 h-10 mb-4 opacity-50 mx-auto" />}
              <h4 className="text-2xl mb-2 tracking-wide font-bold">{vibe.title}</h4>
              <p className="opacity-80 text-base">{vibe.desc}</p>
            </div>
          ))}
        </div>

        {selectedVibe === 'clueless' && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300 bg-fuchsia-500/10 border border-fuchsia-500/30 p-6 rounded-2xl text-center">
            <p className="text-fuchsia-300 font-bold text-lg mb-2">Fuck yeah. I'll engineer a custom look that fits you perfectly.</p>
            <p className="text-sm text-fuchsia-400/70">
              (If you're paralyzed by choices, don't sweat it. Pick this, and I'll handle the design.)
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
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
          className={`relative flex-1 overflow-hidden py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${selectedVibe ? 'text-white border border-fuchsia-500/50 hover:border-fuchsia-400 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:scale-[1.02]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          {selectedVibe && (
            <div className="absolute left-0 top-0 h-full w-[75%] bg-linear-to-r from-blue-500 via-purple-500 to-fuchsia-500 opacity-60 transition-all duration-700 ease-out"></div>
          )}
          <span className="relative z-10">Dope. Let's talk scope 🚀</span>
        </button>
      </div>
    </div>
  );
}