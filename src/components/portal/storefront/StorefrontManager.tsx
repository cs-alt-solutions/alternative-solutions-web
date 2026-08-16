'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Save, CheckCircle2, Loader2, Type, AlignLeft, Link as LinkIcon, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import HeroTab from './tabs/HeroTab';
import StoryTab from './tabs/StoryTab';
import ServicesTab from './tabs/ServicesTab';
import ConnectionsTab from './tabs/ConnectionsTab';

export default function StorefrontManager({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'HERO' | 'STORY' | 'SERVICES' | 'CONNECTIONS'>('HERO');

  // Parse JSONB objects safely from Supabase
  const safeSocials = typeof store.social_handles === 'string' ? JSON.parse(store.social_handles) : (store.social_handles || {});
  const safeCapabilities = Array.isArray(store.capabilities) ? store.capabilities : [];

  const [formData, setFormData] = useState({
    tagline: store.tagline || '',
    subtext: store.subtext || '',
    about_bio: store.about_bio || '',
    contact_email: store.contact_email || '',
    social_handles: safeSocials,
    capabilities: safeCapabilities,
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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
      setTimeout(() => setSaved(false), 3000);
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
    { id: 'SERVICES', label: 'Services', icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500' },
    { id: 'CONNECTIONS', label: 'Links', icon: LinkIcon, color: 'text-emerald-400', border: 'border-emerald-500' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* COMMAND BAR */}
      <div className="shrink-0 mb-6">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <><Loader2 size={16} className="animate-spin" /> Compiling...</> : saved ? <><CheckCircle2 size={16} /> Live Synced</> : <><Save size={16} /> Publish Changes</>}
        </button>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-4 shrink-0 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? `bg-zinc-900 border ${tab.border} ${tab.color} shadow-inner` 
                : 'bg-zinc-950/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
        {activeTab === 'HERO' && <HeroTab formData={formData} updateForm={updateForm} />}
        {activeTab === 'STORY' && <StoryTab formData={formData} updateForm={updateForm} />}
        {activeTab === 'SERVICES' && <ServicesTab formData={formData} updateForm={updateForm} />}
        {activeTab === 'CONNECTIONS' && <ConnectionsTab formData={formData} updateForm={updateForm} />}
      </div>
    </div>
  );
}