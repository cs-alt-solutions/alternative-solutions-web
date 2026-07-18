// src/components/dashboard/storefronts/editor/core/HeroContent.tsx
import React from 'react';
import { Type } from 'lucide-react';

export default function HeroContent({ formData, handleChange }: { formData: any, handleChange: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      {/* ... header code ... */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Primary Hook (H1 Tagline)</label>
          {/* FIX: Use || '' to ensure value is never null */}
          <input 
            name="tagline" 
            value={formData.tagline || ''} 
            onChange={handleChange} 
            className="..." 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Supporting Subtext</label>
          {/* FIX: Use || '' to ensure value is never null */}
          <textarea 
            name="subtext" 
            value={formData.subtext || ''} 
            onChange={handleChange} 
            className="..." 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"> 
           <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Primary CTA</label>
              {/* FIX: Use || '' to ensure value is never null */}
              <input 
                name="primary_cta" 
                value={formData.primary_cta || ''} 
                onChange={handleChange} 
                className="..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Secondary CTA</label>
              {/* FIX: Use || '' to ensure value is never null */}
              <input 
                name="secondary_cta" 
                value={formData.secondary_cta || ''} 
                onChange={handleChange} 
                className="..." 
              />
            </div>
        </div>
      </div>
    </div>
  );
}