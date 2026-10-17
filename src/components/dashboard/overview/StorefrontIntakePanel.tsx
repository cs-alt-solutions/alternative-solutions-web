'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Store, CheckCircle2, Zap, Mail, User, ChevronRight, Calendar } from 'lucide-react';

export interface ApplicationItem {
  id: string;
  type?: string;
  title: string;       // Business Name
  subtitle: string;    // e.g., "Recent (<48h)"
  link: string;        // The route to trigger the review modal
  created_at: string;  
  is_priority?: boolean;
  email?: string;      
  plan?: string;       
  applicant_name?: string; // 🚀 Added to surface the person's actual name
}

interface StorefrontIntakePanelProps {
  items: ApplicationItem[];
  copy: any;
}

export default function StorefrontIntakePanel({ items, copy }: StorefrontIntakePanelProps) {
  
  // Helper to calculate how long they've been waiting in the queue
  const getWaitTime = (createdAt: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Applied today';
    if (diffDays === 1) return 'Waiting 1 day';
    return `Waiting ${diffDays} days`;
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Store className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">{copy.TITLE || 'Pending Applications'}</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{copy.SUBTITLE || 'Awaiting Authorization'}</p>
          </div>
        </div>
        <div className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          {items.length} IN QUEUE
        </div>
      </div>

      {/* THE WIDE SCANNABLE QUEUE LIST */}
      <div className="flex-1 relative">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm uppercase tracking-widest">{copy.EMPTY || 'Pipeline Clear'}</p>
          </div>
        ) : (
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
                  {/* Subtle Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    isUpNext ? 'from-cyan-500/0 via-cyan-500/0 to-cyan-500/10' :
                    isPriority ? 'from-amber-500/0 via-amber-500/0 to-amber-500/10' : 'from-zinc-500/0 via-zinc-500/0 to-zinc-500/5'
                  }`} />

                  {/* LEFT: Position Badge & Business Name */}
                  <div className="flex items-center gap-4 relative z-10 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 ${
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
                            Up Next
                          </span>
                        )}
                        {isPriority && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Zap className="w-2.5 h-2.5" /> Fast Track
                          </span>
                        )}
                        <h3 className={`text-sm font-black truncate transition-colors ${
                          isUpNext ? 'text-white' : isPriority ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                        }`}>
                          {item.title}
                        </h3>
                      </div>

                      {/* Applicant & Email Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                        {item.applicant_name && (
                          <span className="flex items-center gap-1 text-zinc-300 font-medium">
                            <User size={12} className="text-zinc-500" /> {item.applicant_name}
                          </span>
                        )}
                        {item.email && (
                          <span className="flex items-center gap-1 font-mono text-zinc-500">
                            <Mail size={12} className="text-zinc-600" /> {item.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Timestamps, Wait-Time Badge, & Action Arrow */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 relative z-10 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800/80">
                    
                    {/* Timestamp & Waiting Duration */}
                    <div className="flex flex-col lg:items-end">
                      <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-300">
                        <Calendar size={12} className="text-zinc-500" /> {formattedDateTime}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                        waitMessage.includes('days') && parseInt(waitMessage) >= 3 ? 'text-amber-400' : 'text-zinc-500'
                      }`}>
                        ⏳ {waitMessage}
                      </span>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-cyan-500 group-hover:text-zinc-950 group-hover:border-cyan-400 transition-all text-zinc-400">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}