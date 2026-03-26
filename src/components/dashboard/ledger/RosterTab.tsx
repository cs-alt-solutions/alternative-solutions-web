'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Users, Flame, Zap, RefreshCw } from 'lucide-react';

export default function RosterTab() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;

  // Mock data until we wire up the Stripe/Supabase connection
  const mockBackers = [
    { id: '1', name: 'Anonymous Builder', tier: 'Founding Architect', amount: 5.00, type: 'RECURRING', date: '2026-03-15' },
    { id: '2', name: 'Sarah Jenkins', tier: 'The Boost', amount: 50.00, type: 'ONE-TIME', date: '2026-03-18' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER: PLATFORM BACKERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-surface-200/50 border border-brand-primary/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.05)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div>
          <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight uppercase">
            <Users size={24} className="text-brand-primary" />
            Platform Backers
          </h2>
          <p className="text-slate-400 font-mono text-sm">The early adopters funding the Alternative Solutions ecosystem.</p>
        </div>
        
        {/* Sync Status Button */}
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white">
          <RefreshCw size={14} /> Sync Stripe
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Founders</p>
            <p className="text-xl font-black text-white">1</p>
          </div>
        </div>
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-lg text-brand-primary">
            <RefreshCw size={20} />
          </div>
          <div>
             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Monthly Recurring</p>
             <p className="text-xl font-black text-white">$5.00</p>
          </div>
        </div>
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
            <Flame size={20} />
          </div>
          <div>
             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">One-Time Boosts</p>
             <p className="text-xl font-black text-white">$50.00</p>
          </div>
        </div>
      </div>

      {/* ROSTER LEDGER */}
      <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/40">
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Backer</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tier</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date Joined</th>
              <th className="p-4 text-[10px] font-mono text-brand-primary uppercase tracking-widest text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockBackers.map((backer) => (
              <tr key={backer.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-sm text-white font-bold flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${backer.type === 'RECURRING' ? 'bg-brand-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`} />
                  {backer.name}
                </td>
                <td className="p-4 text-xs font-mono text-slate-400">{backer.tier}</td>
                <td className="p-4 text-xs font-mono text-slate-500">{backer.date}</td>
                <td className="p-4 text-sm text-brand-primary font-bold text-right">${backer.amount.toFixed(2)} {backer.type === 'RECURRING' && <span className="text-[10px] text-slate-500 font-normal">/mo</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}