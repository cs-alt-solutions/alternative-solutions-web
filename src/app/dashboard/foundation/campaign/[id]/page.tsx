/* src/app/dashboard/foundation/campaign/[id]/page.tsx */
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, DollarSign, Code, Send, CheckCircle2, Copy } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

// MOCK DATA for visual layout
const MOCK_CAMPAIGN = {
  id: '1',
  clientName: 'Victory Automotive',
  projectName: 'Digital Inspection System',
  targetAmount: 5000,
  raisedAmount: 3250,
  backerCount: 24,
  status: 'FUNDING',
  description: 'Building a unified digital vehicle inspection (DVI) system to replace their paper clipboards and connect directly to their inventory.',
};

const MOCK_BACKERS = [
  { id: 'b1', name: 'Sarah Jenkins', amount: 150, type: 'ONE-TIME BOOST', date: '2026-03-17' },
  { id: 'b2', name: 'Mike T. (Local Legend)', amount: 50, type: 'ONE-TIME BOOST', date: '2026-03-16' },
  { id: 'b3', name: 'Anonymous', amount: 500, type: 'ANGEL BOOST', date: '2026-03-15' },
];

export default function CampaignManagePage({ params }: { params: { id: string } }) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.CAMPAIGN_DETAIL;
  const progress = Math.min((MOCK_CAMPAIGN.raisedAmount / MOCK_CAMPAIGN.targetAmount) * 100, 100);
  const avgBoost = MOCK_CAMPAIGN.raisedAmount / MOCK_CAMPAIGN.backerCount;

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* HEADER NAV */}
      <Link href="/dashboard/foundation?tab=campaigns" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-brand-primary transition-colors mb-8">
        <ArrowLeft size={14} /> {copy.BACK_BTN}
      </Link>

      {/* CAMPAIGN HEADER */}
      <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-8">
        <div>
          <h4 className="text-xs font-mono text-brand-primary uppercase tracking-widest mb-2">
            CLIENT: {MOCK_CAMPAIGN.clientName}
          </h4>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white mb-2">
            {MOCK_CAMPAIGN.projectName}
          </h1>
          <p className="text-sm font-mono text-white/60 max-w-2xl">
            {MOCK_CAMPAIGN.description}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-widest bg-white/5 text-white border border-white/10 px-6 py-3 rounded-lg hover:bg-white/10 transition-all">
            <Send size={16} /> {copy.ACTIONS.BROADCAST}
          </button>
          <button className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-6 py-3 rounded-lg hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <CheckCircle2 size={16} /> {copy.ACTIONS.FINALIZE}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TELEMETRY & WIDGET */}
        <div className="lg:col-span-1 space-y-8">
          {/* Progress Card */}
          <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">{copy.TABS.OVERVIEW}</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-black text-white tracking-tighter">${MOCK_CAMPAIGN.raisedAmount.toLocaleString()}</span>
                <span className="text-sm font-mono text-white/40">/ ${MOCK_CAMPAIGN.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-black/60 rounded-full border border-white/5 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-brand-primary to-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{copy.STATS.BACKERS}</div>
                <div className="text-xl font-bold text-white flex items-center gap-2"><Users size={16} className="text-brand-primary"/> {MOCK_CAMPAIGN.backerCount}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{copy.STATS.AVG_BOOST}</div>
                <div className="text-xl font-bold text-white flex items-center gap-2"><DollarSign size={16} className="text-emerald-400"/> {avgBoost.toFixed(0)}</div>
              </div>
            </div>
          </div>

          {/* Widget Generator */}
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Code size={64} /></div>
            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-2 relative z-10">Client Widget</h3>
            <p className="text-xs font-mono text-white/60 mb-6 relative z-10">
              Send this iframe to the client to embed their live funding progress bar on their own website.
            </p>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 mb-4 font-mono text-[10px] text-white/40 break-all relative z-10">
              {`<iframe src="https://studio.alternativesolutions.io/embed/campaign/${MOCK_CAMPAIGN.id}" width="100%" height="200" style="border:none;"></iframe>`}
            </div>
            <button className="w-full flex items-center justify-center gap-2 text-xs font-mono uppercase font-bold tracking-widest bg-brand-primary text-black px-4 py-3 rounded-lg hover:bg-brand-accent transition-all relative z-10">
              <Copy size={14} /> {copy.ACTIONS.COPY_WIDGET}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: THE LEDGER */}
        <div className="lg:col-span-2">
          <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl h-full">
            <div className="p-6 border-b border-white/10 bg-black/20 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">{copy.TABS.BACKERS}</h2>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                LIVE LEDGER SYNCED
              </span>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead className="bg-black/40">
                <tr className="border-b border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <th className="py-4 px-6 font-normal">{copy.LEDGER_COLS.DATE}</th>
                  <th className="py-4 px-6 font-normal">{copy.LEDGER_COLS.BACKER}</th>
                  <th className="py-4 px-6 font-normal">{copy.LEDGER_COLS.TYPE}</th>
                  <th className="py-4 px-6 font-normal text-right">{copy.LEDGER_COLS.AMOUNT}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BACKERS.map((backer) => (
                  <tr key={backer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 text-xs font-mono text-white/40">{backer.date}</td>
                    <td className="py-4 px-6 text-sm font-bold text-white">{backer.name}</td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-mono px-2 py-1 rounded border border-brand-primary/30 text-brand-primary bg-brand-primary/10">
                        {backer.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-emerald-400 font-bold group-hover:text-emerald-300">
                      ${backer.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}