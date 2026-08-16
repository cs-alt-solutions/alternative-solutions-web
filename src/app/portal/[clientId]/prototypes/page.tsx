/* src/app/portal/[clientId]/prototypes/page.tsx */
'use client';

import React, { useEffect, useState, use } from 'react';
import { supabase } from '@/utils/supabase';
import AppIframe from '@/components/portal/core/AppIframe';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function ActivePrototypesPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorefront = async () => {
      const { data, error } = await supabase
        .from('storefronts')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (!error && data) {
        setStore(data);
      }
      setLoading(false);
    };
    
    fetchStorefront();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-cyan-500">
        <Loader2 size={48} className="animate-spin mb-6" />
        <span className="text-xs font-mono uppercase tracking-widest animate-pulse text-cyan-400">
          Connecting to Storefront Instance...
        </span>
      </div>
    );
  }

  if (!store || !store.slug) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">No Storefront Found</h2>
        <p className="text-sm font-mono text-slate-400 max-w-md leading-relaxed">
          The storefront associated with this workspace ID is currently initializing. Please check back shortly.
        </p>
      </div>
    );
  }

  const liveStoreUrl = `https://storefronts.alternativesolutions.io/${store.slug}`;

  return (
    <div className="w-full h-full animate-in fade-in duration-500">
       <AppIframe url={liveStoreUrl} title={store.business_name || 'Live Storefront'} />
    </div>
  );
}