/* src/app/sandbox/[clientId]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Gatekeeper from '@/components/sandbox/shared/Gatekeeper';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { Activity, Truck, PackageSearch, Wrench, X, Globe, UserCircle, Info, ShoppingCart } from 'lucide-react';

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
    setIsMounted(true);
  }, []);

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
        onUnlock={() => setIsAuthenticated(true)} 
        appTitle={clientConfig.appTitle}
        pin={clientConfig.security.pin}
        lockedMessage={clientConfig.security.lockedMessage}
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
    // THE STOREFRONT APP
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

  // ==========================================
  // THE DYNAMIC CLIENT HUB (LAUNCHPAD)
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-white/10">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] pointer-events-none opacity-20"></div>
      
      <div className="absolute top-6 left-6 flex items-center gap-2 z-20 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full shadow-lg">
        <UserCircle size={16} className="text-cyan-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ID: {clientConfig.primaryContact}</span>
      </div>

      <button onClick={() => router.push('/login')} className="absolute top-6 right-6 flex items-center justify-center z-20 bg-zinc-900 border border-zinc-800 w-10 h-10 rounded-full shadow-lg text-zinc-500 hover:text-rose-400 transition-colors" title="Exit Hub">
        <X size={16} />
      </button>

      {/* Launcher UI */}
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="mb-8 text-center mt-8">
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-zinc-100 via-zinc-400 to-zinc-600 uppercase italic leading-none">{clientConfig.appTitle}</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[.4em] mt-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800/50 shadow-inner inline-block">Active Prototype</p>
        </div>

        <div className="w-full space-y-4">
          {clientConfig.apps.map((app: any) => (
            <button key={app.id} onClick={() => setActiveAppId(app.id)} className={`w-full bg-zinc-900 border border-zinc-800 hover:border-${app.themeKey}-500/50 p-6 rounded-3xl text-left group transition-all shadow-xl relative overflow-hidden active:scale-[0.98]`}>
              <div className={`absolute inset-0 bg-linear-to-r from-${app.themeKey}-500/0 via-${app.themeKey}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className={`bg-zinc-950 border border-zinc-800 p-4 rounded-2xl transition-all shadow-inner group-hover:scale-110 group-hover:border-${app.themeKey}-500/50`}>
                  <IconMapper name={app.iconName} className={`w-8 h-8 text-${app.themeKey}-400 drop-shadow-[0_0_8px_rgba(currentColor,0.4)]`} />
                </div>
                <div>
                  <h2 className="font-black text-zinc-100 text-lg uppercase tracking-wider mb-1">{app.name}</h2>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{app.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}