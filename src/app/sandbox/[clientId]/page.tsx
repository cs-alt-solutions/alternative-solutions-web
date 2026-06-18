'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import { supabase } from '@/utils/supabase'; // Notice the updated client path!
import { X, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';

export default function DynamicSandboxPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const clientId = params.clientId as string;
  const appId = searchParams.get('app'); 
  
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [clientConfig, setClientConfig] = useState<any>(null);
  const [activeApp, setActiveApp] = useState<any>(null);

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

      if (!appId) {
        router.push(`/portal/${clientId}/prototypes`);
        return;
      }

      // 3. LOAD WORKSPACE CONFIGURATION
      const { data: dbData } = await supabase.from('clients').select('*').eq('id', clientId).maybeSingle();

      let activeConfig = null;
      if (dbData) {
         const dbName = dbData.name?.toLowerCase().trim();
         activeConfig = Object.values(SANDBOX_CLIENTS).find(
           (c: any) => c.name?.toLowerCase().trim() === dbName || 
                       c.agencyName?.toLowerCase().trim() === dbName ||
                       c.id === clientId
         );
      } else {
         activeConfig = (SANDBOX_CLIENTS as any)[clientId];
      }

      if (activeConfig) {
        setClientConfig(activeConfig);
        // Find the specific app data so we can grab its external URL
        const appData = activeConfig.apps?.find((a: any) => a.id === appId);
        if (appData) setActiveApp(appData);
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
          <p className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest">Initializing Secure Sandbox...</p>
        </div>
      </div>
    );
  }

  if (!clientConfig || !activeApp) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <AlertTriangle size={48} className="mb-4 text-orange-500/50" />
        <p className="uppercase tracking-widest font-bold text-sm">404 | Prototype Not Found</p>
        <button onClick={() => router.push(`/portal/${clientId}/prototypes`)} className="mt-6 text-zinc-400 hover:text-cyan-400 flex items-center gap-2 transition-colors bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Return to Dashboard</span>
        </button>
      </div>
    );
  }

  const handleExit = () => router.push(`/portal/${clientId}/prototypes`);

  // ==========================================
  // THE NEW MICROSERVICE IFRAME VIEWER
  // ==========================================
  
  // If we haven't assigned an external URL to this app yet, show a clean placeholder
  if (!activeApp.demoUrl) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-3xl flex flex-col items-center max-w-lg text-center">
            <ExternalLink size={48} className="mb-6 text-cyan-500/50" />
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4">{activeApp.name}</h2>
            <p className="text-zinc-400 mb-8 font-mono text-sm">This prototype is currently being deployed to a secure external sandbox. Check back shortly.</p>
            <button onClick={handleExit} className="w-full text-zinc-950 hover:bg-cyan-400 flex items-center justify-center gap-2 transition-colors bg-cyan-500 px-6 py-4 rounded-xl">
              <span className="text-sm font-black uppercase tracking-widest">Return to Workspace</span>
            </button>
          </div>
        </div>
      );
  }

  // If the app HAS a demo URL, render it in the seamless window!
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden flex flex-col">
      {/* Universal Exit Bar */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Active Connection: <span className="text-cyan-500 font-bold">{activeApp.name}</span></span>
        </div>
        <button 
          onClick={handleExit} 
          className="text-zinc-400 hover:text-rose-400 flex items-center gap-2 transition-colors px-4 py-1.5 rounded-lg hover:bg-rose-500/10"
        >
          <span className="text-xs font-black uppercase tracking-widest">Close Sandbox</span> <X size={16} />
        </button>
      </div>
      
      {/* The Iframe Window */}
      <div className="flex-1 w-full relative bg-black">
         <iframe 
            src={activeApp.demoUrl} 
            className="absolute inset-0 w-full h-full border-none"
            title={`${activeApp.name} Sandbox Environment`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
         />
      </div>
    </div>
  );
}