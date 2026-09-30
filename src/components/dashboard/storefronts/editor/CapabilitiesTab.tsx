/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { Plus, X, GripVertical, Layers, List, UploadCloud, Trash2, DollarSign, Image as ImageIcon, ChevronDown, ChevronUp, Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontGallery, removeImageFromGallery } from '@/app/actions/storefronts';

export default function CapabilitiesTab({ 
  formData, setFormData, onReload
}: { formData: any; setFormData: any; onReload?: () => void; }) {
  const router = useRouter();
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);

  const isMenuMode = formData?.content_layout === 'menu';

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) => 
        typeof c === 'string' ? { title: c, description: '', bullets: [] } : { ...c, bullets: c.bullets || [] }
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '', price: '' };
    return { ...item, id: item.id || `gal-${i}` };
  });

  const unassignedImages = liveGallery.filter((img: any) => !img.category || !localCaps.some(c => c.title === img.category));

  // --- CATEGORY HANDLERS ---
  const addCapability = () => {
    const updated = [...localCaps, { title: '', description: '', bullets: [] }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(updated.length - 1);
  };
  
  const updateCapTitle = (index: number, newTitle: string) => {
    const oldTitle = localCaps[index].title;
    const updatedCaps = [...localCaps]; 
    updatedCaps[index].title = newTitle; 
    setLocalCaps(updatedCaps);

    setFormData((prev: any) => {
      const updatedGallery = (prev.gallery_items || []).map((item: any) => {
        if (item.category === oldTitle) {
          return { ...item, category: newTitle };
        }
        return item;
      });

      return {
        ...prev,
        capabilities: updatedCaps,
        gallery_items: updatedGallery
      };
    });
  };

  const updateCapField = (index: number, field: string, value: string) => {
    const updated = [...localCaps]; 
    updated[index][field] = value; 
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };
  
  const removeCap = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };
  
  const moveUp = (index: number) => {
    if (index === 0) return; 
    const updated = [...localCaps];
    const temp = updated[index - 1]; 
    updated[index - 1] = updated[index]; 
    updated[index] = temp;
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  // --- TEXT BULLET HANDLERS ---
  const addBullet = (serviceIndex: number) => {
    const updated = [...localCaps];
    if (!updated[serviceIndex].bullets) updated[serviceIndex].bullets = [];
    updated[serviceIndex].bullets.push(''); 
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };
  
  const updateBullet = (serviceIndex: number, bulletIndex: number, value: string) => {
    const updated = [...localCaps]; 
    updated[serviceIndex].bullets[bulletIndex] = value; 
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };
  
  const removeBullet = (serviceIndex: number, bulletIndex: number) => {
    const updated = [...localCaps]; 
    updated[serviceIndex].bullets.splice(bulletIndex, 1); 
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  // --- GALLERY HANDLERS ---
  const handleGalleryMetaChange = (id: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: (prev.gallery_items || []).map((img: any, i: number) => {
        const currentId = img.id || `gal-${i}`;
        if (currentId === id) return { ...img, [field]: value };
        return img;
      })
    }));
  };

  const moveGalleryItem = (id: string, direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const items = [...(prev.gallery_items || [])];
      const currentIndex = items.findIndex((img: any, idx: number) => (img.id || `gal-${idx}`) === id);
      if (currentIndex === -1) return prev;
      const category = items[currentIndex].category;
      const categoryIndices = items.map((img: any, idx: number) => img.category === category ? idx : -1).filter(idx => idx !== -1);
      const relativeIndex = categoryIndices.indexOf(currentIndex);

      if (direction === 'up' && relativeIndex > 0) {
        const swapIndex = categoryIndices[relativeIndex - 1];
        [items[currentIndex], items[swapIndex]] = [items[swapIndex], items[currentIndex]];
      } else if (direction === 'down' && relativeIndex < categoryIndices.length - 1) {
        const swapIndex = categoryIndices[relativeIndex + 1];
        [items[currentIndex], items[swapIndex]] = [items[swapIndex], items[currentIndex]];
      }
      return { ...prev, gallery_items: items };
    });
  };

  const handleAddBlankCard = (categoryTitle: string) => {
    const newId = `card-${Date.now()}`;
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: [{ id: newId, imageUrl: '', title: '', description: '', price: '', category: categoryTitle }, ...(prev.gallery_items || [])]
    }));
  };

  const handleAssignMedia = (unassignedImg: any, actionValue: string) => {
    if (!actionValue) return;
    const [actionType, payload] = actionValue.split('|');

    setFormData((prev: any) => {
      let items = [...(prev.gallery_items || [])];
      
      if (actionType === 'CREATE_NEW') {
        const targetImg = items.find((img: any) => img.id === unassignedImg.id);
        if (targetImg) {
          items = items.filter((img: any) => img.id !== unassignedImg.id);
          items.unshift({ ...targetImg, category: payload });
        }
      } else if (actionType === 'MERGE') {
        items = items.map((img: any) => img.id === payload ? { ...img, imageUrl: unassignedImg.imageUrl } : img);
        items = items.filter((img: any) => img.id !== unassignedImg.id);
      }
      return { ...prev, gallery_items: items };
    });
  };

  const handleDetachMedia = (cardId: string, currentImageUrl: string) => {
    if (!currentImageUrl) return;
    setFormData((prev: any) => {
      let items = [...(prev.gallery_items || [])];
      items = items.map((img: any) => (img.id === cardId) ? { ...img, imageUrl: '' } : img);
      items.unshift({ id: `unassigned-${Date.now()}`, imageUrl: currentImageUrl, title: '', description: '', price: '', category: '' });
      return { ...prev, gallery_items: items };
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const handleUploadGallery = async () => {
    setIsUploadingGallery(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      const response = await updateStorefrontGallery(formData.id, formData.slug, uploadData);
      setFiles([]);
      if (response?.gallery_items) setFormData((prev: any) => ({ ...prev, gallery_items: response.gallery_items }));
      if (onReload) onReload(); 
    } catch (e) { alert("Gallery sync failed."); } finally { setIsUploadingGallery(false); }
  };

  const handleDeleteLiveItem = async (id: string, imageUrl?: string) => {
    if (!window.confirm("Remove this item entirely?")) return;
    setIsDeleting(id);
    try {
      if (imageUrl && imageUrl.startsWith('http')) await removeImageFromGallery(formData.id, imageUrl);
      setFormData((prev: any) => ({
        ...prev, gallery_items: prev.gallery_items.filter((img: any, i: number) => (img.id || `gal-${i}`) !== id)
      }));
      startTransition(() => { router.refresh(); if (onReload) onReload(); });
    } catch (e) { alert("Failed to remove item."); } finally { setIsDeleting(null); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-fuchsia-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            {isMenuMode ? 'Menu Architecture' : 'Service Matrix'}
          </h2>
        </div>
        <button onClick={addCapability} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
          <Plus className="w-3 h-3" /> {isMenuMode ? 'Add Category' : 'Add Service'}
        </button>
      </div>

      <div className="space-y-4">
        {localCaps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No categories defined.</p>
          </div>
        ) : (
          localCaps.map((cap, index) => {
            const categoryImages = liveGallery.filter((img: any) => img.category === cap.title);
            const isOpen = openCapIndex === index;
            
            return (
              <div key={index} className="flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-xl relative shadow-sm overflow-hidden transition-all">
                
                {/* ACCORDION HEADER */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                  onClick={() => setOpenCapIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); moveUp(index); }} disabled={index === 0} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 cursor-pointer">
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-white text-sm">{cap.title || 'Untitled Category'}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{categoryImages.length} Items</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    <button onClick={(e) => { e.stopPropagation(); removeCap(index); }} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ACCORDION BODY */}
                {isOpen && (
                  <div className="p-4 border-t border-zinc-800/50 flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex-1 space-y-3">
                      <input 
                        type="text" 
                        value={cap.title} 
                        onChange={(e) => updateCapTitle(index, e.target.value)} 
                        placeholder={isMenuMode ? 'Category Name (e.g., Smash Burgers)' : 'Service Name'}
                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-fuchsia-500 transition-colors"
                      />
                      <textarea 
                        value={cap.description} 
                        onChange={(e) => updateCapField(index, 'description', e.target.value)} 
                        placeholder="Short description of this category..."
                        rows={2}
                        className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-fuchsia-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-800/30">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-fuchsia-500 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={12} /> Menu Cards ({categoryImages.length})
                        </label>
                        <button onClick={() => handleAddBlankCard(cap.title)} className="text-[9px] font-bold text-zinc-400 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                          <Plus size={10} /> Add Blank Card
                        </button>
                      </div>
                      
                      {categoryImages.length === 0 ? (
                         <p className="text-[10px] text-zinc-600 italic">Drag items from the Media Pool below or create a blank card.</p>
                      ) : (
                        <div className="space-y-3">
                          {categoryImages.map((img: any, i: number) => {
                            const currentId = img.id || `gal-${i}`;
                            const hasImage = !!img.imageUrl;

                            return (
                              <div key={currentId} className="flex gap-4 bg-black/40 border border-zinc-800/80 p-3 rounded-xl items-start">
                                
                                <div className="flex flex-col gap-1 items-center justify-center shrink-0 w-4 pt-2">
                                  <button onClick={() => moveGalleryItem(currentId, 'up')} disabled={i === 0} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 transition-colors">
                                    <ChevronUp size={16} />
                                  </button>
                                  <button onClick={() => moveGalleryItem(currentId, 'down')} disabled={i === categoryImages.length - 1} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 transition-colors">
                                    <ChevronDown size={16} />
                                  </button>
                                </div>

                                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950 flex items-center justify-center group">
                                  {hasImage ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={img.imageUrl} alt="preview" className={`w-full h-full object-cover ${isDeleting === currentId ? 'opacity-30' : ''}`} />
                                  ) : (
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center px-1 leading-tight">Text<br/>Card</span>
                                  )}
                                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button onClick={() => handleDeleteLiveItem(currentId, img.imageUrl)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                  </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex gap-2">
                                    <input placeholder="Name" value={img.title || ''} onChange={(e) => handleGalleryMetaChange(currentId, 'title', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none" />
                                    {isMenuMode && (
                                      <div className="relative w-24 shrink-0">
                                        <DollarSign className="w-3 h-3 text-fuchsia-500 absolute left-2.5 top-2 pointer-events-none" />
                                        <input placeholder="Price" value={img.price || ''} onChange={(e) => handleGalleryMetaChange(currentId, 'price', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-7 pr-2 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none" />
                                      </div>
                                    )}
                                  </div>
                                  <textarea placeholder="Description..." value={img.description || ''} onChange={(e) => handleGalleryMetaChange(currentId, 'description', e.target.value)} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-[11px] text-zinc-400 focus:border-fuchsia-500 outline-none resize-none" />
                                  <div className="flex justify-between items-center pt-1">
                                    {hasImage ? (
                                      <button onClick={() => handleDetachMedia(currentId, img.imageUrl)} className="text-[9px] text-zinc-500 hover:text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1 transition-colors">
                                        <Unlink size={10} /> Detach Image
                                      </button>
                                    ) : (
                                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">No Image Attached</span>
                                    )}
                                    <button onClick={() => handleDeleteLiveItem(currentId, img.imageUrl)} className="text-[9px] text-rose-500 hover:text-rose-400 uppercase tracking-widest font-bold flex items-center gap-1 transition-colors">
                                      <Trash2 size={10} /> Delete Item
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800/30 hidden">
                       {/* Legacy bullets hidden */}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- BOTTOM MEDIA POOL --- */}
      <div className="pt-10 mt-10 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Unassigned Media Pool</h3>
        </div>
        
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="border border-dashed border-zinc-700 p-8 rounded-xl text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors bg-zinc-900/40 cursor-pointer">
          <UploadCloud className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
          <p className="text-zinc-300 font-bold text-xs uppercase tracking-widest">Drag & Drop Photos Here</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl mt-4">
            <h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Staging Queue ({files.length})</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800">
                  <span className="text-[8px] text-zinc-500 font-mono truncate px-1">{file.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/80 rounded p-1 hover:bg-red-500 transition-colors"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
            </div>
            <button onClick={handleUploadGallery} disabled={isUploadingGallery} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors py-2.5 font-black tracking-widest text-[10px] text-zinc-950 uppercase rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.2)] disabled:opacity-50">
              {isUploadingGallery ? 'UPLOADING...' : 'UPLOAD TO POOL'}
            </button>
          </div>
        )}

        {unassignedImages.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-6">
            {unassignedImages.map((img: any, i: number) => {
              const currentId = img.id || `gal-${i}`;
              return (
                <div key={currentId} className="flex gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl shadow-sm items-center">
                  
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-black group flex items-center justify-center">
                    {img.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={img.imageUrl} alt="unassigned" className={`w-full h-full object-cover ${isDeleting === currentId ? 'opacity-30' : ''}`} />
                    ) : (
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center px-1 leading-tight">Text<br/>Card</span>
                    )}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button onClick={() => handleDeleteLiveItem(currentId, img.imageUrl)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                    
                    <select
                      value=""
                      onChange={(e) => handleAssignMedia(img, e.target.value)}
                      className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-2 py-2 text-[10px] uppercase tracking-widest font-bold text-emerald-400 hover:bg-emerald-500/5 focus:outline-none transition-colors cursor-pointer truncate"
                    >
                      <option value="">-- Assign Media --</option>
                      {localCaps.map((c, idx) => {
                        const categoryCards = liveGallery.filter((lg: any) => lg.category === c.title);
                        return (
                          <optgroup key={idx} label={c.title || 'Untitled Category'}>
                            <option value={`CREATE_NEW|${c.title}`}>+ Create New Card</option>
                            {categoryCards.map((card: any) => (
                              <option key={card.id} value={`MERGE|${card.id}`}>
                                Replace: {card.title || 'Untitled Item'}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>

                    <div className="flex justify-end">
                      <button onClick={() => handleDeleteLiveItem(currentId, img.imageUrl)} className="text-[9px] text-rose-500 hover:text-rose-400 uppercase tracking-widest font-bold flex items-center gap-1 transition-colors">
                        <Trash2 size={10} /> Delete Image
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}