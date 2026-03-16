/* src/components/shift-studio/xlg/CompetitorMatrix.tsx */
'use client';
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Database, LineChart, BrainCircuit, CheckSquare, Receipt, Wrench, Zap, X, Check } from 'lucide-react';

const getFeatureIcon = (feature: string) => {
  if (feature.includes('Inventory')) return <Database size={18} />;
  if (feature.includes('Profit')) return <LineChart size={18} />;
  if (feature.includes('AI')) return <BrainCircuit size={18} />;
  if (feature.includes('Tasks')) return <CheckSquare size={18} />;
  if (feature.includes('Bills')) return <Receipt size={18} />;
  if (feature.includes('Maintenance')) return <Wrench size={18} />;
  return <Zap size={18} />;
};

export default function CompetitorMatrix() {
  const { MATRIX } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE;

  return (
    <div className="w-full pb-24 relative">
      
      <div className="text-center mb-24 relative z-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-xs font-mono text-brand-primary uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          {MATRIX.TAG}
        </div>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {MATRIX.TITLE}
        </h3>
        <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto font-light leading-relaxed">
          {MATRIX.SUBTITLE}
        </p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        
        {/* THE NEURAL SPINE */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-linear-to-b from-transparent via-brand-primary/30 to-transparent -translate-x-1/2 z-0" />

        <div className="hidden md:flex items-center justify-between mb-24 px-4 relative z-10">
          <div className="w-5/12 flex justify-center">
            <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs uppercase tracking-widest font-bold backdrop-blur-md">
              <X size={16} className="text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" /> 
              {MATRIX.HEAD_STANDARD}
            </span>
          </div>
          <div className="w-2/12"></div>
          <div className="w-5/12 flex justify-center">
            <span className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-mono text-xs uppercase tracking-widest font-bold backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Check size={16} className="text-brand-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> 
              {MATRIX.HEAD_SHIFT}
            </span>
          </div>
        </div>

        <div className="space-y-32">
          {MATRIX.SECTIONS.map((section: any, idx: number) => (
            <div key={idx} className="relative">
              
              <div className="flex justify-center mb-16 relative z-20">
                <div className="px-8 py-3 bg-bg-app border border-white/10 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <span className="text-sm font-mono text-white/50 uppercase tracking-[0.4em] font-bold">
                    {section.TITLE}
                  </span>
                </div>
              </div>

              <div className="space-y-24">
                {section.ROWS.map((row: any, i: number) => (
                  <div key={i} className="relative flex flex-col md:flex-row items-center justify-center group">
                    
                    {/* HORIZONTAL WIRES */}
                    <div className="hidden md:flex absolute top-1/2 left-0 w-full h-[2px] z-0 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-1/2 h-full bg-linear-to-l from-orange-500/50 to-transparent" />
                      <div className="w-1/2 h-full bg-linear-to-r from-brand-primary/60 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    </div>

                    {/* LEFT NODE: THE OLD WAY (Error Log Style) */}
                    <div className="w-full md:w-5/12 md:pr-12 flex justify-end relative z-10 mb-8 md:mb-0">
                      <div className="w-full max-w-[320px] p-5 rounded-2xl bg-bg-surface-100/50 border border-white/5 backdrop-blur-md group-hover:bg-orange-500/5 group-hover:border-orange-500/30 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] group-hover:-translate-x-2 flex items-start gap-3">
                        <X size={16} className="text-orange-500/50 group-hover:text-orange-500 shrink-0 mt-0.5 transition-colors duration-500" />
                        <p className="text-white/50 font-light text-sm leading-relaxed group-hover:text-orange-100 transition-colors duration-500 text-left">
                          {row.duct}
                        </p>
                      </div>
                    </div>

                    {/* CENTER NODE */}
                    <div className="w-full md:w-2/12 flex justify-center relative z-20 mb-8 md:mb-0 shrink-0">
                      <div className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-full bg-bg-app border border-white/10 shadow-[0_0_40px_rgba(0,0,0,1)] group-hover:border-brand-primary/50 group-hover:shadow-[inset_0_0_20px_rgba(6,182,212,0.3),0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500 relative overflow-hidden group-hover:scale-110">
                        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="text-white/40 group-hover:text-brand-primary transition-colors duration-500 z-10 drop-shadow-[0_0_5px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                          {getFeatureIcon(row.feature)}
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/60 text-center leading-tight px-2 z-10 group-hover:text-white transition-colors duration-500">
                          {row.feature}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT NODE: THE VISUAL UPGRADE (Software Window Style) */}
                    <div className="w-full md:w-5/12 md:pl-12 flex justify-start relative z-10">
                      <div className="w-full max-w-[480px] rounded-2xl bg-bg-surface-100 border border-white/5 backdrop-blur-md group-hover:border-brand-primary/40 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden group-hover:translate-x-2 flex flex-col">
                        
                        {/* Sleek Window Title Bar */}
                        <div className="p-4 md:p-5 border-b border-white/5 bg-brand-primary/5 flex items-center justify-between">
                           <p className="text-white/90 font-bold text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:text-white transition-colors duration-500">
                             {row.shift}
                           </p>
                           <Check size={16} className="text-brand-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                        </div>

                        {/* Cinematic Image Container */}
                        {row.image && (
                          <div className="w-full aspect-video relative bg-black">
                            <img 
                               src={row.image} 
                               alt={row.feature} 
                               // Anchored top-left so it never chops the good UI parts off
                               className="absolute inset-0 w-full h-full object-cover object-left-top opacity-60 group-hover:opacity-100 transition-all duration-700" 
                            />
                            {/* Cyan Wash */}
                            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay pointer-events-none"></div>
                          </div>
                        )}
                        
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}