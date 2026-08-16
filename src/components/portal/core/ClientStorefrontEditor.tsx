'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Save, CheckCircle2, Loader2, Type, AlignLeft, Link as LinkIcon, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientStorefrontEditor({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    tagline: store.tagline || '',
    subtext: store.subtext || '',
    about_bio: store.about_bio || '',
    contact_email: store.contact_email || '',
    social_url: store.social_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('storefronts')
        .update(formData)
        .eq('id', store.id);

      if (error) throw error;
      
      setSaved(true);
      router.refresh(); // Tells Next.js to pull the fresh data
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
        
        {/* Hero Section Copy */}
        <div>
          <h3 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Type size={14} /> Hero Messaging
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Primary Hook (H1)</label>
              <input 
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Supporting Subtext</label>
              <textarea 
                name="subtext"
                value={formData.subtext}
                onChange={handleChange}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* About Section Copy */}
        <div>
          <h3 className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlignLeft size={14} /> The Story
          </h3>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">About Bio</label>
            <textarea 
              name="about_bio"
              value={formData.about_bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none"
            />
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Contact Links */}
        <div>
          <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <LinkIcon size={14} /> Connections
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 flex items-center gap-2"><Mail size={12}/> Public Email</label>
              <input 
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 flex items-center gap-2"><LinkIcon size={12}/> Primary Social Link</label>
              <input 
                name="social_url"
                value={formData.social_url}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Save Button */}
      <button 
        type="submit"
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] disabled:opacity-50"
      >
        {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saved ? <><CheckCircle2 size={16} /> Live Synced</> : <><Save size={16} /> Publish Changes</>}
      </button>
    </form>
  );
}