/* src/components/planner/WeeklyFlowWheel.tsx */
'use client';

import React from 'react';
import { CalendarDays } from 'lucide-react';

interface WeeklyFlowWheelProps {
  copy: any;
  days: any[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export default function WeeklyFlowWheel({ copy, days, selectedDay, onSelectDay }: WeeklyFlowWheelProps) {
  return (
    <div className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <CalendarDays size={12} /> {copy?.SECTIONS?.LIFESTYLE || 'WEEKLY_FLOW'}
        </h3>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {days.map((day) => (
          <button
            key={day.day}
            onClick={() => onSelectDay(day.day)}
            className={`w-24 h-24 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${
              selectedDay === day.day 
              ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            <span className="text-xs font-black tracking-tighter">{day.day}</span>
            <span className="text-[8px] font-mono uppercase opacity-50">{day.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}