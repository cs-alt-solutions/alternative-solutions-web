'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2, BookText, Fingerprint, DollarSign, Save, Image as ImageIcon, UploadCloud, Leaf, Flame, Box, Boxes, TicketPercent, Award, Star, Plus, Wind, Cookie, Droplet, Sparkles } from 'lucide-react';
import { supabase } from '@/utils/supabase'; 

export default function AdminInventoryEditor({ initialItem, isAdding, mainCategories, subCategories, onSave, onDelete, onCancel, client_id, setNotification, openCampaignConfig }: any) {
  const cid = client_id;
  
  const [updatedItem, setUpdatedItem] = useState({ 
    ...initialItem, 
    sizes: initialItem?.sizes?.length > 0 ? initialItem.sizes : [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0 }],
    options: initialItem?.options || []
  });
  
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (initialItem && !isAdding) {
      setUpdatedItem({
        ...initialItem,
        name: initialItem.name || '',
        brand: initialItem.brand || '',
        mainCategory: initialItem.mainCategory || mainCategories[0],
        subCategory: initialItem.subCategory || '',
        strainType: initialItem.strainType || 'N/A',
        lineage: initialItem.lineage || '',
        price: initialItem.price || 0,
        onHand: initialItem.onHand || 0,
        imageUrl: initialItem.imageUrl || '',
        iconUrl: initialItem.iconUrl || '', 
        descBase: initialItem.descBase || '',
        descFeels: initialItem.descFeels || '',
        descTaste: initialItem.descTaste || '',
        descUses: initialItem.descUses || '',
        descFact: initialItem.descFact || '',
        isTopShelf: !!initialItem.isTopShelf,
        featured: !!initialItem.featured,
        dailyDeal: !!initialItem.dailyDeal,
        status: initialItem.status || 'active',
        sizes: Array.isArray(initialItem.sizes) && initialItem.sizes.length > 0 ? [...initialItem.sizes] : [{ id: `sz-${Date.now()}`, label: 'Standard', price: initialItem.price || 0 }],
        options: Array.isArray(initialItem.options) ? [...initialItem.options] : []
      });
    } else if (isAdding) {
      // Smart Auto-Populate for New Items
      const defaultMain = initialItem?.mainCategory || mainCategories[0];
      const defaultSub = initialItem?.subCategory || subCategories[defaultMain]?.[0] || 'Uncategorized';
      
      const isFlower = defaultMain === 'Flower & Plants';
      const isPreRoll = defaultSub === 'Pre-Rolls & Blunts';
      
      let initialSizes = [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0 }];
      
      if (isFlower && !isPreRoll) {
          initialSizes = [
              { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 40 },
              { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60 },
              { id: `sz-${Date.now()}-3`, label: '14g (Half)', price: 120 },
              { id: `sz-${Date.now()}-4`, label: '28g (Ounce)', price: 220 }
          ];
      }

      setUpdatedItem((prev: any) => ({
          ...prev,
          mainCategory: defaultMain,
          subCategory: defaultSub,
          sizes: initialSizes
      }));
    }
  }, [initialItem, isAdding, mainCategories, subCategories]);

  const handleFileUpload = async (file: File, type: 'main' | 'icon') => {
    if (!file || !cid || !updatedItem.id) return;
    
    if (type === 'main') setIsUploadingMain(true);
    else setIsUploadingIcon(true);

    if (setNotification) setNotification(`Preparing ${type === 'main' ? 'asset' : 'stamp'} push...`);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filename = `${cid}/inventory/${updatedItem.id}-${type}-v${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filename, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('client-assets').getPublicUrl(filename);
      
      setUpdatedItem((prev: any) => ({ ...prev, [type === 'main' ? 'imageUrl' : 'iconUrl']: publicUrl }));
      if (setNotification) setNotification(`${type === 'main' ? 'Image' : 'Stamp'} Synced to Vault.`);
    } catch (err) { 
      console.error("Asset Upload Error:", err); 
      if (setNotification) setNotification("Upload failed."); 
    } finally { 
      if (type === 'main') setIsUploadingMain(false);
      else setIsUploadingIcon(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setDragActive(false); 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0], 'main'); 
  };

  const handleCategoryChange = (field: 'mainCategory' | 'subCategory', value: string) => {
    let newMain = field === 'mainCategory' ? value : updatedItem.mainCategory;
    let newSub = field === 'subCategory' ? value : updatedItem.subCategory;

    if (field === 'mainCategory') {
        newSub = subCategories[newMain]?.[0] || 'Uncategorized';
    }

    let newSizes = [...updatedItem.sizes];
    const isFlower = newMain === 'Flower & Plants';
    const isPreRoll = newSub === 'Pre-Rolls & Blunts';

    const isStandard = newSizes.length === 1 && newSizes[0].label === 'Standard';
    const isFlowerTiers = newSizes.length === 4 && newSizes[0].label === '3.5g (Eighth)';

    if (isFlower && !isPreRoll) {
        // Auto-populate if they currently have just "Standard" or if we are adding a new item and it hasn't generated yet
        if (isStandard || (isAdding && !isFlowerTiers)) {
            newSizes = [
                { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 40 },
                { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60 },
                { id: `sz-${Date.now()}-3`, label: '14g (Half)', price: 120 },
                { id: `sz-${Date.now()}-4`, label: '28g (Ounce)', price: 220 }
            ];
        }
    } else {
        // Revert to Standard if they were using the auto-populated flower tiers and switch away
        if (isFlowerTiers) {
            newSizes = [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0 }];
        }
    }

    setUpdatedItem({ ...updatedItem, mainCategory: newMain, subCategory: newSub, sizes: newSizes });
  };

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
  const isFlower = activeMainCat === 'Flower & Plants';
  const isVape = activeMainCat === 'Vapes & Pens';
  const isMerch = activeMainCat === 'Merch & Extras';
  
  const showVariants = !isFlower && !isMerch;
  const showDNA = !isVape && !isMerch; 

  const ItemIcon = updatedItem.iconName === 'Leaf' ? Leaf : updatedItem.iconName === 'Flame' ? Flame : updatedItem.iconName === 'Box' ? Box : ImageIcon;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-white pb-32 animate-in fade-in duration-500">
      
      {/* STICKY TOP HEADER */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden text-zinc-500">
             {updatedItem.iconUrl ? <img src={updatedItem.iconUrl} alt="icon" className="w-full h-full object-cover" /> : updatedItem.imageUrl ? <img src={updatedItem.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <ItemIcon size={20} />}
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-100 leading-tight flex items-center gap-3">
               {isAdding ? "New Vault Entry" : updatedItem.name || "Unnamed Product"}
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
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">ID: {updatedItem.id}</p>
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
              
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                 <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Product Graphic</label>
                   <div 
                     className={`w-full aspect-square bg-zinc-950 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-colors cursor-pointer relative overflow-hidden group ${dragActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                     onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                     onClick={() => fileInputRef.current?.click()}
                   >
                      {updatedItem.imageUrl && <img src={updatedItem.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                         {isUploadingMain ? <UploadCloud size={24} className="text-cyan-400 animate-bounce" /> : <ImageIcon size={24} className={updatedItem.imageUrl ? "text-zinc-100" : "text-zinc-600"} />}
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{isUploadingMain ? 'Uploading...' : 'Tap or Drop'}</span>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], 'main');}} className="hidden" accept="image/*" />
                   </div>
                 </div>

                 <div className="pt-4 border-t border-zinc-800/50">
                   <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Brand Stamp / Icon</label>
                   <div className="flex items-center gap-4">
                     <div 
                       className="w-16 h-16 bg-zinc-950 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-full flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative overflow-hidden group shrink-0"
                       onClick={() => iconInputRef.current?.click()}
                     >
                        {updatedItem.iconUrl && <img src={updatedItem.iconUrl} alt="stamp" className="absolute inset-0 w-full h-full object-cover" />}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                           {isUploadingIcon ? <UploadCloud size={16} className="text-emerald-400 animate-bounce" /> : (!updatedItem.iconUrl && <ImageIcon size={16} className="text-zinc-600" />)}
                        </div>
                        <input type="file" ref={iconInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], 'icon');}} className="hidden" accept="image/*" />
                     </div>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase leading-tight">Upload a square image to render as a floating badge.</p>
                   </div>
                 </div>
              </div>

              <div className="flex-1 space-y-5">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Product Name *</label>
                     <input type="text" value={updatedItem.name} onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Brand / Maker</label>
                     <input type="text" value={updatedItem.brand || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, brand: e.target.value })} className="w-full bg-zinc-950 border border-emerald-500/30 rounded-xl p-3.5 text-sm font-bold text-emerald-400 focus:border-emerald-500 outline-none transition-colors" />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Main Category</label>
                     <select value={updatedItem.mainCategory} onChange={(e) => handleCategoryChange('mainCategory', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                       {mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sub Category</label>
                     <select value={updatedItem.subCategory} onChange={(e) => handleCategoryChange('subCategory', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                       {subCategories[updatedItem.mainCategory]?.map((s:string)=><option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}
                     </select>
                   </div>
                 </div>

                 {/* DYNAMIC: Unit Pricing Input (Hidden for Flower which uses Tiers) */}
                 {!isFlower && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-zinc-800/50">
                     <div>
                       <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 block">Standard Unit Price</label>
                       <div className="relative">
                         <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                         <input 
                           type="number" 
                           value={updatedItem.sizes[0]?.price || ''} 
                           onChange={(e) => {
                              const newSizes = [...updatedItem.sizes];
                              if (newSizes.length > 0) newSizes[0].price = Number(e.target.value) || 0;
                              else newSizes.push({ id: `sz-${Date.now()}`, label: 'Standard', price: Number(e.target.value) || 0 });
                              setUpdatedItem({...updatedItem, sizes: newSizes});
                           }}
                           className="w-full bg-zinc-950 border border-amber-500/30 rounded-xl py-3 pl-8 pr-4 text-sm font-mono font-bold text-amber-400 focus:border-amber-500 outline-none" 
                         />
                       </div>
                       <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Flat rate for this product.</p>
                     </div>
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* SECTION 2: PRODUCT DNA & DESCRIPTION */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <BookText size={16} className="text-emerald-400" /> {showDNA ? 'Product DNA & Description' : 'Product Description'}
           </h2>
           
           <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Main Description</label>
                <textarea value={updatedItem.descBase} onChange={(e) => setUpdatedItem({ ...updatedItem, descBase: e.target.value })} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-300 focus:border-emerald-500/50 outline-none transition-colors resize-none" />
              </div>
              
              {/* DYNAMIC: Hide detailed DNA mapping for Disposables/Merch */}
              {showDNA && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="relative">
                      <Wind size={14} className="absolute left-3 top-10 text-cyan-400" />
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Feels</label>
                      <input type="text" value={updatedItem.descFeels} onChange={(e) => setUpdatedItem({ ...updatedItem, descFeels: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                    </div>
                    <div className="relative">
                      <Cookie size={14} className="absolute left-3 top-10 text-amber-400" />
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Taste</label>
                      <input type="text" value={updatedItem.descTaste} onChange={(e) => setUpdatedItem({ ...updatedItem, descTaste: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                    </div>
                    <div className="relative">
                      <Droplet size={14} className="absolute left-3 top-10 text-emerald-400" />
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Uses</label>
                      <input type="text" value={updatedItem.descUses} onChange={(e) => setUpdatedItem({ ...updatedItem, descUses: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                    </div>
                  </div>

                  <div className="relative">
                    <Sparkles size={14} className="absolute left-3 top-10 text-amber-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Insider Fact</label>
                    <input type="text" value={updatedItem.descFact} onChange={(e) => setUpdatedItem({ ...updatedItem, descFact: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                </>
              )}

              {/* DYNAMIC: Unlocked Lineage for Vapes & Concentrates so they show on Card Front */}
              {!isMerch && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl mt-2">
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Lineage / Cross / Strain Detail</label>
                     <input type="text" value={updatedItem.lineage} onChange={(e) => setUpdatedItem({ ...updatedItem, lineage: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" placeholder="e.g. Gelato × Zkittlez" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Genetics Type</label>
                     <select value={updatedItem.strainType} onChange={(e) => setUpdatedItem({ ...updatedItem, strainType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none">
                       {['Sativa', 'Indica', 'Hybrid', 'Sativa Dom Hybrid', 'Indica Dom Hybrid', 'CBD', 'N/A'].map((st:string)=><option key={st} value={st}>{st}</option>)}
                     </select>
                   </div>
                </div>
              )}
           </div>
        </section>

        {/* SECTION 3: WEIGHT TIERS & PRICING (FLOWER ONLY) */}
        {isFlower && (
          <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
               <span className="flex items-center gap-2"><DollarSign size={16} className="text-amber-400" /> Weight Tiers & Pricing</span>
               <button onClick={handleAddSize} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Tier</button>
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {updatedItem.sizes.map((size: any) => (
                 <div key={size.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                   <button onClick={() => handleRemoveSize(size.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                   <div>
                     <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Label</label>
                     <input type="text" value={size.label} onChange={(e) => handleSizeChange(size.id, 'label', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold text-zinc-300 outline-none" />
                   </div>
                   <div>
                     <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1 block">Base Price</label>
                     <input type="number" value={size.price} onChange={(e) => handleSizeChange(size.id, 'price', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-mono font-bold text-amber-400 outline-none" />
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* SECTION 4: VARIANTS & OPTIONS OR GLOBAL STOCK */}
        {showVariants && (
          <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
               <span className="flex items-center gap-2"><Boxes size={16} className="text-indigo-400" /> Variants & Flavors</span>
               <button onClick={handleAddOption} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Variant</button>
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {updatedItem.options.map((opt: any) => (
                 <div key={opt.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                   <button onClick={() => handleRemoveOption(opt.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                   <div>
                     <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Flavor / Name</label>
                     <input type="text" value={opt.label} onChange={(e) => handleOptionChange(opt.id, 'label', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold text-zinc-300 outline-none" />
                   </div>
                   <div>
                     <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Stock</label>
                     <input type="number" value={opt.stock} onChange={(e) => handleOptionChange(opt.id, 'stock', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono font-bold text-indigo-400 outline-none" />
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}
        
        {!showVariants && (
           <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
               <Boxes size={16} className="text-indigo-400" /> Global Vault Stock
             </h2>
             <div>
               <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Total Stock (Units)</label>
               <input type="number" value={updatedItem.onHand} onChange={(e) => setUpdatedItem({ ...updatedItem, onHand: Number(e.target.value) || 0 })} className="w-full bg-zinc-950 border border-indigo-500/30 rounded-xl p-3.5 text-sm font-mono font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-colors" />
             </div>
           </section>
        )}

        {/* SECTION 5: MERCHANDISING & CAMPAIGN TOGGLE */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <TicketPercent size={16} className="text-pink-400" /> Merchandising & Campaigns
           </h2>
           
           <div className="flex flex-wrap gap-4 mb-8">
              <button onClick={()=>setUpdatedItem({...updatedItem, isTopShelf: !updatedItem.isTopShelf})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isTopShelf ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'}`}><Award size={16}/> Top Shelf / Reserve</button>
              <button onClick={()=>setUpdatedItem({...updatedItem, featured: !updatedItem.featured})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.featured ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-400'}`}><Star size={16}/> Featured Drop</button>
           </div>

           <div className={`border rounded-2xl p-5 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${updatedItem.dailyDeal ? 'bg-pink-500/5 border-pink-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setUpdatedItem({ ...updatedItem, dailyDeal: !updatedItem.dailyDeal, dealType: !updatedItem.dailyDeal ? 'One-Shot' : 'None' })} 
                  className={`w-12 h-6 rounded-full relative transition-colors ${updatedItem.dailyDeal ? 'bg-pink-500' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${updatedItem.dailyDeal ? 'left-7' : 'left-1'}`} />
                </button>
                <div>
                  <h4 className={`text-sm font-black uppercase tracking-widest ${updatedItem.dailyDeal ? 'text-pink-400' : 'text-zinc-400'}`}>
                    Active Campaign
                  </h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {updatedItem.dailyDeal ? 'Deal is live on the storefront' : 'No active campaigns'}
                  </p>
                </div>
              </div>
              
              {updatedItem.dailyDeal && openCampaignConfig && (
                <button 
                  onClick={(e) => { e.preventDefault(); openCampaignConfig(updatedItem); }} 
                  className="bg-zinc-900 hover:bg-pink-500 hover:text-zinc-950 text-pink-400 border border-pink-500/50 px-4 py-3 sm:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Configure Strategy
                </button>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}