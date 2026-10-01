/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
'use client';

import React, { useState } from 'react';
import { GripVertical, ChevronDown, X, Plus, Image as ImageIcon, List, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import MenuCardEditor from './MenuCardEditor';

export default function CategoryAccordion({ cap, index, isOpen, setOpenCapIndex, localCaps, setLocalCaps, formData, setFormData, onReload }: any) {
  
  const [isUploading, setIsUploading] = useState(false);
  const isMenuMode = formData?.content_layout === 'menu';

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '', price: '', isVisible: true };
    return { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false };
  });

  const categoryImages = liveGallery.filter((img: any) => img.category === cap.title);

  const updateTitle = (newTitle: string) => {
    const oldTitle = localCaps[index].title;
    const updatedCaps = [...localCaps]; 
    updatedCaps[index].title = newTitle; 
    setLocalCaps(updatedCaps);

    setFormData((prev: any) => {
      const prevCaps = prev.capabilities || [];
      const updatedFormDataCaps = [...prevCaps];
      if (updatedFormDataCaps[index]) {
        updatedFormDataCaps[index] = { ...updatedFormDataCaps[index], title: newTitle };
      }
      const updatedGallery = (prev.gallery_items || []).map((item: any) => {
        if (oldTitle !== undefined && item.category === oldTitle) return { ...item, category: newTitle };
        return item;
      });
      return { ...prev, capabilities: updatedFormDataCaps, gallery_items: updatedGallery };
    });
  };

  const updateField = (field: string, value: string) => {
    const updated = [...localCaps]; 
    updated[index][field] = value; 
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCap = () => {
    const updated = localCaps.filter((_: any, i: number) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const moveUp = () => {
    if (index === 0) return; 
    const updated = [...localCaps];
    const temp = updated[index - 1]; 
    updated[index - 1] = updated[index]; 
    updated[index] = temp;
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const addBlankCard = () => {
    const newId = `card-${Date.now()}`;
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: [{ id: newId, imageUrl: '', title: '', description: '', price: '', category: cap.title, isVisible: true }, ...(prev.gallery_items || [])]
    }));
  };

  const addBullet = () => {
    const updated = [...localCaps];
    if (!updated[index].bullets) updated[index].bullets = [];
    updated[index].bullets.push(''); setLocalCaps(updated);
  };
  const updateBullet = (bulletIndex: number, value: string) => {
    const updated = [...localCaps]; updated[index].bullets[bulletIndex] = value; setLocalCaps(updated);
  };
  const removeBullet = (bulletIndex: number) => {
    const updated = [...localCaps]; updated[index].bullets.splice(bulletIndex, 1); setLocalCaps(updated);
  };

  // 🚀 FAST UPLOAD FOR CONTRACTOR GRID
  const handleGridUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    
    try {
      const newItems: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${formData.id}/gallery-${Date.now()}-${i}.${fileExt}`;
        const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
        if (error) throw error;
        
        const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
        newItems.push({
          id: `img-${Date.now()}-${i}`,
          imageUrl: data.publicUrl,
          category: cap.title,
          title: '',
          description: '',
          isVisible: true
        });
      }
      setFormData((prev: any) => ({
        ...prev,
        gallery_items: [...(prev.gallery_items || []), ...newItems]
      }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-xl relative shadow-sm overflow-hidden transition-all">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setOpenCapIndex(isOpen ? null : index)}
      >
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); moveUp(); }} disabled={index === 0} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 cursor-pointer">
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-white text-sm">{cap.title || (isMenuMode ? 'Untitled Category' : 'Untitled Service')}</h3>
        </div>
        <div className="flex items-center gap-4">
          {(isMenuMode || categoryImages.length > 0) && (
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{categoryImages.length} {isMenuMode ? 'Cards' : 'Proof Assets'}</span>
          )}
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          <button onClick={(e) => { e.stopPropagation(); removeCap(); }} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-zinc-800/50 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 space-y-3">
            <input 
              type="text" 
              value={cap.title} 
              onChange={(e) => updateTitle(e.target.value)} 
              placeholder={isMenuMode ? 'Category Name (e.g., Smash Burgers)' : 'Service Name (e.g., Roof Replacement)'}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-cyan-500 transition-colors"
            />
            <textarea 
              value={cap.description} 
              onChange={(e) => updateField('description', e.target.value)} 
              placeholder={`Short description of this ${isMenuMode ? 'category' : 'service'}...`}
              rows={2}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div className={`space-y-3 pt-4 border-t border-zinc-800/30 ${isMenuMode ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <List size={12} className={isMenuMode ? 'text-zinc-500' : 'text-cyan-500'} /> 
              {isMenuMode ? 'Legacy Simple Text (No Image)' : 'Scope of Work (Detail Bullets)'}
            </label>
            <div className="space-y-2">
              {(cap.bullets || []).map((bullet: string, bIndex: number) => (
                <div key={bIndex} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                  <input 
                    value={bullet}
                    onChange={(e) => updateBullet(bIndex, e.target.value)}
                    placeholder={isMenuMode ? 'Item Name - $Price' : 'Deliverable or feature...'}
                    className="flex-1 bg-transparent border-b border-zinc-800 focus:border-fuchsia-500/50 py-1 text-xs text-zinc-300 focus:outline-none transition-colors"
                  />
                  <button onClick={() => removeBullet(bIndex)} className="text-zinc-600 hover:text-rose-400"><X size={12} /></button>
                </div>
              ))}
            </div>
            <button onClick={addBullet} className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <Plus size={10} /> Add {isMenuMode ? 'Simple Item' : 'Scope Detail'}
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800/30">
            <div className="flex items-center justify-between">
              <label className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${isMenuMode ? 'text-fuchsia-500' : 'text-cyan-500'}`}>
                <ImageIcon size={12} /> {isMenuMode ? 'Menu Cards' : 'Proof of Work Gallery'} ({categoryImages.length})
              </label>
              {isMenuMode && (
                <button onClick={addBlankCard} className="text-[9px] font-bold text-zinc-400 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                  <Plus size={10} /> Add Blank Card
                </button>
              )}
            </div>
            
            {isMenuMode ? (
              // MENU MODE: Complex Text/Price Cards
              categoryImages.length === 0 ? (
                 <p className="text-[10px] text-zinc-600 italic">Drag items from the Drop Vault or create a blank card.</p>
              ) : (
                <div className="space-y-3">
                  {categoryImages.map((img: any, i: number) => (
                    <MenuCardEditor 
                      key={img.id || `gal-${i}`}
                      img={img}
                      index={i}
                      categoryImagesCount={categoryImages.length}
                      localCaps={localCaps}
                      isMenuMode={true}
                      formData={formData}
                      setFormData={setFormData}
                      onReload={onReload} 
                    />
                  ))}
                </div>
              )
            ) : (
              // 🚀 CONTRACTOR MODE: Clean Photo Grid
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {categoryImages.map((img: any, i: number) => {
                  const currentId = img.id || `gal-${i}`;
                  return (
                    <div key={currentId} className="aspect-square rounded-xl bg-zinc-950 border border-zinc-800 relative overflow-hidden group shadow-md">
                      <img src={img.imageUrl} alt="Proof" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {
                            setFormData((prev: any) => ({
                              ...prev,
                              gallery_items: prev.gallery_items.filter((item: any) => (item.id || item.imageUrl) !== (img.id || img.imageUrl))
                            }));
                          }} 
                          className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {/* Upload Button */}
                <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 bg-black/20 hover:bg-cyan-500/10 flex flex-col items-center justify-center cursor-pointer transition-all group">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 mb-1 transition-colors" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400 transition-colors">Add Photo</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleGridUpload} disabled={isUploading} />
                </label>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}