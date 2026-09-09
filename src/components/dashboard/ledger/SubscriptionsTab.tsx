'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Zap, RefreshCw, Loader2, CalendarClock, Receipt, Download, AlertTriangle, TrendingDown } from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';

export default function SubscriptionsTab() {
  const [storefronts, setStorefronts] = useState<any[]>([]);
  const [globalInvoices, setGlobalInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    setIsInvoicesLoading(true);
    setSyncError(null);

    // 1. FETCH SUBSCRIPTIONS 
    // Added 'contact_email' to pull the human into the ledger
    const { data: activeStores, error } = await supabase
      .from('storefronts')
      .select('id, business_name, contact_email, plan_tier, created_at, status, stripe_subscription_id')
      .in('status', ['ACTIVE', 'LIVE'])
      .not('stripe_subscription_id', 'is', null) 
      .order('created_at', { ascending: false });

    if (error) {
      console.error("🚨 SUPABASE ERROR (Active Stores):", error.message);
      setSyncError(`Active Stores Error: ${error.message}`);
    } else if (activeStores) {
      setStorefronts(activeStores);
    }
    setIsLoading(false);

    // 2. FETCH ALL KNOWN STOREFRONTS FOR RECONCILIATION 
    const { data: allStores, error: reconcileError } = await supabase
      .from('storefronts')
      .select('business_name');

    if (reconcileError) {
      console.error("🚨 SUPABASE ERROR (Reconciliation):", reconcileError.message);
    }

    // 3. FETCH GLOBAL STRIPE INVOICES & RECONCILE
    const invoiceData = await getGlobalInvoices();
    if (invoiceData.success && invoiceData.invoices) {
      const knownNames = allStores?.map(s => s.business_name?.toLowerCase()).filter(Boolean) || [];
      
      const reconciledInvoices = invoiceData.invoices.filter((inv: any) => {
        const cName = inv.customerName?.toLowerCase() || '';
        return knownNames.some(name => cName.includes(name) || name.includes(cName));
      });
      setGlobalInvoices(reconciledInvoices);
    } else if (invoiceData.error) {
      console.error("🚨 STRIPE API ERROR:", invoiceData.error);
    }
    setIsInvoicesLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- THE MATH ENGINE (Ported from Homepage) ---
  const activeCount = storefronts.length;
  let foundationCount = 0;
  let proCount = 0;
  let grossMrr = 0;
  
  // TEMPORARY PROMO LOGIC
  let promoDiscount = 5; 

  storefronts.forEach((store) => {
    const plan = (store.plan_tier || '').toLowerCase();
    if (plan.includes('pro') || plan.includes('professional')) {
      proCount++;
      grossMrr += 15;
    } else {
      foundationCount++;
      grossMrr += 5;
    }
  });

  let netMrr = grossMrr - promoDiscount;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
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
          onClick={fetchAllData}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white shrink-0 cursor-pointer"
        >
          {isLoading || isInvoicesLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
          Sync Stripe
        </button>
      </div>

      {/* ERROR RADAR */}
      {syncError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Database Sync Error</p>
            <p className="text-[10px] font-mono text-red-300 mt-1">{syncError}</p>
          </div>
        </div>
      )}

      {/* 🚀 UPGRADED QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ACTIVE PORTALS WIDGET */}
        <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Zap size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Portals</span>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white">{activeCount} <span className="text-sm text-zinc-500 font-medium">Deployed</span></h2>
            
            {/* Tier Breakdown Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <div className="text-cyan-400">Foundation: <span className="text-white">{foundationCount}</span></div>
              <div className="text-cyan-400">Pro: <span className="text-white">{proCount}</span></div>
            </div>
          </div>
        </div>

        {/* MRR WIDGET */}
        <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <RefreshCw size={16} />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net MRR</span>
            </div>
            
            {promoDiscount > 0 && (
              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                <TrendingDown size={10} /> Promo Active
              </span>
            )}
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white">${netMrr.toFixed(2)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
            
            {/* MRR Breakdown Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <div className="text-zinc-400">Gross: <span className="text-white">${grossMrr.toFixed(2)}</span></div>
              {promoDiscount > 0 && (
                <div className="text-rose-400">Discounts: -${promoDiscount.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 1: ACTIVE SUBSCRIPTIONS */}
      <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden shadow-xl mt-4">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <CalendarClock size={14} className="text-emerald-500" /> Active Subscriptions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Client / Storefront</th>
                <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tier</th>
                <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Deployed</th>
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
                storefronts.map((store) => {
                  const isPro = (store.plan_tier || '').toLowerCase().includes('pro') || (store.plan_tier || '').toLowerCase().includes('professional');
                  return (
                    <tr key={store.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white font-bold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
                            {store.business_name}
                          </span>
                          {store.contact_email && (
                            <span className="text-[10px] font-mono text-zinc-500 ml-5">{store.contact_email}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-400 capitalize">{store.plan_tier || 'Foundation'}</td>
                      
                      <td className="p-4 text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-2">
                          <CalendarClock size={12} className="text-slate-500 shrink-0" />
                          {store.created_at ? new Date(store.created_at).toLocaleDateString() : 'Pending Sync...'}
                        </div>
                      </td>

                      <td className="p-4 text-sm text-emerald-400 font-bold text-right">
                        ${isPro ? '15.00' : '5.00'} <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: THE MASTER INVOICE LEDGER */}
      <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden mt-8 shadow-xl">
        <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Receipt size={14} className="text-cyan-500" /> Global Payment History
          </h3>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Last 50 Transactions
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Client Name / Email</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isInvoicesLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 size={24} className="animate-spin text-cyan-500 mx-auto mb-3" />
                    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Securely Fetching Stripe Ledger...</span>
                  </td>
                </tr>
              ) : globalInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                    No payment history found on Stripe yet.
                  </td>
                </tr>
              ) : (
                globalInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{invoice.customerName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{invoice.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                        invoice.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-400 font-bold text-right">
                      ${invoice.amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {invoice.pdfUrl ? (
                        <a 
                          href={invoice.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700" 
                          title="Download PDF Receipt"
                        >
                          <Download size={14} />
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}