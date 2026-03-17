/* src/components/dashboard/foundation/FoundationStats.tsx */
'use client';

import React from 'react';
import { DollarSign, Users, Zap, Mail, Fuel, TrendingUp } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface StatsProps {
  stats: {
    mrr: number;
    builders: number;
    backers: number;
    boosts: number;
    totalFuel: number;
    observers: number;
  }
}

export default function FoundationStats({ stats }: StatsProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.STATS;

  const cards = [
    { label: copy.MRR, value: `$${stats.mrr}`, icon: TrendingUp, color: 'text-brand-primary', glow: 'bg-brand-primary/10' },
    { label: copy.BUILDERS, value: stats.builders, icon: Zap, color: 'text-brand-primary', glow: 'bg-brand-primary/10' },
    { label: copy.BACKERS, value: stats.backers, icon: Users, color: 'text-fuchsia-400', glow: 'bg-fuchsia-500/10' },
    { label: copy.BOOSTS, value: stats.boosts, icon: Fuel, color: 'text-orange-400', glow: 'bg-orange-500/10' },
    { label: copy.FUEL, value: `$${stats.totalFuel}`, icon: DollarSign, color: 'text-emerald-400', glow: 'bg-emerald-500/10' },
    { label: copy.OBSERVERS, value: stats.observers, icon: Mail, color: 'text-white/40', glow: '' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-bg-surface-200/50 border border-white/5 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
          {card.glow && <div className={`absolute -right-6 -top-6 w-24 h-24 ${card.glow} rounded-full blur-[30px] opacity-50 group-hover:opacity-100 transition-opacity`} />}
          <div className="flex items-center gap-3 mb-3">
            <card.icon size={16} className={card.color} />
            <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{card.label}</span>
          </div>
          <div className="text-3xl font-black text-white">{card.value}</div>
        </div>
      ))}
    </div>
  );
}