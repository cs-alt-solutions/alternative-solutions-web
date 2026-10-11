/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
'use client';

import React, { useState } from 'react';
import { GripVertical, ChevronDown, X, Plus, Image as ImageIcon, List, Loader2, UploadCloud } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function CategoryAccordion({ cap, index, isOpen, setOpenCapIndex, localCaps, setLocalCaps, formData, setFormData, onReload }: any) {
  const [isUploading, setIsUploading] = useState(false);

  const isAlaCarte = !!cap.isAlaCarte;
  const isCreativeMode = formData?.industry_tag === 'Creative';

  const updateTitle = (newTitle: string) => {
    const updatedCaps = [...localCaps];
    updatedCaps[index].title = newTitle;
    setLocalCaps(updatedCaps);
    setFormData((prev: any) => ({ ...prev, capabilities: updatedCaps }));
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
            {cap.title || (isAlaCarte ? 'Untitled Add-on' : 'Untitled Package')}
          </h3>
          {isAlaCarte && <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">Add-on</span>}
        </div>
        <div className="flex items-center gap-4">
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
                placeholder={isAlaCarte ? 'Add-on Name' : 'Package Name'}
                className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-cyan-500 transition-colors"
              />
              <input 
                type="text" 
                value={cap.price || ''} 
                onChange={(e) => updateField('price', e.target.value)} 
                placeholder="Price"
                className="w-1/3 bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-fuchsia-400 font-bold outline-none focus:border-fuchsia-500 transition-colors"
              />
            </div>
            <textarea 
              value={cap.description || ''} 
              onChange={(e) => updateField('description', e.target.value)} 
              placeholder="Short description..."
              rows={2}
              className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {!isAlaCarte && (
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
                  <ImageIcon size={12} className="text-cyan-500" /> Package Cover Photo
                </label>
                
                {cap.coverImage ? (
                  <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden border border-zinc-800 group">
                    <img src={cap.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={() => updateField('coverImage', '')}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white transition-colors"
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
          )}

        </div>
      )}
    </div>
  );
}