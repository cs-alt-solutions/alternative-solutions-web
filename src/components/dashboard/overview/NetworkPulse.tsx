/* src/components/dashboard/overview/NetworkPulse.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Layers, ArrowRight, Loader2, HardHat, Clock, Globe, FlaskConical, CreditCard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { getGlobalInvoices } from '@/app/actions/billing';
import { OVERVIEW_COPY, classifyStorefront } from '@/config/dashboard/overview';

export default function NetworkPulse() {
  const [counts, setCounts] = useState({ workshop: 0, holding: 0, live: 0, prototypes: 0, total: 0 });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const copy = OVERVIEW_COPY.PULSE;

  useEffect(() => {
    const fetchMirrorData = async () => {
      setIsLoading(true);
      try {
        const { data: stores } = await supabase
          .from('storefronts')
          .select('id, business_name, status, is_template');

        let workshop = 0;
        let holding = 0;
        let live = 0;
        let prototypes = 0;

        (stores || []).forEach(s => {
          const bucket = classifyStorefront(s);
          if (bucket === 'PROTOTYPE') prototypes++;
          else if (bucket === 'LIVE') live++;
          else if (bucket === 'HOLDING') holding++;
          else if (bucket === 'WORKSHOP') workshop++;
        });

        const total = Math.max(1, workshop + holding + live + prototypes);
        setCounts({ workshop, holding, live, prototypes, total });

        const invoiceRes = await getGlobalInvoices();
        if (invoiceRes?.success && Array.isArray(invoiceRes.invoices)) {
          setRecentInvoices(invoiceRes.invoices.slice(0, 3));
        }
      } catch (err) {
        console.error("Mirror sync error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMirrorData();
  }, []);

  const tiers = [
    { label: copy.TIER_WORKSHOP, count: counts.workshop, icon: HardHat, color: 'text-cyan-400', barColor: 'bg-cyan-400', border: 'border-cyan-500/20 bg-cyan-500/5' },
    { label: copy.TIER_HOLDING, count: counts.holding, icon: Clock, color: 'text-amber-400', barColor: 'bg-amber-400', border: 'border-amber-500/20 bg-amber-500/5' },
    { label: copy.TIER_LIVE, count: counts.live, icon: Globe, color: 'text-emerald-400', barColor: 'bg-emerald-400', border: 'border-emerald-500/20 bg-emerald-500/5' },
    { label: copy.TIER_PROTOTYPES, count: counts.prototypes, icon: FlaskConical, color: 'text-fuchsia-400', barColor: 'bg-fuchsia-400', border: 'border-fuchsia-500/20 bg-fuchsia-500/5' },
  ];

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between gap-6 h-full">
      
      {/* TOP MIRROR: STOREFRONT PIPELINE BREAKDOWN */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Layers size={16} className="text-cyan-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-widest">{copy.PIPELINE_TITLE}</h2>
          </div>
          <Link href="/dashboard/storefronts" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
            {copy.OPEN_ENGINE_LINK} <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-zinc-900 p-0.5 gap-0.5 border border-zinc-800">
              {tiers.map((t) => (
                t.count > 0 && (
                  <div
                    key={t.label}
                    style={{ width: `${(t.count / counts.total) * 100}%` }}
                    className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-700 ${t.barColor}`}
                    title={`${t.label}: ${t.count}`}
                  />
                )
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {tiers.map((t) => (
                <Link
                  key={t.label}
                  href="/dashboard/storefronts"
                  className={`p-3 rounded-xl border ${t.border} hover:brightness-125 transition-all flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <t.icon size={14} className={`${t.color} shrink-0`} />
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider truncate">{t.label}</span>
                  </div>
                  <span className={`text-base font-black ${t.color} ml-2`}>{t.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM MIRROR: RECENT LEDGER ACTIVITY */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-emerald-400" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{copy.LEDGER_TITLE}</h3>
          </div>
          <Link href="/dashboard/ledger" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
            {copy.OPEN_LEDGER_LINK} <ArrowRight size={12} />
          </Link>
        </div>

        {!isLoading && recentInvoices.length === 0 ? (
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800/60 text-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{copy.EMPTY_LEDGER}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {recentInvoices.map((inv: any, idx: number) => (
              <Link
                key={inv.id || idx}
                href="/dashboard/ledger"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-zinc-800/70 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{inv.customerName || inv.customerEmail || 'Storefront Client'}</p>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase">
                      {inv.date ? new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      {inv.hasPromo ? ` • ${copy.PROMO_TAG}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-emerald-400 shrink-0 ml-2">
                  +${Number(inv.amount || 0).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}