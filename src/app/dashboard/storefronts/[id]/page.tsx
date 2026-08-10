// src/app/dashboard/storefronts/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { 
  Layout, 
  FileCheck, 
  Server, 
  ExternalLink, 
  Loader2, 
  MonitorSmartphone, 
  RefreshCw,
  PenTool,
  Palette,
  Image as ImageIcon,
  Layers,
  Save,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,           // <-- Added Lock import
  ShieldAlert
} from 'lucide-react';

import CoreTab from '@/components/dashboard/storefronts/editor/CoreTab';
import VisualArchitecture from '@/components/dashboard/storefronts/editor/core/VisualArchitecture';
import MediaTab from '@/components/dashboard/storefronts/editor/MediaTab';
import CapabilitiesTab from '@/components/dashboard/storefronts/editor/CapabilitiesTab';
import StagingTab from '@/components/dashboard/storefronts/editor/staging/StagingTab';
import GridTab from '@/components/dashboard/storefronts/editor/GridTab';
import { deleteStorefront } from '@/app/actions/storefronts';

export default function TenantCommandHub() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'staging' | 'grid'>('canvas');
  const [editorTab, setEditorTab] = useState<'content' | 'design' | 'media' | 'services'>('content');
  const [controlsExpanded, setControlsExpanded] = useState(true);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const PREVIEW_BASE_URL = 'https://storefronts.alternativesolutions.io';

  useEffect(() => {
    const storedState = localStorage.getItem('sidebar-collapsed') || localStorage.getItem('isCollapsed');
    if (storedState === 'true') {
      setIsSidebarCollapsed(true);
    }

    const handleCollapse = (e: any) => setIsSidebarCollapsed(e.detail.isCollapsed);
    window.addEventListener('sidebar-collapse', handleCollapse);

    const fetchTenant = async () => {
      const { data, error } = await supabase
        .from('storefronts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) setFormData(data);
      if (error) console.error("Error fetching tenant:", error);
      setIsLoading(false);
    };
    
    fetchTenant();

    return () => {
      window.removeEventListener('sidebar-collapse', handleCollapse);
    };
  }, [id]);

  const reloadCanvas = () => setRefreshKey(Date.now());

  const handleMasterSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', formData.id);
      if (error) throw error;
      
      setSaveMessage('SYSTEM SAVED');
      router.refresh();
      reloadCanvas();
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage('SAVE ERROR');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStorefrontTermination = async () => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${formData.business_name}"? This will obliterate client data and cannot be reversed.`)) return;

    try {
      await deleteStorefront(formData.id);
      router.push('/dashboard/storefronts');
    } catch (err: any) {
      console.error("Termination failed:", err);
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 flex flex-col items-center justify-center bg-black`}>
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Initializing Hub...</span>
      </div>
    );
  }

  if (!formData) return <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 p-8 text-white bg-black`}>Tenant not found.</div>;

  return (
    <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 bg-black flex flex-col overflow-hidden animate-in fade-in duration-300`}>
      
      {/* HUB HEADER */}
      <header className="border-b border-white/5 bg-zinc-950 px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/storefronts"
            className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
            title="Return to Storefronts"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                Tenant Hub
              </span>
              <span className="text-zinc-500 font-mono text-xs">{formData.slug}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              {formData.business_name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="hidden sm:inline text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse mr-2">
              • {saveMessage}
            </span>
          )}
          <button 
            onClick={handleMasterSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaving ? 'SYNCING...' : 'SAVE STATE'}</span>
          </button>
          <a 
            href={`https://${formData.custom_domain || `storefronts.alternativesolutions.io/${formData.slug}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-cyan-400 hover:text-cyan-400 text-zinc-300 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all"
          >
            <span className="hidden sm:inline">Live Telemetry</span> <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* COMMAND NAVIGATION */}
      <nav className="flex items-center gap-4 md:gap-6 px-4 md:px-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <button 
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'canvas' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Layout size={14} className="md:w-4 md:h-4" /> The Canvas
        </button>
        <button 
          onClick={() => setActiveTab('staging')}
          className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'staging' ? 'border-fuchsia-400 text-fuchsia-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <FileCheck size={14} className="md:w-4 md:h-4" /> Staging & Scope
        </button>
        <button 
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'grid' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Server size={14} className="md:w-4 md:h-4" /> The Grid
        </button>
      </nav>

      {/* DYNAMIC WORKSPACE */}
      {/* 👇 Added 'relative' class below so the absolute lock shield perfectly bounds to this space */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* TAB 1: THE CANVAS */}
        {activeTab === 'canvas' && (
          <div className="flex w-full h-full">
            {controlsExpanded && (
              <div className="w-full lg:w-96 xl:w-md flex flex-col border-r border-zinc-800 bg-zinc-950 z-10 shrink-0 animate-in slide-in-from-left-4 duration-300">
                <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50">
                  <button onClick={() => setEditorTab('content')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'content' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                    <PenTool className="w-3.5 h-3.5 hidden sm:block" /> Content
                  </button>
                  <button onClick={() => setEditorTab('design')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'design' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                    <Palette className="w-3.5 h-3.5 hidden sm:block" /> Design
                  </button>
                  <button onClick={() => setEditorTab('media')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'media' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                    <ImageIcon className="w-3.5 h-3.5 hidden sm:block" /> Media
                  </button>
                  <button onClick={() => setEditorTab('services')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${editorTab === 'services' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                    <Layers className="w-3.5 h-3.5 hidden sm:block" /> Services
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {editorTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
                  {editorTab === 'design' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 relative">
                      <VisualArchitecture formData={formData} setFormData={setFormData} />
                    </div>
                  )}
                  {editorTab === 'media' && <MediaTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
                  {editorTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} onReload={reloadCanvas} />}
                </div>
              </div>
            )}

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
                      {PREVIEW_BASE_URL}/{formData.slug}?mode=canvas
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
                    src={`${PREVIEW_BASE_URL}/${formData.slug}?mode=canvas&t=${refreshKey}`} 
                    className="absolute inset-0 w-full h-full border-none bg-zinc-950" 
                    title="Live Canvas" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAGING & SCOPE */}
        {activeTab === 'staging' && (
          <div className="w-full h-full relative bg-zinc-950">
            <StagingTab formData={formData} setFormData={setFormData} />
          </div>
        )}

        {/* TAB 3: THE GRID */}
        {activeTab === 'grid' && (
           <GridTab formData={formData} setFormData={setFormData} onTerminate={handleStorefrontTermination} />
        )}

        {/* 🚨 THE GLOBAL SYSTEM LOCK SHIELD 🚨 */}
        {/* Placed at the very end of the DYNAMIC WORKSPACE so it perfectly overlays the tabs below the header */}
        
{['IN REVIEW', 'APPROVED', 'LIVE'].includes(formData.status) && activeTab !== 'grid' && (
          <div className="absolute inset-0 z-100 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_100px_rgba(6,182,212,0.05)] transition-all duration-500 animate-in fade-in zoom-in-95">
            
            <div className="bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center max-w-md text-center shadow-2xl">
              <div className="p-4 bg-cyan-500/10 rounded-full mb-4 border border-cyan-500/20">
                <Lock size={32} className="text-cyan-400 animate-pulse" />
              </div>
              
              <h2 className="text-lg font-black text-white tracking-[0.2em] uppercase mb-2">
                System Locked
              </h2>
              
              <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 mb-4 tracking-widest uppercase">
                STATUS: {formData.status}
              </div>
              
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium mb-8">
                The architecture is currently secured for client review or active deployment. The Canvas and all Editor configurations are strictly read-only to prevent accidental data contamination.
              </p>
              
              {/* OVERRIDE BUTTON */}
              <button 
                onClick={() => setFormData({ ...formData, status: 'BUILDING' })}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-cyan-500 py-3 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all group cursor-pointer"
              >
                <ShieldAlert size={12} className="group-hover:text-cyan-400 transition-colors" />
                Override & Return to Building
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}