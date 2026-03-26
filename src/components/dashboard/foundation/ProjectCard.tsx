/* src/components/dashboard/foundation/ProjectCard.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Settings, Beaker, Briefcase, Cpu, FolderKanban } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

interface ProjectCardProps {
  project: any;
  onPromote: (project: any) => void;
}

export default function ProjectCard({ project, onPromote }: ProjectCardProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS;
  const displayTitle = project.title || project.name || 'Untitled Project';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INTERNAL': return <Cpu size={14} />;
      case 'PROTOTYPE': return <Beaker size={14} />;
      case 'CLIENT': return <Briefcase size={14} />;
      default: return <FolderKanban size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INTERNAL': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'PROTOTYPE': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
      case 'CLIENT': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col transition-all group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded border font-mono text-[9px] uppercase tracking-widest mb-4 ${getTypeColor(project.type)}`}>
            {getTypeIcon(project.type)} {project.type || 'UNKNOWN'}
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors">
            {displayTitle}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">
            Client: {project.client_name || 'INTERNAL / SPEC'}
          </p>
        </div>
        
        {project.status === 'DEPLOYED' && (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Rocket size={14} />
          </div>
        )}
      </div>

      {/* Progress Telemetry */}
      <div className="mb-6">
        <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">
          <span>Engine Stability</span>
          <span className="text-brand-primary">{project.progress || 0}%</span>
        </div>
        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-slate-800/50">
          <div 
            className="h-full bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000" 
            style={{ width: `${project.progress || 0}%` }} 
          />
        </div>
      </div>

      {/* Financials */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-black/40 rounded-2xl p-4 border border-slate-800/50">
          <div className="text-slate-600 font-mono text-[9px] uppercase tracking-widest mb-1">{copy.CARD.TARGET}</div>
          <div className="text-white font-black text-sm">${(project.target_amount || 0).toLocaleString()}</div>
        </div>
        <div className="bg-black/40 rounded-2xl p-4 border border-slate-800/50">
          <div className="text-slate-600 font-mono text-[9px] uppercase tracking-widest mb-1">{copy.CARD.RAISED}</div>
          <div className="text-emerald-400 font-black text-sm">${(project.raised_amount || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
        <Link 
          href={`/dashboard/project/${project.id}`}
          className="flex-1 py-3 bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-2xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all flex justify-center items-center gap-2"
        >
          <Settings size={14} /> Manage
        </Link>
        
        {project.status !== 'DEPLOYED' && (
          <button 
            onClick={() => onPromote(project)}
            className="flex-1 py-3 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] rounded-2xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all flex justify-center items-center gap-2"
          >
            <Rocket size={14} /> Promote
          </button>
        )}
      </div>
    </div>
  );
}