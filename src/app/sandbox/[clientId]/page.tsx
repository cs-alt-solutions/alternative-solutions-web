/* src/app/sandbox/[clientId]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Gatekeeper from '@/components/sandbox/shared/Gatekeeper';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { Activity, Truck, PackageSearch, Wrench, X, Globe, UserCircle, ShoppingCart, TestTube, AlertTriangle, Cpu, Layers, ArrowRight, Store, Lock } from 'lucide-react';

// MICRO-APP ENGINE IMPORTS
import LogisticsTerminal from '@/components/sandbox/apps/logistics/LogisticsTerminal';
import AdminTerminal from '@/components/sandbox/apps/admin/AdminTerminal';
import FulfillmentTerminal from '@/components/sandbox/apps/fulfillment/FulfillmentTerminal';
import StorefrontTerminal from '@/components/sandbox/apps/storefront/StorefrontTerminal';

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

  useEffect(() => {
    // FAST-PASS: Read the auth token from the main login screen to bypass Gatekeeper
    const hasFastPass = localStorage.getItem(`sandbox_auth_${clientId}`);
    if (hasFastPass === 'true') {
      setIsAuthenticated(true);
    }
    setIsMounted(true);
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
        pin={clientConfig.security?.pin || '1234'}
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

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6">
        <button onClick={() => setActiveAppId(null)} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-400 flex items-center gap-2 transition-colors z-50">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Exit App</span>
        </button>
        <div className="text-center animate-pulse">
            <p className="text-cyan-400 font-black tracking-widest uppercase italic">Engine Initializing...</p>
        </div>
      </div>
    );
  }

  // Group Apps for the UI
  const sharedApps = clientConfig.apps.filter((app: any) => app.id === 'logistics');
  const clientSpecificApps = clientConfig.apps.filter((app: any) => app.id !== 'logistics');

  // ==========================================
  // THE DYNAMIC CLIENT HUB (TESTING LAB)
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center p-6 md:p-12 text-zinc-100 relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Blueprint Grid Background - FIXED bg-size syntax */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

      {/* Top Header / Nav */}
      <div className="relative z-20 w-full max-w-5xl flex justify-between items-center mb-8 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-lg">
         <div className="flex items-center gap-4">
           <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/30 hidden sm:block">
             <TestTube size={24} className="text-cyan-400" />
           </div>
           <div>
             <h1 className="font-black tracking-widest uppercase sm:text-xl text-zinc-100">
               {clientConfig.agencyName || 'Alternative Solutions'} <span className="text-cyan-400">Sandbox</span>
             </h1>
             <div className="flex items-center gap-2 mt-1">
               <UserCircle size={12} className="text-zinc-500" />
               <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Session ID: {clientConfig.primaryContact || 'ADMIN'}</p>
             </div>
           </div>
         </div>
         <button onClick={() => {
             localStorage.removeItem(`sandbox_auth_${clientId}`);
             router.push('/login');
           }} 
           className="flex items-center gap-2 text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner">
           <X size={14} /> Exit Lab
         </button>
      </div>

      {/* Warning Banner */}
      <div className="relative z-20 w-full max-w-5xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-sm animate-in slide-in-from-top-4">
        <div className="bg-amber-500/20 p-3 rounded-full border border-amber-500/30 shrink-0">
          <AlertTriangle size={24} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-amber-400 font-black uppercase tracking-widest text-sm mb-1.5 flex items-center gap-2">
            Active Testing Environment <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </h2>
          <p className="text-zinc-300 text-xs font-medium leading-relaxed max-w-3xl">
            Welcome to the developer sandbox. The modules below are isolated prototypes designed to demonstrate specific backend functionality and UI concepts. <strong>These do not represent the final, interconnected application design.</strong>
          </p>
        </div>
      </div>

      {/* Modules Area */}
      <div className="relative z-20 w-full max-w-5xl space-y-12">
        
        {/* GROUP 1: Client Specific Apps */}
        <section className="animate-in fade-in duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <Cpu size={20} className="text-zinc-500" />
            <h3 className="font-black text-xl text-zinc-100 uppercase tracking-widest">{clientConfig.agencyName} Suite</h3>
            <span className="ml-auto text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded hidden sm:block">RETAIL & COMMAND</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientSpecificApps.map((app: any) => {
              const isRecentlyUpdated = app.lastUpdated && (app.lastUpdated.toLowerCase().includes('today') || app.lastUpdated.toLowerCase().includes('now'));
              
              return (
                <div key={app.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-4xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col h-full overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-5 left-5">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border ${app.status === 'beta' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : app.status === 'alpha' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                      {app.status || 'dev'}
                    </span>
                  </div>

                  {/* LIVE ACTIVITY TRACKER */}
                  {app.lastUpdated && (
                    <div className="absolute top-5 right-5 flex flex-col items-end">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 border shadow-inner ${isRecentlyUpdated ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-950 text-zinc-500 border-zinc-800'}`}>
                        {isRecentlyUpdated ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> : <Activity size={10} />}
                        {app.lastUpdated}
                      </span>
                      {app.updateLog && (
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 max-w-32 truncate text-right">
                          {app.updateLog}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-10 mb-4 relative z-10">
                    <div className={`p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.2)] transition-all`}>
                      <IconMapper name={app.icon} className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-zinc-100 uppercase tracking-wider text-base">{app.name}</h3>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ID: {app.id}</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-8 flex-1 relative z-10">
                    {app.description}
                  </p>
                  
                  <button onClick={() => setActiveAppId(app.id)} className="w-full flex items-center justify-between bg-zinc-950 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-zinc-800 hover:border-emerald-500 py-3.5 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all relative z-10 group/btn">
                    <span>Initialize Module</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* GROUP 2: Shared Infrastructure (Logistics) */}
        {sharedApps.length > 0 && (
          <section className="animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
              <Layers size={20} className="text-zinc-500" />
              <h3 className="font-black text-xl text-zinc-100 uppercase tracking-widest">Shared Infrastructure</h3>
              <span className="ml-auto text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded hidden sm:block">CORE ENGINE</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedApps.map((app: any) => {
                const isRecentlyUpdated = app.lastUpdated && (app.lastUpdated.toLowerCase().includes('today') || app.lastUpdated.toLowerCase().includes('now'));

                return (
                  <div key={app.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-4xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col h-full overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-cyan-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-5 left-5">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border ${app.status === 'beta' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : app.status === 'alpha' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                        {app.status || 'dev'}
                      </span>
                    </div>

                    {/* LIVE ACTIVITY TRACKER */}
                    {app.lastUpdated && (
                      <div className="absolute top-5 right-5 flex flex-col items-end">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1.5 border shadow-inner ${isRecentlyUpdated ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-zinc-950 text-zinc-500 border-zinc-800'}`}>
                          {isRecentlyUpdated ? <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> : <Activity size={10} />}
                          {app.lastUpdated}
                        </span>
                        {app.updateLog && (
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 max-w-32 truncate text-right">
                            {app.updateLog}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-10 mb-4 relative z-10">
                      <div className={`p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all`}>
                        <IconMapper name={app.icon} className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-zinc-100 uppercase tracking-wider text-base">{app.name}</h3>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ID: {app.id}</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-8 flex-1 relative z-10">
                      {app.description}
                    </p>
                    
                    <button onClick={() => setActiveAppId(app.id)} className="w-full flex items-center justify-between bg-zinc-950 hover:bg-cyan-500 text-cyan-400 hover:text-zinc-950 border border-zinc-800 hover:border-cyan-500 py-3.5 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all relative z-10 group/btn">
                      <span>Initialize Module</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}