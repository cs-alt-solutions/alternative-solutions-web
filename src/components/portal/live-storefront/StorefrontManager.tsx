/* src/components/portal/live-storefront/StorefrontManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Save, CheckCircle2, Loader2, Type, AlignLeft, 
  Sparkles, Lock, AlertTriangle, Image as ImageIcon, Key, Clock, MonitorSmartphone, ChevronDown 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import HeroTab from './tabs/HeroTab';
import StoryTab from './tabs/StoryTab';
import MediaTab from './tabs/MediaTab'; 
import ServicesTab from './tabs/ServicesTab';
import { PORTAL_COPY } from '@/config/clients/portal';

export default function StorefrontManager({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'HERO' | 'STORY' | 'MEDIA' | 'SERVICES'>('HERO');
  const [accessState, setAccessState] = useState<'LOCKED' | 'REQUESTED' | 'UNLOCKED'>('LOCKED');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const safeSocials = typeof store.social_handles === 'string' ? JSON.parse(store.social_handles) : (store.social_handles || {});
  const safeCapabilities = Array.isArray(store.capabilities) ? store.capabilities : [];
  
  // 🚀 THE FIX: Standardized to 'imageUrl' and auto-healing broken 'url' data
  const rawGallery = Array.isArray(store.gallery_items) ? store.gallery_items : [];
  const safeGallery = rawGallery.map((item: any) => {
    if (typeof item === 'string') return { imageUrl: item, caption: '' };
    // Auto-heal if the database currently has the broken 'url' key
    if (item.url && !item.imageUrl) item.imageUrl = item.url;
    return item;
  });

  const [formData, setFormData] = useState({
    tagline: store.tagline || '',
    subtext: store.subtext || '',
    about_bio: store.about_bio || '',
    contact_email: store.contact_email || '',
    hero_image: store.hero_image || '',
    about_image: store.about_image || '',
    brand_logo: store.brand_logo || '',
    gallery_items: safeGallery, 
    social_handles: safeSocials,
    capabilities: safeCapabilities,
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleRequestKeys = async () => {
    setIsRequesting(true);
    try {
      const { error } = await supabase.from('support_tickets').insert([{
        storefront_id: store.id,
        category: 'System Request',
        topic: 'Unlock Editor Keys',
        details: 'Client has requested access to unlock their live storefront editor for structural/copy changes.',
        status: 'OPEN'
      }]);
      if (error) throw error;
      setAccessState('REQUESTED');
      setIsInfoExpanded(false); // Auto-collapse the accordion once requested
    } catch (error) {
      console.error("Failed to request keys:", error);
      alert("Failed to transmit request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', store.id);
      if (error) throw error;
      
      setSaved(true);
      router.refresh(); 
      setTimeout(() => {
        setSaved(false);
        setAccessState('LOCKED'); 
      }, 3000);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'HERO', label: 'Hero', icon: Type, color: 'text-cyan-400', border: 'border-cyan-500' },
    { id: 'STORY', label: 'Story & Links', icon: AlignLeft, color: 'text-fuchsia-400', border: 'border-fuchsia-500' },
    { id: 'MEDIA', label: 'Gallery', icon: ImageIcon, color: 'text-rose-400', border: 'border-rose-500' }, 
    { id: 'SERVICES', label: 'Services', icon: Sparkles, color: 'text-orange-400', border: 'border-orange-500' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden pt-4 md:pt-0">
      
      {/* MOBILE-ONLY WARNING */}
      <div className="md:hidden mb-6 bg-orange-500/10 border border-orange-500/30 rounded-3xl p-6 text-center shadow-lg">
        <MonitorSmartphone className="mx-auto w-8 h-8 text-orange-500 mb-3" />
        <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-2">Desktop Required</h3>
        <p className="text-xs text-orange-500/80 leading-relaxed">
          The Content Manager contains complex layout controls and is optimized exclusively for desktop displays. Please log in from a computer to modify your live site.
        </p>
      </div>

      <div className="hidden md:flex flex-col flex-1 overflow-hidden min-h-0">
        
        {/* COMPACT ORANGE ACCESS ACCORDION */}
        {accessState === 'LOCKED' && (
          <div className="shrink-0 mb-6 bg-orange-500/10 border border-orange-500/30 rounded-xl shadow-sm transition-all overflow-hidden flex flex-col">
            <button 
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-orange-500/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-orange-500/20 rounded-md text-orange-400 shrink-0">
                  <Lock size={14} />
                </div>
                <h3 className="text-[10px] md:text-xs font-bold text-orange-400 uppercase tracking-widest text-left">
                  {PORTAL_COPY.storefront.lockedTitle}
                </h3>
              </div>
              <ChevronDown size={16} className={`text-orange-500/70 transition-transform duration-300 ${isInfoExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {/* The Accordion Dropdown Body */}
            <div className={`grid transition-all duration-300 ${isInfoExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="p-4 pt-0 border-t border-orange-500/10 mt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <p className="text-xs text-orange-500/80 leading-relaxed max-w-2xl text-left">
                    {PORTAL_COPY.storefront.lockedBody}
                  </p>
                  <button 
                    onClick={handleRequestKeys}
                    disabled={isRequesting}
                    className="shrink-0 w-full md:w-auto flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-400 text-orange-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRequesting ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                    {isRequesting ? 'Requesting...' : PORTAL_COPY.storefront.requestKeysBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {accessState === 'REQUESTED' && (
          <div className="shrink-0 mb-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <Clock className="text-orange-500 w-6 h-6 animate-pulse shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-0.5">
                {PORTAL_COPY.storefront.keysRequested}
              </h3>
              <p className="text-xs text-orange-500/70 leading-relaxed">
                {PORTAL_COPY.storefront.keysPendingBody}
              </p>
            </div>
          </div>
        )}

        {accessState === 'UNLOCKED' && (
          <div className="shrink-0 mb-6 flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 flex items-center justify-center gap-3">
              <AlertTriangle size={16} className="text-orange-500 shrink-0" />
              <p className="text-xs text-orange-400/90 font-mono uppercase tracking-widest">
                Live Editor Unlocked. Changes publish instantly.
              </p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Compiling...</> : saved ? <><CheckCircle2 size={16} /> Live Synced</> : <><Save size={16} /> Publish Changes</>}
            </button>
            <button 
              onClick={() => setAccessState('LOCKED')}
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
              title="Lock Editor"
            >
              <Lock size={16} />
            </button>
          </div>
        )}

        {/* EDITOR TABS */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4 shrink-0 pb-3 border-b border-white/5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? `bg-zinc-900 border ${tab.border} ${tab.color} shadow-inner` 
                  : 'bg-zinc-950/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300 cursor-pointer'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* EDITOR AREA */}
        <fieldset 
          disabled={accessState !== 'UNLOCKED'} 
          className={`flex-1 min-w-0 border-none p-0 m-0 overflow-y-auto custom-scrollbar pr-2 pb-6 transition-all duration-500 ${accessState !== 'UNLOCKED' ? 'opacity-50 grayscale-50' : 'opacity-100'}`}
        >
          {activeTab === 'HERO' && <HeroTab storeId={store.id} formData={formData} updateForm={updateForm} />}
          {activeTab === 'STORY' && <StoryTab storeId={store.id} formData={formData} updateForm={updateForm} />}
          {activeTab === 'MEDIA' && <MediaTab storeId={store.id} formData={formData} updateForm={updateForm} />}
          {activeTab === 'SERVICES' && <ServicesTab formData={formData} updateForm={updateForm} />}
        </fieldset>

      </div>
    </div>
  );
}