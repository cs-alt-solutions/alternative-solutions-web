/* src/app/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';
import AudioLogEntry from '@/components/AudioLogEntry';
import { supabase } from '@/utils/supabase';
import { Settings, Mic2 } from 'lucide-react';

// New Atomic Components
import ManifestoSection from '@/components/shift-studio/ManifestoSection';
import FeatureCards from '@/components/shift-studio/FeatureCards';
import RoadmapTimeline from '@/components/shift-studio/RoadmapTimeline';
import FaqSection from '@/components/shift-studio/FaqSection';
import BottomCta from '@/components/shift-studio/BottomCta';

export default async function ShiftStudioPage() {
  const { SHIFT_STUDIO_PAGE, JOIN_PAGE } = WEBSITE_COPY;
  const { HERO, STATUS, PODCAST_FEED } = SHIFT_STUDIO_PAGE;
  const hype = JOIN_PAGE.HYPE;

  const { data: audioLogs } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'ACTIVE') 
    .eq('category', 'BETA')
    .order('date', { ascending: false });

  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden relative">
      <div className="fixed inset-0 bg-stardust pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-brand-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 mt-8">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface-200 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <Settings size={12} className="animate-spin-slow" />
                    {STATUS}
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                    {HERO.TITLE}
                </h1>
                <p className="text-lg text-text-muted font-light leading-relaxed">
                    {HERO.SUBHEAD}
                </p>
                
                <div className="pt-4">
                    <JoinForm source="Shift Studio" />
                </div>
            </div>

            <div className="relative flex flex-col gap-4">
                 <div className="flex items-center gap-3 mb-2 px-2">
                    <Mic2 className="text-brand-primary animate-pulse" size={20} />
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white">{hype.PODCAST_TITLE}</h3>
                      <p className="text-xs text-text-muted">{hype.PODCAST_DESC}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                   {audioLogs && audioLogs.length > 0 ? (
                     audioLogs.map((log: any) => (
                       <AudioLogEntry key={log.id} log={log} />
                     ))
                   ) : (
                     <div className="p-8 border border-border-subtle bg-bg-surface-100 rounded-xl text-center text-xs text-text-muted font-mono uppercase">
                       {PODCAST_FEED.FALLBACK}
                     </div>
                   )}
                 </div>
            </div>
        </div>

        <ManifestoSection />
        <FeatureCards />
        <RoadmapTimeline />
        <FaqSection />
        <BottomCta />
      </div>
    </main>
  );
}