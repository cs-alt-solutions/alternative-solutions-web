// src/components/dashboard/storefronts/editor/core/BrandIdentity.tsx
import React from 'react';
import { Store, Link as LinkIcon, Mail, Tag, MessageSquareText, MapPin, Utensils } from 'lucide-react';

// 🧠 THE TAXONOMY DICTIONARY
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

// 🚀 STANDARD LEAD OPTIONS
const STANDARD_INQUIRY_TYPES = [
  "General Inquiry",
  "Request a Quote",
  "Job Application / Hiring",
  "Other"
];

export default function BrandIdentity({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  
  const currentCategory = INDUSTRY_CATEGORIES.find(c => c.id === (formData.industry_tag || 'General')) 
    || INDUSTRY_CATEGORIES[INDUSTRY_CATEGORIES.length - 1];

  // Safely grab the selected types or default to basic ones
  const selectedInquiries = formData.lead_inquiry_types || ["General Inquiry", "Request a Quote"];

  // 🚀 The click handler to toggle options in the array
  const toggleInquiryType = (type: string) => {
    let updated = [...selectedInquiries];
    if (updated.includes(type)) {
      updated = updated.filter((t: string) => t !== type);
    } else {
      updated.push(type);
    }
    setFormData((prev: any) => ({ ...prev, lead_inquiry_types: updated }));
  };

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

        {/* Industry Dropdown */}
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
          <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
            i.e., {currentCategory.description}
          </p>
        </div>

        {/* 🚀 GOOGLE MAPS EMBED */}
        <div className="space-y-2 md:col-span-2 pt-2 border-t border-zinc-800/50">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <MapPin size={10} className="text-cyan-400" /> Google Maps Embed URL
          </label>
          <input 
            name="map_embed_url" 
            value={formData.map_embed_url || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-700" 
            placeholder='Paste the <iframe src="..."> code or Google Maps URL here' 
          />
          <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
            Leave this blank if this business operates remotely or does not have a public headquarters.
          </p>
        </div>
        
        {/* 🚀 ONLINE ORDERING / TOAST LINK */}
        <div className="space-y-2 md:col-span-2 pt-2 border-t border-zinc-800/50">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Utensils size={10} className="text-cyan-400" /> Online Ordering URL (Toast, Square, etc.)
          </label>
          <input 
            name="ordering_url" 
            value={formData.ordering_url || ''} 
            onChange={handleChange} 
            className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-700" 
            placeholder="https://order.toasttab.com/online/..." 
          />
          <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
            If provided, an "Order Online" button will display on the storefront to funnel customers directly to their external checkout.
          </p>
        </div>

        {/* CLICKABLE LEAD INQUIRY TYPES */}
        <div className="space-y-3 md:col-span-2 pt-4 border-t border-zinc-800/50">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <MessageSquareText size={10} className="text-cyan-400" /> Form Options
          </label>
          <div className="flex flex-wrap gap-2">
            {STANDARD_INQUIRY_TYPES.map(type => {
              const isChecked = selectedInquiries.includes(type);
              return (
                <label 
                  key={type} 
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl cursor-pointer transition-all border ${
                    isChecked 
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => toggleInquiryType(type)} 
                    className="w-3.5 h-3.5 accent-cyan-500 cursor-pointer" 
                  />
                  <span className={`text-xs font-bold ${isChecked ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {type}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">
            Select the options you want to appear in this storefront's lead capture modal.
          </p>
        </div>

      </div>
    </div>
  );
}