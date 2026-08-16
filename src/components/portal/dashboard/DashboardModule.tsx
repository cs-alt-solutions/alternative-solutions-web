/* src/components/portal/dashboard/DashboardModule.tsx */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, Store, CreditCard, ArrowRight, Box, Lock, Activity, LifeBuoy, Compass, ShieldCheck } from 'lucide-react';
import { PORTAL_COPY } from '@/config/clients/portal';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';

export default async function DashboardModule({ 
  clientId 
}: { 
  clientId: string 
}) {
  const supabase = await createClient();
  
  // Fetch Storefront Data
  const { data: store } = await supabase
    .from('storefronts')
    .select('*')
    .eq('id', clientId)
    .single();

  const businessName = store?.business_name || 'My Workspace';
  const statusKey = (store?.status as StorefrontStatus) || 'PENDING';
  const statusConfig = STOREFRONT_LIFECYCLE[statusKey] || STOREFRONT_LIFECYCLE['PENDING'];
  
  // Calculate price display based on tier
  const planName = store?.plan_tier || 'Standard';
  const planPrice = planName.toLowerCase() === 'professional' ? '15' : '5';

  // Fetch their 3 most recent support tickets
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('storefront_id', clientId)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      
      {/* ==========================================
          1. THE ALTERNATIVE SOLUTIONS COMMAND BANNER
      ========================================== */}
      <div className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 lg:p-10 overflow-hidden mb-8 shadow-2xl group">
        
        {/* Ambient Color Mix (Cyan, Fuchsia, Emerald) */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {/* Branding Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles size={14} className="text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Powered by Alternative Solutions</span>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">
                  {businessName} Workspace
                </span>
              </div>
            </div>

            {/* Gradient Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-200 to-zinc-600 tracking-tight mb-4 pb-2">
              {PORTAL_COPY.dashboard.welcomeTitle}
            </h1>

            {/* Sub-headline accent */}
            <div className="flex items-center gap-3">
               <div className="h-px w-8 bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
               <p className="text-xs md:text-sm text-zinc-400 font-mono uppercase tracking-widest">
                 This is dope. Let's get building.
               </p>
            </div>
          </div>

          {/* Right-Side Clean Info Box */}
          <div className="hidden lg:flex flex-col items-end gap-3 shrink-0 p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-400" />
              Secure Environment
            </div>
            <div className="w-full h-px bg-white/5 my-1" />
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Architect: <span className="text-zinc-300">Alternative Solutions</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Status: <span className="text-cyan-400">Live & Syncing</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. CORE DASHBOARD GRID
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* LEFT COLUMN: COMMS & SUPPORT */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* QUICK START GUIDE */}
          <div className="bg-zinc-950/80 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col group hover:border-amber-500/40 transition-all shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/10">
              <Compass size={18} className="text-amber-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                {PORTAL_COPY.dashboard.guideTitle}
              </h2>
              <span className="ml-auto text-[10px] font-mono text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                v1.0.0-beta
              </span>
            </div>
            
            <div className="relative pl-5 md:pl-6 border-l border-zinc-800/80 pb-2">
              <div className="absolute w-2.5 h-2.5 bg-amber-500 rounded-full -left-[5.5px] top-1.5 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              <h3 className="text-xs md:text-sm font-black text-amber-400 uppercase tracking-widest mb-4">
                {PORTAL_COPY.dashboard.guideSubtitle}
              </h3>
              
              <div className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light space-y-5">
                <p>{PORTAL_COPY.dashboard.intro}</p>
                <div className="space-y-4 mt-2">
                  {PORTAL_COPY.dashboard.steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="font-bold text-white">{step.name}</span>
                      <span className="text-zinc-400 leading-relaxed">{step.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="text-amber-500 font-mono text-[10px] uppercase tracking-widest pt-4">
                  {PORTAL_COPY.dashboard.signOff}
                </p>
              </div>
            </div>
          </div>

          {/* RECENT TRANSMISSIONS (SUPPORT TICKETS) */}
          <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl backdrop-blur-sm flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <LifeBuoy size={18} className="text-fuchsia-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recent Transmissions</h2>
              </div>
              <Link href={`/portal/${clientId}/support`} className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest hover:text-fuchsia-300 transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {(!tickets || tickets.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20">
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Inbox Zero</p>
                </div>
              ) : (
                tickets.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-zinc-700 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${t.category === 'System Request' ? 'text-orange-400' : 'text-fuchsia-400'}`}>
                        {t.category}
                      </span>
                      <p className="text-sm font-bold text-white truncate">{t.topic}</p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                      t.status === 'OPEN' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {t.status === 'OPEN' ? 'In Review' : 'Resolved'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIONS & STATUS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <Link 
            href={`/portal/${clientId}/storefront`}
            className="bg-zinc-950/80 border border-cyan-500/20 rounded-2xl p-5 flex items-center gap-4 group hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all shadow-md backdrop-blur-sm"
          >
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
              <Store size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                Live Storefront
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                Manage your live website, update media, and review your digital storefront settings.
              </p>
            </div>
            <ArrowRight size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
          </Link>

          <Link 
            href={`/portal/${clientId}/billing`}
            className="bg-zinc-950/80 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all shadow-md backdrop-blur-sm"
          >
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
              <CreditCard size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                Billing & Plans
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                Manage your subscription tier, view invoices, update payment methods, or safely cancel.
              </p>
            </div>
            <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
          </Link>

          <div className="bg-zinc-950/80 border border-fuchsia-500/20 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group grayscale opacity-70 cursor-not-allowed shadow-md backdrop-blur-sm">
            <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-fuchsia-400 shrink-0">
              <Box size={20} />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1">
                Developer Tools
              </h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                Ecosystem expansions, API connections, and beta toggles are currently in the lab.
              </p>
            </div>
            <Lock size={16} className="text-fuchsia-500/40 shrink-0 absolute right-6" />
          </div>

          {/* WORKSPACE STATUS */}
          <div className="bg-zinc-950/80 border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col shadow-xl backdrop-blur-sm relative overflow-hidden group mt-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
              <Activity size={16} className="text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-widest">Workspace Status</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Project Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusConfig.badgeColor.split(' ')[0]} animate-pulse`} />
                  <span className="text-xs font-black text-white uppercase tracking-widest truncate">{statusConfig.label}</span>
                </div>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Web Address</p>
                <p className="text-xs font-black text-white truncate">{store?.custom_domain || 'Pending Setup'}</p>
              </div>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Active Plan</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-black text-white uppercase tracking-widest">{planName}</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">(${planPrice}/mo)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}