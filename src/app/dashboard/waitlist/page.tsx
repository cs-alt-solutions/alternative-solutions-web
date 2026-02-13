/* src/app/dashboard/waitlist/page.tsx */
import React from 'react';
import { MOCK_DB } from '@/data/store';
import { Mail, Filter } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';
import WaitlistRow from '@/components/dashboard/WaitlistRow';

export default function WaitlistManager() {
  const entries = MOCK_DB.waitlist;
  const { WAITLIST } = WEBSITE_COPY.DASHBOARD;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-text-main">
      {/* Background FX: Subtle Stardust to match the brand vibe */}
      <div className="fixed inset-0 bg-stardust pointer-events-none" />
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-widest text-white">
            {WAITLIST.TITLE}
          </h1>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
            {WAITLIST.LEAD_COUNT} {entries.length}
          </p>
        </div>
        <button className="btn-brand px-4 py-2 text-[10px] flex items-center gap-2 h-auto">
          <Mail size={14} /> {WAITLIST.EXPORT_BTN}
        </button>
      </header>

      {/* CONTENT */}
      <main className="p-8 relative z-10">
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          
          {/* TOOLBAR */}
          <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-white/2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {WAITLIST.FILTER_LABEL}
            </span>
            <select className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-colors">
                <option>{WAITLIST.STATUSES.ALL}</option>
                <option>{WAITLIST.STATUSES.PENDING}</option>
                <option>{WAITLIST.STATUSES.INVITED}</option>
            </select>
          </div>

          {/* TABLE */}
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-6 py-4 font-normal">{WAITLIST.COLUMNS.EMAIL}</th>
                <th className="px-6 py-4 font-normal">{WAITLIST.COLUMNS.SOURCE}</th>
                <th className="px-6 py-4 font-normal">{WAITLIST.COLUMNS.JOINED}</th>
                <th className="px-6 py-4 font-normal">{WAITLIST.COLUMNS.STATUS}</th>
                <th className="px-6 py-4 font-normal text-right">{WAITLIST.COLUMNS.ACTIONS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry) => (
                <WaitlistRow key={entry.id} entry={entry} />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}