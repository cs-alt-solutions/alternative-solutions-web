/* src/app/dashboard/storefronts/[id]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Layout, Server, ExternalLink, Loader2, Save, ArrowLeft, FileUp, Layers } from 'lucide-react';

import StorefrontCanvas from '@/components/dashboard/storefronts/editor/StorefrontCanvas';
import GridTab from '@/components/dashboard/storefronts/editor/GridTab';
import VaultTab from '@/components/dashboard/storefronts/editor/vault/VaultTab';
import { deleteStorefront } from '@/app/actions/storefronts';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

export default function TenantCommandHub() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'grid' | 'vault'>('canvas');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isUnlocked, setIsUnlocked] = useState(false);

  const PREVIEW_BASE_URL = 'https://storefronts.alternativesolutions.io';
  const copy = EDITOR_WORKSPACE_COPY.COMMAND_HUB;

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

  // Window resize trigger to ensure iframe fills smoothly on tab switch
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const reloadCanvas = () => setRefreshKey(Date.now());

  const handleMasterSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', formData.id);
      if (error) throw new Error(error.message || "Database rejected the payload.");
      
      setSaveMessage(copy.SAVED_MSG);
      router.refresh();
      reloadCanvas();
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      console.error("Save error caught:", err);
      setSaveMessage(err.message?.substring(0, 30) + '...' || copy.SAVE_ERR);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStorefrontTermination = async () => {
    const warningText = `${STOREFRONT_EDITOR_COPY.TERMINATION.CONFIRM_PREFIX}${formData.business_name}${STOREFRONT_EDITOR_COPY.TERMINATION.CONFIRM_SUFFIX}`;
    if (!window.confirm(warningText)) return;

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
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{copy.INITIALIZING}</span>
      </div>
    );
  }

  if (!formData) return <div className="absolute inset-0 z-30 p-8 text-white bg-black">{copy.NOT_FOUND}</div>;

  const isLocked = !isUnlocked && ['IN_REVIEW', 'ACTIVE', 'LIVE', 'MAINTENANCE'].includes(formData.status);
  const engineMode = formData.engine_mode || 'core';

  return (
    <div className="absolute inset-0 z-30 bg-black flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* HUB HEADER */}
      <header className="border-b border-white/5 bg-zinc-950 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <Link href="/dashboard/storefronts" className="p-2 -ml-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-widest shrink-0">
                {copy.BADGE}
              </span>
              <span className="text-zinc-500 font-mono text-[11px] truncate">/{formData.slug}</span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight truncate">
              {formData.business_name}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {saveMessage && (
            <span className="hidden xl:inline text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse mr-1">
              • {saveMessage}
            </span>
          )}
          <button type="button" onClick={handleMasterSave} disabled={isSaving} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? copy.SYNCING_BTN : copy.SAVE_BTN}</span>
          </button>
          <a href={`https://${formData.custom_domain || `storefronts.alternativesolutions.io/${formData.slug}`}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-cyan-400 hover:text-cyan-400 text-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all">
            <span className="hidden md:inline">{copy.LIVE_TELEMETRY}</span> <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* COMMAND NAVIGATION + ARCHITECTURE TIER SELECTOR */}
      <nav className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto hide-scrollbar">
          <button type="button" onClick={() => setActiveTab('canvas')} className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'canvas' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            <Layout size={14} /> {copy.NAV_CANVAS}
          </button>
          <button type="button" onClick={() => setActiveTab('grid')} className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'grid' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            <Server size={14} /> {copy.NAV_GRID}
          </button>
          <button type="button" onClick={() => setActiveTab('vault')} className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'vault' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            <FileUp size={14} /> {copy.NAV_VAULT}
          </button>
        </div>

        {/* ARCHITECTURE TIER PILL */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1 my-1 shadow-inner shrink-0">
          <Layers size={12} className={engineMode === 'hub' ? 'text-indigo-400' : 'text-cyan-400'} />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hidden sm:inline">
            {copy.ARCH_TIER_LABEL}
          </span>
          <select
            value={engineMode}
            onChange={(e) => setFormData({ ...formData, engine_mode: e.target.value })}
            className={`bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none ${
              engineMode === 'hub' ? 'text-indigo-400' : 'text-white'
            }`}
          >
            <option value="core" className="bg-zinc-900 text-white">{copy.TIER_CORE}</option>
            <option value="hub" className="bg-zinc-900 text-indigo-400">{copy.TIER_HUB}</option>
          </select>
        </div>
      </nav>

      {/* DYNAMIC WORKSPACE */}
      <div className="flex-1 flex overflow-hidden w-full relative min-h-0">
        
        {activeTab === 'canvas' && (
          <StorefrontCanvas 
            formData={formData} 
            setFormData={setFormData} 
            refreshKey={refreshKey} 
            reloadCanvas={reloadCanvas} 
            isLocked={isLocked} 
            setIsUnlocked={setIsUnlocked} 
            previewBaseUrl={PREVIEW_BASE_URL} 
          />
        )}

        {activeTab === 'grid' && (
          <div className="w-full h-full overflow-y-auto custom-scrollbar">
             <GridTab formData={formData} setFormData={setFormData} onTerminate={handleStorefrontTermination} />
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <VaultTab storeId={formData.id} formData={formData} setFormData={setFormData} onReload={reloadCanvas} />
          </div>
        )}

      </div>
    </div>
  );
}