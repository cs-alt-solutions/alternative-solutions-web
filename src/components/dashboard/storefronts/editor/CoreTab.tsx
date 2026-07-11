'use client';

import React from 'react';
import BrandIdentity from './core/BrandIdentity';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import CustomHeadings from './core/CustomHeadings';

export default function CoreTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  
  // The global state handles the master data. We just need to handle local input changes!
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 relative pt-6">
      <BrandIdentity formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <HeroContent formData={formData} handleChange={handleChange} />
      <StoryAbout formData={formData} handleChange={handleChange} setFormData={setFormData} />
      <CustomHeadings formData={formData} handleChange={handleChange} />
    </div>
  );
}