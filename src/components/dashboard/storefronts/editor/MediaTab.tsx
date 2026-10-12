/* src/components/dashboard/storefronts/editor/MediaTab.tsx */
'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Move, Store, Link as LinkIcon, Mail, Tag, MapPin, Utensils, Unplug, HelpCircle } from 'lucide-react';
import { updateStorefrontMedia } from '@/app/actions/storefronts';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';

const TooltipLabel = ({ label, icon: Icon, tooltip, iconColor = "text-zinc-500", tooltipColor = "text-zinc-300" }: any) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    {Icon && <Icon size={10} className={iconColor} />}
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">{label}</label>
    {tooltip && <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors ml-1" />}
    
    {tooltip && (
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        <p className={`text-[10px] ${tooltipColor} normal-case tracking-normal font-medium leading-relaxed`}>
          {tooltip}
        </p>
      </div>
    )}
  </div>
);

export default function MediaTab({ formData, setFormData, onReload }: { formData: any, setFormData: any, onReload?: () => void }) {
  const [isUploadingCore, setIsUploadingCore] = useState(false);
  const coreFormRef = useRef<HTMLFormElement>(null);

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const isCulinary = formData.industry_tag === 'Culinary';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleHeroSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroPreview(URL.createObjectURL(file));
  };

  const handleAboutSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAboutPreview(URL.createObjectURL(file));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  async function handleSaveCore(uploadData: FormData) {
    setIsUploadingCore(true);
    uploadData.set('logo_size', formData.logo_size || 'large');
    uploadData.set('hero_position', formData.hero_position || 'center');
    
    try {
      const response = await updateStorefrontMedia(formData.id, formData.slug, uploadData);
      if (response?.updatedMedia) {
        setFormData((prev: any) => ({ ...prev, ...response.updatedMedia }));
      }
      if (coreFormRef.current) {
        const fileInputs = coreFormRef.current.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => { (input as HTMLInputElement).value = ''; });
      }
      if (onReload) onReload(); 
    } catch (e: any) {
      alert(e.message || "Upload failed. Check storage permissions.");
    } finally {
      setIsUploadingCore(false);
    }
  }

  const positionClassMap: Record<string, string> = {
    'top': 'object-top',
    'center': 'object-center',
    'bottom': 'object-bottom',
    'left': 'object-left',
    'right': 'object-right',
  };

  const activePosition = positionClassMap[formData.hero_position || 'center'];

  return (
    <div className="space-y-10 pb-12 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTOR 1: GLOBAL IDENTITY SETTINGS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Store className="w-4 h-4 text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Global Identity</h2>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TooltipLabel label="Business Name" />
              <input name="business_name" value={formData.business_name || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. Blaze & Bloom" />
            </div>
            <div>
              <TooltipLabel label="Routing Slug" icon={LinkIcon} iconColor="text-cyan-500/70" />
              <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-cyan-400 font-mono text-xs outline-none focus:border-cyan-500 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TooltipLabel label="Public Email" icon={Mail} iconColor="text-cyan-500/70" />
              <input name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder="hello@example.com" />
            </div>
            <div>
              <TooltipLabel label="Industry Category" icon={Tag} iconColor="text-cyan-500/70" />
              <select name="industry_tag" value={formData.industry_tag || 'General'} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer">
                {STOREFRONT_EDITOR_COPY.INDUSTRIES?.map((category: any) => (
                  <option key={category.id} value={category.id} className="bg-zinc-900 text-white">{category.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTOR 2: INTEGRATIONS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Unplug className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Integrations</h2>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
          <div>
            <TooltipLabel label="Google Maps Embed" icon={MapPin} iconColor="text-emerald-500/70" tooltip="Leave blank if you operate remotely or don't have a public headquarters." tooltipColor="text-emerald-400" />
            <input name="map_embed_url" value={formData.map_embed_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder='Paste <iframe src="..."> here' />
          </div>
          {isCulinary && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <TooltipLabel label="Online Ordering URL" icon={Utensils} iconColor="text-emerald-500/70" tooltip="If provided, an 'Order Online' button will display on the storefront to funnel customers directly to external checkout." tooltipColor="text-emerald-400" />
              <input name="ordering_url" value={formData.ordering_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder="https://order.toasttab.com/..." />
            </div>
          )}
        </div>
      </div>

      {/* SECTOR 3: MEDIA ASSETS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <ImageIcon className="w-4 h-4 text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Brand Visuals</h2>
        </div>
        
        <form 
          ref={coreFormRef} 
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSaveCore(new FormData(e.currentTarget));
          }} 
          className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
              <span>Hero Background Image</span>
            </label>
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreview || formData.hero_image || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE'} alt="Hero" className={`w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity ${activePosition}`} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input type="file" accept="image/*" name="hero_file" onChange={handleHeroSelect} className="flex-1 text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
                <div className="relative shrink-0 w-full sm:w-40">
                  <Move className="w-3 h-3 text-cyan-500 absolute left-2.5 top-2.5 pointer-events-none" />
                  <select
                    name="hero_position"
                    value={formData.hero_position || 'center'}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, hero_position: e.target.value }))}
                    className="w-full bg-black border border-zinc-800 rounded-md pl-7 pr-2 py-1.5 text-[10px] font-bold text-zinc-300 outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider appearance-none cursor-pointer"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top (Headroom)</option>
                    <option value="bottom">Bottom (Floor)</option>
                    <option value="left">Left Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800/60">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Brand Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview || formData.brand_logo || 'https://via.placeholder.com/800x800/000000/333333?text=NO+LOGO'} alt="Logo" className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input type="file" accept="image/*" name="logo_file" onChange={handleLogoSelect} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
                <select
                  name="logo_size"
                  value={formData.logo_size || 'large'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, logo_size: e.target.value }))}
                  className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <option value="small">Small & Subtle</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large & Bold</option>
                  <option value="massive">Massive (Heroic)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800/60">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">About Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={aboutPreview || formData.about_image || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE'} alt="About" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <input type="file" accept="image/*" name="about_file" onChange={handleAboutSelect} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={isUploadingCore} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black tracking-widest text-[10px] uppercase py-3 rounded-lg transition-all shadow-[0_0_10px_rgba(8,145,178,0.2)] disabled:opacity-50 mt-2">
            <UploadCloud className="w-3.5 h-3.5" /> {isUploadingCore ? 'UPLOADING...' : 'SAVE MEDIA ASSETS'}
          </button>
        </form>
      </div>
    </div>
  );
}