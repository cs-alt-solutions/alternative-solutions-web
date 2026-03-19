/* src/app/dashboard/layout.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import NavItem from '@/components/core/NavItem';
import { 
  LayoutDashboard, Settings, Search, Bell, 
  Cpu, ShieldCheck, Ticket, Inbox, FileText, Mic, CalendarDays, Rocket, Database,
  Menu, X, ShieldAlert, Package 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const betaCopy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND;
  const ecosystemCopy = WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER;

  // STATE: Controls the mobile sidebar drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // STRICT ROUTING LOGIC: Prevents header mismatches
  const getPageTitle = () => {
    if (pathname === '/dashboard/broadcast') return sidebarCopy.BROADCAST;
    if (pathname === '/dashboard/tasks') return sidebarCopy.TASKS;
    if (pathname === '/dashboard/foundation') return sidebarCopy.FOUNDATION;
    if (pathname === '/dashboard/infrastructure') return "INFRASTRUCTURE";
    if (pathname === '/dashboard/beta-command') return betaCopy.TITLE;
    if (pathname === '/dashboard/ecosystem') return ecosystemCopy.TITLE;
    if (pathname === '/dashboard') return overviewCopy.TITLE;
    return "SYSTEM COMMAND";
  };

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden relative">
      
      {/* THE MOBILE OVERLAY (Darkens background when menu is open) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* THE SIDEBAR (Static on Desktop, Sliding Drawer on Mobile) */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 border-r border-white/5 bg-bg-app flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
           <div className="flex items-center">
             <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
             <span className="font-bold tracking-tight uppercase text-xs text-white">{commonCopy.BRAND_VERSION}</span>
           </div>
           
           {/* MOBILE CLOSE BUTTON */}
           <button onClick={closeMobileMenu} className="md:hidden text-white/40 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar" onClick={closeMobileMenu}>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">
            {sidebarCopy.GROUPS.COMMAND}
          </div>
          <Link href="/dashboard">
            <NavItem icon={LayoutDashboard} label={sidebarCopy.OVERVIEW} active={pathname === '/dashboard'} />
          </Link>

          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.OPERATIONS}
          </div>
          <Link href="/dashboard/foundation">
             <NavItem icon={Rocket} label={sidebarCopy.FOUNDATION} active={pathname === '/dashboard/foundation'} />
          </Link>
          
          {/* THE FORGE / ECOSYSTEM MANAGER */}
          <Link href="/dashboard/ecosystem">
             <NavItem icon={Package} label="Ecosystem" active={pathname === '/dashboard/ecosystem'} />
          </Link>

          {/* BETA COMMAND */}
          <Link href="/dashboard/beta-command">
             <NavItem icon={ShieldAlert} label={betaCopy.TITLE} active={pathname === '/dashboard/beta-command'} />
          </Link>
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.STUDIO}
          </div>
          <Link href="/dashboard/tasks">
            <NavItem icon={CalendarDays} label={sidebarCopy.TASKS} active={pathname === '/dashboard/tasks'} />
          </Link>
          <Link href="/dashboard/broadcast">
            <NavItem icon={Mic} label={sidebarCopy.BROADCAST} active={pathname === '/dashboard/broadcast'} />
          </Link>
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.SYSTEM}
          </div>
          
          <Link href="/dashboard/infrastructure">
            <NavItem icon={Database} label="Infrastructure" active={pathname === '/dashboard/infrastructure'} />
          </Link>
          <NavItem icon={Cpu} label={sidebarCopy.AGENTS} />
          <NavItem icon={Settings} label={sidebarCopy.CONFIG} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
           <Link href="/" className="text-[10px] text-text-muted hover:text-white transition-colors flex items-center gap-2 font-mono uppercase">
             {sidebarCopy.EXIT}
           </Link>
        </div>
      </aside>

      {/* THE MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        
        {/* THE TOP HEADER */}
        <header className="h-16 border-b border-white/5 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
           <div className="flex items-center gap-3 md:gap-4">
             {/* THE MOBILE HAMBURGER MENU */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden text-white/60 hover:text-white transition-colors p-1"
             >
               <Menu size={22} />
             </button>
             
             <h1 className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/80 truncate max-w-37.5 sm:max-w-none">
               {getPageTitle()}
             </h1>
             
             {/* Hide the "System Online" badge on tiny screens to save space */}
             <span className="hidden sm:flex px-2 py-0.5 rounded text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-mono">
               {commonCopy.STATUS_ONLINE}
             </span>
           </div>
           
           <div className="flex items-center gap-4 md:gap-6">
             <button className="relative text-white/60 hover:text-white transition-colors">
               <Bell size={18} />
               <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand-accent rounded-full border border-black"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-[linear-gradient(to_bottom_right,var(--brand-primary),var(--brand-secondary))] border border-white/20 shadow-inner"></div>
           </div>
        </header>

        {/* THE SCROLLING PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto relative z-0">
           {children}
        </div>
      </main>
      
    </div>
  );
}