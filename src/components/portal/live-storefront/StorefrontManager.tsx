/* src/components/portal/live-storefront/StorefrontManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  Save, CheckCircle2, Loader2, Type, AlignLeft, 
  Link as LinkIcon, Sparkles, Unlock, Lock, AlertTriangle, 
  Image as ImageIcon 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import HeroTab from './tabs/HeroTab';
import StoryTab from './tabs/StoryTab';
import MediaTab from './tabs/MediaTab'; 
import ServicesTab from './tabs/ServicesTab';
import ConnectionsTab from './tabs/ConnectionsTab';

export default function StorefrontManager({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'HERO' | 'STORY' | 'MEDIA' | 'SERVICES' | 'CONNECTIONS'>('HERO');
  
  const [isEditing, setIsEditing] = useState(false);

  // Parse JSONB objects and arrays safely from Supabase
  const safeSocials = typeof store.social_handles === 'string' ? JSON.parse(store.social_handles) : (store.social_handles || {});
  const safeCapabilities = Array.isArray(store.capabilities) ? store.capabilities : [];
  const safeGallery = Array.isArray(store.gallery_items) ? store.gallery_items : []; // 🚀 Added Gallery Parser

  const [formData, setFormData] = useState({
    tagline: store.tagline || '',
    subtext: store.subtext || '',
    about_bio: store.about_bio || '',
    contact_email: store.contact_email || '',
    hero_image: store.hero_image || '',
    about_image: store.about_image || '',
    brand_logo: store.brand_logo || '',
    gallery_items: safeGallery, // 🚀 Registered to form state
    social_handles: safeSocials,
    capabilities: safeCapabilities,
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleUnlock = () => {
    const isSure = window.confirm("Hold up! 🚨 You are unlocking the live editor. This isn't a test mode—anything you publish here instantly updates your actual website. You have total creative control, but with great power comes... well, you know. Ready to dive in and make some magic?");
    if (isSure) {
      setIsEditing(true);
    }
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
      setTimeout(() => {
        setSaved(false);
        setIsEditing(false); 
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
    { id: 'STORY', label: 'Story', icon: AlignLeft, color: 'text-fuchsia-400', border: 'border-fuchsia-500' },
    { id: 'MEDIA', label: 'Gallery', icon: ImageIcon, color: 'text-rose-400', border: 'border-rose-500' }, // 🚀 Renamed label to Gallery
    { id: 'SERVICES', label: 'Services', icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500' },
    { id: 'CONNECTIONS', label: 'Links', icon: LinkIcon, color: 'text-emerald-400', border: 'border-emerald-500' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* COMMAND BAR */}
      <div className="shrink-0 mb-6 flex gap-3">
        {!isEditing ? (
          <button 
            onClick={handleUnlock}
            className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.1)]"
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

      {/* Warning Banner when Editing */}
      {isEditing && (
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

      {/* TAB CONTENT */}
      <fieldset 
        disabled={!isEditing} 
        className={`flex-1 min-w-0 border-none p-0 m-0 overflow-y-auto custom-scrollbar pr-2 pb-12 transition-all duration-500 ${!isEditing ? 'opacity-50 grayscale-30' : 'opacity-100'}`}
      >
        {activeTab === 'HERO' && <HeroTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'STORY' && <StoryTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'MEDIA' && <MediaTab storeId={store.id} formData={formData} updateForm={updateForm} />}
        {activeTab === 'SERVICES' && <ServicesTab formData={formData} updateForm={updateForm} />}
        {activeTab === 'CONNECTIONS' && <ConnectionsTab formData={formData} updateForm={updateForm} />}
      </fieldset>

    </div>
  );
}