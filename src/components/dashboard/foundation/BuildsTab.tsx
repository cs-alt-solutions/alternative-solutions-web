/* src/components/dashboard/foundation/BuildsTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Plus, FolderKanban } from 'lucide-react';
import NewBuildModal from './NewBuildModal';
import ProjectCard from './ProjectCard';

export default function BuildsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS;

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deployToEcosystem = async (project: any) => {
    const projectName = project.title || project.name || 'Untitled Project';

    const { error: insertError } = await supabase.from('products').insert({
      project_id: project.id,
      name: projectName,
      tagline: "Newly Deployed Prototype",
      status: 'PIPELINE',
      is_public: false,
      link_href: `/products/${projectName.toLowerCase().replace(/\s+/g, '-')}`,
      mockup_id: 'default',
      media_assets: { carousel: [] }
    });

    if (!insertError) {
      await supabase.from('projects').update({ status: 'DEPLOYED' }).eq('id', project.id);
      fetchProjects(); 
    } else {
      console.error("Failed to deploy:", insertError);
      alert("Database error: Could not deploy to Ecosystem.");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Syncing Drafting Table...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-2xl">
        <h2 className="text-sm font-mono text-slate-500 uppercase tracking-widest pl-2">{copy.TAB}</h2>
        <button 
          onClick={() => setShowNewModal(true)}
          className="group flex items-center gap-2 bg-brand-primary text-black hover:bg-white px-6 py-3 rounded-xl transition-all font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> 
          Initialize New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <FolderKanban size={48} className="text-slate-800 mb-4" />
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-6">{copy.EMPTY_STATE}</p>
          <button 
            onClick={() => setShowNewModal(true)}
            className="text-brand-primary border border-brand-primary/30 px-6 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-brand-primary/10 transition-colors"
          >
            Start First Build
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onPromote={deployToEcosystem} 
            />
          ))}
        </div>
      )}

      {/* MODAL OVERLAY */}
      {showNewModal && (
        <NewBuildModal 
          onClose={() => setShowNewModal(false)} 
          onSuccess={fetchProjects} 
        />
      )}
    </div>
  );
}