'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Settings2, Server, Globe, Sparkles } from 'lucide-react';

export default function SectorZeroPledge() {
  const copy = WEBSITE_COPY.SECTOR_ZERO;

  const getTheme = (index: number) => {
    switch (index) {
      case 0: return { color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/50', icon: <Settings2 size={24} /> };
      case 1: return { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/50', icon: <Server size={24} /> };
      case 2: return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', icon: <Globe size={24} /> };
      default: return { color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/50', icon: <Settings2 size={24} /> };
    }
  };

  return (
    <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 scroll-mt-32 relative">
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-40 pointer-events-none flex items-center justify-center">
        <div className="absolute w-96 h-96 bg-brand-primary/30 rounded-full blur-[100px] animate-[spin_10s_linear_infinite] origin-bottom-right" />
        <div className="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] animate-[spin_15s_linear_infinite_reverse] origin-top-left" />
      </div>

      <div className="bg-black/70 border border-white/10 hover:border-brand-primary/40 rounded-3xl p-8 lg:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 relative z-10 group overflow-hidden">
        
        {/* Subtle sweeping scanner line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary/50 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

        {/* TOP HALF: The Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 pb-12 border-b border-white/10 relative">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4 leading-none">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-fuchsia-400 block mb-2 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                {copy.THE_PLEDGE.TITLE_1}
              </span>
              {copy.THE_PLEDGE.TITLE_2}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-center relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-linear-to-b from-brand-primary via-fuchsia-500 to-transparent opacity-50 rounded-full hidden lg:block" />
            <p className="text-lg text-slate-300 font-light leading-relaxed">
              {copy.THE_PLEDGE.DESC}
            </p>
          </div>
        </div>

        {/* BOTTOM HALF: Static 3-Column Grid (No more Accordions) */}
        <div className="relative">
          <h3 className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
            <Sparkles size={16} className="text-brand-primary" /> {copy.REWARDS.TITLE}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {copy.REWARDS.RANKS.map((rank: any, index: number) => {
              const theme = getTheme(index);
              return (
                <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-brand-primary/50 transition-colors flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${theme.bg} ${theme.color} border ${theme.border}`}>
                    {theme.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{rank.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{rank.desc}</p>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}