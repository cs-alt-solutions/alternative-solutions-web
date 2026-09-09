'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Activity, Users, Loader2, TrendingDown } from 'lucide-react';

export default function TelemetryRow() {
  const [metrics, setMetrics] = useState({
    grossMrr: 0,
    netMrr: 0,
    promoDiscount: 0,
    totalPortals: 0,
    foundationCount: 0,
    proCount: 0,
    pendingLeads: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      
      // 1. Get Active Revenue & Portals
      const { data: storefronts } = await supabase
        .from('storefronts')
        // NOTE: In the future, you should add a 'monthly_discount' column to this table 
        // so you can track promos dynamically per client instead of hardcoding.
        .select('plan_tier, stripe_subscription_id')
        .in('status', ['ACTIVE', 'LIVE'])
        .not('stripe_subscription_id', 'is', null);

      let fCount = 0;
      let pCount = 0;
      let calculatedGross = 0;
      
      // TEMPORARY PROMO LOGIC: 
      // Hardcoding your $5 promo deduction here for now so your Net MRR reads correctly.
      let calculatedPromo = 5; 

      if (storefronts) {
        storefronts.forEach((store) => {
          const plan = (store.plan_tier || '').toLowerCase();
          
          if (plan.includes('pro') || plan.includes('professional')) {
            pCount++;
            calculatedGross += 15;
          } else {
            fCount++;
            calculatedGross += 5;
          }
        });
      }
      
      // 2. Get Pending Applications
      const { count } = await supabase
        .from('storefront_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      setMetrics({
        grossMrr: calculatedGross,
        promoDiscount: calculatedPromo,
        netMrr: calculatedGross - calculatedPromo,
        totalPortals: storefronts ? storefronts.length : 0,
        foundationCount: fCount,
        proCount: pCount,
        pendingLeads: count || 0
      });
      
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
      
      {/* 🚀 UPGRADED MRR WIDGET */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CreditCard size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net MRR</span>
          </div>
          
          {metrics.promoDiscount > 0 && (
            <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
              <TrendingDown size={10} /> Promo Active
            </span>
          )}
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white">${metrics.netMrr.toFixed(2)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
          
          {/* MRR Breakdown Bar */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
            <div className="text-zinc-400">Gross: <span className="text-white">${metrics.grossMrr.toFixed(2)}</span></div>
            {metrics.promoDiscount > 0 && (
              <div className="text-rose-400">Discounts: -${metrics.promoDiscount.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 UPGRADED ACTIVE NODES WIDGET */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <Activity size={16} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Portals</span>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white">{metrics.totalPortals} <span className="text-sm text-zinc-500 font-medium">Deployed</span></h2>
          
          {/* Tier Breakdown Bar */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
            <div className="text-cyan-400">Foundation: <span className="text-white">{metrics.foundationCount}</span></div>
            <div className="text-cyan-400">Pro: <span className="text-white">{metrics.proCount}</span></div>
          </div>
        </div>
      </div>

      {/* QUEUE WIDGET */}
      <div className="bg-black/40 border border-fuchsia-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all" />
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
            <Users size={16} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending Queue</span>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white">{metrics.pendingLeads} <span className="text-sm text-zinc-500 font-medium">Leads</span></h2>
          
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Awaiting Review</span>
          </div>
        </div>
      </div>

    </div>
  );
}