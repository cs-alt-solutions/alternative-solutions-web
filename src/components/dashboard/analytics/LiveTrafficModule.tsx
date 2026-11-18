/* src/components/dashboard/analytics/LiveTrafficModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Activity, ExternalLink, BarChart3, Users, Globe, 
  Store, Clock, Loader2, ArrowUpRight, ShieldCheck, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { classifyStorefront } from '@/config/dashboard/overview';

const VERCEL_HQ_URL = "https://vercel.com/courtney-sulenskis-projects/alternative-solutions-web/analytics";
const VERCEL_ENGINE_URL = "https://vercel.com/courtney-sulenskis-projects/portfolio-template-engine/analytics";

export default function LiveTrafficModule() {
  const [storeStats, setStoreStats] = useState<any[]>([]);
  const [totalViews30d, setTotalViews30d] = useState(0);
  const [totalUnique30d, setTotalUnique30d] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('30d');

  useEffect(() => {
    const fetchTelemetry = async () => {
      setIsLoading(true);
      try {
        const days = timeframe === '7d' ? 7 : 30;
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        const [storesRes, viewsRes] = await Promise.all([
          supabase
            .from('storefronts')
            .select('id, business_name, slug, custom_domain, status, is_template, is_published, last_login, brand_logo')
            .order('business_name', { ascending: true }),
          supabase
            .from('storefront_analytics')
            .select('storefront_id, visitor_hash, device_type, referrer, created_at')
            .gte('created_at', sinceDate)
        ]);

        const stores = (storesRes.data || []).filter(s => {
          const bucket = classifyStorefront(s);
          return bucket === 'LIVE' || bucket === 'HOLDING' || bucket === 'WORKSHOP' || (bucket === 'PROTOTYPE' && s.is_published);
        });

        const views = viewsRes.data || [];
        const allUniques = new Set(views.map(v => v.visitor_hash).filter(Boolean));
        setTotalViews30d(views.length);
        setTotalUnique30d(allUniques.size || views.length);

        const aggregated = stores.map(store => {
          const sViews = views.filter(v => v.storefront_id === store.id);
          const uniqueSet = new Set(sViews.map(v => v.visitor_hash).filter(Boolean));
          const mobileCount = sViews.filter(v => v.device_type === 'mobile').length;
          const mobilePct = sViews.length > 0 ? Math.round((mobileCount / sViews.length) * 100) : 0;

          return {
            ...store,
            bucket: classifyStorefront(store),
            pageViews: sViews.length,
            uniqueVisitors: uniqueSet.size || sViews.length,
            mobilePct
          };
        }).sort((a, b) => b.pageViews - a.pageViews);

        setStoreStats(aggregated);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetry();
  }, [timeframe]);

  return (
    <div className="w-full space-y-6 pb-16">
      
      {/* TOP ROW: DUAL VERCEL EDGE GATEWAYS (Repo A + Repo B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Repo A: Main HQ Website Analytics */}
        <div className="bg-zinc-950/90 border border-cyan-500/20 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                <Activity size={18} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Repo A • Command & Marketing</span>
                <h2 className="text-base font-black text-white uppercase tracking-wider">alternativesolutions.io</h2>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Active
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Tracks public visitor traffic, intake funnel clicks, and marketing referrers on your main agency website (automatically excludes your own <code className="text-cyan-400">/dashboard</code> clicks).
          </p>

          <a
            href={VERCEL_HQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-[10px] uppercase tracking-widest py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Open HQ Vercel Analytics <ExternalLink size={13} />
          </a>
        </div>

        {/* 2. Repo B: Storefront Template Engine Analytics */}
        <div className="bg-zinc-950/90 border border-fuchsia-500/20 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-fuchsia-400">
                <Store size={18} />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">Repo B • Storefront Engine</span>
                <h2 className="text-base font-black text-white uppercase tracking-wider">storefronts & custom domains</h2>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[9px] font-mono font-bold text-fuchsia-400 uppercase tracking-widest">
              Multi-Tenant
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Tracks global edge traffic across all hosted client storefronts and custom domains on your Portfolio Template Engine (excludes <code className="text-fuchsia-400">?mode=canvas</code> editor previews).
          </p>

          <a
            href={VERCEL_ENGINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black text-[10px] uppercase tracking-widest py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Open Storefront Engine Vercel Analytics <ExternalLink size={13} />
          </a>
        </div>

      </div>

      {/* SECOND ROW: NATIVE PER-STOREFRONT TELEMETRY & CLIENT PORTAL ACTIVITY */}
      <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-800">
          <div>
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-widest flex items-center gap-2.5">
              <BarChart3 size={18} className="text-emerald-400" />
              Individual Storefront Traffic & Portal Logins
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1">
              Per-tenant visitor breakdown and latest client portal login timestamps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                timeframe === '7d' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                timeframe === '30d' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-3.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Total Storefront Views</span>
            <span className="text-2xl font-black text-white mt-1 block">{totalViews30d}</span>
          </div>
          <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-3.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Unique Storefront Visitors</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{totalUnique30d}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-black/40 border border-zinc-800/80 rounded-xl p-3.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Tracked Storefronts</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">{storeStats.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {storeStats.map((store) => (
              <div
                key={store.id}
                className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/70 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {store.brand_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-zinc-500 uppercase">{store.business_name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/storefronts/${store.id}`}
                        className="text-sm font-bold text-white hover:text-cyan-400 transition-colors truncate"
                      >
                        {store.business_name}
                      </Link>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                        store.bucket === 'LIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : store.bucket === 'PROTOTYPE'
                            ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {store.bucket}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500 mt-0.5">
                      <span>{store.custom_domain || `/${store.slug}`}</span>
                      {!store.is_template && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock size={10} className="text-cyan-400" />
                          Portal Login: {store.last_login ? new Date(store.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Never'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Metrics */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                  <div className="flex items-center gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-black text-white block">{store.pageViews}</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Views</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-black text-emerald-400 block">{store.uniqueVisitors}</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Uniques</span>
                    </div>
                    <div className="text-left sm:text-right hidden md:block">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-0.5">
                        <Smartphone size={11} /> {store.mobilePct}%
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Mobile</span>
                    </div>
                  </div>

                  <a
                    href={`https://${store.custom_domain || `storefronts.alternativesolutions.io/${store.slug}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/40 transition-all"
                    title="Open Storefront"
                  >
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}