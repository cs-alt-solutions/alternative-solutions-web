/* src/components/dashboard/storefronts/editor/core/HeroContent.tsx */
'use client';

import React, { useState } from 'react';
import { Type, HelpCircle, LayoutTemplate, Lock, Unlock } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';
import { HeroSelector } from './VisualArchitecture/LayoutSelectors';
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
}: {
  formData: any;
  setFormData?: any;
  handleChange: any;
  allowedLayouts?: any;
  isClientPortal?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const safeLayouts =
    allowedLayouts || THEME_CONSTRAINTS[formData.theme_style || 'industrial'] || THEME_CONSTRAINTS['industrial'];

  const isHubMode = formData.engine_mode === 'hub' || formData.content_layout === 'hub';
  const isStaticHubHero = formData.hub_hero_static === true;

  const fields = [formData.tagline, formData.subtext, formData.hero_cta];
  const filled = fields.filter((f) => f && f.trim() !== '').length;
  const progress = Math.round((filled / 3) * 100);

  return (
    <EditorAccordion
      title={copy.HERO_ACCORDION}
      icon={Type}
      accentColor="amber"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-3">
        {!isClientPortal && setFormData && (
          <div className="pb-3.5 border-b border-zinc-800/70 space-y-2.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <LayoutTemplate size={11} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {copy.HERO_LAYOUT_SUBHEADING}
              </span>
            </div>
            <HeroSelector formData={formData} setFormData={setFormData} allowedLayouts={safeLayouts} />

            {isHubMode && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({ ...prev, hub_hero_static: !prev.hub_hero_static }))
                }
                className={`w-full mt-2 px-3 py-2 rounded-lg border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
                  isStaticHubHero
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isStaticHubHero ? <Lock size={12} className="shrink-0" /> : <Unlock size={12} className="shrink-0" />}
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      Keep Main Hero Static
                    </span>
                    <span className="text-[9px] text-zinc-500 block truncate">
                      {isStaticHubHero
                        ? 'Locked to main Core hero photo across all departments'
                        : 'Swaps Hero banner to each department #1 Cover'}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                    isStaticHubHero ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {isStaticHubHero ? 'ON' : 'OFF'}
                </span>
              </button>
            )}
          </div>
        )}

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

        <div className="pt-2.5 border-t border-zinc-800/60">
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
    </EditorAccordion>
  );
}