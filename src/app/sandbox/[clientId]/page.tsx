/* src/app/sandbox/[clientId]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Gatekeeper from '@/components/sandbox/shared/Gatekeeper';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { Activity, Truck, PackageSearch, Wrench, X, Globe, UserCircle, ShoppingCart, TestTube, AlertTriangle, Cpu, Layers, ArrowRight, Store, Lock, ShieldCheck, Package } from 'lucide-react';

// MICRO-APP ENGINE IMPORTS
import LogisticsTerminal from '@/components/sandbox/apps/division/logistics/LogisticsTerminal';
import AdminTerminal from '@/components/sandbox/apps/division/admin/AdminTerminal';
import FulfillmentTerminal from '@/components/sandbox/apps/division/fulfillment/FulfillmentTerminal';
import StorefrontTerminal from '@/components/sandbox/apps/division/storefront/StorefrontTerminal';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';
import InteractiveGarage from '@/components/sandbox/apps/luckystrike/InteractiveGarage';

// Dynamic icon mapper for the hub registry
const IconMapper = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Activity': return <Activity className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'PackageSearch': return <PackageSearch className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'ShoppingCart': return <ShoppingCart className={className} />;
    case 'Store': return <Store className={className} />;
    case 'Lock': return <Lock className={className} />;
    case 'Package': return <Package className={className} />;
    default: return <Globe className={className} />;
  }
};

export default function DynamicSandboxPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  
  // LIVE DATABASE STATE
  const [dbPin, setDbPin] = useState<string | null>(null);

  useEffect(() => {
    // FAST-PASS: Read the auth token from the main login screen to bypass Gatekeeper
    const hasFastPass = localStorage.getItem(`sandbox_auth_${clientId}`);
    if (hasFastPass === 'true') {
      setIsAuthenticated(true);
    }
    setIsMounted(true);

    // SYNCHRONIZE WITH THE DATABASE
    const fetchDbPin = async () => {
      const { data } = await supabase.from('clients').select('master_pin').eq('id', clientId).single();
      if (data && data.master_pin) setDbPin(data.master_pin.toString());
    };
    fetchDbPin();
  }, [clientId]);

  if (!isMounted) return null;

  const clientConfig = (SANDBOX_CLIENTS as any)[clientId];

  if (!clientConfig) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <p className="uppercase tracking-widest font-bold text-sm">404 | Workspace Not Found</p>
      </div>
    );
  }

  // The Main "Welcome Mat" Gatekeeper
  if (!isAuthenticated) {
    return (
      <Gatekeeper 
        onUnlock={() => {
          localStorage.setItem(`sandbox_auth_${clientId}`, 'true');
          setIsAuthenticated(true);
        }} 
        appTitle={clientConfig.appTitle}
        // READ FROM DB FIRST, FALLBACK TO LOCAL CONFIG
        pin={dbPin || clientConfig.security?.pin || '1234'} 
        lockedMessage={clientConfig.security?.lockedMessage}
      />
    );
  }

  // ==========================================
  // PLUG-AND-PLAY APP ROUTER
  // ==========================================
  if (activeAppId) {
    if (activeAppId === 'logistics') return <LogisticsTerminal clientConfig={clientConfig} onExit={() => setActiveAppId(null)} />;
    if (activeAppId === 'admin') return <AdminTerminal clientConfig={clientConfig} onExit={() => setActiveAppId(null)} />;
    if (activeAppId === 'fulfillment') return <FulfillmentTerminal clientConfig={clientConfig} operatorId={clientConfig.primaryContact || "OPERATOR"} onExit={() => setActiveAppId(null)} />;
    if (activeAppId === 'storefront') return <StorefrontTerminal clientConfig={clientConfig} onExit={() => setActiveAppId(null)} />;
    if (activeAppId === 'asset-hub') return <AssetHubTerminal clientConfig={clientConfig} onExit={() => setActiveAppId(null)} />;
    
    // THE LUCKYSTRIKE VIRTUAL GARAGE ROUTE
    if (activeAppId === 'garage' || activeAppId === 'interactive-garage') {
      return (
        <div className="min-h-screen bg-[#1B2123] relative text-[#E5E4E2]">
          <button 
            onClick={() => setActiveAppId(null)} 
            className="absolute top-6 right-6 text-[#E5E4E2] hover:text-[#ADFF2F] flex items-center gap-2 transition-colors z-50 bg-[#2C3539] px-4 py-2 rounded-xl border border-[#1B2123] shadow-lg"
          >
            <X size={16} /> <span className="text-xs font-black uppercase tracking-widest">Exit Garage</span>
          </button>
          
          <div className="p-8 pt-24 h-full max-w-7xl mx-auto">
            <div className="border-b border-[#2C3539] pb-6 mb-8">
              <h1 className="text-3xl font-black text-[#E5E4E2] uppercase tracking-widest">
                Project // {clientConfig.name || 'LuckyStrike Designs'}
              </h1>
              <p className="text-[#ADFF2F] font-mono mt-2">
                Phase: Immersive Platform Prototype
              </p>
            </div>
            <InteractiveGarage />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6">
        <button onClick={() => setActiveAppId(null)} className="absolute top-6 left-6 text-zinc-500 hover:text-cyan-400 flex items-center gap-2 transition-colors z-50">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Return to Workspace</span>
        </button>
        <div className="text-center animate-pulse">
            <p className="text-cyan-400/50 font-bold tracking-widest uppercase text-sm">Initializing Module...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DATA PARSING
  // ==========================================
  const prototypes = clientConfig.apps.filter((app: any) => app.category === 'prototype');
  const concepts = clientConfig.apps.filter((app: any) => app.category === 'concept');
  const resources = clientConfig.apps.filter((app: any) => app.category === 'resource');

  // Dynamic Card Renderer with High-Energy Styling
  const renderAppCard = (app: any, variant: 'main' | 'sidebar' = 'main') => {
    const isAssetHub = app.id === 'asset-hub';
    const isConcept = app.category === 'concept';
    
    const glowColor = isAssetHub ? 'cyan' : isConcept ? 'purple' : 'cyan';
    const borderHover = isConcept ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';
    const shadowHover = isConcept ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]';
    const bgBase = isConcept ? 'bg-gradient-to-br from-purple-950/10 to-zinc-900/50' : 'bg-gradient-to-br from-cyan-950/10 to-zinc-900/50';

    return (
      <div key={app.id} className={`group ${bgBase} border border-zinc-800/80 ${borderHover} ${shadowHover} rounded-2xl p-6 transition-all duration-300 flex flex-col h-full backdrop-blur-sm relative overflow-hidden`}>
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${glowColor}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <div className="flex items-start gap-4 mb-4 relative z-10">
          <div className={`p-3 rounded-xl border transition-colors bg-zinc-950/80 border-zinc-800/80 group-hover:border-${glowColor}-500/30 text-zinc-400 group-hover:text-${glowColor}-400 shadow-inner`}>
            <IconMapper name={app.icon} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-100 text-lg leading-tight group-hover:text-white transition-colors">{app.name}</h3>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isConcept ? 'text-purple-500' : 'text-cyan-500'}`}>
              {app.status === 'live' || app.status === 'production' ? 'Active Build' : app.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1 relative z-10 group-hover:text-zinc-300 transition-colors">
          {app.description}
        </p>
        <button 
          onClick={() => setActiveAppId(app.id)} 
          className={`w-full relative z-10 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all overflow-hidden border ${
            isAssetHub 
              ? 'bg-cyan-500 text-zinc-950 border-cyan-400 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
              : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
          }`}
        >
          <span>{isAssetHub ? 'Access Vault' : 'Initialize'}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

  // ==========================================
  // THE VIP CLIENT PORTAL (HIGH-ENERGY ASYMMETRICAL)
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-6 md:p-8 lg:p-12 text-zinc-100 relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Heavy Cyberpunk Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-7xl relative z-20">
        
        {/* TOP NAV / HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-800/80 pb-8">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
               <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400 border border-cyan-400/20 px-2 py-1 rounded shadow-inner bg-cyan-950/30">
                 Secure Connection Established
               </span>
             </div>
             <h1 className="font-black tracking-tighter text-4xl sm:text-5xl text-white drop-shadow-md">
               {clientConfig.agencyName || 'Alternative Solutions'}
             </h1>
             <p className="text-sm font-mono text-zinc-400 mt-2 uppercase tracking-widest">
               Operator: <span className="text-zinc-200">{clientConfig.primaryContact || 'Admin'}</span>
             </p>
           </div>
           
           <button onClick={() => {
               localStorage.removeItem(`sandbox_auth_${clientId}`);
               router.push('/login');
             }} 
             className="flex items-center gap-2 text-zinc-400 hover:text-rose-400 transition-colors bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-rose-900/50 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
             <X size={14} /> Disconnect
           </button>
        </div>

        {/* ASYMMETRICAL LAYOUT: Main Stage (Left) vs Sidebar (Right) */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
          
          <div className="flex-1 flex flex-col gap-12">
            {/* ZONE 1: ACTIVE PROTOTYPES */}
            {prototypes.length > 0 && (
              <section className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl text-white tracking-tight">Active Builds</h2>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Production-Ready Prototypes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {prototypes.map((app: any) => renderAppCard(app, 'main'))}
                </div>
              </section>
            )}

            {/* ZONE 2: THE CONCEPT LAB */}
            {concepts.length > 0 && (
              <section className="relative mt-4">
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-linear-to-b from-purple-500/50 to-transparent hidden md:block"></div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                    <TestTube size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl text-white tracking-tight">The Concept Lab</h2>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Experimental Architecture</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {concepts.map((app: any) => renderAppCard(app, 'main'))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Command & Resources Sidebar */}
          {resources.length > 0 && (
            <div className="w-full xl:w-96 shrink-0">
              <div className="sticky top-8 bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
                <div className="mb-8 border-b border-zinc-800/80 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-black text-xl text-white flex items-center gap-2">
                      <Layers size={18} className="text-cyan-500" /> Command
                    </h2>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">Encrypted Assets & Docs</p>
                </div>
                
                <div className="flex flex-col gap-5">
                   {resources.map((app: any) => renderAppCard(app, 'sidebar'))}
                </div>

                {/* Placeholder for future sidebar items (Contracts, Billing) */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50 space-y-3">
                   <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-lg"><Lock size={14} className="text-zinc-500" /></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Service Agreements</span>
                      </div>
                      <span className="text-[8px] border border-zinc-700 px-2 py-0.5 rounded text-zinc-600 font-mono">LOCKED</span>
                   </div>
                   <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-lg"><Lock size={14} className="text-zinc-500" /></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Billing Ledger</span>
                      </div>
                      <span className="text-[8px] border border-zinc-700 px-2 py-0.5 rounded text-zinc-600 font-mono">LOCKED</span>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}