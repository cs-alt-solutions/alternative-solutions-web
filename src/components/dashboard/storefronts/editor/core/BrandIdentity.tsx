// src/components/dashboard/storefronts/editor/core/BrandIdentity.tsx
import React from 'react';
import { Store, Link as LinkIcon, Mail, Tag } from 'lucide-react';

// 🧠 THE TAXONOMY DICTIONARY: Single Source of Truth for Industries
const INDUSTRY_CATEGORIES = [
  { id: 'E-Commerce', label: 'E-Commerce', description: 'Online stores, physical products, merch, and apparel.' },
  { id: 'Automotive', label: 'Automotive', description: 'Mechanics, detailing, custom shops, and dealerships.' },
  { id: 'Culinary', label: 'Culinary', description: 'Restaurants, coffee shops, bakeries, and meal prep.' },
  { id: 'Wellness', label: 'Wellness', description: 'Apothecaries, salons, fitness, spas, and therapists.' },
  { id: 'Creative', label: 'Creative', description: 'Photographers, designers, portfolios, and agencies.' },
  { id: 'Contracting', label: 'Contracting', description: 'Construction, landscaping, HVAC, and home services.' },
  { id: 'Consulting', label: 'Consulting', description: 'B2B services, coaching, legal, and financial advisors.' },
  { id: 'Tech & SaaS', label: 'Tech & SaaS', description: 'Software, mobile apps, and digital tools.' },
  { id: 'Local Services', label: 'Local Services', description: 'Cleaning, moving, pet care, and event planning.' },
  { id: 'General', label: 'General / Other', description: 'Standard business operations that do not easily fit above.' }
];

export default function BrandIdentity({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  
  // Find the currently selected category to display its helper text
  const currentCategory = INDUSTRY_CATEGORIES.find(c => c.id === (formData.industry_tag || 'General')) 
    || INDUSTRY_CATEGORIES[INDUSTRY_CATEGORIES.length - 1];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 text-cyan-400">
          <Store size={18} />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Brand Identity</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Business Name</label>
          <input name="business_name" value={formData.business_name || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors" />
        </div>

        {/* Routing Slug */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><LinkIcon size={10} /> Routing Slug</label>
          <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-cyan-400 font-mono text-sm outline-none focus:border-cyan-500 transition-colors" />
        </div>

        {/* Public Email */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> Public Email</label>
          <input name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors" placeholder="hello@example.com" />
        </div>

        {/* 🟢 THE NEW INDUSTRY TAG DROPDOWN */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Tag size={10} /> Industry Category
          </label>
          <select 
            name="industry_tag" 
            value={formData.industry_tag || 'General'} 
            onChange={handleChange}
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
          >
            {INDUSTRY_CATEGORIES.map(category => (
              <option key={category.id} value={category.id} className="bg-zinc-900 text-white">
                {category.label}
              </option>
            ))}
          </select>
          {/* Dynamic Helper Text */}
          <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
            i.e., {currentCategory.description}
          </p>
        </div>

      </div>
    </div>
  );
}