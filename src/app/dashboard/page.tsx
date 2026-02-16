/* src/app/dashboard/page.tsx */
import React from 'react';
import Link from 'next/link';
import { MOCK_DB } from '@/data/store'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import NavItem from '@/components/core/NavItem';
import StatCard from '@/components/core/StatCard';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import TelemetryPanel from '@/components/workspace/TelemetryPanel';
import DailyDirectivePanel, { DirectiveItem } from '@/components/workspace/DailyDirectivePanel';
import NetworkPulse from '@/components/workspace/NetworkPulse';
import { 
  LayoutDashboard, CheckSquare, Users, Settings, Search, Bell, Cpu, ShieldCheck, Activity, Ticket, Inbox, FileText, Terminal 
} from 'lucide-react';

export default function CommandConsole() {
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // 1. Beta Noise (Pulse)
  const pendingBeta = MOCK_DB.waitlist.filter(w => w.source === 'Shift Studio' && w.status === 'Pending');
  
  // 2. Heavy Lifting (Directive)
  const agencyInquiries = MOCK_DB.waitlist.filter(w => w.source === 'Agency Inquiry' && w.status !== 'Onboarded');
  const internalProjects = MOCK_DB.projects.filter(p => p.client === 'Internal');
  
  const generatedDirectives: DirectiveItem[] = [];
  agencyInquiries.forEach(lead => {
    generatedDirectives.push({ id: lead.id, type: 'LEAD', title: lead.email, subtitle: `Agency Lead: ${lead.date}`, link: '/dashboard/intake' });
  });
  internalProjects.forEach(project => {
    project.tasks.filter(t => t.status === 'In Progress').forEach(task => {
      generatedDirectives.push({ id: task.id, type: 'TASK', title: task.title, subtitle: `Dev: ${project.name}`, link: `/dashboard/project/${project.id}` });
    });
  });

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden relative">
      <NetworkPulse feed={pendingBeta} copy={overviewCopy.LIVE_FEED} />

      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5 text-white font-bold uppercase text-xs">
           {commonCopy.BRAND_VERSION}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={LayoutDashboard} label={sidebarCopy.OVERVIEW} active />
          <Link href="/dashboard/waitlist"><NavItem icon={Ticket} label={sidebarCopy.WAITLIST} /></Link>
          <NavItem icon={Inbox} label={sidebarCopy.INTAKE} />
          <NavItem icon={FileText} label={sidebarCopy.AUDITS} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 p-8 overflow-y-auto">
        <DailyDirectivePanel items={generatedDirectives.slice(0, 5)} copy={overviewCopy.DIRECTIVE} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <StatCard title={overviewCopy.STATS.BETA_PENDING} value={pendingBeta.length} icon={Ticket} />
           <StatCard title={overviewCopy.STATS.SYSTEM_HEALTH} value={commonCopy.HEALTH_OPTIMAL} icon={Activity} accent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
           <PriorityQueuePanel queue={pendingBeta} copy={overviewCopy.PANELS} commonCopy={commonCopy} />
           <EngineeringPanel projects={internalProjects} copy={overviewCopy.PANELS} />
        </div>
        
        <TelemetryPanel copy={overviewCopy.TELEMETRY} />
      </main>
    </div>
  );
}