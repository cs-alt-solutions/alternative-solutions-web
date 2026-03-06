/* src/app/products/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import AudioLogEntry from '@/components/AudioLogEntry';
import { supabase } from '@/utils/supabase';
import { Zap, Mic2, Camera, CheckCircle2 } from 'lucide-react';

import ManifestoSection from '@/components/shift-studio/ManifestoSection';
import FeatureCards from '@/components/shift-studio/FeatureCards';
import RoadmapTimeline from '@/components/shift-studio/RoadmapTimeline';
import FaqSection from '@/components/shift-studio/FaqSection';
import SystemMonitor from '@/components/core/SystemMonitor';
import BottomCta from '@/components/shift-studio/BottomCta';

export default async function ShiftStudioPage() {
  const { SHIFT_STUDIO_PAGE } = WEBSITE_COPY;
  const { HERO, STATUS, PODCAST_FEED, EVIDENCE } = SHIFT_STUDIO_PAGE;

  const { data: audioLogs } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'ACTIVE') 
    .eq('category', 'BETA')
    .order('date', { ascending: false });

  return (
    <main className="min-h-screen bg-bg-app font-sans text-white relative pt-32 pb-24 overflow-x-hidden">
      <div className="fixed inset-0 bg-stardust pointer-events-none opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        
        {/* CENTERED COMMAND HERO */}
        <section className="text-center max-w-4xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-8 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <Zap size={12} className="animate-pulse" />
                {STATUS}
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85] mb-6">
                {HERO.TITLE}
            </h1>
            <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed">
                {HERO.SUBHEAD}
            </p>
        </section>

        {/* NEW: THE EVIDENCE (ASYMMETRIC GRID) */}
        <section className="mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="flex items-center justify-center gap-3 mb-16">
            <Camera size={14} className="text-brand-primary" />
            <h2 className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em]">
              {EVIDENCE.TAG}
            </h2>
          </div>
          
          <div className="space-y-32 max-w-7xl mx-auto">
            {EVIDENCE.MODULES.map((mod, index) => {
              // Alternate layout: Even index = Image Left, Odd = Image Right
              const isImageLeft = index % 2 === 0;

              return (
                <div key={mod.ID} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  
                  {/* The Screenshot (Spans 8 columns out of 12 for massive focus) */}
                  <div className={`lg:col-span-8 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                    <SystemMonitor 
                      src={mod.IMAGE} 
                      alt={mod.TITLE} 
                      caption={mod.CAPTION}
                      priority={true} 
                    />
                  </div>

                  {/* The Intel Data Panel (Spans 4 columns) */}
                  <div className={`lg:col-span-4 space-y-8 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4 leading-none">
                        {mod.TITLE}
                      </h3>
                      <p className="text-text-muted font-light leading-relaxed">
                        {mod.DESC}
                      </p>
                    </div>

                    {/* Fun Facts / Data Points */}
                    <div className="space-y-3 pt-6 border-t border-white/5">
                      {mod.FACTS.map((fact: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80 font-mono uppercase tracking-widest">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* INTEL FEED (Moved Below the Evidence) */}
        <section className="mb-40 max-w-4xl mx-auto">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
                 <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <Mic2 className="text-brand-primary" size={18} />
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-white">{PODCAST_FEED.TITLE}</h3>
                          <p className="text-[10px] text-text-muted font-mono uppercase">{PODCAST_FEED.SUBHEAD}</p>
                        </div>
                    </div>
                 </div>
                 <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                   {audioLogs && audioLogs.length > 0 ? (
                     audioLogs.map((log: any) => (
                       <AudioLogEntry key={log.id} log={log} />
                     ))
                   ) : (
                     <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-[10px] font-mono uppercase text-white/20 tracking-widest">
                       {PODCAST_FEED.FALLBACK}
                     </div>
                   )}
                 </div>
            </div>
        </section>

        {/* LOGIC CORE */}
        <ManifestoSection />
        
        {/* UNIFIED ENGINE MODULES */}
        <FeatureCards />
        
        {/* THE PLAN */}
        <RoadmapTimeline />
        <FaqSection />
        
        {/* FORM ANCHORED AT THE BOTTOM */}
        <BottomCta />
      </div>
    </main>
  );
}