'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Search, Users, FlaskConical, 
  LayoutGrid, ArrowUpDown, Filter, ChevronUp, ChevronDown, Eye, EyeOff 
} from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { deleteStorefront, quickToggleStorefrontFlags } from '@/app/actions/storefronts';
import NewStorefrontModal from './NewStorefrontModal';
import { STOREFRONT_ENGINE_COPY } from '@/config/dashboard'; // 🚀 Centralized Copy

export default function StorefrontsManager({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENTS' | 'PROTOTYPES'>('CLIENTS');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [storefronts, setStorefronts] = useState(initialData);

  const copy = STOREFRONT_ENGINE_COPY; // 🚀 Shorthand

  // 🧠 THE SORTING & FILTERING ENGINE
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); 
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const availableStatuses = Object.keys(STOREFRONT_LIFECYCLE);
  const availablePlans = Array.from(new Set(storefronts.map(s => s.plan_tier || s.selected_plan).filter(Boolean))) as string[];
  const availableCategories = Array.from(new Set(storefronts.map(s => s.industry_tag || s.category).filter(Boolean))) as string[];

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete "${name}"? This action cannot be undone and will obliterate client data.`)) return;
    setIsDeleting(id);
    try {
      await deleteStorefront(id);
      setStorefronts(prev => prev.filter(store => store.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete storefront.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleFlags = async (id: string, payload: { is_published?: boolean, is_template?: boolean }) => {
    setStorefronts(prev => prev.map(store => store.id === id ? { ...store, ...payload } : store));
    try {
      await quickToggleStorefrontFlags(id, payload);
    } catch (err) {
      alert("Database sync failed. Refreshing data.");
    }
  };

  let processedData = storefronts.filter(store => 
    store.status !== 'PENDING' &&
    (store.business_name?.toLowerCase().includes(search.toLowerCase()) || store.slug?.toLowerCase().includes(search.toLowerCase()))
  );

  if (activeTab === 'CLIENTS') processedData = processedData.filter(store => !store.is_template);
  if (activeTab === 'PROTOTYPES') processedData = processedData.filter(store => store.is_template);

  if (statusFilter !== 'ALL') processedData = processedData.filter(store => store.status === statusFilter);
  if (planFilter !== 'ALL') processedData = processedData.filter(store => (store.plan_tier === planFilter) || (store.selected_plan === planFilter));
  if (categoryFilter !== 'ALL') processedData = processedData.filter(store => (store.industry_tag === categoryFilter) || (store.category === categoryFilter));

  if (sortConfig !== null) {
    processedData.sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';

      if (sortConfig.key === 'category') {
        aValue = a.industry_tag || a.category || '';
        bValue = b.industry_tag || b.category || '';
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

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-cyan-400" /> : <ChevronDown size={14} className="text-cyan-400" />;
  };

  const renderTableRow = (store: any) => {
    const status = store.status as StorefrontStatus;
    const config = STOREFRONT_LIFECYCLE[status] || { label: store.status || 'UNKNOWN', badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    const isOffline = status === 'MAINTENANCE' || status === 'HIDDEN' || status === 'CANCELED';
    
    const formattedCreatedDate = new Date(store.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const isSubscribed = !!store.stripe_subscription_id || status === 'ACTIVE' || status === 'LIVE';
    const formattedSubscribedDate = store.current_period_end 
      ? new Date(store.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : isSubscribed ? 'Active (Date Syncing)' : null;

    const displayCategory = store.industry_tag || store.category || 'Unassigned';
    
    const rawPlan = (store.plan_tier || store.selected_plan || '').toLowerCase();
    let displayPrice = '--';
    if (rawPlan.includes('foundation') || rawPlan.includes('standard')) displayPrice = '$5/mo';
    if (rawPlan.includes('professional') || rawPlan.includes('pro')) displayPrice = '$15/mo';

    return (
      <tr key={store.id} className={`hover:bg-white/5 transition-colors border-b border-zinc-800/50 ${isOffline ? 'opacity-60' : ''}`}>
        
        {/* BUSINESS IDENTITY */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
              {store.brand_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-sm text-zinc-600 uppercase">{store.business_name?.charAt(0) || '?'}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight truncate max-w-50 md:max-w-xs">{store.business_name}</span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">/{store.slug}</span>
            </div>
          </div>
        </td>

        {/* CATEGORY */}
        <td className="px-6 py-4 hidden md:table-cell text-xs font-medium text-zinc-400 capitalize">{displayCategory}</td>

        {/* PLAN TIER */}
        <td className="px-6 py-4 hidden lg:table-cell">
          <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
            displayPrice === '$15/mo' ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' 
            : displayPrice === '$5/mo' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
            : 'text-zinc-500 bg-zinc-800/50 border-zinc-700/50'
          }`}>
            {displayPrice}
          </span>
        </td>
        
        {/* STATUS */}
        <td className="px-6 py-4 hidden sm:table-cell">
          {store.is_template ? (
            <button
              onClick={() => handleToggleFlags(store.id, { is_published: !store.is_published })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                store.is_published ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:bg-zinc-700'
              }`}
            >
              {store.is_published ? <><Eye size={12}/> Visible</> : <><EyeOff size={12}/> Hidden</>}
            </button>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${config.badgeColor}`}>
              {config.label}
            </span>
          )}
        </td>

        {/* DATES */}
        <td className="px-6 py-4 hidden xl:table-cell">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Created</span>
              <span className="text-xs text-zinc-400 font-mono">{formattedCreatedDate}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Subscribed</span>
              <span className={`text-xs font-mono ${formattedSubscribedDate ? 'text-emerald-400 font-bold' : 'text-amber-500/80'}`}>
                {formattedSubscribedDate || 'Pending Checkout'}
              </span>
            </div>
          </div>
        </td>

        {/* ACTIONS */}
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {status !== 'ACTIVE' && status !== 'LIVE' && (
              <button
                onClick={() => handleToggleFlags(store.id, { is_template: !store.is_template })}
                className={`p-1.5 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
                  store.is_template ? 'text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/20' : 'text-zinc-500 bg-zinc-900/50 hover:bg-zinc-800 border-zinc-800'
                }`}
              >
                {store.is_template ? <Users size={14} /> : <FlaskConical size={14} />}
              </button>
            )}
            <Link 
              href={`/dashboard/storefronts/${store.id}`}
              className="p-1.5 rounded-md text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all flex items-center justify-center"
            >
              <Settings size={14} />
            </Link>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/50">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{copy.HEADER.TITLE}</h1>
          <p className="text-sm text-zinc-400 mt-1">{copy.HEADER.SUBTITLE}</p>
        </div>
        <NewStorefrontModal />
      </div>

      {/* COMMAND BAR */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            <button onClick={() => setActiveTab('CLIENTS')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'CLIENTS' ? 'bg-cyan-500/10 text-cyan-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Users size={12} /> {copy.TABS.CLIENTS}
            </button>
            <button onClick={() => setActiveTab('PROTOTYPES')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'PROTOTYPES' ? 'bg-fuchsia-500/10 text-fuchsia-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <FlaskConical size={12} /> {copy.TABS.PROTOTYPES}
            </button>
            <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'ALL' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <LayoutGrid size={12} /> {copy.TABS.ALL}
            </button>
          </div>

          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input 
              type="text" 
              placeholder={copy.SEARCH_PLACEHOLDER} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-medium placeholder:text-zinc-600 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 pt-2">
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-44 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
              <option value="ALL">{copy.FILTERS.CATEGORY}</option>
              {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
              <option value="ALL">{copy.FILTERS.PLAN}</option>
              {availablePlans.map(plan => <option key={plan} value={plan}>{plan.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
              <option value="ALL">{copy.FILTERS.STATUS}</option>
              {availableStatuses.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* THE DATA GRID */}
      <div className="bg-stardust border border-zinc-800/80 rounded-xl shadow-xl p-4 sm:p-6">
        <div className="overflow-x-auto rounded-lg border border-zinc-800/50 bg-zinc-950/50">
          {processedData.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{copy.TABLE.EMPTY}</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap select-none">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <th className="px-6 py-4 cursor-pointer hover:bg-zinc-800/50" onClick={() => requestSort('business_name')}>
                    <div className="flex items-center gap-2">{copy.TABLE.BUSINESS} {getSortIcon('business_name')}</div>
                  </th>
                  <th className="px-6 py-4 hidden md:table-cell cursor-pointer hover:bg-zinc-800/50" onClick={() => requestSort('category')}>
                    <div className="flex items-center gap-2">{copy.TABLE.CATEGORY} {getSortIcon('category')}</div>
                  </th>
                  <th className="px-6 py-4 hidden lg:table-cell cursor-pointer hover:bg-zinc-800/50" onClick={() => requestSort('plan_tier')}>
                    <div className="flex items-center gap-2">{copy.TABLE.PLAN} {getSortIcon('plan_tier')}</div>
                  </th>
                  <th className="px-6 py-4 hidden sm:table-cell cursor-pointer hover:bg-zinc-800/50" onClick={() => requestSort('status')}>
                    <div className="flex items-center gap-2">{copy.TABLE.STATUS} {getSortIcon('status')}</div>
                  </th>
                  <th className="px-6 py-4 hidden xl:table-cell cursor-pointer hover:bg-zinc-800/50" onClick={() => requestSort('created_at')}>
                    <div className="flex items-center gap-2">{copy.TABLE.TIMELINE} {getSortIcon('created_at')}</div>
                  </th>
                  <th className="px-6 py-4 text-right">{copy.TABLE.ACTIONS}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {processedData.map(renderTableRow)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}