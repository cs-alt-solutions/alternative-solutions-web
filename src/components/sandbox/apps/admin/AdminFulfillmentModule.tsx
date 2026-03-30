import React, { useState, useMemo } from 'react';
import { Edit3, Plus, Boxes, Tag, Filter, Star, Package } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import AdminInventoryCategoryManager, { MAIN_CATEGORIES } from './AdminInventoryCategoryManager';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor'; // <--- UPDATED PATH

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  const defaultSubCats = {
    'Flower & Plants': ['Premium Flower', 'Pre-Rolls & Blunts', 'Trees & Plants', 'Featured Brands'],
    'Vapes & Pens': ['Disposables', '510 Cartridges'],
    'Edibles': ['Gummies & Candies', 'Baked Goods & Snacks', 'Infused Beverages', "Mrs. Doob's Fun Food", "Mrs. Doob's Drinks"],
    'Concentrates': ['Wax & Dabs', 'Rosin & Resin'],
    'Merch & Extras': ['Apparel & Gear', 'Healthcare & Topicals', 'Accessories']
  };
  const [subCategories, setSubCategories] = useStickyState<Record<string, string[]>>(defaultSubCats, `inv_subcats_v2_${clientConfig?.id || 'dev'}`);
  
  const defaultTiers = ['1g', '3.5g (Eighth)', '7g (Quarter)', '14g (Half Oz)', '28g (Full Oz)', '1 Cartridge', '2g Disposable', '100mg Pack', '250mg Pack', '1 Unit', 'Single'];
  const [standardTiers, setStandardTiers] = useStickyState<string[]>(defaultTiers, `inv_tiers_v2_${clientConfig?.id || 'dev'}`);

  const [activeFilter, setActiveFilter] = useState('All');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);

  const filteredMatrix = useMemo(() => {
    if (activeFilter === 'All') return inventoryMatrix;
    return inventoryMatrix.filter((item: any) => item.mainCategory === activeFilter);
  }, [inventoryMatrix, activeFilter]);

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', 
    lineage: '', strainType: 'N/A', 
    descBase: '', descFeels: '', descTaste: '', descUses: '', descFact: '',
    mainCategory: MAIN_CATEGORIES[0], 
    subCategory: subCategories[MAIN_CATEGORIES[0]]?.[0] || 'Uncategorized',
    price: 0, onHand: 0, featured: false, isTopShelf: false, dailyDeal: false,
    dealType: 'Daily Deal', dealText: '', dealDays: [], iconName: 'Leaf', options: [], 
    sizes: [
      { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 35.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
      { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
      { id: `sz-${Date.now()}-3`, label: '14g (Half Oz)', price: 100.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
      { id: `sz-${Date.now()}-4`, label: '28g (Full Oz)', price: 200.00, bundleQty: 1, promoLabel: '', promoPrice: '' }
    ] 
  });

  const openEditor = (item?: any) => {
    if (item) {
      const defaultSizes = item.sizes && item.sizes.length > 0 ? item.sizes.map((s: any) => ({ ...s, promoLabel: s.promoLabel || '', promoPrice: s.promoPrice ?? '' })) : [{ id: `sz-${Date.now()}`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
      
      let descBase = ''; let descFeels = ''; let descTaste = ''; let descUses = ''; let descFact = '';
      if (item.description) {
         const feelsMatch = item.description.match(/Feels:\s*([^.]*)/i);
         const tasteMatch = item.description.match(/Taste:\s*([^.]*)/i);
         const usesMatch = item.description.match(/Uses:\s*([^.]*)/i);
         const factMatch = item.description.match(/Fun Fact:\s*(.*)/i);
         
         descBase = item.description.split(/(Feels:|Taste:|Uses:|Fun Fact:)/i)[0].trim();
         descFeels = feelsMatch ? feelsMatch[1].trim() : '';
         descTaste = tasteMatch ? tasteMatch[1].trim() : '';
         descUses = usesMatch ? usesMatch[1].trim() : '';
         descFact = factMatch ? factMatch[1].trim() : '';
      }

      setEditingItem({ 
        ...getBlankItem(), ...item, 
        sizes: defaultSizes, 
        name: item.name || '', 
        lineage: item.lineage || '', 
        strainType: item.strainType || 'N/A',
        descBase, descFeels, descTaste, descUses, descFact, 
        mainCategory: item.mainCategory || MAIN_CATEGORIES[0], subCategory: item.subCategory || item.category || 'Uncategorized', 
        dealType: item.dealType || 'Daily Deal', dealText: item.dealText || '', dealDays: item.dealDays || [] 
      });
      setIsAdding(false);
    } else {
      setEditingItem(getBlankItem());
      setIsAdding(true);
    }
  };

  const handleSaveProduct = (itemToSave: any, isNew: boolean) => {
    setStock((prev: any[]) => isNew ? [itemToSave, ...prev] : prev.map((item: any) => item.id === itemToSave.id ? itemToSave : item));
    setNotification(isNew ? `Added: ${itemToSave.name}` : `Updated: ${itemToSave.name}`);
    setEditingItem(null);
    setIsAdding(false);
  };

  const groupedItems = MAIN_CATEGORIES.map(cat => ({ category: cat, items: filteredMatrix.filter((i: any) => i.mainCategory === cat) })).filter(group => group.items.length > 0);
  const assignedIds = new Set(groupedItems.flatMap(g => g.items.map((i:any) => i.id)));
  const unassignedItems = filteredMatrix.filter((i: any) => !assignedIds.has(i.id));
  if (unassignedItems.length > 0) groupedItems.push({ category: 'Other / Uncategorized', items: unassignedItems });

  if (isManagingCats) {
    return <AdminInventoryCategoryManager 
      subCategories={subCategories} setSubCategories={setSubCategories} 
      standardTiers={standardTiers} setStandardTiers={setStandardTiers}
      setNotification={setNotification} onClose={() => setIsManagingCats(false)} 
    />;
  }
  
  if (editingItem) {
    return <AdminInventoryEditor 
      initialItem={editingItem} isAdding={isAdding} 
      subCategories={subCategories} standardTiers={standardTiers}
      onSave={handleSaveProduct} onCancel={() => { setEditingItem(null); setIsAdding(false); }} 
    />;
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 text-amber-400 shadow-lg"><Boxes size={32} /></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Master Vault</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Device-Secured Database <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsManagingCats(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all flex items-center gap-2 shadow-lg hover:border-amber-500/30">
            <Tag size={16} /> Map Settings
          </button>
          <button onClick={() => openEditor()} className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-6 mb-8 border-b border-zinc-800/50">
        <Filter size={14} className="text-zinc-600 shrink-0 mr-2" />
        <button onClick={() => setActiveFilter('All')} className={`shrink-0 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'All' ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>All Items ({inventoryMatrix.length})</button>
        {MAIN_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`shrink-0 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
            {cat} ({inventoryMatrix.filter((i: any) => i.mainCategory === cat).length})
          </button>
        ))}
      </div>

      <div className="space-y-12 pb-12">
        {groupedItems.map((group) => (
          <div key={group.category} className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-800/50 pb-3">
               <h3 className="text-xl font-black text-zinc-100 uppercase tracking-widest">{group.category}</h3>
               <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{group.items.length} Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.items.map((item: any) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-4xl p-6 flex flex-col relative group hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 h-full">
                  <button onClick={() => openEditor(item)} className="absolute top-5 right-5 p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-amber-400 hover:border-amber-400/50 transition-all z-10 shadow-lg"><Edit3 size={18} /></button>
                  <div className="flex flex-wrap items-center gap-2 mb-4 pr-12">
                    <span className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-inner">{item.subCategory || 'General'}</span>
                    {item.isTopShelf && <span className="text-amber-400 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"><Star size={10} className="fill-current"/> Top Shelf</span>}
                    {item.featured && <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Star size={10} className="fill-current"/> Featured</span>}
                  </div>
                  <h3 className={`font-black text-xl leading-tight mb-8 ${item.isTopShelf ? 'text-amber-400' : 'text-zinc-100'} group-hover:translate-x-1 transition-transform`}>{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center items-center shadow-inner text-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5"><Package size={10} /> Stock</span>
                      <span className={`text-2xl font-black leading-none ${item.onHand <= 0 ? 'text-rose-500' : 'text-emerald-400'}`}>{item.onHand}{item.mainCategory === 'Flower & Plants' ? 'g' : ''}</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center items-center shadow-inner text-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5"><Tag size={10} /> Base</span>
                      <span className="text-2xl font-black leading-none text-zinc-300 font-mono">${item.price?.toFixed(0) || '0'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}