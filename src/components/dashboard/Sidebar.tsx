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
  Briefcase,
  TestTube,
  CheckSquare,
  Server
} from 'lucide-react';
import { DASHBOARD_COPY } from '@/config/dashboard';

export default function Sidebar() {
  const pathname = usePathname();
  const copy = DASHBOARD_COPY.SIDEBAR;

  // TOP LEVEL (Anchor)
  const topItem = { name: copy.OVERVIEW || 'HOME', href: '/dashboard', icon: LayoutDashboard };

  // CORE GROUPS
  const navGroups = [
    {
      label: copy.GROUPS?.WORKSPACE || 'MY WORKSPACE', 
      items: [
        { name: copy.FOUNDATION || 'FOUNDATION', href: '/dashboard/foundation', icon: Construction },
        { name: copy.ECOSYSTEM_MANAGER || 'ECOSYSTEM', href: '/dashboard/ecosystem', icon: Box },
        { name: copy.BROADCAST || 'BROADCAST', href: '/dashboard/broadcast', icon: Radio },
      ]
    },
    {
      label: copy.GROUPS?.HUMAN_MANAGEMENT || 'HUMAN MANAGEMENT', 
      items: [
        { name: copy.MEMBERS || 'MEMBERS & ACCESS', href: '/dashboard/members', icon: Users },
        { name: copy.CLIENTS || 'CLIENT HQ', href: '/dashboard/clients', icon: Briefcase },
        { name: copy.BETA_COMMAND || 'BETA COMMAND', href: '/dashboard/beta-command', icon: TestTube },
      ]
    },
    {
      label: copy.GROUPS?.LOGISTICS || 'LIFE & LOGISTICS', 
      items: [
        { name: copy.TASKS || 'TASKS', href: '/dashboard/tasks', icon: CheckSquare },
        { name: copy.LEDGER || 'LEDGER', href: '/dashboard/ledger', icon: Wallet },
        { name: copy.INFRASTRUCTURE || 'INFRASTRUCTURE', href: '/dashboard/infrastructure', icon: Server },
      ]
    }
  ];

  // SYSTEM ADMIN
  const adminItems = [
    { name: copy.CONFIG || 'SETTINGS', href: '/dashboard/settings', icon: Settings },
  ];

  const renderLink = (item: any) => {
    // Exact match for home, startsWith for subpages
    const isActive = item.href === '/dashboard' 
      ? pathname === '/dashboard' 
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
      
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
  };

  return (
    <aside className="w-64 bg-bg-surface-100 border-r border-white/5 h-screen flex flex-col md:flex">
      {/* BRANDING */}
      <div className="p-8 pb-4">
        <div className="text-xl font-black text-white italic tracking-tighter uppercase">
          Alt Solutions
        </div>
        <p className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] mt-1">
          V1.0.4 ARCHITECT
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto pb-6">
        
        {/* TOP LEVEL - HOME */}
        <div className="space-y-1 px-4 mt-2">
          {renderLink(topItem)}
        </div>

        {/* MAPPED GROUPS */}
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {/* The New Sharp Architect Header */}
            <div className="mb-3 border-l-[3px] border-brand-primary/60 bg-linear-to-r from-brand-primary/10 to-transparent px-5 py-1.5">
              <h3 className="text-[10px] font-mono font-black text-brand-primary uppercase tracking-[0.2em]">
                {group.label}
              </h3>
            </div>
            {/* Indented Items */}
            <div className="space-y-1 px-4">
              {group.items.map(renderLink)}
            </div>
          </div>
        ))}
      </nav>

      {/* SYSTEM ADMIN BOTTOM BAR */}
      <div className="pt-4 pb-6 border-t border-white/5 space-y-4 bg-bg-surface-200/30">
        <div>
          {/* Purple Admin Header */}
          <div className="mb-3 border-l-[3px] border-purple-500/60 bg-linear-to-r from-purple-500/10 to-transparent px-5 py-1.5">
            <h3 className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-[0.2em] opacity-90">
              {copy.GROUPS?.SYSTEM || 'System Admin'}
            </h3>
          </div>
          
          <div className="space-y-1 px-4">
            {adminItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

        <div className="px-4">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-orange-500/70 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-colors border border-transparent hover:border-orange-500/20"
          >
            <LogOut size={18} /> {copy.EXIT || 'EXIT SYSTEM'}
          </Link>
        </div>
      </div>
    </aside>
  );
}