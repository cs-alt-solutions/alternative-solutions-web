/* src/components/dashboard/storefronts/editor/MediaTab.tsx */
'use client';

import React, { useState } from 'react';
import { LayoutTemplate, Palette } from 'lucide-react';
import { VISUAL_ARCH_COPY, THEME_CONSTRAINTS, getActiveBlueprint } from '@/config/dashboard/editor';
import EditorAccordion from './shared/EditorAccordion';
import VibeSelector from './core/VisualArchitecture/VibeSelector';
import ColorSelector from './core/VisualArchitecture/ColorSelector';
import IdentitySection from './media/IdentitySection';
import VisualAssetsSection from './media/VisualAssetsSection';
import IntegrationsSection from './media/IntegrationsSection';

export default function MediaTab({
  formData,
  setFormData,
  onReload,
  isClientPortal = false,
}: {
  formData: any;
  setFormData: any;
  onReload?: () => void;
  isClientPortal?: boolean;
}) {
  const [openSection, setOpenSection] = useState<string | null>('identity');

  const blueprint = getActiveBlueprint(formData.industry_tag, formData.engine_mode);
  const currentTheme = formData.theme_style || 'industrial';

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThemeSwitch = (newTheme: string) => {
    const constraints = THEME_CONSTRAINTS[newTheme] || THEME_CONSTRAINTS['industrial'];
    const newHero = constraints.hero.includes(formData.hero_layout) ? formData.hero_layout : constraints.hero[0];
    const newContent = constraints.content.includes(formData.content_layout) ? formData.content_layout : constraints.content[0];
    const newAbout = constraints.about.includes(formData.about_layout) ? formData.about_layout : constraints.about[0];

    setFormData((prev: any) => ({
      ...prev,
      theme_style: newTheme,
      hero_layout: newHero,
      content_layout: newContent,
      about_layout: newAbout,
    }));
  };

  return (
    <div className="space-y-2 pb-12 pt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <IdentitySection
        formData={formData}
        isClientPortal={isClientPortal}
        isOpen={openSection === 'identity'}
        onToggle={() => toggleSection('identity')}
        onChange={handleChange}
      />

      {!isClientPortal && (
        <EditorAccordion
          title={VISUAL_ARCH_COPY.ACCORDIONS.VIBE}
          icon={LayoutTemplate}
          accentColor="fuchsia"
          hidePercentage={true}
          isOpen={openSection === 'vibe'}
          onToggle={() => toggleSection('vibe')}
        >
          <VibeSelector currentTheme={currentTheme} onChange={handleThemeSwitch} />
        </EditorAccordion>
      )}

      {!isClientPortal && (
        <EditorAccordion
          title={VISUAL_ARCH_COPY.ACCORDIONS.COLORS}
          icon={Palette}
          accentColor="indigo"
          hidePercentage={true}
          isOpen={openSection === 'colors'}
          onToggle={() => toggleSection('colors')}
        >
          <ColorSelector
            brandColor={formData.brand_color || 'cyan-500'}
            secondaryBrandColor={formData.secondary_brand_color || formData.brand_color || 'fuchsia-500'}
            onChange={(val) => setFormData((prev: any) => ({ ...prev, brand_color: val }))}
            onSecondaryChange={(val) => setFormData((prev: any) => ({ ...prev, secondary_brand_color: val }))}
          />
        </EditorAccordion>
      )}

      <VisualAssetsSection
        formData={formData}
        setFormData={setFormData}
        onReload={onReload}
        isClientPortal={isClientPortal}
        isOpen={openSection === 'visuals'}
        onToggle={() => toggleSection('visuals')}
      />

      <IntegrationsSection
        formData={formData}
        showOrderingUrl={blueprint.showOrderingUrl}
        isOpen={openSection === 'integrations'}
        onToggle={() => toggleSection('integrations')}
        onChange={handleChange}
      />
    </div>
  );
}