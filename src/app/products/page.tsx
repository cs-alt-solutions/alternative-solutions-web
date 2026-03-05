/* src/app/products/page.tsx */
import React from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden font-sans pt-32 pb-24">
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      
      {/* Blue & Amber ambient light */}
      <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-125 h-125 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-tightest mb-8 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            The Ecosystem
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Alternative Solutions isn't just one app. It’s an expanding network of tools designed to fix broken industries.
          </p>
        </div>

        <h2 className="text-cyan-400 font-mono text-xl tracking-widest mb-8 uppercase border-b border-cyan-900/50 pb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          // Active Deployments
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {/* SHIFT STUDIO: NEON BLUE */}
          <Link href="/products/shift-studio" className="group relative bg-bg-app/90 border border-cyan-900/50 hover:border-cyan-400/80 rounded-2xl p-10 overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 font-mono text-8xl font-black text-cyan-500 group-hover:scale-110 transition-transform">01</div>
            
            <div className="inline-block border border-cyan-400/50 bg-cyan-950/50 px-3 py-1 rounded-full font-mono text-cyan-400 text-[10px] tracking-widest mb-6 uppercase shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              STATUS: V1 BETA ACTIVE
            </div>
            
            <h3 className="text-4xl text-white font-black mb-4 tracking-tight">Shift Studio</h3>
            <p className="text-slate-300 leading-relaxed mb-8">
              Stop duct-taping five different platforms together. Shift Studio connects your sales, marketing, operations, and inventory into one single, high-performance operating system.
            </p>
            
            <div className="text-cyan-400 font-bold tracking-wide flex items-center gap-2 group-hover:gap-4 transition-all drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              ENTER THE STUDIO <span>→</span>
            </div>
          </Link>

          {/* CLASSIFIED: NEON VIOLET */}
          <div className="relative bg-bg-app/50 border border-violet-500/30 border-dashed rounded-2xl p-10 overflow-hidden flex flex-col justify-center items-center text-center shadow-[inset_0_0_30px_rgba(139,92,246,0.05)]">
            {/* SVG SECURE LOCK RADAR */}
            <svg className="w-16 h-16 text-violet-500/50 mb-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-xl text-violet-300 font-bold mb-2">PROJECT CLASSIFIED</h3>
            <p className="text-sm text-violet-500/70 font-mono tracking-widest">IN DEVELOPMENT // STANDBY</p>
          </div>
        </div>

        {/* THE COLLABORATION: NEON AMBER */}
        <div className="bg-bg-app/90 border border-amber-500/30 rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Got an idea?<br/>
                {/* LIQUID NEON AMBER */}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 animate-text-gradient drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">Let's build it.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed">
                <p>
                  I have the ability to rapidly learn and connect concepts across industries. You have the boots-on-the-ground experience.
                </p>
                <p>
                  Why wait for a massive tech company to build a clunky tool for you? Let's team up. <strong className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">Service for service. Value for value.</strong>
                </p>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-md text-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              {/* SVG NETWORK NODE INSTEAD OF HANDSHAKE */}
              <div className="flex justify-center mb-6 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl text-white font-bold mb-4">The Co-Op Program</h3>
              <p className="text-amber-200/70 text-sm mb-8">
                Submit your friction points or app ideas. If it aligns with the mission, we build it together.
              </p>
              <button className="w-full bg-amber-500/20 text-amber-400 border border-amber-500/50 font-black uppercase tracking-widest py-4 rounded hover:bg-amber-400 hover:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                Pitch an Idea
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}