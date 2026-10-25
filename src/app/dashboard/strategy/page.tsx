/* src/app/dashboard/strategy/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Lightbulb, ArrowRight, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import FailsafeRadar from '@/components/dashboard/strategy/FailsafeRadar';

export const dynamic = 'force-dynamic';

export default async function StrategyHubPage() {
  // 1. Fetch all research boards
  const { data: boards } = await supabase
    .from('ideas_ledger')
    .select('*, storefronts(business_name, status)')
    .eq('type', 'CLIENT_RESEARCH')
    .order('created_at', { ascending: false });

  // 2. Fetch all real clients (excluding templates and canceled ones)
  const { data: allClients } = await supabase
    .from('storefronts')
    .select('id, business_name, status')
    .eq('is_template', false)
    .neq('status', 'CANCELED');

  // 3. Find clients who don't have a board attached
  const boardStorefrontIds = boards?.map(b => b.storefront_id) || [];
  const missingClients = allClients?.filter(c => !boardStorefrontIds.includes(c.id)) || [];
  
  // 4. Filter the boards for display (Hide the ones we manually marked as BYPASSED/ARCHIVED)
  const activeDisplayBoards = boards?.filter(b => b.status !== 'ARCHIVED') || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/50 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
              <Lightbulb size={20} /> 
            </div>
            Strategy & Research Hub
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Global command center for client discovery, value-trades, and architecture planning.</p>
        </div>
      </div>

      {/* 🚀 THE FAILSAFE RADAR COMPONENT INJECTED HERE */}
      <FailsafeRadar missingClients={missingClients} />

      {/* ACTIVE BOARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeDisplayBoards.length === 0 ? (
          <div className="col-span-full p-16 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center bg-black/20">
            <BrainCircuit size={32} className="text-zinc-700 mb-4" />
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No active discovery boards. Awaiting new client pipeline.</p>
          </div>
        ) : (
          activeDisplayBoards.map((board: any) => (
            <div key={board.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-colors group flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                  board.storefronts?.status === 'AWAITING_PAYMENT' 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {board.storefronts?.status === 'AWAITING_PAYMENT' ? 'Pending Payment' : 'Active Build'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {new Date(board.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 truncate">
                {board.storefronts?.business_name || 'Unknown Client'}
              </h3>
              <p className="text-xs text-zinc-400 mb-6 font-mono truncate">
                {board.title}
              </p>

              <div className="mt-auto pt-4">
                <Link 
                  href={`/dashboard/strategy/${board.id}`}
                  className="flex items-center justify-between w-full bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group-hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                >
                  Open Board <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}