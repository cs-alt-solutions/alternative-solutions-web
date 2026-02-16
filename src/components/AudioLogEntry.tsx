import React from 'react';
import { Play, Mic2, Clock } from 'lucide-react';
import { AudioLog } from '@/data/store';

export default function AudioLogEntry({ log }: { log: AudioLog }) {
  return (
    <div className="group bg-bg-surface-200/50 border border-white/5 hover:border-brand-primary/30 p-4 rounded-xl transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mic2 size={12} className="text-brand-primary" />
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">
              LOG // {log.date}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">
            {log.title}
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            {log.description}
          </p>
        </div>
        
        <button className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-black transition-all">
          <Play size={16} fill="currentColor" />
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[10px] text-text-muted font-mono">
        <span className="flex items-center gap-1 uppercase">
          <Clock size={10} /> {log.duration}
        </span>
        <span className="uppercase opacity-50">ENCRYPTED STREAM</span>
      </div>
    </div>
  );
}