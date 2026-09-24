/* src/components/dashboard/ledger/SubscriptionsTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  CreditCard, Zap, RefreshCw, Loader2, CalendarClock, Receipt, 
  Download, AlertTriangle, TrendingDown, Eye, Filter, ChevronDown, ChevronUp, X, ExternalLink 
} from 'lucide-react';
import { getGlobalInvoices } from '@/app/actions/billing';

export default function SubscriptionsTab() {
  const [enrichedStorefronts, setEnrichedStorefronts] = useState<any[]>([]);
  const [globalInvoices, setGlobalInvoices] = useState<any[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'PROMO' | 'FOUNDATION' | 'PRO'>('ALL');
  const [metrics, setMetrics] = useState({ gross: 0, net: 0, discount: 0, foundation: 0, pro: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 🚀 NEW UI STATES
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const fetchAllData = async () => {
    setIsLoading(true);
    setIsInvoicesLoading(true);
    setSyncError(null);

    const { data: activeStores, error } = await supabase
      .from('storefronts')
      .select('id, business_name, contact_email, plan_tier, created_at, status, stripe_subscription_id, stripe_customer_id')
      .in('status', ['ACTIVE', 'LIVE'])
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

    if (activeStores) {
      const activeCustomerIds = activeStores.map((s: any) => s.stripe_customer_id).filter(Boolean);
      const activeSubscriptionIds = activeStores.map((s: any) => s.stripe_subscription_id).filter(Boolean);
      
      const strictLedger = validInvoices.filter((inv: any) => {
        return activeCustomerIds.includes(inv.customerId) || activeSubscriptionIds.includes(inv.subscriptionId);
      });

      // 🚀 THE CONNECTION FIX: Attach the actual Storefront Name to the Global Invoice
      const connectedLedger = strictLedger.map((inv: any) => {
        const matchedStore = activeStores.find((s: any) => s.stripe_customer_id === inv.customerId || s.stripe_subscription_id === inv.subscriptionId);
        return {
          ...inv,
          storefrontName: matchedStore ? matchedStore.business_name : 'Unknown Storefront'
        };
      });

      setGlobalInvoices(connectedLedger);

      let gross = 0;
      let net = 0;
      let foundation = 0;
      let pro = 0;

      const enriched = activeStores.map((store: any) => {
        const displayTier = store.plan_tier || 'Foundation';
        const isPro = displayTier.toLowerCase().includes('pro') || displayTier.toLowerCase().includes('professional');
        const expectedPrice = isPro ? 15 : 5;
        
        if (isPro) pro++; else foundation++;
        gross += expectedPrice;

        const storeInvoices = connectedLedger.filter((inv: any) => 
          inv.customerId === store.stripe_customer_id || inv.subscriptionId === store.stripe_subscription_id
        );

        let actualPaid = expectedPrice;
        let originalPrice = expectedPrice;
        let isPromo = false;
        let promoDetails = '';

        if (storeInvoices.length > 0) {
          const latestInv = storeInvoices[0];
          actualPaid = parseFloat(latestInv.amount);
          originalPrice = latestInv.subtotal ? parseFloat(latestInv.subtotal) : expectedPrice;
          
          if (originalPrice > actualPaid) {
            isPromo = true;
            promoDetails = actualPaid === 0 ? "100% OFF" : `DISCOUNT APPLIED`;
          }
        }

        net += actualPaid;

        return {
          ...store,
          displayTier,
          expectedPrice,
          actualPaid,
          isPromo,
          promoDetails,
          invoices: storeInvoices // 🚀 Attached for the Accordion Drill-Down
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

  const activeCount = enrichedStorefronts.length;

  const displayHistory = globalInvoices.filter(inv => {
    if (historyFilter === 'PROMO') return parseFloat(inv.amount) < parseFloat(inv.subtotal);
    if (historyFilter === 'FOUNDATION') return inv.lineItem.toLowerCase().includes('foundation');
    if (historyFilter === 'PRO') return inv.lineItem.toLowerCase().includes('pro') || inv.lineItem.toLowerCase().includes('professional');
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
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
        
        <button 
          onClick={fetchAllData}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white shrink-0 cursor-pointer"
        >
          {isLoading || isInvoicesLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
          Sync Stripe
        </button>
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

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Zap size={16} /></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Portals</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white">{activeCount} <span className="text-sm text-zinc-500 font-medium">Deployed</span></h2>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <div className="text-cyan-400">Foundation: <span className="text-white">{metrics.foundation}</span></div>
              <div className="text-cyan-400">Pro: <span className="text-white">{metrics.pro}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><RefreshCw size={16} /></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net MRR</span>
            </div>
            {metrics.discount > 0 && (
              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
                <TrendingDown size={10} /> Promo Active
              </span>
            )}
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white">${metrics.net.toFixed(2)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <div className="text-zinc-400">Gross: <span className="text-white">${metrics.gross.toFixed(2)}</span></div>
              {metrics.discount > 0 && (
                <div className="text-rose-400">Discounts: -${metrics.discount.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 NEW SIDE-BY-SIDE LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
        
        {/* LEFT COLUMN: ACTIVE SUBSCRIPTIONS (Col 7) */}
        <div className="xl:col-span-7 bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 shrink-0">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <CalendarClock size={14} className="text-emerald-500" /> Active Subscriptions
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-black/40">
                  <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Client / Storefront</th>
                  <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tier</th>
                  <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Promo</th>
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
                ) : enrichedStorefronts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                      No active storefronts found.
                    </td>
                  </tr>
                ) : (
                  enrichedStorefronts.map((store) => {
                    const isExpanded = expandedStoreId === store.id;

                    return (
                      <React.Fragment key={store.id}>
                        {/* 🚀 Main Row (Now Clickable) */}
                        <tr 
                          onClick={() => setExpandedStoreId(isExpanded ? null : store.id)}
                          className={`transition-colors group cursor-pointer ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}`}
                        >
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
                          <td className="p-4 text-xs font-mono text-slate-400 capitalize">{store.displayTier}</td>
                          
                          <td className="p-4">
                            {store.isPromo ? (
                              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 uppercase">
                                {store.promoDetails}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-600 uppercase">None</span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {store.isPromo ? (
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-sm text-emerald-400 font-bold">
                                    ${store.actualPaid.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                                  </span>
                                  <span className="text-[9px] font-mono text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                    <span className="line-through">${store.expectedPrice.toFixed(2)}</span>
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-emerald-400 font-bold">
                                  ${store.actualPaid.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                                </span>
                              )}
                              {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500 group-hover:text-cyan-400" />}
                            </div>
                          </td>
                        </tr>

                        {/* 🚀 The Accordion Drill-Down */}
                        {isExpanded && (
                          <tr className="bg-black/20 border-b border-white/5 animate-in fade-in slide-in-from-top-2">
                            <td colSpan={4} className="p-0">
                              <div className="p-4 md:p-6 bg-zinc-950/50 shadow-inner">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Receipt size={12}/> Invoice Ledger
                                </h4>
                                
                                {store.invoices.length === 0 ? (
                                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                                    No invoices generated yet.
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {store.invoices.map((inv: any) => (
                                      <div key={inv.id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                                        <div className="flex items-center gap-4">
                                          <span className="text-xs font-mono text-slate-400">{inv.date}</span>
                                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                            {inv.status}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className="text-sm font-bold text-emerald-400">${inv.amount}</span>
                                          {inv.hostedUrl && (
                                            <button 
                                              onClick={() => setPreviewReceiptUrl(inv.hostedUrl)} 
                                              className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                            >
                                              <Eye size={12}/> View
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: GLOBAL PAYMENT HISTORY (Col 5) */}
        <div className="xl:col-span-5 bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <Receipt size={16} className="text-cyan-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                Global Feed
              </h3>
            </div>
            
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setHistoryFilter('ALL')}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'ALL' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setHistoryFilter('PROMO')}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'PROMO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-md' : 'text-zinc-500 hover:text-amber-400'}`}
              >
                Promos
              </button>
              <button 
                onClick={() => setHistoryFilter('FOUNDATION')}
                className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'FOUNDATION' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-zinc-500 hover:text-cyan-400'}`}
              >
                Found.
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-black/40">
                  <th className="px-4 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date / Storefront</th>
                  <th className="px-4 py-4 text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-right">Total</th>
                  <th className="px-4 py-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isInvoicesLoading ? (
                  <tr>
                    <td colSpan={3} className="p-12 text-center">
                      <Loader2 size={24} className="animate-spin text-cyan-500 mx-auto mb-3" />
                    </td>
                  </tr>
                ) : displayHistory.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                      No history found.
                    </td>
                  </tr>
                ) : (
                  displayHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {/* 🚀 THE CONNECTION FIX: Shows Split Chick Grill instead of just Bethany */}
                          <span className="text-sm font-bold text-white truncate max-w-[150px]">{invoice.storefrontName}</span>
                          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{invoice.customerName} ({invoice.customerEmail})</span>
                          <span className="text-[9px] font-mono text-zinc-600 mt-1">{invoice.date}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        {parseFloat(invoice.amount) < parseFloat(invoice.subtotal) ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm text-emerald-400 font-bold">${invoice.amount}</span>
                            <span className="text-[9px] font-mono text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 line-through">
                              ${invoice.subtotal}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-emerald-400 font-bold">${invoice.amount}</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {invoice.hostedUrl && (
                            <button 
                              onClick={() => setPreviewReceiptUrl(invoice.hostedUrl)}
                              className="p-2 bg-cyan-500/10 text-cyan-400 hover:text-white hover:bg-cyan-500 rounded-lg transition-colors border border-cyan-500/20 cursor-pointer" 
                              title="View Web Invoice"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {invoice.pdfUrl && (
                            <a 
                              href={invoice.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700" 
                              title="Download PDF Receipt"
                            >
                              <Download size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🚀 THE POPUP RECEIPT MODAL */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Receipt size={14} className="text-cyan-500" /> Stripe Invoice
              </h3>
              <div className="flex items-center gap-2">
                <a 
                  href={previewReceiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors bg-black/40 rounded-lg border border-zinc-800"
                  title="Open in new tab"
                >
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => setPreviewReceiptUrl(null)} 
                  className="p-2 text-zinc-400 hover:text-rose-400 transition-colors bg-black/40 rounded-lg border border-zinc-800 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            {/* White background so the Stripe UI looks clean */}
            <iframe src={previewReceiptUrl} className="w-full flex-1 bg-white" />
          </div>
        </div>
      )}

    </div>
  );
}