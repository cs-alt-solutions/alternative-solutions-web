'use client';

import React, { useState, useRef } from 'react';
import { X, Trash2, BookText, Fingerprint, DollarSign, Save, Image as ImageIcon, UploadCloud, Leaf, Flame, Box, Boxes, TicketPercent, Award, Star, CalendarDays, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function AdminInventoryEditor({ initialItem, isAdding, mainCategories, subCategories, standardTiers, onSave, onDelete, onCancel, client_id, setNotification }: any) {
  const cid = client_id;
  
  const [updatedItem, setUpdatedItem] = useState({ 
    ...initialItem, 
    sizes: initialItem.sizes || [],
    options: initialItem.options || []
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file || !cid || !updatedItem.id) return;
    setIsUploading(true);
    if (setNotification) setNotification("Preparing asset push...");
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const fileExt = file.name.split('.').pop();
      const filename = `${cid}/inventory/${updatedItem.id}-v${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filename, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('client-assets').getPublicUrl(filename);
      setUpdatedItem((prev: any) => ({ ...prev, imageUrl: publicUrl }));
      if (setNotification) setNotification(`Image Uploaded! Synced to Vault.`);
    } catch (err) { console.error("Asset Upload Error:", err); if (setNotification) setNotification("Image upload failed."); }
    finally { setIsUploading(false); }
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); };

  const handleSizeChange = (id: string, field: string, value: any) => { 
    setUpdatedItem((prev: any) => ({ 
      ...prev, 
      sizes: prev.sizes.map((s: any) => s.id === id ? { ...s, [field]: (field === 'price' || field === 'bundleQty' || field === 'promoPrice') ? Number(value) || '' : value } : s) 
    })); 
  };
  
  const handleAddSize = () => {
    setUpdatedItem((prev: any) => ({
      ...prev,
      sizes: [...prev.sizes, { id: `sz-${Date.now()}`, label: 'New Size', price: 0, bundleQty: 1, promoPrice: '' }]
    }));
  };

  const handleRemoveSize = (id: string) => {
    setUpdatedItem((prev: any) => ({ ...prev, sizes: prev.sizes.filter((s: any) => s.id !== id) }));
  };

  const handleOptionChange = (id: string, field: string, value: any) => {
    setUpdatedItem((prev: any) => ({
      ...prev,
      options: prev.options.map((o: any) => o.id === id ? { ...o, [field]: field === 'stock' ? Number(value) || 0 : value } : o)
    }));
  };

  const handleAddOption = () => {
    setUpdatedItem((prev: any) => ({
      ...prev,
      options: [...prev.options, { id: `opt-${Date.now()}`, label: 'New Variant', stock: 0 }]
    }));
  };

  const handleRemoveOption = (id: string) => {
    setUpdatedItem((prev: any) => ({ ...prev, options: prev.options.filter((o: any) => o.id !== id) }));
  };

  const handleSave = () => { onSave(updatedItem, isAdding); };

  const activeMainCat = updatedItem.mainCategory;
  
  // CATEGORY LOGIC: Flower and Merch don't use flavors/variants
  const isFlower = activeMainCat === 'Flower & Plants';
  const isMerch = activeMainCat === 'Merch & Extras';
  const showVariants = !isFlower && !isMerch;

  const weekdayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const ItemIcon = updatedItem.iconName === 'Leaf' ? Leaf : updatedItem.iconName === 'Flame' ? Flame : updatedItem.iconName === 'Box' ? Box : ImageIcon;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-white pb-32 animate-in fade-in duration-500">
      
      {/* STICKY TOP HEADER */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
             {updatedItem.imageUrl ? <img src={updatedItem.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <ItemIcon size={20} className="text-zinc-600" />}
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-100 leading-tight flex items-center gap-3">
               {isAdding ? "New Vault Entry" : updatedItem.name || "Unnamed Product"}
               
               {/* THE NUKE PROTOCOL */}
               {!isAdding && (
                 isConfirmingDelete ? (
                   <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl animate-in zoom-in-95">
                      <span className="text-[10px] font-bold text-rose-400 uppercase px-2 tracking-widest">Are you sure?</span>
                      <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1.5 bg-zinc-900 rounded-lg text-zinc-400 text-[10px] uppercase font-black hover:text-zinc-100">Cancel</button>
                      <button onClick={() => onDelete(updatedItem.id)} className="px-3 py-1.5 bg-rose-500 rounded-lg text-zinc-950 text-[10px] uppercase font-black hover:bg-rose-400 flex items-center gap-1 shadow-[0_0_15px_rgba(244,63,94,0.4)]"><Trash2 size={12}/> Confirm Nuke</button>
                   </div>
                 ) : (
                   <button onClick={() => setIsConfirmingDelete(true)} className="bg-zinc-950 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5 opacity-50 hover:opacity-100"><Trash2 size={12} /> Nuke</button>
                 )
               )}
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
               ID: {updatedItem.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 font-black px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all">Cancel</button>
          <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"><Save size={14} /> Save</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8 mt-4">

        {/* SECTION 1: CORE IDENTITY */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <Fingerprint size={16} className="text-cyan-400" /> Core Identity
           </h2>
           
           <div className="flex flex-col md:flex-row gap-8">
              {/* Image Upload Area */}
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Product Graphic</label>
                 <div 
                   className={`w-full aspect-square bg-zinc-950 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-colors cursor-pointer relative overflow-hidden group ${dragActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                   onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                   onClick={() => fileInputRef.current?.click()}
                 >
                    {updatedItem.imageUrl && <img src={updatedItem.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                       {isUploading ? <UploadCloud size={24} className="text-cyan-400 animate-bounce" /> : <ImageIcon size={24} className={updatedItem.imageUrl ? "text-zinc-100" : "text-zinc-600"} />}
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{isUploading ? 'Uploading...' : 'Tap or Drop'}</span>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);}} className="hidden" accept="image/*" />
                 </div>
              </div>

              {/* Core Text Fields */}
              <div className="flex-1 space-y-5">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Product Name *</label>
                     <input type="text" value={updatedItem.name} onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })} placeholder="e.g. Gorilla Butter (Top Shelf)" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Brand / Maker</label>
                     <input type="text" value={updatedItem.brand || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, brand: e.target.value })} placeholder="e.g. Bored Extracts CO" className="w-full bg-zinc-950 border border-emerald-500/30 rounded-xl p-3.5 text-sm font-bold text-emerald-400 focus:border-emerald-500 outline-none transition-colors" />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Main Category</label>
                     <select value={updatedItem.mainCategory} onChange={(e) => setUpdatedItem({ ...updatedItem, mainCategory: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                       {mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sub Category</label>
                     <select value={updatedItem.subCategory} onChange={(e) => setUpdatedItem({ ...updatedItem, subCategory: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                       {subCategories[updatedItem.mainCategory]?.map((s:string)=><option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}
                     </select>
                   </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 2: PRODUCT DNA (RESTORED GRANULAR FIELDS) */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <BookText size={16} className="text-emerald-400" /> Product DNA
           </h2>
           
           <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Main Description (Storefront display)</label>
                <textarea value={updatedItem.descBase} onChange={(e) => setUpdatedItem({ ...updatedItem, descBase: e.target.value })} placeholder="Enter the main marketing copy here..." rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-300 focus:border-emerald-500/50 outline-none transition-colors resize-none" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                 <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Feels / Effects</label>
                   <input type="text" value={updatedItem.descFeels} onChange={(e) => setUpdatedItem({ ...updatedItem, descFeels: e.target.value })} placeholder="Creative, Relaxed..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none transition-colors" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Taste / Aroma</label>
                   <input type="text" value={updatedItem.descTaste} onChange={(e) => setUpdatedItem({ ...updatedItem, descTaste: e.target.value })} placeholder="Sweet, Berry..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none transition-colors" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Uses / Pairing</label>
                   <input type="text" value={updatedItem.descUses} onChange={(e) => setUpdatedItem({ ...updatedItem, descUses: e.target.value })} placeholder="Nighttime, Social..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none transition-colors" />
                 </div>
              </div>

              {isFlower && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl mt-2">
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Strain Lineage</label>
                     <input type="text" value={updatedItem.lineage} onChange={(e) => setUpdatedItem({ ...updatedItem, lineage: e.target.value })} placeholder="Wedding Cake x Cherry Pie" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Strain Classification</label>
                     <select value={updatedItem.strainType} onChange={(e) => setUpdatedItem({ ...updatedItem, strainType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none transition-colors">
                       {['Sativa', 'Indica', 'Hybrid', 'Sativa Dom Hybrid', 'Indica Dom Hybrid', 'CBD', 'N/A'].map((st:string)=><option key={st} value={st}>{st}</option>)}
                     </select>
                   </div>
                </div>
              )}
           </div>
        </section>

        {/* SECTION 3: PRICING & STOCK */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
             <span className="flex items-center gap-2"><DollarSign size={16} className="text-amber-400" /> Pricing & Sizes</span>
             <button onClick={handleAddSize} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Tier</button>
           </h2>
           
           <div className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {updatedItem.sizes.map((size: any) => (
                   <div key={size.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                     <button onClick={() => handleRemoveSize(size.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                     
                     <div>
                       <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Tier Label</label>
                       <input type="text" value={size.label} onChange={(e) => handleSizeChange(size.id, 'label', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold text-zinc-300 outline-none" />
                     </div>

                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1 block">Base Price</label>
                         <div className="relative">
                           <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-amber-500/50" />
                           <input type="number" value={size.price} onChange={(e) => handleSizeChange(size.id, 'price', e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-6 pr-2 text-xs font-mono font-bold text-amber-400 outline-none" />
                         </div>
                       </div>
                       <div>
                         <label className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mb-1 block">Promo Price</label>
                         <div className="relative">
                           <DollarSign size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500/50" />
                           <input type="number" value={size.promoPrice} onChange={(e) => handleSizeChange(size.id, 'promoPrice', e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-pink-500/30 rounded-lg py-2 pl-6 pr-2 text-xs font-mono font-bold text-pink-400 outline-none focus:border-pink-500" />
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
           </div>
        </section>

        {/* SECTION 4: VARIANTS & OPTIONS (CATEGORIES-AWARE HIDING) */}
        {showVariants && (
          <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
               <span className="flex items-center gap-2"><Boxes size={16} className="text-indigo-400" /> Variants & Flavors</span>
               <button onClick={handleAddOption} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Variant</button>
             </h2>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {updatedItem.options.map((opt: any) => (
                 <div key={opt.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                   <button onClick={() => handleRemoveOption(opt.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                   
                   <div>
                     <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Variant / Flavor Name</label>
                     <input type="text" value={opt.label} onChange={(e) => handleOptionChange(opt.id, 'label', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold text-zinc-300 outline-none" />
                   </div>
                   
                   <div>
                     <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Stock (Units)</label>
                     <input type="number" value={opt.stock} onChange={(e) => handleOptionChange(opt.id, 'stock', e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono font-bold text-indigo-400 outline-none" />
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}
        
        {/* FALLBACK: Global Stock if Variants hidden (Merch/Flower) */}
        {!showVariants && (
           <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
               <Boxes size={16} className="text-indigo-400" /> Global Vault Stock
             </h2>
             <div>
               <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Total Stock (Units)</label>
               <input type="number" value={updatedItem.onHand} onChange={(e) => setUpdatedItem({ ...updatedItem, onHand: Number(e.target.value) || 0 })} placeholder="0" className="w-full bg-zinc-950 border border-indigo-500/30 rounded-xl p-3.5 text-sm font-mono font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-colors" />
             </div>
           </section>
        )}

        {/* SECTION 5: MERCHANDISING & PROMO ENGINE */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <TicketPercent size={16} className="text-rose-400" /> Merchandising & Promo Engine
           </h2>

           <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={()=>setUpdatedItem({...updatedItem, isTopShelf: !updatedItem.isTopShelf})} 
                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isTopShelf ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'}`}
              >
                <Award size={16}/> Top Shelf / Reserve
              </button>
              <button 
                onClick={()=>setUpdatedItem({...updatedItem, featured: !updatedItem.featured})} 
                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.featured ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-400'}`}
              >
                <Star size={16}/> Featured Drop
              </button>
           </div>

           <div className={`border rounded-2xl overflow-hidden transition-all duration-500 ${updatedItem.dailyDeal ? 'bg-rose-500/5 border-rose-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50 transition-colors"
                onClick={(e) => setUpdatedItem({ ...updatedItem, dailyDeal: !updatedItem.dailyDeal, dealType: !updatedItem.dailyDeal ? 'Daily Deal' : updatedItem.dealType })}
              >
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${updatedItem.dailyDeal ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-900 text-zinc-600'}`}>
                     <Flame size={18} className={updatedItem.dailyDeal ? 'animate-pulse' : ''} />
                   </div>
                   <div>
                     <h4 className={`text-sm font-black uppercase tracking-widest ${updatedItem.dailyDeal ? 'text-rose-400' : 'text-zinc-400'}`}>Enable Promo Engine</h4>
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Activate cart logic and schedule deals</p>
                   </div>
                 </div>
                 <div className={`w-12 h-6 rounded-full relative transition-colors ${updatedItem.dailyDeal ? 'bg-rose-500' : 'bg-zinc-800'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${updatedItem.dailyDeal ? 'left-7' : 'left-1'}`} />
                 </div>
              </div>

              {updatedItem.dailyDeal && (
                <div className="p-5 pt-0 border-t border-rose-500/20 mt-2 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 block">Deal Logic (Cart Math Engine)</label>
                        <select value={updatedItem.dealLogic || 'STANDARD'} onChange={(e) => setUpdatedItem({ ...updatedItem, dealLogic: e.target.value })} className="w-full bg-zinc-900 border border-rose-500/30 rounded-xl p-3.5 text-sm font-bold text-rose-300 focus:border-rose-400 outline-none">
                           <option value="STANDARD">Standard Pricing override</option>
                           <option value="BOGO">Buy 1 Get 1 Free</option>
                           <option value="B2G1">Buy 2 Get 1 Free</option>
                           <option value="B5G1">Buy 5 Get 1 Free (The Heavy Hand)</option>
                           <option value="PCT_15">15% Off (Happy Hour / Category Deal)</option>
                           <option value="PENNY_150">$0.01 Unlock (Cart Minimum Kicker)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 block">Schedule Mode</label>
                        <select value={updatedItem.dealType} onChange={(e) => setUpdatedItem({ ...updatedItem, dealType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 outline-none">
                          {['Daily Deal', 'Weekly Special'].map((t:string)=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                   </div>

                   <div>
                     <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 block">Promo Tagline (Shown to User)</label>
                     <input type="text" value={updatedItem.dealText} onChange={(e) => setUpdatedItem({ ...updatedItem, dealText: e.target.value })} placeholder="e.g. BOGO! | 15% OFF!" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 outline-none focus:border-rose-500/50" />
                   </div>

                   {updatedItem.dealType === 'Weekly Special' && (
                     <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-in fade-in">
                       <label className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                         <CalendarDays size={14} /> Active Days of the Week
                       </label>
                       <div className="flex flex-wrap gap-2">
                         {weekdayMap.map((day, index) => {
                           const isActive = updatedItem.dealDays?.includes(index);
                           return (
                             <button key={day} onClick={() => setUpdatedItem({ ...updatedItem, dealDays: isActive ? updatedItem.dealDays.filter((d:number) => d !== index) : [...(updatedItem.dealDays || []), index] })} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors ${isActive ? 'bg-rose-500 text-zinc-950 border-rose-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-rose-400 hover:border-rose-500/50'}`}>
                               {day}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   )}
                </div>
              )}
           </div>
        </section>

      </div>
    </div>
  );
}