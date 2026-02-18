/* src/app/dashboard/layout.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import NavItem from '@/components/core/NavItem';
import { 
  LayoutDashboard, CheckSquare, Users, Settings, Search, Bell, 
  Cpu, ShieldCheck, Ticket, Inbox, FileText, Mic, CalendarDays 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden relative">
      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
           <span className="font-bold tracking-tight uppercase text-xs text-white">{commonCopy.BRAND_VERSION}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">
            {sidebarCopy.GROUPS.COMMAND}
          </div>
          <Link href="/dashboard" className="block">
            <NavItem icon={LayoutDashboard} label={sidebarCopy.OVERVIEW} />
          </Link>

          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.OPERATIONS}
          </div>
          <Link href="/dashboard/waitlist" className="block">
             <NavItem icon={Ticket} label={sidebarCopy.WAITLIST} />
          </Link>
          <NavItem icon={Inbox} label={sidebarCopy.INTAKE} />
          <NavItem icon={FileText} label={sidebarCopy.AUDITS} />
          <NavItem icon={Users} label={sidebarCopy.CLIENTS} />
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.STUDIO}
          </div>
          <Link href="/dashboard/tasks" className="block">
            <NavItem icon={CalendarDays} label={sidebarCopy.TASKS} />
          </Link>
          <Link href="/dashboard/broadcast" className="block">
            <NavItem icon={Mic} label={sidebarCopy.BROADCAST} />
          </Link>
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-8">
            {sidebarCopy.GROUPS.SYSTEM}
          </div>
          <NavItem icon={Cpu} label={sidebarCopy.AGENTS} />
          <NavItem icon={ShieldCheck} label={sidebarCopy.SECURITY} />
          <NavItem icon={Settings} label={sidebarCopy.CONFIG} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
           <Link href="/" className="text-[10px] text-text-muted hover:text-white transition-colors flex items-center gap-2 font-mono uppercase">
             {sidebarCopy.EXIT}
           </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
        
        <header className="h-16 border-b border-white/5 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-4">
             <h1 className="text-sm font-bold uppercase tracking-widest text-white/80">{overviewCopy.TITLE}</h1>
             <span className="px-2 py-0.5 rounded text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-mono">
               {commonCopy.STATUS_ONLINE}
             </span>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-primary transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder={commonCopy.SEARCH_PLACEHOLDER} 
                 className="bg-black/50 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand-primary/50 transition-colors w-64 text-white placeholder:text-white/20"
               />
             </div>
             <button className="relative text-white/60 hover:text-white transition-colors">
               <Bell size={18} />
               <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand-accent rounded-full border border-black"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-[linear-gradient(to_bottom_right,var(--brand-primary),var(--brand-secondary))] border border-white/20 shadow-inner"></div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-0">
           {children}
        </div>
      </main>
    </div>
  );
}