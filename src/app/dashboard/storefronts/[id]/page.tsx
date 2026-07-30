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
  CreditCard, 
  Globe, 
  MonitorSmartphone, 
  RefreshCw,
  PenTool,
  Palette,
  Image as ImageIcon,
  Layers,
  Save,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

import CoreTab from '@/components/dashboard/storefronts/editor/CoreTab';
import VisualArchitecture from '@/components/dashboard/storefronts/editor/core/VisualArchitecture';
import MediaTab from '@/components/dashboard/storefronts/editor/MediaTab';
import CapabilitiesTab from '@/components/dashboard/storefronts/editor/CapabilitiesTab';
import DangerZoneCard from '@/components/dashboard/storefronts/editor/DangerZoneCard';
import StagingTab from '@/components/dashboard/storefronts/editor/staging/StagingTab';
import { deleteStorefront } from '@/app/actions/storefronts';

export default function TenantCommandHub() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'staging' | 'grid'>('canvas');
  const [editorTab, setEditorTab] = useState<'content' | 'design' | 'media' | 'services'>('content');
  const [controlsExpanded, setControlsExpanded] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const PREVIEW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';

  useEffect(() => {
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
      <div className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-40 flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Initializing Hub...</span>
      </div>
    );
  }

  if (!formData) return <div className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-40 p-8 text-white bg-black">Tenant not found.</div>;

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-40 bg-black flex flex-col overflow-hidden animate-in fade-in duration-300">
      
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
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================= */}
        {/* TAB 1: THE CANVAS                         */}
        {/* ========================================= */}
        {activeTab === 'canvas' && (
          <div className="flex w-full h-full">
            
            {/* LEFT PANE: CONTROLS (COLLAPSIBLE) */}
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
                  {editorTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} />}
                  {editorTab === 'design' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 relative">
                      <VisualArchitecture formData={formData} setFormData={setFormData} />
                    </div>
                  )}
                  {editorTab === 'media' && <MediaTab formData={formData} setFormData={setFormData} />}
                  {editorTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} />}
                </div>
              </div>
            )}

            {/* RIGHT PANE: IFRAME */}
            <div className="hidden lg:flex flex-1 bg-black relative flex-col transition-all duration-300">
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-4 shrink-0 shadow-sm">
                
                {/* TOGGLE BUTTON */}
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

        {/* ========================================= */}
        {/* TAB 2: STAGING & SCOPE                    */}
        {/* ========================================= */}
        {activeTab === 'staging' && (
          <div className="w-full h-full relative bg-zinc-950">
            <StagingTab formData={formData} setFormData={setFormData} />
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: THE GRID                           */}
        {/* ========================================= */}
        {activeTab === 'grid' && (
          <div className="w-full h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-5xl mx-auto flex flex-col gap-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
              
              {/* Row 1: Billing & Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-62.5 shadow-lg">
                  <CreditCard size={48} className="text-emerald-400 mb-6" />
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-widest text-xs shadow-inner">
                    {formData.billing_status || 'Pending Checkout'}
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Financial Engine</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    Active recurring plan and payment status. This directly ties into your Stripe infrastructure.
                  </p>
                  <div className="bg-black border border-zinc-800 rounded-xl p-4 shadow-inner">
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Plan Tier</span>
                    <span className="text-white font-bold uppercase tracking-wider">{formData.plan_tier || formData.selected_plan || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Custom DNS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-4 md:order-1 order-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Domain Routing</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    Wire up their professional .com address directly into the edge network.
                  </p>
                  <div className="bg-black border border-zinc-800 rounded-xl p-4 shadow-inner">
                    <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target Address</span>
                    <span className="text-cyan-400 font-mono font-bold tracking-wider truncate block">
                      {formData.custom_domain ? `https://${formData.custom_domain}` : 'Awaiting DNS Assignment'}
                    </span>
                  </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-62.5 shadow-lg md:order-2 order-1">
                  <Globe size={48} className="text-cyan-400 mb-6" />
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 cursor-pointer">
                    Configure DNS
                  </button>
                </div>
              </div>

              {/* Row 3: System Classification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-62.5 shadow-lg">
                  <label className="flex flex-col items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.is_template || false}
                        onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                      />
                      <div className={`block w-16 h-8 rounded-full transition-colors ${formData.is_template ? 'bg-fuchsia-500' : 'bg-zinc-800 border border-zinc-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.is_template ? 'translate-x-8' : ''}`}></div>
                    </div>
                    <span className="text-white font-black uppercase tracking-widest text-xs group-hover:text-cyan-400 transition-colors">
                      {formData.is_template ? 'Public Prototype' : 'Private Tenant'}
                    </span>
                  </label>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Classification</h3>
                  <p className="text-zinc-400 leading-relaxed font-light">
                    Toggle this setting to designate whether this build is a live customer tenant or a public prototype template intended for the main gallery.
                  </p>
                </div>
              </div>
              
              {/* Z-PATTERN AWARENESS: Keeping layout consistent with the grid's zigzag flow */}
              <div className="border-t border-zinc-800/80 pt-12 mt-4">
                <DangerZoneCard businessName={formData.business_name} onDelete={handleStorefrontTermination} />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}