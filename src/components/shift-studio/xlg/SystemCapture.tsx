/* src/components/shift-studio/xlg/SystemCapture.tsx */
'use client';
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import SystemMonitor from '@/components/core/SystemMonitor';
import { Camera, CheckCircle2 } from 'lucide-react';

import PhilosophySection from '../PhilosophySection';
import FeatureCards from '../FeatureCards';
import RoadmapTimeline from '../RoadmapTimeline';

const COLORS = ['text-brand-primary', 'text-fuchsia-400', 'text-emerald-400'];
const BGs = ['bg-brand-primary/10', 'bg-fuchsia-400/10', 'bg-emerald-400/10'];
const BORDERs = ['border-brand-primary/30', 'border-fuchsia-400/30', 'border-emerald-400/30'];
const SHADOW_COLORS = ['rgba(6,182,212,0.6)', 'rgba(232,121,249,0.6)', 'rgba(52,211,153,0.6)'];
const GLOW_ORBS = ['bg-brand-primary/20', 'bg-fuchsia-600/20', 'bg-emerald-600/20'];

export default function SystemCapture() {
  const { EVIDENCE } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE;

  return (
    <div className="w-full space-y-32 pb-12 animate-in fade-in duration-1000">
      
      {EVIDENCE.MODULES.map((mod: any, idx: number) => {
        const isEven = idx % 2 === 0;
        
        return (
          <div key={idx} className="relative group w-full">
            <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-24 items-center relative z-10`}>
              
              <div className="w-full lg:w-5/12 space-y-8">
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-widest shadow-inner w-fit ${BGs[idx % 3]} ${COLORS[idx % 3]} ${BORDERs[idx % 3]}`}>
                    <Camera size={14} className={idx === 0 ? "animate-pulse" : ""} /> {EVIDENCE.TAG}
                  </div>
                  <h4 className={`text-xs md:text-sm font-mono uppercase tracking-[0.3em] font-bold ${COLORS[idx % 3]}`}>
                    {mod.CAPTION}
                  </h4>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {mod.TITLE}
                  </h3>
                  <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed">
                    {mod.DESC}
                  </p>
                </div>
                
                <div className="space-y-4 pt-8 border-t border-white/10">
                  {mod.FACTS.map((fact: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-base text-white/90 font-medium">
                      <div className={`p-1 rounded-full border ${BGs[idx % 3]} ${COLORS[idx % 3]} ${BORDERs[idx % 3]}`}>
                         <CheckCircle2 size={14} style={{ filter: `drop-shadow(0 0 5px ${SHADOW_COLORS[idx % 3]})` }} /> 
                      </div>
                      {fact}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-7/12 relative">
                {mod.IMAGES.length === 1 ? (
                  <div className="transform transition-all duration-700 group-hover:scale-[1.03] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <SystemMonitor src={mod.IMAGES[0]} alt={mod.TITLE} caption={undefined} priority={idx === 0} />
                  </div>
                ) : (
                  <div className="relative h-full min-h-87.5 md:min-h-125">
                    <div className="absolute top-0 left-0 w-[85%] z-0 transform transition-all duration-700 group-hover:-translate-y-4 group-hover:-translate-x-2 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                      <SystemMonitor src={mod.IMAGES[0]} alt={`${mod.TITLE} Primary`} caption={undefined} priority={idx === 0} />
                    </div>
                    <div className="absolute bottom-[-15%] right-0 w-[65%] z-10 transform transition-all duration-700 group-hover:translate-y-2 group-hover:translate-x-4 drop-shadow-[0_30px_60px_rgba(0,0,0,1)]">
                      <SystemMonitor src={mod.IMAGES[1]} alt={`${mod.TITLE} Secondary`} caption={undefined} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`absolute top-1/2 ${isEven ? 'right-[5%]' : 'left-[5%]'} w-150 h-150 ${GLOW_ORBS[idx % 3]} rounded-full blur-[150px] -translate-y-1/2 pointer-events-none transition-opacity duration-700 opacity-40 group-hover:opacity-80`} />
          </div>
        );
      })}

      <div className="pt-32 mt-32 border-t border-white/10 relative z-20">
         <PhilosophySection />
         <FeatureCards />
         <RoadmapTimeline />
      </div>

    </div>
  );
}