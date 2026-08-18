'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Activity, Users, Loader2 } from 'lucide-react';

export default function TelemetryRow() {
  const [mrr, setMrr] = useState(0);
  const [activePortals, setActivePortals] = useState(0);
  const [pendingLeads, setPendingLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      
      // 1. Get Active Revenue & Portals
      const { data: storefronts } = await supabase
        .from('storefronts')
        .select('plan_tier, stripe_subscription_id')
        .in('status', ['ACTIVE', 'LIVE'])
        .not('stripe_subscription_id', 'is', null);

      if (storefronts) {
        setActivePortals(storefronts.length);
        const calculatedMrr = storefronts.reduce((total, store) => {
          const plan = (store.plan_tier || '').toLowerCase();
          return total + (plan.includes('pro') ? 15 : 5);
        }, 0);
        setMrr(calculatedMrr);
      }

      // 2. Get Pending Applications
      const { count } = await supabase
        .from('storefront_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      if (count !== null) setPendingLeads(count);
      
      setIsLoading(false);
    };

    fetchTelemetry();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-black/40 border border-white/5 rounded-2xl">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {/* MRR Widget */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CreditCard size={16} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirmed MRR</span>
        </div>
        <h2 className="text-3xl font-black text-white relative z-10">${mrr.toFixed(2)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
      </div>

      {/* Active Nodes Widget */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <Activity size={16} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Portals</span>
        </div>
        <h2 className="text-3xl font-black text-white relative z-10">{activePortals} <span className="text-sm text-zinc-500 font-medium">Deployed</span></h2>
      </div>

      {/* Queue Widget */}
      <div className="bg-black/40 border border-fuchsia-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all shadow-lg">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
            <Users size={16} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending Queue</span>
        </div>
        <h2 className="text-3xl font-black text-white relative z-10">{pendingLeads} <span className="text-sm text-zinc-500 font-medium">Leads</span></h2>
      </div>
    </div>
  );
}