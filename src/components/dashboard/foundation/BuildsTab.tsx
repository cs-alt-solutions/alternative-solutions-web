/* src/components/dashboard/foundation/BuildsTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Plus, FolderKanban, Settings, X, ShieldAlert } from 'lucide-react';
import NewBuildModal from './NewBuildModal';
import ProjectCard from './ProjectCard';

export default function BuildsTab() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [managingProject, setManagingProject] = useState<any | null>(null);
  
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

  const deleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this build? This cannot be undone.")) return;
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      fetchProjects();
    } else {
      console.error("Failed to delete:", error);
      alert("Database error: Could not delete project.");
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
              onManage={(p) => setManagingProject(p)}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      {/* NEW BUILD OVERLAY */}
      {showNewModal && (
        <NewBuildModal 
          onClose={() => setShowNewModal(false)} 
          onSuccess={fetchProjects} 
        />
      )}

      {/* UNIFIED MASTER MANAGER OVERLAY */}
      {managingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3 text-cyan-400">
                <Settings size={20} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <h2 className="font-black text-lg text-white uppercase tracking-widest">Configure Project & Portal</h2>
              </div>
              <button onClick={() => setManagingProject(null)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 rounded-full">
                <X size={16} />
              </button>
            </div>

            <form 
              className="flex flex-col flex-1 overflow-hidden"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                // Save the updates to the database
                const { error } = await supabase.from('projects').update({
                  title: formData.get('title'),
                  client_name: formData.get('client_name'),
                  target_amount: formData.get('target_amount'),
                  demo_url: formData.get('demo_url') // <-- THE HOOK!
                }).eq('id', managingProject.id);

                if (!error) {
                  setManagingProject(null);
                  fetchProjects();
                } else {
                  alert(`Error saving configuration: ${error.message}`);
                }
              }}
            >
              <div className="overflow-y-auto pr-2 space-y-8 flex-1">
                  {/* Project Details Section */}
                  <div className="space-y-4">
                    <div className="border-b border-zinc-800 pb-2 mb-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><FolderKanban size={14}/> Core Details</h3>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Project Title</label>
                      <input type="text" name="title" defaultValue={managingProject.title || managingProject.name} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>

                    {/* THE NEW VERCEL URL HOOK */}
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                      <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1 block">Live App URL (Vercel Link)</label>
                      <input type="url" name="demo_url" defaultValue={managingProject.demo_url || ''} placeholder="https://shiftstudio.alternativesolutions.io" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-cyan-900/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Client Name</label>
                        <input type="text" name="client_name" defaultValue={managingProject.client_name || ''} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Funding Target ($)</label>
                        <input type="number" name="target_amount" defaultValue={managingProject.target_amount || 0} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Portal Access Section */}
                  <div className="space-y-4">
                    <div className="border-b border-zinc-800 pb-2 mb-4">
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14}/> Sandbox Access Control</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Access Code</label>
                        <input type="text" placeholder="e.g., WELLNESS" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors uppercase tracking-widest" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Master PIN</label>
                        <input type="text" placeholder="e.g., 2026" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-amber-400 focus:outline-none focus:border-cyan-500/50 transition-colors tracking-widest" maxLength={4} />
                      </div>
                    </div>
                  </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5 mt-6 shrink-0">
                <button type="button" onClick={() => setManagingProject(null)} className="flex-1 py-3 rounded-xl font-bold text-xs text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors uppercase tracking-widest">
                  Abort
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-black text-xs text-zinc-950 bg-cyan-500 hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  Commit Changes
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}