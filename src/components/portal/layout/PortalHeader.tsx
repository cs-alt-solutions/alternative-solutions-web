/* src/components/portal/layout/PortalHeader.tsx */
'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [workspaceName, setWorkspaceName] = useState('Loading...');
  const [contactEmail, setContactEmail] = useState('Initializing...');

  // Fetch the live storefront identity by immutable UUID
  useEffect(() => {
    const fetchStorefront = async () => {
      const { data, error } = await supabase
        .from('storefronts')
        .select('business_name, contact_email')
        .eq('id', clientId)
        .single();
        
      if (!error && data) {
        setWorkspaceName(data.business_name || 'My Storefront');
        setContactEmail(data.contact_email || 'Active Client');
      } else {
        setWorkspaceName('Workspace');
        setContactEmail('Client Portal');
      }
    };
    fetchStorefront();
  }, [clientId]);

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold text-white uppercase tracking-widest">
          {workspaceName}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm font-medium text-slate-300">{contactEmail}</span>
        </div>
      </div>
    </header>
  );
}