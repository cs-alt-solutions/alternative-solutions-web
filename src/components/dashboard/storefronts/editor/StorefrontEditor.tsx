'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { X, PenTool, Palette, Image as ImageIcon, Layers, CreditCard, MonitorSmartphone, SlidersHorizontal, RefreshCw, Save, Loader2, Send } from 'lucide-react';
import { dispatchStagingReview } from '@/app/actions/storefronts';

import CoreTab from './CoreTab';
import DesignTab from './DesignTab';
import MediaTab from './MediaTab';
import CapabilitiesTab from './CapabilitiesTab';
import BillingTab from './BillingTab';
import DangerZoneCard from './DangerZoneCard';

export default function StorefrontEditor({ 
  store, 
  onClose, 
  onDelete 
}: { 
  store: any; 
  onClose: () => void; 
  onDelete?: () => void; 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [refreshKey, setRefreshKey] = useState(Date.now());

  // --- THE MASTER STATE ---
  const [formData, setFormData] = useState(store);
  const [isSaving, setIsSaving] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const reloadCanvas = () => setRefreshKey(Date.now());

  // --- MASTER SAVE PROTOCOL ---
  const handleMasterSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', store.id);
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

  // --- 🚀 NEW: STAGING REVIEW HANDOFF ---
  const handleSendForReview = async () => {
    if (!window.confirm(`Transmit staging review email to ${formData.contact_email || store.contact_email}? This will update the project status to IN REVIEW.`)) return;

    setIsDispatching(true);
    setSaveMessage('');
    
    try {
      // Auto-save any pending changes first so the client sees the exact current state
      await supabase.from('storefronts').update(formData).eq('id', store.id);
      
      await dispatchStagingReview(
        store.id,
        formData.slug || store.slug,
        formData.business_name || store.business_name,
        formData.contact_email || store.contact_email,
        formData.plan_tier || store.plan_tier || 'Standard Starter'
      );

      setSaveMessage('REVIEW SENT');
      router.refresh();
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      console.error("Dispatch error:", err);
      alert(`Transmission failed: ${err.message}`);
      setSaveMessage('SEND ERROR');
    } finally {
      setIsDispatching(false);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content & Story', icon: PenTool },
    { id: 'design', label: 'Architecture & Vibe', icon: Palette },
    { id: 'media', label: 'Media Ecosystem', icon: ImageIcon },
    { id: 'services', label: 'Services', icon: Layers }, 
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  const PREVIEW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between bg-zinc-950 border-b border-zinc-800 px-4 md:px-6 py-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-none">
              {store.business_name}
            </h2>
            <p className="text-cyan-400 text-[10px] md:text-xs font-mono mt-1">/{store.slug}</p>
          </div>
        </div>

        <div className="flex lg:hidden bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button onClick={() => setMobileView('editor')} className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all ${mobileView === 'editor' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500'}`}>
            <SlidersHorizontal className="w-3 h-3 md:w-4 md:h-4" /> Controls
          </button>
          <button onClick={() => setMobileView('preview')} className={`flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all ${mobileView === 'preview' ? 'bg-cyan-900/30 text-cyan-400 shadow border border-cyan-500/20' : 'text-zinc-500'}`}>
            <MonitorSmartphone className="w-3 h-3 md:w-4 md:h-4" /> Canvas
          </button>
        </div>

        <button onClick={onClose} className="flex items-center gap-2 px-3 py-2 md:px-4 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition-all cursor-pointer">
          <X className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold tracking-widest uppercase">Close</span>
        </button>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT PANE: CONTROLS */}
        <div className={`w-full lg:w-112.5 xl:w-137.5 flex flex-col border-r border-zinc-800 bg-bg-app relative z-10 ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* --- TAB & ACTION BAR --- */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-3 border-b border-zinc-800 bg-zinc-950 shrink-0 sticky top-0 z-20 shadow-sm">
            
            {/* TABS */}
            <div className="flex flex-wrap gap-1 flex-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'}`}>
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* 🚀 ACTION BUTTON DECK (SAVE + SEND FOR REVIEW) */}
            <div className="flex items-center gap-2 shrink-0 self-end xl:self-auto">
              
              <button 
                onClick={handleSendForReview} 
                disabled={isDispatching || isSaving}
                className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                  isDispatching || isSaving
                    ? 'bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed' 
                    : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_12px_rgba(192,38,213,0.3)] border border-fuchsia-500/40'
                }`}
                title="Send interactive staging link to client"
              >
                {isDispatching ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isDispatching ? 'TRANSMITTING...' : 'SEND FOR REVIEW'}</span>
              </button>

              <button 
                onClick={handleMasterSave} 
                disabled={isSaving || isDispatching}
                className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                  isSaving || isDispatching
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-zinc-950 shadow-[0_0_10px_rgba(8,145,178,0.3)]'
                }`}
              >
                {isSaving ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {isSaving ? 'SYNCING...' : 'SAVE ALL'}
              </button>
            </div>
          </div>

          {/* TELEMETRY FEEDBACK BAR */}
          {saveMessage && (
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-1.5 flex items-center justify-end">
              <span className="text-emerald-400 text-[9px] font-mono font-bold tracking-widest uppercase animate-pulse">
                • {saveMessage}
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950">
            {activeTab === 'content' && <CoreTab formData={formData} setFormData={setFormData} />}
            {activeTab === 'design' && <DesignTab formData={formData} setFormData={setFormData} />}
            {activeTab === 'media' && <MediaTab formData={formData} setFormData={setFormData} />}
            {activeTab === 'services' && <CapabilitiesTab formData={formData} setFormData={setFormData} />}
            {activeTab === 'billing' && <BillingTab formData={formData} setFormData={setFormData} />}
            
            <DangerZoneCard businessName={store.business_name} onDelete={onDelete} />
          </div>
        </div>

        {/* RIGHT PANE: LIVE CANVAS */}
        <div className={`flex-1 bg-[#050505] relative flex flex-col ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-4 shrink-0 shadow-sm">
            <div className="hidden sm:flex gap-1.5 ml-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
            
            <div className="flex-1 max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-md py-1.5 px-3 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2 overflow-hidden">
                <MonitorSmartphone className="w-3 h-3 text-cyan-500 shrink-0" />
                <span className="text-[10px] font-mono text-zinc-400 truncate">
                  {PREVIEW_BASE_URL}/{store.slug}
                </span>
              </div>
              <button onClick={reloadCanvas} className="p-1.5 hover:bg-cyan-500/20 rounded-md text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30 shrink-0 cursor-pointer" title="Refresh Live Canvas">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="w-10 hidden sm:block"></div> 
          </div>

          <div className="flex-1 w-full h-full relative p-0 sm:p-4 bg-zinc-950">
            <div className="w-full h-full rounded-none sm:rounded-xl overflow-hidden border-0 sm:border border-zinc-800 shadow-2xl bg-white relative">
              <iframe key={refreshKey} src={`${PREVIEW_BASE_URL}/${store.slug}?t=${refreshKey}`} className="absolute inset-0 w-full h-full border-none" title="Live Canvas" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}