/* src/components/dashboard/overview/TelemetryRow.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { CreditCard, Users, Loader2, Clock, Hammer, Zap, CheckCircle2, Globe, PauseCircle } from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';
import { OVERVIEW_COPY, classifyStorefront } from '@/config/dashboard/overview';

export default function TelemetryRow() {
  const [metrics, setMetrics] = useState({
    expectedMrr: 0,
    collectedThisMonth: 0,
    upcomingThisMonth: 0,
    totalDeployed: 0,
    activeBuilds: 0,
    holdingCount: 0,
    onboardingCount: 0,
    assetsOrReviewCount: 0,
    awaitingReview: 0
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
          
        let expected = 0;
        let collectedMonth = 0;
        let deployed = 0;
        let activeWorkshop = 0;
        let holding = 0;
        let onboarding = 0;
        let assetsOrReview = 0;

        if (storefronts) {
          storefronts.forEach((store) => {
            const bucket = classifyStorefront(store);
            if (bucket === 'LIVE') {
              deployed++;
            } else if (bucket === 'HOLDING') {
              holding++;
              if (store.status === 'ONBOARDING' || store.status === 'AWAITING_PAYMENT') {
                onboarding++;
              } else {
                assetsOrReview++;
              }
            } else if (bucket === 'WORKSHOP') {
              activeWorkshop++;
            }
          });

          // Calculate Expected Monthly MRR vs. Collected This Calendar Month from Ledger
          const activeStores = storefronts.filter(store => {
            const bucket = classifyStorefront(store);
            return (bucket === 'LIVE' || bucket === 'HOLDING' || bucket === 'WORKSHOP') && Boolean(store.stripe_subscription_id);
          });
          
          const invoiceData = await getGlobalInvoices();
          const validInvoices = (invoiceData.success && invoiceData.invoices) ? invoiceData.invoices : [];
          
          const activeCustomerIds = activeStores.map(s => s.stripe_customer_id).filter(Boolean);
          const strictLedger = validInvoices.filter((inv: any) => activeCustomerIds.includes(inv.customerId));

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          // Sum invoices cleared in the current calendar month
          strictLedger.forEach((inv: any) => {
            if (!inv.date) return;
            const invDate = new Date(inv.date);
            if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
              collectedMonth += Number(inv.amount || 0);
            }
          });

          // Sum expected monthly subscription total
          activeStores.forEach((store) => {
            const rawTier = (store.plan_tier || '').toLowerCase();
            const isPro = rawTier.includes('pro') || rawTier.includes('professional');
            const expectedPrice = isPro ? 15 : 5;
            
            const storeInvoices = strictLedger.filter((inv: any) => inv.customerId === store.stripe_customer_id);
            const effectiveRate = storeInvoices.length > 0 && storeInvoices[0].amount !== undefined
              ? Number(storeInvoices[0].amount)
              : expectedPrice;
              
            expected += effectiveRate;
          });
        }
        
        const { count: reviewCount } = await supabase
          .from('storefront_applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PENDING');

        setMetrics({
          expectedMrr: expected,
          collectedThisMonth: collectedMonth,
          upcomingThisMonth: Math.max(0, expected - collectedMonth),
          totalDeployed: deployed,
          activeBuilds: activeWorkshop,
          holdingCount: holding,
          onboardingCount: onboarding,
          assetsOrReviewCount: assetsOrReview,
          awaitingReview: reviewCount || 0
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
      <div className="w-full flex items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl h-32 mb-6">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const collectedPercentage = metrics.expectedMrr > 0 
    ? Math.min(100, (metrics.collectedThisMonth / metrics.expectedMrr) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6">
      
      {/* 1. APPLICATION RADAR */}
      <div className="bg-zinc-900/75 border border-zinc-700/60 border-t-2 border-t-fuchsia-500 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-fuchsia-500/50 transition-all shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-fuchsia-500/15 border border-fuchsia-500/30 rounded-lg text-fuchsia-400 shrink-0">
              <Users size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-widest truncate">{copy.RADAR_TITLE}</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1 flex-1 flex flex-col justify-between">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {metrics.awaitingReview}
            </h2>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">{copy.RADAR_SUBTITLE}</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metrics.awaitingReview > 0 ? (
              <div className="flex items-center gap-1 bg-fuchsia-500/15 border border-fuchsia-500/30 px-2 py-0.5 rounded text-[9px] font-bold text-fuchsia-300 uppercase tracking-wider">
                <Zap size={10} className="animate-pulse shrink-0" /> {metrics.awaitingReview} {copy.ACTION_REQUIRED}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                <CheckCircle2 size={10} className="text-emerald-400 shrink-0" /> {copy.AWAITING_REVIEW}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE WORKSHOP (In Your Court) */}
      <Link href="/dashboard/storefronts" className="bg-zinc-900/75 border border-zinc-700/60 border-t-2 border-t-cyan-400 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-400/50 transition-all shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 bg-cyan-500/15 border border-cyan-500/30 rounded-lg text-cyan-400 shrink-0">
              <Hammer size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-widest truncate">{copy.CAPACITY_TITLE}</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-950 border border-cyan-500/30 px-2 py-0.5 rounded shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-black text-cyan-400 tracking-widest">{metrics.activeBuilds} / 5</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{metrics.activeBuilds}</h2>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">{copy.IN_PROGRESS}</span>
          </div>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex gap-1 h-1.5 w-full">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-sm transition-colors duration-500 ${
                    i < metrics.activeBuilds 
                      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' 
                      : 'bg-zinc-800'
                  }`} 
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-zinc-400">
              <span className="text-cyan-400 font-bold">{Math.max(0, 5 - metrics.activeBuilds)} {copy.SLOTS_OPEN}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* 3. AWAITING CLIENT ACTION (In Their Court) */}
      <Link href="/dashboard/storefronts" className="bg-zinc-900/75 border border-zinc-700/60 border-t-2 border-t-amber-400 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-400/50 transition-all shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-400 shrink-0">
              <PauseCircle size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-widest truncate">{copy.HOLDING_TITLE}</span>
          </div>
        </div>
        
        <div className="relative z-10 mt-1 flex-1 flex flex-col justify-between">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white">{metrics.holdingCount}</h2>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium truncate">{copy.HOLDING_SUBTITLE}</span>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metrics.onboardingCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                <Clock size={9} /> {metrics.onboardingCount} {copy.ONBOARDING_SUFFIX}
              </span>
            )}
            {metrics.assetsOrReviewCount > 0 && (
              <span className="inline-flex items-center gap-1 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded text-[9px] font-bold text-violet-300 uppercase tracking-wider">
                {metrics.assetsOrReviewCount} {copy.ASSETS_SUFFIX}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* 4. MONTHLY REVENUE: COLLECTED VS EXPECTED (Mirrors The Ledger) */}
      <Link href="/dashboard/ledger" className="bg-zinc-900/75 border border-zinc-700/60 border-t-2 border-t-emerald-400 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-400/50 transition-all shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 shrink-0">
              <CreditCard size={14} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-widest truncate">{copy.MRR_TITLE}</span>
          </div>

          {metrics.totalDeployed > 0 && (
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 shrink-0">
              <Globe size={9} /> {metrics.totalDeployed} {copy.LIVE_SUFFIX}
            </span>
          )}
        </div>
        
        <div className="relative z-10 mt-1">
          <div className="flex items-baseline gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white">${metrics.collectedThisMonth.toFixed(0)}</h2>
            <span className="text-[11px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wider">{copy.COLLECTED_LABEL}</span>
          </div>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${collectedPercentage}%` }} />
            </div>

            <div className="flex justify-between text-[8px] sm:text-[9px] font-mono uppercase tracking-wider">
              <span className="text-zinc-300 font-bold">{copy.EXPECTED_PREFIX} ${metrics.expectedMrr}</span>
              <span className="text-amber-400">{copy.UPCOMING_PREFIX} ${metrics.upcomingThisMonth}</span>
            </div>
          </div>
        </div>
      </Link>

    </div>
  );
}