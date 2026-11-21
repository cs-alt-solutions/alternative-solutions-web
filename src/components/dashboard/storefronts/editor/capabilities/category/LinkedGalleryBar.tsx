/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/category/LinkedGalleryBar.tsx */
'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Star, UploadCloud, Loader2, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface LinkedGalleryBarProps {
  storefrontId: string;
  categoryTitle: string;
  legacyCoverImage?: string;
  galleryItems: any[];
  setFormData: any;
  onClearLegacyCover: () => void;
}

export default function LinkedGalleryBar({
  storefrontId,
  categoryTitle,
  legacyCoverImage,
  galleryItems = [],
  setFormData,
  onClearLegacyCover,
}: LinkedGalleryBarProps) {
  const [isUploading, setIsUploading] = useState(false);

  const normalized = (categoryTitle || '').trim().toLowerCase();
  const folderImages = galleryItems.filter(
    (g: any) => g && g.imageUrl?.trim() && normalized && g.category?.trim().toLowerCase() === normalized
  );
  const coverItem = folderImages[0] || null;
  const hiddenCount = folderImages.filter((g: any) => g.isVisible === false).length;

  const handleUploadToVault = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !categoryTitle?.trim()) return;
    setIsUploading(true);

    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${storefrontId}/${Date.now()}-${cleanName}`;
      const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (error) throw error;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      const newVaultItem = {
        id: `img-${Date.now()}`,
        imageUrl: data.publicUrl,
        title: '',
        description: '',
        category: categoryTitle.trim(),
        isVisible: true,
      };

      setFormData((prev: any) => {
        const current = Array.isArray(prev.gallery_items) ? prev.gallery_items : [];
        return { ...prev, gallery_items: [newVaultItem, ...current] };
      });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload photo to Drop Vault.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2 pt-3 border-t border-zinc-800/60">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon size={11} className="text-cyan-500" />
          Linked Gallery &amp; Cover ({folderImages.length})
        </span>
        <span className="text-[9px] font-mono text-zinc-600">Managed in Drop Vault</span>
      </div>

      <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
        {/* #1 Cover Thumbnail */}
        <div className="w-16 h-11 rounded-md overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 relative flex items-center justify-center">
          {coverItem ? (
            <>
              <img
                src={coverItem.imageUrl}
                alt="Folder Cover"
                className={`w-full h-full ${coverItem.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                style={
                  coverItem.imageFit === 'contain'
                    ? undefined
                    : { objectPosition: `${coverItem.focalPoint?.x ?? 50}% ${coverItem.focalPoint?.y ?? 50}%` }
                }
              />
              <span className="absolute top-0.5 left-0.5 p-0.5 rounded bg-amber-500 text-black">
                <Star size={7} className="fill-black" />
              </span>
            </>
          ) : (
            <ImageIcon size={14} className="text-zinc-700" />
          )}
        </div>

        {/* Summary + Direct Upload to Drop Vault */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-[10px] text-zinc-300 truncate">
            {coverItem
              ? `${folderImages.length} photo${folderImages.length === 1 ? '' : 's'} linked${hiddenCount > 0 ? ` · ${hiddenCount} hidden` : ''}`
              : 'No Drop Vault photos linked yet'}
          </p>
          <p className="text-[9px] text-zinc-500 leading-tight">
            Frame, caption, or star any cover photo inside Drop Vault.
          </p>
        </div>

        <label className="px-2.5 py-1.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shrink-0 transition-colors">
          {isUploading ? <Loader2 size={11} className="animate-spin" /> : <UploadCloud size={11} />}
          <span>{coverItem ? '+ Add' : 'Upload'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading || !categoryTitle?.trim()}
            onChange={handleUploadToVault}
          />
        </label>
      </div>

      {/* Clear Legacy Disconnected Cover */}
      {legacyCoverImage && (
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/25">
          <span className="text-[9px] font-mono text-amber-300 truncate">
            Legacy cover attached (superseded by Drop Vault)
          </span>
          <button
            type="button"
            onClick={onClearLegacyCover}
            className="flex items-center gap-1 text-[9px] font-bold uppercase text-amber-200 hover:text-white shrink-0 cursor-pointer"
          >
            <X size={10} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}