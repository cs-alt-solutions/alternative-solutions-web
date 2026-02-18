/* src/app/dashboard/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import StatCard from '@/components/core/StatCard';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import TelemetryPanel from '@/components/workspace/TelemetryPanel';
import DailyDirectivePanel, { DirectiveItem } from '@/components/workspace/DailyDirectivePanel';
import NetworkPulse from '@/components/workspace/NetworkPulse';
import PlatformTrackerPanel from '@/components/workspace/PlatformTrackerPanel';
import { Project, WaitlistEntry } from '@/data/store'; 
import { Ticket, Inbox, Terminal, Activity } from 'lucide-react';

export default async function CommandConsole() {
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // --- LIVE DATA PIPELINE LOGIC ---
  const [ { data: waitlistData }, { data: projectsData } ] = await Promise.all([
    supabase.from('waitlist').select('*').order('date', { ascending: false }),
    supabase.from('projects').select('*, tasks(*)') 
  ]);

  // TITANIUM ARMOR: Filter out any corrupted or null database rows instantly
  const waitlist = (waitlistData as WaitlistEntry[])?.filter(Boolean) || [];
  const projects = (projectsData as Project[])?.filter(Boolean) || [];

  const pendingBeta = waitlist.filter(w => (w?.source === 'Shift Studio' || w?.source === 'Restricted Access') && w?.status === 'Pending');
  const agencyInquiries = waitlist.filter(w => w?.source === 'Agency Inquiry' && w?.status !== 'Onboarded');
  const internalProjects = projects.filter(p => p?.client === 'Internal');
  
  const openTasksCount = internalProjects.reduce((acc, p) => acc + (p?.tasks?.filter(t => t?.status !== 'Done').length || 0), 0);
  
  // SAFE SORT: Using ?. prevents the "Cannot read properties of undefined (reading 'date')" crash
  const priorityQueue = [...pendingBeta, ...agencyInquiries].sort((a, b) => {
    const dateB = b?.date || b?.created_at || 0;
    const dateA = a?.date || a?.created_at || 0;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // --- THE DAILY DIRECTIVE GENERATOR ---
  const generatedDirectives: DirectiveItem[] = [];
  agencyInquiries.forEach(lead => {
    if (!lead) return;
    const rawDate = lead?.date || lead?.created_at;
    const displayDate = rawDate ? new Date(rawDate).toLocaleDateString() : 'Recent';
    
    generatedDirectives.push({
      id: lead?.id || Math.random().toString(),
      type: 'LEAD',
      title: lead?.name || lead?.email || 'Unknown Contact',
      subtitle: `Agency Lead: ${displayDate}`,
      link: '/dashboard/intake'
    });
  });
  
  internalProjects.forEach(project => {
    if (!project) return;
    project?.tasks?.filter(t => t?.status === 'In Progress').forEach(task => {
      generatedDirectives.push({
        id: task?.id || Math.random().toString(),
        type: 'TASK',
        title: task?.title || 'Unnamed Task',
        subtitle: `Dev: ${project?.name || 'Unknown'}`,
        link: `/dashboard/project/${project?.id}`
      });
    });
  });

  return (
    <div className="p-8 relative">
       {pendingBeta.length > 0 && (
         <NetworkPulse feed={pendingBeta} copy={overviewCopy.LIVE_FEED} />
       )}
       
       <DailyDirectivePanel items={generatedDirectives.slice(0, 5)} copy={overviewCopy.DIRECTIVE} />
       
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title={overviewCopy.STATS.BETA_PENDING} value={pendingBeta.length.toString()} icon={Ticket} />
         <StatCard title={overviewCopy.STATS.AGENCY_LEADS} value={agencyInquiries.length.toString()} icon={Inbox} />
         <StatCard title={overviewCopy.STATS.DEV_TASKS} value={openTasksCount.toString()} icon={Terminal} />
         <StatCard title={overviewCopy.STATS.SYSTEM_HEALTH} value={commonCopy.HEALTH_OPTIMAL} icon={Activity} accent />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PriorityQueuePanel queue={priorityQueue} copy={overviewCopy.PANELS} commonCopy={commonCopy} />
          <EngineeringPanel projects={internalProjects} copy={overviewCopy.PANELS} />
          <PlatformTrackerPanel copy={overviewCopy.INFRASTRUCTURE} />
       </div>

       <div className="mb-8">
          <TelemetryPanel copy={overviewCopy.TELEMETRY} />
       </div>
    </div>
  );
}