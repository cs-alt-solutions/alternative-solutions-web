import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { BrainCircuit, Terminal, Blocks, ArrowRight, Cpu, Network, ShieldAlert } from 'lucide-react';
import LiveStatusBadge from '@/components/core/LiveStatusBadge';

export default function BentoGrid() {
  const { BENTO } = WEBSITE_COPY.PUBLIC_SITE.HOME;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 animate-in fade-in duration-1000 delay-500">
      
      {/* 1. THE ORIGIN STORY CARD (6 Cols) - Security Vault Aesthetic */}
      <Link 
        href={BENTO.STORY.LINK} 
        className="md:col-span-12 lg:col-span-6 group relative bg-[#0a050f] border border-fuchsia-500/20 hover:border-fuchsia-500/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(232,121,249,0.05)] hover:shadow-[0_0_60px_rgba(232,121,249,0.2)] flex flex-col justify-between min-h-80"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d946ef0a_1px,transparent_1px),linear-gradient(to_bottom,#d946ef0a_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
        <ShieldAlert size={300} className="absolute -bottom-16 -right-16 text-fuchsia-500/5 group-hover:text-fuchsia-500/10 transition-all duration-700 transform rotate-6 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(232,121,249,0.3)]">
              <BrainCircuit size={20} />
            </div>
            <span className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20">
              {BENTO.STORY.TAG}
            </span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-fuchsia-50 transition-colors">
            {BENTO.STORY.TITLE}
          </h3>
          <p className="text-sm text-fuchsia-100/60 font-light leading-relaxed max-w-sm border-l-2 border-fuchsia-500/30 pl-4">
            {BENTO.STORY.DESC}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex items-center gap-2 text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
          {BENTO.STORY.CTA} <ArrowRight size={14} />
        </div>
      </Link>

      {/* 2. THE ECOSYSTEM DIRECTORY (6 Cols) - Matrix Terminal Aesthetic */}
      <Link 
        href={BENTO.PRODUCT.LINK}
        className="md:col-span-12 lg:col-span-6 group relative bg-[#050a0f] border border-brand-primary/20 hover:border-brand-primary/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:shadow-[0_0_60px_rgba(6,182,212,0.2)] flex flex-col justify-between min-h-80"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
        <Blocks size={300} className="absolute -bottom-16 -right-16 text-brand-primary/5 group-hover:text-brand-primary/10 transition-all duration-700 transform -rotate-6 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/40 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
               <Blocks size={20} />
            </div>
            <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
              {BENTO.PRODUCT.TAG}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-cyan-50 transition-colors">
            {BENTO.PRODUCT.TITLE}
          </h2>
          <p className="text-sm text-cyan-100/60 font-light max-w-sm leading-relaxed border-l-2 border-brand-primary/30 pl-4">
            {BENTO.PRODUCT.DESC}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex items-center gap-2 text-brand-primary font-mono text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
          {BENTO.PRODUCT.CTA} <ArrowRight size={14} />
        </div>
      </Link>

      {/* 3. SECTOR ZERO (7 Cols) - Live Radar Aesthetic */}
      <Link
        href={BENTO.BETA.LINK}
        className="md:col-span-12 lg:col-span-7 group relative bg-[#050f0a] border border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(52,211,153,0.1)] hover:shadow-[0_0_60px_rgba(52,211,153,0.3)] flex flex-col justify-between min-h-64"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(16,185,129,0.1)_0deg,transparent_60deg)] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  <Terminal size={18} />
               </div>
               <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                 {BENTO.BETA.TAG}
               </div>
            </div>
            
            {/* The New Core Component! */}
            <LiveStatusBadge label="Taking New Builds" />
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end flex-1 mt-4">
            <div className="md:col-span-7">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                {BENTO.BETA.TITLE}
              </h3>
              <p className="text-emerald-100/70 font-light text-sm leading-relaxed">
                {BENTO.BETA.DESC}
              </p>
            </div>
            
            <div className="md:col-span-5 flex justify-start md:justify-end">
              <div className="inline-flex items-center gap-3 text-black font-black text-[10px] font-mono uppercase tracking-widest bg-emerald-400 hover:bg-emerald-300 px-6 py-4 rounded-xl border border-emerald-200 transition-all duration-300 shadow-[0_0_30px_rgba(52,211,153,0.4)] group-hover:scale-105">
                {BENTO.BETA.CTA} <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 4. AI PHILOSOPHY CARD (5 Cols) - Neural Node Aesthetic */}
      <div className="md:col-span-12 lg:col-span-5 bg-[#080d14] border border-blue-500/30 rounded-3xl p-8 backdrop-blur-md flex flex-col relative overflow-hidden group hover:border-blue-500/60 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] min-h-64">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
        <Network size={200} className="absolute -top-10 -right-10 text-blue-500/10 group-hover:text-blue-500/20 transition-all duration-700 transform rotate-12 pointer-events-none" />
        
        <div className="relative z-10 mb-8 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/40 text-blue-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Cpu size={18} />
          </div>
          <h4 className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            {BENTO.TECH.TAG}
          </h4>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
             {BENTO.TECH.TITLE}
          </h3>
          <div className="bg-black/50 border border-blue-500/20 rounded-xl p-5 shadow-inner">
             <p className="text-blue-100/70 font-light text-sm leading-relaxed">
                {BENTO.TECH.DESC}
             </p>
          </div>
        </div>
      </div>

    </div>
  );
}