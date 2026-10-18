/* src/components/dashboard/storefronts/StorefrontsManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Unlock, Lock, HardHat, Globe, Clock } from 'lucide-react';
import { STOREFRONT_LIFECYCLE } from '@/config/lifecycle';
import NewStorefrontModal from './NewStorefrontModal';
import StorefrontLegend from './manager/StorefrontLegend';
import StorefrontFilters from './manager/StorefrontFilters';
import StorefrontTable from './manager/StorefrontTable';

export default function StorefrontsManager({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENTS' | 'PROTOTYPES'>('CLIENTS');
  const [storefronts, setStorefronts] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'status', direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); 
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // ARCHITECT OVERRIDE TOGGLE
  const [isEditMode, setIsEditMode] = useState(false);

  const availableStatuses = Object.keys(STOREFRONT_LIFECYCLE);
  const availablePlans = Array.from(new Set(storefronts.map(s => s.plan_tier || s.selected_plan).filter(Boolean))) as string[];
  const availableCategories = Array.from(new Set(storefronts.map(s => s.industry_tag || s.category || s.industry).filter(Boolean))) as string[];

  const handleRowUpdate = async (id: string, field: string, value: string) => {
    setStorefronts(prev => prev.map(store => store.id === id ? { ...store, [field]: value } : store));
    const { error } = await supabase.from('storefronts').update({ [field]: value }).eq('id', id);
    if (error) {
      console.error(`Failed to update ${field}:`, error);
      alert("Database sync failed. Please refresh and try again.");
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  let processedData = storefronts.filter(store => 
    store.status !== 'CANCELED' &&
    (store.business_name?.toLowerCase().includes(search.toLowerCase()) || store.slug?.toLowerCase().includes(search.toLowerCase()))
  );

  if (activeTab === 'CLIENTS') processedData = processedData.filter(store => !store.is_template);
  if (activeTab === 'PROTOTYPES') processedData = processedData.filter(store => store.is_template);
  if (statusFilter !== 'ALL') processedData = processedData.filter(store => store.status === statusFilter);
  if (planFilter !== 'ALL') processedData = processedData.filter(store => (store.plan_tier === planFilter) || (store.selected_plan === planFilter));
  if (categoryFilter !== 'ALL') processedData = processedData.filter(store => (store.industry_tag === categoryFilter) || (store.category === categoryFilter) || (store.industry === categoryFilter));

  if (sortConfig !== null) {
    processedData.sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';

      if (sortConfig.key === 'category') {
        aValue = a.industry_tag || a.category || a.industry || '';
        bValue = b.industry_tag || b.category || b.industry || '';
      }
      if (sortConfig.key === 'plan_tier') {
        aValue = a.plan_tier || a.selected_plan || '';
        bValue = b.plan_tier || b.selected_plan || '';
      }
      if (sortConfig.key === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 🚀 THE FIX: AWAITING_PAYMENT is back in the Active Workshop array to hold your capacity limits
  const activeWorkshopData = processedData.filter(s => ['AWAITING_PAYMENT', 'PENDING_BUILD', 'BUILDING_CORE', 'CONTENT_ASSEMBLY'].includes(s.status || 'PENDING_BUILD'));
  const holdingPatternData = processedData.filter(s => ['IN_REVIEW', 'AWAITING_ASSETS', 'ON_HOLD'].includes(s.status));
  const liveProductionData = processedData.filter(s => ['ACTIVE', 'MAINTENANCE', 'HIDDEN'].includes(s.status));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Storefront Engine</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage active client projects and sandbox prototypes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              isEditMode 
                ? 'bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400' 
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600'
            }`}
          >
            {isEditMode ? <><Lock size={14} /> Lock Grid</> : <><Unlock size={14} /> Architect Override</>}
          </button>
          <NewStorefrontModal />
        </div>
      </div>

      <StorefrontFilters 
        search={search} setSearch={setSearch}
        activeTab={activeTab} setActiveTab={setActiveTab}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        planFilter={planFilter} setPlanFilter={setPlanFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        availableCategories={availableCategories} availablePlans={availablePlans} availableStatuses={availableStatuses}
      />

      <div className={`bg-stardust border rounded-xl shadow-xl p-4 sm:p-6 transition-colors duration-500 ${isEditMode ? 'border-amber-500/50' : 'border-zinc-800/80'}`}>
        <StorefrontLegend />
        
        {/* TIER 1: ACTIVE WORKSHOP TABLE */}
        <div className="mb-12">
          <h2 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <HardHat size={14} /> The Active Workshop
          </h2>
          <StorefrontTable 
            processedData={activeWorkshopData}
            requestSort={requestSort}
            sortConfig={sortConfig}
            isEditMode={isEditMode}
            handleRowUpdate={handleRowUpdate}
            availableStatuses={availableStatuses}
            availableCategories={availableCategories}
          />
        </div>

        {/* TIER 2: CLIENT ACTION REQUIRED */}
        <div className="mb-12">
          <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock size={14} /> Awaiting Client Action
          </h2>
          <StorefrontTable 
            processedData={holdingPatternData}
            requestSort={requestSort}
            sortConfig={sortConfig}
            isEditMode={isEditMode}
            handleRowUpdate={handleRowUpdate}
            availableStatuses={availableStatuses}
            availableCategories={availableCategories}
          />
        </div>

        {/* TIER 3: LIVE PRODUCTION TABLE */}
        <div>
          <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Globe size={14} /> Live Production Grid
          </h2>
          <StorefrontTable 
            processedData={liveProductionData}
            requestSort={requestSort}
            sortConfig={sortConfig}
            isEditMode={isEditMode}
            handleRowUpdate={handleRowUpdate}
            availableStatuses={availableStatuses}
            availableCategories={availableCategories}
          />
        </div>

      </div>
    </div>
  );
}