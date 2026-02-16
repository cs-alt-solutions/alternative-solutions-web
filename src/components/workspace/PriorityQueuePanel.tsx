import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { WaitlistEntry } from '@/data/store';

export default function PriorityQueuePanel({ queue, copy, commonCopy }: { queue: WaitlistEntry[], copy: any, commonCopy: any }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-125">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
        <AlertCircle size={16} className="text-orange-500" /><h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{copy.ACTION_REQD}</h3>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {queue.length === 0 ? (<div className="h-full flex items-center justify-center text-xs font-mono text-white/30 uppercase">{copy.EMPTY_STATE}</div>) : (
          <div className="space-y-2">{queue.map(item => (
            <div key={item.id} className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
              <div><div className="text-sm font-medium text-white mb-1">{item.email}</div><div className="flex items-center gap-2"><span className={`text-[10px] font-mono uppercase tracking-widest ${item.source === 'Shift Studio' ? 'text-brand-primary' : 'text-emerald-400'}`}>{item.source}</span><span className="text-white/30 text-[10px] font-mono">• {item.date}</span></div></div>
              {item.source === 'Shift Studio' ? (<Link href="/dashboard/waitlist" className="px-3 py-1.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-mono uppercase hover:bg-brand-primary/20 transition-colors">{commonCopy.ACTION_REVIEW}</Link>) : (
                <button className="px-3 py-1.5 rounded bg-white/10 text-white border border-white/20 text-[10px] font-mono uppercase hover:bg-white/20 transition-colors">{commonCopy.ACTION_INTAKE}</button>
              )}
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}