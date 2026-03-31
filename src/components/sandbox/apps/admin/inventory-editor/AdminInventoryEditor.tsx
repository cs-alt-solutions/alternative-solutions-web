import React, { useState } from 'react';
import { Edit3, X, Save, Plus, Trash2, Flame, Star, Award, Gauge, Sparkles, Wind, Dna, Activity, Target, Lightbulb } from 'lucide-react';
import VariantsManager from './VariantsManager';

const DAYS_OF_WEEK = [
  { label: 'Sun', val: 0 }, { label: 'Mon', val: 1 }, { label: 'Tue', val: 2 }, 
  { label: 'Wed', val: 3 }, { label: 'Thu', val: 4 }, { label: 'Fri', val: 5 }, { label: 'Sat', val: 6 }
];

// FIXED: Added mainCategories to the props
export default function AdminInventoryEditor({ initialItem, isAdding, subCategories, standardTiers, onSave, onCancel, mainCategories }: any) {
  
  // Safety fallback just in case the config hasn't loaded yet
  const safeMainCats = mainCategories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];

  const [editingItem, setEditingItem] = useState<any>(() => {
    const item = { ...initialItem };
    item.options = (item.options || []).map((opt: any) => {
        let strains = [{ name: opt.label || '', type: opt.strainType || 'N/A' }];
        if (opt.label && opt.label.includes(' x ')) {
            const names = opt.label.split(' x ');
            const types = (opt.strainType || '').split(' / ');
            strains = names.map((n: string, i: number) => ({ name: n.trim(), type: types[i]?.trim() || 'N/A' }));
        }
        return { ...opt, strains };
    });
    return item;
  });

  const addSizeRow = () => { setEditingItem({ ...editingItem, sizes: [...(editingItem.sizes || []), { id: `sz-${Date.now()}`, label: '', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }] }); };
  const updateSize = (id: string, field: 'label' | 'price' | 'bundleQty' | 'promoLabel' | 'promoPrice', value: any) => { setEditingItem({ ...editingItem, sizes: editingItem.sizes.map((sz: any) => sz.id === id ? { ...sz, [field]: value } : sz) }); };
  const removeSizeRow = (id: string) => { setEditingItem({ ...editingItem, sizes: editingItem.sizes.filter((sz: any) => sz.id !== id) }); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasVariants = editingItem.options && editingItem.options.length > 0;
    
    const totalStock = hasVariants 
        ? editingItem.options.reduce((sum: number, opt: any) => sum + (parseFloat(opt.stock) || 0), 0) 
        : (parseFloat(editingItem.onHand) || 0);

    const finalOptions = hasVariants ? editingItem.options.map((opt: any) => {
        const label = opt.strains?.map((s:any)=>s.name).filter(Boolean).join(' x ') || opt.label;
        const strainType = opt.strains?.map((s:any)=>s.type).join(' / ') || opt.strainType;
        return { id: opt.id, stock: parseFloat(opt.stock) || 0, label, strainType };
    }) : [{ id: 'std', label: 'Standard', stock: totalStock, strainType: 'N/A' }];

    const finalSizes = editingItem.sizes && editingItem.sizes.length > 0 ? editingItem.sizes : [{ id: 'std', label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
    const basePrice = Math.min(...finalSizes.map((s: any) => s.price));

    const cleanStr = (str: string) => str ? str.trim().replace(/\.$/, '') : '';
    
    const parts = [];
    if (editingItem.descBase) parts.push(editingItem.descBase.trim());
    if (editingItem.descFeels) parts.push(`Feels: ${cleanStr(editingItem.descFeels)}.`);
    if (editingItem.descTaste) parts.push(`Taste: ${cleanStr(editingItem.descTaste)}.`);
    if (editingItem.descUses) parts.push(`Uses: ${cleanStr(editingItem.descUses)}.`);
    if (editingItem.descFact) parts.push(`Fun Fact: ${cleanStr(editingItem.descFact)}.`);
    
    let builtDescription = parts.join(' ');
    
    if (editingItem.lineage) {
        const lin = cleanStr(editingItem.lineage);
        builtDescription = `${lin}. ${builtDescription}`;
    }

    const itemToSave = {
      ...editingItem, 
      price: basePrice, 
      onHand: totalStock, 
      options: finalOptions, 
      sizes: finalSizes,
      description: builtDescription.trim(),
      lineage: editingItem.lineage,
      strainType: editingItem.strainType,
      dealText: editingItem.dailyDeal ? editingItem.dealText : '',
      dealDays: editingItem.dailyDeal && editingItem.dealType === 'Weekly Special' ? editingItem.dealDays : []
    };

    onSave(itemToSave, isAdding);
  };

  const hasVariants = editingItem.options && editingItem.options.length > 0;
  const currentSubCats = subCategories[editingItem.mainCategory] || [];
  const isFlower = editingItem.mainCategory === 'Flower & Plants';

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-right-8">
      
      <datalist id="standard-tiers-list">
         {(standardTiers || []).map((t: string) => <option key={t} value={t} />)}
      </datalist>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2"><Edit3 size={20} className="text-emerald-400"/> {isAdding ? 'Inject New Asset' : 'Refine Database Entry'}</h2>
        <button onClick={onCancel} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg"><X size={20}/></button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-4xl p-8 space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
             
             <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Product Name</label>
              <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none shadow-inner focus:border-emerald-500/50" required />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Dna size={12}/> Lineage / Genetics</label>
                <input type="text" value={editingItem.lineage} onChange={(e) => setEditingItem({...editingItem, lineage: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none shadow-inner focus:border-emerald-500/50" placeholder="e.g. Zkittlez x Gelato" />
               </div>
               <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Activity size={12}/> Dominance / Type</label>
                <select value={editingItem.strainType} onChange={(e) => setEditingItem({...editingItem, strainType: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none shadow-inner focus:border-emerald-500/50">
                   <option value="N/A">N/A / None</option>
                   <option value="Indica">Indica</option>
                   <option value="Sativa">Sativa</option>
                   <option value="Hybrid">Hybrid</option>
                   <option value="Indica-Dom">Indica-Dom</option>
                   <option value="Sativa-Dom">Sativa-Dom</option>
                </select>
               </div>
             </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-inner space-y-4">
              <div>
                <label className="text-[10px] font-black text-amber-500/70 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Lightbulb size={12} className="text-amber-400"/> Fun Fact / Story</label>
                <textarea value={editingItem.descFact} onChange={(e) => setEditingItem({...editingItem, descFact: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-sm font-medium outline-none h-20 resize-none focus:border-amber-500/50 transition-colors" placeholder="e.g. High settles in with a mellow onset..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-cyan-500/70 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Sparkles size={12} className="text-cyan-400"/> Feels / Effects</label>
                  <input type="text" value={editingItem.descFeels} onChange={(e) => setEditingItem({...editingItem, descFeels: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-cyan-500/50 transition-colors" placeholder="e.g. Uplifting, Euphoric..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Wind size={12} className="text-emerald-400"/> Taste / Aroma</label>
                  <input type="text" value={editingItem.descTaste} onChange={(e) => setEditingItem({...editingItem, descTaste: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-emerald-500/50 transition-colors" placeholder="e.g. Earthy, Pine, Sweet..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-[10px] font-black text-fuchsia-500/70 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Target size={12} className="text-fuchsia-400"/> Uses / Best For</label>
                  <input type="text" value={editingItem.descUses} onChange={(e) => setEditingItem({...editingItem, descUses: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-fuchsia-500/50 transition-colors" placeholder="e.g. Sleep, Recovery, Focus..." />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-2"> Brief Marketing Copy</label>
                  <input type="text" value={editingItem.descBase} onChange={(e) => setEditingItem({...editingItem, descBase: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-zinc-500/50 transition-colors" placeholder="e.g. Award winning strain..." />
                </div>
              </div>
            </div>

          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Parent Category</label>
                <select 
                  value={editingItem.mainCategory} 
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const newSub = subCategories[newCat]?.[0] || '';
                    let newSizes = editingItem.sizes;
                    let newOptions = editingItem.options;
                    
                    if (newCat === 'Flower & Plants') {
                        newSizes = [
                          { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 35.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
                          { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
                          { id: `sz-${Date.now()}-3`, label: '14g (Half Oz)', price: 100.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
                          { id: `sz-${Date.now()}-4`, label: '28g (Full Oz)', price: 200.00, bundleQty: 1, promoLabel: '', promoPrice: '' }
                        ];
                    } else if (newCat === 'Vapes & Pens') {
                        newSizes = [
                          { id: `sz-${Date.now()}-1`, label: '1 Unit', price: 40.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
                          { id: `sz-${Date.now()}-2`, label: '2 Unit Deal', price: 70.00, bundleQty: 2, promoLabel: '2 for 70', promoPrice: 70.00 }
                        ];
                        newOptions = [
                          { id: `var-${Date.now()}-1`, strains: [{ name: '', type: 'Indica' }], stock: '' },
                          { id: `var-${Date.now()}-2`, strains: [{ name: '', type: 'Sativa' }], stock: '' },
                          { id: `var-${Date.now()}-3`, strains: [{ name: '', type: 'Hybrid' }], stock: '' }
                        ];
                    } else if (editingItem.mainCategory === 'Flower & Plants' || editingItem.mainCategory === 'Vapes & Pens') {
                        newSizes = [{ id: `sz-${Date.now()}`, label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
                        newOptions = [{ id: `var-${Date.now()}`, strains: [{ name: '', type: 'N/A' }], stock: '' }];
                    }

                    setEditingItem({
                      ...editingItem, 
                      mainCategory: newCat, 
                      subCategory: newSub,
                      sizes: newSizes,
                      options: newOptions
                    });
                  }} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-emerald-400 font-bold outline-none appearance-none"
                >
                  {/* FIXED: Using safeMainCats prop instead of hardcoded import */}
                  {safeMainCats.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                </select>

              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2 text-right">Subcategory</label>
                <select value={editingItem.subCategory} onChange={(e) => setEditingItem({...editingItem, subCategory: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none">
                  {currentSubCats.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl cursor-pointer hover:border-cyan-500/50 transition-all shadow-inner">
              <input type="checkbox" checked={editingItem.featured} onChange={(e) => setEditingItem({...editingItem, featured: e.target.checked})} className="w-5 h-5 accent-cyan-500" />
              <span className="text-sm font-black text-white flex items-center gap-2"><Star size={14} className="text-cyan-400" /> Featured Drop</span>
            </label>
            <label className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-all shadow-inner">
              <input type="checkbox" checked={editingItem.isTopShelf} onChange={(e) => setEditingItem({...editingItem, isTopShelf: e.target.checked})} className="w-5 h-5 accent-amber-500" />
              <span className="text-sm font-black text-white flex items-center gap-2"><Award size={14} className="text-amber-400" /> Top Shelf</span>
            </label>
            <label className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl cursor-pointer hover:border-rose-500/50 transition-all shadow-inner">
              <input type="checkbox" checked={editingItem.dailyDeal} onChange={(e) => setEditingItem({...editingItem, dailyDeal: e.target.checked})} className="w-5 h-5 accent-rose-500" />
              <span className="text-sm font-black text-white flex items-center gap-2"><Flame size={14} className="text-rose-400" /> Active Promo</span>
            </label>
          </div>

          {editingItem.dailyDeal && (
            <div className="mt-6 bg-zinc-950/80 border border-rose-500/30 p-6 rounded-2xl animate-in slide-in-from-top-4 shadow-[0_0_20px_rgba(244,63,94,0.05)]">
              <div className="flex justify-between items-center mb-5">
                <label className="text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-2"><Flame size={14}/> Promo Configuration</label>
                <select value={editingItem.dealType || 'Daily Deal'} onChange={(e) => setEditingItem({...editingItem, dealType: e.target.value})} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold py-2 px-3 rounded-lg outline-none focus:border-rose-500/50">
                  <option value="Daily Deal">Standard Daily Deal</option>
                  <option value="Weekly Special">Weekly Special</option>
                </select>
              </div>

              {editingItem.dealType === 'Weekly Special' && (
                <div className="mb-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Active Days</label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map((dayStr, idx) => {
                       const isActive = editingItem.dealDays?.includes(idx);
                       return (
                         <button type="button" key={idx} onClick={() => {
                             const currentDays = editingItem.dealDays || [];
                             const newDays = isActive ? currentDays.filter((d:number) => d !== idx) : [...currentDays, idx];
                             setEditingItem({...editingItem, dealDays: newDays});
                           }}
                           className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${isActive ? 'bg-rose-500 text-zinc-950 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-rose-500/30'}`}
                         >
                           {dayStr.label}
                         </button>
                       );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Banner Message</label>
                <input type="text" placeholder="e.g. 5g Get 1g FREE!" value={editingItem.dealText || ''} onChange={(e) => setEditingItem({...editingItem, dealText: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm font-medium p-3.5 rounded-xl outline-none focus:border-rose-500/50 transition-colors shadow-inner" />
              </div>
              
              <div className="pt-5 border-t border-rose-500/10 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-3">Pricing Overrides</label>
                {editingItem.sizes.map((sz: any, idx: number) => (
                   <div key={sz.id} className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 shadow-inner">
                     <span className="text-xs font-bold text-zinc-400 w-24 truncate px-2" title={sz.label}>{sz.label}</span>
                     <input type="text" placeholder="Promo Label (e.g. 5+1)" value={sz.promoLabel || ''} onChange={(e) => updateSize(sz.id, 'promoLabel', e.target.value)} className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 text-sm font-medium text-zinc-100 p-2.5 rounded-lg outline-none focus:border-rose-500/50" />
                     <div className="relative w-32 shrink-0">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-rose-500/50 uppercase">$</span>
                       <input type="number" step="0.01" placeholder="Price" value={sz.promoPrice !== undefined ? sz.promoPrice : ''} onChange={(e) => updateSize(sz.id, 'promoPrice', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 text-sm font-black text-rose-400 p-2.5 pl-7 pr-3 text-right rounded-lg outline-none font-mono focus:border-rose-500/50" />
                     </div>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-zinc-800 pt-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Pricing Tiers / Weights</label>
              <button type="button" onClick={addSizeRow} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10"><Plus size={14} /> Add Tier</button>
            </div>
            
            <div className="space-y-4">
              {editingItem.sizes.map((sz: any) => (
                <div key={sz.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      list="standard-tiers-list"
                      value={sz.label} 
                      onChange={(e) => updateSize(sz.id, 'label', e.target.value)} 
                      placeholder="Select or Type (e.g. 3.5g)" 
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white font-bold outline-none cursor-pointer focus:border-emerald-500/50 transition-colors" 
                    />
                    
                    <div className="relative w-32 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600 uppercase">$</span>
                      <input type="number" step="0.01" value={sz.price} onChange={(e) => updateSize(sz.id, 'price', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 pl-8 pr-4 text-sm text-white font-bold outline-none text-right" />
                    </div>
                    
                    <button type="button" onClick={() => removeSizeRow(sz.id)} className="p-4 text-zinc-700 hover:text-rose-500"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <VariantsManager editingItem={editingItem} setEditingItem={setEditingItem} isFlower={isFlower} />
          
        </div>

        <div className="border-t border-zinc-800 pt-8 flex items-center justify-between bg-zinc-950 -mx-8 -mb-8 p-8 rounded-b-4xl shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Total Master Stock</span>
            <span className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <Gauge size={20} className="text-zinc-700" />
              {hasVariants ? editingItem.options.reduce((sum: number, opt: any) => sum + (parseFloat(opt.stock) || 0), 0) : (parseFloat(editingItem.onHand) || 0)} 
              <span className="text-xs text-zinc-500 font-bold ml-1 uppercase">{isFlower ? 'Grams Available' : 'Units Total'}</span>
            </span>
          </div>
          <button type="submit" disabled={editingItem.sizes.length === 0} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-5 px-12 rounded-2xl disabled:opacity-50 transition-all shadow-xl active:scale-95 flex items-center gap-3">
            <Save size={20} /> Commit to Vault
          </button>
        </div>
      </form>
    </div>
  );
}