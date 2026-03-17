/* src/app/dashboard/foundation/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import FoundationStats from '@/components/dashboard/foundation/FoundationStats';
import FoundationRow, { Supporter } from '@/components/dashboard/foundation/FoundationRow';

export const revalidate = 0;

export default async function FoundationCommandPage() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;

  const { data: supportersData } = await supabase
    .from('supporters')
    .select('*')
    .order('created_at', { ascending: false });

  const roster: Supporter[] = supportersData || [];

  // Logic: MRR is only from active Builders ($5) and Backers (Custom monthly)
  const activeMRR = roster
    .filter(s => s.status === 'ACTIVE' && (s.tier === 'BUILDER' || s.tier === 'BACKER'))
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

  // Logic: Total Engine Fuel is the sum of every dollar ever recorded in the table
  const totalLifetimeFuel = roster.reduce((sum, s) => sum + Number(s.amount || 0), 0);

  const stats = {
    mrr: activeMRR,
    builders: roster.filter(s => s.tier === 'BUILDER').length,
    backers: roster.filter(s => s.tier === 'BACKER').length,
    boosts: roster.filter(s => s.tier === 'BOOST').length,
    totalFuel: totalLifetimeFuel,
    observers: roster.filter(s => s.tier === 'OBSERVER').length
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
          {copy.TITLE}
        </h1>
        <p className="text-[10px] font-mono text-white/40 mt-2 tracking-widest uppercase italic">
          {copy.STATS_TITLE} // DATA_INTEGRITY_VERIFIED
        </p>
      </header>

      <FoundationStats stats={stats} />
      
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="p-5 border-b border-white/10 bg-black/20 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">{copy.ROSTER_TITLE}</h2>
          <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-2 py-1 rounded border border-brand-primary/10">
            {roster.length} TOTAL NODES
          </span>
        </div>
        
        {roster.length === 0 ? (
          <div className="p-16 text-center text-white/20 font-mono text-xs uppercase tracking-widest">
            Awaiting incoming connections...
          </div>
        ) : (
          <div className="overflow-x-auto">
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