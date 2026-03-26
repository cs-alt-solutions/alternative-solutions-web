"use client";

/* src/app/products/page.tsx */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Activity, Database, Lock, Terminal as TerminalIcon, Bot, User, Beaker } from 'lucide-react';
import AppShowcaseCard from '@/components/products/AppShowcaseCard';
import TerminalTab from '@/components/core/TerminalTab';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'COMMERCE' | 'LAB' | 'PIPELINE'>('COMMERCE');
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  
  const copy = WEBSITE_COPY.PUBLIC_SITE.ECOSYSTEM;

  // FETCH FROM DATABASE
  useEffect(() => {
    const fetchEcosystem = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_public', true) // ONLY show things toggled "ON" in your dashboard
        .order('created_at', { ascending: false });
      
      if (data) setLiveProducts(data);
    };
    fetchEcosystem();
  }, []);

  // Filter products by the active tab
  const getProductsForTab = (tabName: string) => {
    return liveProducts.filter(p => p.status === tabName);
  };

  // --- MOCKUP ENGINE ---
  const renderMockup = (mockupId: string) => {
    if (mockupId === 'shift_studio') {
      return (
        <div className="w-full max-w-lg bg-[#0d1520] border border-cyan-900/50 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] group-hover:border-cyan-500/50 transition-all duration-500 relative z-10">
          <div className="h-8 bg-[#0a0f16] border-b border-cyan-900/50 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded bg-[#131d2b] border border-cyan-900/30 font-mono text-[9px] text-cyan-500/50 uppercase tracking-widest">
              <Lock size={10} /> Shift Studio Command
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
              <div className="h-6 w-32 bg-cyan-900/30 rounded border border-cyan-800/30" />
              <div className="h-8 w-8 bg-cyan-900/30 rounded-full border border-cyan-800/30" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
            </div>
          </div>
        </div>
      );
    }

    if (mockupId === 'glitchbot') {
      return (
        <div className="w-full max-w-lg bg-[#13091c] border border-fuchsia-900/50 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] group-hover:border-fuchsia-500/50 transition-all duration-500 relative z-10">
          <div className="h-8 bg-[#0c0512] border-b border-fuchsia-900/50 flex items-center px-4 justify-between">
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/></div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#1e0d2e] border border-fuchsia-900/30 font-mono text-[9px] text-fuchsia-400/80 uppercase tracking-widest">
              <TerminalIcon size={10} /> Diagnostic
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4 font-mono text-xs">
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded bg-slate-800 shrink-0 flex items-center justify-center"><User size={14}/></div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 w-[85%]">Anomaly detected.</div>
            </div>
          </div>
        </div>
      );
    }

    // Default Blank Wireframe for new projects
    return (
      <div className="w-full max-w-lg bg-black/50 border border-slate-800 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden group-hover:border-brand-primary/50 transition-colors">
        <Database className="w-12 h-12 text-slate-800 group-hover:text-brand-primary/50 transition-colors" />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden font-sans pt-32 pb-24">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      
      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-tightest mb-8 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {copy.HEADER.TITLE}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            {copy.HEADER.DESC}
          </p>
        </div>

        {/* STANDARDIZED TERMINAL TAB CONTROLLER */}
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 md:gap-6 mb-16 z-20 relative overflow-x-auto pb-4">
          <TerminalTab label="USABLE APPS" isActive={activeTab === 'COMMERCE'} onClick={() => setActiveTab('COMMERCE')} icon={Activity} variant="cyan" />
          <TerminalTab label="PROTOTYPES" isActive={activeTab === 'LAB'} onClick={() => setActiveTab('LAB')} icon={Beaker} variant="fuchsia" />
          <TerminalTab label="COMING SOON" isActive={activeTab === 'PIPELINE'} onClick={() => setActiveTab('PIPELINE')} icon={Database} variant="violet" />
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="min-h-125 animate-in fade-in duration-500">
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {getProductsForTab(activeTab).length === 0 ? (
               <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl text-slate-500 font-mono text-xs uppercase tracking-widest">
                 NO DATA SYNCED TO THIS SECTOR.
               </div>
            ) : (
               getProductsForTab(activeTab).map((product) => (
                 <AppShowcaseCard 
                   key={product.id}
                   title={product.name || "UNTITLED"}
                   status={product.tagline || `LIVE SYNC • SECTOR 0${activeTab === 'COMMERCE' ? '1' : activeTab === 'LAB' ? '2' : '3'}`}
                   description={product.description || "System overview currently unavailable."}
                   linkHref={product.link_href || "#"}
                   linkText={activeTab === 'PIPELINE' ? "VIEW BLUEPRINT" : "INITIALIZE APP"}
                   uiMockup={renderMockup(product.mockup_id)}
                   images={product.media_assets?.carousel || []} 
                 />
               ))
            )}
          </div>
        </div>

        {/* CO-OP SECTOR */}
        <div className="mt-24 bg-bg-app/90 border border-amber-500/30 rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {copy.CO_OP.TITLE_1}<br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 animate-text-gradient drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    {copy.CO_OP.TITLE_2}
                </span>
              </h2>
              <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed">
                <p>{copy.CO_OP.DESC_1}</p>
                <p>{copy.CO_OP.DESC_2}</p>
                <p><strong className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{copy.CO_OP.DESC_3}</strong></p>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-8 backdrop-blur-md text-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <div className="flex justify-center mb-6 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <h3 className="text-2xl text-white font-bold mb-4">{copy.CO_OP.CARD_TITLE}</h3>
              <p className="text-amber-200/70 text-sm mb-8">{copy.CO_OP.CARD_DESC}</p>
              <Link href="/blueprint" className="block w-full text-center bg-amber-500/20 text-amber-400 border border-amber-500/50 font-black uppercase tracking-widest py-4 rounded hover:bg-amber-400 hover:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {copy.CO_OP.CTA}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}