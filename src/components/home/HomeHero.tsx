/* src/components/home/HomeHero.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Activity, Zap, Timer } from 'lucide-react';

export default function HomeHero() {
  const { HERO, LAUNCH_TELEMETRY } = WEBSITE_COPY.PUBLIC_SITE.HOME;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Logic: Real-time Countdown Timer
  useEffect(() => {
    const target = new Date(LAUNCH_TELEMETRY.COUNTDOWN_TARGET).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [LAUNCH_TELEMETRY.COUNTDOWN_TARGET]);

  return (
    <section className="mb-24 pt-10 md:pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* LEFT COLUMN: THE VISION */}
        <div className="w-full lg:w-3/5 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-8 border border-white/10 shadow-inner">
             <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
             {HERO.TAG}
          </div>
          <h1 className="text-white text-6xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {HERO.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-fuchsia-400 to-brand-primary animate-text-gradient">
              {HERO.TITLE_2}
            </span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl leading-relaxed mx-auto lg:mx-0">
            {HERO.SUBHEAD}
          </p>
        </div>

        {/* RIGHT COLUMN: THE SYSTEM TELEMETRY */}
        <div className="w-full lg:w-2/5 relative">
          <div className="bg-black/60 border border-brand-primary/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden group">
            
            {/* Ambient Pulse Background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-all duration-700" />
            
            {/* 1. SPOTS REMAINING COUNTER */}
            <div className="relative z-10 mb-10 pb-8 border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-brand-primary uppercase tracking-[0.2em] mb-4">
                <Activity size={14} className="animate-pulse" /> {LAUNCH_TELEMETRY.SPOTS_LABEL}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {LAUNCH_TELEMETRY.SPOTS_REMAINING}
                </span>
                <span className="text-xl font-mono text-white/20 uppercase">/ {LAUNCH_TELEMETRY.SPOTS_TOTAL} SLOTS</span>
              </div>
              {/* Progress Bar Visual */}
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-brand-primary to-fuchsia-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                  style={{ width: `${(LAUNCH_TELEMETRY.SPOTS_REMAINING / LAUNCH_TELEMETRY.SPOTS_TOTAL) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. THE COUNTDOWN CLOCK */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-mono text-fuchsia-400 uppercase tracking-[0.2em] mb-6">
                <Timer size={14} /> {LAUNCH_TELEMETRY.COUNTDOWN_LABEL}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { val: timeLeft.days, label: 'DD' },
                  { val: timeLeft.hours, label: 'HH' },
                  { val: timeLeft.minutes, label: 'MM' },
                  { val: timeLeft.seconds, label: 'SS' }
                ].map((unit, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white font-mono tabular-nums leading-none mb-1">
                      {String(unit.val).padStart(2, '0')}
                    </div>
                    <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. URGENCY CALLOUT */}
            <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
               <p className="text-[10px] font-mono text-brand-primary/60 uppercase leading-relaxed italic">
                 {LAUNCH_TELEMETRY.CTA_URGENCY}
               </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}