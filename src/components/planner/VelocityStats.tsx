/* src/components/planner/VelocityStats.tsx */
'use client';

import React from 'react';
import { Zap, Clock } from 'lucide-react';

interface VelocityProps {
  copy: any;
  savings?: string; // Fixed: Now handles dynamic or optional data
  freedom?: string;
}

export default function VelocityStats({ copy, savings = "0", freedom = "0" }: VelocityProps) {
  const stats = copy.VELOCITY;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Clock size={12} /> {stats.SAVINGS}
        </div>
        <div className="text-2xl font-black text-white group-hover:text-brand-primary transition-colors">
          {savings}<span className="text-[10px] font-mono ml-2 text-white/20">HRS</span>
        </div>
      </div>

      <div className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Zap size={12} /> {stats.FREEDOM}
        </div>
        <div className="text-2xl font-black text-white group-hover:text-brand-secondary transition-colors">
          {freedom}<span className="text-[10px] font-mono ml-2 text-white/20">HRS</span>
        </div>
      </div>
    </div>
  );
}