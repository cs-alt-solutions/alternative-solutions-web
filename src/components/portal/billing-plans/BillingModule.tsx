/* src/components/portal/billing-plans/BillingModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  CreditCard, Receipt, Loader2, ShieldCheck, Zap, 
  Download, Calendar, Globe, AlertTriangle, ExternalLink, Server, Unlink, ArrowRight
} from 'lucide-react';
import { createCustomerPortalSession, getClientInvoices, getUpcomingInvoice } from '@/app/actions/billing';
import { addCustomDomainToVercel, removeCustomDomainFromVercel } from '@/app/actions/domains';

export default function BillingModule({ clientId }: { clientId: string }) {
  const [store, setStore] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<{ amount: string, date: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [customDomain, setCustomDomain] = useState('');
  const [isConnectingDomain, setIsConnectingDomain] = useState(false);
  const [isRemovingDomain, setIsRemovingDomain] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

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

  // 🚀 THE FIX: Exclusive routing to the Customer Portal for all upgrades/changes
  const handlePortalRedirect = async () => {
    if (!store?.stripe_customer_id || !clientId) return;
    setIsRedirecting(true);
    const { url } = await createCustomerPortalSession(store.stripe_customer_id, clientId);
    if (url) window.location.href = url;
    else { 
      alert("Failed to connect to billing portal."); 
      setIsRedirecting(false); 
    }
  };

  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim()) return;
    setIsConnectingDomain(true);
    setDomainError(null);

    const result = await addCustomDomainToVercel(clientId, customDomain);
    
    if (result.success) {
      setStore({ ...store, custom_domain: result.data });
      setCustomDomain('');
    } else {
      setDomainError(result.error || "Failed to route domain. Please try again.");
    }
    setIsConnectingDomain(false);
  };

  const handleRemoveDomain = async () => {
    if (!store?.custom_domain) return;
    if (!window.confirm(`Are you sure you want to disconnect ${store.custom_domain}? This will take your storefront offline.`)) return;
    
    setIsRemovingDomain(true);
    const result = await removeCustomDomainFromVercel(clientId, store.custom_domain);
    if (result.success) {
      setStore({ ...store, custom_domain: null });
    } else {
      alert("Failed to disconnect domain.");
    }
    setIsRemovingDomain(false);
  };

  if (isLoading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest animate-pulse">Syncing Ledger...</span>
      </div>
    );
  }

  const isPro = store?.plan_tier?.toLowerCase().includes('pro') || store?.plan_tier?.toLowerCase().includes('professional');

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
          <div className="bg-black/40 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  Active Plan
                </span>
                <h2 className="text-3xl font-black text-white mt-4 tracking-tight">
                  {store?.plan_tier || 'Standard'} Tier
                </h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">${isPro ? '15' : '5'}<span className="text-sm text-zinc-500 font-medium">/mo</span></p>
                {upcoming && (
                  <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">
                    Next Auto-Pay: {upcoming.date}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Zap className="w-4 h-4 text-emerald-500 shrink-0" /><span>Enterprise Next.js Hosting & Edge Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /><span>Content Management Portal Access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Calendar className="w-4 h-4 text-emerald-500 shrink-0" /><span>Forever Legacy Rate Lock</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between group gap-6 shadow-xl">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2">Manage Subscription & Billing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-md">
                Securely update your credit card, <strong className="text-white font-medium">upgrade your plan</strong>, download historical tax receipts, or cancel your active subscription directly through our secure billing portal.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <AlertTriangle size={12} className="text-amber-500/60" />
                <span>Cancellations & Upgrades take effect immediately.</span>
              </div>
            </div>
            <button
              onClick={handlePortalRedirect}
              disabled={isRedirecting || !store?.stripe_customer_id}
              className="shrink-0 px-6 py-4 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer shadow-lg"
            >
              {isRedirecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              {isRedirecting ? 'Connecting...' : 'Open Billing Portal'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={`bg-black/40 border rounded-3xl p-6 relative overflow-hidden transition-all ${isPro ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/5 opacity-70 grayscale'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isPro ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Custom Domain</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Pro Tier Feature</p>
              </div>
            </div>

            {!isPro ? (
              <div className="p-4 border border-dashed border-zinc-700/50 rounded-xl bg-zinc-900/30 text-center">
                <p className="text-xs text-zinc-400 mb-3">Upgrade to the Professional Tier to connect your own .com domain.</p>
                <button onClick={handlePortalRedirect} className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 mx-auto cursor-pointer">
                  Upgrade in Portal <ArrowRight size={12} />
                </button>
              </div>
            ) : store?.custom_domain ? (
              <div className="p-4 border border-cyan-500/20 rounded-xl bg-cyan-500/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Active Route</p>
                  <a href={`https://${store.custom_domain}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    {store.custom_domain} <ExternalLink size={12} />
                  </a>
                </div>
                <button 
                  onClick={handleRemoveDomain}
                  disabled={isRemovingDomain}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20 cursor-pointer disabled:opacity-50"
                  title="Disconnect Domain"
                >
                  {isRemovingDomain ? <Loader2 size={16} className="animate-spin" /> : <Unlink size={16} />}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectDomain} className="space-y-3">
                {domainError && <p className="text-[10px] font-mono text-rose-400 p-2 bg-rose-500/10 rounded border border-rose-500/20">{domainError}</p>}
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                  <input 
                    type="text" 
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value.toLowerCase().replace(/^https?:\/\//, ''))}
                    placeholder="e.g. yourbusiness.com" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isConnectingDomain || !customDomain.trim()}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {isConnectingDomain ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                  Connect Domain
                </button>
              </form>
            )}
          </div>

          <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col h-75 shadow-xl">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5 shrink-0">
              <Receipt size={16} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Invoices</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {invoices.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No invoice history available.</p>
                </div>
              ) : (
                invoices.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10">
                    <div>
                      <p className="text-xs font-mono text-zinc-400">{inv.date}</p>
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">${inv.amount} {inv.status}</p>
                    </div>
                    {inv.hostedUrl && (
                      <a 
                        href={inv.hostedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-400 hover:text-emerald-400 bg-black/40 rounded-lg border border-white/5 transition-colors"
                        title="View Receipt"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}