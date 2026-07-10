'use client';

import React, { useState, useRef } from 'react';
import { X, Plus, Store, Link as LinkIcon, Palette, Image as ImageIcon, Sparkles, UploadCloud } from 'lucide-react';
import { createStorefront } from '@/app/actions';

// The Expanded SaaS Color Palette
const BRAND_COLORS = [
  { name: 'Slate Gray', value: 'slate-500' },
  { name: 'Crimson Red', value: 'red-500' },
  { name: 'Rose', value: 'rose-500' },
  { name: 'Industrial Orange', value: 'orange-500' },
  { name: 'Amber Gold', value: 'amber-500' },
  { name: 'Electric Yellow', value: 'yellow-400' },
  { name: 'Lime', value: 'lime-400' },
  { name: 'Emerald Green', value: 'emerald-500' },
  { name: 'Teal', value: 'teal-500' },
  { name: 'Cyber Cyan', value: 'cyan-500' },
  { name: 'Ocean Blue', value: 'blue-500' },
  { name: 'Deep Indigo', value: 'indigo-500' },
  { name: 'Royal Violet', value: 'violet-500' },
  { name: 'Neon Fuchsia', value: 'fuchsia-500' },
  { name: 'Hot Pink', value: 'pink-500' },
];

export default function NewStorefrontModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBusinessName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  async function handleAction(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createStorefront(formData);
      setIsOpen(false);
      setBusinessName('');
      setSlug('');
      if (formRef.current) formRef.current.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to provision storefront. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold px-5 py-2.5 rounded-md transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(8,145,178,0.4)]"
      >
        <Plus className="w-5 h-5" />
        NEW STOREFRONT
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Provision New Storefront</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Instant SaaS Deployment</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form ref={formRef} action={handleAction} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Store className="w-3 h-3" /> Business Name
                  </label>
                  <input 
                    required
                    name="business_name"
                    value={businessName}
                    onChange={handleNameChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none"
                    placeholder="e.g. Bob's Bakery"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> URL Routing Slug
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-600">/</span>
                    <input 
                      required
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-4 py-3 text-cyan-400 font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Primary Tagline
                </label>
                <input 
                  required
                  name="tagline"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none"
                  placeholder="e.g. Fresh Pastries Every Morning."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Brand Accent Color
                </label>
                <select 
                  name="brand_color"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none"
                >
                  {BRAND_COLORS.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* THE NEW FILE UPLOADERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> Hero Background Image
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    required
                    name="hero_file"
                    className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 file:transition-colors cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> About Section Image
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    required
                    name="about_file"
                    className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 file:transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-lg font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-zinc-950 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                >
                  {isSubmitting ? 'UPLOADING & PROVISIONING...' : 'DEPLOY STOREFRONT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}