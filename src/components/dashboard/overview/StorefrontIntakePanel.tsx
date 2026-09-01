'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Store, CheckCircle2, Zap } from 'lucide-react';

export interface ApplicationItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  link: string;
  created_at: string; 
  is_priority?: boolean; // 🚀 Added to detect Fast-Track lanes
}

interface StorefrontIntakePanelProps {
  items: ApplicationItem[];
  copy: any;
}

export default function StorefrontIntakePanel({ items, copy }: StorefrontIntakePanelProps) {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Store className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">{copy.TITLE}</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{copy.SUBTITLE}</p>
          </div>
        </div>
        <div className="text-xs font-bold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {items.length} PENDING
        </div>
      </div>

      {/* The Applications List */}
      <div className="flex-1 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-50 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm uppercase tracking-widest">{copy.EMPTY}</p>
          </div>
        ) : (
          items.map((item, i) => {
            const isPriority = item.is_priority;

            return (
              <div 
                key={item.id || i}
                className={`group relative flex items-center justify-between p-4 bg-zinc-900 border rounded-xl transition-all duration-300 overflow-hidden ${
                  isPriority 
                    ? 'border-amber-500/30 hover:bg-zinc-800/80 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                    : 'border-zinc-800 hover:bg-zinc-800/80 hover:border-cyan-500/50'
                }`}
              >
                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isPriority ? 'from-amber-500/0 via-amber-500/0 to-amber-500/10' : 'from-cyan-500/0 via-cyan-500/0 to-cyan-500/5'
                }`} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                    isPriority 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                      : 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                  }`}>
                    {item.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold flex items-center gap-2 transition-colors ${
                      isPriority ? 'text-amber-400' : 'text-zinc-200 group-hover:text-cyan-400'
                    }`}>
                      {item.title}
                      {isPriority && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-black bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <Zap className="w-2.5 h-2.5" /> Fast Track
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {item.subtitle}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Link 
                  href={item.link}
                  className={`relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${
                    isPriority
                      ? 'text-amber-400/70 hover:text-amber-400 bg-zinc-950 border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'text-zinc-400 hover:text-white bg-zinc-950 border-zinc-800 hover:border-cyan-500/40'
                  }`}
                >
                  {copy.ACTIONS.PROCESS}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}