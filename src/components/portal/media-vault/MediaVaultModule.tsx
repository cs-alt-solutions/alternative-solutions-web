/* src/components/portal/media-vault/MediaVaultModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2 } from 'lucide-react';

// 🚀 SINGLE SOURCE OF TRUTH: Import the exact Admin Dashboard component
import VaultTab from '@/components/dashboard/storefronts/editor/VaultTab';

export default function MediaVaultModule({ clientId }: { clientId: string }) {
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('storefronts')
          .select('*')
          .eq('id', clientId)
          .single();
          
        if (data && !error) {
          setFormData(data);
        }
      } catch (err) {
        console.error("Failed to load storefront data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [clientId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-amber-500 animate-in fade-in duration-500">
        <Loader2 size={48} className="animate-spin mb-4 opacity-50" />
        <span className="text-xs font-mono uppercase tracking-widest">Initializing Secure Vault...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <span className="text-xs font-mono uppercase tracking-widest">Workspace data not found.</span>
      </div>
    );
  }

  // We wrap the Dashboard's VaultTab and feed it the exact props it expects!
  return (
    <div className="h-full w-full animate-in fade-in duration-300">
      <VaultTab 
        storeId={clientId} 
        formData={formData} 
        setFormData={setFormData} 
        // No onReload needed here since there is no live canvas on this screen
      />
    </div>
  );
}