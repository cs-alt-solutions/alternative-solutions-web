/* src/app/sandbox/[clientId]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

// MICRO-APP ENGINE IMPORTS
import LogisticsTerminal from '@/components/sandbox/apps/division/logistics/LogisticsTerminal';
import AdminTerminal from '@/components/sandbox/apps/division/admin/AdminTerminal';
import FulfillmentTerminal from '@/components/sandbox/apps/division/fulfillment/FulfillmentTerminal';
import StorefrontTerminal from '@/components/sandbox/apps/division/storefront/StorefrontTerminal';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';
import InteractiveGarage from '@/components/sandbox/apps/luckystrike/InteractiveGarage';

export default function DynamicSandboxPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const clientId = params.clientId as string;
  const appId = searchParams.get('app'); // Grab the app ID straight from the URL
  
  const [isMounted, setIsMounted] = useState(false);
  
  // LIVE DATABASE / ROUTING STATE
  const [isInitializing, setIsInitializing] = useState(true);
  const [clientConfig, setClientConfig] = useState<any>(null);

  useEffect(() => {
    const setupWorkspace = async () => {
      setIsMounted(true);

      // 1. VERIFY REAL SUPABASE SESSION
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push('/login');
        return;
      }

      // 2. CHECK SECURITY CLEARANCE
      const role = user.user_metadata?.role;
      const userWorkspace = user.user_metadata?.workspace_id;
      
      const hasClearance = role === 'ADMIN' || role === 'STAFF' || userWorkspace === clientId;
      
      if (!hasClearance) {
        console.warn("Unauthorized Access Attempt Blocked.");
        router.push('/login?error=Unauthorized_Workspace');
        return;
      }

      // If they somehow navigated here without an app specified, kick them back to the portal
      if (!appId) {
        router.push(`/portal/${clientId}/prototypes`);
        return;
      }

      // 3. LOAD WORKSPACE CONFIGURATION
      const { data: dbData } = await supabase.from('clients').select('*').eq('id', clientId).maybeSingle();

      if (dbData) {
         const dbName = dbData.name?.toLowerCase().trim();
         const matchedConfig = Object.values(SANDBOX_CLIENTS).find(
           (c: any) => c.name?.toLowerCase().trim() === dbName || 
                       c.agencyName?.toLowerCase().trim() === dbName ||
                       c.id === clientId
         );
         
         if (matchedConfig) setClientConfig(matchedConfig);
      } else {
         const localData = (SANDBOX_CLIENTS as any)[clientId];
         if (localData) {
            setClientConfig(localData);
         }
      }
      
      setIsInitializing(false);
    };

    setupWorkspace();
  }, [clientId, router, appId]);

  if (!isMounted || isInitializing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-4" />
          <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest">Initializing Environment...</p>
        </div>
      </div>
    );
  }

  if (!clientConfig) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <AlertTriangle size={48} className="mb-4 text-orange-500/50" />
        <p className="uppercase tracking-widest font-bold text-sm">404 | Workspace Not Found</p>
      </div>
    );
  }

  // Define the universal exit route
  const handleExit = () => router.push(`/portal/${clientId}/prototypes`);

  // ==========================================
  // PLUG-AND-PLAY APP ROUTER
  // ==========================================
  if (appId === 'logistics') return <LogisticsTerminal clientConfig={clientConfig} onExit={handleExit} />;
  if (appId === 'admin') return <AdminTerminal clientConfig={clientConfig} onExit={handleExit} />;
  if (appId === 'fulfillment') return <FulfillmentTerminal clientConfig={clientConfig} operatorId={clientConfig.primaryContact || "OPERATOR"} onExit={handleExit} />;
  if (appId === 'storefront') return <StorefrontTerminal clientConfig={clientConfig} onExit={handleExit} />;
  if (appId === 'asset-hub') return <AssetHubTerminal clientConfig={clientConfig} onExit={handleExit} />;
  
  if (appId === 'garage' || appId === 'interactive-garage') {
    return (
      <div className="min-h-screen bg-[#1B2123] relative text-[#E5E4E2]">
        <button 
          onClick={handleExit} 
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

  // Fallback if the requested app doesn't exist
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6">
      <AlertTriangle size={48} className="mb-4 text-rose-500/50" />
      <p className="uppercase tracking-widest font-bold text-sm text-rose-400 mb-6">404 | Prototype Not Found</p>
      <button onClick={handleExit} className="text-zinc-400 hover:text-cyan-400 flex items-center gap-2 transition-colors bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl">
        <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Return to Workspace</span>
      </button>
    </div>
  );
}