/* src/components/portal/live-storefront/StorefrontManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Save, CheckCircle2, Loader2, PenTool, Layers, 
  Unlock, Lock, AlertTriangle, MonitorSmartphone, RefreshCw 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';

// 🚀 SINGLE SOURCE OF TRUTH: Import the exact Admin Dashboard components!
import CoreTab from '@/components/dashboard/storefronts/editor/CoreTab';
import CapabilitiesTab from '@/components/dashboard/storefronts/editor/CapabilitiesTab';

export default function StorefrontManager({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [editorTab, setEditorTab] = useState<'content' | 'services'>('content');
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const currentTheme = getPortalTheme(store.id);
  const [formData, setFormData] = useState(store);

  const reloadCanvas = () => setRefreshKey(Date.now());

  // 🚀 The client now has the power to unlock their own content manager
  const handleUnlock = () => {
    const isSure = window.confirm("Hold up! 🚨 You are unlocking the live editor. This isn't a test mode—anything you publish here instantly updates your actual website. Ready to dive in?");
    if (isSure) setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('storefronts')
        .update(formData)
        .eq('id', store.id);

      if (error) throw error;
      
      setSaved(true);
      router.refresh(); 
      reloadCanvas();
      
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const PREVIEW_BASE_URL = 'https://storefronts.alternativesolutions.io';

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      
      {/* MOBILE WARNING */}
      <div className="md:hidden mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl p-6 text-center shadow-lg shrink-0">
        <MonitorSmartphone className="mx-auto w-8 h-8 text-cyan-500 mb-3" />
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-2">Desktop Recommended</h3>
        <p className="text-xs text-cyan-500/80 leading-relaxed">
          The live preview is optimized for larger displays.
        </p>
      </div>

      {/* VIBE CHECK BANNER */}
      <div className={`shrink-0 mb-6 bg-zinc-950/80 border ${currentTheme.border} rounded-3xl p-5 md:p-6 flex flex-col md:flex-row gap-4 shadow-xl backdrop-blur-md items-start md:items-center`}>
        <div className={`p-3 ${currentTheme.bg} rounded-xl shrink-0`}>
          <PenTool className={`w-6 h-6 ${currentTheme.text}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-black ${currentTheme.text} uppercase tracking-widest mb-1.5`}>
            {PORTAL_COPY.storefront.vibeCheckTitle}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {PORTAL_COPY.storefront.vibeCheckBody}
          </p>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div className="shrink-0 mb-6 flex gap-3">
        {!isEditing ? (
          <button 
            onClick={handleUnlock}
            className={`w-full flex items-center justify-center gap-2 ${currentTheme.bg} hover:brightness-110 ${currentTheme.text} border ${currentTheme.border} px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.1)]`}
          >
            <Unlock size={16} /> Unlock Content Manager
          </button>
        ) : (
          <>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Compiling...</> : saved ? <><CheckCircle2 size={16} /> Live Synced</> : <><Save size={16} /> Publish Changes</>}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
              title="Lock Editor"
            >
              <Lock size={16} />
            </button>
          </>
        )}
      </div>

      {isEditing && (
        <div className="shrink-0 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-400/90 font-mono uppercase tracking-widest leading-relaxed">
            Live Editor Unlocked. Any changes published will immediately reflect on the production network.
          </p>
        </div>
      )}

      {/* SPLIT SCREEN WORKSPACE */}
      <div className={`flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden transition-all duration-500 ${!isEditing ? 'opacity-50 grayscale-30 pointer-events-none' : 'opacity-100'}`}>
        
        {/* LEFT: CONTROLS */}
        <div className="w-full lg:w-96 xl:w-md flex flex-col border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden shrink-0 shadow-xl">
          <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
            <button onClick={() => setEditorTab('content')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'content' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <PenTool className="w-3.5 h-3.5" /> Content
            </button>
            <button onClick={() => setEditorTab('services')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'services' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
              <Layers className="w-3.5 h-3.5" /> Services
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {editorTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
            {editorTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
          </div>
        </div>

        {/* RIGHT: LIVE IFRAME PREVIEW */}
        <div className="hidden md:flex flex-1 flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <MonitorSmartphone className="w-3 h-3 text-cyan-500 shrink-0" />
              <span className="text-[10px] font-mono text-zinc-400 truncate">
                {PREVIEW_BASE_URL}/{formData.slug}?mode=canvas
              </span>
            </div>
            <button onClick={reloadCanvas} className="p-1.5 hover:bg-cyan-500/20 rounded-md text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30 shrink-0 cursor-pointer" title="Refresh Live Canvas">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 w-full h-full relative bg-zinc-950">
            <iframe 
              key={refreshKey} 
              src={`${PREVIEW_BASE_URL}/${formData.slug}?mode=canvas&t=${refreshKey}`} 
              className="absolute inset-0 w-full h-full border-none" 
              title="Live Canvas" 
            />
          </div>
        </div>

      </div>

    </div>
  );
}