/* src/app/dashboard/foundation/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import FoundationStats from '@/components/dashboard/foundation/FoundationStats';
import FoundationRow, { Supporter } from '@/components/dashboard/foundation/FoundationRow';

export const revalidate = 0; // Always pull fresh data from the vault

export default async function FoundationCommandPage() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;

  // 1. Fetch live data from the 'supporters' table
  const { data: supportersData } = await supabase
    .from('supporters')
    .select('*')
    .order('created_at', { ascending: false });

  const roster: Supporter[] = supportersData || [];

  // 2. Calculate live stats
  const activeMRR = roster
    .filter(s => s.status === 'ACTIVE' && (s.tier === 'BUILDER' || s.tier === 'BACKER'))
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  const stats = {
    mrr: activeMRR,
    builders: roster.filter(s => s.tier === 'BUILDER').length,
    backers: roster.filter(s => s.tier === 'BACKER').length,
    boosts: roster.filter(s => s.tier === 'BOOST').length,
    observers: roster.filter(s => s.tier === 'OBSERVER').length
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <header className="mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
            {copy.TITLE}
          </h1>
          <p className="text-[10px] font-mono text-white/40 mt-2 tracking-widest uppercase">
            {copy.STATS_TITLE}
          </p>
        </div>
      </header>

      {/* LIVE QUICK STATS */}
      <FoundationStats stats={stats} />
      
      {/* ROSTER TABLE */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-5 border-b border-white/10 bg-black/20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">{copy.ROSTER_TITLE}</h2>
        </div>
        
        {roster.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">
              Awaiting incoming connections...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* THE FIX: Replaced min-w-[600px] with min-w-150 */}
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <th className="py-4 px-4 font-normal">{copy.COLUMNS.NAME}</th>
                  <th className="py-4 px-4 font-normal">{copy.COLUMNS.CONTACT}</th>
                  <th className="py-4 px-4 font-normal">{copy.COLUMNS.TIER}</th>
                  <th className="py-4 px-4 font-normal">{copy.COLUMNS.STATUS}</th>
                  <th className="py-4 px-4 font-normal">{copy.COLUMNS.AMOUNT}</th>
                  <th className="py-4 px-4 font-normal text-right">{copy.COLUMNS.ACTIONS}</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((entry) => (
                  <FoundationRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}