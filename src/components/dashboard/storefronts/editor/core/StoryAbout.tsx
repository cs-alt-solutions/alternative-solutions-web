// src/components/dashboard/storefronts/editor/core/StoryAbout.tsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Instagram, Facebook, Twitter, Linkedin, Send, Youtube, Sparkles, RefreshCw } from 'lucide-react';
import { ALT_SOLUTIONS_HQ } from '@/config/agency';
import EditorAccordion from '../shared/EditorAccordion';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', icon: Instagram, placeholder: 'instagram handle' },
  { id: 'facebook', icon: Facebook, placeholder: 'facebook profile' },
  { id: 'twitter', icon: Twitter, placeholder: 'x/twitter handle' },
  { id: 'linkedin', icon: Linkedin, placeholder: 'linkedin vanity url' },
  { id: 'youtube', icon: Youtube, placeholder: 'youtube channel' },
  { id: 'telegram', icon: Send, placeholder: 'telegram handle' },
];

export default function StoryAbout({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (formData.is_template) {
      setFormData((prev: any) => {
        const currentSocials = prev.social_links || {};
        const needsInjection = Object.entries(ALT_SOLUTIONS_HQ).some(([key, val]) => !currentSocials[key] || currentSocials[key] === '');
        if (needsInjection) {
          return { ...prev, social_links: { ...ALT_SOLUTIONS_HQ, ...currentSocials } };
        }
        return prev;
      });
    }
  }, [formData.is_template, setFormData]);

  const handleSocialChange = (platformId: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), [platformId]: value } }));
  };

  const forceSyncHQ = () => {
    setFormData((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), ...ALT_SOLUTIONS_HQ } }));
  };

  const storyFields = [formData.about_heading, formData.about_bio];
  const socialsFilled = Object.values(formData.social_links || {}).filter(v => v !== '').length > 0 ? 1 : 0;
  const progress = Math.round(((storyFields.filter(f => f && f.trim() !== '').length + socialsFilled) / 3) * 100);

  return (
    <EditorAccordion 
      title="Story & About" 
      icon={BookOpen} 
      accentColor="rose" 
      progress={progress} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">About Heading</label>
          <input 
            type="text"
            name="about_heading" 
            value={formData.about_heading || ''} 
            onChange={handleChange} 
            className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-rose-500 outline-none transition-all text-xs placeholder:text-zinc-700" 
            placeholder="e.g. Our Story"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">About Bio</label>
          <textarea 
            name="about_bio" 
            value={formData.about_bio || ''} 
            onChange={handleChange} 
            className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white h-32 resize-none focus:border-rose-500 outline-none transition-all text-xs leading-relaxed placeholder:text-zinc-700" 
            placeholder="Tell your story here..."
          />
        </div>
      </div>
      
      <div className="pt-6 mt-6 border-t border-zinc-800/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Social Connections</h4>
          
          {formData.is_template && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-lg w-fit shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-in fade-in duration-300">
              <Sparkles size={12} className="text-rose-400 animate-pulse shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-300">
                HQ Routing Active
              </span>
              <button type="button" onClick={forceSyncHQ} className="ml-1 p-1 rounded hover:bg-rose-500/20 text-rose-400 hover:text-white transition-colors">
                <RefreshCw size={11} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((p) => {
            const val = formData.social_links?.[p.id] || '';
            const isHQLink = val && Object.values(ALT_SOLUTIONS_HQ).includes(val);
            return (
              <div key={p.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-950 border transition-all ${isHQLink ? 'border-rose-500/40 bg-rose-500/5' : val ? 'border-emerald-500/50' : 'border-zinc-800'}`}>
                <p.icon size={16} className={`shrink-0 ${isHQLink ? 'text-rose-400' : val ? 'text-emerald-400' : 'text-zinc-600'}`} />
                <input 
                  type="text"
                  placeholder={p.placeholder} 
                  value={val} 
                  onChange={(e) => handleSocialChange(p.id, e.target.value)} 
                  className={`w-full bg-transparent text-xs outline-none font-mono placeholder:text-zinc-700 ${isHQLink ? 'text-rose-200 font-bold' : 'text-white'}`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </EditorAccordion>
  );
}