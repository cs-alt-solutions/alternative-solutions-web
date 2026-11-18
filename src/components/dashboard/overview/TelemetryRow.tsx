/* src/components/dashboard/overview/TelemetryRow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { CreditCard, Users, Loader2, Clock, Hammer, Zap, CheckCircle2, Globe, Beaker, Sparkles } from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';
import { OVERVIEW_COPY, classifyStorefront } from '@/config/dashboard/overview';

export default function TelemetryRow() {
  const [metrics, setMetrics] = useState({
    grossMrr: 0,
    netMrr: 0,
    promoDiscount: 0,
    totalDeployed: 0,
    activeBuilds: 0,
    holdingCount: 0,
    onboardingCount: 0,
    awaitingReview: 0,
    prototypeCount: 0,
    publicPrototypeCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const copy = OVERVIEW_COPY.TELEMETRY;

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      
      try {
        const { data: storefronts } = await supabase
          .from('storefronts')
          .select('status, plan_tier, stripe_subscription_id, stripe_customer_id, is_template, is_published');
          
        let gross = 0;
        let net = 0;
        let deployed = 0;
        let activeWorkshop = 0;
        let holding = 0;
        let onboarding = 0;
        let prototypes = 0;
        let publicPrototypes = 0;

        if (storefronts) {
          // 1. Classify every row using the shared Single Source of Truth helper
          storefronts.forEach((store) => {
            const bucket = classifyStorefront(store);
            if (bucket === 'PROTOTYPE') {
              prototypes++;
              if (store.is_published) publicPrototypes++;
            } else if (bucket === 'LIVE') {
              deployed++;
            } else if (bucket === 'HOLDING') {
              holding++;
            } else if (bucket === 'WORKSHOP') {
              activeWorkshop++;
              if (store.status === 'ONBOARDING' || store.status === 'AWAITING_PAYMENT') {
                onboarding++;
              }
            }
          });

          // 2. Calculate Net MRR strictly from non-template, non-ignored stores with an active subscription
          const activeStores = storefronts.filter(store => {
            const bucket = classifyStorefront(store);
            return (bucket === 'LIVE' || bucket === 'HOLDING' || bucket === 'WORKSHOP') && Boolean(store.stripe_subscription_id);
          });
          
          const invoiceData = await getGlobalInvoices();
          const validInvoices = (invoiceData.success && invoiceData.invoices) ? invoiceData.invoices : [];
          
          const activeCustomerIds = activeStores.map(s => s.stripe_customer_id).filter(Boolean);
          const strictLedger = validInvoices.filter((inv: any) => activeCustomerIds.includes(inv.customerId));

          activeStores.forEach((store) => {
            const rawTier = (store.plan_tier || '').toLowerCase();
            const isPro = rawTier.includes('pro') || rawTier.includes('professional');
            const expectedPrice = isPro ? 15 : 5;
            gross += expectedPrice;
            
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
        }
        
        // 3. Fetch Pending Applications
        const { count: reviewCount } = await supabase
          .from('storefront_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PENDING');

        setMetrics({
          grossMrr: gross,
          netMrr: net,
          promoDiscount: Math.max(0, gross - net),
          totalDeployed: deployed,
          activeBuilds: activeWorkshop,
          holdingCount: holding,
          onboardingCount: onboarding,
          awaitingReview: reviewCount || 0,
          prototypeCount: prototypes,
          publicPrototypeCount: publicPrototypes
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
      <div className="w-full flex items-center justify-center p-8 bg-black/40 border border-white/5 rounded-2xl h-32 mb-6">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const netPercentage = metrics.grossMrr > 0 ? (metrics.netMrr / metrics.grossMrr) * 100 : 0;
  const promoPercentage = metrics.grossMrr > 0 ? (metrics.promoDiscount / metrics.grossMrr) * 100 : 0;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
      
      {/* 1. APPLICATION RADAR */}
      <div className="bg-zinc-950/80 border border-fuchsia-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-fuchsia-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 shrink-0">
              <Users size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{copy.RADAR_TITLE}</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1 flex-1 flex flex-col justify-between">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
              {metrics.awaitingReview}
            </h2>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate">{copy.RADAR_SUBTITLE}</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metrics.awaitingReview > 0 ? (
              <div className="flex items-center gap-1 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-fuchsia-400 uppercase tracking-wider">
                <Zap size={10} className="animate-pulse shrink-0" /> {metrics.awaitingReview} {copy.ACTION_REQUIRED}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                <CheckCircle2 size={10} className="shrink-0" /> {copy.AWAITING_REVIEW}
              </div>
            )}
            {metrics.onboardingCount > 0 && (
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                <Clock size={10} className="shrink-0" /> {metrics.onboardingCount} {copy.ONBOARDING_SUFFIX}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE WORKSHOP CAPACITY */}
      <Link href="/dashboard/storefronts" className="bg-zinc-950/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
              <Hammer size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{copy.CAPACITY_TITLE}</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded shadow-sm shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-black text-cyan-400 tracking-widest">{metrics.activeBuilds} / 5</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">{metrics.activeBuilds}</h2>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate">{copy.IN_PROGRESS}</span>
          </div>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex gap-1 h-1.5 w-full">
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
            <div className="flex justify-between text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-zinc-500">
              <span className="text-cyan-400">{Math.max(0, 5 - metrics.activeBuilds)} {copy.SLOTS_OPEN}</span>
              {metrics.holdingCount > 0 && <span className="text-amber-400">{metrics.holdingCount} {copy.HOLDING_SUFFIX}</span>}
            </div>
          </div>
        </div>
      </Link>

      {/* 3. THE LAB */}
      <Link href="/dashboard/storefronts" className="bg-zinc-950/80 border border-violet-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-violet-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-violet-500/10 rounded-lg text-violet-400 shrink-0">
              <Beaker size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{copy.LAB_TITLE}</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1 flex-1 flex flex-col justify-between">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">{metrics.prototypeCount}</h2>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-medium truncate">{copy.LAB_SUBTITLE}</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-violet-400 uppercase tracking-wider">
              <Sparkles size={10} className="shrink-0" /> {metrics.publicPrototypeCount} {copy.PUBLIC_SHOWCASE_SUFFIX}
            </div>
          </div>
        </div>
      </Link>

      {/* 4. NET MRR */}
      <Link href="/dashboard/ledger" className="bg-zinc-950/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <CreditCard size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{copy.MRR_TITLE}</span>
          </div>

          {metrics.totalDeployed > 0 && (
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 shrink-0">
              <Globe size={9} /> {metrics.totalDeployed} {copy.LIVE_SUFFIX}
            </span>
          )}
        </div>
        
        <div className="relative z-10 mt-1">
          <div className="flex items-baseline gap-0.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">${metrics.netMrr.toFixed(0)}</h2>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-medium">{copy.PER_MONTH}</span>
          </div>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${netPercentage}%` }} />
              <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${promoPercentage}%` }} />
            </div>

            <div className="flex justify-between text-[8px] sm:text-[9px] font-mono uppercase tracking-wider">
              <span className="text-emerald-400">{copy.NET_PREFIX} ${metrics.netMrr}</span>
              <span className="text-zinc-500">{copy.GROSS_PREFIX} ${metrics.grossMrr}</span>
            </div>
          </div>
        </div>
      </Link>

    </div>
  );
}