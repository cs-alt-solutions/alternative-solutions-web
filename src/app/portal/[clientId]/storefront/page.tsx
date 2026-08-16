/* src/app/portal/[clientId]/storefront/page.tsx */
import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppIframe from '@/components/portal/shared/AppIframe';
import ClientStorefrontEditor from '@/components/portal/core/ClientStorefrontEditor';
import { Store, AlertTriangle } from 'lucide-react';

export default async function LiveStorefrontPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('storefronts')
    .select('*')
    .eq('id', clientId)
    .single();

  if (!store) {
    return (
      <div className="p-8 text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 font-mono text-sm flex items-center gap-3">
        <AlertTriangle /> Error: Storefront data not found.
      </div>
    );
  }

  // Determine the live URL
  const liveUrl = store.custom_domain 
    ? `https://${store.custom_domain}` 
    : `https://storefronts.alternativesolutions.io/${store.slug}`;

  return (
    <div className="h-full flex flex-col xl:flex-row gap-8 p-4 lg:p-8 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: The Text Editor */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-12">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
            <Store className="text-cyan-500 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-widest">Content Manager</h1>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Live Database Sync</p>
          </div>
        </div>
        
        <ClientStorefrontEditor store={store} />
      </div>

      {/* RIGHT COLUMN: The Live Preview Iframe */}
      <div className="w-full xl:w-2/3 h-[600px] xl:h-[calc(100vh-6rem)]">
        <AppIframe url={liveUrl} title={`${store.business_name} Live View`} />
      </div>

    </div>
  );
}