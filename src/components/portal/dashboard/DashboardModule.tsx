/* src/components/portal/dashboard/DashboardModule.tsx */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, Store, CreditCard, ArrowRight, TerminalSquare, Box, Lock } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default async function DashboardModule({ 
  clientId 
}: { 
  clientId: string 
}) {
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('storefronts')
    .select('business_name')
    .eq('id', clientId)
    .single();

  const businessName = store?.business_name || 'My Workspace';
  const { WELCOME_TITLE } = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL;

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      
      {/* 1. Personalized Welcome Banner (Restored to bg-gradient) */}
      <div className="bg-linear-to-br from-zinc-950 to-zinc-900 border border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-fuchsia-400" />
            <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">
              {businessName} Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            {WELCOME_TITLE}
          </h1>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-mono uppercase tracking-widest">
            This is dope. Let's get building.
          </p>
        </div>
      </div>

      {/* 2. Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Architect's Log (Amber Theme) */}
        <div className="lg:col-span-8 bg-zinc-950/80 border border-amber-500/20 rounded-3xl p-8 flex flex-col min-h-75 group hover:border-amber-500/40 transition-all shadow-xl backdrop-blur-sm relative overflow-hidden">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/10">
            <TerminalSquare size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              Architect's Log
            </h2>
            <span className="ml-auto text-[10px] font-mono text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              v1.0.0-beta
            </span>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative pl-6 border-l border-zinc-800/80 pb-2">
              <div className="absolute w-2.5 h-2.5 bg-amber-500 rounded-full -left-[5.5px] top-1.5 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">
                Welcome to the Grid
              </h3>
              <p className="text-[10px] font-mono text-zinc-500 mb-6 uppercase tracking-widest">
                {currentDate} // Transmission
              </p>
              
              <div className="text-sm text-zinc-300 leading-relaxed font-light space-y-5">
                <p>
                  I am super pumped that we are finally here. I just want to pause for a second to say how incredibly grateful I am for this opportunity and for you taking a chance on me. 
                </p>
                <p>
                  I honestly don't think this first group of early adopters recognizes just how impactful your involvement is in shaping this entire ecosystem. We are building something radically different, and having you in this initial launch group means absolutely everything to me.
                </p>
                <p>
                  Pardon the digital dust while we get the engines running! Your <strong className="text-white font-medium">Live Storefront</strong> tab is online right now, so jump in, poke around, and start updating your media and text. If you hit any construction zones, just know I'm actively wiring them up in the trenches. 
                </p>
                <p className="text-amber-500 font-mono text-[10px] uppercase tracking-widest pt-4">
                  — Courtney
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Action Stack */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <Link 
            href={`/portal/${clientId}/storefront`}
            className="flex-1 bg-zinc-950/80 border border-cyan-500/20 rounded-3xl p-6 flex flex-col group hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                <Store size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Live Storefront
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1">
              Manage your live website, update media, and review your digital storefront settings.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest mt-auto">
              Manage Storefront <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link 
            href={`/portal/${clientId}/billing`}
            className="flex-1 bg-zinc-950/80 border border-emerald-500/20 rounded-3xl p-6 flex flex-col group hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Billing & Plans
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1">
              Manage your subscription tier, view invoices, update payment methods, or safely cancel your plan.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mt-auto">
              Manage Billing <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div className="flex-1 bg-zinc-950/80 border border-fuchsia-500/20 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
            <div className="absolute top-6 right-6 text-fuchsia-500/40">
              <Lock size={16} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg text-fuchsia-400">
                <Box size={18} />
              </div>
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                Developer Tools
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">
              Ecosystem expansions, API connections, and beta toggles are currently in the lab.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-fuchsia-500/60 font-bold uppercase tracking-widest mt-auto">
              Future Expansion
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}