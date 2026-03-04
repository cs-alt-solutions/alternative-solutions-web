/* src/app/blueprint/page.tsx */
import React from 'react';
import Link from 'next/link';
import GlitchBotCompanion from '@/components/GlitchBotCompanion';

export default function BlueprintPage() {
  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden selection:bg-brand-primary/30">
      
      {/* GlitchBot drops into the website right here */}
      <GlitchBotCompanion />

      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 border-b border-white/5"></div>

      <div className="relative max-w-5xl mx-auto px-6 py-32 md:py-48">
        
        {/* ZONE 1: THE HERO */}
        <div className="text-center mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block border border-brand-primary/30 bg-brand-primary/10 px-4 py-1 rounded-full font-mono text-brand-primary text-xs tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            PHASE 1 // OPERATION: CO-CREATION
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-shadow-glow">
            THE BLUEPRINT
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We aren't looking for free labor. We are looking for <span className="text-white font-bold border-b-2 border-brand-primary">Founding Architects</span>. Help us break this engine, and we will build you an empire.
          </p>
        </div>

        {/* ZONE 2: THE MUTUAL RESPECT */}
        <div className="bg-[#111113]/80 backdrop-blur-md p-8 md:p-12 mb-24 border-l-4 border-brand-primary rounded-r-2xl shadow-2xl relative overflow-hidden group transition-colors duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-9xl font-black pointer-events-none">01</div>
          <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">NO FEEDBACK BLACK HOLES.</h2>
          <div className="text-lg text-slate-300 space-y-6 relative z-10">
            <p>
              The industry standard for testing is broken. You submit a thoughtful bug report, it goes into a void, and a massive corporation profits off your insight without even saying thank you.
            </p>
            <p className="text-brand-primary font-bold">
              Not here. We believe in mutual exchange.
            </p>
            <p>
              When you collaborate with Alternative Solutions, your voice dictates the roadmap. You aren't just a user; you are part of the dev team. You log the friction, we write the code, and together we build software that actually serves the people on the frontlines.
            </p>
          </div>
        </div>

        {/* ZONE 3: THE PRINCIPLES */}
        <div className="mb-32 relative">
            <h3 className="font-mono text-brand-primary text-xl mb-12 tracking-widest text-center flex items-center justify-center gap-4">
              <span className="h-px bg-brand-primary/30 w-12"></span>
              RULES OF ENGAGEMENT
              <span className="h-px bg-brand-primary/30 w-12"></span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "01", title: "TEST REALITY", desc: "Don't just poke buttons. Run your actual business workflows through the engine. Tell us where it slows you down." },
                  { id: "02", title: "BRUTAL HONESTY", desc: "We don't need sugar-coating. 'This screen takes 3 extra clicks' is the exact intel we need to optimize the system." },
                  { id: "03", title: "NO ECHOES", desc: "Check the community Lab before logging. Find new friction points to earn maximum XP." },
                  { id: "04", title: "EARN YOUR SEAT", desc: "Inactive accounts are purged to make room for active builders. Your engagement secures your spot." }
                ].map((rule) => (
                  <div key={rule.id} className="bg-[#111113] p-8 rounded-xl border border-white/5 hover:border-brand-primary/50 hover:bg-white/2 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white text-lg font-bold tracking-wide">{rule.title}</h4>
                        <div className="font-mono text-brand-primary/30 text-2xl group-hover:text-brand-primary transition-colors">{rule.id}</div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{rule.desc}</p>
                  </div>
                ))}
            </div>
        </div>

        {/* ZONE 4: THE LOOT */}
        <div className="bg-linear-to-br from-[#111113] to-black p-8 md:p-16 mb-32 border border-white/10 rounded-2xl relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-brand-primary text-brand-primary px-6 py-2 rounded-full font-mono text-sm tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            THE REWARD POOL
          </div>
          
          <div className="text-center max-w-2xl mx-auto mt-8">
            <h2 className="text-3xl font-bold text-white mb-6">Level Up. Get Paid in Software.</h2>
            <p className="text-slate-400 mb-12">
              Every time GlitchBot verifies your feedback, you earn XP. Hit the milestone ranks, and you unlock permanent rewards. We reward the builders who help us lay the bricks.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-white/5 rounded-lg border border-white/5 text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-white font-bold mb-1">Early Access</div>
                <div className="text-xs text-slate-500 font-mono">RANK: OPERATIVE</div>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/5 text-center">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-white font-bold mb-1">Free License</div>
                <div className="text-xs text-slate-500 font-mono">RANK: ARCHITECT</div>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-brand-primary/30 text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <div className="text-3xl mb-2">👑</div>
                <div className="text-brand-primary font-bold mb-1">Founders Board</div>
                <div className="text-xs text-slate-500 font-mono">RANK: APEX</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: THE CTA */}
        <div className="text-center relative">
          <h2 className="text-white font-mono text-2xl md:text-3xl mb-8 tracking-widest">INITIATE CONNECTION?</h2>
          
          <Link 
            href="/dashboard/waitlist" 
            className="inline-block bg-brand-primary text-black px-12 py-5 rounded font-bold text-lg tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] mb-6"
          >
            APPLY FOR CLEARANCE
          </Link>
          <div className="text-slate-500 text-xs font-mono tracking-widest uppercase">
            GlitchBot is standing by.
          </div>
        </div>

      </div>
    </main>
  );
}