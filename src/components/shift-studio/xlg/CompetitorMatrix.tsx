/* src/components/shift-studio/xlg/CompetitorMatrix.tsx */
'use client';
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Database, LineChart, BrainCircuit, CheckSquare, Receipt, Wrench, Zap, X, ArrowRight } from 'lucide-react';

const getFeatureIcon = (feature: string) => {
  if (feature.includes('Inventory')) return <Database size={20} />;
  if (feature.includes('Profit')) return <LineChart size={20} />;
  if (feature.includes('AI')) return <BrainCircuit size={20} />;
  if (feature.includes('Tasks')) return <CheckSquare size={20} />;
  if (feature.includes('Bills')) return <Receipt size={20} />;
  if (feature.includes('Maintenance')) return <Wrench size={20} />;
  return <Zap size={20} />;
};

export default function CompetitorMatrix() {
  const { MATRIX } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE;

  return (
    <div className="w-full pb-32 relative">
      
      {/* HEADER */}
      <div className="text-center mb-32 relative z-20">
        <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          {MATRIX.TITLE}
        </h3>
        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          {MATRIX.SUBTITLE}
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto space-y-40">
        {MATRIX.SECTIONS.map((section: any, idx: number) => (
          <div key={idx} className="relative">
            
            {/* Floating Section Title */}
            <div className="absolute -left-12 top-0 bottom-0 flex items-center justify-center opacity-10 hidden xl:flex">
              <span className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-transparent transform -rotate-90 origin-center whitespace-nowrap tracking-tighter">
                {section.TITLE}
              </span>
            </div>

            <div className="space-y-24">
              {section.ROWS.map((row: any, i: number) => (
                <div key={i} className="group relative flex flex-col md:flex-row items-center gap-12 md:gap-24">
                  
                  {/* LEFT: The Label & The Old Way (Minimalist) */}
                  <div className="w-full md:w-5/12 space-y-8 z-10 relative">
                    <div className="flex items-center gap-4 text-white/80 group-hover:text-white transition-colors">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-all duration-500">
                        {getFeatureIcon(row.feature)}
                      </div>
                      <h4 className="text-2xl font-bold uppercase tracking-widest">
                        {row.feature}
                      </h4>
                    </div>

                    <div className="pl-4 border-l-2 border-orange-500/20 py-2">
                       <span className="flex items-center gap-2 text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-3">
                         <X size={12} /> {MATRIX.HEAD_STANDARD}
                       </span>
                       <p className="text-lg text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors">
                         {row.duct}
                       </p>
                    </div>
                  </div>

                  {/* CENTER: The Bridge Arrow */}
                  <div className="hidden md:flex text-white/10 group-hover:text-brand-primary/50 transition-colors duration-500 z-10">
                    <ArrowRight size={32} />
                  </div>

                  {/* RIGHT: The Shift Studio Asset (The Star) */}
                  <div className="w-full md:w-6/12 relative z-10">
                    <div className="relative rounded-[2rem] overflow-hidden border border-white/5 bg-linear-to-br from-white/5 to-transparent backdrop-blur-sm transition-all duration-700 group-hover:border-brand-primary/30 group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] group-hover:-translate-y-2">
                       
                       <div className="p-8 md:p-10 relative z-20">
                         <span className="inline-flex items-center gap-2 text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                           {MATRIX.HEAD_SHIFT}
                         </span>
                         <p className="text-2xl text-white font-medium leading-relaxed drop-shadow-md">
                           {row.shift}
                         </p>
                       </div>

                       {row.image && (
                         <div className="relative w-full h-48 md:h-64 mt-4 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                           {/* Masking the image to fade out at the top perfectly into the card */}
                           <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a] via-transparent to-transparent z-10" />
                           <img 
                             src={row.image} 
                             alt={row.feature} 
                             className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-110 transition-all duration-700 scale-100 group-hover:scale-105"
                           />
                         </div>
                       )}
                    </div>
                    {/* Background Ambient Glow on Hover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-primary/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none -z-10" />
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}