// src/components/dashboard/storefronts/editor/core/StoryAbout.tsx
import React, { useEffect } from 'react';
import { BookOpen, Instagram, Facebook, Twitter, Linkedin, Send, Youtube, Sparkles, RefreshCw } from 'lucide-react';
import { ALT_SOLUTIONS_HQ } from '@/config/agency';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', icon: Instagram, placeholder: 'instagram handle' },
  { id: 'facebook', icon: Facebook, placeholder: 'facebook profile' },
  { id: 'twitter', icon: Twitter, placeholder: 'x/twitter handle' },
  { id: 'linkedin', icon: Linkedin, placeholder: 'linkedin vanity url' },
  { id: 'youtube', icon: Youtube, placeholder: 'youtube channel' },
  { id: 'telegram', icon: Send, placeholder: 'telegram handle' },
];

export default function StoryAbout({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  
  // 🚀 PROTOTYPE OVERDRIVE ENGINE:
  // When 'is_template' turns ON, automatically inject our HQ social links into any empty fields!
  useEffect(() => {
    if (formData.is_template) {
      setFormData((prev: any) => {
        const currentSocials = prev.social_links || {};
        
        // Check if any HQ link is missing from the current state
        const needsInjection = Object.entries(ALT_SOLUTIONS_HQ).some(
          ([key, val]) => !currentSocials[key] || currentSocials[key] === ''
        );

        if (needsInjection) {
          return {
            ...prev,
            social_links: {
              ...ALT_SOLUTIONS_HQ,
              ...currentSocials, // Preserves custom typed links, but fills all empties with HQ!
            }
          };
        }
        return prev;
      });
    }
  }, [formData.is_template, setFormData]);

  const handleSocialChange = (platformId: string, value: string) => {
    setFormData((prev: any) => ({ 
      ...prev, 
      social_links: { ...(prev.social_links || {}), [platformId]: value } 
    }));
  };

  // Helper to force-overwrite all socials back to Alternative Solutions HQ
  const forceSyncHQ = () => {
    setFormData((prev: any) => ({
      ...prev,
      social_links: {
        ...(prev.social_links || {}),
        ...ALT_SOLUTIONS_HQ
      }
    }));
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl h-full">
      <div className="flex items-center gap-3 text-emerald-400 mb-2">
        <BookOpen size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Story & About</h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">About Heading</label>
          <input 
            type="text"
            name="about_heading" 
            value={formData.about_heading || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-emerald-500 outline-none transition-all text-sm placeholder:text-zinc-700" 
            placeholder="e.g. Our Story"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">About Bio</label>
          <textarea 
            name="about_bio" 
            value={formData.about_bio || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white h-32 resize-none focus:border-emerald-500 outline-none transition-all text-sm leading-relaxed placeholder:text-zinc-700" 
            placeholder="Tell your story here..."
          />
        </div>
      </div>
      
      <div className="pt-6 border-t border-white/5 space-y-4">
        
        {/* 🚀 SECTION HEADER WITH PROTOTYPE OVERDRIVE BADGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Social Connections</h4>
          
          {formData.is_template && (
            <div className="flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-1 rounded-lg w-fit shadow-[0_0_15px_rgba(217,70,239,0.15)] animate-in fade-in duration-300">
              <Sparkles size={12} className="text-fuchsia-400 animate-pulse shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-widest text-fuchsia-300">
                Prototype Overdrive: HQ Routing Active
              </span>
              <button
                type="button"
                onClick={forceSyncHQ}
                className="ml-1 p-1 rounded hover:bg-fuchsia-500/20 text-fuchsia-400 hover:text-white transition-colors"
                title="Force Re-sync All Socials to Alternative Solutions HQ"
              >
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
              <div 
                key={p.id} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/40 border transition-all ${
                  isHQLink 
                    ? 'border-fuchsia-500/40 bg-fuchsia-500/5' 
                    : val 
                      ? 'border-emerald-500/50' 
                      : 'border-white/5'
                }`}
              >
                <p.icon size={16} className={`shrink-0 ${isHQLink ? 'text-fuchsia-400' : val ? 'text-emerald-400' : 'text-zinc-600'}`} />
                <input 
                  type="text"
                  placeholder={p.placeholder} 
                  value={val} 
                  onChange={(e) => handleSocialChange(p.id, e.target.value)} 
                  className={`w-full bg-transparent text-[11px] outline-none font-mono placeholder:text-zinc-700 ${
                    isHQLink ? 'text-fuchsia-200 font-bold' : 'text-white'
                  }`} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}