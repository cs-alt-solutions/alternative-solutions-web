/* src/components/portal/live-storefront/StorefrontManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Save, CheckCircle2, Loader2, Type, AlignLeft, 
  Sparkles, Lock, AlertTriangle, Image as ImageIcon, Paintbrush, Key, Clock 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import HeroTab from './tabs/HeroTab';
import StoryTab from './tabs/StoryTab';
import MediaTab from './tabs/MediaTab'; 
import ServicesTab from './tabs/ServicesTab';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from '../core/theme';

export default function StorefrontManager({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'HERO' | 'STORY' | 'MEDIA' | 'SERVICES'>('HERO');
  
  // 🚀 NEW: The 3-tier access state. Default is LOCKED.
  const [accessState, setAccessState] = useState<'LOCKED' | 'REQUESTED' | 'UNLOCKED'>('LOCKED');

  const currentTheme = getPortalTheme(store.id);

  const safeSocials = typeof store.social_handles === 'string' ? JSON.parse(store.social_handles) : (store.social_handles || {});
  const safeCapabilities = Array.isArray(store.capabilities) ? store.capabilities : [];
  const rawGallery = Array.isArray(store.gallery_items) ? store.gallery_items : [];
  const safeGallery = rawGallery.map((item: any) => 
    typeof item === 'string' ? { url: item, caption: '' } : item
  );

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

  const handleRequestKeys = () => {
    // 🚀 In the future, this will trigger a Supabase Edge Function to email you!
    setAccessState('REQUESTED');
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
    { id: 'SERVICES', label: 'Services', icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      <div className={`shrink-0 mb-6 bg-zinc-950/80 border ${currentTheme.border} rounded-3xl p-5 md:p-6 flex flex-col md:flex-row gap-4 shadow-xl backdrop-blur-md items-start md:items-center`}>
        <div className={`p-3 ${currentTheme.bg} rounded-xl shrink-0`}>
          <Paintbrush className={`w-6 h-6 ${currentTheme.text}`} />
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

      {/* 🚀 THE NEW ACCESS COMMAND BAR */}
      <div className="shrink-0 mb-6 flex gap-3">
        {accessState === 'LOCKED' && (
          <div className="w-full bg-black/40 border border-zinc-800/80 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                <Lock size={14} className="text-zinc-500" /> {PORTAL_COPY.storefront.lockedTitle}
              </h3>
              <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
                {PORTAL_COPY.storefront.lockedBody}
              </p>
            </div>
            <button 
              onClick={handleRequestKeys}
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <Key size={16} /> {PORTAL_COPY.storefront.requestKeysBtn}
            </button>
          </div>
        )}

        {accessState === 'REQUESTED' && (
          <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 md:p-6 flex items-start gap-4">
            <Clock className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-1">
                {PORTAL_COPY.storefront.keysRequested}
              </h3>
              <p className="text-xs text-amber-500/70 leading-relaxed">
                {PORTAL_COPY.storefront.keysPendingBody}
              </p>
            </div>
          </div>
        )}

        {accessState === 'UNLOCKED' && (
          <>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin" /> Compiling...</> : saved ? <><CheckCircle2 size={16} /> Live Synced</> : <><Save size={16} /> Publish Changes</>}
            </button>
            <button 
              onClick={() => setAccessState('LOCKED')}
              disabled={isSaving}
              className="px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
              title="Lock Editor"
            >
              <Lock size={16} />
            </button>
          </>
        )}
      </div>

      {accessState === 'UNLOCKED' && (
        <div className="shrink-0 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-400/90 font-mono uppercase tracking-widest leading-relaxed">
            Live Editor Unlocked. Any changes published will immediately reflect on the production network.
          </p>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4 shrink-0 pb-2">
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

      {/* TAB CONTENT (Disabled globally unless UNLOCKED) */}
      <fieldset 
        disabled={accessState !== 'UNLOCKED'} 
        className={`flex-1 min-w-0 border-none p-0 m-0 overflow-y-auto custom-scrollbar pr-2 pb-12 transition-all duration-500 ${accessState !== 'UNLOCKED' ? 'opacity-50 grayscale-30' : 'opacity-100'}`}
      >
        {activeTab === 'HERO' && <HeroTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'STORY' && <StoryTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'MEDIA' && <MediaTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'SERVICES' && <ServicesTab formData={formData} updateForm={updateForm} />}
      </fieldset>

    </div>
  );
}