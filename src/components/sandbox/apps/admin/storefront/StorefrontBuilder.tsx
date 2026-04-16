import React, { useState, useRef } from 'react';
import { Edit3, X, Image as ImageIcon, Flame, Award, Leaf, Wind, Tag, Droplet, Sparkles, Star, Save, ArrowLeft, ArrowRight, Trash2, Plus, Activity, Search, UploadCloud, CloudLightning } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import InventorySelectorModal from './InventorySelectorModal';

export const IconMap: any = { Flame, Award, Leaf, Wind, Tag, Droplet, Sparkles, Star, Activity };

export const ThemeMap: Record<string, any> = {
  emerald: { heroGrad: 'bg-linear-to-r from-emerald-600 to-teal-600', secBg: 'bg-emerald-500', secBtnText: 'text-emerald-400', bentoHover: 'hover:border-emerald-500', bentoOverlay: 'from-emerald-950', bentoFallback: 'bg-linear-to-b from-emerald-900 via-zinc-900 to-black', bentoIconBg: 'bg-emerald-500/10', bentoIconText: 'text-emerald-400' },
  cyan: { heroGrad: 'bg-linear-to-r from-cyan-600 to-blue-600', secBg: 'bg-cyan-500', secBtnText: 'text-cyan-400', bentoHover: 'hover:border-cyan-500', bentoOverlay: 'from-cyan-950', bentoFallback: 'bg-linear-to-b from-cyan-900 via-zinc-900 to-black', bentoIconBg: 'bg-cyan-500/10', bentoIconText: 'text-cyan-400' },
  pink: { heroGrad: 'bg-linear-to-r from-pink-600 to-rose-600', secBg: 'bg-pink-500', secBtnText: 'text-pink-400', bentoHover: 'hover:border-pink-500', bentoOverlay: 'from-pink-950', bentoFallback: 'bg-linear-to-b from-pink-900 via-zinc-900 to-black', bentoIconBg: 'bg-pink-500/10', bentoIconText: 'text-pink-400' },
  orange: { heroGrad: 'bg-linear-to-r from-orange-600 to-red-600', secBg: 'bg-orange-500', secBtnText: 'text-orange-400', bentoHover: 'hover:border-orange-500', bentoOverlay: 'from-orange-950', bentoFallback: 'bg-linear-to-b from-orange-900 via-zinc-900 to-black', bentoIconBg: 'bg-orange-500/10', bentoIconText: 'text-orange-400' },
  fuchsia: { heroGrad: 'bg-linear-to-r from-fuchsia-600 to-purple-600', secBg: 'bg-fuchsia-500', secBtnText: 'text-fuchsia-400', bentoHover: 'hover:border-fuchsia-500', bentoOverlay: 'from-fuchsia-950', bentoFallback: 'bg-linear-to-b from-fuchsia-900 via-zinc-900 to-black', bentoIconBg: 'bg-fuchsia-500/10', bentoIconText: 'text-fuchsia-400' },
  amber: { heroGrad: 'bg-linear-to-r from-amber-500 to-orange-500', secBg: 'bg-amber-500', secBtnText: 'text-amber-400', bentoHover: 'hover:border-amber-500', bentoOverlay: 'from-amber-950', bentoFallback: 'bg-linear-to-b from-amber-900 via-zinc-900 to-black', bentoIconBg: 'bg-amber-500/10', bentoIconText: 'text-amber-400' }
};

export const getThemeColor = (configColor: string) => {
    if (!configColor) return 'emerald';
    const str = configColor.toLowerCase();
    if (str.includes('pink') || str.includes('rose')) return 'pink';
    if (str.includes('cyan') || str.includes('blue')) return 'cyan';
    if (str.includes('orange') || str.includes('red')) return 'orange';
    if (str.includes('fuchsia') || str.includes('purple')) return 'fuchsia';
    if (str.includes('amber') || str.includes('yellow')) return 'amber';
    return 'emerald';
};

export default function StorefrontBuilder({ homeConfig, setHomeConfig, mainCategories, subCategories, inventoryMatrix, clientConfig }: any) {
    const [editingBlock, setEditingBlock] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>(null);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openEdit = (blockId: string, data: any) => {
        setEditingBlock(blockId);
        const cleanedData = { ...data };
        if (cleanedData.span) cleanedData.span = cleanedData.span.replace(/md:col-start-\d+/g, '').trim();
        setEditForm(cleanedData);
    };

    const handleSave = () => {
        if (editingBlock === 'hero') setHomeConfig({ ...homeConfig, hero: editForm });
        else if (editingBlock === 'secondary') setHomeConfig({ ...homeConfig, secondary: editForm });
        else if (editingBlock?.startsWith('bento-')) {
            const idx = parseInt(editingBlock.split('-')[1]);
            const newBento = [...homeConfig.bento];
            newBento[idx] = editForm;
            setHomeConfig({ ...homeConfig, bento: newBento });
        }
        setEditingBlock(null);
    };

    const handlePublishToDatabase = async () => {
        if (!clientConfig?.id) return;
        setIsPublishing(true);
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Fetch current settings to merge
            const { data, error } = await supabase.from('client_settings').select('payload').eq('client_id', clientConfig.id).single();
            const currentPayload = data?.payload || {};
            const updatedPayload = { ...currentPayload, homeConfig: homeConfig };

            const { error: updateError } = await supabase.from('client_settings').update({ 
                payload: updatedPayload,
                updated_at: new Date().toISOString()
            }).eq('client_id', clientConfig.id);

            if (updateError) throw updateError;
            alert("Layout Published to Live Storefront!");
        } catch (err) {
            console.error("Publish Error:", err);
            alert("Failed to publish layout to database.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleFileUpload = async (file: File) => {
      if (!file || !clientConfig?.id) return;
      setIsUploading(true);
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const fileExt = file.name.split('.').pop();
        const filename = `${clientConfig.id}/storefront/marketing/${editingBlock}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('client-assets').upload(filename, file, { upsert: true });
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('client-assets').getPublicUrl(filename);
        setEditForm({ ...editForm, imgUrl: publicUrl });
      } catch (err) {
        console.error("Layout Builder Upload Error:", err);
      } finally {
        setIsUploading(false);
      }
    };

    const moveBento = (idx: number, direction: number) => {
        const newBento = [...homeConfig.bento];
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= newBento.length) return;
        const temp = newBento[idx];
        newBento[idx] = newBento[targetIdx];
        newBento[targetIdx] = temp;
        setHomeConfig({ ...homeConfig, bento: newBento });
    };

    const removeBento = (idx: number) => {
        if (homeConfig.bento.length <= 4) return;
        const newBento = homeConfig.bento.filter((_: any, i: number) => i !== idx);
        setHomeConfig({ ...homeConfig, bento: newBento });
    };

    const addBento = () => {
        if (homeConfig.bento.length >= 6) return;
        const newBento = [...homeConfig.bento, { name: "New Category", cat: mainCategories[0], sub: "All", icon: "Tag", color: "cyan", desc: "Short description here.", span: "col-span-1 md:col-span-1 md:row-span-1", imgUrl: "" }];
        setHomeConfig({ ...homeConfig, bento: newBento });
    };

    const heroTheme = ThemeMap[getThemeColor((homeConfig.hero as any).color || homeConfig.hero.colorFrom)] || ThemeMap['pink'];
    const secTheme = ThemeMap[getThemeColor((homeConfig.secondary as any).color || homeConfig.secondary.colorFrom)] || ThemeMap['emerald'];

    const HeroIcon = IconMap[homeConfig.hero.icon] || Flame;
    const SecIcon = IconMap[homeConfig.secondary.icon] || Award;

    return (
        <div className="bg-zinc-950 rounded-4xl border border-zinc-800 p-8 shadow-2xl overflow-hidden relative">
           <div className="mb-6 flex items-center justify-between">
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Visual Layout Builder</h3>
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Click any section to edit. Rearrange category blocks dynamically.</p>
             </div>
             
             {/* THE NEW PUBLISH TO DB BUTTON */}
             <button 
                onClick={handlePublishToDatabase}
                disabled={isPublishing}
                className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
             >
                {isPublishing ? <Activity size={16} className="animate-spin" /> : <CloudLightning size={16} />} 
                {isPublishing ? 'Syncing...' : 'Publish to Live'}
             </button>
           </div>

           <div className="space-y-10 scale-[0.95] transform origin-top border border-dashed border-zinc-800 p-6 rounded-3xl bg-zinc-950/50 relative">
              
              <div onClick={() => openEdit('hero', homeConfig.hero)} className={`cursor-pointer group relative w-full ${(homeConfig.hero as any).imgUrl ? 'bg-zinc-950' : heroTheme.heroGrad} rounded-3xl p-4 md:p-8 flex flex-col justify-end shadow-2xl overflow-hidden transition-all hover:ring-4 ring-white/20 h-100 md:h-125`}>
                 {(homeConfig.hero as any).imgUrl ? (
                    <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
                      <img src={(homeConfig.hero as any).imgUrl} className={`w-full h-full object-cover opacity-30`} alt="Hero" />
                      <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60`} />
                    </div>
                 ) : (
                    <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
                       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                       <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950"></div>
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center z-50 backdrop-blur-sm transition-all rounded-3xl">
                      <span className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"><Edit3 size={16}/> Edit Hero Banner</span>
                 </div>
                 <div className="relative z-10 flex flex-col items-center justify-center w-full h-full my-auto py-4 pointer-events-none">
                     <div className="flex flex-col items-center text-center animate-[pulse_3s_ease-in-out_infinite] max-w-3xl mx-auto w-full transition-shadow duration-700">
                         <div className="relative mb-2">
                           <HeroIcon size={48} className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-bounce relative z-10" />
                           <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-50 rounded-full animate-pulse"></div>
                         </div>
                         <div className="space-y-1 md:space-y-2 w-full">
                             {homeConfig.hero.title.split('\n').map((line: string, i: number) => {
                                 const isCyan = i % 2 !== 0;
                                 return (
                                   <h2 key={i} className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none ${isCyan ? 'text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]' : 'text-pink-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]'}`}>
                                       {line}
                                   </h2>
                                 )
                             })}
                         </div>
                         <p className="mt-6 text-pink-100 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                             {homeConfig.hero.subtitle}
                         </p>
                         <div className="mt-8 px-8 py-3 border-2 border-cyan-400 text-cyan-300 font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 hover:text-zinc-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all bg-zinc-950/40 backdrop-blur-sm">
                             <span className="relative z-10">{homeConfig.hero.buttonText}</span>
                         </div>
                     </div>
                 </div>
              </div>

              {/* Bento Grid Editor */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 pointer-events-none">Shop By Categories</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full">{homeConfig.bento.length} / 6 Active</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[160px] md:auto-rows-[180px]">
                  {homeConfig.bento.map((c: any, idx: number) => {
                     const BIcon = IconMap[c.icon] || Tag;
                     const sanitizedSpan = c.span.replace(/md:col-start-\d+/g, '').trim();
                     const theme = ThemeMap[getThemeColor(c.color)] || ThemeMap['emerald'];

                     return (
                       <div key={idx} className={`group relative overflow-hidden ${sanitizedSpan} bg-zinc-950 border-2 border-zinc-800 shadow-lg rounded-3xl p-6 flex flex-col items-start justify-end gap-1 ${theme.bentoHover} transition-all`}>
                         <div className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center z-50 backdrop-blur-sm transition-all gap-3">
                           <button onClick={(e) => { e.stopPropagation(); openEdit(`bento-${idx}`, c); }} className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors"><Edit3 size={14}/> Edit Content</button>
                           <div className="flex items-center gap-2">
                             <button onClick={(e) => { e.stopPropagation(); moveBento(idx, -1); }} disabled={idx === 0} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-white disabled:opacity-30 transition-colors" title="Move Back"><ArrowLeft size={16}/></button>
                             <button onClick={(e) => { e.stopPropagation(); moveBento(idx, 1); }} disabled={idx === homeConfig.bento.length - 1} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-white disabled:opacity-30 transition-colors" title="Move Forward"><ArrowRight size={16}/></button>
                             {homeConfig.bento.length > 4 && (
                                <button onClick={(e) => { e.stopPropagation(); removeBento(idx); }} className="p-2.5 bg-rose-500 hover:bg-rose-400 rounded-lg text-white transition-colors ml-2" title="Remove Box"><Trash2 size={16}/></button>
                             )}
                           </div>
                         </div>

                         {c.imgUrl ? (
                            <div className="absolute inset-0 z-0">
                               <img src={c.imgUrl} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                               <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40`} />
                               <div className={`absolute inset-0 bg-linear-to-t ${theme.bentoOverlay} opacity-30`} />
                            </div>
                         ) : (
                            <div className={`absolute inset-0 z-0 ${theme.bentoFallback}`} />
                         )}
                         <div className="relative z-10 w-full flex flex-col items-start pointer-events-none">
                            <div className={`p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/50 mb-4 ${theme.bentoIconBg} ${theme.bentoIconText}`}>
                               <BIcon size={24} />
                            </div>
                            <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-zinc-100 drop-shadow-md">{c.name}</span>
                            <p className={`text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed text-left ${(sanitizedSpan.includes('row-span-2') ? '' : 'hidden md:block')}`}>
                               {c.desc}
                            </p>
                         </div>
                       </div>
                     );
                  })}
                  {homeConfig.bento.length < 6 && (
                      <button onClick={addBento} className="col-span-1 md:col-span-1 md:row-span-1 border-2 border-dashed border-zinc-700 rounded-3xl flex flex-col items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group min-h-40">
                          <div className="p-3 bg-zinc-900 rounded-full group-hover:bg-cyan-500/20 transition-colors mb-2"><Plus size={24}/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Category</span>
                      </button>
                  )}
                </div>
              </div>

              <div onClick={() => openEdit('secondary', homeConfig.secondary)} className={`cursor-pointer group relative w-full h-62.5 md:h-75 ${secTheme.secBg} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl border border-zinc-700 overflow-hidden transition-all hover:ring-4 ring-white/20`}>
                 <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center z-50 backdrop-blur-sm transition-all">
                     <span className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"><Edit3 size={16}/> Edit Banner</span>
                 </div>
                 <div className="relative z-10 pointer-events-none my-auto">
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">{homeConfig.secondary.subtitle}</p>
                   <h2 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter leading-none mb-6 whitespace-pre-line">{homeConfig.secondary.title}</h2>
                   <button className={`bg-zinc-950 ${secTheme.secBtnText} px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg border border-zinc-800`}>{homeConfig.secondary.buttonText}</button>
                 </div>
                 <SecIcon size={140} className="text-black/10 absolute right-0 md:-right-4 top-1/2 -translate-y-1/2" />
              </div>
           </div>

           {editingBlock && (
               <div className="fixed inset-0 z-100 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
                   <div className="w-full max-w-md bg-zinc-950 h-full border-l border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-right-8">
                       <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                           <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2"><Edit3 size={18} className="text-cyan-400"/> {editingBlock.includes('bento') ? 'Edit Category Box' : 'Edit Banner'}</h3>
                           <button onClick={() => setEditingBlock(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors"><X size={16}/></button>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto p-6 space-y-6">
                           {!editingBlock.includes('bento') && (
                               <>
                                 <div>
                                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Headline (Use \n for new line)</label>
                                     <textarea rows={2} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                                 </div>
                                 <div>
                                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Subheadline</label>
                                     <input type="text" value={editForm.subtitle} onChange={e => setEditForm({...editForm, subtitle: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                                 </div>
                                 <div>
                                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Button Text</label>
                                     <input type="text" value={editForm.buttonText} onChange={e => setEditForm({...editForm, buttonText: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Color Theme</label>
                                         <select value={getThemeColor(editForm.color || editForm.colorFrom)} onChange={e => setEditForm({...editForm, color: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                             <option value="pink">Pink</option>
                                             <option value="emerald">Emerald</option>
                                             <option value="cyan">Cyan</option>
                                             <option value="orange">Orange</option>
                                             <option value="fuchsia">Fuchsia</option>
                                             <option value="amber">Amber</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Icon</label>
                                         <select value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                             {Object.keys(IconMap).map(k => <option key={k} value={k}>{k}</option>)}
                                         </select>
                                     </div>
                                 </div>
                               </>
                           )}

                           {editingBlock.includes('bento') && (
                               <>
                                 <div>
                                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Display Name</label>
                                     <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                                 </div>
                                 <div>
                                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Description</label>
                                     <input type="text" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                                 </div>

                                 <div className="border-t border-zinc-800/80 pt-4 mt-2">
                                     <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2">Grid Layout Size</label>
                                     <select value={editForm.span} onChange={e => setEditForm({...editForm, span: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-amber-500 outline-none">
                                         <option value="col-span-1 md:col-span-1 md:row-span-1">Standard Box (1x1)</option>
                                         <option value="col-span-2 md:col-span-2 md:row-span-1">Wide Box (2x1)</option>
                                         <option value="col-span-1 md:col-span-1 md:row-span-2">Tall Feature (1x2)</option>
                                         <option value="col-span-2 md:col-span-2 md:row-span-2">Massive Feature (2x2)</option>
                                     </select>
                                     <p className="text-[9px] text-zinc-500 mt-2 uppercase tracking-widest leading-relaxed">Adjusting this changes the box dimensions. The storefront grid will automatically pack around it.</p>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4 mt-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Category</label>
                                        <select 
                                            value={editForm.cat} 
                                            onChange={e => setEditForm({...editForm, cat: e.target.value, sub: 'All', name: e.target.value})} 
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white focus:border-cyan-500 outline-none"
                                        >
                                            {mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Sub-Category</label>
                                        <select 
                                            value={editForm.sub} 
                                            onChange={e => setEditForm({...editForm, sub: e.target.value, name: e.target.value === 'All' ? editForm.cat : e.target.value})} 
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white focus:border-cyan-500 outline-none"
                                        >
                                            <option value="All">All</option>
                                            {subCategories[editForm.cat]?.map((s:string)=><option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Accent Color</label>
                                         <select value={getThemeColor(editForm.color || editForm.colorFrom)} onChange={e => setEditForm({...editForm, color: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                             <option value="emerald">Emerald</option>
                                             <option value="cyan">Cyan</option>
                                             <option value="pink">Pink</option>
                                             <option value="orange">Orange</option>
                                             <option value="fuchsia">Fuchsia</option>
                                             <option value="amber">Amber</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Icon</label>
                                         <select value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                             {Object.keys(IconMap).map(k => <option key={k} value={k}>{k}</option>)}
                                         </select>
                                     </div>
                                 </div>
                               </>
                           )}

                           <div className="border-t border-zinc-800/80 pt-6 mt-2">
                               <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-3"><ImageIcon size={14}/> Graphic Selection</label>
                               <div className="space-y-3">
                                   <div className="flex gap-2">
                                     <input type="text" value={editForm.imgUrl || ''} onChange={e => setEditForm({...editForm, imgUrl: e.target.value})} placeholder="https://..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-cyan-100 focus:border-cyan-500 outline-none" />
                                     <button onClick={() => setShowInventoryModal(true)} className="px-4 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-xl border border-zinc-700 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap">
                                       <Search size={14}/> Find
                                     </button>
                                   </div>
                                   
                                   <button 
                                     onClick={() => fileInputRef.current?.click()} 
                                     disabled={isUploading}
                                     className="w-full bg-zinc-900 hover:bg-zinc-800 border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                                   >
                                     {isUploading ? <UploadCloud size={20} className="text-cyan-400 animate-bounce" /> : <UploadCloud size={20} className="text-zinc-600 group-hover:text-cyan-400" />}
                                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400">{isUploading ? 'Uploading to Vault...' : 'Upload Local Image'}</span>
                                   </button>
                                   <input type="file" ref={fileInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);}} className="hidden" accept="image/*" />
                               </div>
                           </div>
                       </div>
                       
                       <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                           <button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                              <Save size={16}/> Apply Changes
                           </button>
                       </div>
                   </div>
               </div>
           )}

           <InventorySelectorModal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} inventoryMatrix={inventoryMatrix || []} onSelect={(item: any) => { setEditForm({...editForm, imgUrl: item.imageUrl || item.imgUrl || item.image || ''}); setShowInventoryModal(false); }} context={{lane: 'Background'}} />
        </div>
    );
}