/* src/app/dashboard/project/[id]/page.tsx */
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { ArrowLeft, Activity, Calendar, LayoutTemplate, Briefcase, Coins, CheckCircle2, Bug, Sparkles, MessageSquare, Plus, Globe, Repeat, Handshake } from 'lucide-react';

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeSector, setActiveSector] = useState<'FEATURES' | 'STOREFRONT' | 'FUNDING' | 'CONTRACT'>('FEATURES');

  const fetchBoard = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data) {
      // Ensure arrays fall back safely if legacy data exists
      if (!Array.isArray(data.compensation_types)) {
        data.compensation_types = data.compensation_type ? [data.compensation_type] : ['FIXED'];
      }
      setProject(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-bg-app flex items-center justify-center font-mono text-brand-primary uppercase tracking-widest text-sm animate-pulse">Initializing Workspace...</div>;
  if (!project) return <div className="min-h-screen bg-bg-app flex items-center justify-center font-mono text-red-500 uppercase tracking-widest text-sm">Project Not Found</div>;

  const compTypes = project.compensation_types || [];
  const compDetails = project.compensation_details || {};

  return (
    <div className="min-h-screen bg-bg-app flex flex-col font-sans text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-stardust pointer-events-none opacity-50" />
      
      {/* HEADER: GLOBAL METADATA */}
      <header className="h-24 border-b border-white/5 bg-bg-app/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/foundation" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-brand-primary/20 hover:text-brand-primary border border-white/10 hover:border-brand-primary/30 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-black uppercase tracking-tight">{project.title || project.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                project.status === 'DEPLOYED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
              }`}>
                {project.status || 'DRAFTING'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20">
                {project.type || 'UNKNOWN'}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400 font-mono uppercase tracking-wider">
               <span className="flex items-center gap-2"><Calendar size={14}/> Due: {project.due_date || 'TBD'}</span>
               <span className="flex items-center gap-2"><UserIcon /> Client: {project.client_name || 'Internal Build'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
             <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Engine Stability</div>
             <div className="flex items-center gap-3">
               <div className="w-40 h-2 bg-black rounded-full overflow-hidden border border-slate-800">
                 <div className="h-full bg-brand-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${project.progress || 0}%` }} />
               </div>
               <span className="text-sm font-black text-white w-8">{project.progress || 0}%</span>
             </div>
          </div>
          <button className="h-10 px-6 bg-brand-primary text-black hover:bg-white transition-all rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            <Activity size={16} /> Update Status
          </button>
        </div>
      </header>

      {/* SECTOR NAVIGATION TABS */}
      <div className="px-8 border-b border-white/5 bg-black/40 flex gap-8 font-mono text-[10px] uppercase tracking-widest font-bold shrink-0">
        <button onClick={() => setActiveSector('FEATURES')} className={`py-4 flex items-center gap-2 border-b-2 transition-colors ${activeSector === 'FEATURES' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <MessageSquare size={14} /> Features & Bugs
        </button>
        <button onClick={() => setActiveSector('STOREFRONT')} className={`py-4 flex items-center gap-2 border-b-2 transition-colors ${activeSector === 'STOREFRONT' ? 'border-fuchsia-400 text-fuchsia-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <LayoutTemplate size={14} /> Storefront Blueprint
        </button>
        <button onClick={() => setActiveSector('FUNDING')} className={`py-4 flex items-center gap-2 border-b-2 transition-colors ${activeSector === 'FUNDING' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <Coins size={14} /> Funding & Splits
        </button>
        <button onClick={() => setActiveSector('CONTRACT')} className={`py-4 flex items-center gap-2 border-b-2 transition-colors ${activeSector === 'CONTRACT' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
          <Briefcase size={14} /> Client Desk
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-8 relative z-0">
        
        {/* SECTOR 1: FEATURES & BUGS */}
        {activeSector === 'FEATURES' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-8">
              <h2 className="text-lg font-black uppercase tracking-widest mb-1 text-brand-primary">Continuous Integration</h2>
              <p className="text-xs text-slate-400 font-mono">Track client feature requests for future upsells, and log system bugs for patching.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Feature Requests Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2"><Sparkles size={16} className="text-brand-primary" /> Feature Pipeline</h3>
                  <button className="text-brand-primary hover:text-white transition-colors"><Plus size={16} /></button>
                </div>
                <div className="bg-black/60 border border-slate-800 hover:border-brand-primary/50 rounded-2xl p-5 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 uppercase tracking-widest">Requested</span>
                    <span className="text-[10px] text-slate-500 font-mono">Phase 2 Upsell</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">Automated Inventory Restock Alerts</h4>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed mb-4">Client wants an email notification sent to the warehouse manager when stock dips below 15%.</p>
                  <button className="w-full py-2 bg-slate-900 border border-slate-800 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white rounded-lg transition-colors">Draft Proposal</button>
                </div>
              </div>

              {/* Bug Reports Column */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2"><Bug size={16} className="text-red-400" /> Bug Triage</h3>
                  <button className="text-red-400 hover:text-white transition-colors"><Plus size={16} /></button>
                </div>
                <div className="bg-black/60 border border-slate-800 hover:border-red-500/50 rounded-2xl p-5 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 uppercase tracking-widest">Active</span>
                    <span className="text-[10px] text-slate-500 font-mono">Critical</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">Stripe Webhook Timeout</h4>
                  <p className="text-xs text-slate-400 font-mono leading-relaxed mb-4">Checkout sessions are taking longer than 10s to verify, causing duplicate ledger entries.</p>
                  <button className="w-full py-2 bg-slate-900 border border-slate-800 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white rounded-lg transition-colors">Mark as Resolved</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTOR 2: STOREFRONT BLUEPRINT */}
        {activeSector === 'STOREFRONT' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest mb-1 text-fuchsia-400">Storefront Blueprint</h2>
                <p className="text-xs text-slate-400 font-mono">Configure the architecture for this product's dedicated public page.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-colors">
                <Globe size={14} /> Enable Dedicated Page Route
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/60 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-800 pb-2">1. The Hero Section</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 block">Status Badge</label>
                      <input type="text" className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-fuchsia-400 outline-none" placeholder="e.g., CURRENTLY BUILDING • SECTOR 01" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 block">Hero Title</label>
                      <input type="text" className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-fuchsia-400 outline-none" placeholder="BUILT FOR THE SMALL BUSINESS..." />
                    </div>
                 </div>
              </div>

              <div className="bg-black/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
                 <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 mb-6 border-b border-slate-800 pb-2">2. Command Center Tabs</h3>
                 <div className="flex-1 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 flex flex-col items-center justify-center p-8 text-center">
                    <LayoutTemplate className="text-slate-600 mb-4" size={32} />
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Connect specific modules to your UI tabs</p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 border border-fuchsia-400/30 px-6 py-3 rounded-lg hover:bg-fuchsia-400 hover:text-black transition-colors w-full">
                      + Configure UI Tabs
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTOR 3: HYBRID FUNDING & SPLITS */}
        {activeSector === 'FUNDING' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-lg font-black uppercase tracking-widest mb-1 text-amber-400">Hybrid Deal Engine</h2>
                <p className="text-xs text-slate-400 font-mono">Active compensation models for this build.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* FIXED CAPITAL BLOCK */}
              {compTypes.includes('FIXED') && (
                <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Coins size={64} className="text-amber-500" /></div>
                   <div className="text-[10px] font-mono text-amber-400 bg-amber-500/10 inline-block px-2 py-1 rounded border border-amber-500/20 uppercase tracking-widest mb-4">Fixed Capital • {compDetails.fixed_schedule || 'UPFRONT'}</div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Target Total</div>
                       <div className="text-3xl font-black text-white">${(project.target_amount || 0).toLocaleString()}</div>
                     </div>
                     <div>
                       <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Tax/Platform Hold (15%)</div>
                       <div className="text-xl font-bold text-red-400">-${(project.target_amount * 0.15 || 0).toLocaleString()}</div>
                     </div>
                   </div>
                </div>
              )}

              {/* REVENUE SHARE BLOCK */}
              {compTypes.includes('REV_SHARE') && (
                <div className="bg-black/60 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Repeat size={64} className="text-emerald-500" /></div>
                   <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 inline-block px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest mb-4">Revenue Share • {compDetails.rev_trigger?.replace('_', ' ') || 'ACTIVE'}</div>
                   <div>
                     <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Platform Cut</div>
                     <div className="text-3xl font-black text-white">
                        {compDetails.rev_type === 'PERCENTAGE' ? `${compDetails.rev_amount || 0}%` : `$${compDetails.rev_amount || 0}`}
                     </div>
                     <p className="text-[10px] text-slate-400 font-mono mt-2">Deducted automatically {compDetails.rev_trigger === 'PER_TRANSACTION' ? 'per transaction' : 'from gross sales'}.</p>
                   </div>
                </div>
              )}

              {/* VALUE BARTER BLOCK */}
              {compTypes.includes('BARTER') && (
                <div className="bg-black/60 border border-fuchsia-500/20 rounded-2xl p-6 lg:col-span-full relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Handshake size={64} className="text-fuchsia-500" /></div>
                   <div className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-500/10 inline-block px-2 py-1 rounded border border-fuchsia-500/20 uppercase tracking-widest mb-4">Value Trade • {compDetails.barter_category?.replace('_', ' ') || 'ACTIVE'}</div>
                   <div>
                     <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">Trade Contract Terms</div>
                     <p className="text-sm text-slate-300 leading-relaxed font-mono bg-black/50 p-4 rounded-xl border border-slate-800">
                        {project.barter_terms || 'No terms defined.'}
                     </p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTOR 4: CLIENT DESK */}
        {activeSector === 'CONTRACT' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="mb-8 text-center">
                <Briefcase size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
                <h2 className="text-2xl font-black uppercase tracking-widest mb-2 text-emerald-400">The Deal Desk</h2>
                <p className="text-sm text-slate-400 font-mono">Draft the final proposal based on your Hybrid Funding model.</p>
             </div>

             <div className="bg-black/60 border border-slate-800 rounded-3xl p-10 text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest mb-6">
                  <CheckCircle2 size={14} /> Ready for Conversion
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Initialize Hybrid Contract Protocol</h3>
                <p className="text-slate-500 text-sm mb-8 max-w-lg mx-auto">
                  This will generate a secure contract combining your <strong>Fixed Capital</strong>, <strong>Rev Share</strong>, and <strong>Barter</strong> agreements into one unified proposal.
                </p>
                <button className="bg-emerald-500 text-black font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
                  Draft Master Proposal
                </button>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

function UserIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}