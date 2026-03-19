/* src/components/dashboard/beta-command/RoadmapPollingTab.tsx */
'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Flame, CheckCircle2, Sparkles, Network, ArrowRight } from 'lucide-react';

export default function RoadmapPollingTab() {
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND.POLLING;

  // LIVE POLLS
  const activePolls = [
    { id: 1, title: "Automated Resend Email Flows", votes: 45, total: 50, cohort: "All Users" },
    { id: 2, title: "Dark Mode Mobile App", votes: 12, total: 50, cohort: "Shift Studio Beta" },
  ];

  // AI PIPELINE (Clustered Feedback)
  const aiDrafts = [
    { 
      id: 101, 
      title: "Universal CSV Data Export", 
      clusteredCount: 14, 
      sources: ["Node_Alpha_77", "Observer_Delta", "+12 others"],
      confidence: "94%" 
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* SECTION 1: THE FOUNDRY (AI PIPELINE) */}
      <section className="relative">
        <div className="absolute -inset-4 bg-fuchsia-500/5 blur-2xl rounded-3xl -z-10" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-fuchsia-400" size={18} />
            <h3 className="text-xs font-mono text-white/60 uppercase tracking-widest">{copy.PIPELINE_TITLE}</h3>
          </div>
          <span className="text-[9px] font-mono text-fuchsia-400/60 uppercase tracking-widest border border-fuchsia-500/20 bg-fuchsia-500/5 px-3 py-1 rounded">
            {copy.PIPELINE_DESC}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {aiDrafts.map((draft) => (
            <div key={draft.id} className="bg-black/60 border border-fuchsia-500/30 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)]" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">{draft.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-fuchsia-400">
                      <Network size={12} /> {draft.clusteredCount} {copy.EVIDENCE}
                    </span>
                    <span>AI Confidence: {draft.confidence}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-2">Sources: {draft.sources.join(", ")}</p>
                </div>

                <button className="shrink-0 flex items-center justify-center gap-2 bg-fuchsia-500/10 hover:bg-fuchsia-500 border border-fuchsia-500/50 text-fuchsia-400 hover:text-black px-6 py-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all">
                  {copy.BTN_PROMOTE} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* SECTION 2: ACTIVE CONSENSUS (LIVE POLLS) */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-amber-400" size={18} />
          <h3 className="text-xs font-mono text-white/60 uppercase tracking-widest">{copy.ACTIVE_POLLS}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePolls.map((poll) => {
            const percent = Math.round((poll.votes / poll.total) * 100);
            return (
              <div key={poll.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded mb-2 inline-block">
                      Cohort: {poll.cohort}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight pr-4">{poll.title}</h4>
                  </div>
                  <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded text-cyan-400 shrink-0">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-mono font-bold">{poll.votes}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span>Consensus</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}