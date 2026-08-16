'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { 
  LayoutDashboard, 
  Construction, 
  Wallet, 
  Radio, 
  Settings, 
  LogOut,
  Users,
  Box,
  Briefcase,
  TestTube,
  CheckSquare,
  Server,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DASHBOARD_COPY } from '@/config/dashboard';
import { ROUTES } from '@/utils/glossary';

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
}

export default function Sidebar({ isOpen, closeMenu }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const copy = DASHBOARD_COPY.SIDEBAR;

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  // Handle desktop collapse and broadcast state change for main layout shifting
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: { isCollapsed: newState } }));
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push(ROUTES.PUBLIC.HOME);
  };

  // TOP LEVEL (Anchor)
  const topItem = { name: copy.OVERVIEW || 'HOME', href: ROUTES.DASHBOARD.HOME, icon: LayoutDashboard };

  // CORE GROUPS
  const navGroups = [
    {
      label: copy.GROUPS?.WORKSPACE || 'MY WORKSPACE', 
      items: [
        { name: copy.FOUNDATION || 'FOUNDATION', href: ROUTES.DASHBOARD.FOUNDATION, icon: Construction },
        { name: copy.ECOSYSTEM_MANAGER || 'ECOSYSTEM', href: ROUTES.DASHBOARD.ECOSYSTEM, icon: Box },
        { name: copy.STOREFRONTS || 'STOREFRONTS', href: ROUTES.DASHBOARD.STOREFRONTS, icon: Store },
        { name: copy.BROADCAST || 'BROADCAST', href: ROUTES.DASHBOARD.BROADCAST, icon: Radio },
      ]
    },
    {
      label: copy.GROUPS?.HUMAN_MANAGEMENT || 'HUMAN MANAGEMENT', 
      items: [
        { name: copy.MEMBERS || 'MEMBERS & ACCESS', href: ROUTES.DASHBOARD.DIRECTORY, icon: Users },
        { name: copy.CLIENTS || 'CLIENT HQ', href: ROUTES.DASHBOARD.CLIENTS, icon: Briefcase },
        { name: copy.BETA_COMMAND || 'BETA COMMAND', href: ROUTES.DASHBOARD.BETA_COMMAND, icon: TestTube },
      ]
    },
    {
      label: copy.GROUPS?.LOGISTICS || 'LIFE & LOGISTICS', 
      items: [
        { name: copy.TASKS || 'TASKS', href: ROUTES.DASHBOARD.TASKS, icon: CheckSquare },
        { name: copy.LEDGER || 'LEDGER', href: ROUTES.DASHBOARD.LEDGER, icon: Wallet },
        { name: copy.INFRASTRUCTURE || 'INFRASTRUCTURE', href: ROUTES.DASHBOARD.INFRASTRUCTURE, icon: Server },
      ]
    }
  ];

  // SYSTEM ADMIN
  const adminItems = [
    { name: copy.CONFIG || 'SETTINGS', href: ROUTES.DASHBOARD.SETTINGS, icon: Settings },
  ];

  const renderLink = (item: any) => {
    const isActive = item.href === ROUTES.DASHBOARD.HOME 
      ? pathname === ROUTES.DASHBOARD.HOME 
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
      
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={closeMenu} // Auto-close on mobile when clicked
        title={isCollapsed ? item.name : undefined}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all group ${
          isCollapsed ? 'justify-center px-2' : ''
        } ${
          isActive 
            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
      >
        <item.icon size={18} className={isActive ? 'text-brand-primary shrink-0' : 'group-hover:text-white shrink-0'} />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-bg-surface-100 border-r border-white/5 h-screen flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        w-64
      `}>
        {/* BRANDING & COLLAPSE TOGGLE */}
        <div className="p-6 pb-4 flex items-center justify-between">
          {!isCollapsed ? (
            <div>
              <div className="text-xl font-black text-white italic tracking-tighter uppercase truncate">
                Alt Solutions
              </div>
              <p className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] mt-1">
                V1.0.4 ARCHITECT
              </p>
            </div>
          ) : (
            <div className="mx-auto text-lg font-black text-brand-primary italic">
              AS
            </div>
          )}
          <button
            onClick={handleToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto pb-6 overflow-x-hidden custom-scrollbar">
          <div className="space-y-1 px-3 mt-2">
            {renderLink(topItem)}
          </div>

          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              {!isCollapsed ? (
                <div className="mb-3 border-l-[3px] border-brand-primary/60 bg-linear-to-r from-brand-primary/10 to-transparent px-4 py-1.5">
                  <h3 className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em] truncate">
                    {group.label}
                  </h3>
                </div>
              ) : (
                <div className="my-2 border-t border-white/5 mx-3" />
              )}
              <div className="space-y-1 px-3">
                {group.items.map(renderLink)}
              </div>
            </div>
          ))}
        </nav>

        {/* SYSTEM ADMIN BOTTOM BAR */}
        <div className="pt-4 pb-6 border-t border-white/5 space-y-4 bg-bg-surface-200/30">
          <div>
            {!isCollapsed ? (
              <div className="mb-3 border-l-[3px] border-purple-500/60 bg-linear-to-r from-purple-500/10 to-transparent px-4 py-1.5">
                <h3 className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-[0.2em] opacity-90 truncate">
                  {copy.GROUPS?.SYSTEM || 'System Admin'}
                </h3>
              </div>
            ) : (
              <div className="my-2 border-t border-white/5 mx-3" />
            )}
            
            <div className="space-y-1 px-3">
              {adminItems.map(renderLink)}
            </div>
          </div>

          <div className="px-3">
            <button 
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title={isCollapsed ? (copy.EXIT || 'EXIT SYSTEM') : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-mono text-orange-500/70 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors border border-transparent hover:border-orange-500/20 cursor-pointer disabled:opacity-50 ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <LogOut size={18} className="shrink-0" /> 
              {!isCollapsed && <span className="truncate">{isLoggingOut ? 'EJECTING...' : copy.EXIT || 'EXIT SYSTEM'}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}