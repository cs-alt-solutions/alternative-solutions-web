/* src/app/founder/page.tsx */
import React from 'react';

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden font-sans pt-32 pb-24">
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>
      
      {/* Heavy Fuchsia/Purple glow for the rebel vibe */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-fuchsia-600/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-violet-600/10 rounded-full blur-[180px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6">
        
        {/* HEADER */}
        <section className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block border border-fuchsia-500/40 bg-fuchsia-950/30 px-5 py-2 rounded-full font-mono text-fuchsia-400 text-xs tracking-[0.3em] mb-10 uppercase shadow-[0_0_20px_rgba(232,121,249,0.3)]">
            THE MANIFESTO // DEC 2025
          </div>
          
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            WHO GETS TO SAY <br />
            {/* LIQUID NEON GRADIENT HERE */}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 via-violet-500 to-fuchsia-400 animate-text-gradient">WHAT YOU'RE WORTH?</span>
          </h1>
        </section>

        {/* CONTENT */}
        <div className="space-y-16 text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
          
          <p className="border-l-4 border-fuchsia-500 pl-8 py-2">
            I’m done with the 'termination' culture. I’m done with being treated like s*** for busting my ass. Alternative Solutions isn't just an app—<strong className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]">it’s the culture I’ve been dying to have my entire life.</strong>
          </p>

          <p>
            For 20 years, I watched industries build walls. They created "jobs" and "departments" to keep us separate, keep us small, and keep us quiet. They degraded the "job hoppers" because they were afraid of someone who actually understood the whole map.
          </p>

          <div className="bg-bg-app/80 border border-violet-500/30 p-10 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.1)] backdrop-blur-md">
            <h3 className="font-mono text-violet-400 tracking-widest text-sm mb-4 uppercase drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]">THE CONCEPT REPOSITORY</h3>
            <p className="text-white italic">
              "I didn't 'hop' jobs. I spent two decades getting paid to master every concept they tried to hide. I traded college for reality, and now I have the keys to the engine."
            </p>
          </div>

          <p>
            We work together. Service for service. Value for value. No separate houses. No fake professionalism. Just people who f****** do the work. I don't push myself to outdo you. I push myself to outdo who I was yesterday. That’s how I run circles around the 90% who are just 'keeping a job.'
          </p>

          <div className="text-center pt-16 border-t border-fuchsia-900/50">
             <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Ready to break the bubble?</h2>
             <button className="bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 font-black uppercase tracking-widest px-10 py-5 rounded-lg hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_30px_rgba(232,121,249,0.4)]">
                Join The Movement
             </button>
          </div>

        </div>
      </div>
    </main>
  );
}