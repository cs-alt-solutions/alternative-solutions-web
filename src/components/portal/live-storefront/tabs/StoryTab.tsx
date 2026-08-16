/* src/components/portal/live-storefront/tabs/StoryTab.tsx */
import React, { useState } from 'react';
import { 
  ImagePlus, Loader2, Instagram, Facebook, Twitter, 
  Linkedin, Youtube, Link as LinkIcon, Mail, Trash2 
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function StoryTab({ storeId, formData, updateForm }: { storeId: string, formData: any, updateForm: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const NETWORKS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'other', label: 'Other Link', icon: LinkIcon }
  ];

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${storeId}/live-about_image-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      updateForm({ about_image: data.publicUrl });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSocialChange = (network: string, value: string) => {
    updateForm({
      social_handles: { ...formData.social_handles, [network]: value }
    });
  };

  const removeSocial = (network: string) => {
    const updated = { ...formData.social_handles };
    delete updated[network];
    updateForm({ social_handles: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 FIXED: Changed to a 5-column grid to give the text area more breathing room */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* TEXT CONTENT (Takes up 3 columns, no more double-boxes!) */}
        <div className="bg-zinc-950 border border-fuchsia-500/20 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:col-span-3">
          <div className="px-6 py-4 border-b border-white/5 bg-black/40">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">About Bio</span>
          </div>
          <textarea 
            value={formData.about_bio}
            onChange={(e) => updateForm({ about_bio: e.target.value })}
            placeholder="Write your story here..."
            className="w-full flex-1 bg-transparent p-6 text-sm text-zinc-300 focus:outline-none resize-none min-h-50"
          />
        </div>

        {/* MEDIA CONTENT (Takes up 2 columns) */}
        <div className="bg-zinc-950 border border-fuchsia-500/20 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:col-span-2">
          <div className="px-5 py-3 border-b border-white/5 bg-black/40 flex items-center justify-between">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Bio Portrait</span>
            <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg hover:bg-fuchsia-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Swap
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
          </div>
          <div className="flex-1 bg-black relative min-h-50">
            <img src={formData.about_image || 'https://placehold.co/600x400/18181b/a1a1aa?text=No+Bio+Set'} alt="About" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-emerald-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-6">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Mail size={12}/> Public Contact Email
          </label>
          <input 
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateForm({ contact_email: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <hr className="border-white/5" />

        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">
            Active Social Networks
          </label>
          
          {/* 🚀 FIXED: Changed massive squares into sleek 3-column pill buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {NETWORKS.map(net => {
              const isActive = formData.social_handles[net.id] !== undefined;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => !isActive ? handleSocialChange(net.id, '') : removeSocial(net.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                  }`}
                >
                  <net.icon size={16} className="shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider truncate">{net.label}</span>
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            {NETWORKS.filter(n => formData.social_handles[n.id] !== undefined).map(net => (
              <div key={net.id} className="relative flex items-center w-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 text-emerald-500/50">
                  <net.icon size={16} />
                </div>
                <input 
                  type="text"
                  value={formData.social_handles[net.id] || ''}
                  onChange={(e) => handleSocialChange(net.id, e.target.value)}
                  placeholder={net.id === 'other' ? "https://..." : "username"}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 rounded-xl text-left pl-12 pr-10 py-3 text-sm text-white outline-none transition-all"
                />
                <button onClick={() => removeSocial(net.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-rose-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}