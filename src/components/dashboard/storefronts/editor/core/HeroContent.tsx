// src/components/dashboard/storefronts/editor/core/HeroContent.tsx
import React, { useState } from 'react';
import { Type, HelpCircle } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';

const TooltipLabel = ({ label, tooltip }: { label: string, tooltip: string }) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors" />
    
    <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none`}>
      <p className={`text-[10px] text-amber-400 normal-case tracking-normal font-medium leading-relaxed`}>
        {tooltip}
      </p>
    </div>
  </div>
);

export default function HeroContent({ formData, handleChange }: { formData: any, handleChange: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Added hero_cta to the progress calculation
  const fields = [formData.tagline, formData.subtext, formData.hero_cta];
  const filled = fields.filter(f => f && f.trim() !== '').length;
  const progress = Math.round((filled / 3) * 100);

  return (
    <EditorAccordion 
      title="Hero Content" 
      icon={Type} 
      accentColor="amber" 
      progress={progress} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-4">
        <div>
          <TooltipLabel label="Primary Hook (H1 Tagline)" tooltip="The massive headline at the very top of your site." />
          <input 
            name="tagline" 
            value={formData.tagline || ''} 
            onChange={handleChange} 
            className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-amber-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder="Enter your main headline here..."
          />
        </div>
        
        <div>
          <TooltipLabel label="Supporting Subtext" tooltip="The paragraph right below your main headline." />
          <textarea 
            name="subtext" 
            value={formData.subtext || ''} 
            onChange={handleChange} 
            className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white h-24 resize-none focus:border-amber-500 outline-none transition-all text-xs leading-relaxed placeholder:text-zinc-700"
            placeholder="Briefly explain your value proposition..."
          />
        </div>

        <div className="pt-3 border-t border-zinc-800/50 mt-2">
          <TooltipLabel label="Hero Button Text" tooltip="The button directly under your hero text. (Usually 'View Gallery' or 'Explore')" />
          <input 
            name="hero_cta" 
            value={formData.hero_cta || ''} 
            onChange={handleChange} 
            className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-amber-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder="e.g. View Gallery"
          />
        </div>
      </div>
    </EditorAccordion>
  );
}