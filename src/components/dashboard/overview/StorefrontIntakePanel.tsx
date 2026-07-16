'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Store, CheckCircle2 } from 'lucide-react';

export interface ApplicationItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  link: string;
  created_at: string; // Added this to support timestamping
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
          items.map((item, i) => (
            <div 
              key={item.id || i}
              className="group relative flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/80 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle Hover Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-cyan-400 border border-zinc-700">
                  {item.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors">
                    {item.title}
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
                className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white bg-zinc-950 px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                {copy.ACTIONS.PROCESS}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}