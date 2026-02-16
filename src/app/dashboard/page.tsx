/* src/app/dashboard/page.tsx */
import React from 'react';
import Link from 'next/link';
import { MOCK_DB } from '@/data/store'; 
import { WEBSITE_COPY } from '@/utils/glossary';
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
  AlertCircle,
  Terminal
} from 'lucide-react';

export default function CommandConsole() {
  const sidebarCopy = WEBSITE_COPY.DASHBOARD.SIDEBAR;
  const overviewCopy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  // --- DATA PIPELINE LOGIC ---
  // 1. Beta Pipeline (Shift Studio)
  const pendingBeta = MOCK_DB.waitlist.filter(w => w.source === 'Shift Studio' && w.status === 'Pending');
  
  // 2. Agency Pipeline (Alternative Solutions)
  const agencyInquiries = MOCK_DB.waitlist.filter(w => w.source === 'Agency Inquiry' && w.status !== 'Onboarded');
  
  // 3. Internal Engineering
  const internalProjects = MOCK_DB.projects.filter(p => p.client === 'Internal');
  const openTasksCount = internalProjects.reduce((acc, p) => acc + p.tasks.filter(t => t.status !== 'Done').length, 0);

  // Combine actions for the Priority Queue
  const priorityQueue = [...pendingBeta, ...agencyInquiries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
           <span className="font-bold tracking-tight uppercase text-xs text-white">Alt // OS v1.0</span>
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
               SYSTEM ONLINE
             </span>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-primary transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search database..." 
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
             <StatCard title={overviewCopy.STATS.SYSTEM_HEALTH} value="OPTIMAL" icon={Activity} accent />
           </div>

           {/* THE SPLIT VIEW */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LEFT: Priority Action Queue */}
              <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
                  <AlertCircle size={16} className="text-orange-500" />
                  <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{overviewCopy.PANELS.ACTION_REQD}</h3>
                </div>
                <div className="flex-1 overflow-auto p-2">
                  {priorityQueue.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-white/30 uppercase">
                      {overviewCopy.EMPTY_STATE}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {priorityQueue.map(item => (
                        <div key={item.id} className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                          <div>
                            <div className="text-sm font-medium text-white mb-1">{item.email}</div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono uppercase tracking-widest ${item.source === 'Shift Studio' ? 'text-brand-primary' : 'text-emerald-400'}`}>
                                {item.source}
                              </span>
                              <span className="text-white/30 text-[10px] font-mono">• {item.date}</span>
                            </div>
                          </div>
                          {item.source === 'Shift Studio' ? (
                             <Link href="/dashboard/waitlist" className="px-3 py-1.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-mono uppercase hover:bg-brand-primary/20 transition-colors">
                               Review
                             </Link>
                          ) : (
                            <button className="px-3 py-1.5 rounded bg-white/10 text-white border border-white/20 text-[10px] font-mono uppercase hover:bg-white/20 transition-colors">
                               Intake
                             </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Engineering Bay */}
              <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-[500px]">
                <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
                  <Terminal size={16} className="text-brand-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{overviewCopy.PANELS.ENGINEERING}</h3>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-6">
                    {internalProjects.map(project => (
                      <div key={project.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <Link href={`/dashboard/project/${project.id}`} className="text-sm font-bold text-white uppercase tracking-wider hover:text-brand-primary transition-colors">
                             {project.name}
                           </Link>
                           <span className="text-[10px] font-mono text-white/50">{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-primary rounded-full relative">
                             <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" />
                           </div>
                        </div>
                        <div className="space-y-1.5">
                          {project.tasks.filter(t => t.status !== 'Done').slice(0, 3).map(task => (
                             <div key={task.id} className="flex items-center gap-3 text-xs text-white/60">
                               <div className="w-1 h-1 rounded-full bg-orange-500" />
                               {task.title}
                             </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

           </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
      active 
      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
      : 'text-white/50 hover:bg-white/5 hover:text-white'
    }`}>
      <Icon size={16} className={active ? "text-brand-primary" : "text-white/40 group-hover:text-white"} />
      {label}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accent = false }: { title: string, value: string, icon: any, accent?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border transition-all relative overflow-hidden group ${
      accent 
      ? 'bg-brand-primary/5 border-brand-primary/30' 
      : 'bg-bg-app border-white/5 hover:border-white/10'
    }`}>
      {accent && <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-primary/10 blur-2xl rounded-full" />}
      <div className="flex justify-between items-start mb-4">
         <h4 className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{title}</h4>
         <Icon size={16} className={accent ? "text-brand-accent" : "text-white/20 group-hover:text-white/40 transition-colors"} />
      </div>
      <div className="text-2xl font-black text-white tracking-tight">{value}</div>
    </div>
  );
}