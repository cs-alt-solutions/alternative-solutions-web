/* src/components/dashboard/ecosystem/EcosystemModuleEditor.tsx */
'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import { X, Save, LayoutTemplate, Type, Link as LinkIcon, Image as ImageIcon, Plus, Trash2, Lock, Terminal as TerminalIcon, User, Database, UploadCloud, Loader2 } from 'lucide-react';
import AppShowcaseCard from '@/components/products/AppShowcaseCard';

interface ProductData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  link_href: string;
  mockup_id: string;
  media_assets: {
    carousel: string[];
    [key: string]: any;
  };
}

interface EcosystemModuleEditorProps {
  product: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EcosystemModuleEditor({ product, onClose, onRefresh }: EcosystemModuleEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialMedia = product.media_assets || {};
  const [formData, setFormData] = useState<ProductData>({
    id: product.id,
    name: product.name || '',
    tagline: product.tagline || '',
    description: product.description || '',
    link_href: product.link_href || '',
    mockup_id: product.mockup_id || 'default',
    media_assets: {
      carousel: Array.isArray(initialMedia.carousel) ? initialMedia.carousel : [],
      ...initialMedia
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      media_assets: { ...prev.media_assets, carousel: [...prev.media_assets.carousel, newImageUrl.trim()] }
    }));
    setNewImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `ecosystem/${formData.id}/${fileName}`; 

      const { error: uploadError } = await supabase.storage
        .from('workshop_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('workshop_media')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        media_assets: { ...prev.media_assets, carousel: [...prev.media_assets.carousel, publicUrl] }
      }));
      
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      media_assets: { ...prev.media_assets, carousel: prev.media_assets.carousel.filter((_, idx) => idx !== indexToRemove) }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        link_href: formData.link_href,
        mockup_id: formData.mockup_id,
        media_assets: formData.media_assets
      })
      .eq('id', formData.id);

    if (!error) {
      onRefresh();
      onClose();
    } else {
      console.error("Save Error:", error);
      // UPGRADED ERROR HANDLER: Will tell you exactly why Supabase rejected it.
      alert(`Database Error: ${error.message}\n\n(If it says column not found, clear your Supabase Schema Cache again!)`);
    }
    setIsSaving(false);
  };

  const renderMockup = (mockupId: string) => {
    if (mockupId === 'shift_studio') {
      return (
        <div className="w-full max-w-lg bg-[#0d1520] border border-cyan-900/50 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          <div className="h-8 bg-[#0a0f16] border-b border-cyan-900/50 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded bg-[#131d2b] border border-cyan-900/30 font-mono text-[9px] text-cyan-500/50 uppercase tracking-widest">
              <Lock size={10} /> Shift Studio Command
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
              <div className="h-6 w-32 bg-cyan-900/30 rounded border border-cyan-800/30" />
              <div className="h-8 w-8 bg-cyan-900/30 rounded-full border border-cyan-800/30" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
              <div className="h-20 bg-cyan-950/20 rounded border border-cyan-900/30" />
            </div>
          </div>
        </div>
      );
    }
    if (mockupId === 'glitchbot') {
      return (
        <div className="w-full max-w-lg bg-[#13091c] border border-fuchsia-900/50 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
          <div className="h-8 bg-[#0c0512] border-b border-fuchsia-900/50 flex items-center px-4 justify-between">
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/><div className="w-2.5 h-2.5 rounded-full bg-slate-600"/></div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#1e0d2e] border border-fuchsia-900/30 font-mono text-[9px] text-fuchsia-400/80 uppercase tracking-widest">
              <TerminalIcon size={10} /> Diagnostic
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4 font-mono text-xs">
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded bg-slate-800 shrink-0 flex items-center justify-center"><User size={14}/></div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 w-[85%]">Anomaly detected.</div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full max-w-lg bg-black/50 border border-slate-800 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
        <Database className="w-12 h-12 text-slate-800" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex bg-bg-app animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      
      {/* LEFT COLUMN: THE LIVE PREVIEW */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 xl:p-12 bg-black/90 relative overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-225 relative z-10 pointer-events-none scale-90 xl:scale-100 origin-center transition-transform my-auto">
           <div className="text-center mb-8">
              <span className="bg-slate-800/80 text-slate-300 font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-slate-700/50">Live Website Preview</span>
           </div>
           
           <AppShowcaseCard 
              title={formData.name || "UNTITLED"}
              status={formData.tagline || "NO STATUS"}
              description={formData.description || "No description."}
              linkHref={formData.link_href || "#"}
              uiMockup={renderMockup(formData.mockup_id)}
              images={formData.media_assets.carousel}
           />
        </div>
      </div>

      {/* RIGHT COLUMN: THE CONTROLS */}
      <div className="w-full lg:w-112.5 xl:w-125 border-l border-slate-800 h-full flex flex-col bg-bg-app z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] shrink-0">
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Live Editor</h2>
            <p className="text-xs text-brand-primary font-mono uppercase tracking-widest mt-1">Configuring: {formData.name || 'Untitled'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Copy */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <Type size={14} /> Public Copy
            </h3>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Display Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Tagline (Status/Version)</label>
              <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Full Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-colors resize-none" />
            </div>
          </div>

          {/* Smart Media Carousel Manager */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <ImageIcon size={14} /> Storefront Carousel
            </h3>
            
            <div className="w-full">
              <input type="file" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-slate-700 hover:border-brand-primary/50 bg-black hover:bg-brand-primary/5 rounded-xl py-6 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-brand-primary"
              >
                {isUploading ? (
                  <><Loader2 size={24} className="animate-spin" /> <span className="text-xs font-mono uppercase tracking-widest font-bold">Uploading...</span></>
                ) : (
                  <><UploadCloud size={24} /> <span className="text-xs font-mono uppercase tracking-widest font-bold">Upload to Asset Vault</span></>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">OR PASTE URL</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="flex gap-2">
              <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-black border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:border-brand-primary outline-none" />
              <button onClick={handleAddImageUrl} className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors">
                <Plus size={16} />
              </button>
            </div>

            {formData.media_assets.carousel.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {formData.media_assets.carousel.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 aspect-video bg-black">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <button onClick={() => handleRemoveImage(idx)} className="absolute inset-0 m-auto w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Routing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
              <LinkIcon size={14} /> Routing
            </h3>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex">Target URL</label>
              <input type="text" name="link_href" value={formData.link_href} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm text-brand-primary font-mono focus:border-brand-primary outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <LayoutTemplate size={12} /> UI Mockup Blueprint
              </label>
              <select name="mockup_id" value={formData.mockup_id} onChange={handleChange} className="w-full bg-black border border-slate-800 rounded-lg px-4 py-3 text-sm text-white font-mono uppercase tracking-widest focus:border-brand-primary outline-none transition-colors cursor-pointer">
                <option value="default">Generic Wireframe</option>
                <option value="shift_studio">Shift Studio (Cyan Data Grid)</option>
                <option value="glitchbot">GlitchBot (Fuchsia Terminal)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-3 text-xs font-bold font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
          <button onClick={handleSave} disabled={isSaving || isUploading} className="flex-1 py-3 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all flex justify-center items-center gap-2 disabled:opacity-50">
            {isSaving ? 'Saving...' : <><Save size={16} /> Deploy Updates</>}
          </button>
        </div>
      </div>

    </div>
  );
}