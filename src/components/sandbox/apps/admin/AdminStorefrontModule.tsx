// sandbox/apps/admin/AdminStorefrontModule.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Store, Flame, Award, ChefHat, Star, X, Edit3, Settings, Zap, RotateCcw, Tag, AlertTriangle } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { createClient } from '@supabase/supabase-js';

import StorefrontBuilder from './storefront/StorefrontBuilder';
import CampaignEngine from './storefront/CampaignEngine';
import StorefrontSettings from './storefront/StorefrontSettings';
import PromoInsights from './storefront/PromoInsights';
import InventorySelectorModal from './storefront/InventorySelectorModal';
import CampaignConfigModal from './storefront/CampaignConfigModal';

// 🚀 IMPORT OUR SMART COMPONENT
import BackroomStashSection from './storefront/builder/BackroomStashSection';

export default function AdminStorefrontModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig, onJumpToInventory }: any) {
  
  const fallbackConfig = { hero: {}, bento: [], secondary: {}, categoryImages: {}, backroomStash: [] };
  const [homeConfig, setHomeConfig] = useStickyState(clientConfig?.homeConfig || fallbackConfig, `alt_solutions_home_config_v3_${clientConfig?.id}`);
  
  const [adminView, setAdminView] = useState<'BUILDER' | 'OPERATIONS' | 'SETTINGS' | 'INSIGHTS'>('OPERATIONS');
  
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryModalContext, setInventoryModalContext] = useState<any>(null);
  const [showCampaignConfig, setShowCampaignConfig] = useState(false);
  const [activeDealToConfig, setActiveDealToConfig] = useState<any>(null);

  const [activeDeals, setActiveDeals] = useState<any[]>(() => {
    return (stock || []).filter((item: any) => item.dailyDeal || item.dealType === 'One-Shot' || item.dealType === 'Recurring');
  });

  useEffect(() => {
    setActiveDeals((stock || []).filter((item: any) => item.dailyDeal || item.dealType === 'One-Shot' || item.dealType === 'Recurring'));
  }, [stock]);

  const openInventorySelector = (dayId: number, dealType: 'Recurring' | 'One-Shot') => {
    setInventoryModalContext({ dayId, dealType });
    setShowInventoryModal(true);
  };

  const handleSelectInventoryForDeal = async (item: any) => {
    if (!inventoryModalContext) return;
    const { dayId, dealType } = inventoryModalContext;
    
    let currentDays = item.dealDays || [];
    if (!currentDays.includes(dayId)) {
        currentDays = [...currentDays, dayId];
    }
    
    const isNowDailyDeal = true;
    
    const updatedItem = { 
        ...item, 
        dailyDeal: isNowDailyDeal, 
        dealType: dealType, 
        dealDays: currentDays,
        campaignTag: item.campaignTag || 'HAPPY_HOUR',
        dealConfig: item.dealConfig || { type: 'DISCOUNT', discountType: 'PERCENT', discountValue: 15, unit: 'UNITS' }
    };
    
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        const { error } = await supabase.from('client_inventory').update({ payload: updatedItem }).eq('item_id', item.id);
        if (error) throw error;
        
        setStock((prev: any[]) => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
        setNotification(`Added ${item.name} to ${dealType} deals!`);
    } catch (err) {
        setNotification("Failed to save deal to database.");
    }

    setShowInventoryModal(false);
    setInventoryModalContext(null);
  };

  const removeDeal = async (item: any) => {
    const updatedItem = { ...item, dailyDeal: false, dealType: null, dealDays: [], dealConfig: null, campaignTag: null };
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        const { error } = await supabase.from('client_inventory').update({ payload: updatedItem }).eq('item_id', item.id);
        if (error) throw error;
        
        setStock((prev: any[]) => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
        setNotification(`Removed deal for ${item.name}`);
    } catch (err) {
        setNotification("Failed to remove deal.");
    }
  };

  const clearOneShots = async () => {
    // 🚀 THE GHOST NUKE: Targets specific One-Shots AND any rogue/legacy daily deals
    const itemsToClear = stock.filter((i: any) => i.dailyDeal && i.dealType !== 'Recurring');
    
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        
        for (const item of itemsToClear) {
            const updatedItem = { ...item, dailyDeal: false, dealType: null, dealDays: [], dealConfig: null, campaignTag: null };
            await supabase.from('client_inventory').update({ payload: updatedItem }).eq('item_id', item.id);
        }
        
        setStock((prev: any[]) => prev.map(i => {
            // Update the local state to match the DB purge
            if (i.dailyDeal && i.dealType !== 'Recurring') {
                return { ...i, dailyDeal: false, dealType: null, dealDays: [], dealConfig: null, campaignTag: null };
            }
            return i;
        }));
        setNotification("Cleared all One-Shot Sprints and Ghost Deals!");
    } catch (err) {
        setNotification("Failed to clear Sprints.");
    }
  };

  const openCampaignConfig = (deal: any) => {
    setActiveDealToConfig(deal);
    setShowCampaignConfig(true);
  };

  const saveCampaignConfig = async (updatedItem: any) => {
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        const { error } = await supabase.from('client_inventory').update({ payload: updatedItem }).eq('item_id', updatedItem.id);
        if (error) throw error;
        
        setStock((prev: any[]) => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
        setNotification(`Updated campaign for ${updatedItem.name}`);
    } catch (err) {
        setNotification("Failed to update campaign.");
    }
  };

  // 🚀 ACTIVE METRICS COMPUTATION
  const activeTopShelf = stock?.filter((i: any) => i.isTopShelf)?.length || 0;
  const activeChefs = stock?.filter((i: any) => i.isChefsReserve)?.length || 0;
  const activeNewDrops = stock?.filter((i: any) => i.isNewDrop)?.length || 0;
  const activeClearance = stock?.filter((i: any) => i.isClearance)?.length || 0;

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-500">Storefront Command</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Manage architecture, campaigns, and operations.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
          <button onClick={() => setAdminView('OPERATIONS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${adminView === 'OPERATIONS' ? 'bg-zinc-800 text-pink-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Grid Ops & Campaigns</button>
          <button onClick={() => setAdminView('BUILDER')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${adminView === 'BUILDER' ? 'bg-zinc-800 text-cyan-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Visual Layout Builder</button>
          <button onClick={() => setAdminView('SETTINGS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${adminView === 'SETTINGS' ? 'bg-zinc-800 text-amber-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Settings</button>
          <button onClick={() => setAdminView('INSIGHTS')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${adminView === 'INSIGHTS' ? 'bg-zinc-800 text-indigo-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>Insights</button>
        </div>
      </div>

      {adminView === 'OPERATIONS' && (
        <>
          {/* 🚀 SMART STASH CONFIGURATOR RENDERED HERE */}
          <BackroomStashSection homeConfig={homeConfig} setHomeConfig={setHomeConfig} clientConfig={clientConfig} />

          <CampaignEngine 
             activeDeals={activeDeals} 
             openCampaignConfig={openCampaignConfig} 
             removeDeal={removeDeal} 
             openInventorySelector={openInventorySelector} 
             weeklySchedule={clientConfig?.storeHours || {}} 
             clearOneShots={clearOneShots}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:border-amber-500/50 transition-colors group cursor-pointer" onClick={onJumpToInventory}>
              <Award size={24} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform"/>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Top Shelf</span>
              <span className="text-2xl font-black text-white">{activeTopShelf}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:border-orange-500/50 transition-colors group cursor-pointer" onClick={onJumpToInventory}>
              <ChefHat size={24} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform"/>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Chef's Reserve</span>
              <span className="text-2xl font-black text-white">{activeChefs}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:border-cyan-500/50 transition-colors group cursor-pointer" onClick={onJumpToInventory}>
              <Star size={24} className="text-cyan-500 mb-2 group-hover:scale-110 transition-transform"/>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">New Arrivals</span>
              <span className="text-2xl font-black text-white">{activeNewDrops}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:border-rose-500/50 transition-colors group cursor-pointer" onClick={onJumpToInventory}>
              <Tag size={24} className="text-rose-500 mb-2 group-hover:scale-110 transition-transform"/>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Clearance</span>
              <span className="text-2xl font-black text-white">{activeClearance}</span>
            </div>
          </div>
        </>
      )}

      {adminView === 'BUILDER' && (
        <StorefrontBuilder homeConfig={homeConfig} setHomeConfig={setHomeConfig} mainCategories={[]} subCategories={{}} inventoryMatrix={inventoryMatrix} clientConfig={clientConfig} />
      )}

      {adminView === 'SETTINGS' && (
        <StorefrontSettings clientConfig={clientConfig} setNotification={setNotification} />
      )}

      {adminView === 'INSIGHTS' && (
        <PromoInsights stock={stock} activeDeals={activeDeals} clientConfig={clientConfig} />
      )}

      <InventorySelectorModal 
        isOpen={showInventoryModal} 
        onClose={() => setShowInventoryModal(false)} 
        inventoryMatrix={inventoryMatrix} 
        onSelect={handleSelectInventoryForDeal} 
        context={inventoryModalContext} 
      />

      <CampaignConfigModal 
        isOpen={showCampaignConfig} 
        onClose={() => { setShowCampaignConfig(false); setActiveDealToConfig(null); }} 
        item={activeDealToConfig} 
        onSave={saveCampaignConfig} 
      />
    </div>
  );
}