/* src/components/dashboard/storefronts/StorefrontsManager.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { HardHat, Globe, Clock, FlaskConical, ChevronDown } from 'lucide-react';
import { STOREFRONT_LIFECYCLE } from '@/config/lifecycle';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';
import { classifyStorefront } from '@/config/dashboard/overview';
import NewStorefrontModal from './NewStorefrontModal';
import StorefrontLegend from './manager/StorefrontLegend';
import StorefrontFilters from './manager/StorefrontFilters';
import StorefrontTable from './manager/StorefrontTable';
import TaskEditorModal from '@/components/dashboard/tasks/TaskEditorModal';

interface StorefrontsManagerProps {
  initialData: any[];
  initialTasks?: any[];
  initialIdeas?: any[];
}

export default function StorefrontsManager({ 
  initialData, 
  initialTasks = [], 
  initialIdeas = [] 
}: StorefrontsManagerProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENTS' | 'PROTOTYPES'>('CLIENTS');
  const [storefronts, setStorefronts] = useState(initialData);
  const [tasks, setTasks] = useState(initialTasks);
  const [ideas, setIdeas] = useState(initialIdeas);

  // Inline Task Editor Modal State (Openable directly from any Storefront Row!)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [preselectedStoreId, setPreselectedStoreId] = useState<string>('');

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); 
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({});
  const toggleTier = (tierKey: string) => setCollapsedTiers(prev => ({ ...prev, [tierKey]: !prev[tierKey] }));

  const copy = STOREFRONT_MANAGER_COPY;

  useEffect(() => { setStorefronts(initialData); }, [initialData]);
  useEffect(() => { setTasks(initialTasks); }, [initialTasks]);
  useEffect(() => { setIdeas(initialIdeas); }, [initialIdeas]);

  const availableStatuses = Object.keys(STOREFRONT_LIFECYCLE);
  const availablePlans = Array.from(new Set(storefronts.map(s => s.plan_tier || s.selected_plan).filter(Boolean))) as string[];
  const masterIndustries: { id: string; label: string }[] = STOREFRONT_EDITOR_COPY.INDUSTRIES || [];

  const handleRowUpdate = async (id: string, field: string, value: any) => {
    setStorefronts(prev => prev.map(store => store.id === id ? { ...store, [field]: value } : store));
    const { error } = await supabase.from('storefronts').update({ [field]: value }).eq('id', id);
    if (error) {
      console.error(`Failed to update ${field}:`, error);
      alert(copy.TABLE.SYNC_ERROR);
    }
  };

  const handleOpenTaskModal = (storeId: string, taskToEdit: any = null) => {
    setPreselectedStoreId(storeId);
    setEditingTask(taskToEdit);
    setIsTaskModalOpen(true);
  };

  const refreshTasksAndStores = async () => {
    const [storesRes, tasksRes] = await Promise.all([
      supabase.from('storefronts').select('*').or('status.neq.PENDING,status.is.null').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').neq('status', 'DONE').order('created_at', { ascending: false })
    ]);
    if (storesRes.data) setStorefronts(storesRes.data);
    if (tasksRes.data) setTasks(tasksRes.data);
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  let processedData = storefronts.filter(store => {
    if (!store.is_template && (store.status === 'PENDING' || store.status === 'CANCELED')) return false;
    if (!search.trim()) return true;
    
    const term = search.toLowerCase();
    return (store.business_name?.toLowerCase().includes(term) || store.slug?.toLowerCase().includes(term));
  });

  if (activeTab === 'CLIENTS') processedData = processedData.filter(store => !store.is_template);
  if (activeTab === 'PROTOTYPES') processedData = processedData.filter(store => store.is_template);
  if (statusFilter !== 'ALL') processedData = processedData.filter(store => store.status === statusFilter);
  if (planFilter !== 'ALL') processedData = processedData.filter(store => (store.plan_tier === planFilter) || (store.selected_plan === planFilter));
  if (categoryFilter !== 'ALL') {
    processedData = processedData.filter(store => {
      const storeCat = store.industry_tag || store.category || store.industry || 'General';
      return storeCat === categoryFilter;
    });
  }

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

  // Use the Single Source of Truth Classifier
  const activeWorkshopData = processedData.filter(s => classifyStorefront(s) === 'WORKSHOP');
  const holdingPatternData = processedData.filter(s => classifyStorefront(s) === 'HOLDING');
  const liveProductionData = processedData.filter(s => classifyStorefront(s) === 'LIVE');

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">{copy.HEADER.TITLE}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{copy.HEADER.SUBTITLE}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <NewStorefrontModal />
        </div>
      </div>

      <StorefrontFilters 
        search={search} setSearch={setSearch}
        activeTab={activeTab} setActiveTab={setActiveTab}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        planFilter={planFilter} setPlanFilter={setPlanFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        masterIndustries={masterIndustries}
        availablePlans={availablePlans}
        availableStatuses={availableStatuses}
      />

      <div className="bg-stardust border border-zinc-800/80 rounded-xl shadow-xl p-3 sm:p-6 transition-colors duration-500">
        <StorefrontLegend />
        
        {activeTab === 'PROTOTYPES' ? (
          <div>
            <h2 className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FlaskConical size={14} /> {copy.TIERS.PROTOTYPES_GRID} ({processedData.length})
            </h2>
            <StorefrontTable 
              processedData={processedData}
              requestSort={requestSort}
              sortConfig={sortConfig}
              handleRowUpdate={handleRowUpdate}
              masterIndustries={masterIndustries}
              tasks={tasks}
              ideas={ideas}
              onOpenTaskModal={handleOpenTaskModal}
              isPrototypeView={true}
            />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10">
            {/* TIER 1: ACTIVE WORKSHOP (Strictly In Your Court) */}
            <div>
              <button
                type="button"
                onClick={() => toggleTier('workshop')}
                className="w-full flex items-center justify-between text-xs font-black text-cyan-400 uppercase tracking-widest mb-3 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <HardHat size={14} /> {copy.TIERS.WORKSHOP} ({activeWorkshopData.length} / 5)
                </span>
                <ChevronDown size={15} className={`text-zinc-500 group-hover:text-cyan-400 transition-transform duration-200 ${collapsedTiers['workshop'] ? '-rotate-90' : ''}`} />
              </button>
              {!collapsedTiers['workshop'] && (
                <StorefrontTable 
                  processedData={activeWorkshopData}
                  requestSort={requestSort}
                  sortConfig={sortConfig}
                  handleRowUpdate={handleRowUpdate}
                  masterIndustries={masterIndustries}
                  tasks={tasks}
                  ideas={ideas}
                  onOpenTaskModal={handleOpenTaskModal}
                  isPrototypeView={false}
                />
              )}
            </div>

            {/* TIER 2: AWAITING CLIENT ACTION (In Their Court — Never Blocks Your 5 Slots) */}
            <div>
              <button
                type="button"
                onClick={() => toggleTier('holding')}
                className="w-full flex items-center justify-between text-xs font-black text-amber-400 uppercase tracking-widest mb-3 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Clock size={14} /> {copy.TIERS.HOLDING} ({holdingPatternData.length})
                </span>
                <ChevronDown size={15} className={`text-zinc-500 group-hover:text-amber-400 transition-transform duration-200 ${collapsedTiers['holding'] ? '-rotate-90' : ''}`} />
              </button>
              {!collapsedTiers['holding'] && (
                <StorefrontTable 
                  processedData={holdingPatternData}
                  requestSort={requestSort}
                  sortConfig={sortConfig}
                  handleRowUpdate={handleRowUpdate}
                  masterIndustries={masterIndustries}
                  tasks={tasks}
                  ideas={ideas}
                  onOpenTaskModal={handleOpenTaskModal}
                  isPrototypeView={false}
                />
              )}
            </div>

            {/* TIER 3: LIVE PRODUCTION GRID */}
            <div>
              <button
                type="button"
                onClick={() => toggleTier('production')}
                className="w-full flex items-center justify-between text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Globe size={14} /> {copy.TIERS.PRODUCTION} ({liveProductionData.length})
                </span>
                <ChevronDown size={15} className={`text-zinc-500 group-hover:text-emerald-400 transition-transform duration-200 ${collapsedTiers['production'] ? '-rotate-90' : ''}`} />
              </button>
              {!collapsedTiers['production'] && (
                <StorefrontTable 
                  processedData={liveProductionData}
                  requestSort={requestSort}
                  sortConfig={sortConfig}
                  handleRowUpdate={handleRowUpdate}
                  masterIndustries={masterIndustries}
                  tasks={tasks}
                  ideas={ideas}
                  onOpenTaskModal={handleOpenTaskModal}
                  isPrototypeView={false}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Inline Task Editor Modal so you can create/edit/complete tasks right from the Storefront table! */}
      {isTaskModalOpen && (
        <TaskEditorModal
          task={editingTask}
          preselectedStorefrontId={preselectedStoreId}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
            setPreselectedStoreId('');
          }}
          onSuccess={refreshTasksAndStores}
        />
      )}
    </div>
  );
}