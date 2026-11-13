/* src/components/dashboard/overview/StorefrontIntakePanel.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { Store, CheckCircle2, Zap, Mail, User, ChevronRight, Calendar } from 'lucide-react';
import { OVERVIEW_COPY } from '@/config/dashboard/overview';

export interface ApplicationItem {
  id: string;
  type?: string;
  title: string;
  subtitle: string;
  link: string;
  created_at: string;   
  is_priority?: boolean;
  email?: string;       
  plan?: string;        
  applicant_name?: string;
}

interface StorefrontIntakePanelProps {
  items: ApplicationItem[];
  copy?: any;
}

export default function StorefrontIntakePanel({ items }: StorefrontIntakePanelProps) {
  const txt = OVERVIEW_COPY.INTAKE;

  const getWaitTime = (createdAt: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return txt.APPLIED_TODAY;
    if (diffDays === 1) return txt.WAITING_1_DAY;
    return `${txt.WAITING_PREFIX} ${diffDays} ${txt.WAITING_SUFFIX}`;
  };

  // Compact single-line status bar when queue is 0 (Saves massive vertical space on mobile & desktop!)
  if (items.length === 0) {
    return (
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider truncate">{txt.TITLE}</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate">{txt.EMPTY_TITLE}</p>
          </div>
        </div>
        <span className="text-[10px] font-black text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 shrink-0">
          0 {txt.QUEUE_SUFFIX}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Store className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-wider">{txt.TITLE}</h2>
            <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-0.5">{txt.SUBTITLE}</p>
          </div>
        </div>
        <div className="text-[10px] sm:text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          {items.length} {txt.QUEUE_SUFFIX}
        </div>
      </div>

      {/* SCANNABLE QUEUE LIST */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isPriority = item.is_priority;
          const isUpNext = index === 0;
          const queuePosition = index + 1;
          const waitMessage = getWaitTime(item.created_at);

          const formattedDateTime = new Date(item.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          return (
            <Link 
              key={item.id || index}
              href={item.link}
              className={`group relative flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-zinc-950 border rounded-2xl transition-all duration-300 overflow-hidden gap-4 ${
                isUpNext
                  ? 'border-cyan-500/40 hover:bg-zinc-900/80 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                  : isPriority 
                    ? 'border-amber-500/30 hover:bg-zinc-900/80 hover:border-amber-500/50' 
                    : 'border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm border shrink-0 ${
                  isUpNext 
                    ? 'bg-cyan-500 text-zinc-950 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                    : isPriority
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:border-cyan-500/50 group-hover:text-cyan-400'
                }`}>
                  #{queuePosition}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isUpNext && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black bg-cyan-500 text-zinc-950">
                        {txt.UP_NEXT}
                      </span>
                    )}
                    {isPriority && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Zap className="w-2.5 h-2.5" /> {txt.FAST_TRACK}
                      </span>
                    )}
                    <h3 className={`text-sm font-black truncate transition-colors ${
                      isUpNext ? 'text-white' : isPriority ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                    }`}>
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    {item.applicant_name && (
                      <span className="flex items-center gap-1 text-zinc-300 font-medium">
                        <User size={12} className="text-zinc-500" /> {item.applicant_name}
                      </span>
                    )}
                    {item.email && (
                      <span className="flex items-center gap-1 font-mono text-zinc-500 truncate">
                        <Mail size={12} className="text-zinc-600 shrink-0" /> {item.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 relative z-10 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800/80">
                <div className="flex flex-col lg:items-end">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-300">
                    <Calendar size={12} className="text-zinc-500" /> {formattedDateTime}
                  </span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                    waitMessage.includes('days') && parseInt(waitMessage) >= 3 ? 'text-amber-400' : 'text-zinc-500'
                  }`}>
                    {waitMessage}
                  </span>
                </div>

                <div className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-cyan-500 group-hover:text-zinc-950 group-hover:border-cyan-400 transition-all text-zinc-400">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}