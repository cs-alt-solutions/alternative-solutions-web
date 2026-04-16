import React, { useState } from 'react';
import { Tag, X, Plus, Scale, GripVertical, Activity, CloudLightning } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function AdminInventoryCategoryManager({ 
  clientConfig, // Allows us to target the correct database row
  mainCategories, 
  subCategories, setSubCategories, 
  standardTiers, setStandardTiers, 
  setNotification, onClose 
}: any) {
  
  const [newSubCatName, setNewSubCatName] = useState('');
  const [selectedMainCatForNewSub, setSelectedMainCatForNewSub] = useState(mainCategories[0]);
  const [newTierName, setNewTierName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // --- DRAG AND DROP STATE ---
  const [draggedItem, setDraggedItem] = useState<{ cat: string, index: number } | null>(null);

  // --- NEW: PUSH TO SUPABASE ---
  const handlePublishToDatabase = async () => {
    setIsPublishing(true);
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Fallback to 'division' if clientConfig isn't explicitly passed down yet
        const clientId = clientConfig?.id || 'division';

        // 1. Fetch current settings to merge
        const { data, error } = await supabase.from('client_settings').select('payload').eq('client_id', clientId).single();
        const currentPayload = data?.payload || {};
        
        // 2. Overwrite with the newly ordered subcategories and tiers
        const updatedPayload = { 
            ...currentPayload, 
            subCategories: subCategories,
            pricingTiers: standardTiers // Saves pricing tiers to DB as well
        };

        // 3. Push to DB
        const { error: updateError } = await supabase.from('client_settings').update({ 
            payload: updatedPayload,
            updated_at: new Date().toISOString()
        }).eq('client_id', clientId);

        if (updateError) throw updateError;
        setNotification("Categories & Tiers Published to Live Storefront!");
    } catch (err) {
        console.error("Publish Error:", err);
        setNotification("Failed to publish to database.");
    } finally {
        setIsPublishing(false);
    }
  };

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

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, cat: string, index: number) => {
    setDraggedItem({ cat, index });
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnter = (e: React.DragEvent, cat: string, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.cat !== cat) return;
    if (draggedItem.index === targetIndex) return;

    const currentList = [...subCategories[cat]];
    const draggedElement = currentList[draggedItem.index];

    currentList.splice(draggedItem.index, 1);
    currentList.splice(targetIndex, 0, draggedElement);

    setSubCategories({ ...subCategories, [cat]: currentList });
    setDraggedItem({ cat, index: targetIndex });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
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
    <div className="p-4 md:p-8 animate-in slide-in-from-right-8 space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-white uppercase tracking-tight">Database Settings</h2>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Map Categories & Tiers</p>
        </div>
        <div className="flex items-center gap-4">
           {/* THE NEW PUBLISH BUTTON */}
           <button 
              onClick={handlePublishToDatabase}
              disabled={isPublishing}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
           >
              {isPublishing ? <Activity size={16} className="animate-spin" /> : <CloudLightning size={16} />} 
              {isPublishing ? 'Syncing...' : 'Publish to Live'}
           </button>
           <button onClick={onClose} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg active:scale-95"><X size={20}/></button>
        </div>
      </div>

      {/* SECTION 1: SUBCATEGORIES */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Tag size={16} /> Global Subcategories
        </h3>
        <p className="text-xs font-medium text-zinc-500 mb-6 pb-4 border-b border-zinc-800/50 italic">
          Map your sub-classes here. <span className="text-zinc-300 font-bold">Drag and drop the pills to set the exact order they will appear on your storefront.</span>
        </p>

        <form onSubmit={handleAddSubCategory} className="flex flex-col md:flex-row gap-3 mb-8">
          <select value={selectedMainCatForNewSub} onChange={(e) => setSelectedMainCatForNewSub(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none appearance-none">
            {mainCategories.map((mc: string) => <option key={mc} value={mc}>{mc}</option>)}
          </select>
          <input type="text" value={newSubCatName} onChange={(e) => setNewSubCatName(e.target.value)} placeholder="New Subcategory Name..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50 transition-colors" />
          <button type="submit" disabled={!newSubCatName.trim()} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 md:py-0 rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95"><Plus size={18} /> Map</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainCategories.map((mainCat: string) => {
            const subs = subCategories[mainCat] || [];
            return (
              <div key={mainCat} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-inner">
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 border-b border-zinc-800/50 pb-2 flex justify-between">
                  {mainCat} <span className="text-zinc-600">{subs.length} Subs</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subs.map((sub: string, index: number) => (
                    <div 
                      key={sub} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, mainCat, index)}
                      onDragEnter={(e) => handleDragEnter(e, mainCat, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-bold pl-2 pr-3 py-1.5 rounded-lg flex items-center gap-2 group hover:border-emerald-500/50 transition-all cursor-grab active:cursor-grabbing select-none"
                    >
                      <GripVertical size={12} className="text-zinc-600 group-hover:text-emerald-500/80" />
                      {sub} 
                      <button onClick={() => handleRemoveSubCategory(mainCat, sub)} className="text-zinc-600 hover:text-rose-500 ml-1"><X size={12}/></button>
                    </div>
                  ))}
                  {subs.length === 0 && (
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic py-1">No subs mapped</span>
                  )}
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
          <input type="text" value={newTierName} onChange={(e) => setNewTierName(e.target.value)} placeholder="e.g. 3.5g (Eighth) or 100mg Pack..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-amber-500/50 transition-colors" />
          <button type="submit" disabled={!newTierName.trim()} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-widest px-6 py-4 md:py-0 rounded-xl disabled:opacity-50 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95"><Plus size={18} /> Add Tier</button>
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