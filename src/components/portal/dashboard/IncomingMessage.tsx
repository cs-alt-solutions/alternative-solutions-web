/* src/components/portal/dashboard/IncomingMessage.tsx */
'use client';

import React, { useState } from 'react';
import { Radio, CheckCircle2, LayoutList, Zap } from 'lucide-react';

const THEMES = {
  'QUICK COMMS': {
    container: 'bg-zinc-950/80 border-white/5 shadow-xl',
    glowTop: 'bg-cyan-500/10',
    headerBorder: 'border-white/5',
    iconWrap: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: 'text-cyan-400',
    toggleActive: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
    toggleInactive: 'text-zinc-500 hover:text-cyan-400',
    badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    version: 'text-cyan-500 border-cyan-500/20',
    title: 'text-cyan-50',
    body: 'text-cyan-100/70',
    bulletWrap: 'bg-black/40 border-white/5',
    bulletDotOuter: 'bg-cyan-500/10 border-cyan-500/30',
    bulletDotInner: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    bulletText: 'text-cyan-50',
    date: 'text-zinc-500',
    feedLine: 'border-white/10',
    feedDotActive: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]',
    feedDotInactive: 'bg-zinc-800',
    feedDate: 'text-zinc-500',
    feedBadge: 'text-cyan-400/80 bg-cyan-500/10 border-cyan-500/20'
  },
  'FEATURE DROP': {
    container: 'bg-zinc-950/80 border-white/5 shadow-xl',
    glowTop: 'bg-emerald-500/10',
    headerBorder: 'border-white/5',
    iconWrap: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: 'text-emerald-400',
    toggleActive: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    toggleInactive: 'text-zinc-500 hover:text-emerald-400',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    version: 'text-emerald-500 border-emerald-500/20',
    title: 'text-emerald-50',
    body: 'text-emerald-100/70',
    bulletWrap: 'bg-black/40 border-white/5',
    bulletDotOuter: 'bg-emerald-500/10 border-emerald-500/30',
    bulletDotInner: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    bulletText: 'text-emerald-50',
    date: 'text-zinc-500',
    feedLine: 'border-white/10',
    feedDotActive: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]',
    feedDotInactive: 'bg-zinc-800',
    feedDate: 'text-zinc-500',
    feedBadge: 'text-emerald-400/80 bg-emerald-500/10 border-emerald-500/20'
  },
  'ARCHITECTURE': {
    container: 'bg-zinc-950/80 border-white/5 shadow-xl',
    glowTop: 'bg-amber-500/10',
    headerBorder: 'border-white/5',
    iconWrap: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: 'text-amber-400',
    toggleActive: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    toggleInactive: 'text-zinc-500 hover:text-amber-400',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    version: 'text-amber-500 border-amber-500/20',
    title: 'text-amber-50',
    body: 'text-amber-100/70',
    bulletWrap: 'bg-black/40 border-white/5',
    bulletDotOuter: 'bg-amber-500/10 border-amber-500/30',
    bulletDotInner: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    bulletText: 'text-amber-50',
    date: 'text-zinc-500',
    feedLine: 'border-white/10',
    feedDotActive: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]',
    feedDotInactive: 'bg-zinc-800',
    feedDate: 'text-zinc-500',
    feedBadge: 'text-amber-400/80 bg-amber-500/10 border-amber-500/20'
  }
};

type ThemeKey = keyof typeof THEMES;

export default function IncomingMessage({ history }: { history: any[] }) {
  const [viewMode, setViewMode] = useState<'latest' | 'feed'>('latest');
  const activeUpdate = history.find(u => u.is_active) || history[0]; 

  const activeCategory = (activeUpdate?.category?.toUpperCase() || 'QUICK COMMS') as ThemeKey;
  const activeTheme = THEMES[activeCategory] || THEMES['QUICK COMMS'];

  const renderTransmissionBody = (text: string, theme: typeof THEMES['QUICK COMMS']) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />; 
      
      if (trimmed.startsWith('•')) {
        return (
          <div key={i} className={`flex items-start gap-3 mt-3 p-3 rounded-xl border ${theme.bulletWrap}`}>
            <div className={`mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center border ${theme.bulletDotOuter}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.bulletDotInner}`} />
            </div>
            <span className={`text-xs leading-relaxed font-medium ${theme.bulletText}`}>
              {trimmed.substring(1).trim()}
            </span>
          </div>
        );
      }
      
      return (
        <p key={i} className={`text-[13px] leading-relaxed font-medium ${theme.body}`}>
          {trimmed}
        </p>
      );
    });
  };

  if (history.length === 0) {
    return (
      <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 flex flex-col shadow-xl backdrop-blur-sm w-full h-162.5 relative">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
          <Radio size={16} className="text-zinc-500" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Platform Dispatch</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border border-dashed border-white/5 rounded-2xl bg-black/20">
          <CheckCircle2 size={24} className="text-zinc-600 mb-2" />
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">All systems nominal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-3xl p-6 md:p-8 flex flex-col backdrop-blur-md w-full h-162.5 relative overflow-hidden group ${activeTheme.container}`}>
      
      {/* Clean, subtle ambient glow - restricted to top right */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[80px] pointer-events-none opacity-40 ${activeTheme.glowTop}`} />

      {/* WIDGET HEADER & TOGGLE */}
      <div className={`flex items-center justify-between mb-6 pb-4 border-b relative z-10 shrink-0 ${activeTheme.headerBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md border ${activeTheme.iconWrap}`}>
            <Radio size={14} className={`animate-pulse ${activeTheme.icon}`} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest text-shadow-sm">Platform Dispatch</h2>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setViewMode('latest')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === 'latest' ? activeTheme.toggleActive : activeTheme.toggleInactive}`}
          >
            <Zap size={10} /> Latest
          </button>
          <button 
            onClick={() => setViewMode('feed')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === 'feed' ? activeTheme.toggleActive : activeTheme.toggleInactive}`}
          >
            <LayoutList size={10} /> Feed
          </button>
        </div>
      </div>
      
      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* VIEW 1: SINGLE LATEST UPDATE */}
        {viewMode === 'latest' && activeUpdate && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${activeTheme.badge}`}>
                {activeUpdate.category || 'QUICK COMMS'}
              </span>
              {activeUpdate.version && (
                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${activeTheme.version}`}>
                  {activeUpdate.version}
                </span>
              )}
            </div>

            <h3 className={`text-xl font-black mb-4 leading-snug shrink-0 ${activeTheme.title}`}>
              {activeUpdate.title}
            </h3>
            
            {/* Added pt-4 here to ensure no top-edge clipping */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pt-4 pb-2 -mt-4">
              <div className="flex flex-col gap-1">
                {renderTransmissionBody(activeUpdate.body, activeTheme)}
              </div>
            </div>
            
            <div className={`mt-4 pt-4 border-t flex items-center justify-end shrink-0 ${activeTheme.headerBorder}`}>
              <span className={`text-[9px] font-mono uppercase tracking-widest ${activeTheme.date}`}>
                {new Date(activeUpdate.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: SCROLLABLE FEED */}
        {viewMode === 'feed' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pt-4 pb-4 -mt-4 space-y-8 animate-in fade-in duration-300">
            {history.map((log) => {
              const logCategory = (log.category?.toUpperCase() || 'QUICK COMMS') as ThemeKey;
              const logTheme = THEMES[logCategory] || THEMES['QUICK COMMS'];

              return (
                <div key={log.id} className={`relative pl-6 border-l ml-2 pb-2 ${logTheme.feedLine}`}>
                  {/* The absolute dot will no longer be clipped because of the pt-4 on the parent container */}
                  <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${log.is_active ? logTheme.feedDotActive : logTheme.feedDotInactive}`} />
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2 -mt-1">
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${logTheme.feedDate}`}>
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${logTheme.feedBadge}`}>
                      {log.category || 'QUICK COMMS'}
                    </span>
                  </div>
                  
                  <h3 className={`text-sm font-bold mb-3 ${logTheme.title}`}>{log.title}</h3>
                  
                  <div className="flex flex-col gap-1 opacity-90">
                    {renderTransmissionBody(log.body, logTheme)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}