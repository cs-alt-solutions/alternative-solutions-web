/* src/components/dashboard/Sidebar.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Construction, 
  Wallet, 
  CheckSquare, 
  Radio, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Sidebar() {
  const pathname = usePathname();
  const copy = WEBSITE_COPY.DASHBOARD.SIDEBAR;

  // Organizing your tools into logical groups
  const navGroups = [
    {
      label: copy.GROUPS.COMMAND,
      items: [
        { name: copy.OVERVIEW, href: '/dashboard', icon: LayoutDashboard },
        { name: copy.FOUNDATION, href: '/dashboard/foundation', icon: Construction },
      ]
    },
    {
      label: copy.GROUPS.OPERATIONS,
      items: [
        { name: "The Ledger", href: '/dashboard/ledger', icon: Wallet }, // Your Financial Hub
        { name: copy.TASKS, href: '/dashboard/tasks', icon: CheckSquare },
        { name: copy.BROADCAST, href: '/dashboard/broadcast', icon: Radio },
      ]
    }
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

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-4">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
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

      {/* SETTINGS & EXIT */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-slate-500 hover:text-white transition-colors"
        >
          <Settings size={18} /> Settings
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-xs font-mono text-red-500/60 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} /> {copy.EXIT}
        </Link>
      </div>
    </aside>
  );
}