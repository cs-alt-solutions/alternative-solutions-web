/* src/app/blueprint/page.tsx */
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import PricingCard from '@/components/core/PricingCard';
import { ShieldCheck, Wrench, Hammer, Users, MessageSquare, TerminalSquare, Zap, Coffee, HeartHandshake, ArrowRight, Flame, Briefcase } from 'lucide-react';

export const revalidate = 0; // Ensures the roster is always live

export default async function BlueprintPage() {
  const copy = WEBSITE_COPY.BLUEPRINT;
  const fm = WEBSITE_COPY.FOUNDING_MEMBER;

  // 1. Fetch real backers (Amount > 0 excludes free observers from the public wall of fame)
  const { data: backersData } = await supabase
    .from('supporters')
    .select('*')
    .gt('amount', 0)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(12);

  const liveBackers = backersData || [];

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'BUILDER': return { icon: <Zap size={16} />, style: 'bg-brand-primary/20 text-brand-primary' };
      case 'BACKER': return { icon: <Coffee size={16} />, style: 'bg-fuchsia-500/20 text-fuchsia-400' };
      case 'BOOST': return { icon: <Flame size={16} />, style: 'bg-orange-500/20 text-orange-400' };
      case 'CLIENT': return { icon: <Briefcase size={16} />, style: 'bg-emerald-500/20 text-emerald-400' };
      default: return { icon: <HeartHandshake size={16} />, style: 'bg-white/10 text-white/50' };
    }
  };

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
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-8 md:p-10 backdrop-blur-md relative overflow-hidden group shadow-[0_0_30px_rgba(52,211,153,0.05)] h-full">
             <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                 <ShieldCheck size={24} />
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">
                 {copy.THE_PLEDGE.TITLE_1} <br/>
                 <span className="text-emerald-400">{copy.THE_PLEDGE.TITLE_2}</span>
               </h2>
               <p className="text-emerald-100/70 font-light leading-relaxed">
                 {copy.THE_PLEDGE.DESC}
               </p>
             </div>
          </div>

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

        

        {/* SECTION 2: THE 2 FUNDING PATHS (Middle Row) */}
        <section className="mb-24 scroll-mt-32" id="funding-options">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.FUNDING_PATHS.TITLE}
             </h2>
             <p className="text-slate-400 font-light max-w-xl mx-auto">
               {copy.FUNDING_PATHS.SUBTITLE}
             </p>
          </div>

          {/* Clean 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* PATH 1: THE BACKER (Monthly Tiered) */}
            <div className="bg-black/60 border border-brand-primary/30 hover:border-brand-primary/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-[9px] font-mono text-brand-primary uppercase tracking-widest mb-6 w-max">
                {copy.FUNDING_PATHS.PATH_1.TAG}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {copy.FUNDING_PATHS.PATH_1.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-6 font-light">
                {copy.FUNDING_PATHS.PATH_1.DESC}
              </p>
              
              {/* Internal Tier Breakdown inside the card */}
              <div className="flex-1 space-y-3 mb-8">
                {copy.FUNDING_PATHS.PATH_1.TIERS.map((tier: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start">
                    {/* UPDATED: Changed min-w-[60px] to min-w-15 */}
                    <div className="text-brand-primary font-black text-lg min-w-15">{tier.price}</div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">{tier.name}</div>
                      <div className="text-xs text-slate-400 leading-snug">{tier.perk}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Link href={copy.FUNDING_PATHS.PATH_1.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_1.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* PATH 2: THE BOOST (One-Time) */}
            <div className="bg-black/60 border border-orange-500/30 hover:border-orange-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.05)] transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-6 w-max">
                {copy.FUNDING_PATHS.PATH_2.TAG}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {copy.FUNDING_PATHS.PATH_2.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-8 font-light flex-1">
                {copy.FUNDING_PATHS.PATH_2.DESC}
              </p>
              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{copy.FUNDING_PATHS.PATH_2.PRICE}</span>
                </div>
                <Link href={copy.FUNDING_PATHS.PATH_2.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_2.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
             {liveBackers.length === 0 ? (
               <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-12 border border-dashed border-white/10 rounded-xl text-white/30 font-mono text-xs uppercase tracking-widest">
                 {copy.ROSTER.EMPTY_STATE}
               </div>
             ) : (
               liveBackers.map((backer) => {
                 const details = getTierIcon(backer.tier);
                 return (
                   <div key={backer.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${details.style}`}>
                       {details.icon}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-white truncate">
                         {backer.display_name || backer.name || 'Anonymous Builder'}
                       </div>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-mono text-white/40 uppercase">
                           {new Date(backer.created_at).toLocaleDateString()}
                         </span>
                         <span className="text-white/20">•</span>
                         <span className={`text-[10px] font-mono uppercase tracking-widest ${details.style.replace('bg-', 'text-').split(' ')[1]}`}>
                           {backer.tier}
                         </span>
                       </div>
                     </div>
                   </div>
                 );
               })
             )}
           </div>
        </section>

      </div>
    </main>
  );
}