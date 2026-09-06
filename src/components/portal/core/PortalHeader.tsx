/* src/components/portal/core/PortalHeader.tsx */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, Settings, CreditCard, ChevronDown, HelpCircle, ShieldAlert, Check } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from './theme';
import GlobalHelp from './GlobalHelp';

export default function PortalHeader({ clientId }: { clientId: string }) {
  const [contactEmail, setContactEmail] = useState('Initializing...');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const [unreadReplies, setUnreadReplies] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currentTheme = getPortalTheme(clientId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setContactEmail(user.email);
        
        const adminEmails = [
          process.env.NEXT_PUBLIC_ADMIN_EMAIL, 
          'courtney@alternativesolutions.io', 
          'courtneysulenski@gmail.com'
        ].filter(Boolean);
        
        setIsAdminMode(adminEmails.includes(user.email));
      }
    };
    
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('id, topic, admin_reply, updated_at')
        .eq('storefront_id', clientId)
        .eq('client_read', false)
        .not('admin_reply', 'is', null)
        .order('updated_at', { ascending: false });

      if (data) setUnreadReplies(data);
    };

    fetchUser();
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clientId]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
  };

  const markAsRead = async (ticketId: string) => {
    // 1. Clear it from the local UI instantly so it feels responsive
    setUnreadReplies(prev => prev.filter(t => t.id !== ticketId));

    // 2. GHOST MODE GUARD: Only update the actual database if we are NOT impersonating
    if (!isAdminMode) {
      await supabase
        .from('support_tickets')
        .update({ client_read: true })
        .eq('id', ticketId);
    }
  };

  return (
    <>
      <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-end px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          
          <button 
            onClick={() => setIsHelpOpen(true)}
            className={`p-2 text-zinc-500 ${currentTheme.hoverText} transition-colors cursor-pointer`}
            title="Quick Start Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* NOTIFICATION BELL */}
          <div className="relative" ref={bellRef}>
            <button 
              onClick={() => setIsBellOpen(!isBellOpen)}
              className={`p-2 text-zinc-500 ${currentTheme.hoverText} transition-colors relative cursor-pointer`}
            >
              <Bell className="w-5 h-5" />
              {unreadReplies.length > 0 && (
                <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ${currentTheme.bg.replace('/10', '')} shadow-[0_0_10px_rgba(6,182,212,0.8)] border-2 border-zinc-950 animate-pulse`}></span>
              )}
            </button>

            {isBellOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/30 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Alerts</span>
                  <span className={`text-[10px] font-black ${currentTheme.text}`}>{unreadReplies.length} New</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {unreadReplies.length === 0 ? (
                    <div className="p-6 text-center text-zinc-600 text-xs font-mono uppercase tracking-widest">
                      All caught up.
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {unreadReplies.map(ticket => (
                        <div key={ticket.id} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors group">
                          <p className="text-xs font-bold text-white mb-1">{ticket.topic}</p>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                            {ticket.admin_reply}
                          </p>
                          <button 
                            onClick={() => markAsRead(ticket.id)}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-emerald-400 transition-colors"
                          >
                            <Check size={12} /> Dismiss Alert
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* USER PROFILE DROPDOWN */}
          <div className="relative pl-4 border-l border-zinc-800" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 group hover:bg-white/5 p-1 pr-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full ${isAdminMode ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-zinc-900 border-zinc-800'} flex items-center justify-center border group-hover:border-zinc-600 transition-colors`}>
                {isAdminMode ? <ShieldAlert className="w-4 h-4 text-fuchsia-400" /> : <User className="w-4 h-4 text-zinc-400" />}
              </div>
              <div className="hidden md:flex items-center gap-2">
                {isAdminMode ? (
                  <span className="text-xs font-black text-fuchsia-400 uppercase tracking-widest">
                    Admin Override
                  </span>
                ) : (
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                    {contactEmail}
                  </span>
                )}
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/30">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                    {isAdminMode ? 'Active Session' : 'Signed in as'}
                  </p>
                  <p className={`text-xs truncate ${isAdminMode ? 'text-fuchsia-400 font-bold uppercase tracking-widest' : 'text-white'}`}>
                    {isAdminMode ? 'System Architect' : contactEmail}
                  </p>
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

      <GlobalHelp 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        clientId={clientId} 
      />
    </>
  );
}