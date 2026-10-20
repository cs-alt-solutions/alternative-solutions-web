/* src/components/portal/network/NetworkModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Network } from 'lucide-react';
import { getPortalTheme } from '../core/theme';
import QrStudioPanel from './QrStudioPanel';
import ReferralEnginePanel from './ReferralEnginePanel';
import { PORTAL_COPY } from '@/config/clients/portal';

export default function NetworkModule({ clientId }: { clientId: string }) {
  const [storeName, setStoreName] = useState('LOADING...');
  const [storeUrl, setStoreUrl] = useState('');
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState('cyan-500');
  const [secondaryColor, setSecondaryColor] = useState('fuchsia-500');
  const currentTheme = getPortalTheme(clientId);
  const copy = PORTAL_COPY.network;

  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await supabase
        .from('storefronts')
        .select('business_name, slug, custom_domain, brand_logo, brand_color, secondary_brand_color')
        .eq('id', clientId)
        .single();
        
      if (data) {
        const cleanCode = data.business_name?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UPLINK';
        setStoreName(cleanCode);
        setStoreLogo(data.brand_logo);
        
        if (data.brand_color) setBrandColor(data.brand_color);
        if (data.secondary_brand_color) setSecondaryColor(data.secondary_brand_color);

        const activeUrl = data.custom_domain 
          ? `https://${data.custom_domain}` 
          : `https://storefronts.alternativesolutions.io/${data.slug}`;
        setStoreUrl(activeUrl);
      }
    };
    fetchStore();
  }, [clientId]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2 h-full">
      <div className="mb-8 border-b border-white/5 pb-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${currentTheme.bg} flex items-center justify-center border ${currentTheme.border} shrink-0`}>
          <Network className={`${currentTheme.text} w-6 h-6`} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">{copy.title}</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{copy.subtitle}</p>
        </div>
      </div>

      <QrStudioPanel 
        currentTheme={currentTheme}
        storeName={storeName}
        storeUrl={storeUrl}
        storeLogo={storeLogo}
        brandColor={brandColor}
        secondaryBrandColor={secondaryColor}
        copy={copy.qrStudio}
      />

      <ReferralEnginePanel 
        currentTheme={currentTheme}
        storeName={storeName}
        copy={copy.referral}
      />
    </div>
  );
}