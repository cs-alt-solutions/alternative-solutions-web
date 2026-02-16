/* src/components/dashboard/WaitlistRow.tsx */
'use client';

import React, { useState } from 'react';
import { WaitlistEntry } from '@/data/store';
import { WEBSITE_COPY } from '@/utils/glossary';
import { MoreVertical, Mail, Key, UserCheck, RefreshCw, ExternalLink } from 'lucide-react';

interface WaitlistRowProps {
  entry: WaitlistEntry;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export default function WaitlistRow({ entry, isSelected, onToggleSelect }: WaitlistRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = WEBSITE_COPY.DASHBOARD.WAITLIST;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <tr className={`border-b border-white/5 transition-colors group relative ${isSelected ? 'bg-brand-primary/5' : 'hover:bg-white/2'}`}>
      
      {/* CHECKBOX CELL */}
      <td className="px-6 py-4 w-12">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 bg-black/50 border border-white/20 rounded-sm appearance-none checked:bg-brand-primary checked:border-brand-primary cursor-pointer relative after:content-['✓'] after:absolute after:text-black after:text-[10px] after:font-bold after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 checked:after:opacity-100 transition-all"
        />
      </td>

      <td className="px-6 py-4 text-xs font-mono text-white/80">{entry.email}</td>
      <td className="px-6 py-4 text-[10px] font-mono uppercase text-brand-primary tracking-widest">{entry.source}</td>
      <td className="px-6 py-4 text-[10px] font-mono text-white/50">{entry.date}</td>
      <td className="px-6 py-4">
         <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
           entry.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
           entry.status === 'Invited' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' :
           'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
         }`}>
           {entry.status}
         </span>
      </td>
      <td className="px-6 py-4 text-right">
         <button onClick={toggleMenu} className="text-white/40 hover:text-white transition-colors p-1 relative z-10">
           <MoreVertical size={16} />
         </button>
         
         {isOpen && (
           <>
             {/* Invisible overlay to close the menu when clicking outside */}
             <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
             
             {/* DYNAMIC SMART MENU */}
             <div className="absolute right-12 top-10 w-56 bg-bg-app border border-white/10 rounded-md shadow-2xl z-50 flex flex-col py-1 overflow-hidden backdrop-blur-xl">
                
                {/* PENDING ACTIONS */}
                {entry.status === 'Pending' && (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase">
                      <Mail size={12} className="text-brand-primary" /> {copy.ROW_ACTIONS.SEND_UPDATE}
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase border-t border-white/5">
                      <Key size={12} className="text-emerald-500" /> {copy.ROW_ACTIONS.INVITE}
                    </button>
                  </>
                )}

                {/* INVITED ACTIONS (They haven't logged in yet) */}
                {entry.status === 'Invited' && (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase">
                      <RefreshCw size={12} className="text-orange-400" /> {copy.ROW_ACTIONS.RESEND_INVITE}
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase border-t border-white/5">
                      <UserCheck size={12} className="text-white/40" /> {copy.ROW_ACTIONS.FORCE_ONBOARD}
                    </button>
                  </>
                )}

                {/* ONBOARDED ACTIONS */}
                {entry.status === 'Onboarded' && (
                  <button className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-mono text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left w-full uppercase">
                    <ExternalLink size={12} className="text-brand-primary" /> {copy.ROW_ACTIONS.VIEW_PROFILE}
                  </button>
                )}
             </div>
           </>
         )}
      </td>
    </tr>
  );
}