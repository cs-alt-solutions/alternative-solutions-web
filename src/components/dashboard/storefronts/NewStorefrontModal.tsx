/* src/components/dashboard/storefronts/NewStorefrontModal.tsx */
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { X, Plus, Store, Link as LinkIcon, Palette, Sparkles, UploadCloud, LayoutTemplate, Columns, MonitorPlay, Check, Rocket } from 'lucide-react';
import { createStorefront } from '@/app/actions/storefronts';
import { BRAND_COLORS, THEME_FAMILIES, VISUAL_ARCH_COPY } from '@/config/dashboard/editor';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

const LBL = VISUAL_ARCH_COPY.LAYOUTS.LABELS;

const MODAL_THEMES = THEME_FAMILIES.flatMap(f => {
  const list = [];
  if (f.dark) list.push({ name: f.light ? `${f.label} (${VISUAL_ARCH_COPY.VIBE.DARK})` : f.label, value: f.dark });
  if (f.light) list.push({ name: f.dark ? `${f.label} (${VISUAL_ARCH_COPY.VIBE.LIGHT})` : f.label, value: f.light });
  return list;
});

const MODAL_HEROS = [
  { name: LBL.CENTERED, value: 'center' },
  { name: LBL.SPLIT_LEFT, value: 'split-left' },
  { name: LBL.SPLIT_RIGHT, value: 'split-right' },
  { name: LBL.CINEMATIC, value: 'cinematic' },
  { name: LBL.GLASS, value: 'glass' }
];

const MODAL_CONTENTS = [
  { name: LBL.STACKED, value: 'classic' },
  { name: LBL.BENTO, value: 'bento' },
  { name: LBL.STICKY, value: 'sticky' },
  { name: LBL.EDITORIAL, value: 'editorial' },
  { name: LBL.ACCORDION, value: 'accordion' },
  { name: LBL.MENU, value: 'menu' },
  { name: LBL.LOOKBOOK, value: 'lookbook' },
  { name: LBL.HUB, value: 'hub' }
];

export default function NewStorefrontModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const copy = STOREFRONT_MANAGER_COPY.NEW_MODAL;

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
      alert(copy.ERROR_ALERT);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link 
        href="/storefronts/apply"
        target="_blank"
        className="flex items-center gap-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 text-fuchsia-400 font-bold px-4 py-2.5 rounded-md transition-all duration-300"
        title={copy.BTN_LAUNCH_TITLE}
      >
        <Rocket className="w-4 h-4" />
        <span className="hidden sm:inline">{copy.BTN_LAUNCH_APP}</span>
        <span className="sm:hidden">{copy.BTN_LAUNCH_POS}</span>
      </Link>

      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold px-4 py-2.5 rounded-md transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(8,145,178,0.4)] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{copy.BTN_MANUAL}</span>
        <span className="sm:hidden">{copy.BTN_MANUAL_SHORT}</span>
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
                  <h2 className="text-xl font-bold text-white tracking-tight">{copy.MODAL_TITLE}</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{copy.MODAL_SUBTITLE}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form ref={formRef} action={handleAction} className="p-6 overflow-y-auto space-y-8 text-left">
              
              <input type="hidden" name="is_template" value={isTemplate.toString()} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Store className="w-3 h-3" /> {copy.BUSINESS_NAME_LABEL}
                  </label>
                  <input 
                    required
                    name="business_name"
                    value={businessName}
                    onChange={handleNameChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                    placeholder={copy.BUSINESS_NAME_PLACEHOLDER}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> {copy.SLUG_LABEL}
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

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="space-y-2 md:col-span-8">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {copy.TAGLINE_LABEL}
                  </label>
                  <input 
                    required
                    name="tagline"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                    placeholder={copy.TAGLINE_PLACEHOLDER}
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
                        {copy.PROTOTYPE_TOGGLE}
                     </span>
                     <MonitorPlay className={`w-4 h-4 ml-auto ${isTemplate ? 'text-cyan-400' : 'text-zinc-600'}`} />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3 h-3" /> {copy.VIBE_LABEL}
                  </label>
                  <select 
                    name="theme_style"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500 cursor-pointer"
                  >
                    {MODAL_THEMES.map(theme => (
                      <option key={theme.value} value={theme.value}>{theme.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3 h-3 text-transparent" /> {copy.COLOR_LABEL}
                  </label>
                  <select 
                    name="brand_color"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500 cursor-pointer"
                  >
                    {BRAND_COLORS.map(color => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <LayoutTemplate className="w-3 h-3" /> {copy.HERO_LABEL}
                  </label>
                  <select 
                    name="hero_layout"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500 cursor-pointer"
                  >
                    {MODAL_HEROS.map(layout => (
                      <option key={layout.value} value={layout.value}>{layout.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Columns className="w-3 h-3" /> {copy.CONTENT_LABEL}
                  </label>
                  <select 
                    name="content_layout"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white outline-none appearance-none focus:border-cyan-500 cursor-pointer"
                  >
                    {MODAL_CONTENTS.map(layout => (
                      <option key={layout.value} value={layout.value}>{layout.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> {copy.HERO_BG_LABEL}
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
                    <UploadCloud className="w-4 h-4 text-cyan-500" /> {copy.ABOUT_IMG_LABEL}
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
                  className="px-6 py-3 rounded-lg font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copy.BTN_CANCEL}
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg font-black tracking-widest uppercase bg-cyan-600 hover:bg-cyan-500 text-zinc-950 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                >
                  {isSubmitting ? copy.BTN_PROVISIONING : copy.BTN_DEPLOY}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}