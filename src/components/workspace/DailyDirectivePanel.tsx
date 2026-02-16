import React from 'react';
import Link from 'next/link';
import { Target, CheckCircle2, Inbox, Terminal, ArrowRight } from 'lucide-react';

export type DirectiveItem = { id: string; type: 'LEAD' | 'TASK'; title: string; subtitle: string; link: string; };

export default function DailyDirectivePanel({ items, copy }: { items: DirectiveItem[]; copy: any }) {
  const getIcon = (type: string) => {
    if (type === 'LEAD') return <Inbox size={14} className="text-emerald-400" />;
    return <Terminal size={14} className="text-orange-400" />;
  };

  return (
    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] mb-8">
      <div className="p-4 border-b border-brand-primary/20 bg-brand-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-brand-primary">
          <Target size={18} />
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest">{copy.TITLE}</h2>
            <p className="text-[10px] font-mono opacity-70 uppercase tracking-widest">{copy.SUBTITLE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-brand-primary/70">
           <CheckCircle2 size={12} /> {items.length} ACTIVE
        </div>
      </div>
      <div className="p-2 flex gap-2 overflow-x-auto snap-x hide-scrollbar">
        {items.length === 0 ? (
           <div className="p-8 w-full text-center text-xs font-mono text-white/40 uppercase tracking-widest">{copy.EMPTY}</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="snap-start min-w-75 flex-1 bg-black/40 border border-white/5 rounded-lg p-4 hover:border-brand-primary/30 transition-colors flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {getIcon(item.type)}
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{item.type === 'LEAD' ? copy.TYPES.LEAD : copy.TYPES.TASK}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 truncate">{item.title}</h4>
                <p className="text-xs font-mono text-white/40 truncate">{item.subtitle}</p>
              </div>
              <Link href={item.link} className="mt-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-brand-primary group-hover:text-brand-accent transition-colors">
                 {item.type === 'LEAD' ? copy.ACTIONS.PROCESS : copy.ACTIONS.EXECUTE}
                 <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}