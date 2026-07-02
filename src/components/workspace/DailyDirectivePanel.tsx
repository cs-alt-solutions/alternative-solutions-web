import React from 'react';
import Link from 'next/link';
import { Target, CheckCircle2, Terminal, ArrowRight, UserCircle, Mail } from 'lucide-react';

export type DirectiveItem = {
  id: string;
  type: 'LEAD' | 'TASK';
  title: string;
  subtitle: string;
  link: string;
};

export default function DailyDirectivePanel({ items, copy }: { items: DirectiveItem[]; copy: any }) {
  return (
    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] mb-8">
      
      {/* HEADER */}
      <div className="p-5 border-b border-brand-primary/20 bg-brand-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4 text-brand-primary">
          <div className="p-2 bg-brand-primary/20 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Target size={20} />
          </div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-widest text-white">{copy.TITLE}</h2>
            <p className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-0.5">{copy.SUBTITLE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-[10px] font-mono text-brand-primary font-bold">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
           {items.length} PENDING
        </div>
      </div>

      {/* HORIZONTAL SCROLLING DOSSIERS */}
      <div className="p-4 flex gap-4 overflow-x-auto snap-x hide-scrollbar">
        {items.length === 0 ? (
           <div className="py-12 w-full text-center text-xs font-mono text-white/40 uppercase tracking-widest border border-dashed border-brand-primary/20 rounded-xl">
             {copy.EMPTY}
           </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="snap-start min-w-75 flex-1 bg-black/60 border border-brand-primary/30 rounded-xl p-6 hover:border-brand-primary/80 transition-all flex flex-col justify-between group relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-brand-primary/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-brand-primary/30 bg-brand-primary/10 text-[9px] font-mono text-brand-primary uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    {item.type === 'LEAD' ? copy.TYPES.LEAD : copy.TYPES.TASK}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Action Required</span>
                </div>
                
                <h4 className="text-xl font-black text-white mb-2 truncate flex items-center gap-2">
                  <UserCircle size={18} className="text-brand-primary/50" />
                  {item.title}
                </h4>
                
                <p className="text-xs font-mono text-slate-400 truncate flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                  <Mail size={12} className="text-brand-primary" /> {item.subtitle}
                </p>
              </div>

              <Link href={item.link} className="relative z-10 mt-6 w-full flex items-center justify-center gap-2 py-3 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-black rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all border border-brand-primary/30 hover:border-transparent">
                 {item.type === 'LEAD' ? copy.ACTIONS.PROCESS : copy.ACTIONS.EXECUTE}
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}