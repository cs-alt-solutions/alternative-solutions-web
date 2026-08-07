// src/components/dashboard/storefronts/editor/core/VisualArchitecture/index.tsx
import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { THEME_CONSTRAINTS } from './constants';
import VibeSelector from './VibeSelector';
import { HeroSelector, AboutSelector, ContentSelector } from './LayoutSelectors';
import ColorSelector from './ColorSelector';

export default function VisualArchitecture({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const handleThemeSwitch = (newTheme: string) => {
    const constraints = THEME_CONSTRAINTS[newTheme] || THEME_CONSTRAINTS['industrial'];
    let newHero = formData.hero_layout;
    let newContent = formData.content_layout;
    let newAbout = formData.about_layout;

    if (!constraints.hero.includes(newHero)) newHero = constraints.hero[0];
    if (!constraints.content.includes(newContent)) newContent = constraints.content[0];
    if (!constraints.about.includes(newAbout)) newAbout = constraints.about[0];

    setFormData((prev: any) => ({
      ...prev,
      theme_style: newTheme,
      hero_layout: newHero,
      content_layout: newContent,
      about_layout: newAbout
    }));
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-8 shadow-sm">
      <div className="mb-2 border-l-[3px] border-fuchsia-500/60 bg-linear-to-r from-fuchsia-500/10 to-transparent px-4 py-2">
        <h3 className="text-[10px] font-mono font-black text-fuchsia-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <LayoutTemplate className="w-3 h-3" /> Architecture & Vibe
        </h3>
      </div>
      
      <VibeSelector currentTheme={currentTheme} onChange={handleThemeSwitch} />
      <HeroSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      <AboutSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      <ContentSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      <ColorSelector brandColor={formData.brand_color || 'cyan-500'} onChange={(val) => setFormData((prev: any) => ({ ...prev, brand_color: val }))} />
    </div>
  );
}