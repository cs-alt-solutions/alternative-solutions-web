/* src/components/dashboard/broadcast/CampaignsTab.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Mail, Send, Users, Sparkles, Eye, Edit3, Clock, LayoutList } from 'lucide-react';

export default function CampaignsTab() {
  const copy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB.CAMPAIGNS;
  
  const [audience, setAudience] = useState<'ALL' | 'FOUNDERS' | 'OBSERVERS'>('ALL');
  const [viewMode, setViewMode] = useState<'WRITE' | 'PREVIEW'>('WRITE');
  const [content, setContent] = useState('');

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: The Composer */}
      <div className="lg:col-span-2 bg-bg-surface-200/30 border border-white/5 rounded-2xl flex flex-col overflow-hidden">
         
         {/* HEADER: Audience & AI Action */}
         <div className="p-6 pb-4 border-b border-white/5 bg-white/2 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <Mail className="text-brand-primary" size={18} />
             <h2 className="text-sm font-bold text-white uppercase tracking-widest">{copy.TITLE}</h2>
           </div>
           
           <button className="flex items-center justify-center gap-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-black px-4 py-2 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Sparkles size={12} />
              {copy.AI_ASSIST}
           </button>
         </div>

         {/* TOOLBAR: Audience Selector */}
         <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {copy.AUDIENCE_LABEL}
            </span>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
              {(['ALL', 'FOUNDERS', 'OBSERVERS'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAudience(type)}
                  className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest rounded-lg transition-all ${
                    audience === type 
                    ? 'bg-brand-primary text-black font-black shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {copy.AUDIENCES[type]}
                </button>
              ))}
            </div>
         </div>
         
         {/* EDITOR AREA */}
         <div className="flex-1 flex flex-col p-6 space-y-4">
           <input 
             type="text" 
             placeholder={copy.PLACEHOLDERS.SUBJECT} 
             className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold tracking-wide focus:outline-none focus:border-brand-primary/50 transition-colors"
           />
           
           <div className="flex-1 flex flex-col border border-white/10 rounded-lg overflow-hidden bg-black/20">
             {/* Editor Tabs (Write vs Preview) */}
             <div className="flex items-center border-b border-white/10 bg-white/5">
                <button 
                  onClick={() => setViewMode('WRITE')}
                  className={`flex items-center gap-2 px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                    viewMode === 'WRITE' ? 'text-brand-primary border-b border-brand-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Edit3 size={12} /> {copy.EDITOR_TABS.WRITE}
                </button>
                <button 
                  onClick={() => setViewMode('PREVIEW')}
                  className={`flex items-center gap-2 px-6 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                    viewMode === 'PREVIEW' ? 'text-brand-primary border-b border-brand-primary bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Eye size={12} /> {copy.EDITOR_TABS.PREVIEW}
                </button>
             </div>

             {/* Dynamic Content Area */}
             {viewMode === 'WRITE' ? (
               <textarea 
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 placeholder={copy.PLACEHOLDERS.BODY}
                 className="w-full h-64 bg-transparent p-4 text-sm text-white focus:outline-none custom-scrollbar resize-none font-mono leading-relaxed"
               />
             ) : (
               <div className="w-full h-64 p-6 overflow-y-auto custom-scrollbar bg-black/80">
                 {content ? (
                   <div className="prose prose-invert prose-sm max-w-none font-sans text-slate-300">
                     {/* For now, just render text. Later we parse the markdown into HTML here */}
                     <p className="whitespace-pre-wrap">{content}</p>
                   </div>
                 ) : (
                   <div className="h-full flex items-center justify-center text-[10px] font-mono text-white/20 uppercase tracking-widest border border-dashed border-white/5 rounded-lg">
                     Nothing to preview
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>

         {/* FOOTER ACTIONS */}
         <div className="p-6 pt-4 border-t border-white/5 bg-white/2 flex items-center justify-between">
           <button className="flex items-center gap-2 text-white/40 hover:text-white px-4 py-3 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all hover:bg-white/5 border border-transparent hover:border-white/10">
             <Clock size={14} /> {copy.ACTIONS.SCHEDULE}
           </button>
           <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-black px-6 py-3 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
             {copy.ACTIONS.SEND} <Send size={14} />
           </button>
         </div>
      </div>

      {/* RIGHT COLUMN: Telemetry Sidebar */}
      <div className="lg:col-span-1 space-y-6">
         
         {/* Live Roster Status */}
         <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-brand-primary" />
              <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
                {copy.SIDEBAR.STATS_TITLE}
              </span>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter">
              {copy.SIDEBAR.STATS_SYNC}
            </div>
            <p className="text-[10px] text-white/50 font-mono mt-2 uppercase leading-relaxed">
              {copy.SIDEBAR.STATS_DESC}
            </p>
         </div>

         {/* Recent Dispatches */}
         <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
              <LayoutList size={14} className="text-white/40" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                {copy.SIDEBAR.RECENT_TITLE}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/5 rounded-xl text-center">
               <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
                 {copy.SIDEBAR.EMPTY_RECENT}
               </span>
            </div>
         </div>

      </div>

    </section>
  );
}