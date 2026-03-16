/* src/app/blueprint/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import PricingCard from '@/components/core/PricingCard';
import { ShieldCheck, Wrench, Hammer, Users, MessageSquare, TerminalSquare, Zap, Coffee, HeartHandshake, ArrowRight } from 'lucide-react';

export default function BlueprintPage() {
  const copy = WEBSITE_COPY.PUBLIC_SITE.BLUEPRINT;
  const fm = WEBSITE_COPY.FOUNDING_MEMBER;

  // Mock data for the Roster
  const recentBackers = [
    { name: "Anonymous Builder", amount: "Classified", type: "Fuel", date: "Just now" },
    { name: "M. Sullivan", amount: "$5/mo", type: "Founder", date: "2 hrs ago" },
    { name: "Sarah K.", amount: "$5/mo", type: "Founder", date: "1 day ago" }
  ];

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-x-hidden pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <TerminalSquare size={14} className="animate-pulse" />
            {copy.HEADER.TAG}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {copy.HEADER.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-fuchsia-400 to-brand-primary animate-text-gradient">
              {copy.HEADER.TITLE_2}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            {copy.HEADER.DESC}
          </p>
        </section>

        {/* SECTION 1: THE PLEDGE & PERKS (Top Row) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          
          {/* The Pledge (Green Box) */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-md relative overflow-hidden group shadow-[0_0_30px_rgba(52,211,153,0.05)] h-full">
             <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                 <ShieldCheck size={24} />
               </div>
               
               {/* Updated to call THE_PLEDGE */}
               <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">
                 {copy.THE_PLEDGE.TITLE_1} <br/>
                 <span className="text-emerald-400">{copy.THE_PLEDGE.TITLE_2}</span>
               </h2>
               <p className="text-emerald-100/70 font-light leading-relaxed">
                 {copy.THE_PLEDGE.DESC}
               </p>

             </div>
          </div>

          {/* Perks */}
          <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md h-full flex flex-col justify-center">
             <h3 className="text-brand-primary font-mono text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
               <Hammer size={14} /> {copy.REWARDS.TITLE}
             </h3>
             <div className="space-y-6">
               {copy.REWARDS.RANKS.map((rank: any, idx: number) => {
                 const colors = ["text-brand-primary", "text-fuchsia-400", "text-amber-400"];
                 return (
                   <div key={idx} className="flex items-start gap-4">
                     <div className={`mt-1 shrink-0 ${colors[idx % 3]}`}>
                       {idx === 0 ? <Users size={18} /> : idx === 1 ? <MessageSquare size={18} /> : <TerminalSquare size={18} />}
                     </div>
                     <div>
                       <h4 className="text-white font-bold uppercase text-sm mb-1">{rank.title}</h4>
                       <p className="text-xs text-slate-400 font-light leading-relaxed">{rank.desc}</p>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {/* SECTION 2: THE 3 FUNDING PATHS (Middle Row) */}
        <section className="mb-24 scroll-mt-32" id="funding-options">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.FUNDING_PATHS.TITLE}
             </h2>
             <p className="text-slate-400 font-light max-w-xl mx-auto">
               {copy.FUNDING_PATHS.SUBTITLE}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PATH 1: The Builder ($5/mo) */}
            <div className="bg-black/60 border border-brand-primary/30 hover:border-brand-primary/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] text-center transition-all duration-500 relative flex flex-col h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-[9px] font-mono text-brand-primary uppercase tracking-widest mb-6 mx-auto">
                {copy.FUNDING_PATHS.PATH_1.TAG}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">
                {copy.FUNDING_PATHS.PATH_1.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-6 font-light flex-1">
                {copy.FUNDING_PATHS.PATH_1.DESC}
              </p>
              <div className="mt-auto">
                <PricingCard minAmount={5} stripeLink={fm.STRIPE_LINK} btnText={copy.FUNDING_PATHS.PATH_1.BTN_TEXT} />
              </div>
            </div>

            {/* PATH 2: The Backer (Custom Monthly) */}
            <div className="bg-black/60 border border-fuchsia-500/30 hover:border-fuchsia-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(232,121,249,0.05)] text-center transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-[9px] font-mono text-fuchsia-400 uppercase tracking-widest mb-6 mx-auto">
                {copy.FUNDING_PATHS.PATH_2.TAG}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">
                {copy.FUNDING_PATHS.PATH_2.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-8 font-light flex-1">
                {copy.FUNDING_PATHS.PATH_2.DESC}
              </p>
              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{copy.FUNDING_PATHS.PATH_2.PRICE}</span>
                  <span className="text-xs font-mono text-fuchsia-400 uppercase ml-2">{copy.FUNDING_PATHS.PATH_2.PERIOD}</span>
                </div>
                <Link href={copy.FUNDING_PATHS.PATH_2.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_rgba(232,121,249,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_2.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* PATH 3: The Boost (Custom One-Time) */}
            <div className="bg-black/60 border border-orange-500/30 hover:border-orange-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.05)] text-center transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-6 mx-auto">
                {copy.FUNDING_PATHS.PATH_3.TAG}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">
                {copy.FUNDING_PATHS.PATH_3.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-8 font-light flex-1">
                {copy.FUNDING_PATHS.PATH_3.DESC}
              </p>
              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{copy.FUNDING_PATHS.PATH_3.PRICE}</span>
                  <span className="text-xs font-mono text-orange-400 uppercase ml-2">{copy.FUNDING_PATHS.PATH_3.PERIOD}</span>
                </div>
                <Link href={copy.FUNDING_PATHS.PATH_3.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_3.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: THE FOUNDATION ROSTER (Bottom) */}
        <section className="pt-16 border-t border-white/10 animate-in fade-in duration-1000 delay-300">
           <div className="text-center mb-12">
             <h2 className="text-sm font-mono text-brand-primary uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
               <HeartHandshake size={16} /> {copy.ROSTER.TAG}
             </h2>
             <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.ROSTER.TITLE}
             </h3>
             <p className="text-slate-400 font-light max-w-2xl mx-auto">
               {copy.ROSTER.DESC}
             </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
             {recentBackers.map((backer, idx) => (
               <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${backer.type === 'Founder' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-orange-500/20 text-orange-400'}`}>
                   {backer.type === 'Founder' ? <Zap size={16} /> : <Coffee size={16} />}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="text-sm font-bold text-white truncate">{backer.name}</div>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-mono text-white/40 uppercase">{backer.date}</span>
                     <span className="text-white/20">•</span>
                     <span className={`text-[10px] font-mono uppercase tracking-widest ${backer.type === 'Founder' ? 'text-brand-primary' : 'text-orange-400'}`}>
                       {backer.type}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </section>

      </div>
    </main>
  );
}