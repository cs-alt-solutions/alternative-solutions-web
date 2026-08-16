/* src/components/portal/core/PortalSidebar.tsx */
'use client';

import { useState, useEffect } from 'react';
import { Box, Settings, MessageSquare, TerminalSquare, Menu, X, ArrowLeft, Store, CreditCard, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { PORTAL_COPY } from '@/config/clients/portal'; 
import { getPortalTheme } from './theme'; // 🚀 Importing your new Design System!

export default function PortalSidebar({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchWorkspace, setShowSwitchWorkspace] = useState(false);
  
  const [brandData, setBrandData] = useState<{ logo: string | null, name: string }>({ logo: null, name: PORTAL_COPY.sidebar.title });

  // 🚀 One line of code grabs all the correct colors!
  const currentTheme = getPortalTheme(clientId);

  useEffect(() => {
    const initSidebar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const { data: workspaces } = await supabase
          .from('storefronts')
          .select('status, is_template')
          .eq('contact_email', user.email);

        const activeCount = workspaces?.filter(s => (s.status === 'ACTIVE' || s.status === 'LIVE') && !s.is_template).length || 0;
        if (activeCount > 1) setShowSwitchWorkspace(true);
      }

      const { data: store } = await supabase
        .from('storefronts')
        .select('business_name, brand_logo')
        .eq('id', clientId)
        .single();
        
      if (store) {
        setBrandData({ logo: store.brand_logo, name: store.business_name || PORTAL_COPY.sidebar.title });
      }
    };
    initSidebar();
  }, [clientId]);

  const navItems = [
    { name: 'Dashboard', icon: TerminalSquare, href: `/portal/${clientId}` },
    { name: 'Live Storefront', icon: Store, href: `/portal/${clientId}/storefront` },
    { name: 'Billing & Plans', icon: CreditCard, href: `/portal/${clientId}/billing` },
    { name: 'Developer Tools', icon: Box, href: `/portal/${clientId}/prototypes` },
    { name: 'Support', icon: MessageSquare, href: `/portal/${clientId}/support` },
    { name: 'Settings', icon: Settings, href: `/portal/${clientId}/settings` },
  ];

  return (
    <>
      <button 
        className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-white/5 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex flex-col px-6 py-8 border-b border-white/5 lg:mt-0 mt-14">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
            {brandData.logo ? (
              <img src={brandData.logo} alt={brandData.name} className="w-full h-full object-contain p-1" />
            ) : (
              <Building2 size={20} className="text-zinc-600" />
            )}
          </div>
          <span className="text-sm font-bold text-white tracking-wider mb-2 truncate" title={brandData.name}>
            {brandData.name}
          </span>
          {/* 🚀 Using the dynamic theme below */}
          <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border w-max ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}>
            {currentTheme.badge}
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-sm` 
                    : `text-zinc-500 border border-transparent hover:text-white hover:bg-white/5`
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {showSwitchWorkspace && (
          <div className="p-4 border-t border-white/5 bg-black/20">
            <Link 
              href="/portal"
              className="flex items-center justify-center gap-2 px-3 py-3 w-full rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{PORTAL_COPY.sidebar.switchWorkspace}</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}