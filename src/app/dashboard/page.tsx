/* src/app/dashboard/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import StatCard from '@/components/core/StatCard';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import TelemetryPanel from '@/components/workspace/TelemetryPanel';
import { Project, WaitlistEntry } from '@/data/store'; 
import { Ticket, Inbox, Terminal, Activity } from 'lucide-react';

export default async function CommandConsole() {
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // --- DATA PIPELINE WITH ERROR BOUNDARIES ---
  let waitlist: WaitlistEntry[] = [];
  let projects: Project[] = [];

  try {
    const [ { data: waitlistData }, { data: projectsData } ] = await Promise.all([
      supabase.from('waitlist').select('*').order('date', { ascending: false }),
      supabase.from('projects').select('*, tasks(*)') 
    ]);
    
    // ARMOR: Boolean filter removes any nulls or undefineds before they hit state
    waitlist = (waitlistData as WaitlistEntry[] || []).filter(Boolean);
    projects = (projectsData as Project[] || []).filter(Boolean);
  } catch (error) {
    console.error("CRITICAL: Dashboard Data Pipeline Failure", error);
  }

  // LOGIC SEGMENTATION
  const pendingBeta = waitlist.filter(w => 
    w && (w.source === 'Shift Studio' || w.source === 'Restricted Access') && w.status === 'Pending'
  );
  
  const agencyInquiries = waitlist.filter(w => 
    w && w.source === 'Agency Inquiry' && w.status !== 'Onboarded'
  );
  
  const internalProjects = projects.filter(p => p && p.client === 'Internal');
  
  const openTasksCount = internalProjects.reduce((acc, p) => 
    acc + (p.tasks?.filter(t => t.status !== 'Done').length || 0), 0
  );
  
  const priorityQueue = [...pendingBeta, ...agencyInquiries].sort((a, b) => {
    const dateB = b.date || b.created_at || 0;
    const dateA = a.date || a.created_at || 0;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <div className="p-8">
       {/* TOP TELEMETRY */}
       <div className="mb-8">
          <TelemetryPanel copy={overviewCopy.TELEMETRY} />
       </div>

       {/* HIGH-LEVEL STATS */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard title={overviewCopy.STATS.BETA_PENDING} value={pendingBeta.length.toString()} icon={Ticket} />
         <StatCard title={overviewCopy.STATS.AGENCY_LEADS} value={agencyInquiries.length.toString()} icon={Inbox} />
         <StatCard title={overviewCopy.STATS.DEV_TASKS} value={openTasksCount.toString()} icon={Terminal} />
         <StatCard title={overviewCopy.STATS.SYSTEM_HEALTH} value={commonCopy.HEALTH_OPTIMAL} icon={Activity} accent />
       </div>

       {/* THE WORKSPACE GRID */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             <PriorityQueuePanel queue={priorityQueue} copy={overviewCopy.PANELS} commonCopy={commonCopy} />
          </div>
          <div className="lg:col-span-2">
             <EngineeringPanel projects={internalProjects} copy={overviewCopy.PANELS} />
          </div>
       </div>
    </div>
  );
}