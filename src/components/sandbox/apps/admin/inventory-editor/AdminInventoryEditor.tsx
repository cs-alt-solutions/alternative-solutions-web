'use client';

import React, { useState, useMemo, useRef } from 'react';
import { X, Trash2, Tag, BookText, Scale, Package, Boxes, Star, Leaf, Flame, Box, Image as ImageIcon, Sparkles, MapPin, Search, ChevronRight, UploadCloud, FileType, FileUp, AlertTriangle, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const FormCard = ({ title, icon: Icon, children, colorClass }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-inner animate-in fade-in slide-in-from-bottom-2">
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border ${colorClass}`}>
      <Icon size={14} /> {title}
    </div>
    {children}
  </div>
);

const PriceTierPill = ({ label, onRemove }: any) => (
  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-400 pl-3 pr-1 py-1 rounded-full text-xs font-bold shadow-md">
    {label}
    <button onClick={onRemove} className="p-1 rounded-full text-zinc-600 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
      <X size={14} />
    </button>
  </div>
);

const ProductSearchModal = ({ inventoryMatrix, onClose, onSelect }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return (inventoryMatrix || []).filter((item: any) => 
      item.name?.toLowerCase().includes(lowerSearch) || 
      item.id?.toLowerCase().includes(lowerSearch)
    ).slice(0, 10);
  }, [inventoryMatrix, searchTerm]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-600 hover:text-rose-400"><X size={20} /></button>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Link to Master Vault Product</h3>
        <p className="text-xs text-zinc-500 mb-6 font-medium leading-relaxed">Search for an existing product to auto-fill metadata. This establishes a master inventory link.</p>
        
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input type="text" value={searchTerm} autoFocus onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Product Name or System ID..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700 focus:border-amber-500/50" />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-1">
          {filteredProducts.map((item: any) => {
            const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
            return (
              <button key={item.id} onClick={() => onSelect(item)} className="w-full flex items-center justify-between p-4 bg-zinc-950 hover:bg-zinc-800/50 border border-zinc-800 rounded-2xl transition-all group/item shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-700 shrink-0 group-hover/item:border-amber-500/30">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" /> : <ItemIcon size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-zinc-100">{item.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">{item.id}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-600 group-hover/item:text-amber-400 transition-colors" />
              </button>
            );
          })}
          {filteredProducts.length === 0 && (searchTerm.trim() !== "") && (
            <div className="text-center py-10">
               <span className="text-sm font-bold text-zinc-600">No results found for "{searchTerm}"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminInventoryEditor({ initialItem, isAdding, mainCategories, subCategories, standardTiers, onSave, onCancel, inventoryMatrix, client_id, setNotification }: any) {
  const cid = client_id;
  
  const [updatedItem, setUpdatedItem] = useState({ 
    ...initialItem, 
    sizes: initialItem.sizes || [] 
  });
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [newSizeTier, setNewSizeTier] = useState(standardTiers[0] || '');

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file || !cid || !updatedItem.id) return;
    
    setIsUploading(true);
    if (setNotification) setNotification("Preparing asset push...");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fileExt = file.name.split('.').pop();
      const filename = `${cid}/inventory/${updatedItem.id}-v${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('client-assets')
        .upload(filename, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage
        .from('client-assets')
        .getPublicUrl(filename);

      setUpdatedItem((prev: any) => ({ ...prev, imageUrl: publicUrl }));
      if (setNotification) setNotification(`Image Uploaded! Synced to Vault.`);

    } catch (err) {
      console.error("Asset Upload Error:", err);
      if (setNotification) setNotification("Image upload failed. See console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else setDragActive(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); };

  const addSize = () => {
    if (newSizeTier && !updatedItem.sizes.some((s: any) => s.label === newSizeTier)) {
      setUpdatedItem((prev: any) => ({
        ...prev,
        sizes: [...prev.sizes, { id: `sz-${Date.now()}`, label: newSizeTier, price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }]
      }));
    }
  };

  const removeSize = (id: string) => { setUpdatedItem((prev: any) => ({ ...prev, sizes: prev.sizes.filter((s: any) => s.id !== id) })); };
  const handleSizeChange = (id: string, field: string, value: any) => { setUpdatedItem((prev: any) => ({ ...prev, sizes: prev.sizes.map((s: any) => s.id === id ? { ...s, [field]: field === 'label' ? value : Number(value) || 0 } : s) })); };
  const handleSave = () => { onSave(updatedItem, isAdding); };

  let HeaderIcon = ImageIcon;
  let statusText = "Ready for Market";
  let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let titleGradient = "from-amber-400 via-zinc-100 to-amber-500";

  if (!updatedItem.name || !updatedItem.imageUrl || (updatedItem.mainCategory === 'Flower & Plants' && updatedItem.sizes.length === 0)) {
     HeaderIcon = AlertTriangle;
     statusText = "Needs Critical Data";
     statusColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";
     titleGradient = "from-rose-400 via-zinc-100 to-rose-500";
  } else if (isAdding) {
     statusText = "Drafting New Product";
     statusColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
     titleGradient = "from-cyan-400 via-zinc-100 to-cyan-500";
  }
  const ItemIcon = updatedItem.iconName === 'Leaf' ? Leaf : updatedItem.iconName === 'Flame' ? Flame : updatedItem.iconName === 'Box' ? Box : ImageIcon;

  return (
    <div className="p-4 md:p-8 space-y-8 selection:bg-amber-500/30 selection:text-white pb-32 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-10 border-b border-zinc-800/50">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 shadow-inner group overflow-hidden relative">
             {updatedItem.imageUrl ? (
                <img src={updatedItem.imageUrl} alt={updatedItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             ) : (
                <ItemIcon size={32} />
             )}
             {updatedItem.dailyDeal && <Flame size={16} className="absolute top-2 right-2 text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" />}
             {updatedItem.isTopShelf && <Sparkles size={16} className="absolute bottom-2 left-2 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />}
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColor}`}>
               <HeaderIcon size={12} /> {statusText}
             </div>
             <h1 className={`text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r ${titleGradient}`}>
                {isAdding ? (updatedItem.name || "Drafting Product") : `Editing: ${updatedItem.name}`}
             </h1>
             <div className="flex items-center gap-2 font-mono text-zinc-600 text-xs font-bold uppercase tracking-wider">
               <span>ID: {updatedItem.id}</span>
               {isAdding && <span className="text-zinc-800">• Generated from Master Vault Template</span>}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-2">
          {!isAdding && <button onClick={() => setShowSearchModal(true)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-black px-6 py-3 rounded-2xl text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"><Search size={16} /> Link Vault</button>}
          <button onClick={onCancel} className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-500 font-black px-6 py-3 rounded-2xl text-[11px] uppercase tracking-widest transition-all">Cancel</button>
          <button onClick={handleSave} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-6 py-3 rounded-2xl text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 shadow-[0_5px_15px_rgba(251,191,36,0.2)]">Save Changes <ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <FormCard title="Product Metadata" icon={Tag} colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
          <div className="space-y-4">
            <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Product Name *</label><input type="text" value={updatedItem.name} onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })} placeholder="e.g. Doobie Division (Top Shelf)" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700" /></div>
            <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Main Category</label><select value={updatedItem.mainCategory} onChange={(e) => setUpdatedItem({ ...updatedItem, mainCategory: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700">{mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Sub Category</label><select value={updatedItem.subCategory} onChange={(e) => setUpdatedItem({ ...updatedItem, subCategory: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700">{subCategories[updatedItem.mainCategory]?.map((s:string)=><option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}</select></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Icon Graphic</label><select value={updatedItem.iconName} onChange={(e) => setUpdatedItem({ ...updatedItem, iconName: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100">{['Leaf', 'Flame', 'Box', 'ImageIcon'].map((ic:string)=><option key={ic} value={ic}>{ic}</option>)}</select></div>
              <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Base Price ($)</label><input type="number" value={updatedItem.price} onChange={(e) => setUpdatedItem({ ...updatedItem, price: Number(e.target.value) })} placeholder="0.00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700" /></div>
            </div>
            {updatedItem.mainCategory === 'Flower & Plants' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 shadow-inner">
                <div><label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 block">Lineage/Strains</label><input type="text" value={updatedItem.lineage} onChange={(e) => setUpdatedItem({ ...updatedItem, lineage: e.target.value })} placeholder="e.g. Wedding Cake x Cherry Pie" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100" /></div>
                <div><label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 block">Strain Type</label><select value={updatedItem.strainType} onChange={(e) => setUpdatedItem({ ...updatedItem, strainType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100">{['Sativa', 'Indica', 'Hybrid', 'CBD', 'N/A'].map((st:string)=><option key={st} value={st}>{st}</option>)}</select></div>
              </div>
            )}
          </div>
        </FormCard>

        <FormCard title="Visuals & Marketing" icon={ImageIcon} colorClass="bg-amber-500/10 text-amber-400 border-amber-500/30">
          <div className="space-y-6">
            
            <div className={`bg-zinc-950 border-2 border-dashed rounded-3xl p-6 shadow-inner relative transition-colors duration-300 ${dragActive ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-800'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
               <div className="flex flex-col items-center justify-center text-center gap-4">
                  {isUploading ? (
                     <div className="flex flex-col items-center gap-3 py-6 text-zinc-600 animate-pulse">
                        <UploadCloud size={40} />
                        <span className="text-xs font-black tracking-widest uppercase">Beaming to Storage...</span>
                     </div>
                  ) : (
                     <>
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-amber-400 shadow-lg"><FileUp size={28} /></div>
                        <div>
                           <h4 className="font-bold text-sm text-zinc-100 mb-1">Direct Upload / Sync</h4>
                           <p className="text-xs text-zinc-600 leading-relaxed font-medium">Drag & Drop an image here, or use the button below. Supabase handles the canonical naming.</p>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 font-black px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 shadow-md flex items-center gap-1.5"><FileType size={14} /> Browse Files</button>
                     </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);}} className="hidden" accept="image/*" />
               </div>
            </div>

            <div className="w-px h-6 bg-zinc-800 mx-auto hidden md:block" />

            <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner group overflow-hidden relative">
               <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 shrink-0 shadow-md group overflow-hidden relative">
                  {updatedItem.imageUrl ? <img src={updatedItem.imageUrl} alt={updatedItem.name} className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
               </div>
               <div>
                  <h4 className="font-bold text-xs text-zinc-100 mb-0.5">Primary Graphic</h4>
                  <p className="font-medium text-[9px] text-zinc-600 font-mono tracking-wider break-all leading-tight bg-zinc-900 px-1 py-0.5 rounded-sm inline-block">{(updatedItem.imageUrl || 'No Image Link')}</p>
               </div>
               {!isAdding && <button onClick={() => setShowSearchModal(true)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-amber-400 hover:border-amber-400/50 rounded-lg shadow-inner"><Search size={14}/></button>}
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
               <h3 className="text-cyan-400 font-black uppercase tracking-widest text-[11px] mb-5 flex items-center gap-2 relative z-10"><Sparkles size={14} /> Marketing Boosts</h3>
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3"><input type="checkbox" checked={updatedItem.isTopShelf} onChange={(e) => setUpdatedItem({ ...updatedItem, isTopShelf: e.target.checked })} className="w-4 h-4 rounded-sm border-2 border-zinc-800 bg-zinc-950 accent-amber-500 focus:ring-amber-500/50" /><div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs"><Sparkles size={14} /> Top Shelf Product</div></div>
                  <div className="flex items-center gap-3"><input type="checkbox" checked={updatedItem.featured} onChange={(e) => setUpdatedItem({ ...updatedItem, featured: e.target.checked })} className="w-4 h-4 rounded-sm border-2 border-zinc-800 bg-zinc-950 accent-cyan-500 focus:ring-cyan-500/50" /><div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs"><Star size={14} /> Featured on Main Catalog</div></div>
                  <div className="flex items-center gap-3"><input type="checkbox" checked={updatedItem.dailyDeal} onChange={(e) => setUpdatedItem({ ...updatedItem, dailyDeal: e.target.checked })} className="w-4 h-4 rounded-sm border-2 border-zinc-800 bg-zinc-950 accent-rose-500 focus:ring-rose-500/50" /><div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs"><Flame size={14} /> Active Promo / Daily Deal</div></div>
               </div>
            </div>
          </div>
        </FormCard>

        {updatedItem.mainCategory === 'Flower & Plants' && (
          <FormCard title="Flower Sizes & Pricing" icon={Scale} colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 col-span-1 md:col-span-2 lg:col-span-1">
             <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-inner mb-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2"><Plus size={14} /> Add New Price Tier</h4>
               <div className="flex items-center gap-3">
                 <select value={newSizeTier} onChange={(e) => setNewSizeTier(e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-zinc-100">{standardTiers.map((t:string)=><option key={t} value={t}>{t}</option>)}</select>
                 <button onClick={addSize} className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5 active:scale-95"><Leaf size={14}/> Add Size</button>
               </div>
             </div>
             
             <div className="space-y-4">
               {updatedItem.sizes.map((size: any) => (
                 <div key={size.id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 animate-in slide-in-from-top-2 relative group overflow-hidden">
                    <button onClick={() => removeSize(size.id)} className="absolute top-3.5 right-3.5 p-1 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-rose-400 rounded-lg shadow-inner"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                       <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Tier Label</label><input type="text" value={size.label} onChange={(e) => handleSizeChange(size.id, 'label', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] font-bold text-zinc-100" /></div>
                       <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Price ($) *</label><input type="number" value={size.price} onChange={(e) => handleSizeChange(size.id, 'price', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] font-bold text-amber-300 font-mono shadow-inner" /></div>
                       <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Bundle Qty (g)</label><input type="number" value={size.bundleQty} onChange={(e) => handleSizeChange(size.id, 'bundleQty', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[11px] font-bold text-zinc-100 font-mono" /></div>
                    </div>
                 </div>
               ))}
               {updatedItem.sizes.length === 0 && (
                 <div className="text-center py-12 bg-zinc-950/20 border border-dashed border-zinc-800 rounded-2xl">
                   <AlertTriangle size={24} className="text-zinc-600 mb-3 mx-auto" />
                   <p className="text-sm font-bold text-zinc-600">No price tiers defined.</p>
                   <p className="text-xs text-zinc-700 mt-1">Add a size from the panel above to begin pricing.</p>
                 </div>
               )}
             </div>
          </FormCard>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6">
         <FormCard title="Product Description Blocks" icon={BookText} colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
           <div className="space-y-4">
             <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Base Description</label><textarea value={updatedItem.descBase} onChange={(e) => setUpdatedItem({ ...updatedItem, descBase: e.target.value })} placeholder="Core marketing details..." rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700 resize-none" /></div>
             <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Effects (Feels)</label><textarea value={updatedItem.descFeels} onChange={(e) => setUpdatedItem({ ...updatedItem, descFeels: e.target.value })} placeholder="Creative, Relaxed, Uplifted..." rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700 resize-none" /></div>
             <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Taste/Aroma Profile</label><input type="text" value={updatedItem.descTaste} onChange={(e) => setUpdatedItem({ ...updatedItem, descTaste: e.target.value })} placeholder="Sweet, Berry, Earthy..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700" /></div>
             <div><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Fun Fact/Trivia</label><input type="text" value={updatedItem.descFact} onChange={(e) => setUpdatedItem({ ...updatedItem, descFact: e.target.value })} placeholder="FUN FACT: Originally from Alt Sol Biz..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100 placeholder:text-zinc-700" /></div>
           </div>
         </FormCard>
         
         <FormCard title="Stock & Delivery SOP" icon={Boxes} colorClass="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <div className="space-y-4 p-5 bg-zinc-950 rounded-2xl border border-zinc-800 mb-6">
                <div><label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 block">Global Stock (onHand/g) *</label><input type="number" value={updatedItem.onHand} onChange={(e) => setUpdatedItem({ ...updatedItem, onHand: Number(e.target.value) })} placeholder="0.0" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-100" /></div>
                <div><label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 block">Stock committed to pending orders (calculated)</label><div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-600 font-mono tracking-wider">{(updatedItem.committed || 0)}g Committed</div></div>
            </div>
            
            <div className="bg-zinc-950/80 border border-rose-800 rounded-2xl p-5 shadow-inner">
               <h3 className="text-rose-400 font-black uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2 relative z-10"><MapPin size={14} /> The Vault Rules (from Market Policies)</h3>
               <ul className="text-xs text-rose-300 font-medium space-y-3">
                  <li className="flex gap-2 items-start"><span className="text-rose-600 mt-1.5">•</span> <span>NO meetups. Delivery to residential addresses ONLY. Minimum order requirements apply based on location. The system will notify you during checkout. Access codes are strictly for verified members. Sharing codes with unverified individuals will result in permanent removal. Minimum order requirements apply based on your location.</span></li>
               </ul>
            </div>
         </FormCard>
      </div>

      {showSearchModal && <ProductSearchModal inventoryMatrix={inventoryMatrix} onClose={() => setShowSearchModal(false)} onSelect={(item: any) => { setUpdatedItem({ ...item, sizes: item.sizes || [] }); setShowSearchModal(false); if (setNotification) setNotification(`Loaded template for ${item.name}`); }} />}
    </div>
  );
}