'use client';

import React, { useState, useMemo } from 'react';
import { Store, Flame, Award, ChefHat, Star, X, Edit3 } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import { createClient } from '@supabase/supabase-js';

// New Sub-components - Ensure these exist in the /storefront sub-directory
import StorefrontSettings from './storefront/StorefrontSettings';
import CampaignEngine from './storefront/CampaignEngine';
import PromoInsights from './storefront/PromoInsights';

export default function AdminStorefrontModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  // State Initialization
  const [weeklySchedule, setWeeklySchedule] = useStickyState<any>(clientConfig.weeklySchedule || {}, `store_weekly_hours_${clientConfig?.id}`);
  const [shiftChange, setShiftChange] = useStickyState(clientConfig.shiftChange || '12:00', `store_shift_change_${clientConfig?.id}`);
  const [storeOverride, setStoreOverride] = useStickyState('AUTO', `store_override_${clientConfig?.id}`); 
  const [campaignView, setCampaignView] = useState<'LIST' | 'WEEK'>('LIST');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [activeDetailView, setActiveDetailView] = useState<'PROMOS' | 'TOPSHELF' | 'CHEF' | 'FEATURED' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Logic Helpers
  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');
  const mainCategories = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const [subCategories] = useStickyState<Record<string, string[]>>(clientConfig.subCategories || {}, `inv_subcats_v2_${clientConfig?.id || 'division'}`);
  const [standardTiers] = useStickyState<string[]>(clientConfig.pricingTiers || [], `inv_tiers_v2_${clientConfig?.id || 'division'}`);

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', brand: '', lineage: '', strainType: 'Hybrid', 
    descBase: '', descFeels: '', descTaste: '', descUses: '', descFact: '',
    mainCategory: mainCategories[0], subCategory: subCategories[mainCategories[0]]?.[0] || 'Uncategorized',
    price: 0, onHand: 0, featured: false, isTopShelf: false, dailyDeal: false,
    dealType: 'Daily Deal', dealText: '', dealDays: [], iconName: 'Leaf', options: [], 
    sizes: [{ id: `sz-${Date.now()}-1`, label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }] 
  });

  // Handlers
  const openEditor = (item: any) => {
    const defaultSizes = item.sizes && item.sizes.length > 0 
      ? item.sizes.map((s: any) => ({ ...s, promoLabel: s.promoLabel || '', promoPrice: s.promoPrice ?? '' })) 
      : [{ id: `sz-${Date.now()}`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
    
    setEditingItem({ 
      ...getBlankItem(), 
      ...item, 
      sizes: defaultSizes,
      descBase: item.descBase || item.description?.split(/(Feels:|Taste:|Uses:|Fun Fact:)/i)[0].trim() || '',
      descFeels: item.descFeels || '',
      descTaste: item.descTaste || '',
      descUses: item.descUses || '',
      descFact: item.descFact || '',
      mainCategory: item.mainCategory || mainCategories[0], 
      subCategory: item.subCategory || item.category || 'Uncategorized', 
      dealType: item.dealType || 'Daily Deal', 
      dealText: item.dealText || '', 
      dealDays: item.dealDays || [] 
    });
  };

  const handleSaveProduct = async (itemToSave: any) => {
    setStock((prev: any[]) => prev.map((item: any) => item.id === itemToSave.id ? itemToSave : item));
    setEditingItem(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase
        .from('client_inventory')
        .upsert(
          { client_id: clientConfig.id || 'division', item_id: itemToSave.id, payload: itemToSave },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setNotification(`Vault Sync: ${itemToSave.name}`);
    } catch (err) {
      console.error("DB Write Error:", err);
      setNotification(`Failed to save to master database.`);
    }
  };

  const handleDeleteProduct = async (itemId: string) => {
    setStock((prev: any[]) => prev.filter((item: any) => item.id !== itemId));
    setEditingItem(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('client_inventory').delete().match({ client_id: clientConfig.id || 'division', item_id: itemId });
      setNotification(`Product Removed.`);
    } catch (err) {
      console.error("DB Delete Error:", err);
    }
  };

  const handleQuickRemove = async (item: any) => {
    if (!activeDetailView) return;
    const updated = { ...item };
    
    if (activeDetailView === 'PROMOS') { updated.dailyDeal = false; updated.dealType = 'Daily Deal'; }
    if (activeDetailView === 'TOPSHELF' || activeDetailView === 'CHEF') { updated.isTopShelf = false; }
    if (activeDetailView === 'FEATURED') { updated.featured = false; }

    setStock((prev: any[]) => prev.map((i: any) => i.id === updated.id ? updated : i));
    setNotification(`Tag removed.`);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('client_inventory').upsert(
        { client_id: clientConfig.id || 'division', item_id: updated.id, payload: updated },
        { onConflict: 'client_id, item_id' }
      );
    } catch (err) { console.error("DB Sync Error:", err); }
  };

  const handleScheduleChange = (dayId: number, field: string, value: any) => {
    setWeeklySchedule((prev: any) => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const handleSaveHours = () => {
    setNotification("Operational settings committed.");
    setIsScheduleOpen(false);
  };

  // Memos for Engine Data
  const activeDeals = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.dailyDeal), [inventoryMatrix]);
  const topShelfItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory !== 'Edibles'), [inventoryMatrix]);
  const chefsReserveItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory === 'Edibles'), [inventoryMatrix]);
  const featuredItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.featured), [inventoryMatrix]);

  const overstockCandidates = useMemo(() => {
    return (inventoryMatrix || [])
      .filter((i: any) => {
        const totalStock = i.onHand || (i.options ? i.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return totalStock >= 30 && !i.dailyDeal;
      })
      .sort((a: any, b: any) => {
        const aStock = a.onHand || 0;
        const bStock = b.onHand || 0;
        return bStock - aStock;
      })
      .slice(0, 5); 
  }, [inventoryMatrix]);

  const renderDetailList = (items: any[], emptyMessage: string, iconColor: string) => {
    if (items.length === 0) return <div className="p-6 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest border border-dashed border-zinc-800 rounded-2xl">{emptyMessage}</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item: any) => {
           return (
             <div key={item.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-inner group hover:border-zinc-700 transition-colors">
               <div className="overflow-hidden">
                 <h4 className="font-black text-sm text-zinc-100 leading-none mb-1.5 truncate pr-2">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h4>
                 <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.mainCategory}</p>
               </div>
               <div className="flex items-center gap-3 shrink-0">
                 <button onClick={() => openEditor(item)} className="p-2 bg-zinc-900 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors">
                   <Edit3 size={16} />
                 </button>
                 <button onClick={() => handleQuickRemove(item)} className="p-2 bg-zinc-900 hover:bg-rose-500/20 border border-zinc-800 hover:border-rose-500/50 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors">
                   <X size={16} />
                 </button>
               </div>
             </div>
           );
        })}
      </div>
    );
  };

  if (editingItem) return (
    <AdminInventoryEditor 
      initialItem={editingItem} 
      isAdding={false} 
      mainCategories={mainCategories} 
      subCategories={subCategories} 
      standardTiers={standardTiers} 
      onSave={handleSaveProduct} 
      onDelete={handleDeleteProduct}
      onCancel={() => setEditingItem(null)} 
      inventoryMatrix={inventoryMatrix}
      client_id={clientConfig.id || 'division'}
      setNotification={setNotification}
    />
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-4 rounded-3xl border border-indigo-500/30 text-indigo-400 shadow-lg">
            <Store size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Store Operations</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Live Terminal Control <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-1.5 rounded-2xl shadow-inner">
           <button onClick={() => setStoreOverride('AUTO')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'AUTO' ? 'bg-indigo-500 text-zinc-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}>Auto Set</button>
           <button onClick={() => setStoreOverride('FORCE_OPEN')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_OPEN' ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900'}`}>Force Open</button>
           <button onClick={() => setStoreOverride('FORCE_CLOSE')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_CLOSE' ? 'bg-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-900'}`}>Force Close</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'PROMOS' ? null : 'PROMOS')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'PROMOS' ? 'border-pink-500/50 bg-pink-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Flame size={20} className="text-pink-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{activeDeals.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Active Promos</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'TOPSHELF' ? null : 'TOPSHELF')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'TOPSHELF' ? 'border-amber-500/50 bg-amber-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Award size={20} className="text-amber-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{topShelfItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Top Shelf Items</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'CHEF' ? null : 'CHEF')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'CHEF' ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <ChefHat size={20} className="text-fuchsia-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{chefsReserveItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Chef's Reserve</span>
         </button>
         
         <button 
           onClick={() => setActiveDetailView(activeDetailView === 'FEATURED' ? null : 'FEATURED')}
           className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'FEATURED' ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
         >
            <Star size={20} className="text-cyan-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{featuredItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Featured Drops</span>
         </button>
      </div>

      {activeDetailView && (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 mb-8 shadow-xl animate-in slide-in-from-top-4 relative">
          <button onClick={() => setActiveDetailView(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400 transition-colors p-2 bg-zinc-950 rounded-full border border-zinc-800"><X size={14}/></button>
          
          {activeDetailView === 'PROMOS' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-pink-400 mb-4 flex items-center gap-2"><Flame size={16}/> Active Promotions</h3>
              {renderDetailList(activeDeals, "No active promotions found.", "text-pink-500")}
            </div>
          )}
          {activeDetailView === 'TOPSHELF' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2"><Award size={16}/> Top Shelf Inventory</h3>
              {renderDetailList(topShelfItems, "No Top Shelf items found.", "text-amber-500")}
            </div>
          )}
          {activeDetailView === 'CHEF' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-fuchsia-400 mb-4 flex items-center gap-2"><ChefHat size={16}/> Chef's Reserve Edibles</h3>
              {renderDetailList(chefsReserveItems, "No Chef's Reserve items.", "text-fuchsia-500")}
            </div>
          )}
          {activeDetailView === 'FEATURED' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2"><Star size={16}/> Featured Drops</h3>
              {renderDetailList(featuredItems, "No featured items found.", "text-cyan-500")}
            </div>
          )}
        </div>
      )}

      <StorefrontSettings 
        isScheduleOpen={isScheduleOpen}
        setIsScheduleOpen={setIsScheduleOpen}
        weeklySchedule={weeklySchedule}
        handleScheduleChange={handleScheduleChange}
        shiftChange={shiftChange}
        setShiftChange={setShiftChange}
        handleSaveHours={handleSaveHours}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col h-full">
          <CampaignEngine 
            activeDeals={activeDeals}
            campaignView={campaignView}
            setCampaignView={setCampaignView}
            formatPromo={formatPromo}
            openEditor={openEditor}
          />
        </div>
        <div className="xl:col-span-4 flex flex-col">
          <PromoInsights 
            overstockCandidates={overstockCandidates}
            openEditor={openEditor}
          />
        </div>
      </div>
    </div>
  );
}