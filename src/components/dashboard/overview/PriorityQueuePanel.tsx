/* src/components/workspace/PriorityQueuePanel.tsx */
import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { WaitlistEntry } from '@/types';

interface PriorityQueueProps {
  queue?: WaitlistEntry[];
  copy: any;
  commonCopy: any;
}

export default function PriorityQueuePanel({ queue = [], copy, commonCopy }: PriorityQueueProps) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-125 group hover:border-brand-primary/20 transition-all">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
        <AlertCircle size={16} className="text-orange-500" />
        <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{copy?.TITLE || 'PRIORITY QUEUE'}</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-2 custom-scrollbar">
        {queue.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">
            Queue clear. Systems optimal.
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((item, index) => (
              <div key={item?.id || index} className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white mb-1">{item?.email || 'Unknown Contact'}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest text-brand-primary`}>
                      {item?.source || 'WEB'}
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-mono uppercase hover:bg-brand-primary/20 transition-colors">
                  {commonCopy?.ACTION_REVIEW || 'REVIEW'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}