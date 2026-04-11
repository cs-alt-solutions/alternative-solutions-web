'use client';

import React, { useState, useMemo } from 'react';
import { Store, Flame, Award, ChefHat, Star, X, Edit3, Settings } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import { createClient } from '@supabase/supabase-js';

// Sub-components
import StorefrontSettings from './storefront/StorefrontSettings';
import CampaignEngine from './storefront/CampaignEngine';
import PromoInsights from './storefront/PromoInsights';
import CampaignConfigModal from './storefront/CampaignConfigModal';
import InventorySelectorModal from './storefront/InventorySelectorModal'; 

export default function AdminStorefrontModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  const [weeklySchedule, setWeeklySchedule] = useStickyState<any>(clientConfig.weeklySchedule || {}, `store_weekly_hours_${clientConfig?.id}`);
  const [shiftChange, setShiftChange] = useStickyState(clientConfig.shiftChange || '12:00', `store_shift_change_${clientConfig?.id}`);
  const [storeOverride, setStoreOverride] = useStickyState('AUTO', `store_override_${clientConfig?.id}`); 
  const [campaignView, setCampaignView] = useState<'WEEK' | 'LIST'>('WEEK'); 
  const [activeDetailView, setActiveDetailView] = useState<'PROMOS' | 'TOPSHELF' | 'CHEF' | 'FEATURED' | null>(null);
  
  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false); 
  const [selectorContext, setSelectorContext] = useState<any>(null); 
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [campaignItem, setCampaignItem] = useState<any>(null);

  const mainCategories = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const [subCategories] = useStickyState<Record<string, string[]>>(clientConfig.subCategories || {}, `inv_subcats_v2_${clientConfig?.id || 'division'}`);
  const [standardTiers] = useStickyState<string[]>(clientConfig.pricingTiers || [], `inv_tiers_v2_${clientConfig?.id || 'division'}`);

  // --- HANDLERS ---

  // Opens the Inventory Search Overlay from the Grid
  const openInventorySelector = (dayId: number, lane: string) => {
    setSelectorContext({ dayId, lane });
    setIsSelectorOpen(true);
  };

  // Receives the item from Search Overlay -> Opens Config Modal Pre-filled
  const handleSelectFromInventory = (item: any) => {
    setIsSelectorOpen(false);
    // Wrap the item with the target day and lane so CampaignConfigModal reads it immediately
    const prefilledItem = { 
      ...item, 
      dealType: selectorContext.lane, 
      dealDays: [selectorContext.dayId] 
    };
    openCampaignConfig(prefilledItem);
  };

  const openCampaignConfig = (item: any) => {
    setCampaignItem(item);
    setIsConfigModalOpen(true);
  };

  const handleSaveCampaign = async (updatedItem: any) => {
    setStock((prev: any[]) => prev.map((item: any) => item.id === updatedItem.id ? updatedItem : item));
    setIsConfigModalOpen(false);
    setCampaignItem(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('client_inventory').upsert(
          { client_id: clientConfig.id || 'division', item_id: updatedItem.id, payload: updatedItem },
          { onConflict: 'client_id, item_id' }
        );
      setNotification(`Strategy Locked: ${updatedItem.name}`);
    } catch (err) {
      setNotification(`Failed to save campaign.`);
    }
  };

  const handleQuickRemove = (item: any) => {
    const updated = { ...item, dealType: 'None', dailyDeal: false, dealDays: [], campaignTag: '' };
    setStock((prev: any[]) => prev.map((i: any) => i.id === updated.id ? updated : i));
    setNotification(`Campaign scrubbed from grid.`);
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        supabase.from('client_inventory').upsert({ client_id: clientConfig.id || 'division', item_id: updated.id, payload: updated }, { onConflict: 'client_id, item_id' }).then();
      }
    } catch (err) { console.error(err); }
  };

  const handleScheduleChange = (dayId: number, field: string, value: any) => {
    setWeeklySchedule((prev: any) => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const handleSaveHours = () => {
    setNotification("Operational settings committed.");
    setIsSettingsModalOpen(false); 
  };

  // --- NEW: Manual review clear for One-Shot Sprints ---
  const handleClearOneShots = async () => {
    const itemsToUpdate = stock.filter((i: any) => i.dealType === 'One-Shot');
    if (itemsToUpdate.length === 0) return;

    // Wipe them locally
    const updatedStock = stock.map((item: any) => {
      if (item.dealType === 'One-Shot') {
        return { ...item, dealType: 'None', dailyDeal: false, dealDays: [], campaignTag: '' };
      }
      return item;
    });
    setStock(updatedStock);

    // Sync the wipe to the master vault
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const payloads = itemsToUpdate.map((item: any) => ({
          client_id: clientConfig.id || 'division',
          item_id: item.id,
          payload: { ...item, dealType: 'None', dailyDeal: false, dealDays: [], campaignTag: '' }
        }));
        
        await supabase.from('client_inventory').upsert(payloads, { onConflict: 'client_id, item_id' });
      }
      setNotification('One-Shot Sprints successfully scrubbed.');
    } catch (err) {
      setNotification('Cleared locally, but failed to sync to vault.');
    }
  };

  // --- ENGINE INSIGHTS & METRICS ---
  const activeDeals = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.dailyDeal || i.dealType === 'One-Shot' || i.dealType === 'Recurring'), [inventoryMatrix]);
  const topShelfItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory !== 'Edibles'), [inventoryMatrix]);
  const chefsReserveItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.isTopShelf && i.mainCategory === 'Edibles'), [inventoryMatrix]);
  const featuredItems = useMemo(() => (inventoryMatrix || []).filter((i: any) => i.featured), [inventoryMatrix]);

  const overstockCandidates = useMemo(() => {
    return (inventoryMatrix || [])
      .filter((i: any) => {
        const totalStock = i.onHand || (i.options ? i.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return totalStock >= 25 && !i.dailyDeal && i.dealType !== 'One-Shot' && i.dealType !== 'Recurring';
      })
      .sort((a: any, b: any) => (b.onHand || 0) - (a.onHand || 0))
      .slice(0, 6); 
  }, [inventoryMatrix]);

  const renderDetailList = (items: any[], emptyMessage: string) => {
    if (items.length === 0) return <div className="p-6 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest border border-dashed border-zinc-800 rounded-2xl">{emptyMessage}</div>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item: any) => (
           <div key={item.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-3xl flex items-center justify-between shadow-inner group hover:border-zinc-700 transition-colors">
             <div className="overflow-hidden">
               <h4 className="font-black text-sm text-zinc-100 leading-none mb-1.5 truncate pr-2">{item.name}</h4>
               <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.mainCategory}</p>
             </div>
             <div className="flex items-center gap-3 shrink-0">
               <button onClick={() => openCampaignConfig(item)} className="p-2 bg-zinc-900 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 rounded-xl text-zinc-500 hover:text-emerald-400 transition-colors"><Edit3 size={16} /></button>
             </div>
           </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {/* Overlays */}
      <CampaignConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} item={campaignItem} onSave={handleSaveCampaign} />
      <StorefrontSettings isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} weeklySchedule={weeklySchedule} handleScheduleChange={handleScheduleChange} shiftChange={shiftChange} setShiftChange={setShiftChange} handleSaveHours={handleSaveHours} />
      
      {/* NEW: Inventory Selector Overlay */}
      <InventorySelectorModal 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
        inventoryMatrix={inventoryMatrix} 
        onSelect={handleSelectFromInventory} 
        context={selectorContext} 
      />

      {/* Header Section */}
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
           
           <div className="w-px h-6 bg-zinc-800 mx-1"></div>
           <button onClick={() => setIsSettingsModalOpen(true)} className="p-2.5 rounded-xl text-zinc-500 hover:text-indigo-400 hover:bg-zinc-900 transition-colors" title="Master Schedule & Settings">
             <Settings size={16} />
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <button onClick={() => setActiveDetailView(activeDetailView === 'PROMOS' ? null : 'PROMOS')} className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'PROMOS' ? 'border-pink-500/50 bg-pink-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
            <Flame size={20} className="text-pink-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{activeDeals.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Active Promos</span>
         </button>
         <button onClick={() => setActiveDetailView(activeDetailView === 'TOPSHELF' ? null : 'TOPSHELF')} className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'TOPSHELF' ? 'border-amber-500/50 bg-amber-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
            <Award size={20} className="text-amber-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{topShelfItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Top Shelf Items</span>
         </button>
         <button onClick={() => setActiveDetailView(activeDetailView === 'CHEF' ? null : 'CHEF')} className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'CHEF' ? 'border-fuchsia-500/50 bg-fuchsia-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
            <ChefHat size={20} className="text-fuchsia-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{chefsReserveItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Chef's Reserve</span>
         </button>
         <button onClick={() => setActiveDetailView(activeDetailView === 'FEATURED' ? null : 'FEATURED')} className={`bg-zinc-900/50 backdrop-blur-sm border rounded-4xl p-5 flex flex-col justify-center items-center text-center transition-all active:scale-95 ${activeDetailView === 'FEATURED' ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}>
            <Star size={20} className="text-cyan-400 mb-2 z-10" />
            <span className="text-3xl font-black text-zinc-100 leading-none z-10">{featuredItems.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1 z-10">Featured Drops</span>
         </button>
      </div>

      {activeDetailView && (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 mb-8 shadow-xl animate-in slide-in-from-top-4 relative">
          <button onClick={() => setActiveDetailView(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400 transition-colors p-2 bg-zinc-950 rounded-full border border-zinc-800"><X size={14}/></button>
          {activeDetailView === 'PROMOS' && renderDetailList(activeDeals, "No active promotions found.")}
          {activeDetailView === 'TOPSHELF' && renderDetailList(topShelfItems, "No Top Shelf items found.")}
          {activeDetailView === 'CHEF' && renderDetailList(chefsReserveItems, "No Chef's Reserve items.")}
          {activeDetailView === 'FEATURED' && renderDetailList(featuredItems, "No featured items found.")}
        </div>
      )}

      {/* FULL-WIDTH STACKED LAYOUT */}
      <div className="flex flex-col gap-8 w-full">
        <PromoInsights overstockCandidates={overstockCandidates} openCampaignConfig={openCampaignConfig} />
        <CampaignEngine 
          activeDeals={activeDeals} 
          campaignView={campaignView} 
          setCampaignView={setCampaignView}
          openCampaignConfig={openCampaignConfig} 
          removeDeal={handleQuickRemove}
          openInventorySelector={openInventorySelector}
          weeklySchedule={weeklySchedule}
          clearOneShots={handleClearOneShots}
        />
      </div>
    </div>
  );
}