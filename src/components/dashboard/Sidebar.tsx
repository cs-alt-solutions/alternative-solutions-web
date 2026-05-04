/* src/components/dashboard/Sidebar.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Construction, 
  Wallet, 
  Radio, 
  Settings, 
  LogOut,
  Users,
  Box,
  Briefcase // <-- Added Briefcase icon
} from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Sidebar() {
  const pathname = usePathname();
  const copy = WEBSITE_COPY.DASHBOARD.SIDEBAR;

  // ZONE 1: THE DAILY DRIVER
  const navGroups = [
    {
      label: copy.GROUPS.COMMAND, // "My Workspace"
      items: [
        { name: copy.OVERVIEW, href: '/dashboard', icon: LayoutDashboard },
        { name: 'CLIENT HQ', href: '/dashboard/clients', icon: Briefcase }, // <-- Added the Client Directory Link
        { name: copy.FOUNDATION, href: '/dashboard/foundation', icon: Construction },
        { name: copy.ECOSYSTEM_MANAGER, href: '/dashboard/ecosystem', icon: Box },
      ]
    },
    {
      label: copy.GROUPS.OPERATIONS, // "Life & Logistics"
      items: [
        { name: copy.LEDGER, href: '/dashboard/ledger', icon: Wallet },
        { name: copy.BETA_COMMAND, href: '/dashboard/beta-command', icon: Users },
        { name: copy.BROADCAST, href: '/dashboard/broadcast', icon: Radio },
      ]
    }
  ];

  // ZONE 2: THE ENGINE ROOM
  const adminItems = [
    { name: copy.CONFIG, href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-bg-surface-100 border-r border-white/5 h-screen flex flex-col hidden md:flex">
      {/* BRANDING */}
      <div className="p-8">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">
          Alt Solutions
        </div>
        <p className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] mt-1">
          V1.0.4 ARCHITECT
        </p>
      </div>

      {/* ZONE 1: ACTIVE WORKSPACE WITH SUBCATEGORIES */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all group ${
                      isActive 
                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-brand-primary' : 'group-hover:text-white'} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ZONE 2: THE ENGINE ROOM */}
      <div className="p-4 border-t border-white/5 space-y-4 bg-bg-surface-200/30">
        <div>
           <h3 className="px-4 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest mb-3 opacity-80">
            System Admin
          </h3>
          <div className="space-y-1">
            {adminItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all group ${
                    isActive 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                      : 'text-slate-500 hover:text-purple-300 hover:bg-purple-500/5 border border-transparent'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-purple-400' : 'group-hover:text-purple-300'} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* EXIT COMPONENT */}
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-orange-500/70 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors border border-transparent hover:border-orange-500/20"
        >
          <LogOut size={18} /> {copy.EXIT}
        </Link>
      </div>
    </aside>
  );
}