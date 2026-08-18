'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Zap, RefreshCw, Loader2, CalendarClock } from 'lucide-react';

export default function SubscriptionsTab() {
  const [storefronts, setStorefronts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('storefronts')
      .select('id, business_name, plan_tier, created_at, status, stripe_subscription_id, current_period_end')
      .in('status', ['ACTIVE', 'LIVE'])
      // 🚀 THE FIX: Only pull storefronts that have actually checked out via Stripe
      .not('stripe_subscription_id', 'is', null) 
      // 🚀 BONUS FIX: Sort them by who pays you next, rather than when they were created
      .order('current_period_end', { ascending: true });

    if (!error && data) {
      setStorefronts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const activeCount = storefronts.length;
  // Assumes your foundational tier is $5/mo
  const monthlyRecurring = activeCount * 5.00; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER: STOREFRONT REVENUE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-surface-200/50 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div>
          <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight uppercase">
            <CreditCard size={24} className="text-emerald-400" />
            Storefront Revenue
          </h2>
          <p className="text-slate-400 font-mono text-sm">Live client subscriptions funding the ecosystem.</p>
        </div>
        
        {/* Sync Status Button */}
        <button 
          onClick={fetchSubscriptions}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
          Sync Stripe
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Storefronts</p>
            <p className="text-xl font-black text-white">{activeCount}</p>
          </div>
        </div>
        <div className="bg-bg-surface-100 border border-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <RefreshCw size={20} />
          </div>
          <div>
             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Monthly Recurring (MRR)</p>
             <p className="text-xl font-black text-emerald-400">${monthlyRecurring.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ROSTER LEDGER */}
      <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/40">
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Client Storefront</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tier</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Next Bill</th>
              <th className="p-4 text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Loading Subscriptions...
                </td>
              </tr>
            ) : storefronts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  No active storefronts found.
                </td>
              </tr>
            ) : (
              storefronts.map((store) => (
                <tr key={store.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm text-white font-bold flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    {store.business_name}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400 capitalize">{store.plan_tier || 'Foundation'}</td>
                  
                  {/* The Billing Date Column */}
                  <td className="p-4 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <CalendarClock size={12} className="text-slate-500" />
                    {store.current_period_end 
                      ? new Date(store.current_period_end).toLocaleDateString() 
                      : 'Pending Sync...'}
                  </td>

                  <td className="p-4 text-sm text-emerald-400 font-bold text-right">
                    $5.00 <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}