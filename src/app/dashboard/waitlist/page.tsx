/* src/app/dashboard/waitlist/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase'; 
import { WEBSITE_COPY } from '@/utils/glossary';
import { 
  ArrowLeft, Download, Filter, Mail, Key, X, Loader2, Users, Activity, 
  AlertTriangle, CheckCircle2, Bot, Bug, Inbox, FolderArchive, Map
} from 'lucide-react';
import WaitlistRow from '@/components/dashboard/WaitlistRow';
import { WaitlistEntry } from '@/types'; // Fixed: Now correctly pulling from central types

const MOCK_TELEMETRY = [
  { 
    id: 1, user: "sarah.connor@gmail.com", project: "SHIFT STUDIO", 
    action: "Completed: Workshop Build Log", 
    report: "The material cost calculator wouldn't accept decimals for the lumber cost. Had to round up.", 
    impact: "Medium",
    aiTag: "FEATURE REQUEST", confidence: "92%" 
  },
  { 
    id: 2, user: "alex_designs@yahoo.com", project: "SHIFT STUDIO", 
    action: "Error: Ledger Export", 
    report: "Tried exporting my monthly ledger to CSV and the screen just froze. Refreshing fixed it.", 
    impact: "High",
    aiTag: "SYSTEM BUG", confidence: "98%" 
  },
  { 
    id: 3, user: "j.smith@crafters.net", project: "ALT OS CORE", 
    action: "Triggered: Logout", 
    report: "Logged out. No issues today. The new inventory sync is way faster.", 
    impact: "Low",
    aiTag: "NO ACTION REQUIRED", confidence: "99%" 
  }
];

export default function BetaWaitlistCommand() {
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;
  
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'FEEDBACK'>('QUEUE');
  const [feedbackFolder, setFeedbackFolder] = useState<'INBOX' | 'BUGS' | 'ROADMAP' | 'ARCHIVE'>('INBOX');
  const [betaTesters, setBetaTesters] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    async function fetchWaitlist() {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error("Failed to fetch waitlist:", error);
      } else {
        setBetaTesters((data || []).filter(Boolean));
      }
      setIsLoading(false);
    }

    fetchWaitlist();
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.size === betaTesters.length) {
      setSelectedIds(new Set()); 
    } else {
      setSelectedIds(new Set(betaTesters.map(t => t.id))); 
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleAuthorizeDeployment = () => {
    setIsInviteModalOpen(false);
    setSelectedIds(new Set()); 
  };

  const getMockData = (index: number) => {
    const projects = ["SHIFT STUDIO", "ALT OS CORE", "WEBSITE BETA"];
    const impacts: ('INSIGHTFUL' | 'STANDARD' | 'UNTESTED' | 'QUARANTINED')[] = ["INSIGHTFUL", "STANDARD", "UNTESTED", "STANDARD", "QUARANTINED"];
    return {
      project: projects[index % projects.length],
      impact: impacts[index % impacts.length]
    };
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col pb-24">
          
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                <ArrowLeft size={16} />
              </Link>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy.TITLE}</h1>
                 <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                   <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
                     {copy.LEAD_COUNT} {betaTesters.length}
                   </span>
                 </div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-lg p-3 w-64">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Cohort Capacity</span>
                 <span className="text-xs font-bold text-white">14 <span className="text-white/30">/ 50</span></span>
               </div>
               <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-primary w-[28%]" />
               </div>
            </div>
          </header>

          <nav className="flex items-center gap-2 mb-6 border-b border-white/10 pb-px">
            <button 
              onClick={() => setActiveTab('QUEUE')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'QUEUE' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Users size={14} /> {copy.TABS.QUEUE}
            </button>
            <button 
              onClick={() => setActiveTab('FEEDBACK')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'FEEDBACK' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Activity size={14} /> {copy.TABS.FEEDBACK}
            </button>
          </nav>

          <div className="bg-black/40 border border-white/5 rounded-xl shadow-2xl flex-1 flex flex-col backdrop-blur-sm relative z-20 overflow-hidden">
             
             {activeTab === 'QUEUE' ? (
               <>
                 <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-1.5 focus-within:border-brand-primary/50 transition-colors">
                           <Filter size={14} className="text-white/40" />
                           <span className="text-[10px] font-mono text-white/40 uppercase mr-2">PROJECT:</span>
                           <select className="bg-transparent text-[10px] font-mono text-white uppercase focus:outline-none cursor-pointer">
                             <option value="ALL">ALL PROJECTS</option>
                             <option value="SHIFT">SHIFT STUDIO</option>
                             <option value="ALT">ALT OS CORE</option>
                           </select>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded text-[10px] font-mono text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase">
                      <Download size={14} /> {copy.EXPORT_BTN}
                    </button>
                 </div>

                 <div className="flex-1 overflow-auto relative min-h-100 custom-scrollbar">
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-brand-primary/50" size={24} />
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                         <thead className="bg-black/60 sticky top-0 z-10 text-white/40 font-mono text-[10px] uppercase border-b border-white/5">
                           <tr>
                             <th className="px-6 py-4 font-normal tracking-wider w-12">
                               <input 
                                 type="checkbox" 
                                 checked={selectedIds.size === betaTesters.length && betaTesters.length > 0}
                                 onChange={handleSelectAll}
                                 className="w-4 h-4 bg-black/50 border border-white/20 rounded-sm appearance-none checked:bg-brand-primary checked:border-brand-primary cursor-pointer transition-all"
                               />
                             </th>
                             <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.USER}</th>
                             <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.PROJECT}</th>
                             <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.IMPACT}</th>
                             <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.JOINED}</th>
                             <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.STATUS}</th>
                             <th className="px-6 py-4 font-normal tracking-wider text-right">{copy.COLUMNS.ACTIONS}</th>
                           </tr>
                         </thead>
                         <tbody>
                           {betaTesters.map((entry, index) => {
                             const mock = getMockData(index);
                             return (
                               <WaitlistRow 
                                 key={entry.id || `fallback-key-${index}`} 
                                 entry={entry} 
                                 isSelected={selectedIds.has(entry.id)}
                                 onToggleSelect={() => handleToggleSelect(entry.id)}
                                 mockProject={mock.project}
                                 mockImpact={mock.impact}
                               />
                             )
                           })}
                         </tbody>
                      </table>
                    )}
                 </div>
               </>
             ) : (
               <div className="flex flex-col h-full bg-black/20">
                  <div className="flex items-center gap-1 p-4 border-b border-white/5 bg-black/40">
                     <button onClick={() => setFeedbackFolder('INBOX')} className={`px-4 py-2 rounded-md text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors ${feedbackFolder === 'INBOX' ? 'bg-brand-primary text-black font-bold' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                       <Inbox size={14} /> {copy.FEEDBACK_VIEW.FOLDERS.INBOX} <span className="bg-black/20 px-1.5 rounded ml-1">{MOCK_TELEMETRY.length}</span>
                     </button>
                     <button onClick={() => setFeedbackFolder('BUGS')} className={`px-4 py-2 rounded-md text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors ${feedbackFolder === 'BUGS' ? 'bg-red-500 text-white font-bold' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                       <Bug size={14} /> {copy.FEEDBACK_VIEW.FOLDERS.BUGS}
                     </button>
                     <div className="flex-1" />
                     <button onClick={() => setFeedbackFolder('ARCHIVE')} className={`px-4 py-2 rounded-md text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors ${feedbackFolder === 'ARCHIVE' ? 'bg-white/20 text-white font-bold' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}>
                       <FolderArchive size={14} /> {copy.FEEDBACK_VIEW.FOLDERS.ARCHIVE}
                     </button>
                  </div>

                  <div className="flex-1 overflow-auto p-6 relative custom-scrollbar">
                    {feedbackFolder !== 'INBOX' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                         <FolderArchive size={48} className="mb-4 text-white" />
                         <p className="text-sm font-bold uppercase tracking-widest font-mono text-white">FOLDER EMPTY</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg flex items-start gap-4">
                          <Bot className="text-brand-primary shrink-0" size={20} />
                          <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{copy.FEEDBACK_VIEW.AI_SUMMARY.TITLE}</h3>
                            <p className="text-xs text-white/70 font-mono leading-relaxed">{copy.FEEDBACK_VIEW.AI_SUMMARY.DESC}</p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {MOCK_TELEMETRY.map((log) => (
                            <div key={log.id} className="bg-white/5 border border-white/5 p-5 rounded-lg flex flex-col gap-6 hover:border-brand-primary/20 transition-colors">
                               <div className="flex flex-col md:flex-row md:items-start gap-6">
                                 <div className="md:w-1/4">
                                   <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">{copy.FEEDBACK_VIEW.COLUMNS.AI_TAG}</span>
                                   <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded border ${
                                     log.aiTag === 'SYSTEM BUG' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                     'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                   }`}>
                                      <Bot size={12} />
                                      <span className="text-[10px] font-bold tracking-widest uppercase">{log.aiTag}</span>
                                   </div>
                                 </div>
                                 <div className="md:w-3/4">
                                     <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest block mb-1">{log.user}</span>
                                     <p className="text-sm text-white/90 leading-relaxed font-light">"{log.report}"</p>
                                 </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
               </div>
             )}
          </div>
       </div>

       {/* SELECTED ACTIONS BAR */}
       {selectedIds.size > 0 && activeTab === 'QUEUE' && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-app/95 backdrop-blur-2xl border border-brand-primary/30 shadow-2xl rounded-full px-2 py-2 flex items-center gap-2 z-40 animate-in slide-in-from-bottom-10">
            <div className="px-4 py-2 flex items-center gap-3 border-r border-white/10">
              <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold font-mono flex items-center justify-center">
                {selectedIds.size}
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">{copy.BULK_ACTIONS.SELECTED}</span>
            </div>
            
            <button onClick={() => setIsInviteModalOpen(true)} className="px-6 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-black bg-brand-primary hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
              <Key size={14} /> {copy.BULK_ACTIONS.INVITE}
            </button>
            
            <button onClick={() => setSelectedIds(new Set())} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors ml-2">
              <X size={14} />
            </button>
         </div>
       )}

       {/* INVITE MODAL */}
       {isInviteModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-bg-app border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
               <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                   <Key size={20} />
                 </div>
                 <div>
                   <h2 className="text-lg font-black uppercase text-white tracking-widest">{copy.INVITE_MODAL.TITLE}</h2>
                   <p className="text-xs text-brand-primary font-mono uppercase mt-1">{copy.INVITE_MODAL.SUBTITLE}</p>
                 </div>
               </div>
               <div className="p-6 bg-black/40 space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm italic">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    {copy.INVITE_MODAL.WARNING}
                  </div>
                  <ul className="space-y-2">
                    {copy.INVITE_MODAL.CONTRACT_TERMS.map((term, i) => (
                      <li key={i} className="text-sm text-white/70 font-light flex items-start gap-2">
                         <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-1" />
                         {term}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3">
                 <button onClick={() => setIsInviteModalOpen(false)} className="text-xs font-mono uppercase text-white/50 hover:text-white transition-colors">{copy.INVITE_MODAL.BTN_CANCEL}</button>
                 <button onClick={handleAuthorizeDeployment} className="px-6 py-2.5 rounded text-xs font-mono uppercase font-bold text-black bg-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.4)]">{copy.INVITE_MODAL.BTN_DEPLOY}</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
}