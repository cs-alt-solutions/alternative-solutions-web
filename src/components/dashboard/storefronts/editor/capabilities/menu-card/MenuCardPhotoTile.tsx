/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/menu-card/MenuCardPhotoTile.tsx */
'use client';

import React, { useState } from 'react';
import { ImagePlus, Loader2, FolderOpen } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface MenuCardPhotoTileProps {
  storefrontId: string;
  imageUrl?: string;
  isDeleting: boolean;
  copy: any;
  onImageUploaded: (publicUrl: string) => void;
  onOpenVault: () => void;
}

export default function MenuCardPhotoTile({
  storefrontId,
  imageUrl,
  isDeleting,
  copy,
  onImageUploaded,
  onOpenVault,
}: MenuCardPhotoTileProps) {
  const [isUploading, setIsUploading] = useState(false);
  const hasImage = !!imageUrl;

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${storefrontId}/gallery-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      onImageUploaded(data.publicUrl);
    } catch {
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center group shadow-inner">
      <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center hover:border-fuchsia-500 transition-colors z-0">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleDirectUpload}
          disabled={isUploading || isDeleting}
        />
        {isUploading ? (
          <Loader2 size={15} className="text-fuchsia-500 animate-spin" />
        ) : hasImage ? (
          <>
            <img
              src={imageUrl}
              alt="preview"
              className={`w-full h-full object-cover transition-opacity ${
                isDeleting ? 'opacity-30' : 'group-hover:opacity-40'
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ImagePlus size={14} className="text-white drop-shadow-md" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-fuchsia-400 transition-colors">
            <ImagePlus size={14} className="mb-0.5" />
            <span className="text-[6px] font-black uppercase tracking-widest text-center leading-tight">
              {copy.ADD_PHOTO_LINE_1}
              <br />
              {copy.ADD_PHOTO_LINE_2}
            </span>
          </div>
        )}
      </label>

      {!hasImage && !isUploading && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenVault();
          }}
          className="absolute bottom-0.5 right-0.5 p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500 rounded shadow-md z-10 transition-colors cursor-pointer"
          title={copy.BROWSE_VAULT_TITLE}
        >
          <FolderOpen size={9} />
        </button>
      )}
    </div>
  );
}