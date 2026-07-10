// src/components/dashboard/storefronts/editor/core/StoryAbout.tsx
import React from 'react';
import { BookOpen, Instagram, Facebook, Twitter, Linkedin, Send, Youtube } from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', icon: Instagram, placeholder: 'instagram handle' },
  { id: 'facebook', icon: Facebook, placeholder: 'facebook profile' },
  { id: 'twitter', icon: Twitter, placeholder: 'x/twitter handle' },
  { id: 'linkedin', icon: Linkedin, placeholder: 'linkedin vanity url' },
  { id: 'youtube', icon: Youtube, placeholder: 'youtube channel' },
  { id: 'telegram', icon: Send, placeholder: 'telegram handle' },
];

export default function StoryAbout({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  const handleSocialChange = (platformId: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), [platformId]: value } }));
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-emerald-400 mb-2">
        <BookOpen size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Story & About</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">About Heading</label>
          <input name="about_heading" value={formData.about_heading || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-emerald-500 outline-none transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">About Bio</label>
          <textarea name="about_bio" value={formData.about_bio || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white h-32 resize-none focus:border-emerald-500 outline-none transition-all text-sm" />
        </div>
      </div>
      <div className="pt-6 border-t border-white/5 space-y-4">
        <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Social Connections</h4>
        <div className="grid grid-cols-2 gap-3">
          {SOCIAL_PLATFORMS.map((p) => {
            const val = formData.social_links?.[p.id] || '';
            return (
              <div key={p.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-black/40 border transition-all ${val ? 'border-emerald-500/50' : 'border-white/5'}`}>
                <p.icon size={14} className={val ? 'text-emerald-400' : 'text-zinc-600'} />
                <input placeholder={p.placeholder} value={val} onChange={(e) => handleSocialChange(p.id, e.target.value)} className="w-full bg-transparent text-[10px] text-white outline-none font-mono" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}