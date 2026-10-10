// src/components/dashboard/storefronts/editor/core/ContactSection.tsx
import React, { useState } from 'react';
import { MousePointerClick, HelpCircle } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';

const TooltipLabel = ({ label, tooltip }: { label: string, tooltip: string }) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors" />
    
    <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none`}>
      <p className={`text-[10px] text-indigo-400 normal-case tracking-normal font-medium leading-relaxed`}>
        {tooltip}
      </p>
    </div>
  </div>
);

export default function ContactSection({ formData, handleChange }: { formData: any, handleChange: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const fields = [formData.capabilities_heading, formData.primary_cta, formData.secondary_cta];
  const progress = Math.round((fields.filter(f => f && f.trim() !== '').length / 3) * 100);

  return (
    <EditorAccordion 
      title="Bottom Contact & Titles" 
      icon={MousePointerClick} 
      accentColor="indigo" 
      progress={progress} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-6">
        
        {/* BOTTOM CONTACT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <TooltipLabel 
              label="Contact Block Heading" 
              tooltip="The massive text at the bottom of your site. (Currently says 'Contact Us!')" 
            />
            <input 
              name="primary_cta" 
              value={formData.primary_cta || ''} 
              onChange={handleChange} 
              className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
              placeholder="e.g. Contact Us!"
            />
          </div>
          <div>
            <TooltipLabel 
              label="Contact Button Text" 
              tooltip="The actual button at the very bottom of the page. (Currently says 'Book a Shoot')" 
            />
            <input 
              name="secondary_cta" 
              value={formData.secondary_cta || ''} 
              onChange={handleChange} 
              className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
              placeholder="e.g. Book a Shoot"
            />
          </div>
        </div>

        {/* CUSTOM SECTION HEADINGS */}
        <div className="pt-4 border-t border-zinc-800/50">
          <div>
            <TooltipLabel 
              label="Services / Portfolio Heading" 
              tooltip="The massive title directly above your packages or capabilities grid. (Currently says 'Exclusive Services')" 
            />
            <input 
              name="capabilities_heading" 
              value={formData.capabilities_heading || ''} 
              onChange={handleChange} 
              className="w-full bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs" 
              placeholder="e.g. Exclusive Services" 
            />
          </div>
        </div>
        
      </div>
    </EditorAccordion>
  );
}