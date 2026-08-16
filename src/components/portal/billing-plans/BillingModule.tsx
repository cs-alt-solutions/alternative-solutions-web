/* src/components/portal/billing-plans/BillingModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  CreditCard, Receipt, Loader2, ShieldCheck, Zap, 
  Download, Calendar, Lock, Globe, AlertTriangle, ExternalLink 
} from 'lucide-react';
import { createCustomerPortalSession, getClientInvoices, getUpcomingInvoice } from '@/app/actions/billing';

export default function BillingModule({ clientId }: { clientId: string }) {
  const [store, setStore] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<{ amount: string, date: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: storeData } = await supabase
        .from('storefronts')
        .select('*')
        .eq('id', clientId)
        .single();
        
      setStore(storeData);

      if (storeData?.stripe_customer_id) {
        const invoiceData = await getClientInvoices(storeData.stripe_customer_id);
        if (invoiceData.success) setInvoices(invoiceData.invoices || []);
        
        const upcomingData = await getUpcomingInvoice(storeData.stripe_customer_id);
        if (upcomingData.success && upcomingData.amount && upcomingData.date) {
          setUpcoming({ amount: upcomingData.amount as string, date: upcomingData.date as string });
        }
      }
      setIsLoading(false);
    };
    init();
  }, [clientId]);

  const handlePortalRedirect = async () => {
    if (!store?.stripe_customer_id || !clientId) return;
    setIsRedirecting(true);
    const { url } = await createCustomerPortalSession(store.stripe_customer_id, clientId);
    if (url) window.location.href = url;
    else { alert("Failed to connect to billing portal."); setIsRedirecting(false); }
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest animate-pulse">Syncing Ledger...</span>
      </div>
    );
  }

  return (
    <div className="h-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
          <CreditCard className="text-emerald-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">Financial Ledger</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Subscription & Invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* LEFT COL: Active Plan & Upgrades */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-black/40 border border-emerald-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {store?.status === 'ACTIVE' || store?.status === 'LIVE' ? 'Active Subscription' : 'Pending Activation'}
                </span>
                <ShieldCheck className="text-emerald-500/50 w-6 h-6" />
              </div>

              <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                The {store?.plan_tier || 'Foundation'} Plan
              </h2>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-emerald-400">$5</span>
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">/ month</span>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" /><span>Enterprise Next.js Hosting & Edge Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" /><span>Content Management Portal Access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" /><span>Forever Legacy Rate Lock</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* THE STRIPE PORTAL CONNECTOR */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between group gap-6 shadow-xl">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2">Manage Subscription & Billing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-md">
                Securely update your credit card, download historical tax receipts, or cancel your active subscription directly through our Stripe portal.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <AlertTriangle size={12} className="text-amber-500/60" />
                <span>Cancellations take effect at the end of your billing cycle.</span>
              </div>
            </div>
            <button
              onClick={handlePortalRedirect}
              disabled={isRedirecting || !store?.stripe_customer_id}
              className="shrink-0 px-6 py-4 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              {isRedirecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              {isRedirecting ? 'Connecting...' : 'Open Billing Portal'}
            </button>
          </div>

          <div className="pt-4">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 pl-2">Available Upgrades</h3>
            <div className="relative flex flex-col rounded-3xl p-6 bg-zinc-950 border border-zinc-800/50 grayscale opacity-60 cursor-not-allowed overflow-hidden">
              <div className="absolute top-6 right-6 text-zinc-600"><Lock className="w-5 h-5" /></div>
              <div className="mb-4">
                <h3 className="text-xl font-black uppercase tracking-wide text-zinc-300">The Professional</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-500">$15</span>
                  <span className="text-xs text-zinc-600 font-medium uppercase tracking-widest">/ month</span>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">Under Construction</span>
                </div>
                <p className="text-xs text-amber-500/80 font-medium mt-4 leading-relaxed max-w-md">We are finalizing the custom domain integration architecture. You will be notified when this unlocks.</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-zinc-800/60">
                <div className="flex items-start gap-2.5 text-xs text-zinc-500">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-zinc-600" /><span>Everything in The Foundation</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-zinc-500">
                  <Globe className="w-4 h-4 shrink-0 text-zinc-600" /><span>Custom Domain Connection (yourname.com)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COL: Standalone Auto-Pay & Invoice Table */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 🚀 STANDALONE AUTO-PAY WIDGET */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex items-center justify-between group relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none ${upcoming ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-xl ${upcoming ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${upcoming ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Next Auto-Pay
                </p>
                {upcoming ? (
                  <p className="text-lg font-mono text-emerald-400">
                    ${upcoming.amount} <span className="text-zinc-500 text-xs font-sans">on</span> {upcoming.date}
                  </p>
                ) : (
                  <p className="text-sm font-mono text-zinc-400">Pending Stripe Sync</p>
                )}
              </div>
            </div>
          </div>

          {/* BILLING HISTORY TABLE */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col flex-1 overflow-hidden shadow-xl min-h-[400px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Receipt className="text-emerald-500 w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Billing History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {invoices.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 h-full flex flex-col items-center justify-center">
                  <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No invoices generated yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors group">
                      <div>
                        <div className="text-sm font-bold text-white mb-1">${invoice.amount}</div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{invoice.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {invoice.status}
                        </span>
                        {invoice.pdfUrl && (
                          <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors" title="Download PDF Receipt">
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}