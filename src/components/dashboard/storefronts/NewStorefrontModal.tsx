'use client';

import React, { useState, useRef } from 'react';
import { X, Plus, Store, Link as LinkIcon, Palette, Sparkles, UploadCloud, LayoutTemplate, Columns, MonitorPlay, Check } from 'lucide-react';
// --- NEW IMPORT PATH ---
import { createStorefront } from '@/app/actions/storefronts';

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

const THEMES = [
  { name: 'Raw & Industrial', value: 'industrial' },
  { name: 'Neo-Brutalist', value: 'neo' },
  { name: 'Neon Cyberpunk', value: 'cyberpunk' },
  { name: 'Clean & Minimal', value: 'minimal' },
  { name: 'High Editorial', value: 'elegant' },
  { name: 'Earthy & Organic', value: 'organic' },
  { name: 'Classic Editorial', value: 'editorial' },
  { name: 'Midnight Onyx', value: 'midnight' } 
];

const HERO_LAYOUTS = [
  { name: 'Centered Focus', value: 'center' },
  { name: 'Bold Left Split', value: 'split-left' },
  { name: 'Bold Right Split', value: 'split-right' },
  { name: 'Full Cinematic', value: 'cinematic' }
];

const CONTENT_LAYOUTS = [
  { name: 'Standard Stack', value: 'classic' },
  { name: 'Bento Grid', value: 'bento' },
  { name: 'Sticky Scroll', value: 'sticky' },
  { name: 'Editorial Hover', value: 'editorial' },
  { name: 'Accordion Flow', value: 'accordion' }
];

export default function NewStorefrontModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
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
      setIsTemplate(false);
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50 shrink-0">
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

            <form ref={formRef} action={handleAction} className="p-6 overflow-y-auto space-y-8">
              
              {/* HIDDEN INPUT FOR TOGGLE STATE */}
              <input type="hidden" name="is_template" value={isTemplate.toString()} />

              {/* ROW 1: Identity */}
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                    placeholder="e.g. BB's Bodega"
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
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-4 py-3 text-cyan-400 font-mono outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 2: The Hook & Prototype Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="space-y-2 md:col-span-8">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Primary Tagline (H1)
                  </label>
                  <input 
                    required
                    name="tagline"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder="e.g. Loud. Unapologetic. Limited supply."
                  />
                </div>
                
                <div className="space-y-2 md:col-span-4 flex flex-col justify-end">
                   <div 
                     onClick={() => setIsTemplate(!isTemplate)}
                     className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isTemplate ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                   >
                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isTemplate ? 'bg-cyan-500 border-cyan-500' : 'border-zinc-600'}`}>
                        {isTemplate && <Check className="w-3 h-3 text-zinc-950" strokeWidth={4} />}
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${isTemplate ? 'text-cyan-400' : 'text-zinc-500'}`}>
                       Public Prototype
                     </span>
                     <MonitorPlay className={`w-4 h-4 ml-auto ${isTemplate ? 'text-cyan-400' : 'text-zinc-600'}`} />
                   </div>
                </div>
              </div>

              {/* ROW 3: Architecture & Vibe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Design Vibe
                  </label>
                  <select 
                    name="theme_style"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500"
                  >
                    {THEMES.map(theme => (
                      <option key={theme.value} value={theme.value}>{theme.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3 h-3 text-transparent" /> Brand Color
                  </label>
                  <select 
                    name="brand_color"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500"
                  >
                    {BRAND_COLORS.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROW 4: Layout Flows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutTemplate className="w-3 h-3" /> Hero Structure
                  </label>
                  <select 
                    name="hero_layout"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500"
                  >
                    {HERO_LAYOUTS.map(layout => (
                      <option key={layout.value} value={layout.value}>{layout.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Columns className="w-3 h-3" /> Content Flow
                  </label>
                  <select 
                    name="content_layout"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500"
                  >
                    {CONTENT_LAYOUTS.map(layout => (
                      <option key={layout.value} value={layout.value}>{layout.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROW 5: File Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> Hero Background
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
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> About Section
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

              <div className="pt-8 border-t border-zinc-800 flex justify-end gap-4 shrink-0">
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
                  className="px-8 py-3 rounded-lg font-black tracking-widest uppercase bg-cyan-600 hover:bg-cyan-500 text-zinc-950 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                >
                  {isSubmitting ? 'PROVISIONING...' : 'DEPLOY STOREFRONT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}