/* src/app/dashboard/layout.tsx */
'use client'; // CRITICAL: This allows the layout to react to URL changes in real-time

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import NavItem from '@/components/core/NavItem';
import { 
  LayoutDashboard, Settings, Search, Bell, 
  Cpu, ShieldCheck, Ticket, Inbox, FileText, Mic, CalendarDays 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  // SYSTEM LOGIC: Determine title based on the current active segment
  const getPageTitle = () => {
    if (pathname === '/dashboard/broadcast') return sidebarCopy.BROADCAST;
    if (pathname === '/dashboard/tasks') return sidebarCopy.TASKS;
    if (pathname === '/dashboard/waitlist') return sidebarCopy.WAITLIST;
    return overviewCopy.TITLE; // Default for /dashboard
  };

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden relative">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
           <span className="font-bold tracking-tight uppercase text-xs text-white">{commonCopy.BRAND_VERSION}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">
            {sidebarCopy.GROUPS.COMMAND}
          </div>
          <Link href="/dashboard">
            <NavItem 
              icon={LayoutDashboard} 
              label={sidebarCopy.OVERVIEW} 
              active={pathname === '/dashboard'} 
            />
          </Link>

          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.OPERATIONS}
          </div>
          <Link href="/dashboard/waitlist">
             <NavItem 
               icon={Ticket} 
               label={sidebarCopy.WAITLIST} 
               active={pathname === '/dashboard/waitlist'} 
             />
          </Link>
          <NavItem icon={Inbox} label={sidebarCopy.INTAKE} />
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.STUDIO}
          </div>
          <Link href="/dashboard/tasks">
            <NavItem 
              icon={CalendarDays} 
              label={sidebarCopy.TASKS} 
              active={pathname === '/dashboard/tasks'} 
            />
          </Link>
          <Link href="/dashboard/broadcast">
            <NavItem 
              icon={Mic} 
              label={sidebarCopy.BROADCAST} 
              active={pathname === '/dashboard/broadcast'} 
            />
          </Link>
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.SYSTEM}
          </div>
          <NavItem icon={Cpu} label={sidebarCopy.AGENTS} />
          <NavItem icon={Settings} label={sidebarCopy.CONFIG} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
           <Link href="/" className="text-[10px] text-text-muted hover:text-white transition-colors flex items-center gap-2 font-mono uppercase">
             {sidebarCopy.EXIT}
           </Link>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative z-10">
        <header className="h-16 border-b border-white/5 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-4">
             {/* THE DYNAMIC TITLE FIX */}
             <h1 className="text-sm font-bold uppercase tracking-widest text-white/80">{getPageTitle()}</h1>
             <span className="px-2 py-0.5 rounded text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-mono">
               {commonCopy.STATUS_ONLINE}
             </span>
           </div>
           
           <div className="flex items-center gap-6">
             <button className="relative text-white/60 hover:text-white transition-colors">
               <Bell size={18} />
               <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand-accent rounded-full border border-black"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-[linear-gradient(to_bottom_right,var(--brand-primary),var(--brand-secondary))] border border-white/20"></div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-0">
           {children}
        </div>
      </main>
    </div>
  );
}