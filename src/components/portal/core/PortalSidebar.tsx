/* src/components/portal/core/PortalSidebar.tsx */
'use client';

import { useState, useEffect } from 'react';
import { FileUp, Box, Settings, MessageSquare, TerminalSquare, Menu, X, ArrowLeft, Store, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';

// 1. Define our visual themes
const THEMES = {
  client: {
    badge: 'ACTIVE CLIENT',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    hoverText: 'hover:text-cyan-400',
  },
  beta: {
    badge: 'BETA PARTNER',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    hoverText: 'hover:text-purple-400',
  },
  internal: {
    badge: 'INTERNAL STAFF',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    hoverText: 'hover:text-emerald-400',
  }
};

export default function PortalSidebar({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showSwitchWorkspace, setShowSwitchWorkspace] = useState(false);

  // Check if they have multiple workspaces so we can hide/show the Switch button
  useEffect(() => {
    const checkWorkspaceCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) return;

      const { data } = await supabase
        .from('storefronts')
        .select('status, is_template')
        .eq('contact_email', user.email);

      // Count only active/live ones that aren't prototypes
      const activeCount = data?.filter(s => (s.status === 'ACTIVE' || s.status === 'LIVE') && !s.is_template).length || 0;
      
      if (activeCount > 1) {
        setShowSwitchWorkspace(true);
      }
    };
    checkWorkspaceCount();
  }, []);

  // 2. Temporarily hardcode the logic to determine the tier
  let tier: 'client' | 'beta' | 'internal' = 'client';
  if (clientId === 'luckystrike') tier = 'beta';
  if (clientId === 'division') tier = 'internal'; 

  const currentTheme = THEMES[tier];

  // 3. The Upgraded Navigation Array
  const navItems = [
    { name: 'Dashboard', icon: TerminalSquare, href: `/portal/${clientId}` },
    { name: 'Live Storefront', icon: Store, href: `/portal/${clientId}/storefront` },
    { name: 'Billing & Plans', icon: CreditCard, href: `/portal/${clientId}/billing` },
    // 🚀 Removed Secure Transfer from the sidebar
    { name: 'Developer Tools', icon: Box, href: `/portal/${clientId}/prototypes` },
    { name: 'Support', icon: MessageSquare, href: `/portal/${clientId}/support` },
    { name: 'Settings', icon: Settings, href: `/portal/${clientId}/settings` },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo & Tier Badge Area */}
        <div className="flex flex-col justify-center px-6 py-6 border-b border-slate-800 lg:mt-0 mt-14">
          <span className="text-xl font-bold text-white tracking-widest mb-1">PORTAL</span>
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full w-max ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
            {currentTheme.badge}
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? `${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}` 
                    : `text-slate-400 hover:text-white hover:bg-slate-800/50 ${currentTheme.hoverText}`
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- SMART SWITCH WORKSPACE BUTTON --- */}
        {showSwitchWorkspace && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/30">
            <Link 
              href="/portal"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Switch Workspace</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}