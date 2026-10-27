/* src/app/dashboard/strategy/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { Lightbulb, BrainCircuit } from 'lucide-react';
import FailsafeRadar from '@/components/dashboard/strategy/FailsafeRadar';
import StrategyCard from '@/components/dashboard/strategy/StrategyCard';

export const dynamic = 'force-dynamic';

export default async function StrategyHubPage() {
  const { data: boards } = await supabase
    .from('ideas_ledger')
    .select('*, storefronts(business_name, status)')
    .eq('type', 'CLIENT_RESEARCH')
    .order('created_at', { ascending: false });

  const { data: allClients } = await supabase
    .from('storefronts')
    .select('id, business_name, status')
    .eq('is_template', false)
    .neq('status', 'CANCELED');

  const boardStorefrontIds = boards?.map(b => b.storefront_id) || [];
  const missingClients = allClients?.filter(c => !boardStorefrontIds.includes(c.id)) || [];
  
  // Filter out ARCHIVED boards so they disappear when you manage them
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

      <FailsafeRadar missingClients={missingClients} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeDisplayBoards.length === 0 ? (
          <div className="col-span-full p-16 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center bg-black/20">
            <BrainCircuit size={32} className="text-zinc-700 mb-4" />
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No active discovery boards. Awaiting new client pipeline.</p>
          </div>
        ) : (
          activeDisplayBoards.map((board: any) => (
            <StrategyCard key={board.id} board={board} />
          ))
        )}
      </div>
    </div>
  );
}