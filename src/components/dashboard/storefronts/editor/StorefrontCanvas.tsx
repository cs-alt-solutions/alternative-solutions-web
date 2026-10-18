/* src/components/dashboard/storefronts/editor/StorefrontCanvas.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  PenTool, Palette, Image as ImageIcon, Layers, Scale, 
  PanelLeftClose, PanelLeftOpen, MonitorSmartphone, RefreshCw, Tag 
} from 'lucide-react';

import CoreTab from './CoreTab';
import VisualArchitecture from './core/VisualArchitecture';
import MediaTab from './MediaTab';
import CapabilitiesTab from './CapabilitiesTab';
import LogisticsTab from './LogisticsTab';
import SystemLockShield from './SystemLockShield';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';

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
  const [editorTab, setEditorTab] = useState<'content' | 'design' | 'media' | 'services' | 'logistics'>('content');
  const [controlsExpanded, setControlsExpanded] = useState(true);

  const industryTag = formData.industry_tag || 'General';
  let servicesTabLabel = STOREFRONT_EDITOR_COPY.DYNAMIC_TABS?.DEFAULT || 'Services';
  if (industryTag === 'Culinary') servicesTabLabel = STOREFRONT_EDITOR_COPY.DYNAMIC_TABS?.CULINARY || 'Menu';
  if (industryTag === 'Creative') servicesTabLabel = STOREFRONT_EDITOR_COPY.DYNAMIC_TABS?.CREATIVE || 'Portfolio';
  if (industryTag === 'Contracting') servicesTabLabel = STOREFRONT_EDITOR_COPY.DYNAMIC_TABS?.CONTRACTING || 'Services';

  // Fixes the ghost iframe gap issue when tabs change
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [controlsExpanded, editorTab]);

  return (
    <div className="flex w-full h-full relative">
      
      {/* THE SIDEBAR EDITOR */}
      {controlsExpanded && (
        <div className="w-full lg:w-96 xl:w-md flex flex-col border-r border-zinc-800 bg-zinc-950 z-10 shrink-0 animate-in slide-in-from-left-4 duration-300">
          
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center gap-3 shadow-inner">
              <div className="p-1.5 bg-zinc-800 rounded text-cyan-400">
                <Tag size={12} />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Industry Category</label>
                <select 
                  value={industryTag}
                  onChange={(e) => setFormData({ ...formData, industry_tag: e.target.value })}
                  className="w-full bg-transparent text-xs text-white font-bold outline-none cursor-pointer appearance-none"
                >
                  {STOREFRONT_EDITOR_COPY.INDUSTRIES?.map((cat: { id: string, label: string }) => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50">
            <button onClick={() => setEditorTab('content')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'content' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <PenTool className="w-3.5 h-3.5 hidden xl:block" /> Content
            </button>
            <button onClick={() => setEditorTab('design')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'design' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Palette className="w-3.5 h-3.5 hidden xl:block" /> Design
            </button>
            <button onClick={() => setEditorTab('media')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'media' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <ImageIcon className="w-3.5 h-3.5 hidden xl:block" /> Media
            </button>
            <button onClick={() => setEditorTab('services')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'services' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Layers className="w-3.5 h-3.5 hidden xl:block" /> {servicesTabLabel.split(' ')[0]}
            </button>
            <button onClick={() => setEditorTab('logistics')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'logistics' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Scale className="w-3.5 h-3.5 hidden xl:block" /> Logistics
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#050505]">
            <div className={`${isLocked ? 'opacity-50 pointer-events-none grayscale' : ''} transition-all duration-300`}>
              {editorTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
              {editorTab === 'design' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 relative">
                  <VisualArchitecture formData={formData} setFormData={setFormData} />
                </div>
              )}
              {editorTab === 'media' && <MediaTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
              {editorTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
              {editorTab === 'logistics' && <LogisticsTab formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      )}

      {/* THE IFRAME PREVIEW */}
      <div className="hidden lg:flex flex-1 bg-black relative flex-col transition-all duration-300 w-full">
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="hidden sm:flex gap-1.5 ml-2 items-center">
            <button 
              onClick={() => setControlsExpanded(!controlsExpanded)} 
              className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 rounded-lg text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
              title={controlsExpanded ? "Collapse Controls" : "Expand Controls"}
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
            <button onClick={reloadCanvas} className="p-1.5 hover:bg-cyan-500/20 rounded-md text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30 shrink-0 cursor-pointer" title="Refresh Live Canvas">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="w-10 hidden sm:block"></div> 
        </div>

        <div className="flex-1 w-full h-full relative p-4">
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

      {/* THE GLOBAL SYSTEM LOCK SHIELD OVERLAY */}
      {isLocked && (
        <SystemLockShield 
          status={formData.status}
          onOverride={() => setIsUnlocked(true)}
          onRevert={() => setFormData({ ...formData, status: 'BUILDING' })}
        />
      )}

    </div>
  );
}