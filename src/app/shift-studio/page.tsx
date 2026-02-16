/* src/app/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';
import { 
  Settings, 
  Play, 
  Box, 
  TrendingUp, 
  Share2, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export default function ShiftStudioPage() {
  const { SHIFT_STUDIO_PAGE, JOIN_PAGE } = WEBSITE_COPY;
  const { ROADMAP, HERO, STATUS } = SHIFT_STUDIO_PAGE;
  const hype = JOIN_PAGE.HYPE;

  // Icons for the features grid
  const ICONS = [Box, TrendingUp, Share2];

  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden relative">
      
      {/* Industrial Grid & Stardust Background */}
      <div className="fixed inset-0 bg-stardust pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-brand-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        
        {/* --- HERO SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 mt-8">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]">
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

            {/* HERO VISUAL / VIDEO PLACEHOLDER */}
            <div className="relative aspect-video rounded-xl bg-bg-surface-100 border border-white/10 overflow-hidden group shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                        <Play fill="white" className="text-white ml-1" />
                    </div>
                 </div>
                 <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-mono text-white/60 uppercase tracking-widest">{hype.VIDEO_TITLE}</p>
                    <p className="text-sm font-bold text-white">{hype.VIDEO_DESC}</p>
                 </div>
            </div>
        </div>

        {/* --- MANIFESTO SECTION --- */}
        <div className="mb-32 text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em]">The Philosophy</h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase leading-tight">
                {hype.MANIFESTO.TITLE}
            </h3>
            <p className="text-xl text-text-muted font-light leading-relaxed">
                "{hype.MANIFESTO.TEXT}"
            </p>
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            {hype.CARDS.map((card: any, index: number) => {
                const Icon = ICONS[index];
                return (
                    <div key={index} className="bg-bg-surface-100 border border-white/5 p-8 rounded-xl hover:border-brand-primary/30 transition-colors group">
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                            <Icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{card.TITLE}</h3>
                        <p className="text-text-muted text-sm leading-relaxed">{card.DESC}</p>
                    </div>
                )
            })}
        </div>

        {/* --- ROADMAP VISUAL --- */}
        <div className="mb-32 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <MapPin className="text-brand-accent" size={24} />
                <h2 className="text-2xl font-bold uppercase tracking-widest">The Flight Plan</h2>
            </div>
            
            <div className="relative border-l border-white/10 ml-3 space-y-12">
                {/* Phase 1 */}
                <div className="relative pl-12">
                    <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-black" />
                    <h3 className="text-xl font-bold text-white mb-2">{ROADMAP.PHASE_1_TITLE}</h3>
                    <p className="text-text-muted max-w-xl">{ROADMAP.PHASE_1_DESC}</p>
                </div>
                 {/* Phase 2 */}
                 <div className="relative pl-12 opacity-50">
                    <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-black" />
                    <h3 className="text-xl font-bold text-white mb-2">{ROADMAP.PHASE_2_TITLE}</h3>
                    <p className="text-text-muted max-w-xl">{ROADMAP.PHASE_2_DESC}</p>
                </div>
            </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-2xl mx-auto space-y-8 mb-32">
            <h2 className="text-center text-xl font-bold uppercase tracking-widest text-white/40">Frequent Inquiries</h2>
            <div className="space-y-4">
                {hype.FAQ.map((item: any, i: number) => (
                    <div key={i} className="bg-bg-surface-100 border border-white/5 p-6 rounded-lg">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                             <CheckCircle2 size={16} className="text-brand-primary" /> {item.q}
                        </h4>
                        <p className="text-sm text-text-muted pl-6">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom Lead Capture (for long scrollers) */}
        <div className="p-8 md:p-12 w-full max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col items-center text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Ready to take control?</h2>
          <p className="text-sm text-text-muted mb-8 max-w-md">
            Secure your spot for the Shift Studio closed beta rollout.
          </p>
          <JoinForm source="Shift Studio" />
        </div>

      </div>
    </main>
  );
}