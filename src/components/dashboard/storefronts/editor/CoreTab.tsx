// src/components/dashboard/storefronts/editor/CoreTab.tsx
'use client';
import React from 'react';
import BrandIdentity from './core/BrandIdentity';
import HeroContent from './core/HeroContent';
import ContactSection from './core/ContactSection';
import StoryAbout from './core/StoryAbout';

export default function CoreTab({ formData, setFormData, onReload }: { formData: any; setFormData: any; onReload?: () => void; }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <BrandIdentity formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <HeroContent formData={formData} handleChange={handleChange} />
      <StoryAbout formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <ContactSection formData={formData} handleChange={handleChange} />
    </div>
  );
}