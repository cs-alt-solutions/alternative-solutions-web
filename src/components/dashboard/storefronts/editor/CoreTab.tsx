/* src/components/dashboard/storefronts/editor/CoreTab.tsx */
/* Architecture Note: Renders the "Content" Tab (Hero + Structure, Story + Architecture, Contact, Lead Capture) */
'use client';

import React from 'react';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import ContactSection from './core/ContactSection';
import LeadCapture from './core/LeadCapture';
import { THEME_CONSTRAINTS } from '@/config/dashboard/editor';

export default function CoreTab({ 
  formData, setFormData, onReload, isClientPortal = false 
}: { 
  formData: any; setFormData: any; onReload?: () => void; isClientPortal?: boolean;
}) {
  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      <HeroContent 
        formData={formData} 
        setFormData={setFormData} 
        handleChange={handleChange} 
        allowedLayouts={allowedLayouts} 
        isClientPortal={isClientPortal} 
      />
      <StoryAbout 
        formData={formData} 
        handleChange={handleChange} 
        setFormData={setFormData} 
        allowedLayouts={allowedLayouts} 
        isClientPortal={isClientPortal} 
      />
      <ContactSection formData={formData} handleChange={handleChange} />
      <LeadCapture formData={formData} setFormData={setFormData} />
    </div>
  );
}