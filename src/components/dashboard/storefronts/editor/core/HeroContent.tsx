/* src/components/dashboard/storefronts/editor/core/HeroContent.tsx */
'use client';

import React, { useState } from 'react';
import { Type, HelpCircle, LayoutTemplate, AlignLeft } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';
import { HeroSelector } from './VisualArchitecture/LayoutSelectors';
import HeroSizingControls from './HeroSizingControls';
import { EDITOR_WORKSPACE_COPY, THEME_CONSTRAINTS } from '@/config/dashboard/editor';

const TooltipLabel = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <HelpCircle size={11} className="text-zinc-600 hover:text-white cursor-help transition-colors" />

    <div className="absolute top-full left-0 mt-1.5 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
      <p className="text-[10px] text-amber-400 normal-case tracking-normal font-medium leading-relaxed">
        {tooltip}
      </p>
    </div>
  </div>
);

export default function HeroContent({
  formData,
  setFormData,
  handleChange,
  allowedLayouts,
  isClientPortal = false,
  embedded = false,
}: {
  formData: any;
  setFormData?: any;
  handleChange: any;
  allowedLayouts?: any;
  isClientPortal?: boolean;
  embedded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const safeLayouts =
    allowedLayouts || THEME_CONSTRAINTS[formData.theme_style || 'industrial'] || THEME_CONSTRAINTS['industrial'];

  const fields = [formData.tagline, formData.subtext, formData.hero_cta];
  const filled = fields.filter((f) => f && f.trim() !== '').length;
  const progress = Math.round((filled / 3) * 100);

  const content = (
    <div className="space-y-4">
      {/* SECTION 1: LAYOUT & STYLING */}
      {!isClientPortal && setFormData && (
        <div className="space-y-2.5 pb-3.5 border-b border-zinc-800/70">
          <div className="flex items-center gap-1.5 text-amber-400">
            <LayoutTemplate size={11} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {copy.HERO_LAYOUT_SUBHEADING}
            </span>
          </div>
          <HeroSelector formData={formData} setFormData={setFormData} allowedLayouts={safeLayouts} />
        </div>
      )}

      {/* SECTION 2: FRAMING & SIZING */}
      {!isClientPortal && setFormData && (
        <div className="pb-3.5 border-b border-zinc-800/70">
          <HeroSizingControls formData={formData} setFormData={setFormData} />
        </div>
      )}

      {/* SECTION 3: HERO COPY & CTA */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <AlignLeft size={11} className="text-amber-400" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {copy.HERO_COPY_SUBHEADING}
          </span>
        </div>

        <div>
          <TooltipLabel label={copy.TAGLINE_LABEL} tooltip={copy.TAGLINE_TOOLTIP} />
          <input
            name="tagline"
            value={formData.tagline || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-amber-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.TAGLINE_PLACEHOLDER}
          />
        </div>

        <div>
          <TooltipLabel label={copy.SUBTEXT_LABEL} tooltip={copy.SUBTEXT_TOOLTIP} />
          <textarea
            name="subtext"
            value={formData.subtext || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white h-20 resize-none focus:border-amber-500 outline-none transition-all text-xs leading-relaxed placeholder:text-zinc-700"
            placeholder={copy.SUBTEXT_PLACEHOLDER}
          />
        </div>

        <div>
          <TooltipLabel label={copy.HERO_CTA_LABEL} tooltip={copy.HERO_CTA_TOOLTIP} />
          <input
            name="hero_cta"
            value={formData.hero_cta || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-amber-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.HERO_CTA_PLACEHOLDER}
          />
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <EditorAccordion
      title={copy.HERO_ACCORDION}
      icon={Type}
      accentColor="amber"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      {content}
    </EditorAccordion>
  );
}