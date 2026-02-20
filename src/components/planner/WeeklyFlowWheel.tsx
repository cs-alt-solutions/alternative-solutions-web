/* src/components/planner/WeeklyFlowWheel.tsx */
'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';

interface WeeklyFlowWheelProps {
  copy: any; // Interface updated to accept glossary data
  flow: any[];
}

export default function WeeklyFlowWheel({ copy, flow }: WeeklyFlowWheelProps) {
  return (
    <div className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <CalendarDays size={12} /> {copy.SECTIONS.LIFESTYLE}
        </h3>
      </div>

      <div className="h-48 flex items-center justify-center border border-dashed border-white/5 rounded-lg relative overflow-hidden">
        {/* Visual placeholder for the wheel/calendar integration */}
        <div className="absolute inset-0 bg-brand-primary/5 animate-pulse" />
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest relative z-10">
          {copy.PLACEHOLDERS.CAL_INIT}
        </span>
      </div>
    </div>
  );
}