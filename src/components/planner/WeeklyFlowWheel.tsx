import React from 'react';

interface DayData {
  day: string;
  date: string;
  status: string;
}

interface WeeklyFlowWheelProps {
  days: DayData[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}

export default function WeeklyFlowWheel({ days, selectedDay, onSelectDay }: WeeklyFlowWheelProps) {
  return (
    <div className="flex justify-between items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
      {days.map((d, i) => (
        <button 
          key={i} 
          onClick={() => onSelectDay(d.day)}
          className={`flex-1 flex flex-col items-center py-3 rounded-lg border transition-all ${
            selectedDay === d.day ? 'bg-brand-primary text-black border-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' : 
            'bg-white/2 border-white/5 text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-[10px] font-black tracking-widest">{d.day}</span>
          <span className="text-[9px] font-mono opacity-60">{d.date}</span>
        </button>
      ))}
    </div>
  );
}