/* src/components/dashboard/overview/TelemetryRow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Users, Loader2, TrendingDown, Hammer, Zap, CheckCircle2, Globe, Beaker, Sparkles } from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';

export default function TelemetryRow() {
  const [metrics, setMetrics] = useState({
    grossMrr: 0,
    netMrr: 0,
    promoDiscount: 0,
    totalDeployed: 0,
    activeBuilds: 0,
    workQueue: 0,
    awaitingPayment: 0,
    awaitingReview: 0,
    prototypeCount: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      
      try {
        // 1. Fetch Storefront Data
        const { data: storefronts } = await supabase
          .from('storefronts')
          .select('status, plan_tier, stripe_subscription_id, stripe_customer_id, is_template');
          
        let gross = 0;
        let net = 0;
        let deployed = 0;
        let active = 0;
        let queue = 0;
        let payment = 0;
        let prototypes = 0;

        if (storefronts) {
          // Identify the real paying clients based on the same rules as the Ledger
          const activeStores = storefronts.filter(store => 
            !store.is_template && 
            store.status !== 'PROTOTYPE' &&
            ['PENDING_BUILD', 'BUILDING_CORE', 'IN_REVIEW', 'CONTENT_ASSEMBLY', 'AWAITING_ASSETS', 'ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN'].includes(store.status) &&
            store.stripe_subscription_id
          );
          
          // 2. Fetch the Master Ledger (Stripe API) to match the real MRR
          const invoiceData = await getGlobalInvoices();
          const validInvoices = (invoiceData.success && invoiceData.invoices) ? invoiceData.invoices : [];
          
          // Only map invoices that belong to our active subset
          const activeCustomerIds = activeStores.map(s => s.stripe_customer_id).filter(Boolean);
          const strictLedger = validInvoices.filter((inv: any) => activeCustomerIds.includes(inv.customerId));

          // 3. Mirror the Exact Math from the Ledger
          activeStores.forEach((store) => {
             const rawTier = (store.plan_tier || '').toLowerCase();
             const isPro = rawTier.includes('pro') || rawTier.includes('professional');
             const expectedPrice = isPro ? 15 : 5;
             gross += expectedPrice;
             
             // Check the ledger for their actual payment amount
             const storeInvoices = strictLedger.filter((inv: any) => inv.customerId === store.stripe_customer_id);
             let actualPaid = expectedPrice;
             
             if (storeInvoices.length > 0) {
                const latestInv = storeInvoices[0];
                actualPaid = latestInv.amount !== undefined && latestInv.amount !== null 
                  ? Number(latestInv.amount) 
                  : expectedPrice;
             }
             
             net += actualPaid;
          });
          
          // Calculate Pipeline Volumes
          storefronts.forEach((store) => {
            // Isolate Prototypes / Demos into The Lab
            if (store.is_template || store.status === 'PROTOTYPE') {
              prototypes++;
            } else {
              // Live Sites Count (Only finished sites)
              if (['ACTIVE', 'LIVE'].includes(store.status)) {
                deployed++;
              }
              
              // Drafting Table Pipeline Math
              if (['BUILDING_CORE', 'CONTENT_ASSEMBLY', 'IN_REVIEW', 'AWAITING_ASSETS'].includes(store.status)) active++;
              if (store.status === 'PENDING_BUILD') queue++;
              if (store.status === 'AWAITING_PAYMENT') payment++;
            }
          });
        }
        
        // 4. Fetch the Application Radar Leads
        const { count: reviewCount } = await supabase
          .from('storefront_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PENDING');

        setMetrics({
          grossMrr: gross,
          netMrr: net,
          promoDiscount: gross - net, // Accurately calculates the exact delta
          totalDeployed: deployed,
          activeBuilds: active,
          workQueue: queue,
          awaitingPayment: payment,
          awaitingReview: reviewCount || 0,
          prototypeCount: prototypes
        });
      } catch (err) {
        console.error("Telemetry Sync Error:", err);
      }
      
      setIsLoading(false);
    };
    
    fetchTelemetry();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-black/40 border border-white/5 rounded-2xl h-40">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  // Visual Math Helpers
  const netPercentage = metrics.grossMrr > 0 ? (metrics.netMrr / metrics.grossMrr) * 100 : 0;
  const promoPercentage = metrics.grossMrr > 0 ? (metrics.promoDiscount / metrics.grossMrr) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
      
      {/* 1. APPLICATION RADAR */}
      <div className="bg-black/40 border border-fuchsia-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Application Radar</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-2 flex-1 flex flex-col justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-white drop-shadow-md">
              {metrics.awaitingReview + metrics.awaitingPayment}
            </h2>
            <span className="text-sm text-zinc-500 font-medium mb-1.5">Pending Leads</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {metrics.awaitingReview > 0 ? (
              <div className="flex items-center gap-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
                <Zap size={10} className="animate-pulse" /> {metrics.awaitingReview} Action Required
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <CheckCircle2 size={10} /> 0 Awaiting Review
              </div>
            )}

            {metrics.awaitingPayment > 0 ? (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                <TrendingDown size={10} /> {metrics.awaitingPayment} Awaiting Payment
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <CheckCircle2 size={10} /> 0 Checkout
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE CAPACITY */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Hammer size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Capacity</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-[9px] font-black text-cyan-400 tracking-widest">{metrics.activeBuilds} / 5</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-2">
          <h2 className="text-3xl font-black text-white drop-shadow-md">{metrics.activeBuilds} <span className="text-sm text-zinc-500 font-medium">In Progress</span></h2>
          
          <div className="mt-5 space-y-2">
            <div className="flex gap-1.5 h-2 w-full">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-sm transition-colors duration-500 ${
                    i < metrics.activeBuilds 
                      ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                      : 'bg-zinc-800'
                  }`} 
                />
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              <span className="text-cyan-400">{5 - metrics.activeBuilds} Slots Open</span>
              {metrics.workQueue > 0 && <span>{metrics.workQueue} In Queue</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE LAB (Prototypes & Demos) */}
      <div className="bg-black/40 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-violet-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
              <Beaker size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">The Lab</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-2 flex-1 flex flex-col justify-between">
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-black text-white drop-shadow-md">{metrics.prototypeCount}</h2>
            <span className="text-sm text-zinc-500 font-medium mb-1.5">Models & Demos</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold text-violet-400 uppercase tracking-widest">
              <Sparkles size={10} className="animate-pulse" /> Sandbox Active
            </div>
          </div>
        </div>
      </div>

      {/* 4. NET MRR (Revenue & Live Sites) */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CreditCard size={16} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net MRR</span>
          </div>
          {metrics.totalDeployed > 0 && (
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 shadow-sm">
              <Globe size={10} /> {metrics.totalDeployed} Live
            </span>
          )}
        </div>
        
        <div className="relative z-10 mt-2">
          <h2 className="text-3xl font-black text-white drop-shadow-md">${metrics.netMrr.toFixed(2)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
          
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${netPercentage}%` }} />
              <div className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000" style={{ width: `${promoPercentage}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
              <span className="text-emerald-400">Net: ${metrics.netMrr}</span>
              <span className="text-amber-400">Promo: -${metrics.promoDiscount}</span>
              <span className="text-zinc-500">Gross: ${metrics.grossMrr}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}