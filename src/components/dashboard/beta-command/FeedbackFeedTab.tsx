/* src/components/dashboard/beta-command/FeedbackFeedTab.tsx */
'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Bug, Lightbulb, MessageSquareCode } from 'lucide-react';

export default function FeedbackFeedTab() {
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND.FEEDBACK;

  const mockFeedback = [
    { id: 1, type: 'ANOMALY', author: 'Node_Alpha_77', text: "Shift Studio ledger breaks on resize.", severity: 'HIGH' },
    { id: 2, type: 'DIRECTIVE', author: 'Observer_Delta', text: "Can we add an export to CSV button?", severity: 'LOW' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{copy.TITLE}</h3>
        <div className="flex flex-col gap-2">
          {['ALL DATA', 'ANOMALIES', 'DIRECTIVES'].map(filter => (
            <button key={filter} className="text-left px-4 py-3 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-white/60 hover:text-cyan-400 hover:border-cyan-400/30 uppercase tracking-widest transition-all">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-2 space-y-4">
        {mockFeedback.map((item) => (
          <div key={item.id} className="bg-bg-surface-200/30 border border-white/5 rounded-xl p-5 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.type === 'ANOMALY' ? 'bg-fuchsia-500' : 'bg-cyan-500'}`} />
            
            <div className="flex items-start justify-between mb-3 pl-3">
              <div className="flex items-center gap-2">
                {item.type === 'ANOMALY' ? <Bug size={14} className="text-fuchsia-400" /> : <Lightbulb size={14} className="text-cyan-400" />}
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  {item.author} • {item.type}
                </span>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase border ${
                item.severity === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-white/5 text-white/40 border-white/10'
              }`}>
                Lvl: {item.severity}
              </span>
            </div>
            
            <p className="pl-3 text-sm text-slate-300 font-sans leading-relaxed">
              "{item.text}"
            </p>
            
            <div className="mt-4 pl-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] font-mono text-cyan-400 hover:text-white uppercase tracking-widest flex items-center gap-1">
                <MessageSquareCode size={12} /> Process
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}