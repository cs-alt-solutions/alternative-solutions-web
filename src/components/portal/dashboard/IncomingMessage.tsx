/* src/components/portal/dashboard/IncomingMessage.tsx */
'use client';

import React, { useState } from 'react';
import { Radio, CheckCircle2, LayoutList, Zap } from 'lucide-react';

const THEMES = {
  'QUICK COMMS': {
    container: 'from-cyan-900/40 via-cyan-950/20 to-zinc-950 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)]',
    glowTop: 'bg-cyan-500/30',
    glowBottom: 'bg-blue-500/20',
    headerBorder: 'border-cyan-500/30',
    iconWrap: 'bg-cyan-500/30 text-cyan-200 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    icon: 'text-cyan-100',
    toggleActive: 'bg-cyan-500/30 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    toggleInactive: 'text-cyan-500/60 hover:text-cyan-300',
    badge: 'text-cyan-200 bg-cyan-500/30 border-cyan-500/40',
    version: 'text-cyan-300 border-cyan-500/30',
    title: 'text-cyan-50',
    body: 'text-cyan-100/90',
    bulletWrap: 'bg-cyan-950/40 border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]',
    bulletDotOuter: 'bg-cyan-500/20 border-cyan-500/40',
    bulletDotInner: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]',
    bulletText: 'text-cyan-50',
    date: 'text-cyan-500/70',
    feedLine: 'border-cyan-500/30',
    feedDotActive: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]',
    feedDotInactive: 'bg-cyan-900',
    feedDate: 'text-cyan-400/60',
    feedBadge: 'text-cyan-200/70 bg-cyan-500/20 border-cyan-500/30'
  },
  'FEATURE DROP': {
    container: 'from-emerald-900/40 via-emerald-950/20 to-zinc-950 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.2)]',
    glowTop: 'bg-emerald-500/30',
    glowBottom: 'bg-teal-500/20',
    headerBorder: 'border-emerald-500/30',
    iconWrap: 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    icon: 'text-emerald-100',
    toggleActive: 'bg-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    toggleInactive: 'text-emerald-500/60 hover:text-emerald-300',
    badge: 'text-emerald-200 bg-emerald-500/30 border-emerald-500/40',
    version: 'text-emerald-300 border-emerald-500/30',
    title: 'text-emerald-50',
    body: 'text-emerald-100/90',
    bulletWrap: 'bg-emerald-950/40 border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]',
    bulletDotOuter: 'bg-emerald-500/20 border-emerald-500/40',
    bulletDotInner: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]',
    bulletText: 'text-emerald-50',
    date: 'text-emerald-500/70',
    feedLine: 'border-emerald-500/30',
    feedDotActive: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]',
    feedDotInactive: 'bg-emerald-900',
    feedDate: 'text-emerald-400/60',
    feedBadge: 'text-emerald-200/70 bg-emerald-500/20 border-emerald-500/30'
  },
  'ARCHITECTURE': {
    container: 'from-amber-900/40 via-amber-950/20 to-zinc-950 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]',
    glowTop: 'bg-amber-500/30',
    glowBottom: 'bg-orange-500/20',
    headerBorder: 'border-amber-500/30',
    iconWrap: 'bg-amber-500/30 text-amber-200 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    icon: 'text-amber-100',
    toggleActive: 'bg-amber-500/30 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    toggleInactive: 'text-amber-500/60 hover:text-amber-300',
    badge: 'text-amber-200 bg-amber-500/30 border-amber-500/40',
    version: 'text-amber-300 border-amber-500/30',
    title: 'text-amber-50',
    body: 'text-amber-100/90',
    bulletWrap: 'bg-amber-950/40 border-amber-500/30 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]',
    bulletDotOuter: 'bg-amber-500/20 border-amber-500/40',
    bulletDotInner: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]',
    bulletText: 'text-amber-50',
    date: 'text-amber-500/70',
    feedLine: 'border-amber-500/30',
    feedDotActive: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]',
    feedDotInactive: 'bg-amber-900',
    feedDate: 'text-amber-400/60',
    feedBadge: 'text-amber-200/70 bg-amber-500/20 border-amber-500/30'
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
      <div className="bg-linear-to-br from-cyan-900/30 via-cyan-950/10 to-zinc-950 border-2 border-cyan-500/30 rounded-3xl p-6 flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.15)] backdrop-blur-sm w-full h-[650px] relative">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-cyan-500/30">
          <Radio size={16} className="text-cyan-400" />
          <h2 className="text-sm font-bold text-cyan-50 uppercase tracking-widest">Platform Dispatch</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 border border-dashed border-cyan-500/30 rounded-2xl bg-cyan-950/30">
          <CheckCircle2 size={24} className="text-cyan-400 mb-2" />
          <p className="text-xs text-cyan-200/60 font-mono uppercase tracking-widest">All systems nominal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-linear-to-br border-2 rounded-3xl p-6 md:p-8 flex flex-col backdrop-blur-md w-full h-[650px] relative overflow-hidden group ${activeTheme.container}`}>
      
      {/* Dynamic Ambient Background Glows */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[60px] pointer-events-none ${activeTheme.glowTop}`} />
      <div className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-[60px] pointer-events-none ${activeTheme.glowBottom}`} />

      {/* WIDGET HEADER & TOGGLE */}
      <div className={`flex items-center justify-between mb-6 pb-4 border-b relative z-10 shrink-0 ${activeTheme.headerBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md border ${activeTheme.iconWrap}`}>
            <Radio size={14} className={`animate-pulse ${activeTheme.icon}`} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest text-shadow-sm">Platform Dispatch</h2>
        </div>
        
        <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
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
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-2">
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
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6 animate-in fade-in duration-300">
            {history.map((log) => {
              const logCategory = (log.category?.toUpperCase() || 'QUICK COMMS') as ThemeKey;
              const logTheme = THEMES[logCategory] || THEMES['QUICK COMMS'];

              return (
                <div key={log.id} className={`relative pl-6 border-l ml-2 pb-2 ${logTheme.feedLine}`}>
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