/* src/components/dashboard/ledger/SubscriptionsTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';
import GlobalPaymentHistory from './feed/GlobalPaymentHistory';
import MetricsOverview from './MetricsOverview';
import ActiveSubscriptionsTable from './ActiveSubscriptionsTable';
import ReceiptModal from './ReceiptModal';

export default function SubscriptionsTab() {
  const [enrichedStorefronts, setEnrichedStorefronts] = useState<any[]>([]);
  const [globalInvoices, setGlobalInvoices] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ gross: 0, net: 0, discount: 0, foundation: 0, pro: 0 });
  const [diagnostics, setDiagnostics] = useState({ env: 'UNKNOWN', count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    setIsInvoicesLoading(true);
    setSyncError(null);

    const { data: activeStores, error } = await supabase
      .from('storefronts')
      .select('id, business_name, contact_email, plan_tier, created_at, status, stripe_subscription_id, stripe_customer_id, current_period_end')
      .in('status', ['PENDING_BUILD', 'BUILDING_CORE', 'IN_REVIEW', 'CONTENT_ASSEMBLY', 'AWAITING_ASSETS', 'ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN'])
      .not('stripe_subscription_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      setSyncError(`Database Error: ${error.message}`);
      setIsLoading(false);
      setIsInvoicesLoading(false);
      return;
    }

    const invoiceData = await getGlobalInvoices();
    const validInvoices = (invoiceData.success && invoiceData.invoices) ? invoiceData.invoices : [];

    if (invoiceData.success && invoiceData.diagnostics) {
      setDiagnostics({ env: invoiceData.diagnostics.environment, count: invoiceData.diagnostics.rawCount });
    }

    if (activeStores) {
      const allLedger = validInvoices.map((inv: any) => {
        const matchedStore = activeStores.find((s: any) => s.stripe_customer_id === inv.customerId || s.stripe_subscription_id === inv.subscriptionId);
        return {
          ...inv,
          storefrontName: matchedStore ? matchedStore.business_name : 'Unlinked Stripe Payment',
          isMatched: !!matchedStore
        };
      });

      const strictLedger = allLedger.filter((inv: any) => inv.isMatched);
      setGlobalInvoices(strictLedger);

      let gross = 0;
      let net = 0;
      let foundation = 0;
      let pro = 0;

      const enriched = activeStores.map((store: any) => {
        const displayTier = store.plan_tier || 'Standard';
        const isPro = displayTier.toLowerCase().includes('pro') || displayTier.toLowerCase().includes('professional');
        const expectedPrice = isPro ? 15 : 5;
        
        if (isPro) pro++; else foundation++;
        gross += expectedPrice;

        const storeInvoices = strictLedger.filter((inv: any) => 
          inv.customerId === store.stripe_customer_id || inv.subscriptionId === store.stripe_subscription_id
        );

        const ltv = storeInvoices.reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0);

        let actualPaid = expectedPrice;
        let originalPrice = expectedPrice;
        let isPromo = false;
        let promoDetails = '';

        if (storeInvoices.length > 0) {
          const latestInv = storeInvoices[0];
          actualPaid = latestInv.amount !== undefined && latestInv.amount !== null ? Number(latestInv.amount) : expectedPrice;
          originalPrice = latestInv.subtotal !== undefined && latestInv.subtotal !== null ? Number(latestInv.subtotal) : expectedPrice;
          
          if (originalPrice > actualPaid) {
            isPromo = true;
            promoDetails = actualPaid === 0 ? "100% OFF" : `DISCOUNT APPLIED`;
          }
        }

        net += actualPaid;

        return {
          ...store,
          displayTier,
          expectedPrice: originalPrice,
          actualPaid,
          ltv,
          isPromo,
          promoDetails,
          invoices: storeInvoices
        };
      });

      setEnrichedStorefronts(enriched);
      setMetrics({ gross, net, discount: gross - net, foundation, pro });
    }

    if (invoiceData.error) setSyncError(invoiceData.error);
    
    setIsLoading(false);
    setIsInvoicesLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div>
          <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight uppercase">
            <CreditCard size={24} className="text-emerald-400" /> Storefront Revenue
          </h2>
          <p className="text-zinc-400 font-mono text-sm">Live client subscriptions funding the ecosystem.</p>
        </div>
        <div className="flex items-center gap-2">
          {!isInvoicesLoading && (
            <>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded border ${diagnostics.env === 'LIVE MODE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {diagnostics.env}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-1 rounded border border-zinc-800 bg-black/40 hidden sm:inline-block">
                INVOICES: {diagnostics.count}
              </span>
            </>
          )}
          <button onClick={fetchAllData} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg text-xs font-mono uppercase tracking-widest transition-all hover:bg-zinc-700 hover:text-white shrink-0 cursor-pointer">
            {isLoading || isInvoicesLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Sync Stripe
          </button>
        </div>
      </div>

      {syncError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Database Sync Error</p>
            <p className="text-[10px] font-mono text-red-300 mt-1">{syncError}</p>
          </div>
        </div>
      )}

      {/* ISOLATED VIEW COMPONENTS */}
      <MetricsOverview 
        metrics={metrics} 
        activeCount={enrichedStorefronts.length} 
        enrichedStorefronts={enrichedStorefronts} 
        isLoading={isLoading} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
        <div className="xl:col-span-7">
          <ActiveSubscriptionsTable 
            storefronts={enrichedStorefronts} 
            isLoading={isLoading} 
            onViewReceipt={setPreviewReceiptUrl} 
          />
        </div>
        <div className="xl:col-span-5">
          <GlobalPaymentHistory 
            globalInvoices={globalInvoices} 
            isInvoicesLoading={isInvoicesLoading} 
            onViewReceipt={setPreviewReceiptUrl} 
          />
        </div>
      </div>

      {previewReceiptUrl && (
        <ReceiptModal url={previewReceiptUrl} onClose={() => setPreviewReceiptUrl(null)} />
      )}
    </div>
  );
}