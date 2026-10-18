/* src/app/dashboard/storefronts/[id]/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Layout, Server, ExternalLink, Loader2, Save, ArrowLeft, FileUp } from 'lucide-react';

import StorefrontCanvas from '@/components/dashboard/storefronts/editor/StorefrontCanvas';
import GridTab from '@/components/dashboard/storefronts/editor/GridTab';
import VaultTab from '@/components/dashboard/storefronts/editor/vault/VaultTab';
import { deleteStorefront } from '@/app/actions/storefronts';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';

export default function TenantCommandHub() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'canvas' | 'grid' | 'vault'>('canvas');
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isUnlocked, setIsUnlocked] = useState(false);

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

  // Window resize hack to fix iframe loading gaps on tab change
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed, activeTab]);

  const reloadCanvas = () => setRefreshKey(Date.now());

  const handleMasterSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', formData.id);
      if (error) throw new Error(error.message || "Database rejected the payload.");
      
      setSaveMessage('SYSTEM SAVED');
      router.refresh();
      reloadCanvas();
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      console.error("Save error caught:", err);
      setSaveMessage(err.message?.substring(0, 30) + '...' || 'SAVE ERROR');
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
      <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 flex flex-col items-center justify-center bg-black`}>
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Initializing Hub...</span>
      </div>
    );
  }

  if (!formData) return <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 p-8 text-white bg-black`}>Tenant not found.</div>;

  const isLocked = !isUnlocked && ['IN_REVIEW', 'ACTIVE', 'LIVE', 'MAINTENANCE'].includes(formData.status);

  return (
    <div className={`fixed top-0 right-0 bottom-0 left-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} z-40 bg-black flex flex-col overflow-hidden animate-in fade-in duration-300`}>
      
      {/* HUB HEADER */}
      <header className="border-b border-white/5 bg-zinc-950 px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/storefronts" className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer">
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
          {saveMessage && <span className="hidden sm:inline text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse mr-2">• {saveMessage}</span>}
          <button onClick={handleMasterSave} disabled={isSaving} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer">
            {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaving ? 'SYNCING...' : 'SAVE STATE'}</span>
          </button>
          <a href={`https://${formData.custom_domain || `storefronts.alternativesolutions.io/${formData.slug}`}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-cyan-400 hover:text-cyan-400 text-zinc-300 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all">
            <span className="hidden sm:inline">Live Telemetry</span> <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* COMMAND NAVIGATION */}
      <nav className="flex items-center gap-4 md:gap-6 px-4 md:px-6 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <button onClick={() => setActiveTab('canvas')} className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'canvas' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <Layout size={14} className="md:w-4 md:h-4" /> The Canvas
        </button>
        <button onClick={() => setActiveTab('grid')} className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'grid' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <Server size={14} className="md:w-4 md:h-4" /> The Grid
        </button>
        <button onClick={() => setActiveTab('vault')} className={`flex items-center gap-2 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${activeTab === 'vault' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <FileUp size={14} className="md:w-4 md:h-4" /> Drop Vault
        </button>
      </nav>

      {/* DYNAMIC WORKSPACE */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
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