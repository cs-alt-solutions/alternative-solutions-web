// src/components/dashboard/storefronts/editor/CoreTab.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

import BrandIdentity from './core/BrandIdentity';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import CustomHeadings from './core/CustomHeadings';

export default function CoreTab({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    business_name: store?.business_name || '',
    slug: store?.slug || '',
    contact_email: store?.contact_email || '',
    social_links: store?.social_links || {},
    tagline: store?.tagline || '',
    subtext: store?.subtext || '',
    primary_cta: store?.primary_cta || 'Get Started',
    secondary_cta: store?.secondary_cta || '',
    about_heading: store?.about_heading || '',
    about_bio: store?.about_bio || '',
    capabilities_heading: store?.capabilities_heading || '',
    gallery_heading: store?.gallery_heading || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { error } = await supabase.from('storefronts').update(formData).eq('id', store.id);
      if (error) throw error;
      setSaveMessage('Content saved successfully!');
      router.refresh();
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage('Error saving content.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2">
      
      <BrandIdentity formData={formData} handleChange={handleChange} />
      <HeroContent formData={formData} handleChange={handleChange} />
      <StoryAbout formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <CustomHeadings formData={formData} handleChange={handleChange} />

      {/* SAVE BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
        <p className="text-emerald-400 text-sm font-mono font-bold tracking-widest uppercase animate-pulse min-h-5">
          {saveMessage}
        </p>
        <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-1 rounded-sm disabled:opacity-50 disabled:pointer-events-none">
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'SYNCING TO DATABASE...' : 'SAVE CONTENT'}
        </button>
      </div>
    </div>
  );
}