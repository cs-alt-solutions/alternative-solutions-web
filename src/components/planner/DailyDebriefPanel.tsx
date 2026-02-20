/* src/components/planner/DailyDebriefPanel.tsx */
'use client';

import React from 'react';
import { Activity } from 'lucide-react';

interface DailyDebriefPanelProps {
  copy: any; 
}

/**
 * DAILY DEBRIEF PANEL
 * Handles the historical feed of transmissions and daily reflections.
 * Fix: Interface cleaned to resolve prop-injection errors.
 */
export default function DailyDebriefPanel({ copy }: DailyDebriefPanelProps) {
  return (
    <section className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity size={12} /> {copy.SECTIONS.DEBRIEF}
        </h3>
      </div>

      <div className="min-h-37.5 flex flex-col items-center justify-center gap-3 text-center border border-dashed border-white/5 rounded-lg">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/10">
          ?
        </div>
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          {copy.PLACEHOLDERS.REFLECTION_PROMPT}
        </p>
      </div>
    </section>
  );
}