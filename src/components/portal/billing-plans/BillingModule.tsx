'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Receipt, Loader2, ShieldCheck, Zap, Download, Calendar, ExternalLink, Globe } from 'lucide-react';
import { createCustomerPortalSession, getClientInvoices, getUpcomingInvoice, createProTierCheckout } from '@/app/actions/billing';
import DomainConcierge from './DomainConcierge';

export default function BillingModule({ clientId }: { clientId: string }) {
  const [store, setStore] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<{ amount: string, date: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: storeData } = await supabase.from('storefronts').select('*').eq('id', clientId).single();
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

  const handleProUpgrade = async () => {
    setIsUpgrading(true);
    const { url, error } = await createProTierCheckout(clientId, store?.contact_email || '', '');
    if (url) window.location.href = url;
    else { alert(`Checkout failed: ${error}`); setIsUpgrading(false); }
  };

  if (isLoading) return <div className="h-full min-h-[60vh] flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" /></div>;

  const isPro = store?.plan_tier?.toLowerCase() === 'professional';

  return (
    <div className="h-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2">
      
      <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
          <CreditCard className="text-emerald-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">Financial Ledger</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Subscription & Invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          
          {/* SUBSCRIPTION STATUS CARD */}
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
                <span className="text-4xl font-black text-emerald-400">${isPro ? '15' : '5'}</span>
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">/ month</span>
              </div>

              {upcoming ? (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Calendar className="w-4 h-4 text-emerald-400" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Next Auto-Pay</p>
                    <p className="text-sm font-mono text-emerald-400">${upcoming.amount} <span className="text-zinc-500 text-xs">on</span> {upcoming.date}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 mb-6 flex items-center gap-4">
                  <div className="p-2 bg-zinc-800/50 rounded-lg"><Calendar className="w-4 h-4 text-zinc-500" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Next Auto-Pay</p>
                    <p className="text-sm font-mono text-zinc-400">Pending Stripe Sync</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2">Manage Subscription & Billing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-md">
                Securely update your credit card or download historical tax receipts directly through our Stripe portal.
              </p>
            </div>
            <button
              onClick={handlePortalRedirect}
              disabled={isRedirecting || !store?.stripe_customer_id}
              className="shrink-0 px-6 py-4 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              {isRedirecting ? <Loader2 size={14} className="animate-spin inline mr-2" /> : <ExternalLink size={14} className="inline mr-2" />}
              Open Portal
            </button>
          </div>

          <div className="pt-4">
            <h3 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-4 pl-2">
              {isPro ? 'Domain Architecture' : 'Available Upgrades'}
            </h3>
            
            {isPro ? (
              <DomainConcierge clientId={clientId} store={store} onUpdate={setStore} />
            ) : (
              <div className="relative flex flex-col rounded-3xl p-6 md:p-8 bg-zinc-950 border border-cyan-500/30 shadow-xl overflow-hidden transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
                
                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-wide text-white">The Professional</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-cyan-400">$15</span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">/ month</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-4 leading-relaxed max-w-md">
                    Upgrade your architecture to support your own custom domain (e.g., yourname.com).
                  </p>
                </div>
                <div className="relative z-10">
                  <button 
                    onClick={handleProUpgrade}
                    disabled={isUpgrading}
                    className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    {isUpgrading ? 'Generating Checkout...' : 'Upgrade to Professional'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: Invoice Table (Unchanged) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Receipt className="text-emerald-500 w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Billing History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {invoices.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 flex flex-col items-center justify-center">
                  <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No invoices yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                      <div>
                        <div className="text-sm font-bold text-white mb-1">${inv.amount}</div>
                        <div className="text-[10px] font-mono text-zinc-500">{inv.date}</div>
                      </div>
                      {inv.pdfUrl && (
                        <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg">
                          <Download size={14} />
                        </a>
                      )}
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