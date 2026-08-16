/* src/components/portal/live-storefront/tabs/HeroTab.tsx */
import React, { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function HeroTab({ storeId, formData, updateForm }: { storeId: string, formData: any, updateForm: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${storeId}/live-hero_image-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      updateForm({ hero_image: data.publicUrl });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TEXT CONTENT */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Primary Hook (H1)</label>
          <input 
            value={formData.tagline}
            onChange={(e) => updateForm({ tagline: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Supporting Subtext</label>
          <textarea 
            value={formData.subtext}
            onChange={(e) => updateForm({ subtext: e.target.value })}
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />
        </div>
      </div>

      {/* MEDIA CONTENT */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-3xl p-5 shadow-xl backdrop-blur-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Hero Background</span>
          <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Swap
            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          </label>
        </div>
        <div className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative min-h-[200px]">
          <img src={formData.hero_image || 'https://placehold.co/600x400/18181b/a1a1aa?text=No+Hero+Set'} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        </div>
      </div>
    </div>
  );
}