/* src/components/portal/live-storefront/tabs/MediaTab.tsx */
import React, { useState } from 'react';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function MediaTab({ storeId, formData, updateForm }: { storeId: string, formData: any, updateForm: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newUrls: string[] = [];

      // Loop through and upload all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${storeId}/gallery-${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }

      // Append the new images to the existing gallery array
      const currentGallery = formData.gallery_items || [];
      updateForm({ gallery_items: [...currentGallery, ...newUrls] });

    } catch (error) {
      console.error("Gallery upload failed:", error);
      alert("Failed to upload gallery images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    const currentGallery = formData.gallery_items || [];
    const updatedGallery = currentGallery.filter((_: any, index: number) => index !== indexToRemove);
    updateForm({ gallery_items: updatedGallery });
  };

  const galleryItems = formData.gallery_items || [];

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-rose-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Gallery Roster</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Manage your portfolio images</p>
          </div>
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} 
            Add Images
            {/* 'multiple' allows batch selection */}
            <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryUpload} />
          </label>
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          
          {galleryItems.map((url: string, index: number) => (
            <div key={index} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative group shadow-inner">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <button
                onClick={() => removeGalleryImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                title="Remove Image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* EMPTY STATE */}
          {galleryItems.length === 0 && !isUploading && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-xl bg-black/20">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">No gallery images uploaded yet.</p>
            </div>
          )}

          {/* UPLOADING STATE (Visual Feedback) */}
          {isUploading && (
            <div className="aspect-square bg-zinc-900/50 border border-dashed border-rose-500/30 rounded-xl flex flex-col items-center justify-center animate-pulse">
              <Loader2 className="w-6 h-6 text-rose-400 animate-spin mb-2" />
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Uploading...</span>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}