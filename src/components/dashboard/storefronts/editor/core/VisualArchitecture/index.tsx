// src/components/dashboard/storefronts/editor/core/VisualArchitecture/index.tsx
import React, { useState } from 'react';
import { LayoutTemplate, MonitorPlay, Layers, BookOpen, Palette } from 'lucide-react';
import { THEME_CONSTRAINTS } from './constants';
import VibeSelector from './VibeSelector';
import { HeroSelector, AboutSelector, ContentSelector } from './LayoutSelectors';
import ColorSelector from './ColorSelector';
import EditorAccordion from '../../shared/EditorAccordion';

export default function VisualArchitecture({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [openZone, setOpenZone] = useState<string | null>(null);
  
  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const toggleZone = (zone: string) => setOpenZone(prev => prev === zone ? null : zone);

  const handleThemeSwitch = (newTheme: string) => {
    const constraints = THEME_CONSTRAINTS[newTheme] || THEME_CONSTRAINTS['industrial'];
    let newHero = formData.hero_layout;
    let newContent = formData.content_layout;
    let newAbout = formData.about_layout;
    
    if (!constraints.hero.includes(newHero)) newHero = constraints.hero[0];
    if (!constraints.content.includes(newContent)) newContent = constraints.content[0];
    if (!constraints.about.includes(newAbout)) newAbout = constraints.about[0];
    
    setFormData((prev: any) => ({ ...prev, theme_style: newTheme, hero_layout: newHero, content_layout: newContent, about_layout: newAbout }));
  };

  return (
    <div className="space-y-4">
      <EditorAccordion 
        title="Foundation Vibe" 
        icon={LayoutTemplate} 
        accentColor="cyan" 
        hidePercentage={true} // 🚀 FIXED: Disables the percentage numbers!
        isOpen={openZone === 'vibe'} 
        onToggle={() => toggleZone('vibe')}
      >
        <VibeSelector currentTheme={currentTheme} onChange={handleThemeSwitch} />
      </EditorAccordion>

      <EditorAccordion 
        title="Hero Structure" 
        icon={MonitorPlay} 
        accentColor="fuchsia" 
        hidePercentage={true}
        isOpen={openZone === 'hero'} 
        onToggle={() => toggleZone('hero')}
      >
        <HeroSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      </EditorAccordion>

      <EditorAccordion 
        title="Content Flow" 
        icon={Layers} 
        accentColor="emerald" 
        hidePercentage={true}
        isOpen={openZone === 'content'} 
        onToggle={() => toggleZone('content')}
      >
        <ContentSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      </EditorAccordion>

      <EditorAccordion 
        title="Story Architecture" 
        icon={BookOpen} 
        accentColor="amber" 
        hidePercentage={true}
        isOpen={openZone === 'about'} 
        onToggle={() => toggleZone('about')}
      >
        <AboutSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
      </EditorAccordion>

      <EditorAccordion 
        title="Color Mapping" 
        icon={Palette} 
        accentColor="indigo" 
        hidePercentage={true}
        isOpen={openZone === 'colors'} 
        onToggle={() => toggleZone('colors')}
      >
        <ColorSelector 
          brandColor={formData.brand_color || 'cyan-500'} 
          secondaryBrandColor={formData.secondary_brand_color || formData.brand_color || 'fuchsia-500'}
          onChange={(val) => setFormData((prev: any) => ({ ...prev, brand_color: val }))} 
          onSecondaryChange={(val) => setFormData((prev: any) => ({ ...prev, secondary_brand_color: val }))}
        />
      </EditorAccordion>
    </div>
  );
}