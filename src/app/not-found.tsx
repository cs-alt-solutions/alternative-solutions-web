/* src/app/not-found.tsx */
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative flex items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Ambient Grid & Error Glow */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

      {/* The 404 Terminal */}
      <div className="relative z-10 w-full max-w-lg text-center">
        
        {/* GlitchBot Warning Avatar */}
        <div className="relative w-24 h-24 bg-[#09090b] border-2 border-amber-500 rounded-2xl flex items-center justify-center shadow-[inset_0_0_30px_rgba(245,158,11,0.2)] mx-auto mb-10 group transition-all duration-300 hover:shadow-[inset_0_0_50px_rgba(245,158,11,0.4)]">
          {/* Flashing "Eye" */}
          <div className="w-10 h-3 bg-amber-500 rounded-full shadow-[0_0_20px_#f59e0b] animate-[pulse_1s_ease-in-out_infinite]"></div>
          
          <div className="absolute -bottom-3 -right-3 bg-[#09090b] border border-amber-500 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-widest">
            GLITCH_BOT
          </div>
        </div>

        {/* System Error Tag */}
        <div className="inline-block border border-amber-500/40 bg-amber-950/30 px-4 py-1.5 rounded-full font-mono text-amber-400 text-[10px] tracking-[0.3em] mb-6 uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          404 // SECTOR NOT FOUND
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          DEAD END.
        </h1>

        {/* GlitchBot Dialogue */}
        <div className="bg-bg-app/80 border border-white/5 p-6 md:p-8 rounded-2xl mb-10 backdrop-blur-md relative text-left shadow-[0_0_30px_rgba(245,158,11,0.05)]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-2xl"></div>
            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed italic">
              "Look, I've scanned the entire repository. This page doesn't exist, or Courtney is still writing the code for it. Either way, you can't be here."
            </p>
        </div>

        {/* Escape Route */}
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-3 bg-amber-500/10 text-amber-400 border border-amber-500/50 hover:bg-amber-400 hover:text-black font-black uppercase tracking-widest px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
        >
          Return to the Grid
        </Link>
      </div>
      
    </main>
  );
}