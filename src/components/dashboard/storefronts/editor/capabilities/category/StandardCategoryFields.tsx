/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/category/StandardCategoryFields.tsx */
'use client';

import React, { useState } from 'react';
import { List, Layers, Image as ImageIcon, Plus, X, Loader2, UploadCloud, ChevronDown } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface StandardCategoryFieldsProps {
  cap: any;
  storefrontId: string;
  blueprint: any;
  copy: any;
  onUpdateField: (field: string, value: any) => void;
}

export default function StandardCategoryFields({
  cap,
  storefrontId,
  blueprint,
  copy,
  onUpdateField,
}: StandardCategoryFieldsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const bullets: string[] = cap.bullets || [];
  const addons: { title?: string }[] = cap.addons || [];

  const handleAddBullet = () => onUpdateField('bullets', [...bullets, '']);
  const handleUpdateBullet = (idx: number, val: string) =>
    onUpdateField('bullets', bullets.map((b, i) => (i === idx ? val : b)));
  const handleRemoveBullet = (idx: number) =>
    onUpdateField('bullets', bullets.filter((_, i) => i !== idx));

  const handleAddAddon = () => {
    setOptionsOpen(true);
    onUpdateField('addons', [...addons, { title: '' }]);
  };
  const handleUpdateAddon = (idx: number, val: string) =>
    onUpdateField('addons', addons.map((a, i) => (i === idx ? { ...a, title: val } : a)));
  const handleRemoveAddon = (idx: number) =>
    onUpdateField('addons', addons.filter((_, i) => i !== idx));

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${storefrontId}/cover-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (error) throw error;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      onUpdateField('coverImage', data.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload cover photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Highlights / Deliverables */}
      <div className="space-y-2 pt-3 border-t border-zinc-800/60">
        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <List size={11} className="text-cyan-500" /> {blueprint.deliverablesLabel}
        </label>

        <div className="space-y-1.5">
          {bullets.map((bullet, bIndex) => (
            <div key={bIndex} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
              <input
                value={bullet}
                onChange={(e) => handleUpdateBullet(bIndex, e.target.value)}
                placeholder={blueprint.deliverablePlaceholder}
                className="flex-1 bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleRemoveBullet(bIndex)}
                className="text-zinc-600 hover:text-rose-400 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddBullet}
          className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1 pt-1 cursor-pointer"
        >
          <Plus size={10} /> {blueprint.addDeliverableBtn}
        </button>
      </div>

      {/* Collapsible Quick Inquiry Options */}
      <div className="pt-2.5 border-t border-zinc-800/60 space-y-2">
        <button
          type="button"
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[9px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={11} className="text-fuchsia-500" />
            {blueprint.optionsLabel} ({addons.length})
          </span>
          <ChevronDown
            size={12}
            className={`text-zinc-500 transition-transform duration-200 ${optionsOpen ? 'rotate-180 text-fuchsia-400' : ''}`}
          />
        </button>

        {optionsOpen && (
          <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Optional checkboxes shown inside the Quick Inquiry form when a visitor inquires about this item.
            </p>

            {addons.length > 0 && (
              <div className="space-y-1.5">
                {addons.map((addon, addonIdx) => (
                  <div key={addonIdx} className="flex items-center gap-2">
                    <input
                      value={addon.title || ''}
                      onChange={(e) => handleUpdateAddon(addonIdx, e.target.value)}
                      placeholder={blueprint.optionPlaceholder}
                      className="flex-1 bg-black/40 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-zinc-300 focus:border-fuchsia-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addonIdx)}
                      className="text-zinc-600 hover:text-rose-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddAddon}
              className="text-[9px] font-bold text-zinc-500 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              <Plus size={10} /> {blueprint.addOptionBtn}
            </button>
          </div>
        )}
      </div>

      {/* Cover Photo */}
      <div className="space-y-2 pt-3 border-t border-zinc-800/60">
        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon size={11} className="text-cyan-500" /> {copy.COVER_PHOTO_LABEL}
        </label>

        {cap.coverImage ? (
          <div className="relative w-40 aspect-video rounded-md overflow-hidden border border-zinc-800 group">
            <img
              src={cap.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
            />
            <button
              type="button"
              onClick={() => onUpdateField('coverImage', '')}
              className="absolute top-1.5 right-1.5 p-1 bg-black/75 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="w-40 aspect-video rounded-md border border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
            {isUploading ? (
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 text-zinc-600 mb-1" />
            )}
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
              {copy.UPLOAD_COVER_BTN}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </>
  );
}