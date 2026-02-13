/* src/app/dashboard/page.tsx */
import React from 'react';
import Link from 'next/link';
import { MOCK_DB } from '@/data/store'; // Ensure this matches your store file path
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Plus,
  Cpu,
  ShieldCheck,
  Activity,
  Ticket // <--- IMPORTED FOR WAITLIST
} from 'lucide-react';

export default function CommandConsole() {
  // Pull live data from our "Ghost DB"
  const projects = MOCK_DB.projects;

  return (
    <div className="min-h-screen bg-bg-app flex font-sans text-text-main overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 bg-bg-app flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
           <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] mr-3 animate-pulse" />
           <span className="font-bold tracking-tight uppercase text-xs text-white">Alt // OS v1.0</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-4">Modules</div>
          <NavItem icon={LayoutDashboard} label="Overview" active />
          
          {/* --- NEW WAITLIST MODULE --- */}
          <Link href="/dashboard/waitlist" className="block">
             <NavItem icon={Ticket} label="Waitlist" />
          </Link>
          {/* --------------------------- */}

          <NavItem icon={CheckSquare} label="Task Queue" />
          <NavItem icon={Users} label="Client Database" />
          
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 px-3 mt-6">System</div>
          <NavItem icon={Cpu} label="AI Agents" />
          <NavItem icon={ShieldCheck} label="Security" />
          <NavItem icon={Settings} label="Config" />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
           <Link href="/" className="text-[10px] text-text-muted hover:text-white transition-colors flex items-center gap-2 font-mono uppercase">
             ← Exit to Public Site
           </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
        
        <header className="h-16 border-b border-white/5 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center gap-4">
             <h1 className="text-sm font-bold uppercase tracking-widest text-white/80">Command Center</h1>
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
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <StatCard title="Total Projects" value={projects.length.toString()} icon={LayoutDashboard} />
             <StatCard title="System Health" value="100%" icon={Activity} accent />
             <StatCard title="Pending Tasks" value="12" icon={CheckSquare} />
             <StatCard title="Active Clients" value="1" icon={Users} />
           </div>

           <div className="bg-bg-app border border-white/5 rounded-xl overflow-hidden shadow-2xl">
             <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
               <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">Active Workflows</h3>
               <button className="btn-brand px-3 py-1.5 flex items-center gap-2 text-[10px] h-auto">
                 <Plus size={12} /> Initialize Project
               </button>
             </div>
             <div className="p-0">
               <table className="w-full text-left text-sm">
                 <thead className="bg-black/40 text-white/40 font-mono text-[10px] uppercase">
                   <tr>
                     <th className="px-6 py-3 font-normal">Project ID</th>
                     <th className="px-6 py-3 font-normal">Status</th>
                     <th className="px-6 py-3 font-normal">Health</th>
                     <th className="px-6 py-3 font-normal text-right">Progress</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {projects.map((project) => (
                     <tr key={project.id} className="hover:bg-white/2 transition-colors group"> 
                       <td className="px-6 py-4 font-medium text-white transition-colors">
                         <Link href={`/dashboard/project/${project.id}`} className="hover:text-brand-primary hover:underline underline-offset-4 decoration-brand-primary/50">
                            {project.name}
                         </Link>
                       </td>
                       <td className="px-6 py-4">
                         <Badge status={project.status} />
                       </td>
                       <td className="px-6 py-4 text-white/60 text-xs font-mono">
                         {project.priority}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <div className="w-24 ml-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-brand-primary rounded-full" 
                              style={{ width: `${project.progress}%` }} 
                           />
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
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
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all group ${
      active 
      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
      : 'text-white/50 hover:bg-white/5 hover:text-white'
    }`}>
      <Icon size={16} className={active ? "text-brand-primary" : "text-white/40 group-hover:text-white"} />
      {label}
    </button>
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

function Badge({ status }: { status: string }) {
  const styles: any = {
    "Live": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "In Dev": "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    "Pending": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${styles[status] || "bg-white/10 text-white"}`}>
      {status}
    </span>
  );
}