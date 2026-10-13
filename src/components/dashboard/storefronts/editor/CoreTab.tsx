'use client';
import React, { useState } from 'react';
import { Store, Type, BookOpen, MessageSquare } from 'lucide-react';
import EditorAccordion from './shared/EditorAccordion';
import BrandIdentity from './core/BrandIdentity';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import ContactSection from './core/ContactSection';
import LeadCapture from './core/LeadCapture';

export default function CoreTab({ formData, setFormData, onReload }: { formData: any; setFormData: any; onReload?: () => void; }) {
  const [openZone, setOpenZone] = useState<string | null>(null);
  const toggleZone = (zone: string) => setOpenZone(prev => prev === zone ? null : zone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const coreProgress = Math.round((['business_name', 'slug', 'contact_email'].filter(f => formData[f]).length / 3) * 100);
  const heroProgress = Math.round((['tagline', 'subtext', 'primary_cta'].filter(f => formData[f]).length / 3) * 100);
  const storyProgress = Math.round((['about_heading', 'about_bio'].filter(f => formData[f]).length / 2) * 100);
  const contactProgress = Math.round((['capabilities_heading', 'gallery_heading'].filter(f => formData[f]).length / 2) * 100);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <EditorAccordion title="Core Identity" icon={Store} accentColor="cyan" progress={coreProgress} isOpen={openZone === 'identity'} onToggle={() => toggleZone('identity')}>
        <BrandIdentity formData={formData} handleChange={handleChange} setFormData={setFormData} />
      </EditorAccordion>

      <EditorAccordion title="Hero Content" icon={Type} accentColor="fuchsia" progress={heroProgress} isOpen={openZone === 'hero'} onToggle={() => toggleZone('hero')}>
        <HeroContent formData={formData} handleChange={handleChange} />
      </EditorAccordion>

      <EditorAccordion title="Story & About" icon={BookOpen} accentColor="emerald" progress={storyProgress} isOpen={openZone === 'story'} onToggle={() => toggleZone('story')}>
        <StoryAbout formData={formData} handleChange={handleChange} setFormData={setFormData} />
      </EditorAccordion>

      <EditorAccordion title="Contact & Capture" icon={MessageSquare} accentColor="indigo" progress={contactProgress} isOpen={openZone === 'contact'} onToggle={() => toggleZone('contact')}>
        <div className="space-y-6">
          <ContactSection formData={formData} handleChange={handleChange} />
          <LeadCapture formData={formData} setFormData={setFormData} />
        </div>
      </EditorAccordion>
    </div>
  );
}