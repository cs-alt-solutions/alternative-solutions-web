/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
'use client';

import React from 'react';
import { GripVertical, ChevronDown, X, Plus, Image as ImageIcon, List } from 'lucide-react';
import MenuCardEditor from './MenuCardEditor';

export default function CategoryAccordion({ cap, index, isOpen, setOpenCapIndex, localCaps, setLocalCaps, formData, setFormData, onReload }: any) {
  
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

  // --- TEXT BULLET HANDLERS ---
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
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{categoryImages.length} {isMenuMode ? 'Cards' : 'Media'}</span>
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
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-fuchsia-500 transition-colors"
            />
            <textarea 
              value={cap.description} 
              onChange={(e) => updateField('description', e.target.value)} 
              placeholder={`Short description of this ${isMenuMode ? 'category' : 'service'}...`}
              rows={2}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-fuchsia-500 transition-colors resize-none"
            />
          </div>

          <div className={`space-y-3 pt-4 border-t border-zinc-800/30 ${isMenuMode ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <List size={12} className={isMenuMode ? 'text-zinc-500' : 'text-cyan-500'} /> 
              {isMenuMode ? 'Legacy Simple Text (No Image)' : 'Service Features & Details'}
            </label>
            <div className="space-y-2">
              {(cap.bullets || []).map((bullet: string, bIndex: number) => (
                <div key={bIndex} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                  <input 
                    value={bullet}
                    onChange={(e) => updateBullet(bIndex, e.target.value)}
                    placeholder={isMenuMode ? 'Item Name - $Price' : 'Detail or feature...'}
                    className="flex-1 bg-transparent border-b border-zinc-800 focus:border-fuchsia-500/50 py-1 text-xs text-zinc-300 focus:outline-none transition-colors"
                  />
                  <button onClick={() => removeBullet(bIndex)} className="text-zinc-600 hover:text-rose-400"><X size={12} /></button>
                </div>
              ))}
            </div>
            <button onClick={addBullet} className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <Plus size={10} /> Add {isMenuMode ? 'Simple Item' : 'Bullet Point'}
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800/30">
            <div className="flex items-center justify-between">
              <label className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${isMenuMode ? 'text-fuchsia-500' : 'text-cyan-500'}`}>
                <ImageIcon size={12} /> {isMenuMode ? 'Menu Cards' : 'Service Media'} ({categoryImages.length})
              </label>
              <button onClick={addBlankCard} className={`text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors ${isMenuMode ? 'hover:text-fuchsia-400' : 'hover:text-cyan-400'}`}>
                <Plus size={10} /> Add Blank {isMenuMode ? 'Card' : 'Slot'}
              </button>
            </div>
            
            {categoryImages.length === 0 ? (
               <p className="text-[10px] text-zinc-600 italic">Drag items from the Drop Vault or create a blank {isMenuMode ? 'card' : 'media slot'}.</p>
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
        </div>
      )}
    </div>
  );
}