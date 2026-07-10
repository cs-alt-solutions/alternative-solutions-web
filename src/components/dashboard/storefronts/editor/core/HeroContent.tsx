// src/components/dashboard/storefronts/editor/core/HeroContent.tsx
import React from 'react';
import { Type } from 'lucide-react';

export default function HeroContent({ formData, handleChange }: { formData: any, handleChange: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-amber-400 mb-2">
        <Type size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Hero Content</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Primary Hook (H1 Tagline)</label>
          <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-lg font-bold focus:border-amber-500 outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Supporting Subtext</label>
          <textarea name="subtext" value={formData.subtext} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white h-24 resize-none focus:border-amber-500 outline-none transition-all text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
           <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Primary CTA</label>
              <input name="primary_cta" value={formData.primary_cta} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-amber-500 outline-none transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Secondary CTA</label>
              <input name="secondary_cta" value={formData.secondary_cta || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-amber-500 outline-none transition-all text-sm" />
            </div>
        </div>
      </div>
    </div>
  );
}