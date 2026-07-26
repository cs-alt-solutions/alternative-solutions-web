'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

interface PledgeAgreementProps {
  copy: any;
  isPledged: boolean;
  setIsPledged: (val: boolean) => void;
}

export default function PledgeAgreement({ copy, isPledged, setIsPledged }: PledgeAgreementProps) {
  // Default the first drawer open so they immediately see how it works!
  const [openSection, setOpenSection] = useState<number | null>(0);

  if (!copy) return null;

  const toggleSection = (idx: number) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  return (
    <div className="bg-zinc-950 border-2 border-teal-500/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_0_30px_rgba(20,184,166,0.1)] relative overflow-hidden transition-all">
      
      {/* Top Neon Accent Line (Tailwind v4 canonical syntax) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      {/* Header */}
      <div className="flex items-start gap-4 border-b border-zinc-800/80 pb-6">
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0 shadow-inner">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
            {copy.TITLE}
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed font-light">
            {copy.SUBTITLE}
          </p>
        </div>
      </div>

      {/* 🚀 THE ACCORDION ENGINE (Replaces the squished 4-box grid) */}
      <div className="space-y-2.5 py-1">
        {(copy.SECTIONS || []).map((sec: { heading: string; body: string }, idx: number) => {
          const isOpen = openSection === idx;
          return (
            <div 
              key={idx} 
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-zinc-900/90 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.08)]' 
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(idx)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-teal-400 font-mono text-xs font-black tracking-widest uppercase">
                  <span className={`w-2 h-2 rounded-full transition-transform duration-300 ${isOpen ? 'bg-teal-400 scale-125 shadow-[0_0_8px_rgba(45,212,191,1)]' : 'bg-zinc-600 group-hover:bg-teal-500/50'}`} />
                  <span className="text-zinc-200 group-hover:text-teal-300 transition-colors">{sec.heading}</span>
                </div>
                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 leading-relaxed font-light border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
                  {sec.body}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mandatory Checkbox Binding */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div 
          onClick={() => setIsPledged(!isPledged)}
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            isPledged 
              ? 'bg-teal-950/30 border-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.2)] scale-[1.01]' 
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {isPledged ? (
              <CheckSquare className="w-6 h-6 text-teal-400 animate-in zoom-in-50 duration-200" />
            ) : (
              <Square className="w-6 h-6 text-zinc-600" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs md:text-sm font-bold tracking-wide uppercase block text-teal-300">
              Mandatory Acknowledgment
            </span>
            <p className="text-xs leading-relaxed font-medium">
              {copy.CHECKBOX_LABEL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}