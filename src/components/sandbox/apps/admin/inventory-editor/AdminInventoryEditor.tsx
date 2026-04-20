// sandbox/apps/admin/inventory-editor/AdminInventoryEditor.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Save, Image as ImageIcon, Leaf, Flame, Box, Lock } from 'lucide-react';
import { supabase } from '@/utils/supabase'; 

import EditorIdentity from './components/EditorIdentity';
import EditorDNA from './components/EditorDNA';
import EditorCommerce from './components/EditorCommerce';

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
  const [descMode, setDescMode] = useState<'desc' | 'fact'>('desc');

  // MASTER LOCK STATE: Secures the "Nuke" button from accidental employee clicks.
  const [isMasterUnlocked, setIsMasterUnlocked] = useState(false);

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
        
        options: Array.isArray(initialItem.options) ? initialItem.options.map((opt: any) => {
            if (opt.strains && opt.strains.length > 0) {
               return { id: opt.id, stock: opt.stock, label: opt.label, strains: opt.strains };
            }

            const labelParts = (opt.label || '').split(/\s*(?:\/|\+)\s*/);
            const parsedStrains = labelParts.map((part: string) => {
                let name = part;
                let type = 'N/A';
                const match = part.match(/^(.*?)\s*\(\s*(Indica|Sativa|Hybrid|Indica Dom Hybrid|Sativa Dom Hybrid|CBD)\s*\)$/i);
                if (match) {
                    name = match[1].trim();
                    type = match[2];
                    if (type.toLowerCase() === 'sativa') type = 'Sativa';
                    else if (type.toLowerCase() === 'indica') type = 'Indica';
                    else if (type.toLowerCase() === 'hybrid') type = 'Hybrid';
                    else if (type.toLowerCase() === 'sativa dom hybrid') type = 'Sativa Dom Hybrid';
                    else if (type.toLowerCase() === 'indica dom hybrid') type = 'Indica Dom Hybrid';
                    else if (type.toLowerCase() === 'cbd') type = 'CBD';
                }
                return { name, type, lineage: '' };
            });
            
            return { 
              id: opt.id, 
              stock: opt.stock, 
              label: opt.label,
              strains: parsedStrains.length > 0 ? parsedStrains : [{ name: '', type: 'N/A', lineage: '' }] 
            };
        }) : []
      });

      setDescMode((initialItem.descFact && !initialItem.descBase) ? 'fact' : 'desc');

    } else if (isAdding) {
      const defaultMain = initialItem?.mainCategory || mainCategories[0];
      const defaultSub = initialItem?.subCategory || subCategories[defaultMain]?.[0] || 'Uncategorized';
      
      const isFlowerCat = defaultMain === 'Flower & Prerolls';
      const isPreRollCat = defaultSub.toLowerCase().includes('pre-roll') || defaultSub.toLowerCase().includes('blunt');
      const isRawFlower = isFlowerCat && !isPreRollCat;
      
      let initialSizes = [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0 }];
      
      if (isRawFlower) {
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

      setDescMode(isRawFlower ? 'fact' : 'desc');
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
      if (setNotification) setNotification(`${type === 'main' ? 'Image' : 'Stamp'} Synced to Warehouse.`);
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
    
    const isFlowerCat = newMain === 'Flower & Prerolls';
    const isPreRollCat = newSub.toLowerCase().includes('pre-roll') || newSub.toLowerCase().includes('blunt');
    const isRawFlowerCat = isFlowerCat && !isPreRollCat;

    const isStandard = newSizes.length === 1 && newSizes[0].label === 'Standard';
    const isFlowerTiers = newSizes.length === 4 && newSizes[0].label === '3.5g (Eighth)';

    if (isRawFlowerCat) {
        if (isStandard || (isAdding && !isFlowerTiers)) {
            newSizes = [
                { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 40 },
                { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60 },
                { id: `sz-${Date.now()}-3`, label: '14g (Half)', price: 120 },
                { id: `sz-${Date.now()}-4`, label: '28g (Ounce)', price: 220 }
            ];
        }
        setDescMode('fact');
    } else {
        if (isFlowerTiers) {
            newSizes = [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0 }];
        }
        setDescMode('desc');
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

  const handleStrainChange = (optId: string, sIdx: number, field: string, value: string) => {
    setUpdatedItem((prev: any) => ({
       ...prev,
       options: prev.options.map((o: any) => {
           if (o.id === optId) {
               const newStrains = [...o.strains];
               newStrains[sIdx] = { ...newStrains[sIdx], [field]: value };
               return { ...o, strains: newStrains };
           }
           return o;
       })
    }));
  };

  const handleAddStrain = (optId: string) => {
    setUpdatedItem((prev: any) => ({
       ...prev,
       options: prev.options.map((o: any) => {
           if (o.id === optId && o.strains.length < 3) {
               return { ...o, strains: [...o.strains, { name: '', type: 'N/A', lineage: '' }] };
           }
           return o;
       })
    }));
  };

  const handleRemoveStrain = (optId: string, sIdx: number) => {
    setUpdatedItem((prev: any) => ({
       ...prev,
       options: prev.options.map((o: any) => {
           if (o.id === optId) {
               const newStrains = [...o.strains];
               newStrains.splice(sIdx, 1);
               return { ...o, strains: newStrains };
           }
           return o;
       })
    }));
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
      options: [...prev.options, { id: `opt-${Date.now()}`, stock: 0, strains: [{ name: 'New Variant', type: 'N/A', lineage: '' }] }]
    }));
  };

  const handleRemoveOption = (id: string) => {
    setUpdatedItem((prev: any) => ({ ...prev, options: prev.options.filter((o: any) => o.id !== id) }));
  };

  const handleSave = () => { 
    const itemToSave = {
        ...updatedItem,
        options: updatedItem.options.map((opt: any) => {
            const labelParts = opt.strains
                .filter((s: any) => s.name.trim() !== '')
                .map((s: any) => {
                    let cleanLabel = s.name.replace(/\s*\(\s*(Indica|Sativa|Hybrid|Indica Dom Hybrid|Sativa Dom Hybrid|CBD)\s*\)$/i, '').trim();
                    if (s.type && s.type !== 'N/A') {
                        return `${cleanLabel} (${s.type})`;
                    }
                    return cleanLabel;
                });
            
            return { 
               id: opt.id, 
               stock: opt.stock, 
               label: labelParts.join(' / ') || 'Standard',
               strains: opt.strains
            };
        })
    };
    onSave(itemToSave, isAdding); 
  };

  const activeMainCat = updatedItem.mainCategory || '';
  const activeSubCat = (updatedItem.subCategory || '').toLowerCase();
  
  // 🚀 WE CALCULATE THE EDIBLE FLAG HERE
  const isEdible = activeMainCat.toLowerCase().includes('edible');
  
  const isFlowerCat = activeMainCat === 'Flower & Prerolls';
  const isPreRoll = isFlowerCat && (activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt'));
  const isRawFlower = isFlowerCat && !isPreRoll;
  
  const isHardwareOrGear = 
      activeMainCat === 'Merch & Extras' || 
      activeSubCat.includes('batteries') || 
      activeSubCat.includes('hardware') || 
      activeSubCat.includes('gear') || 
      activeSubCat.includes('glass') ||
      activeSubCat.includes('accessories');

  const isTopical = activeMainCat === 'Healthcare & Topicals';
  
  const showVariants = !isRawFlower; 
  const showDNA = !isHardwareOrGear; 
  const showLineage = !isHardwareOrGear && !isTopical;
  const showWeightTiers = isRawFlower;
  const showUnitPrice = !isRawFlower;

  const ItemIcon = updatedItem.iconName === 'Leaf' ? Leaf : updatedItem.iconName === 'Flame' ? Flame : updatedItem.iconName === 'Box' ? Box : ImageIcon;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-white pb-32 animate-in fade-in duration-500">
      
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden text-zinc-500">
             {updatedItem.iconUrl ? <img src={updatedItem.iconUrl} alt="icon" className="w-full h-full object-cover" /> : updatedItem.imageUrl ? <img src={updatedItem.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <ItemIcon size={20} />}
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-100 leading-tight flex items-center gap-3">
               {isAdding ? "New Warehouse Entry" : updatedItem.name || "Unnamed Product"}
               {!isAdding && (
                 isMasterUnlocked ? (
                   isConfirmingDelete ? (
                     <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 p-1 rounded-xl animate-in zoom-in-95">
                        <span className="text-[10px] font-bold text-rose-400 uppercase px-2 tracking-widest">Are you sure?</span>
                        <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1.5 bg-zinc-900 rounded-lg text-zinc-400 text-[10px] uppercase font-black hover:text-zinc-100">Cancel</button>
                        <button onClick={() => onDelete(updatedItem.id)} className="px-3 py-1.5 bg-rose-500 rounded-lg text-zinc-950 text-[10px] uppercase font-black hover:bg-rose-400 flex items-center gap-1 shadow-[0_0_15px_rgba(244,63,94,0.4)]"><Trash2 size={12}/> Confirm Nuke</button>
                     </div>
                   ) : (
                     <button onClick={() => setIsConfirmingDelete(true)} className="bg-zinc-950 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5 opacity-50 hover:opacity-100"><Trash2 size={12} /> Nuke</button>
                   )
                 ) : (
                   <button 
                     onClick={() => setIsMasterUnlocked(true)} 
                     className="bg-zinc-950 border border-zinc-800 text-zinc-600 font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5 hover:text-rose-400 hover:border-rose-500/30 opacity-50 hover:opacity-100"
                     title="Click to Unlock Master Override"
                   >
                     <Lock size={12} /> Locked
                   </button>
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
        <EditorIdentity 
          updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}
          mainCategories={mainCategories} subCategories={subCategories}
          handleCategoryChange={handleCategoryChange} handleFileUpload={handleFileUpload}
          fileInputRef={fileInputRef} iconInputRef={iconInputRef}
          dragActive={dragActive} handleDrag={handleDrag} handleDrop={handleDrop}
          isUploadingMain={isUploadingMain} isUploadingIcon={isUploadingIcon}
          showUnitPrice={showUnitPrice}
        />
        <EditorDNA 
          updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}
          descMode={descMode} setDescMode={setDescMode}
          showDNA={showDNA} showLineage={showLineage}
          isEdible={isEdible} // 🚀 WE PASS IT DOWN HERE
        />
        <EditorCommerce 
          updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}
          handleAddSize={handleAddSize} handleRemoveSize={handleRemoveSize} handleSizeChange={handleSizeChange}
          handleOptionChange={handleOptionChange} handleAddOption={handleAddOption} handleRemoveOption={handleRemoveOption}
          handleStrainChange={handleStrainChange} handleAddStrain={handleAddStrain} handleRemoveStrain={handleRemoveStrain}
          showWeightTiers={showWeightTiers} showVariants={showVariants} openCampaignConfig={openCampaignConfig}
          isHardwareOrGear={isHardwareOrGear}
        />
      </div>
    </div>
  );
}