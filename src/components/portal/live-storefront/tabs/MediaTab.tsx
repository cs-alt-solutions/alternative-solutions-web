/* src/components/portal/live-storefront/tabs/MediaTab.tsx */
import React, { useState } from 'react';
import { ImagePlus, Trash2, Loader2, Layers, AlignLeft, Type } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function MediaTab({ storeId, formData, updateForm }: { storeId: string, formData: any, updateForm: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const galleryItems = formData.gallery_items || [];
  const activeServices = formData.capabilities || [];

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newItems: { imageUrl: string; title: string; service: string; description: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${storeId}/gallery-${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
        
        // 🚀 FORMATTING FIX: Standardized to 'imageUrl'
        newItems.push({ 
          imageUrl: data.publicUrl, 
          title: '', 
          service: 'MAIN PORTFOLIO', 
          description: '' 
        });
      }

      updateForm({ gallery_items: [...galleryItems, ...newItems] });
    } catch (error) {
      console.error("Gallery upload failed:", error);
      alert("Failed to upload gallery images.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    const updatedGallery = galleryItems.filter((_: any, index: number) => index !== indexToRemove);
    updateForm({ gallery_items: updatedGallery });
  };

  const updateGalleryItem = (index: number, field: 'title' | 'service' | 'description', value: string) => {
    const updatedGallery = [...galleryItems];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    updateForm({ gallery_items: updatedGallery });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-rose-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Media Ecosystem</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Manage and assign portfolio assets</p>
          </div>
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} 
            Add Media
            <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryUpload} />
          </label>
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {galleryItems.map((item: any, index: number) => (
            <div key={index} className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg p-3 space-y-3 group flex flex-col">
              
              {/* IMAGE PREVIEW REGION */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-zinc-800/50">
                <img src={item.imageUrl} alt={item.title || `Gallery ${index}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 p-2 bg-black/80 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                  title="Remove Asset"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* DETAILS REGION */}
              <div className="space-y-3 flex-1 flex flex-col">
                
                {/* Title Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Type size={12} />
                  </div>
                  <input 
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                    placeholder="Title/Name"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-zinc-600 font-medium"
                  />
                </div>

                {/* Service Link Dropdown */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/60">
                    <Layers size={12} />
                  </div>
                  <select
                    value={item.service || 'MAIN PORTFOLIO'}
                    onChange={(e) => updateGalleryItem(index, 'service', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-[10px] font-bold text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-colors uppercase tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="MAIN PORTFOLIO">-- MAIN PORTFOLIO --</option>
                    {activeServices.map((service: any, sIdx: number) => (
                      <option key={sIdx} value={service.title}>{service.title}</option>
                    ))}
                  </select>
                </div>

                {/* Description Overlay Text */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-3 text-zinc-600">
                    <AlignLeft size={12} />
                  </div>
                  <textarea 
                    value={item.description || ''}
                    onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                    placeholder="Description overlay text..."
                    rows={3}
                    className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-zinc-600 resize-none"
                  />
                </div>

              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {galleryItems.length === 0 && !isUploading && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">No portfolio media added yet.</p>
            </div>
          )}

          {/* UPLOADING STATE */}
          {isUploading && (
            <div className="aspect-3/4 bg-zinc-900/50 border border-dashed border-rose-500/30 rounded-2xl flex flex-col items-center justify-center animate-pulse shadow-inner">
              <Loader2 className="w-8 h-8 text-rose-400 animate-spin mb-3" />
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Processing Assets...</span>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}