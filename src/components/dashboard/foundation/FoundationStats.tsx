/* src/components/dashboard/foundation/FoundationStats.tsx */
'use client';

import React from 'react';
import { DollarSign, Users, Zap, Mail, Fuel, TrendingUp, Briefcase, Flame, Database } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface StatsProps {
  stats: {
    mrr: number;
    builders: number;
    backers: number;
    boosts: number;
    clients: number;
    totalFuel: number;
    observers: number;
  }
}

// Reusable micro-component for the stats to keep code clean
function StatCard({ label, value, icon: Icon, color, glow }: any) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-white/10 transition-all h-full">
      {glow && <div className={`absolute -right-6 -top-6 w-24 h-24 ${glow} rounded-full blur-[30px] opacity-50 group-hover:opacity-100 transition-opacity`} />}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <Icon size={16} className={color} />
        <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-black text-white relative z-10">{value}</div>
    </div>
  );
}

export default function FoundationStats({ stats }: StatsProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.STATS;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 1. RECURRING REVENUE (The Engine) */}
      <div className="bg-bg-surface-200/50 border border-brand-primary/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-30" />
        <h3 className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <TrendingUp size={14} /> Recurring Revenue (The Engine)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <StatCard label={copy.MRR} value={`$${stats.mrr}`} icon={TrendingUp} color="text-brand-primary" glow="bg-brand-primary/10" />
          </div>
          <StatCard label={copy.BUILDERS} value={stats.builders} icon={Zap} color="text-brand-primary" />
          <StatCard label={copy.BACKERS} value={stats.backers} icon={Users} color="text-fuchsia-400" />
        </div>
      </div>

      {/* 2. ONE-TIME CAPITAL (The Fuel) */}
      <div className="bg-bg-surface-200/50 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-30" />
        <h3 className="text-[10px] font-mono text-orange-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Fuel size={14} /> One-Time Capital (The Fuel)
        </h3>
        <div className="grid grid-cols-1 gap-3 h-[calc(100%-2rem)]">
          <StatCard label={copy.BOOSTS} value={stats.boosts} icon={Flame} color="text-orange-400" glow="bg-orange-500/10" />
          <StatCard label={copy.CLIENTS || "Project Clients"} value={stats.clients} icon={Briefcase} color="text-emerald-400" glow="bg-emerald-500/10" />
        </div>
      </div>

      {/* 3. LIFETIME TELEMETRY (The Vault) */}
      <div className="bg-bg-surface-200/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white to-transparent opacity-10" />
        <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Database size={14} /> Lifetime Telemetry
        </h3>
        <div className="grid grid-cols-1 gap-3 h-[calc(100%-2rem)]">
          <StatCard label={copy.FUEL} value={`$${stats.totalFuel}`} icon={DollarSign} color="text-emerald-400" glow="bg-emerald-500/10" />
          <StatCard label={copy.OBSERVERS} value={stats.observers} icon={Mail} color="text-white/40" />
        </div>
      </div>

    </div>
  );
}