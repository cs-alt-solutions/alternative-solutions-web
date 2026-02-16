/* src/components/workspace/NetworkPulse.tsx */
import React from 'react';
import { Radio, Ticket } from 'lucide-react';
import { WaitlistEntry } from '@/data/store';

interface NetworkPulseProps {
  feed: WaitlistEntry[];
  copy: any;
}

export default function NetworkPulse({ feed, copy }: NetworkPulseProps) {
  if (feed.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <div className="flex items-center gap-2 mb-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-xl">
        <Radio size={12} className="text-brand-primary animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">{copy.TITLE}</span>
      </div>

      <div className="flex flex-col-reverse gap-2">
        {feed.slice(0, 3).map((item, index) => (
          <div 
            key={item.id} 
            className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-2xl w-72 flex items-start gap-3 animate-in slide-in-from-right-8 fade-in duration-500"
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shrink-0">
               <Ticket size={14} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-0.5">{copy.NEW_BETA}</div>
               <div className="text-sm font-bold text-white truncate">{item.email}</div>
               <div className="text-[10px] font-mono text-white/40 mt-1">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}