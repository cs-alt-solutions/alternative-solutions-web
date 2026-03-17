/* src/components/dashboard/foundation/FoundationStats.tsx */
'use client';

import React from 'react';
import { DollarSign, Users, Zap, Mail } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface StatsProps {
  stats: {
    mrr: number;
    builders: number;
    backers: number;
    boosts: number;
    observers: number;
  }
}

export default function FoundationStats({ stats }: StatsProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total MRR */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 rounded-full blur-[30px]" />
        <div className="flex items-center gap-3 mb-3">
          <DollarSign size={16} className="text-brand-primary" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Total MRR</span>
        </div>
        <div className="text-3xl font-black text-white">${stats.mrr}</div>
      </div>

      {/* Builders */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 rounded-full blur-[30px]" />
        <div className="flex items-center gap-3 mb-3">
          <Zap size={16} className="text-brand-primary" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Builders ($5/mo)</span>
        </div>
        <div className="text-3xl font-black text-white">{stats.builders}</div>
      </div>

      {/* Backers */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-[30px]" />
        <div className="flex items-center gap-3 mb-3">
          <Users size={16} className="text-fuchsia-400" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Monthly Backers</span>
        </div>
        <div className="text-3xl font-black text-white">{stats.backers}</div>
      </div>

      {/* Observers */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Mail size={16} className="text-white/40" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Free Observers</span>
        </div>
        <div className="text-3xl font-black text-white">{stats.observers}</div>
      </div>
    </div>
  );
}