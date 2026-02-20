/* src/components/planner/WeeklyFlowWheel.tsx */
'use client';

import React from 'react';

interface WeeklyFlowWheelProps {
  copy: any;
  days: string[];
  selectedDay: number;
  onSelectDay: (dayIndex: number) => void;
}

export default function WeeklyFlowWheel({ copy, days, selectedDay, onSelectDay }: WeeklyFlowWheelProps) {
  // SAFETY GUARD: Prevent crash if days array is missing
  if (!days || !days.length) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      {days.map((day, index) => (
        <button
          key={`${day}-${index}`} // FIX: Added unique key for React reconciliation
          onClick={() => onSelectDay(index)}
          className={`flex-1 py-4 rounded-xl border transition-all flex flex-col items-center gap-1 ${
            selectedDay === index
              ? 'bg-brand-primary/20 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.1)]'
              : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">{day}</span>
          <div className={`w-1 h-1 rounded-full ${selectedDay === index ? 'bg-brand-primary' : 'bg-transparent'}`} />
        </button>
      ))}
    </div>
  );
}