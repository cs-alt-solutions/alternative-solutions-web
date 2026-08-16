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

  // Grab today's date so the system update always looks fresh
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-12">
      
      {/* 1. Personalized Welcome Banner */}
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-cyan-500" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
              {businessName} Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {WELCOME_TITLE}
          </h1>
          <p className="text-sm md:text-base text-cyan-500/80 leading-relaxed font-mono uppercase tracking-widest">
            This is dope. Let's get building.
          </p>
        </div>
      </div>

      {/* 2. Core Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Architect's Welcome Letter (Replaces System Broadcast) */}
        <div className="lg:col-span-8 bg-zinc-950/50 border border-zinc-800/80 rounded-3xl p-8 flex flex-col min-h-75 group hover:border-cyan-500/30 transition-all shadow-xl backdrop-blur-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <TerminalSquare size={18} className="text-cyan-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              Architect's Log
            </h2>
            <span className="ml-auto text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              v1.0.0-beta
            </span>
          </div>

          {/* Letter Content */}
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative pl-6 border-l border-zinc-800/80 pb-2">
              <div className="absolute w-2.5 h-2.5 bg-cyan-500 rounded-full -left-[5.5px] top-1.5 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
              <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest mb-1">
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
                <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest pt-4">
                  — Courtney
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Action Stack */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Live Storefront Link */}
          <Link 
            href={`/portal/${clientId}/storefront`}
            className="flex-1 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-6 flex flex-col group hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
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

          {/* Billing & Subscription Link */}
          <Link 
            href={`/portal/${clientId}/billing`}
            className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex flex-col group hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Billing & Plans
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1">
              Manage your subscription tier, view invoices, and update payment methods securely.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mt-auto">
              Manage Billing <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Future Expansion: Developer Tools (Disabled UI) */}
          <div className="flex-1 bg-zinc-950/40 border border-zinc-800/50 rounded-3xl p-6 flex flex-col relative overflow-hidden grayscale opacity-70">
            <div className="absolute top-6 right-6 text-zinc-600">
              <Lock size={16} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-500">
                <Box size={18} />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Developer Tools
              </h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">
              Advanced staging environments, API webhooks, and beta feature toggles are currently under construction.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-fuchsia-500/50 font-bold uppercase tracking-widest mt-auto">
              Future Expansion
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}