/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, MessageSquare, FileUp, Box, ArrowRight, Store, CreditCard } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('storefronts')
    .select('business_name, tagline')
    .eq('id', clientId)
    .single();

  const businessName = store?.business_name || 'My Workspace';
  const { WELCOME_TITLE, WELCOME_DESC } = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* 1. Personalized Welcome Banner */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-brand-primary" />
            <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
              {businessName} Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {WELCOME_TITLE}
          </h1>
          <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
            {store?.tagline || WELCOME_DESC}
          </p>
        </div>
      </div>

      {/* 2. Functional Communication & Core Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Main Messages Panel (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col min-h-[300px] group hover:border-brand-primary/30 transition-all shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <MessageSquare size={18} className="text-fuchsia-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              Direct Messages
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center text-center border border-dashed border-white/5 rounded-2xl bg-white/5">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              No new messages. You're all caught up.
            </p>
          </div>
        </div>

        {/* Core Business Stack (Spans 4 cols on desktop) */}
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
            <p className="text-xs text-white/60 leading-relaxed mb-6 flex-1">
              Manage your live website, update text, and review your digital storefront settings.
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
            <p className="text-xs text-white/60 leading-relaxed mb-6 flex-1">
              Manage your $5 foundation subscription, invoices, and payment methods.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest mt-auto">
              Manage Billing <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* 3. Development & Asset Tools Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Secure Transfer Link - Wide Horizontal Layout */}
          <Link 
            href={`/portal/${clientId}/transfer`}
            className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 flex items-center justify-between group hover:border-white/20 hover:bg-white/5 transition-all shadow-xl backdrop-blur-sm"
          >
             <div className="flex items-center gap-6">
                <div className="p-4 bg-zinc-800/50 rounded-2xl text-zinc-400 group-hover:text-white transition-colors">
                  <FileUp size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                    Secure Transfer Vault
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                    Upload high-res assets, documents, and brand files directly to our engineering pipeline.
                  </p>
                </div>
             </div>
             <ArrowRight size={20} className="text-zinc-600 group-hover:text-white group-hover:translate-x-2 transition-all hidden sm:block" />
          </Link>

          {/* Active Prototypes Link - Wide Horizontal Layout */}
          <Link 
            href={`/portal/${clientId}/prototypes`}
            className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 flex items-center justify-between group hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5 transition-all shadow-xl backdrop-blur-sm"
          >
             <div className="flex items-center gap-6">
                <div className="p-4 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400 group-hover:scale-110 transition-transform">
                  <Box size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                    Developer Tools
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                    Access staging environments, experimental tools, and beta features.
                  </p>
                </div>
             </div>
             <ArrowRight size={20} className="text-fuchsia-400 group-hover:translate-x-2 transition-all hidden sm:block" />
          </Link>

      </div>

    </div>
  );
}