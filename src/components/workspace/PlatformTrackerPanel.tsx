/* src/components/workspace/PlatformTrackerPanel.tsx */
import React from 'react';
import { Github, Triangle, Database, ExternalLink, Activity } from 'lucide-react';

export default function PlatformTrackerPanel({ copy }: { copy: any }) {
  const platforms = [
    { 
      id: 'github', 
      name: copy.PLATFORMS.GITHUB, 
      icon: Github, 
      status: 'Synced', 
      detail: 'Repo: cs-alt-solutions', 
      link: 'https://github.com/cs-alt-solutions' 
    },
    { 
      id: 'vercel', 
      name: copy.PLATFORMS.VERCEL, 
      icon: Triangle, 
      status: 'Live', 
      detail: 'Domain: alternativesolutions.io', 
      link: 'https://vercel.com/geminitwinsolutions' 
    },
    { 
      id: 'supabase', 
      name: copy.PLATFORMS.SUPABASE, 
      icon: Database, 
      status: 'Pro Plan', 
      detail: 'Status: Operational', 
      link: 'https://supabase.com' 
    }
  ];

  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-125">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-brand-primary" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{copy.TITLE}</h3>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{copy.SUBTITLE}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {platforms.map((p) => (
          <div key={p.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between group hover:border-brand-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-black/40 border border-white/10 group-hover:text-brand-primary transition-colors">
                <p.icon size={16} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">{p.name}</div>
                <div className="text-[10px] font-mono text-white/40">{p.detail}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                 {p.status}
               </span>
               <a href={p.link} target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
                 <ExternalLink size={14} />
               </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}