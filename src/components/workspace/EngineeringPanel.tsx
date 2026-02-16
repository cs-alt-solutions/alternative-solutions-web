/* src/components/workspace/EngineeringPanel.tsx */
import React from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { Project } from '@/data/store';

interface EngineeringPanelProps {
  projects: Project[];
  copy: any;
}

export default function EngineeringPanel({ projects, copy }: EngineeringPanelProps) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-125">
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center gap-3">
        <Terminal size={16} className="text-brand-primary" />
        <h3 className="font-bold text-xs uppercase tracking-widest text-white/80">{copy.ENGINEERING}</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {projects.map(project => (
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
  );
}