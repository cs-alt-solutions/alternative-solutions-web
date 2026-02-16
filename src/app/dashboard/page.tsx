/* src/app/dashboard/page.tsx */
import React from 'react';
import Link from 'next/link';
import { MOCK_DB } from '@/data/store'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import NavItem from '@/components/core/NavItem';
import StatCard from '@/components/core/StatCard';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Cpu,
  ShieldCheck,
  Activity,
  Ticket,
  Inbox,
  FileText,
  Terminal
} from 'lucide-react';

export default function CommandConsole() {
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // --- DATA PIPELINE LOGIC ---
  const pendingBeta = MOCK_DB.waitlist.filter(w => w.source === 'Shift Studio' && w.status === 'Pending');
  const agencyInquiries = MOCK_DB.waitlist.filter(w => w.source === 'Agency Inquiry' && w.status !== 'Onboarded');
  const internalProjects = MOCK_DB.projects.filter(p => p.client === 'Internal');
  const openTasksCount = internalProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.status !== 'Done').length, 0);

  const priorityQueue = [...pendingBeta, ...agencyInquiries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
           <span className="font-bold tracking-tight uppercase text-xs text-white">{commonCopy.BRAND_VERSION}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">
            {sidebarCopy.MODULES_HEADER}
          </div>
          <Link href="/dashboard" className="block">
            <NavItem icon={LayoutDashboard} label={sidebarCopy.OVERVIEW} active />
          </Link>
          
          <Link href="/dashboard/waitlist" className="block">
             <NavItem icon={Ticket} label={sidebarCopy.WAITLIST} />
          </Link>
          
          <NavItem icon={Inbox} label={sidebarCopy.INTAKE} />
          <NavItem icon={FileText} label={sidebarCopy.AUDITS} />
          <NavItem icon={CheckSquare} label={sidebarCopy.TASKS} />
          <NavItem icon={Users} label={sidebarCopy.CLIENTS} />
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-6">
            {sidebarCopy.SYSTEM_HEADER}
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

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative">
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
             <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary border border-white/20 shadow-inner"></div>
           </div>
        </header>

        <div className="p-8 overflow-y-auto relative z-0">
           
           {/* THE HUD */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <StatCard title={overviewCopy.STATS.BETA_PENDING} value={pendingBeta.length.toString()} icon={Ticket} />
             <StatCard title={overviewCopy.STATS.AGENCY_LEADS} value={agencyInquiries.length.toString()} icon={Inbox} />
             <StatCard title={overviewCopy.STATS.DEV_TASKS} value={openTasksCount.toString()} icon={Terminal} />
             <StatCard title={overviewCopy.STATS.SYSTEM_HEALTH} value={commonCopy.HEALTH_OPTIMAL} icon={Activity} accent />
           </div>

           {/* THE SPLIT VIEW */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriorityQueuePanel queue={priorityQueue} copy={overviewCopy.PANELS} commonCopy={commonCopy} />
              <EngineeringPanel projects={internalProjects} copy={overviewCopy.PANELS} />
           </div>

        </div>
      </main>
    </div>
  );
}