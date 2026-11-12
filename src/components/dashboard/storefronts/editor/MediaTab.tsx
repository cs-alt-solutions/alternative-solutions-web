/* src/components/dashboard/storefronts/editor/MediaTab.tsx */
'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, Move, Store, Link as LinkIcon, 
  Mail, Tag, MapPin, Utensils, Unplug, HelpCircle, LayoutTemplate, Palette, Loader2 
} from 'lucide-react';
import { updateStorefrontMedia } from '@/app/actions/storefronts';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';
import { 
  EDITOR_WORKSPACE_COPY, VISUAL_ARCH_COPY, THEME_CONSTRAINTS, getActiveBlueprint 
} from '@/config/dashboard/editor';
import EditorAccordion from './shared/EditorAccordion';
import VibeSelector from './core/VisualArchitecture/VibeSelector';
import ColorSelector from './core/VisualArchitecture/ColorSelector';

const TooltipLabel = ({ label, icon: Icon, tooltip, iconColor = "text-zinc-500", tooltipColor = "text-zinc-300" }: any) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    {Icon && <Icon size={10} className={iconColor} />}
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">{label}</label>
    {tooltip && <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors ml-1" />}
    
    {tooltip && (
      <div className="absolute bottom-full left-0 mb-2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        <p className={`text-[10px] ${tooltipColor} normal-case tracking-normal font-medium leading-relaxed`}>
          {tooltip}
        </p>
      </div>
    )}
  </div>
);

export default function MediaTab({ 
  formData, setFormData, onReload, isClientPortal = false 
}: { 
  formData: any; setFormData: any; onReload?: () => void; isClientPortal?: boolean;
}) {
  const [uploadingField, setUploadingField] = useState<'hero' | 'logo' | 'about' | null>(null);
  const [openDesignZone, setOpenDesignZone] = useState<string | null>(null);

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const copy = EDITOR_WORKSPACE_COPY.CORE_TAB;
  const blueprint = getActiveBlueprint(formData.industry_tag, formData.engine_mode);
  const currentTheme = formData.theme_style || 'industrial';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThemeSwitch = (newTheme: string) => {
    const constraints = THEME_CONSTRAINTS[newTheme] || THEME_CONSTRAINTS['industrial'];
    let newHero = formData.hero_layout;
    let newContent = formData.content_layout;
    let newAbout = formData.about_layout;
    
    if (!constraints.hero.includes(newHero)) newHero = constraints.hero[0];
    if (!constraints.content.includes(newContent)) newContent = constraints.content[0];
    if (!constraints.about.includes(newAbout)) newAbout = constraints.about[0];
    
    setFormData((prev: any) => ({ 
      ...prev, theme_style: newTheme, hero_layout: newHero, content_layout: newContent, about_layout: newAbout 
    }));
  };

  // Auto-upload single file selection so no secondary Save button is needed
  const handleAutoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    fieldKey: 'hero_file' | 'logo_file' | 'about_file',
    previewSetter: (url: string) => void,
    loadingType: 'hero' | 'logo' | 'about'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    previewSetter(URL.createObjectURL(file));
    setUploadingField(loadingType);

    const uploadData = new FormData();
    uploadData.set(fieldKey, file);
    uploadData.set('logo_size', formData.logo_size || 'large');
    uploadData.set('hero_position', formData.hero_position || 'center');

    try {
      const response = await updateStorefrontMedia(formData.id, formData.slug, uploadData);
      if (response?.updatedMedia) {
        setFormData((prev: any) => ({ ...prev, ...response.updatedMedia }));
      }
      if (onReload) onReload();
    } catch (err: any) {
      alert(err.message || "Upload failed. Check storage permissions.");
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const positionClassMap: Record<string, string> = {
    'top': 'object-top',
    'center': 'object-center',
    'bottom': 'object-bottom',
    'left': 'object-left',
    'right': 'object-right',
  };
  const activePosition = positionClassMap[formData.hero_position || 'center'];

  return (
    <div className="space-y-10 pb-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTOR 1: GLOBAL IDENTITY SETTINGS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Store className="w-4 h-4 text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.IDENTITY_HEADING}</h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TooltipLabel label={copy.BUSINESS_NAME_LABEL} />
              <input name="business_name" value={formData.business_name || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder={copy.BUSINESS_NAME_PLACEHOLDER} />
            </div>
            <div>
              <TooltipLabel label={copy.SLUG_LABEL} icon={LinkIcon} iconColor="text-cyan-500/70" />
              <input name="slug" value={formData.slug || ''} onChange={handleChange} disabled={isClientPortal} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-cyan-400 font-mono text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TooltipLabel label={copy.EMAIL_LABEL} icon={Mail} iconColor="text-cyan-500/70" />
              <input name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder={copy.EMAIL_PLACEHOLDER} />
            </div>
            {!isClientPortal && (
              <div>
                <TooltipLabel label={copy.INDUSTRY_LABEL} icon={Tag} iconColor="text-cyan-500/70" />
                <select name="industry_tag" value={formData.industry_tag || 'General'} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer">
                  {STOREFRONT_EDITOR_COPY.INDUSTRIES?.map((category: any) => (
                    <option key={category.id} value={category.id} className="bg-zinc-900 text-white">{category.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTOR 2: FOUNDATION VIBE & COLOR MAPPING (Admin Only) */}
      {!isClientPortal && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Palette className="w-4 h-4 text-fuchsia-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.VIBE_HEADING}</h2>
          </div>

          <div className="space-y-3">
            <EditorAccordion
              title={VISUAL_ARCH_COPY.ACCORDIONS.VIBE}
              icon={LayoutTemplate}
              accentColor="cyan"
              hidePercentage={true}
              isOpen={openDesignZone === 'vibe'}
              onToggle={() => setOpenDesignZone(prev => prev === 'vibe' ? null : 'vibe')}
            >
              <VibeSelector currentTheme={currentTheme} onChange={handleThemeSwitch} />
            </EditorAccordion>

            <EditorAccordion
              title={VISUAL_ARCH_COPY.ACCORDIONS.COLORS}
              icon={Palette}
              accentColor="indigo"
              hidePercentage={true}
              isOpen={openDesignZone === 'colors'}
              onToggle={() => setOpenDesignZone(prev => prev === 'colors' ? null : 'colors')}
            >
              <ColorSelector
                brandColor={formData.brand_color || 'cyan-500'}
                secondaryBrandColor={formData.secondary_brand_color || formData.brand_color || 'fuchsia-500'}
                onChange={(val) => setFormData((prev: any) => ({ ...prev, brand_color: val }))}
                onSecondaryChange={(val) => setFormData((prev: any) => ({ ...prev, secondary_brand_color: val }))}
              />
            </EditorAccordion>
          </div>
        </div>
      )}

      {/* SECTOR 3: MEDIA ASSETS (Auto-syncs on file pick, no redundant save button) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <ImageIcon className="w-4 h-4 text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.VISUALS_HEADING}</h2>
        </div>
        
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
              <span>{copy.HERO_BG_LABEL}</span>
              {uploadingField === 'hero' && <span className="text-cyan-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> SYNCING...</span>}
            </label>
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreview || formData.hero_image || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE'} alt="Hero" className={`w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity ${activePosition}`} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={uploadingField === 'hero'}
                  onChange={(e) => handleAutoUpload(e, 'hero_file', setHeroPreview, 'hero')} 
                  className="flex-1 text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" 
                />
                {!isClientPortal && (
                  <div className="relative shrink-0 w-full sm:w-40">
                    <Move className="w-3 h-3 text-cyan-500 absolute left-2.5 top-2.5 pointer-events-none" />
                    <select
                      name="hero_position"
                      value={formData.hero_position || 'center'}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, hero_position: e.target.value }))}
                      className="w-full bg-black border border-zinc-800 rounded-md pl-7 pr-2 py-1.5 text-[10px] font-bold text-zinc-300 outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider appearance-none cursor-pointer"
                    >
                      <option value="center">{copy.POSITIONS.CENTER}</option>
                      <option value="top">{copy.POSITIONS.TOP}</option>
                      <option value="bottom">{copy.POSITIONS.BOTTOM}</option>
                      <option value="left">{copy.POSITIONS.LEFT}</option>
                      <option value="right">{copy.POSITIONS.RIGHT}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800/60">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between mb-2">
              <span>{copy.LOGO_LABEL}</span>
              {uploadingField === 'logo' && <span className="text-cyan-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> SYNCING...</span>}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview || formData.brand_logo || 'https://via.placeholder.com/800x800/000000/333333?text=NO+LOGO'} alt="Logo" className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={uploadingField === 'logo'}
                  onChange={(e) => handleAutoUpload(e, 'logo_file', setLogoPreview, 'logo')} 
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" 
                />
                {!isClientPortal && (
                  <select
                    name="logo_size"
                    value={formData.logo_size || 'large'}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, logo_size: e.target.value }))}
                    className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-cyan-500 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    <option value="small">{copy.LOGO_SIZES.SMALL}</option>
                    <option value="medium">{copy.LOGO_SIZES.MEDIUM}</option>
                    <option value="large">{copy.LOGO_SIZES.LARGE}</option>
                    <option value="massive">{copy.LOGO_SIZES.MASSIVE}</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800/60">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
              <span>{copy.ABOUT_IMG_LABEL}</span>
              {uploadingField === 'about' && <span className="text-cyan-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> SYNCING...</span>}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={aboutPreview || formData.about_image || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE'} alt="About" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <input 
                type="file" 
                accept="image/*" 
                disabled={uploadingField === 'about'}
                onChange={(e) => handleAutoUpload(e, 'about_file', setAboutPreview, 'about')} 
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTOR 4: INTEGRATIONS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Unplug className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.INTEGRATIONS_HEADING}</h2>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-4 shadow-sm">
          <div>
            <TooltipLabel label={copy.MAPS_LABEL} icon={MapPin} iconColor="text-emerald-500/70" tooltip={copy.MAPS_TOOLTIP} tooltipColor="text-emerald-400" />
            <input name="map_embed_url" value={formData.map_embed_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder={copy.MAPS_PLACEHOLDER} />
          </div>

          {blueprint.showOrderingUrl && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <TooltipLabel label={copy.ORDERING_LABEL} icon={Utensils} iconColor="text-emerald-500/70" tooltip={copy.ORDERING_TOOLTIP} tooltipColor="text-emerald-400" />
              <input name="ordering_url" value={formData.ordering_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder={copy.ORDERING_PLACEHOLDER} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}