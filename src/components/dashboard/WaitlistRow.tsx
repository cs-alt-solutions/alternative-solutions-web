/* src/components/dashboard/WaitlistRow.tsx */
'use client';

import React, { useState } from 'react';
import { WaitlistEntry } from '@/data/store';
import { WEBSITE_COPY } from '@/utils/glossary';
import { MoreVertical, Mail, Key, UserCheck, RefreshCw, ExternalLink, MessageSquare, Lightbulb, ShieldAlert } from 'lucide-react';

interface WaitlistRowProps {
  entry: WaitlistEntry;
  isSelected: boolean;
  onToggleSelect: () => void;
  mockProject?: string;
  mockImpact?: 'INSIGHTFUL' | 'STANDARD' | 'UNTESTED' | 'QUARANTINED';
}

export default function WaitlistRow({ entry, isSelected, onToggleSelect, mockProject = "SHIFT STUDIO", mockImpact = "UNTESTED" }: WaitlistRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;

  // ARMOR PLATE: If the database passes a null/undefined entry, eject immediately.
  if (!entry) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  // OPTIONAL CHAINING: Adding question marks ensures it doesn't crash if properties are missing
  const rawDate = entry?.date || entry?.created_at || new Date().toISOString();
  const formattedDate = new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <tr className={`border-b border-white/5 transition-colors group relative ${isSelected ? 'bg-brand-primary/5' : mockImpact === 'QUARANTINED' ? 'bg-red-500/5 opacity-50' : 'hover:bg-white/2'}`}>
      
      <td className="px-6 py-4 w-12">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 bg-black/50 border border-white/20 rounded-sm appearance-none checked:bg-brand-primary checked:border-brand-primary cursor-pointer relative after:content-['✓'] after:absolute after:text-black after:text-[10px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100 transition-all"
        />
      </td>

      <td className="px-6 py-4">
        {entry.name && (
          <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
            {entry.name}
          </div>
        )}
        <div className="text-[10px] font-mono text-white/50">{entry.email || 'UNKNOWN_CONTACT'}</div>
      </td>

      <td className="px-6 py-4">
         <span className="text-[10px] font-mono uppercase text-brand-secondary tracking-widest border border-brand-secondary/30 bg-brand-secondary/10 px-2 py-0.5 rounded">
           {mockProject}
         </span>
      </td>

      <td className="px-6 py-4">
         <span className={`flex items-center gap-1.5 w-max px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest border ${
           mockImpact === 'INSIGHTFUL' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' :
           mockImpact === 'STANDARD' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
           mockImpact === 'QUARANTINED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
           'bg-white/5 text-white/40 border-white/10'
         }`}>
           {mockImpact === 'INSIGHTFUL' && <Lightbulb size={10} className="text-brand-primary" />}
           {mockImpact === 'QUARANTINED' && <ShieldAlert size={10} className="text-red-400" />}
           {mockImpact}
         </span>
      </td>
      
      <td className="px-6 py-4 text-[10px] font-mono text-white/50">{formattedDate}</td>
      
      <td className="px-6 py-4">
         <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
           mockImpact === 'QUARANTINED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
           entry.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
           entry.status === 'Invited' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
           'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
         }`}>
           {mockImpact === 'QUARANTINED' ? 'REVOKED' : entry.status === 'Invited' ? 'ACCESS GRANTED' : entry.status === 'Onboarded' ? 'ACTIVE' : entry.status || 'PENDING'}
         </span>
      </td>
      
      <td className="px-6 py-4 text-right">
         <button onClick={toggleMenu} className="text-white/40 hover:text-white transition-colors p-1 relative z-10">
           <MoreVertical size={16} />
         </button>
         
         {isOpen && (
           <>
             <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
             <div className="absolute right-12 top-10 w-56 bg-bg-app border border-white/10 rounded-md shadow-2xl z-50 flex flex-col py-1 overflow-hidden backdrop-blur-xl">
                
                {(!entry.status || entry.status === 'Pending') && (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase">
                      <Mail size={12} className="text-brand-primary" /> {copy.ROW_ACTIONS.SEND_UPDATE}
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase border-t border-white/5">
                      <Key size={12} className="text-emerald-500" /> {copy.ROW_ACTIONS.INVITE}
                    </button>
                  </>
                )}

                {entry.status === 'Invited' && (
                  <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase">
                    <RefreshCw size={12} className="text-orange-400" /> {copy.ROW_ACTIONS.RESEND_INVITE}
                  </button>
                )}

                <div className="border-t border-white/10 bg-white/2 mt-1">
                  <div className="px-4 py-1.5 text-[8px] font-bold text-white/30 uppercase tracking-widest">Quality Control</div>
                  <button className="flex items-center gap-3 px-4 py-2 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-brand-primary transition-colors text-left w-full uppercase">
                    <Lightbulb size={12} /> {copy.ROW_ACTIONS.MARK_INSIGHTFUL}
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 text-[10px] font-mono text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left w-full uppercase">
                    <ShieldAlert size={12} /> {copy.ROW_ACTIONS.QUARANTINE}
                  </button>
                </div>

             </div>
           </>
         )}
      </td>
    </tr>
  );
}