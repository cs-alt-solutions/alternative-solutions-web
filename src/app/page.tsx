/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden font-sans">
      
      {/* --- NEON AMBIENCE --- */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      
      {/* Immersive Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-fuchsia-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-40">
        
        {/* ========================================================= */}
        {/* 1. THE HERO HOOK */}
        {/* ========================================================= */}
        <section className="text-center mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          
          <div className="inline-block border border-cyan-400/30 bg-cyan-950/40 px-6 py-2 rounded-full text-cyan-400 text-sm font-bold mb-10 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm tracking-widest">
            NO VC FUNDING. NO CORPORATE FLUFF. JUST REAL TOOLS.
          </div>
          
          <h1 className="text-white text-6xl md:text-[8rem] font-black tracking-tighter mb-8 leading-none drop-shadow-2xl">
            WORK LESS.<br />
            {/* LIQUID NEON ANIMATION APPLIED HERE */}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-fuchsia-400 to-amber-400 animate-text-gradient">OPERATE BETTER.</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-16">
            The industry standard software is bloated, expensive, and broken. 
            <br className="hidden md:block" />
            <span className="text-white font-bold italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">We are building the alternative.</span>
          </p>
        </section>

        {/* ========================================================= */}
        {/* 2. THE ECOSYSTEM GRID (BENTO BOX LAYOUT) */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          
          {/* THE PRODUCT: SHIFT STUDIO */}
          <Link 
            href="/products/shift-studio" 
            className="md:col-span-2 group relative bg-bg-app/80 backdrop-blur-md border border-cyan-900/50 hover:border-cyan-400/80 rounded-3xl p-10 md:p-16 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.05)] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 font-mono text-9xl font-black text-cyan-500 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">01</div>
            
            <h3 className="font-mono text-cyan-400 tracking-widest text-sm mb-6 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">The Flagship</h3>
            <h2 className="text-4xl md:text-5xl text-white font-black mb-6 tracking-tight">Shift Studio</h2>
            <p className="text-xl text-slate-300 font-light leading-relaxed max-w-xl mb-12">
              Stop duct-taping five different platforms together. Shift Studio connects your sales, marketing, operations, and inventory into one single, high-performance operating system.
            </p>
            
            <div className="inline-flex items-center gap-3 text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/30 px-6 py-3 rounded-full border border-cyan-500/30 group-hover:bg-cyan-400 group-hover:text-black transition-all">
              Enter The Studio <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          {/* THE STORY */}
          <Link 
            href="/founder" 
            className="group relative bg-bg-app/80 backdrop-blur-md border border-fuchsia-900/50 hover:border-fuchsia-400/80 rounded-3xl p-10 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(232,121,249,0.05)] hover:shadow-[0_0_50px_rgba(232,121,249,0.25)] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-mono text-fuchsia-400 tracking-widest text-sm mb-6 uppercase drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]">The Story</h3>
              <h2 className="text-3xl text-white font-black mb-4 tracking-tight">Who is building this?</h2>
              <p className="text-slate-300 font-light leading-relaxed mb-8">
                No massive tech company. No VC funding. Just 20 years of cross-industry intel and the drive to do the f****** work.
              </p>
            </div>
            
            <div className="text-fuchsia-400 font-bold tracking-widest uppercase text-sm group-hover:text-fuchsia-300 transition-colors">
              Read the Manifesto <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
            </div>
          </Link>

          {/* THE BETA CENTER */}
          <Link 
            href="/blueprint" 
            className="md:col-span-3 group relative bg-bg-app/80 backdrop-blur-md border border-emerald-900/50 hover:border-emerald-400/80 rounded-3xl p-10 md:p-12 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(52,211,153,0.05)] hover:shadow-[0_0_50px_rgba(52,211,153,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl">
              <h3 className="font-mono text-emerald-400 tracking-widest text-sm mb-4 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                // Universal Testing Ground
              </h3>
              <h2 className="text-3xl md:text-4xl text-white font-black mb-4 tracking-tight">
                Break the software. Earn your seat.
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                This is the official testing ground for every app in our ecosystem. We need you to test our products in the real world and tell us exactly where they break. You report the friction, we write the code. Help us build it, and you earn free products, upgrades, and permanent access.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0 bg-emerald-400/10 text-emerald-400 border border-emerald-400/50 font-black uppercase tracking-widest px-8 py-4 rounded-lg group-hover:bg-emerald-400 group-hover:text-black transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              Enter Beta Center
            </div>
          </Link>

        </section>

        {/* ========================================================= */}
        {/* 3. THE RAW TRUTH FOOTER */}
        {/* ========================================================= */}
        <section className="text-center max-w-2xl mx-auto pt-16 border-t border-white/5">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
            {/* SVG LIGHTNING BOLT INSTEAD OF EMOJI */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Built different. Because it had to be.</h3>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Alternative Solutions LLC // Est. 2025
          </p>
        </section>

      </div>
    </main>
  );
}