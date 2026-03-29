/* src/components/sandbox/apps/admin/AdminInventoryModule.tsx */
import React, { useState, useMemo } from 'react';
import { Edit3, X, Save, Plus, Trash2, Boxes, Tag, Filter, Flame, Star, Calendar, Package, Award, Gauge } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

const MAIN_CATEGORIES = ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
const DAYS_OF_WEEK = [
  { label: 'Sun', val: 0 }, { label: 'Mon', val: 1 }, { label: 'Tue', val: 2 }, 
  { label: 'Wed', val: 3 }, { label: 'Thu', val: 4 }, { label: 'Fri', val: 5 }, { label: 'Sat', val: 6 }
];

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  const defaultSubCats = {
    'Flower & Plants': ['Premium Flower', 'Pre-Rolls & Blunts', 'Trees & Plants', 'Featured Brands'],
    'Vapes & Pens': ['Disposables', '510 Cartridges'],
    'Edibles': ['Gummies & Candies', 'Baked Goods & Snacks', 'Infused Beverages', "Mrs. Doob's Fun Food", "Mrs. Doob's Drinks"],
    'Concentrates': ['Wax & Dabs', 'Rosin & Resin'],
    'Merch & Extras': ['Apparel & Gear', 'Healthcare & Topicals', 'Accessories']
  };
  const [subCategories, setSubCategories] = useStickyState<Record<string, string[]>>(defaultSubCats, `inv_subcats_v2_${clientConfig?.id || 'dev'}`);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);
  
  const [newSubCatName, setNewSubCatName] = useState('');
  const [selectedMainCatForNewSub, setSelectedMainCatForNewSub] = useState(MAIN_CATEGORIES[0]);

  const filteredMatrix = useMemo(() => {
    if (activeFilter === 'All') return inventoryMatrix;
    return inventoryMatrix.filter((item: any) => item.mainCategory === activeFilter);
  }, [inventoryMatrix, activeFilter]);

  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = newSubCatName.trim();
    if (!sub) return;
    const currentList = subCategories[selectedMainCatForNewSub] || [];
    if (currentList.includes(sub)) {
      setNotification(`Subcategory already exists in ${selectedMainCatForNewSub}!`);
      return;
    }
    setNotification(`Added "${sub}" under ${selectedMainCatForNewSub}`);
    setSubCategories({ ...subCategories, [selectedMainCatForNewSub]: [...currentList, sub] });
    setNewSubCatName('');
  };

  const handleRemoveSubCategory = (mainCat: string, subToRemove: string) => {
    setSubCategories((prev: any) => ({ ...prev, [mainCat]: prev[mainCat].filter((s: string) => s !== subToRemove) }));
    setNotification(`Removed Subcategory: ${subToRemove}`);
  };

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', 
    description: '',
    mainCategory: MAIN_CATEGORIES[0], 
    subCategory: subCategories[MAIN_CATEGORIES[0]]?.[0] || 'Uncategorized',
    price: 0, 
    onHand: 0, 
    featured: false, 
    isTopShelf: false,
    dailyDeal: false,
    dealType: 'Daily Deal', 
    dealText: '', 
    dealDays: [],
    iconName: 'Leaf', 
    options: [], 
    sizes: [] 
  });

  const openEditor = (item?: any) => {
    if (item) {
      const defaultSizes = item.sizes && item.sizes.length > 0 
        ? item.sizes.map((s: any) => ({
            ...s,
            promoLabel: s.promoLabel || '',
            promoPrice: s.promoPrice ?? ''
          }))
        : [{ id: `sz-${Date.now()}`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
      
      setEditingItem({ 
        ...getBlankItem(),
        ...item, 
        sizes: defaultSizes,
        name: item.name || '',
        description: item.description || '',
        mainCategory: item.mainCategory || MAIN_CATEGORIES[0], 
        subCategory: item.subCategory || item.category || 'Uncategorized',
        dealType: item.dealType || 'Daily Deal', 
        dealText: item.dealText || '', 
        dealDays: item.dealDays || []
      });
      setIsAdding(false);
    } else {
      setEditingItem(getBlankItem());
      setIsAdding(true);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const hasVariants = editingItem.options && editingItem.options.length > 0;
    
    // Gram-Based Calculation for Flower vs Unit-Based for Merch
    const isFlower = editingItem.mainCategory === 'Flower & Plants';
    const totalStock = hasVariants 
        ? editingItem.options.reduce((sum: number, opt: any) => sum + (parseFloat(opt.stock) || 0), 0) 
        : (parseFloat(editingItem.onHand) || 0);

    const finalOptions = hasVariants ? editingItem.options : [{ id: 'std', label: 'Standard', stock: totalStock }];
    const finalSizes = editingItem.sizes && editingItem.sizes.length > 0 ? editingItem.sizes : [{ id: 'std', label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
    const basePrice = Math.min(...finalSizes.map((s: any) => s.price));

    const itemToSave = {
      ...editingItem, 
      price: basePrice, 
      onHand: totalStock, 
      options: finalOptions, 
      sizes: finalSizes,
      dealText: editingItem.dailyDeal ? editingItem.dealText : '',
      dealDays: editingItem.dailyDeal && editingItem.dealType === 'Weekly Special' ? editingItem.dealDays : []
    };

    setStock((prev: any[]) => isAdding ? [itemToSave, ...prev] : prev.map((item: any) => item.id === itemToSave.id ? itemToSave : item));
    setNotification(isAdding ? `Added: ${itemToSave.name}` : `Updated: ${itemToSave.name}`);
    setEditingItem(null);
    setIsAdding(false);
  };

  const addVariantRow = () => { setEditingItem({ ...editingItem, options: [...(editingItem.options || []), { id: `var-${Date.now()}`, label: '', stock: '' }] }); };
  const updateVariant = (id: string, field: 'label' | 'stock', value: any) => { setEditingItem({ ...editingItem, options: editingItem.options.map((opt: any) => opt.id === id ? { ...opt, [field]: value } : opt) }); };
  const removeVariantRow = (id: string) => { setEditingItem({ ...editingItem, options: editingItem.options.filter((opt: any) => opt.id !== id) }); };
  const addSizeRow = () => { setEditingItem({ ...editingItem, sizes: [...(editingItem.sizes || []), { id: `sz-${Date.now()}`, label: '', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }] }); };
  const updateSize = (id: string, field: 'label' | 'price' | 'bundleQty' | 'promoLabel' | 'promoPrice', value: any) => { setEditingItem({ ...editingItem, sizes: editingItem.sizes.map((sz: any) => sz.id === id ? { ...sz, [field]: value } : sz) }); };
  const removeSizeRow = (id: string) => { setEditingItem({ ...editingItem, sizes: editingItem.sizes.filter((sz: any) => sz.id !== id) }); };

  if (isManagingCats) {
    return (
      <div className="p-4 md:p-8 animate-in slide-in-from-right-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2"><Tag size={20} className="text-amber-400"/> Map Subcategories</h2>
          <button onClick={() => setIsManagingCats(false)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg"><X size={20}/></button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <form onSubmit={handleAddSubCategory} className="flex flex-col md:flex-row gap-3 mb-8">
            <select value={selectedMainCatForNewSub} onChange={(e) => setSelectedMainCatForNewSub(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none">
              {MAIN_CATEGORIES.map(mc => <option key={mc} value={mc}>{mc}</option>)}
            </select>
            <input type="text" value={newSubCatName} onChange={(e) => setNewSubCatName(e.target.value)} placeholder="New Subcategory Name..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none" />
            <button type="submit" disabled={!newSubCatName.trim()} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 md:py-0 rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Map</button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MAIN_CATEGORIES.map(mainCat => {
              const subs = subCategories[mainCat] || [];
              return (
                <div key={mainCat} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-inner">
                  <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 border-b border-zinc-800/50 pb-2 flex justify-between">
                    {mainCat} <span className="text-zinc-600">{subs.length} Subs</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subs.map(sub => (
                      <div key={sub} className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 group hover:border-rose-500/50 transition-all">
                        {sub} <button onClick={() => handleRemoveSubCategory(mainCat, sub)} className="text-zinc-600 hover:text-rose-500"><X size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (editingItem) {
    const hasVariants = editingItem.options && editingItem.options.length > 0;
    const currentSubCats = subCategories[editingItem.mainCategory] || [];
    const isFlower = editingItem.mainCategory === 'Flower & Plants';

    return (
      <div className="p-4 md:p-8 animate-in slide-in-from-right-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2"><Edit3 size={20} className="text-emerald-400"/> {isAdding ? 'Inject New Asset' : 'Refine Database Entry'}</h2>
          <button onClick={() => { setEditingItem(null); setIsAdding(false); }} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSaveProduct} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 space-y-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
               <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Product Name</label>
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none shadow-inner" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Internal Description / Sensory Profile</label>
                <textarea value={editingItem.description} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm font-medium outline-none shadow-inner h-32 resize-none" placeholder="Feels: Uplifting, Taste: Earthy..." />
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 p-6 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Parent Category</label>
                  <select value={editingItem.mainCategory} onChange={(e) => setEditingItem({...editingItem, mainCategory: e.target.value, subCategory: subCategories[e.target.value]?.[0] || ''})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-emerald-400 font-bold outline-none appearance-none">
                    {MAIN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2 text-right">Subcategory</label>
                  <select value={editingItem.subCategory} onChange={(e) => setEditingItem({...editingItem, subCategory: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none">
                    {currentSubCats.map(sub => <option key={sub} value={sub}>{sub}</option>)}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-zinc-800 pt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Pricing Tiers / Weights</label>
                <button type="button" onClick={addSizeRow} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10"><Plus size={14} /> Add Tier</button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {editingItem.sizes.map((sz: any) => (
                  <div key={sz.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
                    <div className="flex gap-2">
                      <input type="text" value={sz.label} onChange={(e) => updateSize(sz.id, 'label', e.target.value)} placeholder="e.g. 3.5g (Eighth)" className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white font-bold outline-none" />
                      <div className="relative w-24">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600 uppercase">$</span>
                        <input type="number" step="0.01" value={sz.price} onChange={(e) => updateSize(sz.id, 'price', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 pl-8 text-sm text-white font-bold outline-none text-center" />
                      </div>
                      <button type="button" onClick={() => removeSizeRow(sz.id)} className="p-4 text-zinc-700 hover:text-rose-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                    {isFlower ? 'Total Raw Grams by Strain' : 'Unit Inventory by Variant'}
                </label>
                <button type="button" onClick={addVariantRow} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10"><Plus size={14} /> Add Strain</button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {editingItem.options.map((opt: any) => (
                  <div key={opt.id} className="flex gap-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
                    <input type="text" value={opt.label} onChange={(e) => updateVariant(opt.id, 'label', e.target.value)} placeholder="Strain Name..." className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white font-medium outline-none" />
                    <div className="relative w-32">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase">
                        {isFlower ? 'Grams' : 'Qty'}
                      </span>
                      <input type="number" step="0.1" value={opt.stock} onChange={(e) => updateVariant(opt.id, 'stock', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 pl-14 text-sm text-white font-bold outline-none text-center" />
                    </div>
                    <button type="button" onClick={() => removeVariantRow(opt.id)} className="p-4 text-zinc-700 hover:text-rose-500"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 flex items-center justify-between bg-zinc-950 -mx-8 -mb-8 p-8 rounded-b-[2rem] shadow-inner">
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

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 text-amber-400 shadow-lg"><Boxes size={32} /></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Master Vault</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Device-Secured Database <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsManagingCats(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all flex items-center gap-2 shadow-lg hover:border-amber-500/30">
            <Tag size={16} /> Map Categories
          </button>
          <button onClick={() => openEditor()} className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-6 mb-6 border-b border-zinc-800/50">
        <Filter size={14} className="text-zinc-600 shrink-0 mr-2" />
        <button onClick={() => setActiveFilter('All')} className={`shrink-0 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeFilter === 'All' ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
          All Items ({inventoryMatrix.length})
        </button>
        {MAIN_CATEGORIES.map(cat => {
          const count = inventoryMatrix.filter((i: any) => i.mainCategory === cat).length;
          return (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`shrink-0 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMatrix.map((item: any) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col relative group hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 h-full">
            <button onClick={() => openEditor(item)} className="absolute top-5 right-5 p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-amber-400 hover:border-amber-400/50 transition-all z-10 shadow-lg">
              <Edit3 size={18} />
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-4 pr-12">
              <span className="text-[9px] font-black text-amber-500/70 uppercase tracking-widest">{item.mainCategory}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">{item.subCategory || 'General'}</span>
            </div>
            <h3 className={`font-black text-lg leading-tight mb-6 ${item.isTopShelf ? 'text-amber-400' : 'text-zinc-100'} group-hover:translate-x-1 transition-transform`}>{item.name}</h3>
            <div className="grid grid-cols-2 gap-3 mt-auto mb-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col shadow-inner">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5"><Package size={10} /> Stock</span>
                <span className={`text-xl font-black leading-none ${item.onHand <= 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {item.onHand}{item.mainCategory === 'Flower & Plants' ? 'g' : ''}
                </span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col shadow-inner">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1.5"><Tag size={10} /> Base</span>
                <span className="text-xl font-black leading-none text-zinc-300 font-mono">${item.price?.toFixed(0) || '0'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}