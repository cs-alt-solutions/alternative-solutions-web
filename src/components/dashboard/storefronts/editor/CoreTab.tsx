/* src/components/dashboard/storefronts/editor/CoreTab.tsx */
'use client';

import React from 'react';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import ContactSection from './core/ContactSection';
import LeadCapture from './core/LeadCapture';

export default function CoreTab({ formData, setFormData, onReload }: { formData: any; setFormData: any; onReload?: () => void; }) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <HeroContent formData={formData} handleChange={handleChange} />
      <StoryAbout formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <ContactSection formData={formData} handleChange={handleChange} />
      <LeadCapture formData={formData} setFormData={setFormData} />
    </div>
  );
}