import React, { useState } from 'react';
import { Tag, X, Plus, Scale } from 'lucide-react';

export const MAIN_CATEGORIES = ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];

export default function AdminInventoryCategoryManager({ 
  subCategories, setSubCategories, 
  standardTiers, setStandardTiers, 
  setNotification, onClose 
}: any) {
  
  // States for Subcategories
  const [newSubCatName, setNewSubCatName] = useState('');
  const [selectedMainCatForNewSub, setSelectedMainCatForNewSub] = useState(MAIN_CATEGORIES[0]);

  // States for Tiers
  const [newTierName, setNewTierName] = useState('');

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

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    const tier = newTierName.trim();
    if (!tier) return;
    if (standardTiers.includes(tier)) {
      setNotification(`Pricing Tier already exists!`);
      return;
    }
    setNotification(`Added Pricing Tier: "${tier}"`);
    setStandardTiers([...standardTiers, tier]);
    setNewTierName('');
  };

  const handleRemoveTier = (tierToRemove: string) => {
    setStandardTiers(standardTiers.filter((t: string) => t !== tierToRemove));
    setNotification(`Removed Tier: ${tierToRemove}`);
  };

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-right-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-white uppercase tracking-tight">Database Settings</h2>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Map Categories & Tiers</p>
        </div>
        <button onClick={onClose} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg"><X size={20}/></button>
      </div>

      {/* SECTION 1: SUBCATEGORIES */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
          <Tag size={16} /> Global Subcategories
        </h3>
        <form onSubmit={handleAddSubCategory} className="flex flex-col md:flex-row gap-3 mb-8">
          <select value={selectedMainCatForNewSub} onChange={(e) => setSelectedMainCatForNewSub(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none">
            {MAIN_CATEGORIES.map(mc => <option key={mc} value={mc}>{mc}</option>)}
          </select>
          <input type="text" value={newSubCatName} onChange={(e) => setNewSubCatName(e.target.value)} placeholder="New Subcategory Name..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none" />
          <button type="submit" disabled={!newSubCatName.trim()} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 md:py-0 rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Map</button>
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
                  {subs.map((sub: string) => (
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

      {/* SECTION 2: PRICING TIERS & WEIGHTS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
          <Scale size={16} /> Global Pricing Tiers & Weights
        </h3>
        <p className="text-xs font-medium text-zinc-500 mb-6 italic">These options will appear as pre-fill dropdowns when building pricing tiers in the Product Editor.</p>

        <form onSubmit={handleAddTier} className="flex flex-col md:flex-row gap-3 mb-8">
          <input type="text" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} placeholder="e.g. 3.5g (Eighth) or 100mg Pack..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none" />
          <button type="submit" disabled={!newTierName.trim()} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 md:py-0 rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Add Tier</button>
        </form>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-inner">
          <div className="flex flex-wrap gap-2">
            {(standardTiers || []).map((tier: string) => (
              <div key={tier} className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 group hover:border-amber-500/50 transition-all">
                {tier} <button onClick={() => handleRemoveTier(tier)} className="text-zinc-600 hover:text-rose-500"><X size={12}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}