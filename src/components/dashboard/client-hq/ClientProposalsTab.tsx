/* src/components/dashboard/client-hq/ClientProposalsTab.tsx */
'use client';

import React, { useState } from 'react';
import { FileSignature, Plus, FileText, CheckCircle2, Clock, Send, MoreVertical, FileDown, Edit3, ChevronLeft, Wrench, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export default function ClientProposalsTab({ clientId }: { clientId: string }) {
  const [activeProposal, setActiveProposal] = useState<any | null>(null);

  // UPGRADED DATA STRUCTURE: Phases belong INSIDE a Proposal, along with Diagnostics.
  const [proposals, setProposals] = useState([
    { 
      id: 'prop-1', 
      title: 'Infrastructure Recovery & Growth Plan', 
      totalValue: 475, 
      status: 'approved', 
      date: 'Apr 24, 2026',
      phases: [
        { id: 'p-1', title: 'Site Fix & Recovery', value: 75, note: '+ T-Shirt', status: 'completed' },
        { id: 'p-2', title: 'Phase 0: Professional Staging Environment', value: 200, note: 'Highly Suggested', status: 'approved' },
        { id: 'p-3', title: 'Phase 1: Admin Requests (Email & Backorders)', value: 50, note: '', status: 'approved' },
        { id: 'p-4', title: 'Phase 2 & 3: Shop Growth (Bikes, Hats, Stickers)', value: 150, note: '', status: 'approved' }
      ],
      diagnostics: [
        { id: 'd-1', severity: 'critical', title: 'Plugin Conflicts', desc: 'Found two SEO plugins fighting each other. This needs to be resolved to prevent future 404 crashes.' },
        { id: 'd-2', severity: 'suggested', title: 'Image Compression', desc: 'Bike build photos are massive (5MB+). A compression pass will make the gallery load 3x faster.' },
        { id: 'd-3', severity: 'monitor', title: 'Hosting Tier Limits', desc: 'Traffic is fine now, but if the new merch drop goes viral, we may need to upgrade the SiteGround server.' }
      ]
    }
  ]);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'completed': return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: ShieldCheck, text: 'Completed' };
      case 'approved': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, text: 'Approved' };
      case 'sent': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Send, text: 'Awaiting Client' };
      default: return { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', icon: Edit3, text: 'Drafting' };
    }
  };

  const getDiagnosticStyle = (severity: string) => {
    switch(severity) {
      case 'critical': return { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      case 'suggested': return { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      default: return { icon: Info, color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' };
    }
  };

  // ==========================================
  // SCREEN 2: PROPOSAL DETAIL & DIAGNOSTICS
  // ==========================================
  if (activeProposal) {
    const pStatus = getStatusConfig(activeProposal.status);
    
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        
        {/* DOCUMENT HEADER */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button onClick={() => setActiveProposal(null)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg">
            <ChevronLeft size={16} /> Back to Ledger
          </button>
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors p-2" title="Download PDF"><FileDown size={18} /></button>
            <button className="text-slate-400 hover:text-white transition-colors p-2" title="Edit"><Edit3 size={18} /></button>
          </div>
        </div>

        <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

           {/* TITLE BLOCK */}
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8 mb-8 relative z-10">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${pStatus.bg} ${pStatus.border} ${pStatus.color} text-[10px] font-black uppercase tracking-widest mb-4`}>
                  <pStatus.icon size={12} /> {pStatus.text}
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{activeProposal.title}</h2>
                <p className="text-sm font-mono text-slate-400 mt-2">Generated: {activeProposal.date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Total Authorized Value</p>
                <p className="text-4xl font-black text-brand-primary">${activeProposal.totalValue.toFixed(2)}</p>
              </div>
           </div>

           {/* THE PHASES (LINE ITEMS) */}
           <div className="mb-12 relative z-10">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
               <FileSignature size={16} className="text-brand-primary" /> Contracted Phases
             </h3>
             <div className="space-y-3">
               {activeProposal.phases.map((phase: any) => {
                 const status = getStatusConfig(phase.status);
                 return (
                   <div key={phase.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl gap-4">
                     <div>
                       <p className="text-sm font-bold text-white tracking-wide">{phase.title}</p>
                       {phase.note && <p className="text-[10px] font-mono text-amber-400 mt-1">{phase.note}</p>}
                     </div>
                     <div className="flex items-center gap-6">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${status.color}`}>{status.text}</span>
                       <span className="text-sm font-mono text-white">${phase.value.toFixed(2)}</span>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>

           {/* SYSTEM DIAGNOSTICS (THE MECHANIC'S REPORT) */}
           <div className="relative z-10 pt-8 border-t border-white/5">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Wrench size={16} className="text-amber-400" /> System Diagnostics & Findings
                 </h3>
                 <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Identified during intake. No immediate action required.</p>
               </div>
               <button className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/30 uppercase tracking-widest">
                 + Add Finding
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {activeProposal.diagnostics.map((diag: any) => {
                 const style = getDiagnosticStyle(diag.severity);
                 return (
                   <div key={diag.id} className={`p-5 rounded-xl border ${style.bg} ${style.border}`}>
                     <div className="flex items-center gap-2 mb-3">
                       <style.icon size={14} className={style.color} />
                       <h4 className={`text-xs font-bold uppercase tracking-widest ${style.color}`}>{diag.severity}</h4>
                     </div>
                     <p className="text-sm font-bold text-white mb-2">{diag.title}</p>
                     <p className="text-xs text-slate-400 leading-relaxed">{diag.desc}</p>
                   </div>
                 );
               })}
             </div>
           </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 1: PROPOSAL LEDGER (LIST VIEW)
  // ==========================================
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Contracts & Agreements</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Proposal Engine & PDF Generator</p>
        </div>
        <button className="bg-brand-primary hover:bg-cyan-400 text-bg-surface-100 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Plus size={16} /> Generate Proposal
        </button>
      </div>

      <div className="bg-bg-surface-100 border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
           <div className="col-span-5">Document Title</div>
           <div className="col-span-2">Date</div>
           <div className="col-span-2">Total Value</div>
           <div className="col-span-2">Status</div>
           <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {proposals.map((proposal) => {
            const status = getStatusConfig(proposal.status);
            
            return (
              <div 
                key={proposal.id} 
                onClick={() => setActiveProposal(proposal)}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="bg-bg-surface-200 p-2 rounded-lg text-brand-primary border border-white/5 group-hover:border-brand-primary/30 transition-colors">
                    <FileText size={16} />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide truncate group-hover:text-brand-primary transition-colors">{proposal.title}</span>
                </div>
                <div className="col-span-2 text-xs font-mono text-slate-400">{proposal.date}</div>
                <div className="col-span-2 text-sm font-bold text-white">${proposal.totalValue.toFixed(2)}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${status.bg} ${status.border} ${status.color} text-[9px] font-black uppercase tracking-widest`}>
                    <status.icon size={10} /> {status.text}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <button className="text-slate-500 hover:text-white transition-colors p-1"><MoreVertical size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}