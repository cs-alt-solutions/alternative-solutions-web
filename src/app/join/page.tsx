/* src/app/join/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';
import { ChevronLeft, Play, Mic, Box, TrendingUp, Share2, MapPin, CheckCircle2 } from 'lucide-react';

export default function JoinPage() {
  const { JOIN_PAGE, SHIFT_STUDIO_PAGE } = WEBSITE_COPY;
  const hype = JOIN_PAGE.HYPE;
  const roadmap = SHIFT_STUDIO_PAGE.ROADMAP;

  // Icons for the cards
  const ICONS = [Box, TrendingUp, Share2];

  return (
    <main className="min-h-screen bg-bg-app flex flex-col relative overflow-x-hidden font-sans text-white">
      
      {/* BACKGROUND FX: Stardust Constellation */}
      <div className="fixed inset-0 bg-stardust pointer-events-none" />
      
      {/* Background Accent Orb */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Back Link */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted hover:text-white transition-colors">
            <ChevronLeft size={14} /> Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-24 relative z-10">
        
        {/* --- HERO SPLIT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-brand-accent">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                    Private Beta Access
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                    {JOIN_PAGE.TITLE} <span className="text-brand-primary">BETA</span>
                </h1>
                <p className="text-text-muted text-lg font-light max-w-lg leading-relaxed">
                    {JOIN_PAGE.SUBHEAD}
                </p>
                <div className="pt-4">
                    <JoinForm />
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
            {hype.CARDS.map((card, index) => {
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
        <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
                <MapPin className="text-brand-accent" size={24} />
                <h2 className="text-2xl font-bold uppercase tracking-widest">The Flight Plan</h2>
            </div>
            
            <div className="relative border-l border-white/10 ml-3 space-y-12">
                {/* Phase 1 */}
                <div className="relative pl-12">
                    {/* FIXED: -left-[5px] -> -left-1.25 */}
                    <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-black" />
                    <h3 className="text-xl font-bold text-white mb-2">{roadmap.PHASE_1_TITLE}</h3>
                    <p className="text-text-muted max-w-xl">{roadmap.PHASE_1_DESC}</p>
                </div>
                 {/* Phase 2 */}
                 <div className="relative pl-12 opacity-50">
                    {/* FIXED: -left-[5px] -> -left-1.25 */}
                    <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-black" />
                    <h3 className="text-xl font-bold text-white mb-2">{roadmap.PHASE_2_TITLE}</h3>
                    <p className="text-text-muted max-w-xl">{roadmap.PHASE_2_DESC}</p>
                </div>
            </div>
        </div>

        {/* --- PODCAST / AUDIO SECTION --- */}
        <div className="w-full bg-linear-to-r from-bg-surface-100 to-bg-surface-200 border border-white/5 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden mb-32">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center shrink-0 shadow-xl">
                <Mic size={32} className="text-brand-accent" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{hype.PODCAST_TITLE}</h3>
                <p className="text-text-muted max-w-xl">{hype.PODCAST_DESC}</p>
            </div>

            <button className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors shrink-0">
                Listen Now
            </button>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-center text-xl font-bold uppercase tracking-widest text-white/40">Frequent Inquiries</h2>
            <div className="space-y-4">
                {hype.FAQ.map((item, i) => (
                    <div key={i} className="bg-bg-surface-100 border border-white/5 p-6 rounded-lg">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                             <CheckCircle2 size={16} className="text-brand-primary" /> {item.q}
                        </h4>
                        <p className="text-sm text-text-muted pl-6">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </main>
  );
}