/* src/app/dashboard/waitlist/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import WaitlistRow from '@/components/dashboard/WaitlistRow';

export default async function WaitlistManagementPage() {
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;

  // Fetch live data from Supabase
  const { data: entries } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            {copy.TITLE}
          </h1>
          <p className="text-text-muted text-sm font-mono uppercase tracking-widest mt-1">
            {/* FIX: Using LEAD_COUNT to match glossary.js */}
            {entries?.length || 0} {copy.LEAD_COUNT}
          </p>
        </div>
      </header>

      <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="py-4 px-4 text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">{copy.COLUMNS.USER}</th>
              <th className="py-4 px-4 text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">{copy.COLUMNS.PROJECT}</th>
              <th className="py-4 px-4 text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">{copy.COLUMNS.STATUS}</th>
              <th className="py-4 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry) => (
              <WaitlistRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}