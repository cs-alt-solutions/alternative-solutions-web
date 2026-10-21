/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
'use client';

import React, { useState } from 'react';
import { GripVertical, ChevronDown, X, Plus, Image as ImageIcon, List, Loader2, UploadCloud } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import MenuCardEditor from './MenuCardEditor';

export default function CategoryAccordion({ cap, index, isOpen, setOpenCapIndex, localCaps, setLocalCaps, formData, setFormData, onReload }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const isMenuMode = formData?.content_layout === 'menu';
  const isAlaCarte = !!cap.isAlaCarte;

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

  const updateField = (field: string, value: any) => {
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
    updated[index].bullets.push('');
    setLocalCaps(updated);
  };

  const updateBullet = (bulletIndex: number, value: string) => {
    const updated = [...localCaps];
    updated[index].bullets[bulletIndex] = value;
    setLocalCaps(updated);
  };

  const removeBullet = (bulletIndex: number) => {
    const updated = [...localCaps];
    updated[index].bullets.splice(bulletIndex, 1);
    setLocalCaps(updated);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${formData.id}/cover-${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      updateField('coverImage', data.publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload cover photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const currentAvailability = isMenuMode ? (cap.price || 'All Day') : (cap.price || '');

  return (
    <div className={`flex flex-col rounded-xl relative shadow-md overflow-hidden transition-all border ${isAlaCarte ? 'bg-zinc-950 border-fuchsia-900/40' : 'bg-zinc-950 border-zinc-800'}`}>
      
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isOpen ? (isAlaCarte ? 'bg-fuchsia-500/5' : 'bg-zinc-900/80') : 'hover:bg-zinc-900/50'}`}
        onClick={() => setOpenCapIndex(isOpen ? null : index)}
      >
        <div className="flex items-center gap-3">
          <button type="button" onClick={(e) => { e.stopPropagation(); moveUp(); }} disabled={index === 0} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 cursor-pointer">
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className={`font-bold text-sm ${isAlaCarte ? 'text-fuchsia-400' : 'text-white'}`}>
            {cap.title || (isAlaCarte ? 'Untitled Add-on' : isMenuMode ? 'Untitled Category' : 'Untitled Package')}
          </h3>
          {isAlaCarte && <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">Add-on</span>}
        </div>
        <div className="flex items-center gap-4">
          {isMenuMode && (
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{categoryImages.length} Cards</span>
          )}
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          <button type="button" onClick={(e) => { e.stopPropagation(); removeCap(); }} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-zinc-800 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          
          <div className="flex-1 space-y-3">
            <div className="flex gap-2 w-full">
              <input 
                type="text" 
                value={cap.title || ''} 
                onChange={(e) => updateTitle(e.target.value)} 
                placeholder={isAlaCarte ? 'Add-on Name' : isMenuMode ? 'Category Name (e.g., Starters)' : 'Package Name'}
                className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-cyan-500 transition-colors"
              />
              
              {isMenuMode ? (
                <div className="relative w-1/3">
                  <select
                    value={currentAvailability}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-3 pr-8 py-2 text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="All Day">All Day</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Brunch">Brunch</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Late Night">Late Night</option>
                    <option value="Happy Hour">Happy Hour</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500/50 pointer-events-none" />
                </div>
              ) : (
                <input 
                  type="text" 
                  value={cap.price || ''} 
                  onChange={(e) => updateField('price', e.target.value)} 
                  placeholder="Price"
                  className="w-1/3 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-fuchsia-400 font-bold outline-none focus:border-fuchsia-500 transition-colors"
                />
              )}
            </div>
            <textarea 
              value={cap.description || ''} 
              onChange={(e) => updateField('description', e.target.value)} 
              placeholder="Short description..."
              rows={2}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* IF MENU MODE: Render Menu Card Editor mapping for gallery items under this category */}
          {isMenuMode ? (
            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold text-fuchsia-500 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={12} /> Menu Cards ({categoryImages.length})
                </label>
                <button type="button" onClick={addBlankCard} className="text-[9px] font-bold text-zinc-400 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Plus size={10} /> Add Blank Card
                </button>
              </div>

              {categoryImages.length === 0 ? (
                <p className="text-[10px] text-zinc-600 italic">No menu cards added yet. Click above to create one.</p>
              ) : (
                <div className="space-y-3">
                  {categoryImages.map((img: any, i: number) => (
                    <MenuCardEditor 
                      key={img.id || `gal-${i}`}
                      img={img}
                      index={i}
                      categoryImagesCount={categoryImages.length}
                      localCaps={localCaps}
                      isMenuMode={isMenuMode}
                      formData={formData}
                      setFormData={setFormData}
                      onReload={onReload}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* STANDARD PACKAGE MODE: Deliverables & Cover Photo */
            !isAlaCarte && (
              <>
                <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <List size={12} className="text-cyan-500" /> Package Deliverables
                  </label>
                  <div className="space-y-2">
                    {(cap.bullets || []).map((bullet: string, bIndex: number) => (
                      <div key={bIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                        <input 
                          value={bullet}
                          onChange={(e) => updateBullet(bIndex, e.target.value)}
                          placeholder="Deliverable..."
                          className="flex-1 bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button type="button" onClick={() => removeBullet(bIndex)} className="text-zinc-600 hover:text-rose-400 cursor-pointer"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addBullet} className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mt-2 cursor-pointer">
                    <Plus size={10} /> Add Deliverable
                  </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={12} /> Package Cover Photo
                  </label>
                  
                  {cap.coverImage ? (
                    <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden border border-zinc-800 group">
                      <img src={cap.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <button 
                        type="button"
                        onClick={() => updateField('coverImage', '')}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full sm:w-48 aspect-video rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                      {isUploading ? <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" /> : <UploadCloud className="w-5 h-5 text-zinc-600 mb-2" />}
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Upload Cover</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </>
            )
          )}

        </div>
      )}
    </div>
  );
}