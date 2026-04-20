import React, { useRef, useState } from 'react';
import { Search, UploadCloud, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function CategoryArtManager({ homeConfig, setHomeConfig, mainCategories, clientConfig, onOpenPicker }: any) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingCat, setUploadingCat] = useState<string | null>(null);
    const catFileInputRef = useRef<HTMLInputElement>(null);

    const handleCatFileUpload = async (file: File, cat: string) => {
      if (!file || !clientConfig?.id) return;
      setIsUploading(true);
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const fileExt = file.name.split('.').pop();
        const safeName = cat.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${clientConfig.id}/storefront/marketing/cat-${safeName}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('client-assets').upload(filename, file, { upsert: true });
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('client-assets').getPublicUrl(filename);
        
        const newCatImages = { ...(homeConfig.categoryImages || {}), [cat]: publicUrl };
        setHomeConfig({ ...homeConfig, categoryImages: newCatImages });
      } catch (err) {
        console.error("Category Upload Error:", err);
      } finally {
        setIsUploading(false);
      }
    };

    return (
        <div className="mt-12 pt-8 border-t border-zinc-800/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 pointer-events-none">Global Category Art</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Set default fallback images. If a Bento block lacks a custom image, it uses these.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mainCategories.map((cat: string) => {
                    const currentImg = homeConfig.categoryImages?.[cat];
                    return (
                        <div key={cat} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center justify-center gap-4 relative overflow-hidden group min-h-35">
                            {currentImg ? (
                                <div className="absolute inset-0 z-0">
                                    <img src={currentImg} alt={cat} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity mix-blend-luminosity" />
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 z-0 bg-zinc-900" />
                            )}
                            {isUploading && uploadingCat === cat ? (
                                <div className="relative z-10 animate-pulse text-emerald-400"><UploadCloud size={24} /></div>
                            ) : (
                                <>
                                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-center text-white drop-shadow-md">{cat}</span>
                                    <div className="relative z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
                                        <button onClick={() => onOpenPicker(cat)} className="p-2 bg-zinc-950/80 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 rounded-xl transition-colors backdrop-blur-sm shadow-xl" title="Find in Inventory"><Search size={14}/></button>
                                        <button onClick={() => { setUploadingCat(cat); catFileInputRef.current?.click(); }} className="p-2 bg-zinc-950/80 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 rounded-xl transition-colors backdrop-blur-sm shadow-xl" title="Upload New"><UploadCloud size={14}/></button>
                                        {currentImg && (
                                            <button onClick={() => {
                                                const newCatImages = { ...homeConfig.categoryImages };
                                                delete newCatImages[cat];
                                                setHomeConfig({ ...homeConfig, categoryImages: newCatImages });
                                            }} className="p-2 bg-zinc-950/80 hover:bg-rose-500 hover:text-zinc-950 text-rose-400 rounded-xl transition-colors backdrop-blur-sm shadow-xl" title="Clear Image"><Trash2 size={14}/></button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            <input type="file" ref={catFileInputRef} onChange={(e) => {
                if (e.target.files && e.target.files[0] && uploadingCat) {
                    handleCatFileUpload(e.target.files[0], uploadingCat);
                    setUploadingCat(null);
                }
            }} className="hidden" accept="image/*" />
        </div>
    );
}