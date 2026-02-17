/* src/app/dashboard/waitlist/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase'; // <-- INJECTING THE LIVE CLIENT
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowLeft, Download, Filter, Mail, Key, X, Loader2 } from 'lucide-react';
import WaitlistRow from '@/components/dashboard/WaitlistRow';
import { WaitlistEntry } from '@/data/store';

export default function BetaWaitlistCommand() {
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;
  
  // LIVE DATA STATES
  const [betaTesters, setBetaTesters] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // FETCH FROM DATABASE ON LOAD
  useEffect(() => {
    async function fetchWaitlist() {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('source', 'Shift Studio') // Only grab the Beta testers here
        .order('date', { ascending: false });

      if (error) {
        console.error("Failed to fetch waitlist:", error);
      } else {
        setBetaTesters(data || []);
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

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-6xl mx-auto w-full relative z-10 flex-1 flex flex-col pb-24">
          
          <div className="flex items-center gap-4 mb-8">
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

          <div className="bg-black/40 border border-white/5 rounded-xl shadow-2xl flex-1 flex flex-col backdrop-blur-sm relative z-20 overflow-hidden">
             
             <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/2">
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-md px-3 py-1.5 focus-within:border-brand-primary/50 transition-colors">
                   <Filter size={14} className="text-white/40" />
                   <span className="text-[10px] font-mono text-white/40 uppercase mr-2">{copy.FILTER_LABEL}</span>
                   <select className="bg-transparent text-[10px] font-mono text-white uppercase focus:outline-none cursor-pointer">
                     <option value="ALL">{copy.STATUSES.ALL}</option>
                     <option value="PENDING">{copy.STATUSES.PENDING}</option>
                     <option value="INVITED">{copy.STATUSES.INVITED}</option>
                     <option value="ONBOARDED">{copy.STATUSES.ONBOARDED}</option>
                   </select>
                </div>

                <button className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded text-[10px] font-mono text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase">
                  <Download size={14} /> {copy.EXPORT_BTN}
                </button>
             </div>

             <div className="flex-1 overflow-auto relative">
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
                             className="w-4 h-4 bg-black/50 border border-white/20 rounded-sm appearance-none checked:bg-brand-primary checked:border-brand-primary cursor-pointer relative after:content-['✓'] after:absolute after:text-black after:text-[10px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100 transition-all"
                           />
                         </th>
                         <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.EMAIL}</th>
                         <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.SOURCE}</th>
                         <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.JOINED}</th>
                         <th className="px-6 py-4 font-normal tracking-wider">{copy.COLUMNS.STATUS}</th>
                         <th className="px-6 py-4 font-normal tracking-wider text-right">{copy.COLUMNS.ACTIONS}</th>
                       </tr>
                     </thead>
                     <tbody>
                       {betaTesters.map(entry => (
                         <WaitlistRow 
                           key={entry.id} 
                           entry={entry} 
                           isSelected={selectedIds.has(entry.id)}
                           onToggleSelect={() => handleToggleSelect(entry.id)}
                         />
                       ))}
                     </tbody>
                  </table>
                )}
             </div>
          </div>
       </div>

       {/* THE FLOATING BULK COMMAND BAR */}
       {selectedIds.size > 0 && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-app/95 backdrop-blur-2xl border border-brand-primary/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] rounded-full px-2 py-2 flex items-center gap-2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="px-4 py-2 flex items-center gap-3 border-r border-white/10">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold font-mono">
                {selectedIds.size}
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">{copy.BULK_ACTIONS.SELECTED}</span>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-white hover:bg-white/5 transition-colors group">
              <Mail size={14} className="text-brand-primary group-hover:scale-110 transition-transform" /> {copy.BULK_ACTIONS.SEND_LOGS}
            </button>
            
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-black bg-brand-primary hover:bg-brand-primary/90 transition-colors group">
              <Key size={14} className="group-hover:scale-110 transition-transform" /> {copy.BULK_ACTIONS.INVITE}
            </button>

            <button 
              onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors ml-2"
            >
              <X size={14} />
            </button>
         </div>
       )}
    </div>
  );
}