/* src/app/dashboard/foundation/page.tsx */
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import FoundationStats from '@/components/dashboard/foundation/FoundationStats';
import FoundationRow, { Supporter } from '@/components/dashboard/foundation/FoundationRow';
import CampaignCard from '@/components/dashboard/foundation/CampaignCard';
import { LayoutDashboard, SlidersHorizontal, Plus, Target } from 'lucide-react';

export const revalidate = 0;

export default async function FoundationCommandPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;
  
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'roster';

  const { data: supportersData } = await supabase
    .from('supporters')
    .select('*')
    .order('created_at', { ascending: false });

  const roster: Supporter[] = supportersData || [];

  const activeMRR = roster
    .filter(s => s.status === 'ACTIVE' && (s.tier === 'BUILDER' || s.tier === 'BACKER'))
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

  const totalLifetimeFuel = roster.reduce((sum, s) => sum + Number(s.amount || 0), 0);

  const stats = {
    mrr: activeMRR,
    builders: roster.filter(s => s.tier === 'BUILDER').length,
    backers: roster.filter(s => s.tier === 'BACKER').length,
    boosts: roster.filter(s => s.tier === 'BOOST').length,
    clients: roster.filter(s => s.tier === 'CLIENT').length,
    totalFuel: totalLifetimeFuel,
    observers: roster.filter(s => s.tier === 'OBSERVER').length
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-white/10 pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
            {copy.TITLE}
          </h1>
          <p className="text-[10px] font-mono text-white/40 mt-2 tracking-widest uppercase italic">
            {copy.STATS_TITLE} // DATA_INTEGRITY_VERIFIED
          </p>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-px">
        <Link 
          href="/dashboard/foundation?tab=roster"
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${currentTab === 'roster' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white/80 hover:border-white/20'}`}
        >
          <LayoutDashboard size={14} /> {copy.TABS?.ROSTER || "Roster & Revenue"}
        </Link>
        <Link 
          href="/dashboard/foundation?tab=campaigns"
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${currentTab === 'campaigns' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white/80 hover:border-white/20'}`}
        >
          <Target size={14} /> {copy.CAMPAIGNS?.TAB || "Client Campaigns"}
        </Link>
        <Link 
          href="/dashboard/foundation?tab=widgets"
          className={`flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-all ${currentTab === 'widgets' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white/80 hover:border-white/20'}`}
        >
          <SlidersHorizontal size={14} /> {copy.TABS?.WIDGETS || "Public Widgets"}
        </Link>
      </div>

      {currentTab === 'roster' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              <div className="overflow-auto max-h-125 min-h-87.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse min-w-150 relative">
                  <thead className="sticky top-0 z-10 bg-black/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <tr className="border-b border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
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
      )}

      {currentTab === 'campaigns' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Active Funding Bounties</h2>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Community-Funded Client Builds</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/30 px-5 py-2.5 rounded-lg hover:bg-brand-primary hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Plus size={14} /> New Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CampaignCard 
              copy={copy.CAMPAIGNS?.CARD || {}}
              campaign={{
                id: '1',
                clientName: 'Victory Automotive',
                projectName: 'Digital Inspection System',
                targetAmount: 5000,
                raisedAmount: 2150,
                backerCount: 14,
                status: 'FUNDING'
              }} 
            />
            <CampaignCard 
              copy={copy.CAMPAIGNS?.CARD || {}}
              campaign={{
                id: '2',
                clientName: 'Ink & Ledger',
                projectName: 'Artist Booking Portal',
                targetAmount: 8500,
                raisedAmount: 8500,
                backerCount: 42,
                status: 'BUILDING'
              }} 
            />
          </div>
        </div>
      )}

      {currentTab === 'widgets' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold uppercase tracking-widest text-white">Active Launch Widgets</h2>
             <button className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-lg hover:bg-brand-primary/20 transition-all">
               <Plus size={14} /> New Widget
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-bg-surface-200 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Homepage Hero</div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase mb-6">Shift Studio Founders</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Total Slots Limit</label>
                    <input type="number" defaultValue={20} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-primary outline-hidden transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">Target Date</label>
                    <input type="datetime-local" defaultValue="2026-04-01T00:00" className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-brand-primary outline-hidden transition-all" />
                  </div>
                  <button className="w-full mt-4 bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest py-2 rounded-lg hover:bg-white/10 transition-all">
                    Update Widget
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}