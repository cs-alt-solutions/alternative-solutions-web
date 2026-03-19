/* src/components/dashboard/ecosystem/EcosystemModuleEditor.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { X, Save, Settings2, Globe, Rocket } from 'lucide-react';

interface EcosystemModuleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  module: any | null;
}

export default function EcosystemModuleEditor({ isOpen, onClose, module }: EcosystemModuleEditorProps) {
  const copy = WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER.PANEL;
  const [activeTab, setActiveTab] = useState<'CORE' | 'MARKETING' | 'DEPLOY'>('CORE');
  
  // Reset tab when module changes
  useEffect(() => {
    setActiveTab('CORE');
  }, [module]);

  return (
    <div className={`absolute inset-y-0 right-0 w-full max-w-xl bg-black/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2 shrink-0">
        <h2 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Settings2 size={16} /> 
          {module ? copy.TITLE_EDIT : copy.TITLE_NEW}
        </h2>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-white/5 shrink-0 px-6 pt-4 gap-6 bg-white/2">
        <button onClick={() => setActiveTab('CORE')} className={`pb-3 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'CORE' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/40 hover:text-white/80'}`}>
          <Settings2 size={14} /> {copy.TABS.CORE}
        </button>
        <button onClick={() => setActiveTab('MARKETING')} className={`pb-3 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'MARKETING' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/40 hover:text-white/80'}`}>
          <Globe size={14} /> {copy.TABS.MARKETING}
        </button>
        <button onClick={() => setActiveTab('DEPLOY')} className={`pb-3 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'DEPLOY' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-white/40 hover:text-white/80'}`}>
          <Rocket size={14} /> {copy.TABS.DEPLOY}
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* CORE CONFIG TAB */}
        {activeTab === 'CORE' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.CORE.FIELD_NAME}</label>
              <input type="text" defaultValue={module?.name || ''} placeholder="e.g. Shift Studio" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-cyan-400/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.CORE.FIELD_TAGLINE}</label>
              <input type="text" defaultValue={module?.tagline || ''} placeholder="e.g. The Commerce Engine" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.CORE.FIELD_DESC}</label>
              <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors resize-none custom-scrollbar" placeholder="Internal technical breakdown..."></textarea>
            </div>
          </div>
        )}

        {/* PUBLIC MARKETING TAB */}
        {activeTab === 'MARKETING' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.MARKETING.FIELD_PUBLIC_TITLE}</label>
              <input type="text" defaultValue={module?.name || ''} placeholder="Public-facing title" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.MARKETING.FIELD_PUBLIC_DESC}</label>
              <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors resize-none custom-scrollbar" placeholder="Marketing description for the website..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.MARKETING.FIELD_FEATURES}</label>
              <input type="text" placeholder="e.g. AI Powered, Next.js, Secure" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors" />
            </div>
          </div>
        )}

        {/* DEPLOYMENT TAB */}
{activeTab === 'DEPLOY' && (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{copy.DEPLOY.FIELD_STATUS}</label>
      <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono uppercase tracking-widest focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none bg-no-repeat bg-position-[right_1rem_center] bg-size-[1em_1em] invert">
        {WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER.STATUS_OPTIONS.map(opt => (
          <option key={opt} value={opt} className="bg-bg-app">{opt}</option>
        ))}
      </select>
    </div>
            
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col gap-4 mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{copy.DEPLOY.TOGGLE_PUBLIC}</h3>
                  <p className="text-[10px] text-white/50 mt-1">{copy.DEPLOY.TOGGLE_DESC}</p>
                </div>
                {/* Visual toggle wrapper */}
                <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${module?.isPublic ? 'bg-cyan-500' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${module?.isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-white/5 bg-white/2 shrink-0 flex gap-4">
        <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-mono uppercase tracking-widest transition-colors">
          {copy.BTN_CANCEL}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-3 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          <Save size={14} /> {copy.BTN_SAVE}
        </button>
      </div>
    </div>
  );
}