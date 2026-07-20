import React from 'react';
import { Type } from 'lucide-react';

export default function HeroContent({ formData, handleChange }: { formData: any, handleChange: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-fuchsia-400 mb-2">
        <Type size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Hero Content</h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Primary Hook (H1 Tagline)</label>
          <input 
            name="tagline" 
            value={formData.tagline || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-fuchsia-500 outline-none transition-all text-sm placeholder:text-zinc-700"
            placeholder="Enter your main headline here..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Supporting Subtext</label>
          <textarea 
            name="subtext" 
            value={formData.subtext || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white h-24 resize-none focus:border-fuchsia-500 outline-none transition-all text-sm leading-relaxed placeholder:text-zinc-700"
            placeholder="Briefly explain your value proposition..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"> 
           <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Primary CTA</label>
              <input 
                name="primary_cta" 
                value={formData.primary_cta || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-fuchsia-500 outline-none transition-all text-sm placeholder:text-zinc-700"
                placeholder="e.g. Get Started"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Secondary CTA</label>
              <input 
                name="secondary_cta" 
                value={formData.secondary_cta || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-fuchsia-500 outline-none transition-all text-sm placeholder:text-zinc-700"
                placeholder="e.g. Learn More"
              />
            </div>
        </div>
      </div>
    </div>
  );
}