/* src/components/portal/core/PortalHeader.tsx */
'use client';

import { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from './theme'; // 🚀 Importing the Theme Engine

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [contactEmail, setContactEmail] = useState('Initializing...');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  
  // 🚀 Fetch the dynamic theme
  const currentTheme = getPortalTheme(clientId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setContactEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-end px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className={`p-2 text-zinc-500 ${currentTheme.hoverText} transition-colors relative`}>
          <Bell className="w-5 h-5" />
          {/* 🚀 Using bg-current to dynamically inherit the text color for the background! */}
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${currentTheme.text} bg-current shadow-sm`}></span>
        </button>
        
        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-700">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-sm font-medium text-zinc-400 mr-2 hidden md:block">
            {contactEmail}
          </span>
          
          <button 
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-md text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut size={14} />
            {isLoggingOut ? PORTAL_COPY.header.signingOut : PORTAL_COPY.header.signOut}
          </button>
        </div>

      </div>
    </header>
  );
}