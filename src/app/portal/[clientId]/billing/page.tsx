/* src/app/portal/[clientId]/billing/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditCard, Receipt, ArrowRight, Loader2, ShieldCheck, Zap, Download } from 'lucide-react';
import { createCustomerPortalSession, getClientInvoices } from '@/app/actions/billing';

export default function BillingPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Unwrap params and fetch data
  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setClientId(resolvedParams.clientId);

      // 1. Fetch Storefront Data
      const { data: storeData } = await supabase
        .from('storefronts')
        .select('*')
        .eq('id', resolvedParams.clientId)
        .single();
        
      setStore(storeData);

      // 2. Secretly Fetch Invoices from Stripe if they have an active Customer ID
      if (storeData?.stripe_customer_id) {
        const invoiceData = await getClientInvoices(storeData.stripe_customer_id);
        if (invoiceData.success) {
          setInvoices(invoiceData.invoices || []);
        }
      }

      setIsLoading(false);
    };
    init();
  }, [params]);

  const handlePortalRedirect = async () => {
    if (!store?.stripe_customer_id || !clientId) return;
    
    setIsRedirecting(true);
    const { url, error } = await createCustomerPortalSession(store.stripe_customer_id, clientId);
    
    if (url) {
      window.location.href = url;
    } else {
      alert("Failed to connect to billing portal. Please contact support.");
      setIsRedirecting(false);
    }
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
    <div className="h-full max-w-6xl mx-auto p-4 lg:p-8 animate-in fade-in duration-500 overflow-y-auto">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COL: Active Plan */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-black/40 border border-emerald-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
            {/* Ambient Glow */}
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
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-emerald-400">$5</span>
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">/ month</span>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Enterprise Next.js Hosting & Edge Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Content Management Portal Access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Forever Legacy Rate Lock</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Action: Update Payment Method */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between group">
            <div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-1">Update Payment Method</h3>
              <p className="text-xs text-zinc-500">Securely change your credit card on file via Stripe.</p>
            </div>
            <button
              onClick={handlePortalRedirect}
              disabled={isRedirecting || !store?.stripe_customer_id}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {isRedirecting ? 'Connecting...' : 'Manage Card'}
            </button>
          </div>
        </div>

        {/* RIGHT COL: Native Invoice Table */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <Receipt className="text-zinc-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Billing History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {invoices.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-black/20">
                  <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No invoices generated yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                      <div>
                        <div className="text-sm font-bold text-white mb-1">${invoice.amount}</div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{invoice.date}</div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                          invoice.status === 'paid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {invoice.status}
                        </span>
                        
                        {invoice.pdfUrl && (
                          <a 
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Download PDF Receipt"
                          >
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