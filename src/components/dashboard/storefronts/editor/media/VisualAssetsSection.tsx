/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/media/VisualAssetsSection.tsx */
'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Move, Loader2, Upload, ChevronDown } from 'lucide-react';
import { updateStorefrontMedia } from '@/app/actions/storefronts';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import EditorAccordion from '../shared/EditorAccordion';

interface VisualAssetsSectionProps {
  formData: any;
  setFormData: any;
  onReload?: () => void;
  isClientPortal: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const POSITION_MAP: Record<string, string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
};

export default function VisualAssetsSection({
  formData,
  setFormData,
  onReload,
  isClientPortal,
  isOpen,
  onToggle,
}: VisualAssetsSectionProps) {
  const [uploadingField, setUploadingField] = useState<'hero' | 'logo' | 'about' | null>(null);
  const [previews, setPreviews] = useState<{ hero?: string; logo?: string; about?: string }>({});

  const copy = EDITOR_WORKSPACE_COPY.CORE_TAB;
  const activePosition = POSITION_MAP[formData.hero_position || 'center'];

  const activeHeroSrc = previews.hero || formData.hero_image || '';
  const activeLogoSrc = previews.logo || formData.brand_logo || '';
  const activeAboutSrc = previews.about || formData.about_image || '';
  const progress = Math.round(([activeHeroSrc, activeLogoSrc, activeAboutSrc].filter(Boolean).length / 3) * 100);

  const handleAutoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: 'hero_file' | 'logo_file' | 'about_file',
    type: 'hero' | 'logo' | 'about'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    setUploadingField(type);

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
      alert(err.message || 'Upload failed. Check storage permissions.');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  return (
    <EditorAccordion
      title={copy.VISUALS_HEADING}
      icon={ImageIcon}
      accentColor="amber"
      progress={progress}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3.5">
        {/* Hero Background */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{copy.HERO_BG_LABEL}</span>
            {uploadingField === 'hero' && (
              <span className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> SYNCING...
              </span>
            )}
          </div>

          <div className="w-full h-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 relative flex items-center justify-center">
            {activeHeroSrc ? (
              <img src={activeHeroSrc} alt="Hero" className={`w-full h-full object-cover opacity-85 ${activePosition}`} />
            ) : (
              <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono uppercase">
                <ImageIcon size={14} /> No Hero Image
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-[10px] font-bold uppercase tracking-wider text-zinc-200 cursor-pointer transition-colors">
              <Upload size={11} className="text-amber-400" />
              <span>{activeHeroSrc ? 'Replace Hero' : 'Upload Hero'}</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploadingField === 'hero'} onChange={(e) => handleAutoUpload(e, 'hero_file', 'hero')} />
            </label>

            {!isClientPortal && (
              <div className="relative w-32 shrink-0">
                <Move className="w-3 h-3 text-amber-400/80 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="hero_position"
                  value={formData.hero_position || 'center'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, hero_position: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-6 pr-5 py-1.5 text-[10px] font-bold text-zinc-300 outline-none focus:border-amber-500 uppercase tracking-wider appearance-none cursor-pointer"
                >
                  <option value="center">{copy.POSITIONS.CENTER}</option>
                  <option value="top">{copy.POSITIONS.TOP}</option>
                  <option value="bottom">{copy.POSITIONS.BOTTOM}</option>
                  <option value="left">{copy.POSITIONS.LEFT}</option>
                  <option value="right">{copy.POSITIONS.RIGHT}</option>
                </select>
                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Brand Logo */}
        <div className="pt-3 border-t border-zinc-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{copy.LOGO_LABEL}</span>
            {uploadingField === 'logo' && (
              <span className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> SYNCING...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0 flex items-center justify-center p-1.5">
              {activeLogoSrc ? <img src={activeLogoSrc} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon size={16} className="text-zinc-700" />}
            </div>

            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              <label className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-[10px] font-bold uppercase tracking-wider text-zinc-200 cursor-pointer transition-colors">
                <Upload size={11} className="text-amber-400" />
                <span>{activeLogoSrc ? 'Replace Logo' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" className="hidden" disabled={uploadingField === 'logo'} onChange={(e) => handleAutoUpload(e, 'logo_file', 'logo')} />
              </label>

              {!isClientPortal && (
                <div className="relative">
                  <select
                    name="logo_size"
                    value={formData.logo_size || 'large'}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, logo_size: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-2.5 pr-6 py-1 text-[10px] font-bold text-zinc-300 outline-none focus:border-amber-500 uppercase tracking-wider appearance-none cursor-pointer"
                  >
                    <option value="small">{copy.LOGO_SIZES.SMALL}</option>
                    <option value="medium">{copy.LOGO_SIZES.MEDIUM}</option>
                    <option value="large">{copy.LOGO_SIZES.LARGE}</option>
                    <option value="massive">{copy.LOGO_SIZES.MASSIVE}</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Image */}
        <div className="pt-3 border-t border-zinc-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{copy.ABOUT_IMG_LABEL}</span>
            {uploadingField === 'about' && (
              <span className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> SYNCING...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0 flex items-center justify-center">
              {activeAboutSrc ? <img src={activeAboutSrc} alt="About" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-zinc-700" />}
            </div>

            <label className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-[10px] font-bold uppercase tracking-wider text-zinc-200 cursor-pointer transition-colors">
              <Upload size={11} className="text-amber-400" />
              <span>{activeAboutSrc ? 'Replace About Photo' : 'Upload About Photo'}</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploadingField === 'about'} onChange={(e) => handleAutoUpload(e, 'about_file', 'about')} />
            </label>
          </div>
        </div>
      </div>
    </EditorAccordion>
  );
}