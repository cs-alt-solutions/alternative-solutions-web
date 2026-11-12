/* src/components/dashboard/storefronts/manager/StorefrontFilters.tsx */
import React from 'react';
import { Search, Users, FlaskConical, LayoutGrid, Filter } from 'lucide-react';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  activeTab: 'ALL' | 'CLIENTS' | 'PROTOTYPES';
  setActiveTab: (val: 'ALL' | 'CLIENTS' | 'PROTOTYPES') => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  planFilter: string;
  setPlanFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  masterIndustries: { id: string; label: string }[];
  availablePlans: string[];
  availableStatuses: string[];
}

export default function StorefrontFilters({
  search, setSearch, activeTab, setActiveTab,
  categoryFilter, setCategoryFilter,
  planFilter, setPlanFilter,
  statusFilter, setStatusFilter,
  masterIndustries, availablePlans, availableStatuses
}: FiltersProps) {
  const copy = STOREFRONT_MANAGER_COPY.FILTERS;

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button type="button" onClick={() => setActiveTab('CLIENTS')} className={`px-2.5 sm:px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'CLIENTS' ? 'bg-cyan-500/10 text-cyan-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><Users size={12} className="shrink-0" /> <span className="truncate">{copy.TAB_CLIENTS}</span></button>
          <button type="button" onClick={() => setActiveTab('PROTOTYPES')} className={`px-2.5 sm:px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'PROTOTYPES' ? 'bg-fuchsia-500/10 text-fuchsia-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><FlaskConical size={12} className="shrink-0" /> <span className="truncate">{copy.TAB_PROTOTYPES}</span></button>
          <button type="button" onClick={() => setActiveTab('ALL')} className={`px-2.5 sm:px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'ALL' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutGrid size={12} className="shrink-0" /> <span className="truncate">{copy.TAB_ALL}</span></button>
        </div>

        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input type="text" placeholder={copy.SEARCH_PLACEHOLDER} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-medium placeholder:text-zinc-600 outline-none transition-all shadow-inner" />
        </div>
      </div>

      {/* Responsive Filter Grid: Categories full-width on mobile so it never clips */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-start lg:justify-end gap-2.5 pt-1">
        <div className={`relative ${activeTab === 'PROTOTYPES' ? 'col-span-1' : 'col-span-2'} sm:flex-none`}>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-52 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer truncate">
            <option value="ALL">{copy.ALL_CATEGORIES}</option>
            {masterIndustries.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
          </select>
        </div>

        <div className="relative col-span-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer truncate">
            <option value="ALL">{copy.ALL_PLANS}</option>
            {availablePlans.map(plan => <option key={plan} value={plan}>{plan.replace('_', ' ')}</option>)}
          </select>
        </div>

        {activeTab !== 'PROTOTYPES' && (
          <div className="relative col-span-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer truncate">
              <option value="ALL">{copy.ALL_STATUSES}</option>
              {availableStatuses.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}