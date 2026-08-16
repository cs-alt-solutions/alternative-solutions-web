/* src/components/portal/layout/PortalHeader.tsx */
'use client';

import { useEffect, useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [workspaceName, setWorkspaceName] = useState('Loading...');
  const [contactEmail, setContactEmail] = useState('Initializing...');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

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

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
  };

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
          <span className="text-sm font-medium text-slate-300 mr-2 truncate max-w-[150px]">
            {contactEmail}
          </span>
          
          <button 
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-md text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut size={14} />
            {isLoggingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
        </div>
      </div>
    </header>
  );
}