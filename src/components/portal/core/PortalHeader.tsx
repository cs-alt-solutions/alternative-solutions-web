/* src/components/portal/core/PortalHeader.tsx */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, Settings, CreditCard, ChevronDown, HelpCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from './theme';
import GlobalHelp from './GlobalHelp';

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [contactEmail, setContactEmail] = useState('Initializing...');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentTheme = getPortalTheme(clientId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setContactEmail(user.email);
      }
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-end px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          
          {/* Global Help Toggle */}
          <button 
            onClick={() => setIsHelpOpen(true)}
            className={`p-2 text-zinc-500 ${currentTheme.hoverText} transition-colors cursor-pointer`}
            title="Quick Start Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className={`p-2 text-zinc-500 ${currentTheme.hoverText} transition-colors relative`}>
            <Bell className="w-5 h-5" />
            <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${currentTheme.text} bg-current shadow-sm`}></span>
          </button>
          
          {/* User Profile & Dropdown Menu */}
          <div className="relative pl-4 border-l border-zinc-800" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 group hover:bg-white/5 p-1 pr-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600 transition-colors`}>
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                  {contactEmail}
                </span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* The Dropdown Card */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/30">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-xs text-white truncate">{contactEmail}</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link 
                    href={`/portal/${clientId}/settings`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors uppercase tracking-widest"
                  >
                    <Settings size={14} className={currentTheme.text} /> Update Profile
                  </Link>
                  <Link 
                    href={`/portal/${clientId}/billing`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors uppercase tracking-widest"
                  >
                    <CreditCard size={14} className={currentTheme.text} /> Billing & Plans
                  </Link>
                </div>

                <div className="p-2 border-t border-zinc-800/80 bg-black/20">
                  <button 
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors uppercase tracking-widest disabled:opacity-50 cursor-pointer"
                  >
                    <LogOut size={14} />
                    {isLoggingOut ? PORTAL_COPY.header.signingOut : PORTAL_COPY.header.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* The Global Help Modal is mounted here so it floats over the entire screen */}
      <GlobalHelp 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        clientId={clientId} 
      />
    </>
  );
}