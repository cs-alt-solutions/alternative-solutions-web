/* src/components/dashboard/beta-command/AccessMatrixTab.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Search, UserCircle, Phone, Mail, Calendar, BadgeCheck, ChevronDown, ChevronUp, X, Plus } from 'lucide-react';

export default function AccessMatrixTab() {
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND.MATRIX;
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // UPGRADED MOCK DATA: Using 'cohorts' arrays instead of static booleans for infinite scalability
  const mockRoster = [
    { 
      id: 1, 
      sequence: 1, 
      alias: "Node_Alpha_77", 
      realName: "Sarah Jenkins",
      phone: "+1 (555) 019-8472",
      email: "sarah.j@example.com",
      joinedDate: "2026-03-01",
      tier: "BUILDER", 
      cohorts: ["Shift Studio Beta", "API V1 Early Access", "GlitchBot Co-Op"], 
      status: "ACTIVE" 
    },
    { 
      id: 2, 
      sequence: 45, 
      alias: "Observer_Delta", 
      realName: "Marcus Thorne",
      phone: "+1 (555) 882-1002",
      email: "m.thorne@example.com",
      joinedDate: "2026-03-15",
      tier: "OBSERVER", 
      cohorts: ["GlitchBot Co-Op"], 
      status: "WAITING" 
    },
  ];

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" size={16} />
          <input 
            type="text" 
            placeholder={copy.SEARCH_PLACEHOLDER}
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-bg-surface-200/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="col-span-2">{copy.COLUMNS[0]}</div>
          <div className="col-span-4">{copy.COLUMNS[1]}</div>
          <div className="col-span-4">{copy.COLUMNS[2]}</div>
          <div className="col-span-2 text-right">{copy.COLUMNS[3]}</div>
        </div>

        <div className="divide-y divide-white/5">
          {mockRoster.map((user) => {
            const isExpanded = expandedRow === user.id;
            const isFirst20 = user.sequence <= 20;

            return (
              <div key={user.id} className="flex flex-col">
                <div onClick={() => toggleRow(user.id)} className={`grid grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-colors group ${isExpanded ? 'bg-white/5' : 'hover:bg-white/2'}`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-500 font-bold">#{String(user.sequence).padStart(3, '0')}</span>
                    {isFirst20 && <BadgeCheck size={14} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <UserCircle size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-300 font-mono">{user.alias}</span>
                  </div>
                  <div className="col-span-4 flex items-center gap-2 flex-wrap">
                    {/* Visual preview of assigned cohorts on the main grid */}
                    <span className={`px-2 py-1 rounded text-[9px] font-mono tracking-widest uppercase border ${user.tier === 'BUILDER' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                      {user.tier}
                    </span>
                    <span className="text-[9px] font-mono text-white/40">[{user.cohorts.length} SECTORS]</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                      <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:block">{user.status}</span>
                    </div>
                    <div className="text-white/20 group-hover:text-cyan-400 transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* THE EXPANDED CONSOLE */}
                {/* THE EXPANDED CONSOLE */}
<div className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/40 border-t border-white/5 ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Identity Panel */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{copy.DETAILS.REAL_NAME}</h4>
                      <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="text-lg font-bold text-white">{user.realName}</div>
                        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400"><Mail size={12} className="text-white/20" /> {user.email}</div>
                          {user.phone && <div className="flex items-center gap-3 text-xs font-mono text-slate-400"><Phone size={12} className="text-white/20" /> {user.phone}</div>}
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400"><Calendar size={12} className="text-white/20" /> Initial Pulse: {user.joinedDate}</div>
                        </div>
                      </div>
                    </div>

                    {/* Scalable Product Cohorts Panel */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{copy.DETAILS.COHORTS}</h4>
                      <div className="bg-black/50 border border-white/5 rounded-xl p-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {user.cohorts.map(cohort => (
                            <div key={cohort} className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest group">
                              {cohort}
                              <button className="text-cyan-400/50 hover:text-red-400 transition-colors"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white/60 hover:text-white px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all">
                          <Plus size={14} /> {copy.DETAILS.ASSIGN_COHORT}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}