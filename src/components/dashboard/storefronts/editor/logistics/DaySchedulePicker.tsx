/* src/components/dashboard/storefronts/editor/logistics/DaySchedulePicker.tsx */
'use client';

import React, { useState } from 'react';
import { CalendarDays, X, Clock } from 'lucide-react';
import { WEEK_DAYS, ScheduleMode } from '@/config/dashboard/editor';

interface DaySchedulePickerProps {
  days?: string[];
  scheduleMode?: ScheduleMode;
  scheduleWindow?: string;
  onChange: (patch: { days?: string[]; scheduleMode?: ScheduleMode; scheduleWindow?: string }) => void;
}

export default function DaySchedulePicker({
  days = [],
  scheduleMode = 'active',
  scheduleWindow = '',
  onChange,
}: DaySchedulePickerProps) {
  const hasSchedule = days.length > 0 || scheduleWindow.trim().length > 0;
  const [isOpen, setIsOpen] = useState(hasSchedule);

  const toggleDay = (dayKey: string) => {
    const nextDays = days.includes(dayKey)
      ? days.filter((d) => d !== dayKey)
      : [...days, dayKey];
    onChange({ days: nextDays });
  };

  const handleClear = () => {
    onChange({ days: [], scheduleMode: 'active', scheduleWindow: '' });
    setIsOpen(false);
  };

  if (!isOpen && !hasSchedule) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-1.5 px-2.5 rounded-md border border-dashed border-zinc-800 hover:border-indigo-500/40 bg-zinc-950/60 hover:bg-indigo-500/5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
      >
        <CalendarDays size={12} className="text-indigo-400" />
        <span>Attach Weekly Schedule / Days</span>
      </button>
    );
  }

  const isBlackout = scheduleMode === 'blackout';

  return (
    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center bg-black rounded-md p-0.5 border border-zinc-800">
          <button
            type="button"
            onClick={() => onChange({ scheduleMode: 'active' })}
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !isBlackout ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Active Days
          </button>
          <button
            type="button"
            onClick={() => onChange({ scheduleMode: 'blackout' })}
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isBlackout ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Off / No-Travel
          </button>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="text-[9px] font-mono uppercase text-zinc-500 hover:text-rose-400 flex items-center gap-0.5 cursor-pointer"
          title="Remove schedule"
        >
          <X size={11} /> Clear
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => {
          const isSelected = days.includes(day.key);
          const activeStyles = isBlackout
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 line-through'
            : 'bg-indigo-500 border-indigo-400 text-white shadow-sm shadow-indigo-500/30';

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => toggleDay(day.key)}
              title={day.label}
              className={`py-1.5 rounded-md border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? activeStyles
                  : 'bg-zinc-900/70 border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {day.short}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Clock size={11} className="text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          value={scheduleWindow}
          onChange={(e) => onChange({ scheduleWindow: e.target.value })}
          placeholder={isBlackout ? 'e.g., No Travel / Closed Days' : 'e.g., Drops & Pickups Only or 9AM – 1PM'}
          className="w-full bg-black/60 border border-zinc-800 rounded-md pl-7 pr-2.5 py-1.5 text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 outline-none"
        />
      </div>
    </div>
  );
}