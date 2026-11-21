/* src/components/dashboard/storefronts/editor/StorefrontCanvas.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  PenTool, Image as ImageIcon, Layers, Scale, 
  PanelLeftClose, PanelLeftOpen, MonitorSmartphone, RefreshCw, Eye, SlidersHorizontal
} from 'lucide-react';

import CoreTab from './CoreTab';
import MediaTab from './MediaTab';
import CapabilitiesTab from './CapabilitiesTab';
import LogisticsTab from './LogisticsTab';
import SystemLockShield from './SystemLockShield';
import { EDITOR_WORKSPACE_COPY, getActiveBlueprint } from '@/config/dashboard/editor';

interface StorefrontCanvasProps {
  formData: any;
  setFormData: any;
  refreshKey: number;
  reloadCanvas: () => void;
  isLocked: boolean;
  setIsUnlocked: (val: boolean) => void;
  previewBaseUrl: string;
}

export default function StorefrontCanvas({
  formData, setFormData, refreshKey, reloadCanvas, isLocked, setIsUnlocked, previewBaseUrl
}: StorefrontCanvasProps) {
  const [editorTab, setEditorTab] = useState<'core' | 'content' | 'services' | 'logistics'>('core');
  const [controlsExpanded, setControlsExpanded] = useState(true);
  // Tablet / Mobile view switcher ('controls' vs 'preview')
  const [mobileView, setMobileView] = useState<'controls' | 'preview'>('controls');

  const industryTag = formData.industry_tag || 'General';
  const engineMode = formData.engine_mode || 'core';
  const copy = EDITOR_WORKSPACE_COPY.CANVAS;

  const isHub = engineMode === 'hub' || formData.content_layout === 'hub';
const activeBlueprint = getActiveBlueprint(industryTag, isHub ? 'hub' : engineMode);
  const servicesTabLabel = activeBlueprint.tabLabel;

  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [controlsExpanded, editorTab, mobileView]);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full relative overflow-hidden">
      
      {/* TABLET & MOBILE VIEW SWITCHER BAR (<1024px) */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 flex-1">
          <button
            type="button"
            onClick={() => setMobileView('controls')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              mobileView === 'controls' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <SlidersHorizontal size={12} /> Editor Controls
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              mobileView === 'preview' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Eye size={12} /> Live Preview
          </button>
        </div>

        {mobileView === 'preview' && (
          <button
            type="button"
            onClick={reloadCanvas}
            className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer shrink-0"
            title={copy.REFRESH_CANVAS}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* LEFT PANEL: 4-TAB EDITOR CONTROLS */}
      {controlsExpanded && (
        <div className={`${mobileView === 'controls' ? 'flex' : 'hidden'} lg:flex w-full lg:w-96 xl:w-md flex-col border-r border-zinc-800 bg-zinc-950 z-10 shrink-0 h-full min-h-0 animate-in slide-in-from-left-4 duration-300`}>
          
          {/* 4-TAB CONSOLIDATED NAVIGATION */}
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
            <button type="button" onClick={() => setEditorTab('core')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'core' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <ImageIcon className="w-3.5 h-3.5 hidden sm:block" /> {copy.TABS.CORE}
            </button>
            <button type="button" onClick={() => setEditorTab('content')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'content' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <PenTool className="w-3.5 h-3.5 hidden sm:block" /> {copy.TABS.CONTENT}
            </button>
            <button type="button" onClick={() => setEditorTab('services')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'services' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Layers className="w-3.5 h-3.5 hidden sm:block" /> {servicesTabLabel}
            </button>
            <button type="button" onClick={() => setEditorTab('logistics')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'logistics' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Scale className="w-3.5 h-3.5 hidden sm:block" /> {copy.TABS.LOGISTICS}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#050505]">
            <div className={`${isLocked ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all duration-300`}>
              {editorTab === 'core' && <MediaTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} isClientPortal={false} />}
              {editorTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} isClientPortal={false} />}
              {editorTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} isClientPortal={false} />}
              {editorTab === 'logistics' && <LogisticsTab formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      )}

      {/* RIGHT PANEL: LIVE CANVAS IFRAME */}
      <div className={`${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex flex-1 bg-black relative flex-col transition-all duration-300 w-full h-full min-h-0`}>
        <div className="hidden lg:flex bg-zinc-900 border-b border-zinc-800 px-4 py-2 items-center gap-4 shrink-0 shadow-sm">
          <div className="flex gap-1.5 ml-2 items-center">
            <button 
              type="button"
              onClick={() => setControlsExpanded(!controlsExpanded)} 
              className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 rounded-lg text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
              title={controlsExpanded ? copy.COLLAPSE_CONTROLS : copy.EXPAND_CONTROLS}
            >
              {controlsExpanded ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="flex-1 max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-md py-1.5 px-3 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2 overflow-hidden">
              <MonitorSmartphone className="w-3 h-3 text-cyan-500 shrink-0" />
              <span className="text-[10px] font-mono text-zinc-400 truncate">
                {previewBaseUrl}/{formData.slug}?mode=canvas
              </span>
            </div>
            <button type="button" onClick={reloadCanvas} className="p-1.5 hover:bg-cyan-500/20 rounded-md text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30 shrink-0 cursor-pointer" title={copy.REFRESH_CANVAS}>
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="w-10"></div> 
        </div>

        <div className="flex-1 w-full h-full relative p-2 sm:p-4">
          <div className="w-full h-full rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 relative">
            <iframe 
              key={refreshKey} 
              src={`${previewBaseUrl}/${formData.slug}?mode=canvas&t=${refreshKey}`} 
              className="absolute inset-0 w-full h-full border-none bg-zinc-950" 
              title="Live Canvas" 
            />
          </div>
        </div>
      </div>

      {isLocked && (
        <SystemLockShield 
          status={formData.status}
          onOverride={() => setIsUnlocked(true)}
          onRevert={() => setFormData({ ...formData, status: 'BUILDING_CORE' })}
        />
      )}
    </div>
  );
}